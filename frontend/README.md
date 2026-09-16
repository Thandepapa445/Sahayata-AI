# SAHAYATA AI — Frontend

Accessible, real-time user interface built with React 18, Vite, and TypeScript.

## Setup & Running

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Architecture Notes
* Connects to FastAPI backend via HTTP (`/api/health`) and WebSocket (`/ws/ping`).
* Accessibility-first design following WCAG AAA guidelines (high contrast, keyboard focus indicators, non-reliant on color-only cues).
