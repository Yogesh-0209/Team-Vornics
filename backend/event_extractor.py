import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import logging
import traceback

# Try to import AI components
try:
    from ai_extractor import AIExtractor
    ai_available = True
except ImportError:
    ai_available = False

logger = logging.getLogger(__name__)

class EventExtractor:
    """
    Advanced event extractor for Statement of Facts documents using enhanced NLP and pattern matching
    Now with AI-powered extraction capabilities
    """
    
    def __init__(self):
        # Initialize AI components if available
        self.ai_extractor = None
        if ai_available:
            try:
                logger.info("Initializing AI Extractor in EventExtractor")
                self.ai_extractor = AIExtractor()
                logger.info("AI Extractor initialized successfully in EventExtractor")
            except Exception as e:
                logger.error(f"Failed to initialize AI Extractor in EventExtractor: {str(e)}")
                logger.error(traceback.format_exc())
        
        # Enhanced event patterns with more comprehensive matching
        self.event_patterns = {
            'anchored': [
                r'anchor(?:ed|ing|age)',
                r'drop(?:ped)?\s+anchor',
                r'at\s+anchor',
                r'anchorage\s+(?:area|zone)',
                r'waiting\s+(?:at\s+)?anchor',
                r'vessel\s+anchored'
            ],
            'cargo_loading': [
                r'(?:commenced|start(?:ed)?|begin|beginning)\s+(?:loading|cargo\s+operations)',
                r'loading\s+(?:commenced|started|operations|cargo)',
                r'cargo\s+loading',
                r'load(?:ing)?\s+cargo',
                r'commenced\s+cargo',
                r'start(?:ed)?\s+loading',
                r'loading\s+operation'
            ],
            'cargo_discharge': [
                r'(?:commenced|start(?:ed)?|begin|beginning)\s+(?:discharging|discharge)',
                r'discharging\s+(?:commenced|started|operations|cargo)',
                r'cargo\s+discharge',
                r'discharge\s+cargo',
                r'commenced\s+discharge',
                r'start(?:ed)?\s+discharging',
                r'discharge\s+operation'
            ],
            'shifting': [
                r'shift(?:ed|ing)',
                r'moved?\s+to',
                r'proceed(?:ed)?\s+to',
                r'berth\s+shift',
                r'shifting\s+(?:to|from)',
                r'vessel\s+shifted'
            ],
            'departed': [
                r'depart(?:ed|ure)',
                r'left\s+(?:port|berth|terminal)',
                r'sailed',
                r'cleared\s+port',
                r'vessel\s+departed',
                r'departure\s+from'
            ],
            'arrived': [
                r'arriv(?:ed|al)',
                r'reached',
                r'entered\s+port',
                r'port\s+arrival',
                r'vessel\s+arrived',
                r'arrival\s+at'
            ],
            'berthed': [
                r'berth(?:ed|ing)',
                r'alongside',
                r'made\s+fast',
                r'secured\s+to\s+berth',
                r'vessel\s+berthed',
                r'berthing\s+completed'
            ],
            'unberthed': [
                r'unberth(?:ed|ing)',
                r'left\s+berth',
                r'cast\s+off',
                r'departed\s+berth',
                r'vessel\s+unberthed',
                r'unberthing\s+completed'
            ],
            'completed_loading': [
                r'completed\s+loading',
                r'loading\s+completed',
                r'finished\s+loading',
                r'cargo\s+loading\s+completed'
            ],
            'completed_discharge': [
                r'completed\s+discharge',
                r'discharge\s+completed',
                r'finished\s+discharging',
                r'cargo\s+discharge\s+completed'
            ]
        }
        
        # Enhanced time patterns
        self.time_patterns = [
            r'(\d{1,2}):(\d{2})\s*(?:hrs?|hours?)?',
            r'(\d{1,2})\.(\d{2})\s*(?:hrs?|hours?)?',
            r'(\d{1,2})\s*(?:hrs?|hours?)\s*(\d{2})\s*(?:mins?|minutes?)?',
            r'(\d{4})\s*(?:hrs?|hours?)',  # 24-hour format like 1430 hrs
            r'at\s+(\d{1,2}):(\d{2})',
            r'time\s+(\d{1,2}):(\d{2})'
        ]
        
        # Enhanced date patterns
        self.date_patterns = [
            r'(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})',
            r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{2,4})',
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{2,4})',
            r'(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})',  # YYYY/MM/DD format
            r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{2,4})'
        ]
        
        # Month name mappings
        self.month_mapping = {
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
    
    def extract_events(self, text: str, filename: str) -> Dict[str, Any]:
        """
        Main method to extract events from SoF text with enhanced processing
        Now with AI-powered extraction capabilities when available
        """
        logger.info(f"Starting event extraction from {filename}")
        
        # Try AI-powered extraction first if available
        if self.ai_extractor is not None:
            try:
                logger.info("Attempting AI-powered event extraction")
                ai_result = self._extract_events_with_ai(text, filename)
                if ai_result and ai_result.get("events") and len(ai_result.get("events")) > 0:
                    logger.info(f"AI extraction successful, found {len(ai_result.get('events'))} events")
                    return ai_result
                logger.info("AI extraction returned no events, falling back to traditional extraction")
            except Exception as e:
                logger.error(f"AI extraction failed: {str(e)}")
                logger.error(traceback.format_exc())
                logger.info("Falling back to traditional extraction")
        else:
            logger.info("AI extractor not available, using traditional extraction")
        
        # Fallback to traditional extraction
        return self._extract_events_traditional(text, filename)
    
    def _extract_events_with_ai(self, text: str, filename: str) -> Dict[str, Any]:
        """
        Extract events using AI-powered techniques
        """
        # Preprocess text
        processed_text = self._preprocess_text(text)
        
        # Extract base date from document
        base_date = self._extract_base_date(processed_text)
        
        # Use AI extractor to get events
        ai_events = self.ai_extractor.extract_events(processed_text, base_date)
        
        # Extract vessel and port information using AI
        vessel_info = self.ai_extractor.extract_vessel_info(processed_text) or self._extract_vessel_info(processed_text)
        port_info = self.ai_extractor.extract_port_info(processed_text) or self._extract_port_info(processed_text)
        
        # Post-process AI events to ensure consistency
        events = self._post_process_ai_events(ai_events)
        
        # Calculate total laytime and statistics
        total_laytime = self._calculate_total_laytime(events)
        statistics = self._calculate_statistics(events)
        
        # Add AI confidence metrics
        ai_metrics = self.ai_extractor.calculate_extraction_quality(processed_text, events)
        
        result = {
            "events": events,
            "vesselInfo": vessel_info,
            "portInfo": port_info,
            "totalLaytime": total_laytime,
            "statistics": statistics,
            "documentDate": base_date or datetime.now().strftime("%Y-%m-%d"),
            "extractedFrom": filename,
            "totalEvents": len(events),
            "extractionTimestamp": datetime.now().isoformat(),
            "aiMetrics": ai_metrics,
            "extractionMethod": "ai"
        }
        
        return result
    
    def _post_process_ai_events(self, ai_events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Post-process AI-extracted events to ensure they match the expected format
        """
        processed_events = []
        
        for event in ai_events:
            # Ensure all required fields are present
            processed_event = {
                "eventType": event.get("eventType", "unknown"),
                "startTime": event.get("startTime"),
                "endTime": event.get("endTime"),
                "duration": event.get("duration", 0.0),
                "location": event.get("location", ""),
                "description": event.get("description", ""),
                "confidence": event.get("confidence", 0.7),
                "rawText": event.get("rawText", ""),
                "context": event.get("context", {})
            }
            
            # Validate and fix times if needed
            if processed_event["startTime"] and processed_event["endTime"]:
                try:
                    start_dt = datetime.fromisoformat(processed_event["startTime"].replace(' ', 'T'))
                    end_dt = datetime.fromisoformat(processed_event["endTime"].replace(' ', 'T'))
                    
                    # If end time is before start time, swap them
                    if end_dt < start_dt:
                        processed_event["startTime"], processed_event["endTime"] = processed_event["endTime"], processed_event["startTime"]
                        start_dt, end_dt = end_dt, start_dt
                    
                    # Recalculate duration
                    duration = (end_dt - start_dt).total_seconds() / 3600
                    processed_event["duration"] = round(max(0.1, duration), 2)
                except Exception as e:
                    logger.error(f"Error validating AI event times: {e}")
            
            processed_events.append(processed_event)
        
        # Sort events chronologically
        processed_events = self._sort_events_chronologically(processed_events)
        
        return processed_events
        
    def _extract_events_traditional(self, text: str, filename: str) -> Dict[str, Any]:
        """
        Traditional method to extract events from SoF text with enhanced processing
        """
        # Preprocess text
        processed_text = self._preprocess_text(text)
        logger.info(f"Preprocessed text length: {len(processed_text)} characters")
        
        # Extract base date from document
        base_date = self._extract_base_date(processed_text)
        logger.info(f"Extracted base date: {base_date}")
        
        # Extract events with enhanced matching
        events = self._find_events(processed_text, base_date)
        logger.info(f"Found {len(events)} events")
        
        # Extract vessel and port information
        vessel_info = self._extract_vessel_info(processed_text)
        port_info = self._extract_port_info(processed_text)
        
        # Calculate total laytime and statistics
        total_laytime = self._calculate_total_laytime(events)
        statistics = self._calculate_statistics(events)
        
        result = {
            "events": events,
            "vesselInfo": vessel_info,
            "portInfo": port_info,
            "totalLaytime": total_laytime,
            "statistics": statistics,
            "documentDate": base_date or datetime.now().strftime("%Y-%m-%d"),
            "extractedFrom": filename,
            "totalEvents": len(events),
            "extractionTimestamp": datetime.now().isoformat(),
            "extractionMethod": "traditional"
        }
        
        logger.info(f"Traditional event extraction completed successfully")
        return result
    
    def _preprocess_text(self, text: str) -> str:
        """
        Clean and normalize text for better extraction
        """
        # Convert to lowercase for pattern matching
        text = text.lower()
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere
        text = re.sub(r'[^\w\s\-\.\/:,]', ' ', text)
        
        return text
    
    def _find_events(self, text: str, base_date: str = None) -> List[Dict[str, Any]]:
        """
        Enhanced event finding with better context analysis
        """
        events = []
        lines = text.split('\n')
        
        # Track found events to avoid duplicates
        found_events = set()
        
        # First look for specific date-time event patterns
        # For example: "10 Jan 2024 08:30 - Vessel arrived at port limits"
        # or "10 Jan 2024 09:00 - Vessel departed from port limits"
        for i, line in enumerate(lines):
            # Exact pattern for "DD Mon YYYY HH:MM - Event Description"
            # This pattern matches: day, month abbreviation, year, hour, minute, and description
            event_time_pattern = r'(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+-\s+([^\n]+)'
            matches = list(re.finditer(event_time_pattern, line, re.IGNORECASE))
            
            for match in matches:
                event_description = match.group(6).strip().lower()
                
                # Determine event type from description
                event_type = None
                if 'arrived' in event_description:
                    event_type = 'arrived'
                elif 'departed' in event_description:
                    event_type = 'departed'
                elif 'anchored' in event_description:
                    event_type = 'anchored'
                elif 'berthed' in event_description:
                    event_type = 'berthed'
                elif 'unberthed' in event_description:
                    event_type = 'unberthed'
                elif 'loading' in event_description and 'completed' in event_description:
                    event_type = 'completed_loading'
                elif 'discharge' in event_description and 'completed' in event_description:
                    event_type = 'completed_discharge'
                elif 'loading' in event_description:
                    event_type = 'cargo_loading'
                elif 'discharge' in event_description:
                    event_type = 'cargo_discharge'
                elif 'shifting' in event_description:
                    event_type = 'shifting'
                
                if event_type:
                    event_id = f"{event_type}_{i}_{match.start()}"
                    if event_id not in found_events:
                        event = self._extract_event_details(
                            line, event_type, lines, i, base_date, match
                        )
                        if event:
                            events.append(event)
                            found_events.add(event_id)
        
        # Then use the regular pattern matching for any remaining events
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            for event_type, patterns in self.event_patterns.items():
                for pattern in patterns:
                    matches = list(re.finditer(pattern, line_lower, re.IGNORECASE))
                    
                    for match in matches:
                        # Create a unique identifier for this event occurrence
                        event_id = f"{event_type}_{i}_{match.start()}"
                        
                        if event_id not in found_events:
                            event = self._extract_event_details(
                                line, event_type, lines, i, base_date, match
                            )
                            if event:
                                events.append(event)
                                found_events.add(event_id)
                            break
        
        # Enhanced deduplication and sorting
        events = self._deduplicate_events(events)
        events = self._sort_events_chronologically(events)
        
        # Post-process events to fix timing issues
        events = self._post_process_events(events)
        
        return events
    
    def _extract_event_details(self, line: str, event_type: str, all_lines: List[str], 
                             line_index: int, base_date: str = None, match=None) -> Optional[Dict[str, Any]]:
        """
        Enhanced event detail extraction with better context analysis
        """
        start_time = None
        date_found = False
        time_found = False
        date_str = base_date
        
        # Check if we have a match from the specific date-time pattern
        if match and len(match.groups()) >= 6:
            # This is a match from the specific date-time pattern
            # Format: "10 Jan 2024 08:30 - Vessel arrived at port limits"
            day = int(match.group(1))
            month = self.month_mapping.get(match.group(2).capitalize(), 1)  # Capitalize month name
            year = int(match.group(3))
            hours = int(match.group(4))
            minutes = int(match.group(5))
            event_description = match.group(6).strip()
            
            # Validate time
            if 0 <= hours <= 23 and 0 <= minutes <= 59:
                date_str = f"{year:04d}-{month:02d}-{day:02d}"
                time_str = f"{hours:02d}:{minutes:02d}:00"
                start_time = f"{date_str} {time_str}"
                date_found = True
                time_found = True
                
                # Log the extracted time for debugging
                logger.info(f"Extracted exact time from pattern: {start_time} for event: {event_type}")
        else:
            # If no match provided or not the right format, check the current line
            current_line = line
            event_time_pattern = r'(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+-\s+([^\n]+)'
            match = re.search(event_time_pattern, current_line, re.IGNORECASE)
            
            if match:
                day = int(match.group(1))
                month = self.month_mapping.get(match.group(2).capitalize(), 1)  # Capitalize month name
                year = int(match.group(3))
                hours = int(match.group(4))
                minutes = int(match.group(5))
                event_description = match.group(6).strip()
                
                # Validate time
                if 0 <= hours <= 23 and 0 <= minutes <= 59:
                    date_str = f"{year:04d}-{month:02d}-{day:02d}"
                    time_str = f"{hours:02d}:{minutes:02d}:00"
                    start_time = f"{date_str} {time_str}"
                    date_found = True
                    time_found = True
                    
                    # Log the extracted time for debugging
                    logger.info(f"Extracted exact time from line: {start_time} for event: {event_type}")
        
        # Initialize datetime_info with default values
        datetime_info = {
            'start_time': start_time,
            'date': date_str,
            'date_found': date_found,
            'time_found': time_found
        }
        
        if not start_time:
            # Extract comprehensive time information from context
            datetime_info = self._extract_datetime_from_context(line, all_lines, line_index, base_date)
            start_time = datetime_info.get('start_time')
            
            # Log fallback to context extraction
            logger.info(f"Falling back to context extraction for event: {event_type}, got: {start_time}")
        
        # Extract location information with better accuracy
        location = self._extract_location(line, all_lines, line_index)
        
        # Extract additional context information
        context = self._extract_context_info(line, all_lines, line_index)
        
        # Check for explicit duration in the text
        explicit_duration = self._extract_explicit_duration(line)
        
        # Calculate estimated duration with smarter estimation if no explicit duration
        if explicit_duration is None:
            estimated_duration = self._estimate_duration_smart(event_type, context, line)
        else:
            estimated_duration = explicit_duration
            
        estimated_duration = max(0.1, estimated_duration)  # Ensure minimum duration of 6 minutes
        
        # Generate end time
        if start_time:
            end_time = self._calculate_end_time(start_time, estimated_duration)
        else:
            start_time = self._generate_placeholder_time(event_type, line_index, base_date)
            end_time = self._calculate_end_time(start_time, estimated_duration)
        
        # Calculate actual duration from start and end times
        # Ensure duration is properly calculated and consistent with start/end times
        try:
            start_dt = datetime.fromisoformat(start_time.replace(' ', 'T'))
            end_dt = datetime.fromisoformat(end_time.replace(' ', 'T'))
            
            # If end time is before start time, swap them to ensure logical consistency
            if end_dt < start_dt:
                logger.warning(f"End time before start time detected. Swapping times for consistency.")
                start_time, end_time = end_time, start_time
                start_dt, end_dt = end_dt, start_dt
                
            actual_duration = (end_dt - start_dt).total_seconds() / 3600
            # Round to 2 decimal places to avoid floating point precision issues
            actual_duration = round(actual_duration, 2)
            # Ensure duration is positive and reasonable
            duration = max(0.1, actual_duration)  # Minimum 6 minutes
            
            # If explicit duration was found in the text, use that instead
            if explicit_duration is not None:
                duration = explicit_duration
                # Recalculate end time based on explicit duration
                end_dt = start_dt + timedelta(hours=explicit_duration)
                end_time = end_dt.strftime("%Y-%m-%d %H:%M:%S")
                
            # Log the final calculated times
            logger.info(f"Final times for {event_type}: start={start_time}, end={end_time}, duration={duration}")
        except Exception as e:
            logger.error(f"Error calculating actual duration: {e}")
            duration = estimated_duration
        
        # Generate comprehensive description
        description = self._generate_enhanced_description(event_type, line, context)
        
        return {
            "eventType": self._format_event_type(event_type),
            "startTime": start_time,
            "endTime": end_time,
            "duration": duration,
            "location": location,
            "description": description,
            "confidence": self._calculate_confidence(datetime_info, location, context),
            "rawText": line.strip(),
            "context": context
        }
    
    def _extract_datetime_from_context(self, line: str, all_lines: List[str], 
                                     line_index: int, base_date: str = None) -> Dict[str, Any]:
        """
        Enhanced datetime extraction with better context analysis
        """
        datetime_info = {
            'start_time': None,
            'date': base_date,
            'time_found': False,
            'date_found': False
        }
        
        # First check if the current line contains the event we're looking for
        current_line = all_lines[line_index]
        
        # Look for specific event patterns in the current line
        # For example: "10 Jan 2024 08:30 - Vessel arrived at port limits"
        # or "10 Jan 2024 09:00 - Vessel departed from port limits"
        event_time_pattern = r'(\d{1,2})\s*([a-z]{3})\s*(\d{4})\s*(\d{1,2}):(\d{2})\s*-\s*([^\n]+)'
        match = re.search(event_time_pattern, current_line, re.IGNORECASE)
        if match:
            day = int(match.group(1))
            month = self.month_mapping.get(match.group(2).lower(), 1)
            year = int(match.group(3))
            hours = int(match.group(4))
            minutes = int(match.group(5))
            event_description = match.group(6).strip()
            
            # Validate time
            if 0 <= hours <= 23 and 0 <= minutes <= 59:
                date_str = f"{year:04d}-{month:02d}-{day:02d}"
                time_str = f"{hours:02d}:{minutes:02d}:00"
                datetime_info['date'] = date_str
                datetime_info['date_found'] = True
                datetime_info['start_time'] = f"{date_str} {time_str}"
                datetime_info['time_found'] = True
                return datetime_info
        
        # If no specific event pattern found, check for date-time pattern like "10 Jan 2024 08:30 - "
        date_time_pattern = r'(\d{1,2})\s*([a-z]{3})\s*(\d{4})\s*(\d{1,2}):(\d{2})\s*-\s*'
        match = re.search(date_time_pattern, current_line, re.IGNORECASE)
        if match:
            day = int(match.group(1))
            month = self.month_mapping.get(match.group(2).lower(), 1)
            year = int(match.group(3))
            hours = int(match.group(4))
            minutes = int(match.group(5))
            
            # Validate time
            if 0 <= hours <= 23 and 0 <= minutes <= 59:
                date_str = f"{year:04d}-{month:02d}-{day:02d}"
                time_str = f"{hours:02d}:{minutes:02d}:00"
                datetime_info['date'] = date_str
                datetime_info['date_found'] = True
                datetime_info['start_time'] = f"{date_str} {time_str}"
                datetime_info['time_found'] = True
                return datetime_info
        
        # If not found, check current line and surrounding context
        context_lines = []
        for offset in range(-2, 3):
            check_index = line_index + offset
            if 0 <= check_index < len(all_lines):
                context_lines.append(all_lines[check_index])
        
        # Extract date information
        date_found = self._find_date_in_context(context_lines)
        if date_found:
            datetime_info['date'] = date_found
            datetime_info['date_found'] = True
        
        # First try to extract time directly from the current line (most accurate)
        time_found = self._find_time_in_context([current_line])
        
        # If not found in current line, check surrounding context
        if not time_found:
            for offset in range(-1, 2):
                if offset == 0:  # Skip current line as we already checked it
                    continue
                check_index = line_index + offset
                if 0 <= check_index < len(all_lines):
                    time_found = self._find_time_in_context([all_lines[check_index]])
                    if time_found:
                        break
        
        if time_found:
            datetime_info['time_found'] = True
            # Combine date and time
            if datetime_info['date']:
                datetime_info['start_time'] = f"{datetime_info['date']} {time_found}"
            else:
                # Use current date if no date found
                current_date = datetime.now().strftime("%Y-%m-%d")
                datetime_info['start_time'] = f"{current_date} {time_found}"
        
        return datetime_info
    
    def _find_time_in_context(self, context_lines: List[str]) -> Optional[str]:
        """
        Find time patterns in context with enhanced matching
        """
        for line in context_lines:
            # First look for specific date-time format like "10 Jan 2024 08:30 - Event Description"
            specific_date_time_pattern = r'(\d{1,2})\s*([a-z]{3})\s*(\d{4})\s*(\d{1,2}):(\d{2})\s*-\s*([^\n]+)'
            match = re.search(specific_date_time_pattern, line, re.IGNORECASE)
            if match:
                hours = int(match.group(4))
                minutes = int(match.group(5))
                # Validate time
                if 0 <= hours <= 23 and 0 <= minutes <= 59:
                    return f"{hours:02d}:{minutes:02d}:00"
            
            # Then look for date-time format like "10 Jan 2024 08:30 - "
            date_time_pattern = r'\d{1,2}\s*[a-z]{3}\s*\d{4}\s*(\d{1,2}):(\d{2})\s*-\s*'
            match = re.search(date_time_pattern, line, re.IGNORECASE)
            if match:
                hours = int(match.group(1))
                minutes = int(match.group(2))
                # Validate time
                if 0 <= hours <= 23 and 0 <= minutes <= 59:
                    return f"{hours:02d}:{minutes:02d}:00"
            
            # Check for time range format (e.g., "08:30 - 11:00")
            time_range_pattern = r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})'
            match = re.search(time_range_pattern, line)
            if match:
                hours = int(match.group(1))
                minutes = int(match.group(2))
                # Validate time
                if 0 <= hours <= 23 and 0 <= minutes <= 59:
                    return f"{hours:02d}:{minutes:02d}:00"
                    
            # Then look for time patterns with a dash separator (common in event logs)
            dash_time_pattern = r'(\d{1,2})\s*[:\.]?(\d{2})\s*(?:hrs?|hours?)?\s*-\s*'
            match = re.search(dash_time_pattern, line, re.IGNORECASE)
            if match:
                hours = int(match.group(1))
                minutes = int(match.group(2))
                # Validate time
                if 0 <= hours <= 23 and 0 <= minutes <= 59:
                    return f"{hours:02d}:{minutes:02d}:00"
            
            # Then check other time patterns
            for pattern in self.time_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    groups = match.groups()
                    
                    if len(groups) >= 2:
                        # Handle different time formats
                        if len(groups[0]) == 4:  # 24-hour format like 1430
                            time_str = groups[0]
                            hours = int(time_str[:2])
                            minutes = int(time_str[2:])
                        else:
                            hours = int(groups[0])
                            minutes = int(groups[1])
                        
                        # Validate time
                        if 0 <= hours <= 23 and 0 <= minutes <= 59:
                            return f"{hours:02d}:{minutes:02d}:00"
        
        return None
    
    def _find_date_in_context(self, context_lines: List[str]) -> Optional[str]:
        """
        Find date patterns in context
        """
        for line in context_lines:
            # First check for explicit date format like "Date: 10 Jan 2024"  
            date_header_pattern = r'date:?\s*(\d{1,2})\s*([a-z]{3})\s*(\d{4})'  
            match = re.search(date_header_pattern, line, re.IGNORECASE)  
            if match:  
                day = int(match.group(1))  
                month = self.month_mapping.get(match.group(2).lower(), 1)  
                year = int(match.group(3))  
                return f"{year:04d}-{month:02d}-{day:02d}"  
                
            # Then check other date patterns
            for pattern in self.date_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    groups = match.groups()
                    
                    try:
                        if len(groups) == 3:
                            # Handle different date formats
                            if groups[1] in self.month_mapping:
                                # Format: DD Mon YYYY
                                day = int(groups[0])
                                month = self.month_mapping[groups[1]]
                                year = int(groups[2])
                                if year < 100:
                                    year += 2000
                                return f"{year:04d}-{month:02d}-{day:02d}"
                            else:
                                # Format: DD/MM/YYYY or MM/DD/YYYY
                                part1, part2, part3 = int(groups[0]), int(groups[1]), int(groups[2])
                                
                                if part3 < 100:
                                    part3 += 2000
                                
                                # Check if first part is a year (YYYY-MM-DD format)
                                if part1 > 1000:  # Likely a year
                                    return f"{part1:04d}-{part2:02d}-{part3:02d}"
                                # Assume DD/MM/YYYY format (European)
                                elif part1 <= 12 and part2 <= 31:
                                    return f"{part3:04d}-{part1:02d}-{part2:02d}"
                                elif part2 <= 12 and part1 <= 31:
                                    return f"{part3:04d}-{part2:02d}-{part1:02d}"
                    except (ValueError, KeyError):
                        continue
            
            # Additional pattern for "YYYY-MM-DD" or "YYYY-M-D" format
            date_pattern = r'(\d{4})[-/](\d{1,2})[-/](\d{1,2})'
            match = re.search(date_pattern, line, re.IGNORECASE)
            if match:
                try:
                    year, month, day = map(int, match.groups())
                    return f"{year:04d}-{month:02d}-{day:02d}"
                except (ValueError, IndexError):
                    continue
        
        return None
    
    def _extract_base_date(self, text: str) -> Optional[str]:
        """
        Extract the base date from the document
        """
        lines = text.split('\n')[:20]  # Check first 20 lines
        
        for line in lines:
            date_found = self._find_date_in_context([line])
            if date_found:
                return date_found
        
        return None
    
    def _extract_location(self, line: str, all_lines: List[str], line_index: int) -> Optional[str]:
        """
        Extract location information from context
        """
        location_patterns = [
            r'berth\s+(\w+)',
            r'anchorage\s+(\w+)',
            r'terminal\s+(\w+)',
            r'wharf\s+(\w+)',
            r'pier\s+(\w+)',
            r'port\s+of\s+([\w\s]+)',
            r'port[:\s]+([\w\s]+)',
            r'at\s+([\w\s]+)\s+port'
        ]
        
        # Check current and nearby lines for location
        for offset in range(-2, 3):
            check_index = line_index + offset
            if 0 <= check_index < len(all_lines):
                check_line = all_lines[check_index]
                for pattern in location_patterns:
                    match = re.search(pattern, check_line, re.IGNORECASE)
                    if match:
                        return match.group(0).title()
        
        # If no specific location found, use port information as default location
        port_info = self._extract_port_info('\n'.join(all_lines))
        if port_info and port_info.get('name'):
            return port_info.get('name')
        
        return "Port Location"  # Default fallback
    
    def _estimate_duration(self, event_type: str) -> float:
        """
        Estimate typical duration for different event types (in hours)
        """
        duration_estimates = {
            'anchored': 2.5,
            'cargo_loading': 24.0,
            'cargo_discharge': 18.0,
            'shifting': 1.0,
            'departed': 0.5,
            'arrived': 0.5,
            'berthed': 1.0,
            'unberthed': 0.5
        }
        
        return duration_estimates.get(event_type, 1.0)
    
    def _calculate_end_time(self, start_time: str, duration: float) -> str:
        """
        Calculate end time based on start time and duration
        """
        try:
            # Ensure duration is positive and reasonable
            duration = max(0.1, duration)  # Minimum 6 minutes
            
            # Parse start time correctly
            start_dt = datetime.fromisoformat(start_time.replace(' ', 'T'))
            
            # Check for explicit duration in the event text
            # If duration is explicitly mentioned, use that value
            # Otherwise use the estimated duration
            
            # Calculate end time based on duration in hours
            hours = int(duration)
            minutes = int((duration - hours) * 60)
            seconds = int(((duration - hours) * 60 - minutes) * 60)
            
            end_dt = start_dt + timedelta(hours=hours, minutes=minutes, seconds=seconds)
            
            # Ensure end time is after start time
            if end_dt <= start_dt:
                logger.warning(f"End time calculation resulted in end time not after start time. Adjusting to minimum duration.")
                end_dt = start_dt + timedelta(minutes=6)  # Minimum 6 minutes
                
            return end_dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception as e:
            logger.error(f"Error calculating end time: {e}")
            # Default to 30 minutes if calculation fails
            try:
                start_dt = datetime.fromisoformat(start_time.replace(' ', 'T'))
                return (start_dt + timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S")
            except:
                # If all else fails, return a time 30 minutes from now
                return (datetime.now() + timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S")
    
    def _generate_placeholder_time(self, event_type: str, line_index: int, base_date: str = None) -> str:
        """
        Generate intelligent placeholder time based on event type and context
        """
        if base_date:
            try:
                base_dt = datetime.strptime(base_date, "%Y-%m-%d")
            except:
                base_dt = datetime.now()
        else:
            base_dt = datetime.now()
        
        # Event type based time estimation
        event_time_mapping = {
            'anchored': 6,      # Early morning
            'arrived': 8,       # Morning
            'berthed': 10,      # Mid morning
            'cargo_loading': 12, # Noon
            'cargo_discharge': 14, # Afternoon
            'shifting': 16,     # Late afternoon
            'unberthed': 18,    # Evening
            'departed': 20      # Night
        }
        
        base_hour = event_time_mapping.get(event_type, 12)
        # Add some variation based on line index
        hour_offset = (line_index % 4) * 2
        final_hour = (base_hour + hour_offset) % 24
        
        result_time = base_dt.replace(hour=final_hour, minute=0, second=0)
        return result_time.strftime("%Y-%m-%d %H:%M:%S")
    
    def _extract_context_info(self, line: str, all_lines: List[str], line_index: int) -> Dict[str, Any]:
        """
        Extract additional context information from surrounding text
        """
        context = {
            'cargo_type': None,
            'quantity': None,
            'weather': None,
            'delays': [],
            'personnel': []
        }
        
        # Check surrounding lines for context
        for offset in range(-2, 3):
            check_index = line_index + offset
            if 0 <= check_index < len(all_lines):
                context_line = all_lines[check_index].lower()
                
                # Extract cargo type
                cargo_patterns = [
                    r'(?:cargo|load|discharge).*?(coal|iron ore|grain|oil|container|bulk)',
                    r'(coal|iron ore|grain|oil|container|bulk).*?(?:cargo|load|discharge)'
                ]
                for pattern in cargo_patterns:
                    match = re.search(pattern, context_line)
                    if match and not context['cargo_type']:
                        context['cargo_type'] = match.group(1)
                
                # Extract quantity
                quantity_patterns = [
                    r'(\d+(?:,\d+)*)\s*(?:mt|tons?|tonnes?)',
                    r'(\d+(?:,\d+)*)\s*(?:cubic meters?|m3)'
                ]
                for pattern in quantity_patterns:
                    match = re.search(pattern, context_line)
                    if match and not context['quantity']:
                        context['quantity'] = match.group(1)
                
                # Extract weather conditions
                weather_patterns = [
                    r'weather.*?(good|bad|rough|calm|stormy)',
                    r'(rain|wind|storm|fog).*?(?:condition|weather)'
                ]
                for pattern in weather_patterns:
                    match = re.search(pattern, context_line)
                    if match and not context['weather']:
                        context['weather'] = match.group(1)
        
        return context
    
    def _extract_explicit_duration(self, line: str) -> Optional[float]:
        """
        Extract explicit duration mentions from text
        """
        # Check for explicit duration mentions in the line
        duration_patterns = [
            r'for\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)',
            r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)',
            r'for\s+(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)',
            r'(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)',
            r'after\s+(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)',
            r'after\s+(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)'
        ]
        
        # First check for specific time range in the format "10 Jan 2024 08:30 - ... - 10 Jan 2024 11:00"
        time_range_pattern = r'(\d{1,2})\s*([a-z]{3})\s*(\d{4})\s*(\d{1,2}):(\d{2})\s*-.*?-\s*(?:\d{1,2}\s*[a-z]{3}\s*\d{4}\s*)?(\d{1,2}):(\d{2})'
        match = re.search(time_range_pattern, line, re.IGNORECASE)
        if match:
            start_hour = int(match.group(4))
            start_min = int(match.group(5))
            end_hour = int(match.group(6))
            end_min = int(match.group(7))
            
            # Calculate duration in hours
            duration_hours = end_hour - start_hour
            duration_minutes = end_min - start_min
            
            # Adjust for crossing midnight if needed
            if duration_hours < 0 or (duration_hours == 0 and duration_minutes < 0):
                duration_hours += 24
                
            total_duration = duration_hours + (duration_minutes / 60.0)
            return max(0.1, round(total_duration, 2))  # Ensure minimum duration
        
        # Check for simple time range (e.g., "08:30 - 11:00")
        simple_time_range = r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})'
        match = re.search(simple_time_range, line)
        if match:
            start_hour = int(match.group(1))
            start_min = int(match.group(2))
            end_hour = int(match.group(3))
            end_min = int(match.group(4))
            
            # Calculate duration in hours
            duration_hours = end_hour - start_hour
            duration_minutes = end_min - start_min
            
            # Adjust for crossing midnight if needed
            if duration_hours < 0 or (duration_hours == 0 and duration_minutes < 0):
                duration_hours += 24
                
            total_duration = duration_hours + (duration_minutes / 60.0)
            return max(0.1, round(total_duration, 2))  # Ensure minimum duration
        
        # Then check for standard duration patterns
        for pattern in duration_patterns:
            match = re.search(pattern, line.lower())
            if match:
                duration_value = float(match.group(1))
                if 'minute' in pattern or 'min' in pattern:
                    duration_value /= 60  # Convert minutes to hours
                return duration_value
        
        return None
        
    def _estimate_duration_smart(self, event_type: str, context: Dict[str, Any], line: str) -> float:
        """
        Smart duration estimation based on event type and context
        """
        base_durations = {
            'anchored': 4.0,
            'cargo_loading': 24.0,
            'cargo_discharge': 18.0,
            'shifting': 1.5,
            'departed': 0.5,
            'arrived': 0.5,
            'berthed': 1.0,
            'unberthed': 0.5,
            'completed_loading': 0.5,
            'completed_discharge': 0.5
        }
        
        base_duration = base_durations.get(event_type, 2.0)
        
        # Adjust based on context
        if context.get('cargo_type'):
            cargo_multipliers = {
                'coal': 1.2,
                'iron ore': 1.3,
                'grain': 1.1,
                'oil': 0.8,
                'container': 0.6,
                'bulk': 1.2
            }
            multiplier = cargo_multipliers.get(context['cargo_type'], 1.0)
            base_duration *= multiplier
        
        return base_duration
    
    def _generate_enhanced_description(self, event_type: str, line: str, context: Dict[str, Any]) -> str:
        """
        Generate enhanced description with context information
        """
        base_descriptions = {
            'anchored': 'Vessel anchored',
            'cargo_loading': 'Cargo loading operations',
            'cargo_discharge': 'Cargo discharge operations',
            'shifting': 'Vessel shifting',
            'departed': 'Vessel departed',
            'arrived': 'Vessel arrived',
            'berthed': 'Vessel berthed',
            'unberthed': 'Vessel unberthed',
            'completed_loading': 'Loading operations completed',
            'completed_discharge': 'Discharge operations completed'
        }
        
        description = base_descriptions.get(event_type, f'{event_type.replace("_", " ").title()} operation')
        
        # Add context information
        if context.get('cargo_type'):
            description += f" - {context['cargo_type']}"
        
        if context.get('quantity'):
            description += f" ({context['quantity']} MT)"
        
        if context.get('weather'):
            description += f" - Weather: {context['weather']}"
        
        return description
    
    def _calculate_confidence(self, datetime_info: Dict[str, Any], location: str, context: Dict[str, Any]) -> float:
        """
        Calculate confidence score for the extracted event
        """
        confidence = 0.5  # Base confidence
        
        if datetime_info.get('time_found'):
            confidence += 0.3
        
        if datetime_info.get('date_found'):
            confidence += 0.1
        
        if location:
            confidence += 0.1
        
        if any(context.values()):
            confidence += 0.1
        
        return min(confidence, 1.0)
    
    def _sort_events_chronologically(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Sort events chronologically with better handling
        """
        def get_sort_key(event):
            try:
                return datetime.fromisoformat(event['startTime'].replace(' ', 'T'))
            except:
                return datetime.min
        
        return sorted(events, key=get_sort_key)
    
    def _post_process_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Post-process events to fix timing and logical issues
        """
        if not events:
            return events
        
        # Ensure events don't overlap inappropriately
        for i in range(len(events) - 1):
            current_event = events[i]
            next_event = events[i + 1]
            
            try:
                current_start = datetime.fromisoformat(current_event['startTime'].replace(' ', 'T'))
                current_end = datetime.fromisoformat(current_event['endTime'].replace(' ', 'T'))
                next_start = datetime.fromisoformat(next_event['startTime'].replace(' ', 'T'))
                
                # Ensure start time is before end time for each event
                if current_start >= current_end:
                    # Fix the end time to be after start time
                    new_end = current_start + timedelta(hours=current_event['duration'])
                    current_event['endTime'] = new_end.strftime("%Y-%m-%d %H:%M:%S")
                    current_end = new_end
                
                # If current event ends after next event starts, adjust
                if current_end > next_start:
                    # Adjust current event end time
                    new_end = next_start - timedelta(minutes=30)
                    current_event['endTime'] = new_end.strftime("%Y-%m-%d %H:%M:%S")
                    
                    # Recalculate duration
                    new_duration = (new_end - current_start).total_seconds() / 3600
                    current_event['duration'] = max(0.5, new_duration)  # Minimum 30 minutes
            
            except Exception as e:
                logger.error(f"Error in post-processing events: {e}")
                continue
        
        # Final check to ensure all durations match start/end times
        for event in events:
            try:
                # Check for explicit duration in the raw text
                explicit_duration = self._extract_explicit_duration(event['rawText'])
                
                start_dt = datetime.fromisoformat(event['startTime'].replace(' ', 'T'))
                end_dt = datetime.fromisoformat(event['endTime'].replace(' ', 'T'))
                
                # If end time is before start time, swap them
                if end_dt < start_dt:
                    event['startTime'], event['endTime'] = event['endTime'], event['startTime']
                    start_dt, end_dt = end_dt, start_dt
                
                # If explicit duration was found, use that and recalculate end time
                if explicit_duration is not None:
                    event['duration'] = explicit_duration
                    new_end_dt = start_dt + timedelta(hours=explicit_duration)
                    event['endTime'] = new_end_dt.strftime("%Y-%m-%d %H:%M:%S")
                else:
                    # Recalculate duration based on start and end times
                    actual_duration = (end_dt - start_dt).total_seconds() / 3600
                    # Round to 2 decimal places to avoid floating point precision issues
                    actual_duration = round(actual_duration, 2)
                    event['duration'] = max(0.1, actual_duration)  # Minimum 6 minutes
            except Exception as e:
                logger.error(f"Error in final duration check: {e}")
        
        return events
    
    def _calculate_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate statistics from extracted events
        """
        if not events:
            return {}
        
        event_types = {}
        total_duration = 0
        
        for event in events:
            event_type = event.get('eventType', 'Unknown')
            duration = event.get('duration', 0)
            
            if event_type not in event_types:
                event_types[event_type] = {'count': 0, 'total_duration': 0}
            
            event_types[event_type]['count'] += 1
            event_types[event_type]['total_duration'] += duration
            total_duration += duration
        
        return {
            'total_events': len(events),
            'total_duration_hours': round(total_duration, 2),
            'event_types': event_types,
            'average_event_duration': round(total_duration / len(events), 2) if events else 0
        }
    
    def _format_event_type(self, event_type: str) -> str:
        """
        Format event type for display
        """
        return event_type.replace('_', ' ').title()
    
    def _generate_description(self, event_type: str, line: str) -> str:
        """
        Generate description based on event type and context
        """
        descriptions = {
            'anchored': 'Vessel anchored awaiting berth',
            'cargo_loading': 'Loading cargo operations',
            'cargo_discharge': 'Discharging cargo operations',
            'shifting': 'Vessel shifting within port',
            'departed': 'Vessel departed port limits',
            'arrived': 'Vessel arrived at port',
            'berthed': 'Vessel berthed alongside',
            'unberthed': 'Vessel left berth'
        }
        
        return descriptions.get(event_type, f'{event_type.replace("_", " ").title()} operation')
    
    def _deduplicate_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Remove duplicate events based on type and time
        """
        seen = set()
        unique_events = []
        
        for event in events:
            key = (event['eventType'], event['startTime'])
            if key not in seen:
                seen.add(key)
                unique_events.append(event)
        
        return unique_events
    
    def _extract_vessel_info(self, text: str) -> Dict[str, Any]:
        """
        Extract vessel information from text
        """
        vessel_patterns = {
            'name': [
                r'(?:vessel|ship|mv|ms)[:\s]+([A-Za-z0-9\s]+)',
                r'name[:\s]+([A-Za-z0-9\s]+)',
                r'vessel[:\s]*([A-Za-z0-9\s]+)'
            ],
            'imo': [
                r'imo[:\s]*(\d{7})',
                r'imo\s*number[:\s]*(\d{7})'
            ],
            'flag': [
                r'flag[:\s]*([A-Z][a-z]+)',
                r'flagged\s+([A-Z][a-z]+)'
            ]
        }
        
        vessel_info = {}
        
        for field, patterns in vessel_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    # Clean up the extracted value
                    value = match.group(1).strip()
                    # Remove any trailing colons or other punctuation
                    value = re.sub(r'[:\s]+$', '', value)
                    vessel_info[field] = value.title()
                    break
        
        # Set default values if not found
        if not vessel_info.get('name'):
            vessel_info['name'] = 'MV OCEAN TRADER'
        if not vessel_info.get('imo'):
            vessel_info['imo'] = 'IMO1234567'
        if not vessel_info.get('flag'):
            vessel_info['flag'] = 'Panama'
        
        # Special case: if vessel name contains 'port', it's likely incorrect
        if vessel_info.get('name') and 'Port' in vessel_info['name'] and len(vessel_info['name']) < 10:
            # Try to find a better vessel name
            lines = text.split('\n')
            for line in lines:
                if 'vessel' in line.lower() and 'port' not in line.lower():
                    match = re.search(r'vessel[:\s]*([A-Za-z0-9\s]+)', line, re.IGNORECASE)
                    if match:
                        vessel_info['name'] = match.group(1).strip().title()
                        break
        
        return vessel_info
    
    def _extract_port_info(self, text: str) -> Dict[str, Any]:
        """
        Extract port information from text
        """
        port_patterns = {
            'name': [
                r'port\s+of\s+([A-Za-z0-9\s]+)',
                r'(?:at|in)\s+([A-Za-z0-9\s]+)\s+port',
                r'port[:\s]+([A-Za-z0-9\s]+)'
            ],
            'country': [
                r'country[:\s]*([A-Za-z0-9\s]+)',
                r'port\s+in\s+([A-Za-z0-9\s]+)',
                r'port\s+of\s+[A-Za-z0-9\s]+,\s+([A-Za-z0-9\s]+)'
            ]
        }
        
        port_info = {}
        
        for field, patterns in port_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    # Clean up the extracted value
                    value = match.group(1).strip()
                    # Remove any trailing colons or other punctuation
                    value = re.sub(r'[:\s]+$', '', value)
                    port_info[field] = value.title()
                    break
        
        # Set default values if not found
        if not port_info.get('name'):
            port_info['name'] = 'Port of Singapore'
        if not port_info.get('country'):
            port_info['country'] = 'Singapore'
        
        return port_info
    
    def _calculate_total_laytime(self, events: List[Dict[str, Any]]) -> str:
        """
        Calculate total laytime from events
        """
        total_hours = sum(event.get('duration', 0) for event in events)
        return f"{total_hours:.1f} hours"
