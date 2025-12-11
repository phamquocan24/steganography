import numpy as np
from PIL import Image
import io
import tensorflow as tf
from ..core.config import settings

class ImagePreprocessor:
    @staticmethod
    def preprocess(image_bytes: bytes) -> np.ndarray:
        """
        Preprocess image for model inference.
        CRITICAL: Use PIL to ensure compatibility with standard Training Pipelines.
        
        Steps:
        1. Read Image with PIL (Handles EXIF rotation automatically).
        2. Convert to RGB.
        3. Resize using BILINEAR (Matches Notebook training params).
        4. Convert to float32 [0, 255].
        """
        if isinstance(image_bytes, bytes):
            image = Image.open(io.BytesIO(image_bytes))
        else:
            image = image_bytes
            
        # Ensure RGB (removes Alpha channel if PNG)
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize using BILINEAR (Standard for most training pipelines)
        target_size = settings.MODEL_INPUT_SHAPE[:2]
        image = image.resize(target_size, Image.BILINEAR)
        
        # Convert to numpy float32 [0, 255]
        img_array = np.array(image, dtype=np.float32)
        
        # Add batch dimension -> (1, 224, 224, 3)
        img_batch = np.expand_dims(img_array, axis=0)
        
        return img_batch
