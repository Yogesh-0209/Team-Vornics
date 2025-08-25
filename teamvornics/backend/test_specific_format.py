import json
from event_extractor import EventExtractor

# Test with a specific format that might be closer to what the user is experiencing
test_text = """
Date: 10 Jan 2024

10 Jan 2024 08:30 - Vessel arrived at port limits
10 Jan 2024 09:00 - Vessel departed from port limits
"""

# Extract events
extractor = EventExtractor()
events = extractor.extract_events(test_text, "test_specific_format.txt")

# Print the extracted events with their times
print("\nExtracted Events with Times:")
print(f"Events structure: {type(events)}")
print(json.dumps(events, indent=2))

# Access the events based on the actual structure
if isinstance(events, dict) and 'events' in events:
    for i, event in enumerate(events['events'], 1):
        print(f"Event {i}: {event['eventType']}")
        print(f"  Start Time: {event['startTime']}")
        print(f"  End Time: {event['endTime']}")
        print(f"  Duration: {event['duration']} hours")
else:
    print("Events structure is not as expected. Please check the JSON output for details.")

# Save results to a file for inspection
with open('specific_format_test_result.json', 'w') as f:
    json.dump(events, f, indent=2)

print("\nTest results saved to specific_format_test_result.json")