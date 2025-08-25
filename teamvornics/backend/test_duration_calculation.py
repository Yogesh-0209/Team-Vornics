import os
import sys
import json
from datetime import datetime, timedelta
from event_extractor import EventExtractor

def test_duration_calculation():
    # Create a test file with specific event text
    test_text = """
    Vessel: GLOBAL TRADER
    Port: Singapore
    Date: 10 Jan 2024
    
    10 Jan 2024 08:30 - Vessel arrived at port limits
    10 Jan 2024 09:00 - Vessel anchored for 2.5 hours
    10 Jan 2024 11:30 - Vessel started moving to berth
    10 Jan 2024 12:30 - Vessel berthed
    10 Jan 2024 13:00 - Cargo operations commenced
    10 Jan 2024 15:00 - Cargo operations completed after 2 hours
    10 Jan 2024 15:30 - Vessel unberthed
    10 Jan 2024 16:00 - Vessel departed
    """
    
    # Initialize the event extractor
    extractor = EventExtractor()
    
    # Extract events
    result = extractor.extract_events(test_text, "test_duration.txt")
    
    # Print the extracted events with their durations
    print("\nExtracted Events with Durations:")
    events = result["events"]
    
    # Verify that the calculated durations match the stored durations
    print("\nVerifying Duration Calculations:")
    total_laytime = 0
    all_durations_match = True
    
    for i, event in enumerate(events, 1):
        print(f"Event {i}: {event['eventType']}")
        print(f"  Start Time: {event['startTime']}")
        print(f"  End Time: {event['endTime']}")
        print(f"  Duration: {event['duration']} hours")
        
        # Calculate actual duration from start and end times
        try:
            start_dt = datetime.fromisoformat(event['startTime'].replace(' ', 'T'))
            end_dt = datetime.fromisoformat(event['endTime'].replace(' ', 'T')) if event['endTime'] else None
            calculated_duration = (end_dt - start_dt).total_seconds() / 3600 if end_dt else 0.0
            print(f"  Calculated Duration: {calculated_duration:.2f} hours")
            
            # Check if calculated duration matches stored duration
            duration_match = abs(event["duration"] - calculated_duration) <= 0.1  # Allow small rounding differences
            if not duration_match:
                print(f"  WARNING: Duration mismatch! Stored: {event['duration']}, Calculated: {calculated_duration:.2f}")
                all_durations_match = False
            else:
                print(f"  Duration Match: ✓")
        except Exception as e:
            print(f"  Error calculating actual duration: {e}")
            all_durations_match = False
        
        print()
        total_laytime += event["duration"]
    
    print(f"Total Laytime: {result['totalLaytime']} hours")
    print(f"All Durations Match: {'✓' if all_durations_match else '✗'}")
    
    return result

if __name__ == "__main__":
    result = test_duration_calculation()
    
    # Save the result to a JSON file for inspection
    with open("duration_test_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print("\nTest results saved to duration_test_result.json")