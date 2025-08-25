# SoF Event Extractor Backend

## 🚀 Quick Start

### Option 1: Quick Demo Server (Recommended)
```bash
cd backend
python simple_server.py
```

### Option 2: Full Server (with dependencies)
```bash
cd backend
python run_server.py
```

### Option 3: Manual Start
```bash
cd backend
pip install fastapi uvicorn python-multipart
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📍 Server Information

- **Backend URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔥 Features

✅ **Real-time Processing** - Immediate file processing and response  
✅ **Multiple Formats** - PDF and Word document support  
✅ **Template Agnostic** - Works with any SoF format  
✅ **Event Extraction** - Automatically detects maritime events  
✅ **Smart Fallbacks** - Works even without external dependencies  

## 🛠️ How It Works

1. **File Upload** - Accepts PDF/Word documents via REST API
2. **Text Extraction** - Extracts text using PyMuPDF/python-docx (with fallbacks)
3. **Event Detection** - Uses regex patterns to find maritime events
4. **Data Structuring** - Returns structured JSON with events, vessel info, etc.
5. **Real-time Response** - Immediate processing and response

## 📝 API Endpoints

- `POST /process` - Upload and process SoF document
- `GET /health` - Check server health
- `GET /status/{job_id}` - Get processing status
- `GET /` - Server information

## 🔧 Troubleshooting

**Backend not starting?**
```bash
python simple_start.py
```

**Dependencies missing?**
The backend works with minimal dependencies and has smart fallbacks.

**CORS issues?**
The backend is configured to allow all origins for development.

## 📦 Dependencies

**Required:**
- fastapi
- uvicorn
- python-multipart

**Optional (for better text extraction):**
- PyMuPDF (for PDF processing)
- python-docx (for Word processing)

The system works with fallback sample data if optional dependencies are missing.
