"""Application configuration settings."""
import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self) -> None:
        self.better_auth_secret: str = os.getenv("BETTER_AUTH_SECRET", "")
        self.database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
        self.algorithm: str = "HS256"
        self.access_token_expire_days: int = 7

        # Validate BETTER_AUTH_SECRET (must be 32+ characters)
        if len(self.better_auth_secret) < 32:
            raise ValueError(
                "BETTER_AUTH_SECRET must be at least 32 characters. "
                "Generate with: openssl rand -base64 32"
            )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
