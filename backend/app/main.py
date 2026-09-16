import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.routers import health

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("sahayata-api")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multimodal AI-Powered Assistive Technology Platform for Accessibility",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)


@app.get("/")
def root():
    """Root metadata endpoint."""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }


@app.websocket("/ws/ping")
async def websocket_ping(websocket: WebSocket):
    """
    Lightweight WebSocket endpoint for real-time connectivity & latency measurement.
    Receives ping payloads from the frontend and echoes back with server timestamp.
    """
    await websocket.accept()
    logger.info("WebSocket client connected to /ws/ping")
    try:
        while True:
            data = await websocket.receive_json()
            # Echo back with server acknowledgment
            await websocket.send_json({
                "type": "pong",
                "client_timestamp": data.get("timestamp"),
                "server_status": "connected",
            })
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected from /ws/ping")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()
