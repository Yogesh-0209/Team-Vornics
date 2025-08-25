#!/usr/bin/env python3
"""
Script to install Python dependencies for the SoF Event Extractor backend
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✓ Successfully installed {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install {package}: {e}")
        return False

def main():
    print("Installing Python dependencies for SoF Event Extractor...")
    print("=" * 60)
    
    # List of required packages
    packages = [
        "fastapi==0.104.1",
        "uvicorn==0.24.0", 
        "python-multipart==0.0.6",
        "PyMuPDF==1.23.8",
        "python-docx==1.1.0",
        "python-dateutil==2.8.2",
        "pydantic==2.5.0"
    ]
    
    failed_packages = []
    
    for package in packages:
        if not install_package(package):
            failed_packages.append(package)
    
    print("\n" + "=" * 60)
    
    if failed_packages:
        print(f"❌ Installation completed with {len(failed_packages)} failures:")
        for package in failed_packages:
            print(f"   - {package}")
        print("\nPlease install the failed packages manually:")
        print(f"   pip install {' '.join(failed_packages)}")
        return 1
    else:
        print("✅ All dependencies installed successfully!")
        print("\nYou can now start the backend server with:")
        print("   python main.py")
        return 0

if __name__ == "__main__":
    sys.exit(main())
