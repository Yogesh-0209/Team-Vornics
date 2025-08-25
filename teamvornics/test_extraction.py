import fitz
import json
import sys
sys.path.append('c:\\Team Vornics\\backend')
from direct_extractor import DirectEventExtractor

# Extract text from PDF
doc = fitz.open('maritime_sample_sof.pdf')
text = ''
for page in doc:
    text += page.get_text()

# Process the text with our updated extractor
extractor = DirectEventExtractor()
events = extractor.extract_events(text, 'maritime_sample_sof.pdf')

# Print the extracted events
print(json.dumps(events, indent=2))