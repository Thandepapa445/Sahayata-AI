import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root endpoint returns welcome payload and docs link."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "SAHAYATA AI" in data["message"]
    assert data["health"] == "/api/health"


def test_health_endpoint():
    """Verify healthcheck endpoint reports healthy status and application metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "SAHAYATA AI"
    assert "uptime_seconds" in data
    assert "device" in data


def test_websocket_ping_endpoint():
    """Verify WebSocket /ws/ping endpoint establishes connection, echoes ping, and responds with server status."""
    with client.websocket_connect("/ws/ping") as websocket:
        test_payload = {"timestamp": 1726530000000}
        websocket.send_json(test_payload)
        response = websocket.receive_json()
        assert response["type"] == "pong"
        assert response["client_timestamp"] == 1726530000000
        assert response["server_status"] == "connected"

