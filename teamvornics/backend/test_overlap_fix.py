import json
import logging
from datetime import datetime
from direct_extractor import DirectEventExtractor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Test text with overlapping events
test_text = """
Vessel: MV TEST VESSEL
Port: Singapore

23 Aug 2025 05:00 - Vessel anchored at outer anchorage
23 Aug 2025 06:00 - Vessel arrived at port limits
23 Aug 2025 07:00 - Vessel berthed at Terminal 1
23 Aug 2025 08:00 - Vessel unberthed from Terminal 1
23 Aug 2025 09:00 - Vessel departed from port
"""

def main():
    logger.info("Starting overlap fix test")
    
    # Create extractor
    extractor = DirectEventExtractor()
    
    # Extract events
    result = extractor.extract_events(test_text, "overlap_test.txt")
    
    # Print events
    print("\nExtracted Events:")
    for event in result["events"]:
        print(f"Event: {event['eventType']}")
        print(f"  Start Time: {event['startTime']}")
        print(f"  End Time: {event['endTime']}")
        print(f"  Duration: {event['duration']} hours")
        print(f"  Raw Text: {event['rawText']}")
        print()
    
    print(f"Total Laytime: {result['totalLaytime']}")
    
    # Save results to file
    with open("overlap_fix_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    logger.info("Test completed. Results saved to overlap_fix_result.json")

if __name__ == "__main__":
    main()