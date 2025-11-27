import tensorflow as tf
import numpy as np
import os
from pathlib import Path
from typing import Dict, List, Optional
from ..core.config import settings
from .image_processing import ImagePreprocessor
from .model_builder import load_model_with_reconstruction

# Enable unsafe deserialization to allow loading models with Lambda layers/custom functions
try:
    tf.keras.config.enable_unsafe_deserialization()
except AttributeError:
    pass

class ModelManager:
    _instance = None
    _models: Dict[str, tf.keras.Model] = {}
    _current_model_name: Optional[str] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
        return cls._instance
    
    def get_available_models(self) -> List[str]:
        """List all .h5 or .keras files in the models directory."""
        if not settings.MODELS_DIR.exists():
            return []
        
        files = [f.name for f in settings.MODELS_DIR.iterdir() 
                 if f.suffix in ['.h5', '.keras']]
        return sorted(files)
    
    def load_model(self, model_name: str) -> tuple[bool, str]:
        """Load a specific model by name using reconstruction workaround. Returns (success, error_message)."""
        if model_name in self._models:
            self._current_model_name = model_name
            return True, ""
            
        model_path = settings.MODELS_DIR / model_name
        if not model_path.exists():
            raise FileNotFoundError(f"Model {model_name} not found")
            
        try:
            # Use reconstruction approach to bypass Keras 3 Lambda deserialization issues
            model = load_model_with_reconstruction(str(model_path))
            self._models[model_name] = model
            self._current_model_name = model_name
            return True, ""
        except Exception as e:
            import traceback
            error_msg = f"Error loading model {model_name}: {str(e)}"
            print(error_msg)
            with open("backend_error.log", "a") as f:
                f.write(f"{error_msg}\n")
                traceback.print_exc(file=f)
            return False, str(e)

    def predict(self, image_bytes: bytes, model_name: Optional[str] = None) -> Dict:
        """Run inference on an image."""
        
        # Determine which model to use
        target_model = model_name or self._current_model_name
        if not target_model:
            # Try to load the first available model if none selected
            available = self.get_available_models()
            if available:
                self.load_model(available[0])
                target_model = available[0]
            else:
                return {"error": "No models available"}
        
        if target_model not in self._models:
            success, error_msg = self.load_model(target_model)
            if not success:
                return {"error": f"Failed to load model {target_model}: {error_msg}"}
                
        model = self._models[target_model]
        
        # Preprocess
        try:
            # Preprocess image (resize, cast to float32 [0, 255])
            # SRM filtering is now part of the model itself
            processed_img = ImagePreprocessor.preprocess(image_bytes)
        except Exception as e:
            return {"error": f"Preprocessing failed: {str(e)}"}
            
        # Inference
        try:
            # Model outputs single sigmoid probability
            prediction = model.predict(processed_img, verbose=0)[0][0]
        except Exception as e:
            return {"error": f"Inference failed: {str(e)}"}
            
        # Interpret result
        # prediction is probability of Stego (Class 1)
        # prediction >= 0.5 -> Stego
        is_stego = prediction >= 0.5
        confidence = float(prediction) if is_stego else 1.0 - float(prediction)
        
        return {
            "model": target_model,
            "prediction": "stego" if is_stego else "clean",
            "label": "Có giấu tin" if is_stego else "Không giấu tin",
            "confidence": confidence,
            "raw_score": float(prediction)
        }

model_manager = ModelManager()
