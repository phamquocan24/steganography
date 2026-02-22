# 🛡️ Steganalysis Pro

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-green.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-FF6F00.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Hệ thống phát hiện Steganography bằng Deep Learning**

*AI-Powered Steganalysis + Digital Forensics Platform*

[Demo](#demo) • [Tính năng](#-tính-năng) • [Cài đặt](#-cài-đặt) • [Sử dụng](#-sử-dụng) • [API](#-api-documentation)

</div>

---

## 📖 Giới thiệu

**Steganalysis Pro** là hệ thống web chuyên nghiệp để phát hiện và phân tích steganography (kỹ thuật giấu tin) trong hình ảnh. Hệ thống kết hợp sức mạnh của **Deep Learning (AI)** với các công cụ **Forensics Analysis** truyền thống để cung cấp giải pháp toàn diện.

### 🎯 Mục tiêu
- Phát hiện nhanh ảnh có chứa dữ liệu ẩn (steganography)
- Cung cấp công cụ phân tích forensics đa dạng
- Giao diện thân thiện, dễ sử dụng
- Hỗ trợ nhiều thuật toán và mô hình AI

---

## ✨ Tính năng

### 🤖 AI Detection
| Tính năng | Mô tả |
|-----------|-------|
| **MobileNetV2 + SRM** | Mô hình Deep Learning với SRM filtering |
| **Multi-Model Support** | Hỗ trợ nhiều models (.h5/.keras) |
| **Confidence Score** | Độ tin cậy 0-100% |
| **Risk Assessment** | Đánh giá mức độ rủi ro |

### 🔍 Forensics Analysis
| Module | Chức năng |
|--------|-----------|
| **Metadata Viewer** | Trích xuất EXIF, GPS, Comments |
| **String Extractor** | Tìm URLs, Emails, Base64, CTF Flags |
| **Visual Analysis** | Phân tích Channels, Bit Planes |
| **LSB Extractor** | Trích xuất dữ liệu ẩn từ LSB |
| **Superimposed** | Phân tích chồng lớp |

### 🎨 User Interface
- ✅ Modern, responsive design
- ✅ Drag & drop upload
- ✅ Real-time analysis
- ✅ Export results (JSON/TXT)
- ✅ History management (200 records)
- ✅ Custom scrollbar & animations

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │
│  │   Upload    │ AI Detection│  Forensics  │   History    │ │
│  └─────────────┴─────────────┴─────────────┴──────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP/JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ /api/v1/predict          │ /api/forensics/*             ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ModelManager             │ MetadataExtractor            ││
│  │ ImagePreprocessor        │ StringExtractor              ││
│  │ SRM Filtering            │ VisualAnalyzer               ││
│  │                          │ LSBAnalyzer                  ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              AI MODELS (TensorFlow/Keras)                    │
│                    MobileNetV2 + SRM                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc thư mục

```
steganography_system/
├── 📂 backend/                    # Backend API (Python/FastAPI)
│   ├── 📂 app/
│   │   ├── 📂 api/
│   │   │   ├── endpoints.py       # AI Detection API
│   │   │   └── forensics.py       # Forensics API
│   │   ├── 📂 services/
│   │   │   ├── model_service.py   # AI Model Manager
│   │   │   ├── model_builder.py   # Model Architecture
│   │   │   └── 📂 forensics/
│   │   │       ├── metadata_extractor.py
│   │   │       ├── string_extractor.py
│   │   │       ├── visual_analyzer.py
│   │   │       ├── lsb_analyzer.py
│   │   │       └── superimposed_analyzer.py
│   │   └── main.py                # FastAPI Entry Point
│   └── requirements.txt
│
├── 📂 frontend/                   # Frontend UI (React/Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AIResultPanel.jsx
│   │   │   └── 📂 Forensics/
│   │   │       ├── MetadataViewer.jsx
│   │   │       ├── StringsViewer.jsx
│   │   │       ├── VisualAnalysis.jsx
│   │   │       ├── LSBExtractor.jsx
│   │   │       └── SuperimposedAnalysis.jsx
│   │   ├── 📂 pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── GuidePage.jsx
│   │   │   └── ArchitecturePage.jsx
│   │   └── 📂 services/
│   │       └── forensics.js
│   ├── package.json
│   └── vite.config.js
│
├── 📂 models/                     # AI Models (.h5/.keras)
├── 📄 run_backend.bat             # Windows: Start Backend
├── 📄 run_frontend.bat            # Windows: Start Frontend
└── 📄 README.md
```

---

## 🚀 Cài đặt

### Yêu cầu hệ thống
- **Python** 3.10 trở lên
- **Node.js** 18.x trở lên
- **npm** hoặc **yarn**
- **RAM** tối thiểu 4GB (khuyến nghị 8GB)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/phamquocan24/steganography.git
cd steganography_system
```

### 2️⃣ Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment (khuyến nghị)
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 3️⃣ Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
```

### 4️⃣ Thêm AI Model

Đặt file model (`.h5` hoặc `.keras`) vào thư mục `models/`:
```
models/
└── your_model.h5
```

---

## 🎮 Sử dụng

### Khởi động hệ thống

**Cách 1: Sử dụng script (Windows)**
```bash
# Terminal 1 - Backend
./run_backend.bat

# Terminal 2 - Frontend
./run_frontend.bat
```

**Cách 2: Chạy thủ công**
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Truy cập ứng dụng

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |
| **API Docs (ReDoc)** | http://localhost:8000/redoc |

---

## 📡 API Documentation

### AI Detection

```http
POST /api/v1/predict
Content-Type: multipart/form-data

Parameters:
- file: Image file (required)
- model_name: Model name (optional)

Response:
{
    "model": "model_name.h5",
    "prediction": "stego" | "clean",
    "label": "Có giấu tin" | "Không giấu tin",
    "confidence": 0.95,
    "raw_score": 0.95
}
```

### Forensics APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/forensics/metadata` | POST | Extract metadata |
| `/api/forensics/strings` | POST | Extract strings |
| `/api/forensics/visual` | POST | Visual analysis |
| `/api/forensics/lsb/extract` | POST | LSB extraction |
| `/api/forensics/superimposed` | POST | Superimposed analysis |
| `/api/forensics/analyze-all` | POST | Run all modules |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.1.4 | Build Tool |
| TailwindCSS | 3.4.1 | CSS Framework |
| React Router | 7.10.1 | Navigation |
| Axios | 1.6.7 | HTTP Client |
| Lucide React | 0.330.0 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Language |
| FastAPI | 0.110+ | Web Framework |
| TensorFlow | 2.16.1 | Deep Learning |
| Pillow | 10.2+ | Image Processing |
| OpenCV | 4.8+ | Computer Vision |
| NumPy | 1.26.3 | Numerical Computing |

### AI Model
| Component | Description |
|-----------|-------------|
| MobileNetV2 | Base CNN Architecture |
| SRM Filters | Spatial Rich Model for steganalysis |
| Sigmoid Output | Binary classification |

---

## 📊 Screenshots

### Home Page
- Upload image với drag & drop
- AI Detection với confidence score
- Risk assessment visualization

### Forensics Analysis
- **Metadata**: EXIF, GPS, Comments
- **Strings**: Pattern recognition (URL, Email, Base64)
- **Visual**: Channel separation, Bit planes
- **LSB**: Hidden data extraction

---

## 🔧 Configuration

### Backend Configuration (`backend/app/core/config.py`)
```python
PROJECT_NAME = "Steganalysis API"
API_V1_STR = "/api/v1"
MODELS_DIR = Path("models")
```

### Frontend Configuration (`frontend/vite.config.js`)
```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

- Email: anpham25052004@gmail.com
- GitHub: [@phamquocan24](https://github.com/phamquocan24)

---

## 🙏 Acknowledgments

- [MobileNetV2](https://arxiv.org/abs/1801.04381) - Google Research
- [SRM Filters](http://dde.binghamton.edu/download/feature_extractors/) - Binghamton University
- [FastAPI](https://fastapi.tiangolo.com/) - Sebastián Ramírez
- [React](https://reactjs.org/) - Facebook
- [TailwindCSS](https://tailwindcss.com/) - Adam Wathan

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for Digital Forensics Research

</div>