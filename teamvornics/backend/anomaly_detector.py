from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
import traceback

# Try to import AI components
try:
    from ai_extractor import AIExtractor
    ai_available = True
except ImportError:
    ai_available = False

logger = logging.getLogger(__name__)

class AnomalyDetector:
    """
    Detects common anomalies in extracted maritime events.
    Now with AI-powered anomaly detection capabilities.
    """
    
    def __init__(self):
        # Initialize AI components if available
        self.ai_extractor = None
        if ai_available:
            try:
                logger.info("Initializing AI Extractor in AnomalyDetector")
                self.ai_extractor = AIExtractor()
                logger.info("AI Extractor initialized successfully in AnomalyDetector")
            except Exception as e:
                logger.error(f"Failed to initialize AI Extractor in AnomalyDetector: {str(e)}")
                logger.error(traceback.format_exc())

    def detect_anomalies(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Analyzes a list of events for anomalies and adds flags to each event.
        Now with AI-powered anomaly detection when available.
        """
        if not events:
            return []
            
        # Try AI-powered anomaly detection first if available
        if self.ai_extractor is not None:
            try:
                logger.info("Attempting AI-powered anomaly detection")
                ai_result = self._detect_anomalies_with_ai(events)
                if ai_result:
                    logger.info("AI anomaly detection successful")
                    return ai_result
                logger.info("AI anomaly detection returned no results, falling back to traditional detection")
            except Exception as e:
                logger.error(f"AI anomaly detection failed: {str(e)}")
                logger.error(traceback.format_exc())
                logger.info("Falling back to traditional anomaly detection")
        else:
            logger.info("AI extractor not available, using traditional anomaly detection")
            
        # Fallback to traditional anomaly detection
        return self._detect_anomalies_traditional(events)
    
    def _detect_anomalies_with_ai(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Use AI to detect anomalies in maritime events with advanced pattern recognition
        """
        if not events:
            return []
            
        # First, let AI analyze the events for anomalies
        ai_anomalies = self.ai_extractor.detect_anomalies(events)
        
        # Process the AI-detected anomalies
        processed_events = []
        
        for i, event in enumerate(events):
            # Get AI anomalies for this event
            event_anomalies = ai_anomalies.get(str(i), [])
            
            # If AI found anomalies, add them to the event
            if event_anomalies:
                event['anomalies'] = event_anomalies
                event['anomaly_detection_method'] = 'ai'
                
                # Apply AI-suggested fixes if available
                ai_fixes = self.ai_extractor.suggest_fixes(event)
                if ai_fixes:
                    # Apply fixes to event data
                    for key, value in ai_fixes.items():
                        if key in event and key not in ['anomalies', 'anomaly_detection_method']:
                            event[key] = value
                    
                    # Add note about AI fixes
                    event['anomalies'].append(f"AI-suggested fixes applied to {', '.join(ai_fixes.keys())}")
            else:
                # No anomalies found by AI
                event.pop('anomalies', None)
                
            processed_events.append(event)
            
        # Run traditional detection as a backup to catch anything the AI might have missed
        traditional_events = self._detect_anomalies_traditional(events)
        
        # Merge AI and traditional results, prioritizing AI results
        final_events = []
        for ai_event, trad_event in zip(processed_events, traditional_events):
            # If AI didn't find anomalies but traditional did, use traditional results
            if 'anomalies' not in ai_event and 'anomalies' in trad_event:
                ai_event['anomalies'] = trad_event['anomalies']
                ai_event['anomaly_detection_method'] = 'traditional'
            
            final_events.append(ai_event)
            
        return final_events
    
    def _detect_anomalies_traditional(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Traditional method to detect anomalies in maritime events
        """
        processed_events = []
        sorted_events = sorted(events, key=lambda x: self._parse_datetime(x.get('startTime', '')))

        for i, event in enumerate(sorted_events):
            anomalies = []
            start_time_str = event.get('startTime')
            end_time_str = event.get('endTime')
            duration = event.get('duration')

            start_dt = self._parse_datetime(start_time_str)
            end_dt = self._parse_datetime(end_time_str)

            # Anomaly 1: Missing or Invalid End Time
            if not end_dt:
                anomalies.append("Missing or invalid end time.")
                if start_dt: # If start time is valid, estimate end time for consistency
                    end_dt = start_dt + timedelta(hours=event.get('duration', 1)) # Use default duration if not present
                    event['endTime'] = end_dt.strftime("%Y-%m-%d %H:%M:%S")
                    anomalies.append(f"End time estimated based on duration ({event.get('duration', 1)} hours).")

            # Anomaly 2: Negative Duration
            if start_dt and end_dt and end_dt < start_dt:
                anomalies.append("Negative duration (end time before start time).")
                # Suggestion: Swap start/end or re-estimate duration
                event['duration'] = max(0.1, (start_dt - end_dt).total_seconds() / 3600) # Make duration positive
                anomalies.append(f"Duration adjusted to positive: {event['duration']:.2f} hours.")
            elif duration is not None and duration < 0:
                anomalies.append("Negative duration reported.")
                event['duration'] = abs(duration)
                anomalies.append(f"Duration adjusted to positive: {event['duration']:.2f} hours.")


            # Anomaly 3: Overlapping Operations (check with next event)
            if i < len(sorted_events) - 1:
                next_event = sorted_events[i+1]
                next_start_dt = self._parse_datetime(next_event.get('startTime', ''))

                if end_dt and next_start_dt and end_dt > next_start_dt:
                    anomalies.append(f"Overlaps with next event '{next_event.get('eventType')}' (starts at {next_event.get('startTime')}).") 
                    # Calculate how much overlap exists
                    overlap_seconds = (end_dt - next_start_dt).total_seconds()
                    
                    # If overlap is small (less than 5 minutes), adjust end time to match next start time
                    if overlap_seconds <= 300:  # 5 minutes = 300 seconds
                        event['endTime'] = next_start_dt.strftime("%Y-%m-%d %H:%M:%S")
                        event['duration'] = max(0.1, (next_start_dt - start_dt).total_seconds() / 3600)
                        anomalies.append(f"Minor overlap detected. Adjusted end time to match next event's start time: {event['endTime']}")
                    else:
                        # For larger overlaps, keep original end time but flag the anomaly
                        anomalies.append(f"Significant overlap of {overlap_seconds/60:.1f} minutes with next event. Original times preserved.")

            # Add anomalies to the event
            if anomalies:
                event['anomalies'] = anomalies
            else:
                event.pop('anomalies', None) # Remove if no anomalies

            processed_events.append(event)

        return processed_events

    def _parse_datetime(self, dt_str: str) -> datetime | None:
        """Helper to parse datetime strings robustly."""
        if not dt_str or dt_str == "N/A":
            return datetime(1900, 1, 1)  # Return a default date for sorting purposes
        try:
            # Try parsing with microseconds first, then without
            return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        except ValueError:
            try:
                return datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                try:
                    # Try alternative format with single digits
                    parts = dt_str.split('-')
                    if len(parts) == 3:
                        year = parts[0]
                        month = parts[1].zfill(2)  # Ensure 2 digits
                        day_time = parts[2].split(' ')
                        if len(day_time) == 2:
                            day = day_time[0].zfill(2)  # Ensure 2 digits
                            time_parts = day_time[1].split(':')
                            if len(time_parts) == 3:
                                hour = time_parts[0].zfill(2)
                                minute = time_parts[1].zfill(2)
                                second = time_parts[2].zfill(2)
                                formatted_dt = f"{year}-{month}-{day} {hour}:{minute}:{second}"
                                return datetime.strptime(formatted_dt, "%Y-%m-%d %H:%M:%S")
                except Exception as e:
                    logger.warning(f"Could not parse datetime string: {dt_str}, error: {e}")
                
                logger.warning(f"Could not parse datetime string: {dt_str}")
                return datetime(1900, 1, 1)  # Return a default date for sorting purposes
