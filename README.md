# SAHAYATA AI (सहायता AI) — Multimodal AI Accessibility Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React + Vite](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![MediaPipe](https://img.shields.io/badge/Landmarks-MediaPipe-orange.svg)](https://developers.google.com/mediapipe)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch-EE4C2C.svg)](https://pytorch.org/)

**SAHAYATA AI (सहायता AI)** is an assistive technology platform designed to bridge communication barriers for individuals with hearing, speech, and visual disabilities in India.

By uniting real-time computer vision, Indian Sign Language (ISL) recognition, two-way speech processing, and visual OCR/scene assistance into an accessible, low-latency interface, the project empowers users to interact independently in daily conversations.

---

## 🌟 Core Modules

1. **Indian Sign Language (ISL) Assistant**
   * Real-time webcam capture $\rightarrow$ MediaPipe landmark extraction (hands + pose context).
   * Landmark normalization (wrist-origin centering, scale invariance).
   * Temporal sequence classification (sliding window over 30 frames) for a controlled vocabulary of 16 high-utility ISL signs.
   * Debouncing state machine and prediction smoothing $\rightarrow$ synthesized speech output (TTS).

2. **Two-Way Conversational Interface**
   * Accessible communication bridge between hearing and deaf/speech-impaired individuals.
   * Speech-to-Text (STT) for incoming vocal speech with large, high-contrast, dyslexia-friendly transcripts.
   * Text-to-Speech (TTS) with quick-response assistive phrase triggers.

3. **Vision & Environment Assistant**
   * On-demand OCR for signs, medicine packaging, notices, and documents.
   * Lightweight object detection (YOLOv8-nano) with contextual spatial cues (*"Obstacle on your left"*).
   * Audio readout of recognized content.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Frontend: React + Vite + TS             │
│   (Accessible UI: High Contrast, Audio Feedback, WAI-ARIA) │
└────────────────────────┬───────────────────────────────┘
                         │ WebSocket (Landmarks / Telemetry)
                         │ HTTP REST (Auth / Health / Config)
                         ▼
┌────────────────────────────────────────────────────────┐
│                 Backend: FastAPI Server                │
│    ├── CORS & Route Management                         │
│    ├── WebSocket Stream Handler                        │
│    └── Accessibility & Conversation Engine             │
└──────┬──────────────────┬──────────────────┬───────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  ISL Module  │   │ Speech Mode  │   │ Vision Mode  │
│  MediaPipe   │   │ Faster-      │   │ EasyOCR /    │
│  Landmarks + │   │ Whisper STT  │   │ YOLOv8       │
│  Bi-GRU/1DCNN│   │ + Local TTS  │   │ Spatial Cues │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## 👥 Two-Person Team Division & Ownership

| Team Member | Role | Core Responsibilities |
| :--- | :--- | :--- |
| **Kanishk Bhatt** ([@Thandepapa445](https://github.com/Thandepapa445)) | **Lead System Architect & Full-Stack Lead** | • System architecture & API design<br>• FastAPI backend & WebSocket streaming<br>• React / Vite frontend & accessible UI/UX<br>• Integration, deployment & documentation |
| **Teammate** | **Machine Learning & Research Lead** | • ISL dataset acquisition, licensing & audit<br>• MediaPipe landmark extraction & normalization<br>• Model architecture, training & hyperparameter tuning<br>• Campus DGX A100 training runs & evaluation metrics |

*Both team members maintain deep cross-functional knowledge of the complete system architecture, data contracts, and design trade-offs for interview readiness.*

---

## 💻 Compute Infrastructure Strategy

* **Local Development (Laptops / RTX 3050 4GB):** Used for coding, debugging, landmark pipeline verification, backend/frontend development, and small-batch baseline inference.
* **Campus High-Performance Compute (NVIDIA DGX A100):** Used during campus lab sessions for heavy dataset preprocessing, full-scale training runs, model architecture comparisons (1D-CNN vs. Bi-GRU vs. Transformer), and hyperparameter searches.
* **Stateless Compute Principle:** Datasets and large weight checkpoints are managed locally or in designated lab scratch storage; **no large datasets, binary checkpoints, or college credentials are committed to Git.**

---

## 📂 Repository Layout

```text
Sahayata-AI/
├── .gitignore                  # Safeguards datasets, weights, virtualenvs, secrets
├── .env.example                # Configuration template
├── LICENSE                     # MIT License
├── README.md                   # Project overview & documentation index
├── docs/                       # Architectural specs, team workflow, ISL dossier
│   ├── 01_SYSTEM_ARCHITECTURE.md
│   ├── 02_TEAM_WORKFLOW_AND_ROLES.md
│   ├── 03_ISL_DATASET_DOSSIER.md
│   └── 04_DECISIONS_LOG.md
├── backend/                    # FastAPI service
│   ├── app/
│   │   ├── main.py             # FastAPI entrypoint, CORS, WebSocket ping
│   │   ├── config.py           # Configuration management
│   │   └── routers/            # API endpoints
│   ├── requirements.txt
│   └── README.md
├── frontend/                   # React + Vite + TypeScript interface
│   ├── src/                    # Components, state, and services
│   ├── package.json
│   └── vite.config.ts
├── ml/                         # Machine learning pipelines & experiments
│   ├── scripts/                # Data collection, preprocessing, training
│   ├── src/                    # Shared ML modules (landmarks, models, metrics)
│   ├── requirements-ml.txt
│   └── README.md
├── models/                     # Checkpoints folder (weights gitignored)
│   └── README.md
├── data/                       # Local dataset directory (all data gitignored)
│   └── README.md
└── tests/                      # Automated test suite
    ├── backend/
    └── ml/
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Configure Environment
```bash
git clone https://github.com/Thandepapa445/Sahayata-AI.git
cd Sahayata-AI
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Verify backend health: `http://localhost:8000/api/health`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Access frontend UI: `http://localhost:5173`*

---

## 🔒 Ethics, Privacy & Safety Disclaimers

* **Assistive Technology Prototype:** SAHAYATA AI is developed as an educational, assistive technology prototype. It is **not** a certified medical device and must not be used for life-critical emergency communication or medical navigation.
* **Privacy-First Processing:** Camera and microphone streams are processed locally or in memory; no user imagery or speech recordings are stored silently.
