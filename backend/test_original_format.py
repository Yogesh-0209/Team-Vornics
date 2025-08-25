import json
import re
from datetime import datetime
from event_extractor import EventExtractor

# Test with the exact format that the user is experiencing issues with
test_text = """
Date: 10 Jan 2024

10 Jan 2024 08:30 - Vessel arrived at port limits
10 Jan 2024 09:00 - Vessel departed from port limits
10 Jan 2024 10:15 - Vessel berthed at terminal
10 Jan 2024 14:45 - Vessel unberthed from terminal
10 Jan 2024 15:30 - Vessel anchored at waiting area
"""

# Direct pattern matching on the original text
print("\nDirect Pattern Matching on Original Text:")
print("="*50)

# Define the pattern
event_time_pattern = r'(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+-\s+([^\n]+)'

# Month name mappings
month_mapping = {
    'Jan': '01', 'January': '01',
    'Feb': '02', 'February': '02',
    'Mar': '03', 'March': '03',
    'Apr': '04', 'April': '04',
    'May': '05', 'May': '05',
    'Jun': '06', 'June': '06',
    'Jul': '07', 'July': '07',
    'Aug': '08', 'August': '08',
    'Sep': '09', 'September': '09',
    'Oct': '10', 'October': '10',
    'Nov': '11', 'November': '11',
    'Dec': '12', 'December': '12'
}

# Find all matches
matches = list(re.finditer(event_time_pattern, test_text, re.IGNORECASE))

for i, match in enumerate(matches, 1):
    day = match.group(1)
    month = match.group(2)
    year = match.group(3)
    hour = match.group(4)
    minute = match.group(5)
    description = match.group(6).strip()
    
    # Format the date and time
    month_num = month_mapping.get(month.capitalize(), '01')
    date_str = f"{year}-{month_num}-{day.zfill(2)}"
    time_str = f"{hour.zfill(2)}:{minute}:00"
    datetime_str = f"{date_str} {time_str}"
    
    print(f"Match {i}:")
    print(f"  Raw Text: {match.group(0)}")
    print(f"  Day: {day}, Month: {month}, Year: {year}")
    print(f"  Hour: {hour}, Minute: {minute}")
    print(f"  Description: {description}")
    print(f"  Formatted DateTime: {datetime_str}")
    print()

# Now use the EventExtractor
print("\nUsing EventExtractor:")
print("="*50)

extractor = EventExtractor()
events = extractor.extract_events(test_text, "test_original_format.txt")

# Print the extracted events with their times
print("\nExtracted Events with Times:")
print("="*50)

# Access the events based on the actual structure
if isinstance(events, dict) and 'events' in events:
    for i, event in enumerate(events['events'], 1):
        print(f"Event {i}: {event['eventType']}")
        print(f"  Raw Text: {event['rawText'][:50]}...")
        print(f"  Start Time: {event['startTime']}")
        print(f"  End Time: {event['endTime']}")
        print(f"  Duration: {event['duration']} hours")
        print()
    
    print(f"Total Laytime: {events['totalLaytime']}")
else:
    print("Events structure is not as expected. Please check the JSON output for details.")

# Save results to a file for inspection
with open('original_format_test_result.json', 'w') as f:
    json.dump(events, f, indent=2)

print("\nTest results saved to original_format_test_result.json")