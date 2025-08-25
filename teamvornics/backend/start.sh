#!/bin/bash
echo "Starting SoF Event Extractor Backend..."
echo
cd "$(dirname "$0")"
python3 simple_server.py
