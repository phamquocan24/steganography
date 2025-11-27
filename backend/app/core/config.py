import os
from pathlib import Path

class Settings:
    PROJECT_NAME: str = "Steganalysis System"
    API_V1_STR: str = "/api/v1"
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    MODELS_DIR: Path = BASE_DIR.parent / "models"
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    
    # Model Config
    MODEL_INPUT_SHAPE: tuple = (224, 224)
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg"}
    
    # Create dirs if not exist
    def __init__(self):
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        self.MODELS_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()
