import requests
import json
import os

# API endpoint
url = 'http://localhost:8000/process'

# File to upload
file_path = 'maritime_sample_sof.pdf'

# Check if file exists
if not os.path.exists(file_path):
    print(f"Error: File {file_path} not found")
    exit(1)

# Prepare the file for upload
files = {
    'file': (os.path.basename(file_path), open(file_path, 'rb'), 'application/pdf')
}

# Make the request
print(f"Uploading {file_path} to {url}...")
try:
    response = requests.post(url, files=files)
    
    # Check if request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Print the extracted events
        print("\nExtracted Events:")
        for i, event in enumerate(data.get('events', [])):
            print(f"\nEvent {i+1}:")
            print(f"  Type: {event.get('eventType')}")
            print(f"  Start Time: {event.get('startTime')}")
            print(f"  End Time: {event.get('endTime')}")
            print(f"  Duration: {event.get('duration')} hours")
            print(f"  Location: {event.get('location')}")
            print(f"  Description: {event.get('description')}")
        
        # Save the response to a file
        with open('api_response.json', 'w') as f:
            json.dump(data, f, indent=2)
        print("\nResponse saved to api_response.json")
    else:
        print(f"Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"Error: {str(e)}")

finally:
    # Close the file
    files['file'][1].close()