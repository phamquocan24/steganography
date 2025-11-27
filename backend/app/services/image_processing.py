import numpy as np
from PIL import Image
import io
from ..core.config import settings

class ImagePreprocessor:
    @staticmethod
    def preprocess(image_bytes: bytes) -> np.ndarray:
        """
        Preprocess image bytes for model inference.
        Model expects RGB images in [0, 255] range.
        SRM filtering is built into the model architecture.
        """
        # Read image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize
        image = image.resize(settings.MODEL_INPUT_SHAPE)
        img_array = np.array(image)
        
        # Model expects [0, 255] float32 input
        # Do NOT divide by 255.0 as the model was trained on [0, 255]
        img_float = img_array.astype(np.float32)
        
        # Add batch dimension
        img_batch = np.expand_dims(img_float, axis=0)
        
        return img_batch
