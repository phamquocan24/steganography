from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import endpoints
from .api import forensics

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Steganalysis System: AI Detection + Forensics Analysis"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(endpoints.router, prefix=settings.API_V1_STR)
app.include_router(forensics.router)  # Forensics has its own prefix

@app.get("/")
async def root():
    return {
        "message": "Welcome to Steganalysis API",
        "docs": "/docs"
    }
