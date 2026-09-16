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
* **Status:** Approved
* **Context:** How to extract spatio-temporal features from video streams.
* **Rationale:**
  1. MediaPipe extracts 3D geometric joints locally with $< 15$ ms latency.
  2. Landmark vectors are invariant to skin tone, room lighting, and camera backgrounds.
  3. Model size shrinks from $> 200$ MB (raw video CNN) to $< 10$ MB (landmark sequence model), enabling high-frame-rate CPU inference on consumer laptops.
* **Trade-off:** High reliance on MediaPipe landmark accuracy; if hands are severely occluded, landmark estimation degrades.

---

## Decision 4: Tiered Compute (RTX 3050 Local vs. Campus DGX A100)
* **Date:** September 2026
* **Status:** Approved
* **Context:** Managing limited hardware resources and college compute access policies.
* **Rationale:**
  1. Local laptops (RTX 3050 4GB) are used for day-to-day coding, rapid smoke testing (small batch, 1 epoch), and live inference demo.
  2. Campus DGX A100 is used exclusively as a stateless compute accelerator for large-scale landmark batch extraction, grid hyperparameter searches, and final multi-seed model convergence.
* **Trade-off:** Requires maintaining reproducible training scripts that accept identical CLI arguments across both local and cluster environments.
