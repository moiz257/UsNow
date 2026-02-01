from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# For PostgreSQL, we don't need check_same_thread
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
