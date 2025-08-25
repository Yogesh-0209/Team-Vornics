import json
import logging
from datetime import datetime
from direct_extractor import DirectEventExtractor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Test text with a specific overlap case that would have triggered adjustment
# The second event starts at the same time the first event ends
test_text = """
Vessel: MV TEST VESSEL
Port: Singapore

23 Aug 2025 05:00 - Vessel anchored at outer anchorage
23 Aug 2025 05:30 - Vessel arrived at port limits
"""

def main():
    logger.info("Starting specific overlap test")
    
    # Create extractor
    extractor = DirectEventExtractor()
    
    # Extract events
    result = extractor.extract_events(test_text, "specific_overlap_test.txt")
    
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
    with open("specific_overlap_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    logger.info("Test completed. Results saved to specific_overlap_result.json")

if __name__ == "__main__":
    main()