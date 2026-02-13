"""Database connection module for Neon PostgreSQL."""
from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.config import settings

# Create engine with connection pooling for serverless environment
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Disable SQL logging in production
    pool_pre_ping=True,  # Check connections before use (serverless resilience)
    pool_size=5,
    max_overflow=10,
)


def init_db() -> None:
    """Create all tables. Safe to call multiple times."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Provide a database session for request handling."""
    with Session(engine) as session:
        yield session
