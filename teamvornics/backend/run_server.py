#!/usr/bin/env python3
"""
Simple script to run the SoF Event Extractor backend server
"""

import sys
import os
import subprocess

def main():
    print("🚀 Starting SoF Event Extractor Backend...")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    try:
        # Try to install basic requirements
        print("📦 Installing basic requirements...")
        subprocess.run([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn", "python-multipart"], 
                      capture_output=True, check=False)
        
        print("🔥 Starting server on http://localhost:8000")
        print("📚 API docs will be at http://localhost:8000/docs")
        print("🛑 Press Ctrl+C to stop")
        print("=" * 50)
        
        # Start the server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n💡 Try running manually:")
        print("   cd backend")
        print("   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload")

if __name__ == "__main__":
    main()
