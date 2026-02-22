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
        MATCHES TRAINING PIPELINE EXACTLY.
        
        Training notebook _parse_image_function (Step 6):
        1. tf.io.decode_image(channels=3)
        2. tf.cast(tf.float32)           -> Keep [0, 255]
        3. image.set_shape([None,None,3])
        4. tf.image.resize(image, (224, 224))  <- BILINEAR RESIZE, NOT crop_or_pad!
        5. tf.ensure_shape(image, (224, 224, 3))
        
        KEY: TFRecord stores RAW image bytes (no pre-resize).
        resize() is applied at training load time - must match here.
        """
        # Decode (Auto-detects format: BMP, GIF, JPEG, PNG)
        img = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
        
        # Cast to float32 [0-255] - matches: tf.cast(image, tf.float32)
        img = tf.cast(img, tf.float32)
        
        # EXACT MATCH with training: tf.image.resize(image, img_size)
        # img_size = (224, 224), default method = bilinear
        # DO NOT use resize_with_crop_or_pad - that was a mistake!
        target_height, target_width = settings.MODEL_INPUT_SHAPE[:2]
        img = tf.image.resize(img, [target_height, target_width])
        
        # ensure_shape equivalent: shape is now fixed (224, 224, 3)
        img = tf.ensure_shape(img, (target_height, target_width, 3))
        
        # Add batch dimension -> (1, 224, 224, 3)
        img_batch = tf.expand_dims(img, axis=0)
        
        return img_batch.numpy()
