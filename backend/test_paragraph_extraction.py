import json
import logging
from datetime import datetime
from direct_extractor import DirectEventExtractor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Test text with paragraph format from Statement of Facts
test_text = """
This Statement of Facts records the port activities of the vessel MV Ocean Spirit at Rotterdam, 
Netherlands, at Berth No. 3 of Eurotank Terminal. The cargo handled was 100,000 MT of crude oil, 
with a laycan between 10th and 12th August 2025. The charterer was ABC Shipping Ltd., and the 
vessel owner was XYZ Maritime Ltd. On 10th August 2025 at 05:30, the vessel arrived at port limits 
(OPL). The pilot boarded at 06:15, and tug assistance was made fast at 07:00. By 07:45 the first 
line was ashore, and at 08:00 the vessel was all fast alongside Berth No. 3. The gangway was 
secured at 08:10, and free pratique was granted at 08:20. Customs and immigration clearance was 
completed by 08:40. The Notice of Readiness (NOR) was tendered at 09:00 and accepted at 09:30 
the same day. Pre-cargo operations began with an initial draught survey at 10:00, followed by shore 
tank inspection at 10:30, hose connection at 11:00, a safety meeting with terminal staff at 11:20, 
and cargo documents verified at 11:30. Cargo loading commenced at 12:00 on 10th August. On 
11th August at 02:00, cargo loading stopped temporarily for a tank change but resumed at 02:30. 
Loading was completed at 18:00 the same day. Hoses were disconnected at 18:15, and the final 
draught survey was completed at 18:30. Documentation and surveys followed: ullage and sampling 
were completed at 19:00, Mate's Receipt signed at 19:30, Bill of Lading signed at 20:00, and the 
Statement of Facts signed by the Master, Agent, and Terminal at 20:15. On 12th August 2025 at 
05:30, the pilot boarded for departure. Tugs were made fast at 05:45, last line was off at 06:00, and 
the vessel was unberthed at 06:15. By 06:45, MV Ocean Spirit had departed the port limits. In 
summary, the vessel successfully loaded 100,000 MT of crude oil with a total laytime used of 2 
days, 1 hour, and 45 minutes. No delays were reported, operations were smooth and continuous, 
and the final NOR was accepted and signed.
"""

def main():
    logger.info("Starting paragraph extraction test")
    
    # Create extractor
    extractor = DirectEventExtractor()
    
    # Extract events
    result = extractor.extract_events(test_text, "paragraph_test.txt")
    
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
    with open("paragraph_extraction_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    logger.info("Test completed. Results saved to paragraph_extraction_result.json")

if __name__ == "__main__":
    main()