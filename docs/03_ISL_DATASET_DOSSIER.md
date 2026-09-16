# 03 — Indian Sign Language (ISL) Dataset Dossier & Vocabulary Plan

## 1. Public ISL Dataset Survey

| Dataset Name | Source / Institution | Size / Scope | License / Permissibility | Suitability for SAHAYATA AI |
| :--- | :--- | :--- | :--- | :--- |
| **INCLUDE** | IIT Madras (ACM MM 2020) | 4,287 videos across 263 isolated word signs | Academic / Research Use | **High:** Standard academic benchmark for ISL words. High video quality and consistent signer positioning. |
| **ISL-CSLTR** | Central University of Punjab | Isolated words & continuous sentences | Research Use | **Medium:** Useful for cross-testing, but larger video format requires extra filtering. |
| **Custom Recorded Benchmark** | Team SAHAYATA AI (Local Protocol) | 30-frame sequence recordings via MediaPipe | MIT (Project Internal) | **High:** Provides guaranteed real-time webcam alignment and direct testing under varied home lighting conditions. |

---

## 2. Initial Controlled Vocabulary (16 Signs)

Rather than fingerspelling the alphabet (which is trivial and rarely used in real-world ISL communication), we curate **16 high-utility isolated signs** split into three practical categories:

### A. Daily Needs & Requests
1. **Water** (पानी) — Single/two-hand motion near chin/mouth.
2. **Food / Eat** (खाना) — Hand cupped moving to mouth.
3. **Washroom** (शौचालय) — Distinct hand gesture indicating restroom.
4. **Medicine** (दवा) — Palm open with circular finger friction.
5. **Sleep** (सोना) — Hands folded alongside tilted head.

### B. Social Interaction & Politeness
6. **Namaste / Hello** (नमस्ते) — Palms pressed together at chest level.
7. **Thank You** (धन्यवाद) — Hand flat at chin moving forward/downward.
8. **Please** (कृपया) — Open palm rubbed gently on chest.
9. **Yes** (हाँ) — Nodding fist gesture.
10. **No** (नहीं) — Side-to-side palm/finger negation.

### C. Assistance & Health
11. **Help** (सहायता / मदद) — Flat palm supporting closed fist with thumb up.
12. **Pain** (दर्द) — Hand gesturing toward area with grimace context.
13. **Doctor** (चिकित्सक / डॉक्टर) — Fingers tapping wrist pulse.
14. **Hospital** (अस्पताल) — Cross handshape or building indicator.
15. **Stop** (रुकिए) — Vertical palm facing forward with firm cessation.
16. **Family** (परिवार) — Circular hand grouping motion.

---

## 3. Data Leakage Prevention & Split Strategy

> [!CAUTION]
> **Data Leakage Risk:**
> A major mistake in student vision projects is randomly splitting frames or random video clips from the same signer across train and test sets. The model ends up memorizing the individual's shirt color, skin tone, or background rather than the geometric sign motion!

### Our Subject-Independent Splitting Rule
* **Train Set (70%):** Signers A, B, and C.
* **Validation Set (15%):** Signer D (Unseen individual during training).
* **Test Set (15%):** Signer E (Completely unseen individual reserved for final evaluation).

This guarantees that reported test set accuracy reflects genuine gesture generalization rather than memorized signer appearance.

---

## 4. Feature Vector Geometry
* **Left Hand:** 21 landmarks $\times 3$ $(x, y, z) = 63$ features.
* **Right Hand:** 21 landmarks $\times 3$ $(x, y, z) = 63$ features.
* **Upper Body Context:** 8 key pose landmarks (Left/Right Shoulders, Elbows, Wrists, Nose) $\times 3 = 24$ features.
* **Total Features per Frame:** $63 + 63 + 24 = 150$ float coordinates.
* **Temporal Window:** 30 consecutive frames ($1.0$ second at 30 FPS).
* **Input Tensor Shape:** `(Batch_Size, 30, 150)`.
