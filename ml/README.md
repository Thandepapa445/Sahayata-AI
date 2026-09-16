# SAHAYATA AI — Machine Learning Workspace

This workspace is dedicated to dataset analysis, MediaPipe feature engineering, model training, and performance evaluation.

---

## 🎯 Primary Teammate Responsibilities
1. **Dataset Audit:** Download and inspect the chosen ISL dataset (e.g. INCLUDE / custom recordings) ensuring clear subject-independent splits.
2. **Feature Extraction:** Process videos using MediaPipe to generate normalized landmark tensors of shape `(Batch_Size, 30, 150)`.
3. **Model Experiments:** Implement baseline classifier (MLP / 1D-CNN) and sequence model (Bi-GRU).
4. **Campus DGX A100 Training:** Run scaled experiments and hyperparameter optimization on campus cluster.
5. **Model Export:** Save production-ready weights to `models/isl_classifier.pth` and `models/isl_classifier.onnx`.

---

## 📐 Landmark Data Contract & Tensor Shapes

Each sequence represents **1.0 second** of gesture video sampled at **30 FPS**:
* **Temporal Length ($T$):** 30 frames
* **Features per frame ($F$):**
  * Left Hand: 21 landmarks $\times 3$ $(x, y, z) = 63$ values
  * Right Hand: 21 landmarks $\times 3$ $(x, y, z) = 63$ values
  * Upper Body Pose: 8 landmarks $\times 3$ $(x, y, z) = 24$ values
  * **Total:** 150 numerical values per frame
* **Tensor Shape:** `(N, 30, 150)` where $N$ is the number of samples.

### Normalization Mathematics
Before saving sequences, apply:
1. **Translation Invariance:** Set wrist landmark $(x_0, y_0, z_0)$ as origin:
   $$\mathbf{p}_i' = \mathbf{p}_i - \mathbf{p}_{\text{wrist}}$$
2. **Scale Invariance:** Divide by the distance between wrist and middle finger MCP joint:
   $$\mathbf{p}_i'' = \frac{\mathbf{p}_i'}{\|\mathbf{p}_{\text{wrist}} - \mathbf{p}_{\text{middle\_mcp}}\|}$$

---

## 💻 Running on Campus DGX A100 vs. Local RTX 3050

1. **Local RTX 3050 (Smoke Test):**
   ```bash
   python ml/scripts/train.py --epochs 2 --batch-size 4 --device cuda
   ```
2. **Campus DGX A100 (Full Experimentation):**
   ```bash
   python ml/scripts/train.py --epochs 50 --batch-size 64 --device cuda --save-best
   ```
3. Copy only the final `.pth` / `.onnx` weight file back to your local repository `models/` folder. **Never push raw data to Git.**
