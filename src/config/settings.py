"""
Configuration settings for Dubai Cons AI Suite MVP
"""

from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    """Application settings"""
    
    # ProxyAPI Configuration
    proxyapi_key: str
    proxyapi_base_url: str = "https://api.proxyapi.ru"
    
    # OpenAI via ProxyAPI
    openai_base_url: str = "https://api.proxyapi.ru/openai/v1"
    openai_api_key: str
    
    # Gemini Configuration
    google_api_key: Optional[str] = None
    
    # Database
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    
    # JWT Settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Environment
    env: str = "development"
    debug: bool = True
    
    class Config:
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
