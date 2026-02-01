from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from .base import Base
import datetime

import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    phone_number = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)

class Company(Base):
    __tablename__ = "companies"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True)
    api_key = Column(String, unique=True)
    logo_url = Column(String, nullable=True)
    webhook_url = Column(String, nullable=True)  # Company's callback endpoint

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    token = Column(String, unique=True, index=True)
    company_id = Column(String, ForeignKey("companies.id"))
    requested_fields = Column(JSON)
    pending_data = Column(JSON, nullable=True)
    completed_data = Column(JSON, nullable=True)  # Final data sent to company
    otp_code = Column(String, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ConsentLog(Base):
    __tablename__ = "consent_logs"
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    company_id = Column(String, ForeignKey("companies.id"))
    shared_data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
