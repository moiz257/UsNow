from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "UsNow API"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/usnow"
    SECRET_KEY: str = "your-secret-key"  # Default fallback
    
    # SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
