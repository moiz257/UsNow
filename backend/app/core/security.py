from cryptography.fernet import Fernet
import os
from app.config import settings

# This key should be in .env in a real app. 
# For MVP, we use a fixed key to ensure consistency across restarts
# This is a valid Fernet key (32 url-safe base64-encoded bytes)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "Lr4oIreWVE1x0rFVEmxx048TrVWlZHj5pk5PLz-kXps=")

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# SECRET_KEY and ALGORITHM should be in settings
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def encrypt_data(data: str) -> str:
    if not data:
        return data
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    if not encrypted_data:
        return encrypted_data
    try:
        return cipher_suite.decrypt(encrypted_data.encode()).decode()
    except Exception:
        return encrypted_data

# --- NEW: Auth Security ---

def verify_password(plain_password, hashed_password):
    if not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
