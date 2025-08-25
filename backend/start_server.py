#!/usr/bin/env python3
"""
Script to start the SoF Event Extractor backend server
"""

import subprocess
import sys
import os
import time

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn', 
        'fitz',  # PyMuPDF
        'docx',  # python-docx
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    return missing_packages

def install_missing_packages(packages):
    """Install missing packages"""
    print("Installing missing dependencies...")
    for package in packages:
        try:
            if package == 'fitz':
                subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
            elif package == 'docx':
                subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
            else:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")
            return False
    return True

def start_server():
    """Start the FastAPI server"""
    try:
        print("Starting SoF Event Extractor backend server...")
        print("Server will be available at: http://localhost:8000")
        print("API documentation at: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop the server")
        print("=" * 60)
        
        # Start the server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
        
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")

def main():
    print("SoF Event Extractor Backend Server")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('main.py'):
        print("❌ Error: main.py not found!")
        print("Please run this script from the backend directory")
        return 1
    
    # Check dependencies
    missing = check_dependencies()
    
    if missing:
        print(f"❌ Missing dependencies: {', '.join(missing)}")
        print("Attempting to install...")
        
        if not install_missing_packages(missing):
            print("❌ Failed to install some dependencies")
            print("Please install manually with: pip install -r requirements.txt")
            return 1
    
    print("✅ All dependencies are available")
    print()
    
    # Start the server
    start_server()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
