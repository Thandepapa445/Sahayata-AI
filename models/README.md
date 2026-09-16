# Models Directory

This directory stores trained model weight files.

> [!NOTE]
> All binary model weights (`*.pth`, `*.pt`, `*.onnx`, `*.bin`, `*.safetensors`) are strictly ignored by `.gitignore` and must **never** be committed to GitHub.

## Expected Artifacts:
* `isl_classifier.pth`: PyTorch trained weights for the 16-sign ISL model.
* `isl_classifier.onnx`: Exported ONNX model optimized for low-latency CPU inference.
* `yolov8n.pt`: Pretrained lightweight YOLOv8 weights for object detection.

## Downloading / Training Weights:
Weights should be produced via `python ml/scripts/train.py` or downloaded from authorized team release assets.
