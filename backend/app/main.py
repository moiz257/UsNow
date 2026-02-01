from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import endpoints
from app.db.session import SessionLocal
from app.models import models
from app.core.security import get_password_hash, encrypt_data

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(endpoints.router, prefix="/api")

@app.on_event("startup")
def startup_populate():
    db = SessionLocal()
    
    # 1. Check SafeBank
    safebank = db.query(models.Company).filter(models.Company.name == "SafeBank").first()
    if not safebank:
        db.add(models.Company(
            id="safebank-uuid-123456", # Fixed UUID for Demo
            name="SafeBank", 
            api_key="sb_test_67890",
            logo_url="https://ui-avatars.com/api/?name=Safe+Bank&background=0D8ABC&color=fff"
        ))

    # 2. Check UsNow Official
    usnow = db.query(models.Company).filter(models.Company.name == "UsNow Official").first()
    if not usnow:
        db.add(models.Company(
            id="usnow-uuid-789012", # Fixed UUID for Demo
            name="UsNow Official", 
            api_key="un_test_12345",
            logo_url="https://ui-avatars.com/api/?name=Us+Now&background=4F46E5&color=fff"
        ))
        
    # 3. Dummy User removed to support manual registration flow
    
    db.commit()
    db.close()

@app.get("/health")
def health():
    return {"status": "ok"}
