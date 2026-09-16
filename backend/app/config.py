import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable override support."""

    APP_NAME: str = "SAHAYATA AI"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    DEVICE: str = "cpu"
    ISL_MODEL_PATH: str = "models/isl_classifier.pth"
    ISL_CONFIDENCE_THRESHOLD: float = 0.80
    ISL_SEQUENCE_LENGTH: int = 30
    ISL_DEBOUNCE_FRAMES: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
