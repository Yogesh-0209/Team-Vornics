import requests
import os
import json
import tempfile
from fpdf import FPDF

def create_test_pdf():
    # Create a PDF with actual text content that includes event information
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Add vessel information
    pdf.cell(200, 10, txt="STATEMENT OF FACTS", ln=True, align='C')
    pdf.cell(200, 10, txt="Vessel: MV TEST VESSEL", ln=True)
    pdf.cell(200, 10, txt="IMO: 9876543", ln=True)
    pdf.cell(200, 10, txt="Port: TEST PORT", ln=True)
    pdf.cell(200, 10, txt="Date: 15/08/2025", ln=True)
    
    # Add event information with dates and times
    pdf.ln(10)
    pdf.cell(200, 10, txt="EVENT LOG:", ln=True)
    pdf.cell(200, 10, txt="1. Arrived at port limits on 15/08/2025 at 06:00 hrs", ln=True)
    pdf.cell(200, 10, txt="2. Anchored at waiting area on 15/08/2025 at 07:30 hrs", ln=True)
    pdf.cell(200, 10, txt="3. Pilot on board on 15/08/2025 at 14:00 hrs", ln=True)
    pdf.cell(200, 10, txt="4. Berthed at Berth No. 5 on 15/08/2025 at 15:30 hrs", ln=True)
    pdf.cell(200, 10, txt="5. Commenced cargo loading on 15/08/2025 at 16:45 hrs", ln=True)
    pdf.cell(200, 10, txt="6. Completed cargo loading on 16/08/2025 at 08:30 hrs", ln=True)
    pdf.cell(200, 10, txt="7. Departed berth on 16/08/2025 at 10:15 hrs", ln=True)
    pdf.cell(200, 10, txt="8. Pilot disembarked on 16/08/2025 at 11:45 hrs", ln=True)
    pdf.cell(200, 10, txt="9. Vessel sailed on 16/08/2025 at 12:30 hrs", ln=True)
    
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_path = temp_file.name
    temp_file.close()
    
    # Save the PDF to the temporary file
    pdf.output(pdf_path)
    
    return pdf_path

def test_file_upload():
    try:
        # Create a test PDF with actual content
        test_file_path = create_test_pdf()
        print(f"Created test PDF: {test_file_path}")
        
        # Prepare the file for upload
        with open(test_file_path, 'rb') as f:
            files = {'file': ('test_file.pdf', f, 'application/pdf')}
            
            # Send the request to the backend
            print("Sending request to backend...")
            response = requests.post('http://localhost:8000/process', files=files)
            
            # Print the response status and content
            print(f"Status code: {response.status_code}")
            print("Response content:")
            print(json.dumps(response.json(), indent=2))
            
            return response.json()
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        # Clean up the test file
        try:
            if 'test_file_path' in locals() and os.path.exists(test_file_path):
                os.remove(test_file_path)
                print(f"Removed test file: {test_file_path}")
        except Exception as e:
            print(f"Error removing test file: {str(e)}")

if __name__ == "__main__":
    test_file_upload()