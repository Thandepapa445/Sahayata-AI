# 01 — System Architecture & Component Design

## Overview
SAHAYATA AI is built upon a modular, decoupled architecture where presentation, API routing, and AI inference engines are isolated from one another. This ensures each subsystem can be developed, optimized, and benchmarked independently.

---

## High-Level Architecture

```text
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   React 18 + Vite + TypeScript (WCAG 2.1 AAA Accessibility Guidelines)  |
|                                                                         |
|   [Sign Mode]             [Conversation Mode]        [Vision Assistant]  |
|   Webcam Video            Microphone Audio           Camera Snapshot    |
|   MediaPipe JS (opt)      Web Speech API / Audio     Canvas Capture     |
+------------------------------------+------------------------------------+
                                     │ WebSocket (Landmarks / Telemetry)
                                     │ HTTP (REST Endpoints)
                                     ▼
+-------------------------------------------------------------------------+
|                              BACKEND LAYER                              |
|                       FastAPI Asynchronous Gateway                      |
|                                                                         |
|   ├── CORS & Authentication Middleware                                  |
|   ├── WebSocket Stream Manager (/ws/stream)                             |
|   ├── Health & Telemetry Reporting (/api/health)                        |
|   └── Accessibility & State Orchestration Engine                        |
+------------------------------------+------------------------------------+
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
+-------------------------+ +-----------------+ +-------------------------+
|     ISL INFERENCE       | |   SPEECH & TTS  | |      VISION ENGINE      |
|                         | |                 | |                         |
| • 150 Landmark Vector   | | • Faster-       | | • EasyOCR Text Reader   |
| • Sliding Buffer (T=30) | |   Whisper STT   | | • YOLOv8-nano Detector  |
| • Wrist Centering &     | | • Local TTS     | | • Relative Spatial      |
|   Scale Normalization   | |   (pyttsx3/Web) | |   Coordinate Mapper     |
| • Bi-GRU / 1D-CNN Model | | • Real-time     | | • Voice Description     |
| • Debounce & Confidence | |   Transcript    | |   Synthesizer           |
+-------------------------+ +-----------------+ +-------------------------+
```

---

## Data Flow Specifications

### 1. Indian Sign Language (ISL) Pipeline (Provisional Design Specification)
1. **Video Ingestion:** Browser captures webcam video at a nominal target of 30 FPS.
2. **Landmark Extraction:** MediaPipe Holistic/Hands proposed to extract 21 coordinates for Left Hand, 21 for Right Hand, and key upper-body landmarks (shoulders, elbows).
3. **Feature Normalization:**
   * Hand coordinates re-centered with the wrist set as origin $(0, 0, 0)$.
   * Scaled by palm distance (wrist to middle MCP joint).
4. **Temporal Buffer:** A proposed FIFO queue holding 30 frames (representing ~1.0 second of gesture dynamics).
5. **Model Inference:** Provisional sequence tensor of shape `(1, 30, 150)` passed through the trained temporal model (dimensions and visibility channels to be empirically validated).
6. **State Machine & Debounce:**
   * Target threshold: Candidate prediction proposed to exceed confidence threshold ($\ge 0.80$).
   * Persistence buffer: Proposed $K=10$ consecutive frames to mitigate transient jitter.
   * Emitted to sentence builder $\rightarrow$ spoken via TTS.

### 2. Conversational Pipeline
1. **Audio Ingestion:** Microphone stream captured via browser or backend stream.
2. **STT:** Converted to text via Web Speech API (low-latency primary) or Faster-Whisper (high-accuracy local fallback).
3. **Display:** Real-time, high-contrast, scalable visual transcript presented to the deaf or hard-of-hearing participant.
4. **TTS Response:** Hearing participant receives audio output when the user types or selects assistive quick responses.

### 3. Vision & Environment Pipeline
1. **Snapshot Trigger:** User activates snapshot trigger (avoids continuous GPU power drain).
2. **Dual Inference:**
   * Text extraction: Runs EasyOCR/PaddleOCR on cropped regions of interest.
   * Object awareness: Runs YOLOv8-nano to detect obstacles, doors, chairs, and persons.
3. **Spatial Synthesis:** Detections are mapped to directional zones (*Left*, *Center*, *Right*) $\rightarrow$ generated audio summary.

---

## Telemetry & Benchmarking Layer
Every inference request records:
* Pipeline latency in milliseconds ($T_{\text{preprocess}} + T_{\text{inference}} + T_{\text{postprocess}}$).
* Live frames-per-second (FPS).
* Real-time confidence score and classification entropy.
