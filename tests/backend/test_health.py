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
