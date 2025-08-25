#!/usr/bin/env python3
"""
Simple startup script for SoF Event Extractor backend
"""

import subprocess
import sys
import os

def main():
    print("🚀 SoF Event Extractor - Starting Backend Server")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('main.py'):
        print("❌ Error: main.py not found!")
        print("Please run this script from the backend directory")
        return 1
    
    try:
        print("📦 Installing required packages...")
        
        # Install basic packages
        packages = [
            "fastapi",
            "uvicorn",
            "python-multipart"
        ]
        
        for package in packages:
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package], 
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"✅ {package}")
            except:
                print(f"⚠️  {package} (may already be installed)")
        
        print("\n🔥 Starting server...")
        print("📍 Backend URL: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        print("🛑 Press Ctrl+C to stop")
        print("=" * 50)
        
        # Start the server
        subprocess.run([sys.executable, "main.py"])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n💡 Try running manually:")
        print("   python main.py")

if __name__ == "__main__":
    main()
