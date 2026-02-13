"""Environment configuration for Task Management API."""
from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str = "http://localhost:3000"  # Next.js frontend URL

    @field_validator("BETTER_AUTH_SECRET")
    @classmethod
    def validate_secret(cls, v: str) -> str:
        """Ensure secret is at least 32 characters (Constitution II)."""
        if len(v) < 32:
            raise ValueError("BETTER_AUTH_SECRET must be at least 32 characters")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
