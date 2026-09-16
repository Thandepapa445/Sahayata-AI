# Data Directory

This directory stores local dataset samples, recorded video clips, and landmark array files.

> [!CAUTION]
> All raw videos (`*.mp4`, `*.avi`) and preprocessed feature arrays (`*.npy`, `*.npz`) are strictly ignored by `.gitignore` and must **never** be committed to GitHub.

## Subdirectory Structure:
* `data/raw/`: Original video recordings or downloaded ISL dataset clips.
* `data/processed/`: Extracted coordinate sequences formatted for training.
* `data/landmarks/`: Cached MediaPipe landmark arrays (`(30, 150)` `.npy` files).
