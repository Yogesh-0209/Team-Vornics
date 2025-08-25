#!/usr/bin/env python3
"""
Test script to verify anomaly detection is working
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from simple_server import detect_anomalies_simple

def test_anomaly_detection():
    print("🧪 Testing Anomaly Detection System")
    print("=" * 50)
    
    # Test events with various anomalies
    test_events = [
        {
            "eventType": "Anchored",
            "startTime": "2024-01-15 06:00:00",
            "endTime": "2024-01-15 08:30:00",
            "duration": 2.5,
            "location": "Anchorage Area A",
            "description": "Normal anchoring"
        },
        {
            "eventType": "Cargo Loading",
            "startTime": "2024-01-15 09:00:00",
            "endTime": "",  # Missing end time
            "duration": 30.0,
            "location": "Berth 7",
            "description": "Loading with missing end time"
        },
        {
            "eventType": "Weather Delay",
            "startTime": "2024-01-15 14:00:00",
            "endTime": "2024-01-15 12:00:00",  # End before start
            "duration": -2.0,  # Negative duration
            "location": "Berth 7",
            "description": "Weather delay with time issues"
        },
        {
            "eventType": "Shifting",
            "startTime": "2024-01-15 13:30:00",  # Overlaps with weather delay
            "endTime": "2024-01-15 14:30:00",
            "duration": 1.0,
            "location": "Berth change",
            "description": "Overlapping shift"
        }
    ]
    
    print("📋 Original Events:")
    for i, event in enumerate(test_events):
        print(f"  {i+1}. {event['eventType']}: {event['startTime']} -> {event['endTime']} ({event['duration']}h)")
    
    print("\n🔍 Running Anomaly Detection...")
    processed_events = detect_anomalies_simple(test_events)
    
    print("\n📊 Results:")
    anomaly_count = 0
    for i, event in enumerate(processed_events):
        print(f"\n  {i+1}. {event['eventType']}: {event['startTime']} -> {event['endTime']} ({event['duration']}h)")
        if event.get('anomalies'):
            anomaly_count += len(event['anomalies'])
            print(f"     🚨 ANOMALIES DETECTED:")
            for anomaly in event['anomalies']:
                print(f"       - {anomaly}")
        else:
            print(f"     ✅ No anomalies")
    
    print(f"\n📈 Summary:")
    print(f"   Total Events: {len(processed_events)}")
    print(f"   Events with Anomalies: {sum(1 for e in processed_events if e.get('anomalies'))}")
    print(f"   Total Anomalies: {anomaly_count}")
    
    if anomaly_count > 0:
        print("✅ Anomaly detection is working correctly!")
    else:
        print("❌ No anomalies detected - there might be an issue!")

if __name__ == "__main__":
    test_anomaly_detection()
