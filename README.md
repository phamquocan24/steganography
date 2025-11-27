# Steganalysis Web System

A professional web-based system for detecting steganography in images using MobileNetV2.

## Project Structure

- **backend/**: FastAPI application for model inference and API handling.
- **frontend/**: React (Vite) application for the user interface.
- **models/**: Directory for storing trained `.h5` or `.keras` models.
- **data/**: Directory for datasets (optional).

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Multi-Model Support**: Automatically loads models from `models/`.
- **SRM Filtering**: Built-in preprocessing for steganalysis.
- **History**: Tracks analysis results.
- **Modern UI**: Responsive and user-friendly interface.