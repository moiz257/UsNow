from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import models
from app.schemas import schemas
from app.core.security import encrypt_data, decrypt_data, verify_password, create_access_token, decode_access_token, get_password_hash
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
import requests
from app.core.email import generate_verification_code, send_verification_email
from pydantic import BaseModel
import uuid

router = APIRouter()
header_scheme = APIKeyHeader(name="X-UsNow-API-Key")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

class LoginRequest(BaseModel):
    email: str
    password: str

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
         raise HTTPException(status_code=401, detail="Could not validate credentials")
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if not user:
         raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/request-update")
def request_update(payload: schemas.SessionRequest, db: Session = Depends(get_db), api_key: str = Depends(header_scheme)):
    # SECURITY STEP 2: Validate Company API Key
    company = db.query(models.Company).filter(models.Company.id == payload.company_id).first()
    if not company or company.api_key != api_key:
        raise HTTPException(status_code=403, detail="Unauthorized Partner Key")

    token = str(uuid.uuid4())
    new_session = models.Session(
        token=token,
        company_id=payload.company_id,
        requested_fields=payload.fields
    )
    db.add(new_session)
    db.commit()
    return {"update_url": f"http://localhost:3000/update/{token}"}

@router.get("/session/{token}", response_model=schemas.SessionSchema)
def get_session(token: str, db: Session = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    company = db.query(models.Company).filter(models.Company.id == session.company_id).first()
    return {
        "company_name": company.name,
        "company_logo": company.logo_url,
        "fields": session.requested_fields,
        "status": session.status
    }

@router.post("/register")
def register(payload: schemas.UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate real verification code
    verification_code = generate_verification_code()
    
    # Create inactive user with real verification code
    new_user = models.User(
        email=payload.email,
        full_name=encrypt_data(payload.full_name),
        hashed_password=get_password_hash(payload.password),
        is_active=False,
        verification_code=verification_code
    )
    db.add(new_user)
    db.commit()
    
    # Send verification email
    email_sent = send_verification_email(payload.email, verification_code, "registration")
    
    if email_sent:
        return {"message": f"Registration successful. Verification code sent to {payload.email}"}
    else:
        # Fallback to showing code if email fails (for development)
        return {"message": f"Registration successful. Verification code: {verification_code} (Email delivery failed)"}


@router.post("/verify")
def verify(payload: schemas.UserVerify, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or user.verification_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid email or verification code")
    
    user.is_active = True
    user.verification_code = None
    db.commit()
    return {"message": "Account activated successfully"}

@router.post("/resend-verification")
def resend_verification(payload: schemas.ResendVerification, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.is_active:
        return {"message": "Account already verified"}
        
    # Generate new code
    from app.core.email import generate_verification_code, send_verification_email
    new_code = generate_verification_code()
    
    user.verification_code = new_code
    db.commit()
    
    # Send email
    print(f"DEBUG: Resending Verification Code to {payload.email}")
    send_verification_email(payload.email, new_code, "registration")
    
    return {"message": "Verification code sent"}

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account not activated. Please verify first.")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/confirm-update/{token}")
def request_otp_for_update(token: str, payload: schemas.UpdateConfirm, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.Session).filter(models.Session.token == token).first()
    if not session or session.status != "pending":
        raise HTTPException(status_code=400, detail="Invalid or expired session")
    
    # Generate real OTP
    from app.core.email import generate_verification_code, send_verification_email
    otp = generate_verification_code()
    
    session.otp_code = otp
    session.pending_data = payload.data
    db.commit()
    
    # Send OTP email
    print(f"DEBUG: Sending OTP to {current_user.email}")
    email_sent = send_verification_email(current_user.email, otp, "update_otp")
    
    if email_sent:
        return {"message": f"OTP sent to {current_user.email}. Please check your inbox."}
    else:
        # Fallback for development
        return {"message": f"OTP: {otp} (Email delivery failed)"}


@router.post("/verify-update-otp/{token}")
def verify_update_otp(token: str, payload: schemas.UpdateVerifyOTP, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.Session).filter(models.Session.token == token).first()
    if not session or session.status != "pending":
        raise HTTPException(status_code=400, detail="Invalid session")
    
    if session.otp_code != payload.code:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    # 1. Update User Record
    if session.pending_data:
        if "name" in session.pending_data:
            current_user.full_name = encrypt_data(session.pending_data["name"])
        if "email" in session.pending_data:
            current_user.email = session.pending_data["email"]
        if "phone" in session.pending_data:
            current_user.phone_number = encrypt_data(session.pending_data["phone"])

    # 2. Create Audit Log
    new_log = models.ConsentLog(
        user_id=current_user.id, 
        company_id=session.company_id,
        shared_data=session.pending_data
    )
    db.add(new_log)
    
    # 3. Store completed data for company retrieval
    session.completed_data = session.pending_data
    session.status = "completed"
    session.otp_code = None
    session.pending_data = None
    
    db.commit()
    
    # 4. Send webhook notification to company (if configured)
    company = db.query(models.Company).filter(models.Company.id == session.company_id).first()
    if company and company.webhook_url:
        try:
            webhook_payload = {
                "session_token": token,
                "status": "completed",
                "data": session.completed_data,
                "timestamp": session.created_at.isoformat()
            }
            requests.post(company.webhook_url, json=webhook_payload, timeout=5)
        except Exception as e:
            # Log error but don't fail the user's request
            print(f"Webhook failed: {e}")
    
    return {"message": "Identity updated and transmitted successfully", "target_url": "http://localhost:3000/mock-success"}

@router.get("/me", response_model=schemas.UserSchema)
def get_me(current_user: models.User = Depends(get_current_user)):
    # SECURITY STEP 1: Decrypt data for the frontend
    # Note: email is stored in plain text for lookup efficiency
    return {
        "id": current_user.id,
        "full_name": decrypt_data(current_user.full_name),
        "email": current_user.email,
        "phone_number": decrypt_data(current_user.phone_number),
        "is_active": current_user.is_active
    }

@router.get("/audit-logs", response_model=List[schemas.ConsentLogSchema])
def get_audit_logs(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(models.ConsentLog).filter(models.ConsentLog.user_id == current_user.id).order_by(models.ConsentLog.timestamp.desc()).all()
    
    result = []
    for log in logs:
        company = db.query(models.Company).filter(models.Company.id == log.company_id).first()
        result.append({
            "id": log.id,
            "company_name": company.name if company else "Unknown",
            "shared_data": log.shared_data,
            "timestamp": log.timestamp
        })
    return result

@router.get("/session-result/{token}")
def get_session_result(token: str, db: Session = Depends(get_db), api_key: str = Depends(header_scheme)):
    """
    Endpoint for companies to retrieve completed session data.
    Company must provide valid API key.
    """
    session = db.query(models.Session).filter(models.Session.token == token).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Verify company API key
    company = db.query(models.Company).filter(models.Company.id == session.company_id).first()
    if not company or company.api_key != api_key:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    if session.status != "completed":
        return {
            "status": session.status,
            "message": "Update not yet completed by user"
        }
    
    return {
        "status": "completed",
        "data": session.completed_data,
        "timestamp": session.created_at
    }
