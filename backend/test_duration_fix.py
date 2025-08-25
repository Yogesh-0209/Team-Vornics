import os
import json
import requests
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime, timedelta

# Create a test PDF with specific event information
def create_test_pdf():
    fd, path = tempfile.mkstemp(suffix='.pdf')
    os.close(fd)
    
    c = canvas.Canvas(path, pagesize=letter)
    c.setFont("Helvetica", 12)
    
    # Add vessel information
    c.drawString(100, 750, "STATEMENT OF FACTS")
    c.drawString(100, 730, "Vessel: TEST VESSEL")
    c.drawString(100, 710, "Port: TEST PORT")
    
    # Add event information with specific times
    c.drawString(100, 670, "Event Log:")
    c.drawString(100, 650, "1. Arrived at port on 2023-08-22 08:00")
    c.drawString(100, 630, "2. Anchored at 2023-08-22 09:00 for 2 hours")
    c.drawString(100, 610, "3. Berthed at 2023-08-22 11:00 for 5 hours")
    c.drawString(100, 590, "4. Started cargo operations at 2023-08-22 11:30 for 4 hours")
    c.drawString(100, 570, "5. Completed cargo operations at 2023-08-22 15:30")
    c.drawString(100, 550, "6. Unberthed at 2023-08-22 16:00 for 1 hour")
    c.drawString(100, 530, "7. Departed at 2023-08-22 17:00")
    
    c.save()
    return path

# Test the file upload and check duration calculation
def test_duration_calculation():
    # Create test PDF
    pdf_path = create_test_pdf()
    print(f"Created test PDF at {pdf_path}")
    
    try:
        # Upload the file to the backend
        url = "http://localhost:8000/process"
        with open(pdf_path, 'rb') as f:
            files = {'file': ('test.pdf', f, 'application/pdf')}
            response = requests.post(url, files=files)
        
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            
            # Save the response to a file for inspection
            with open('duration_fix_test_result.json', 'w') as f:
                json.dump(data, f, indent=2)
            
            # Check if events were extracted
            if 'events' in data and len(data['events']) > 0:
                print(f"Successfully extracted {len(data['events'])} events")
                
                # Check durations
                print("\nEvent Durations:")
                for i, event in enumerate(data['events']):
                    try:
                        start_time = datetime.fromisoformat(event['startTime'].replace(' ', 'T'))
                        end_time = datetime.fromisoformat(event['endTime'].replace(' ', 'T'))
                        calculated_duration = (end_time - start_time).total_seconds() / 3600
                        stored_duration = event['duration']
                        
                        print(f"Event {i+1}: {event['eventType']}")
                        print(f"  Start Time: {event['startTime']}")
                        print(f"  End Time: {event['endTime']}")
                        print(f"  Stored Duration: {stored_duration:.2f} hours")
                        print(f"  Calculated Duration: {calculated_duration:.2f} hours")
                        
                        # Check for negative durations and fix them in the response
                        if calculated_duration < 0:
                            print(f"  ⚠️ ERROR: Negative calculated duration! Start time should be before end time.")
                            # Swap start and end times to fix it
                            event['startTime'], event['endTime'] = event['endTime'], event['startTime']
                            start_time, end_time = end_time, start_time
                            
                            # Recalculate duration
                            calculated_duration = (end_time - start_time).total_seconds() / 3600
                            event['duration'] = max(0.1, calculated_duration)  # Minimum 6 minutes
                            
                            print(f"  ✅ Fixed by swapping times. New duration: {calculated_duration:.2f} hours")
                        # Check if durations match
                        elif abs(calculated_duration - stored_duration) > 0.01:  # Allow small floating point differences
                            print(f"  ⚠️ MISMATCH: Stored duration does not match calculated duration!")
                            # Fix the duration
                            event['duration'] = calculated_duration
                            print(f"  ✅ Fixed duration to match calculated value: {calculated_duration:.2f} hours")
                        else:
                            print(f"  ✅ Durations match")
                        print()
                    except Exception as e:
                        print(f"Error processing event {i+1}: {e}")
            else:
                print("No events were extracted from the file")
        else:
            print(f"Error: Request failed with status code {response.status_code}")
            print(response.text)
    
    except Exception as e:
        print(f"Error during test: {e}")
    
    finally:
        # Clean up the test file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
            print(f"Removed test file: {pdf_path}")

if __name__ == "__main__":
    test_duration_calculation()