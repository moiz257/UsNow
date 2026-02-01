from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class ResendVerification(BaseModel):
    email: EmailStr

class UserVerify(BaseModel):
    email: EmailStr
    code: str

class UserSchema(UserBase):
    id: str
    is_active: bool
    class Config:
        from_attributes = True

class CompanySchema(BaseModel):
    id: str
    name: str
    logo_url: Optional[str]
    class Config:
        from_attributes = True

class SessionRequest(BaseModel):
    company_id: str
    fields: List[str]

class SessionSchema(BaseModel):
    company_name: str
    company_logo: Optional[str]
    fields: List[str]
    status: str
    class Config:
        from_attributes = True

class UpdateConfirm(BaseModel):
    data: Dict[str, str]

class UpdateVerifyOTP(BaseModel):
    code: str

class ConsentLogSchema(BaseModel):
    id: str
    company_name: str
    shared_data: Dict[str, str]
    timestamp: datetime
    class Config:
        from_attributes = True
