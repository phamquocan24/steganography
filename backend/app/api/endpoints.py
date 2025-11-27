from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List, Optional
from ..services.model_service import model_manager

router = APIRouter()

@router.get("/models", response_model=List[str])
async def list_models():
    """List all available models."""
    return model_manager.get_available_models()

@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model_name: Optional[str] = Form(None)
):
    """
    Analyze an uploaded image for steganography.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        result = model_manager.predict(contents, model_name)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "ok"}
