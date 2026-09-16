# 02 — Team Workflow, Roles & Infrastructure Guidelines

## 1. Team Ownership Matrix

| Domain | Primary Owner | Secondary / Reviewer | Deliverables |
| :--- | :--- | :--- | :--- |
| **System Architecture** | Kanishk Bhatt | Teammate | High-level design, API contracts, WebSocket protocols |
| **Frontend UI/UX** | Kanishk Bhatt | Teammate | React + Vite app, accessible components, WCAG AAA styling |
| **Backend Engineering** | Kanishk Bhatt | Teammate | FastAPI server, WebSocket manager, service wrappers |
| **ISL Dataset & Licensing** | Teammate | Kanishk Bhatt | Dataset curation, license audit, train/val/test splits |
| **Feature & Landmark Engineering** | Teammate | Kanishk Bhatt | MediaPipe landmark extractors, spatial normalization |
| **Model Training & Experiments** | Teammate | Kanishk Bhatt | 1D-CNN / Bi-GRU models, training scripts, DGX runs |
| **Evaluation & Metrics** | Teammate | Kanishk Bhatt | Accuracy, F1, confusion matrices, latency benchmarks |
| **Integration & Deployment** | Kanishk Bhatt | Teammate | Connecting frontend to AI services, containerization |

---

## 2. Git Branching & Collaboration Strategy

We follow a clean, trunk-based Git feature workflow:

```text
main (Production / Stable MVP Demos Only)
  ▲
  │ Pull Request (Review & Tests Pass)
dev (Active Integration Branch)
  ▲
  ├── feature/frontend-accessible-ui   (Kanishk)
  ├── feature/backend-websocket-stream (Kanishk)
  ├── feature/ml-landmark-pipeline     (Teammate)
  └── feature/ml-model-training        (Teammate)
```

### Branch Rules
* `main`: Always kept green and deployable. Direct commits are disallowed.
* `dev`: Staging ground where frontend and ML modules integrate.
* Feature branches: Named `feature/<component>-<short-description>`.
* Bugfix branches: Named `fix/<issue-description>`.

### Commit Message Convention
Use semantic prefixes:
* `feat:` A new feature (e.g., `feat(ml): add landmark wrist normalization`)
* `fix:` A bug fix (e.g., `fix(backend): resolve websocket disconnect timeout`)
* `docs:` Documentation updates (e.g., `docs: update system architecture diagram`)
* `test:` Adding or updating tests (e.g., `test(backend): add health endpoint test`)
* `chore:` Build scripts, configs, or package updates

---

## 3. Compute Infrastructure Protocol: Laptop vs. Campus DGX A100

### Golden Rule: Stateless Compute
**Never store master copies of your code solely on the DGX A100 server.** Treat the DGX strictly as a high-powered ephemeral compute node.

```text
[Local Laptop (RTX 3050)]                          [Campus DGX A100]
• Code editing & debugging                         • Large-scale landmark extraction
• Pipeline smoke testing (5 samples)  ─────────►   • Batch model training & grid searches
• Frontend / Backend development      (Push Code/  • Multi-seed evaluation runs
• Real-time webcam inference demo      pull weights)• Model export (.pth / .onnx)
```

### Execution Protocol Before DGX Runs
1. **Local Smoke Test First:** Always verify any training script on your local machine with a miniature dummy dataset (e.g., 5 samples, 1 epoch) to confirm shapes and loss reduction before launching on the DGX.
2. **Never Commit Data to Git:** Datasets must be downloaded directly on the DGX or synced via secure scp/rsync, never pushed through GitHub.
3. **Model Weight Handoff:** Once training converges on the DGX, only transfer the lightweight final weights (`.pth` or `.onnx`, typically 5–20 MB) back to your local `models/` directory.
