# 04 — Architectural Decisions & Technical Trade-offs Log

This document records the architectural and engineering decisions made during the development of SAHAYATA AI, providing context and rationale for technical interviews.

---

## Decision 1: Indian Sign Language (ISL) over American Sign Language (ASL)
* **Date:** September 2026
* **Status:** Approved
* **Context:** Most existing open-source tutorials default to ASL fingerspelling (A-Z).
* **Rationale:** 
  1. Our core target audience is the Indian assistive community.
  2. ISL is predominantly **two-handed**, requiring both left and right hand tracking along with upper-body spatial referencing, which presents a more authentic and rigorous engineering challenge.
* **Trade-off:** Fewer pre-cleaned datasets exist compared to ASL, requiring stricter data auditing and validation pipelines.

---

## Decision 2: FastAPI + React/Vite over Monolithic Streamlit
* **Date:** September 2026
* **Status:** Approved
* **Context:** Streamlit was evaluated for rapid prototyping.
* **Rationale:**
  1. Streamlit’s rerun lifecycle causes major bottlenecks for live 30 FPS webcam video and real-time audio streams.
  2. A decoupled React + FastAPI architecture enables asynchronous WebSockets, client-side accessibility optimization, independent deployment, and demonstrates full-stack software engineering proficiency.
* **Trade-off:** Requires maintaining two separate development runtimes (Node.js and Python) instead of a single script.

---

## Decision 3: Landmark-Based Features vs. End-to-End 3D-CNNs
* **Date:** September 2026
* **Status:** Approved (Architecture Direction)
* **Context:** How to extract spatio-temporal features from video streams.
* **Rationale:**
  1. Target Latency: MediaPipe local landmark extraction is targeted to run at sub-30 ms per frame on CPU (to be profiled empirically in Phase 2).
  2. Invariance: Geometric coordinates isolate hand joint angles from skin tone, room illumination, and complex background textures.
  3. Footprint Projection: Landmark sequence classifiers typically yield small checkpoint binaries (< 10 MB) compared to heavy 3D-ResNet/I3D architectures (> 150 MB), facilitating rapid client-side or low-resource CPU execution.
* **Trade-off:** High dependency on MediaPipe joint reliability; severe hand occlusions or extreme camera angles require filtering or confidence fallback.

---

## Decision 4: Tiered Compute (RTX 3050 Local vs. Campus DGX A100)
* **Date:** September 2026
* **Status:** Approved
* **Context:** Managing limited hardware resources and college compute access policies.
* **Rationale:**
  1. Local laptops (RTX 3050 4GB) are used for day-to-day coding, rapid smoke testing (small batch, 1 epoch), and live inference demo.
  2. Campus DGX A100 is used exclusively as a stateless compute accelerator for large-scale landmark batch extraction, grid hyperparameter searches, and final multi-seed model convergence.
* **Trade-off:** Requires maintaining reproducible training scripts that accept identical CLI arguments across both local and cluster environments.

---

## Decision 5: Object Detector Licensing Consideration (YOLOv8 AGPL-3.0)
* **Date:** September 2026
* **Status:** Unresolved / Pending Evaluation in Vision Phase
* **Context:** The initial vision assistant blueprint references YOLOv8 for object awareness.
* **Rationale & IP Analysis:**
  1. Ultralytics YOLOv8 is distributed under the **GNU AGPL-3.0** copyleft license. 
  2. Our repository source code is licensed under the permissive **MIT License**. Under AGPL-3.0, incorporating or linking Ultralytics packages into a network-delivered application imposes reciprocal AGPL-3.0 licensing obligations on the entire application.
* **Next Steps for Vision Phase:**
  Before implementing the Vision module, the team will evaluate:
  - Switching to an Apache-2.0 / MIT alternative object detector (e.g. MobileNet-SSD v2, or ONNX-based detectors with permissive weights).
  - Or isolating the detector service behind an independent container boundary if permitted under compliance review.
  *No final detector or license change is selected at this stage.*
