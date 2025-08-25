import json
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

# Extract events
extractor = EventExtractor()
events = extractor.extract_events(test_text, "test_exact_format.txt")

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
with open('exact_format_test_result.json', 'w') as f:
    json.dump(events, f, indent=2)

print("\nTest results saved to exact_format_test_result.json")