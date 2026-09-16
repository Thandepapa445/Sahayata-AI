import time
import sys
from fastapi import APIRouter
from backend.app.config import settings

router = APIRouter(prefix="/api", tags=["Health & System"])
_START_TIME = time.time()


@router.get("/health")
def get_health():
    """Health check endpoint providing runtime telemetry and environment status."""
    uptime_seconds = round(time.time() - _START_TIME, 2)
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "device": settings.DEVICE,
        "uptime_seconds": uptime_seconds,
        "python_version": sys.version.split()[0],
    }
