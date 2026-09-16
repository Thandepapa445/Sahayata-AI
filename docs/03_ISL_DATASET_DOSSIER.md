# 03 — Indian Sign Language (ISL) Dataset Dossier & Vocabulary Plan

## 1. Public ISL Dataset Survey & Licensing Analysis

| Dataset Name | Source / Authors | Size / Scope | Authoritative License & Terms | Suitability & Use Guidelines |
| :--- | :--- | :--- | :--- | :--- |
| **INCLUDE** | Sridhar et al. (IIT Madras / AI4Bharat, ACM MM 2020) | 4,287 videos across 263 isolated word signs | **CC BY 4.0** (Zenodo DOI: [10.5281/zenodo.4010759](https://zenodo.org/records/4010759)) / **MIT** (Code on [GitHub: AI4Bharat/INCLUDE](https://github.com/AI4Bharat/INCLUDE)) | **High:** Primary academic benchmark for isolated ISL words. Requires academic attribution to Sridhar et al. (2020). Note: Third-party mirrors (e.g. Kaggle) list CC BY-SA 4.0 terms. |
| **ISL-CSLTR** | Dr. R. Elakkiya & Dr. B. Natarajan | 700 sentence videos, 1,036 word-level images | **CC BY 4.0** (Mendeley Data DOI: [10.17632/k32mp4k7s7.1](https://data.mendeley.com/datasets/k32mp4k7s7/1)) | **Medium:** Useful secondary reference for word and sentence gesture kinematics. Requires attribution to Elakkiya & Natarajan (2021). |
| **Custom Recorded Benchmark** | Team SAHAYATA AI (Local Protocol) | Targeted sequence recordings via MediaPipe | **Terms Pending Formalization:** Ownership, participant consent, biometric privacy, and redistribution policies must be formally documented prior to any public release. | **High:** Tailored for webcam alignment and home lighting conditions. Raw video recordings must remain local-only to protect participant privacy. |

---

## 2. Provisional Controlled Vocabulary Proposal (16 Signs)

> [!NOTE]
> **Provisional Design Proposal:**
> The following 16-sign vocabulary represents an initial working hypothesis based on communicative utility. The actual availability, sample frequency, annotation quality, and signer diversity for these specific tokens in the INCLUDE dataset (or requirements for supplementary self-recording) must be audited and verified during Phase 2 before freezing the class dictionary.

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

## 3. Data Leakage Prevention & Split Strategy (Design Protocol)

> [!CAUTION]
> **Data Leakage Risk:**
> A frequent failure mode in gesture recognition projects is randomly splitting individual frames or clips from the same signer across train and validation sets. Models then memorize individual signer characteristics (skin tone, attire, background) rather than invariant kinematic trajectory.

### Subject-Independent Splitting Protocol
To ensure genuine generalization to unseen signers:
* **Train Set (approx. 70%):** Distinct subset of signers (e.g. Signers 1 to 5).
* **Validation Set (approx. 15%):** Separate, held-out signer for hyperparameter tuning.
* **Test Set (approx. 15%):** Completely unseen signer reserved strictly for final reporting.

*Note: The exact signer-to-split assignment must be mapped directly to actual metadata IDs once the dataset structure is inspected in Phase 2.*

---

## 4. Provisional Feature Vector Geometry & Tensor Specification

> [!NOTE]
> **Provisional Working Specification:**
> The feature dimensions below are architectural proposals. MediaPipe Holistic landmark extraction vs. separate Hands/Pose pipelines, landmark visibility flags $(x, y, z, v)$, and FPS normalization must be empirically validated in Phase 2.

* **Left Hand (Proposed):** 21 landmarks $\times 3$ $(x, y, z) = 63$ features.
* **Right Hand (Proposed):** 21 landmarks $\times 3$ $(x, y, z) = 63$ features.
* **Upper Body Context (Proposed):** 8 key pose landmarks (Left/Right Shoulders, Elbows, Wrists, Nose) $\times 3 = 24$ features.
* **Total Features per Frame (Proposed):** $63 + 63 + 24 = 150$ float coordinates.
* **Temporal Window (Proposed):** 30 consecutive frames ($1.0$ second at nominal 30 FPS).
* **Target Input Tensor Shape:** `(Batch_Size, 30, 150)`.

