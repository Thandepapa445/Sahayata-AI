# SAHAYATA AI — Backend Service

FastAPI-powered asynchronous backend providing REST endpoints, WebSocket streaming for real-time video/landmark processing, and modular AI inference bridges.

## Running Locally

```bash
# 1. Create and activate a Python virtual environment
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server
uvicorn backend.app.main:app --reload --port 8000
```

## API Documentation
Once running, visit:
* Interactive Swagger UI: `http://localhost:8000/docs`
* ReDoc UI: `http://localhost:8000/redoc`
* Health check: `http://localhost:8000/api/health`
