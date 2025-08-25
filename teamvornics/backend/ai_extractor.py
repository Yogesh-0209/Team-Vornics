import os
import logging
import traceback
from typing import Dict, Any, List, Optional
import json
import re
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class AIExtractor:
    """
    Advanced AI-powered data extraction module for processing documents and extracting structured information.
    This module enhances the existing extraction pipeline with more powerful AI capabilities.
    """
    
    def __init__(self):
        """
        Initialize the AI Extractor with necessary models and configurations.
        """
        logger.info("Initializing AI Extractor module")
        self.nltk_available = False
        self.spacy_available = False
        self.transformers_available = False
        self.ai_ready = False
        
        try:
            # Import AI libraries conditionally to handle environments where they might not be available
            try:
                import nltk
                from nltk.tokenize import sent_tokenize, word_tokenize
                
                # Download necessary NLTK resources
                try:
                    nltk.download('punkt', quiet=True)
                    nltk.download('averaged_perceptron_tagger', quiet=True)
                    nltk.download('maxent_ne_chunker', quiet=True)
                    nltk.download('words', quiet=True)
                    self.nltk_available = True
                    logger.info("NLTK resources downloaded successfully")
                except Exception as e:
                    logger.warning(f"Failed to download NLTK resources: {str(e)}")
                    logger.warning("Please install NLTK with: pip install nltk")
            except ImportError:
                logger.error("NLTK not available. Please install with: pip install nltk")
            
            # Try to import more advanced AI libraries if available
            try:
                import spacy
                try:
                    self.nlp = spacy.load("en_core_web_sm")
                    self.spacy_available = True
                    logger.info("Spacy model loaded successfully")
                except OSError:
                    logger.error("Spacy model 'en_core_web_sm' not found. Please install with: python -m spacy download en_core_web_sm")
            except ImportError:
                logger.error("Spacy not available. Please install with: pip install spacy")
            except Exception as e:
                logger.error(f"Failed to load Spacy model: {str(e)}")
                self.spacy_available = False
                
            # Try to import transformers for more advanced extraction if available
            try:
                from transformers import pipeline
                try:
                    self.ner_pipeline = pipeline("ner")
                    self.qa_pipeline = pipeline("question-answering")
                    self.transformers_available = True
                    logger.info("Transformer models loaded successfully")
                except Exception as e:
                    logger.error(f"Failed to initialize transformer pipelines: {str(e)}")
                    logger.error("This might be due to missing model files or insufficient permissions")
                    self.transformers_available = False
            except ImportError:
                logger.error("Transformers not available. Please install with: pip install transformers torch")
                self.transformers_available = False
            except Exception as e:
                logger.error(f"Failed to load transformer models: {str(e)}")
                self.transformers_available = False
                
            self.ai_ready = True
            logger.info("AI Extractor initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing AI Extractor: {str(e)}")
            logger.error(traceback.format_exc())
            self.ai_ready = False
    
    def extract_structured_data(self, text: str, document_name: str) -> Dict[str, Any]:
        """
        Extract structured data from text using available AI capabilities.
        Falls back to simpler methods if advanced AI is not available.
        
        Args:
            text: The text content extracted from the document
            document_name: Name of the document being processed
            
        Returns:
            Dictionary containing structured data extracted from the text
        """
        logger.info(f"Extracting structured data from {document_name} using AI")
        
        if not text or len(text.strip()) < 10:
            logger.warning("Text is too short for meaningful extraction")
            return {"error": "Text is too short for meaningful extraction"}
        
        try:
            # Extract basic document metadata
            metadata = self._extract_metadata(text, document_name)
            
            # Extract events using the best available method
            events = self._extract_events(text)
            
            # Extract vessel information
            vessel_info = self._extract_vessel_info(text)
            
            # Extract port information
            port_info = self._extract_port_info(text)
            
            # Calculate statistics
            statistics = self._calculate_statistics(events)
            
            # Combine all extracted information
            result = {
                "events": events,
                "vesselInfo": vessel_info,
                "portInfo": port_info,
                "totalLaytime": f"{statistics.get('total_duration_hours', 0):.1f} hours",
                "statistics": statistics,
                "documentDate": metadata.get("document_date", datetime.now().strftime("%Y-%m-%d")),
                "extractedFrom": document_name,
                "totalEvents": len(events),
                "extractionTimestamp": datetime.now().isoformat(),
                "aiExtraction": True,
                "extractionQuality": self._assess_extraction_quality(events, text)
            }
            
            logger.info(f"Successfully extracted {len(events)} events and metadata using AI")
            return result
            
        except Exception as e:
            logger.error(f"Error in AI extraction: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "error": f"AI extraction failed: {str(e)}",
                "events": [],
                "extractedFrom": document_name,
                "extractionTimestamp": datetime.now().isoformat(),
                "aiExtraction": False
            }
    
    def _extract_metadata(self, text: str, document_name: str) -> Dict[str, Any]:
        """
        Extract document metadata like dates, reference numbers, etc.
        """
        metadata = {}
        
        # Extract document date using regex patterns
        date_patterns = [
            r'Date[\s:]+([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})',
            r'([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})',
            r'([0-9]{4}[\/-][0-9]{1,2}[\/-][0-9]{1,2})'
        ]
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Use the first date found
                try:
                    # Try to parse the date in various formats
                    date_str = matches[0]
                    if '/' in date_str:
                        parts = date_str.split('/')
                    elif '-' in date_str:
                        parts = date_str.split('-')
                    else:
                        continue
                        
                    if len(parts) != 3:
                        continue
                        
                    # Handle different date formats
                    if len(parts[2]) == 4:  # DD/MM/YYYY
                        metadata["document_date"] = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                    elif len(parts[0]) == 4:  # YYYY/MM/DD
                        metadata["document_date"] = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
                    else:  # MM/DD/YYYY or DD/MM/YYYY (assume DD/MM/YYYY)
                        if int(parts[1]) <= 12:  # Could be month
                            metadata["document_date"] = f"20{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                    
                    break
                except Exception as e:
                    logger.warning(f"Failed to parse date: {str(e)}")
        
        # If no date found, use current date
        if "document_date" not in metadata:
            metadata["document_date"] = datetime.now().strftime("%Y-%m-%d")
        
        # Extract reference numbers
        ref_patterns = [
            r'Ref[\s.]*[#:]*[\s.]*([A-Z0-9-]+)',
            r'Reference[\s.]*[#:]*[\s.]*([A-Z0-9-]+)',
            r'No[\s.]*[#:]*[\s.]*([A-Z0-9-]+)'
        ]
        
        for pattern in ref_patterns:
            matches = re.findall(pattern, text)
            if matches:
                metadata["reference_number"] = matches[0]
                break
        
        return metadata
    
    def _extract_events(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract events from text using the best available AI method.
        """
        events = []
        
        # Use the best available method for extraction
        if self.spacy_available:
            try:
                events = self._extract_events_with_spacy(text)
                if events:
                    logger.info(f"Extracted {len(events)} events using Spacy")
                    return events
            except Exception as e:
                logger.warning(f"Spacy extraction failed: {str(e)}")
        
        if self.transformers_available:
            try:
                events = self._extract_events_with_transformers(text)
                if events:
                    logger.info(f"Extracted {len(events)} events using Transformers")
                    return events
            except Exception as e:
                logger.warning(f"Transformer extraction failed: {str(e)}")
        
        # Fall back to rule-based extraction
        events = self._extract_events_rule_based(text)
        logger.info(f"Extracted {len(events)} events using rule-based approach")
        return events
    
    def _extract_events_with_spacy(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract events using Spacy NLP model.
        """
        events = []
        doc = self.nlp(text)
        
        # Process each sentence as a potential event
        for sent in doc.sents:
            # Skip very short sentences
            if len(sent.text.split()) < 3:
                continue
                
            # Check if sentence contains date and time patterns
            has_date = any(token.like_num and len(token.text) >= 4 for token in sent)
            has_time = re.search(r'\d{1,2}:\d{2}', sent.text) is not None
            
            if has_date or has_time:
                # Extract event type
                event_type = "Unknown"
                for token in sent:
                    if token.pos_ == "VERB" and token.text.lower() in ["arrived", "departed", "anchored", "berthed", "loading", "discharging"]:
                        event_type = token.text.title()
                        break
                
                # Extract location
                location = "Unknown"
                for ent in sent.ents:
                    if ent.label_ in ["GPE", "LOC", "FAC"]:
                        location = ent.text
                        break
                
                # Extract times
                times = re.findall(r'\d{1,2}:\d{2}', sent.text)
                start_time = times[0] if times else "00:00"
                end_time = times[1] if len(times) > 1 else ""
                
                # Extract date
                date_match = re.search(r'\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}', sent.text)
                date = date_match.group(0) if date_match else datetime.now().strftime("%Y-%m-%d")
                
                # Create event
                event = {
                    "eventType": event_type,
                    "startTime": f"{date} {start_time}",
                    "endTime": f"{date} {end_time}" if end_time else "",
                    "duration": 1.0,  # Default duration
                    "location": location,
                    "description": sent.text.strip()
                }
                
                events.append(event)
        
        return events
    
    def _extract_events_with_transformers(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract events using transformer models.
        """
        events = []
        
        # Split text into manageable chunks
        chunks = [text[i:i+512] for i in range(0, len(text), 512)]
        
        for chunk in chunks:
            # Extract named entities
            entities = self.ner_pipeline(chunk)
            
            # Group entities by sentence
            sentences = re.split(r'[.!?]\s+', chunk)
            for sentence in sentences:
                if len(sentence.strip()) < 10:
                    continue
                    
                # Check if sentence contains event-related terms
                event_terms = ["arrived", "departed", "anchored", "berthed", "loading", "discharging", "completed"]
                if not any(term in sentence.lower() for term in event_terms):
                    continue
                
                # Extract event type using QA
                event_type = "Unknown"
                try:
                    event_type_result = self.qa_pipeline({
                        'question': 'What type of event is described?',
                        'context': sentence
                    })
                    event_type = event_type_result['answer']
                except:
                    # Fall back to rule-based extraction
                    for term in event_terms:
                        if term in sentence.lower():
                            event_type = term.title()
                            break
                
                # Extract times
                times = re.findall(r'\d{1,2}:\d{2}', sentence)
                start_time = times[0] if times else "00:00"
                end_time = times[1] if len(times) > 1 else ""
                
                # Extract date
                date_match = re.search(r'\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}', sentence)
                date = date_match.group(0) if date_match else datetime.now().strftime("%Y-%m-%d")
                
                # Create event
                event = {
                    "eventType": event_type,
                    "startTime": f"{date} {start_time}",
                    "endTime": f"{date} {end_time}" if end_time else "",
                    "duration": 1.0,  # Default duration
                    "location": "Unknown",
                    "description": sentence.strip()
                }
                
                events.append(event)
        
        return events
    
    def _extract_events_rule_based(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract events using rule-based approach as fallback.
        """
        events = []
        
        # Define event patterns
        event_patterns = {
            'Anchored': [r'anchor(?:ed|ing|age)', r'drop(?:ped)?\s+anchor'],
            'Arrived': [r'arriv(?:ed|al)', r'reached', r'entered\s+port'],
            'Berthed': [r'berth(?:ed|ing)', r'alongside', r'made\s+fast'],
            'Cargo Loading': [r'(?:commenced|start(?:ed)?|begin)\s+(?:loading|cargo)', r'loading\s+(?:commenced|started)'],
            'Cargo Discharge': [r'(?:commenced|start(?:ed)?|begin)\s+(?:discharging|discharge)', r'discharging\s+(?:commenced|started)'],
            'Completed Loading': [r'completed\s+loading', r'loading\s+completed'],
            'Completed Discharge': [r'completed\s+discharge', r'discharge\s+completed'],
            'Departed': [r'depart(?:ed|ure)', r'left\s+(?:port|berth)', r'sailed'],
            'Shifting': [r'shift(?:ed|ing)', r'moved?\s+to', r'proceed(?:ed)?\s+to']
        }
        
        # Define time pattern
        time_pattern = r'(\d{1,2})[:.]?(\d{2})\s*(?:hrs?|hours?)?'
        date_pattern = r'(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})'
        
        # Split text into lines
        lines = text.split('\n')
        
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Process each line
        for line in lines:
            line = line.strip()
            if len(line) < 5:
                continue
                
            # Check for date in the line
            date_match = re.search(date_pattern, line)
            if date_match:
                day, month, year = date_match.groups()
                if len(year) == 2:
                    year = f"20{year}"
                current_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                logger.info(f"Found date in text: {current_date}")
            
            # Check for event patterns
            event_type = None
            for event_name, patterns in event_patterns.items():
                if any(re.search(pattern, line, re.IGNORECASE) for pattern in patterns):
                    event_type = event_name
                    break
            
            if not event_type:
                continue
                
            # Extract times
            times = re.findall(time_pattern, line)
            start_time = None
            end_time = None
            
            if times:
                logger.info(f"Found time(s) in text: {times}")
                
                # Extract start and end times if available
                if len(times) >= 1:
                    hour, minute = times[0]
                    start_time = f"{current_date} {hour.zfill(2)}:{minute}:00"
                    
                if len(times) >= 2:
                    hour, minute = times[1]
                    end_time = f"{current_date} {hour.zfill(2)}:{minute}:00"
            
            # If no time found, try to extract date only
            if not start_time and date_match:
                # Use 00:00 as default time if only date is available
                start_time = f"{current_date} 00:00:00"
                
            if not start_time:
                continue
                
            logger.info(f"Extracted event: {event_type} at {start_time}")
                
            # Extract location if available
            location = "Unknown"
            location_patterns = [r'at\s+([A-Za-z\s]+)', r'in\s+([A-Za-z\s]+)']
            for pattern in location_patterns:
                location_match = re.search(pattern, line)
                if location_match:
                    location = location_match.group(1).strip()
                    break
                
            # Calculate duration
            duration = 1.0  # Default duration
            if end_time:
                start_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                end_dt = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
                duration = (end_dt - start_dt).total_seconds() / 3600
            else:
                # If no end time, estimate based on event type
                if event_type in ['Anchored', 'Berthed']:
                    # These events typically last longer
                    start_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                    end_dt = start_dt + timedelta(hours=4)
                    end_time = end_dt.strftime("%Y-%m-%d %H:%M:%S")
                    duration = 4.0
                else:
                    # Other events typically last about an hour
                    start_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                    end_dt = start_dt + timedelta(hours=1)
                    end_time = end_dt.strftime("%Y-%m-%d %H:%M:%S")
                    duration = 1.0
            
            # Update location with more specific patterns
            location_patterns = [r'at\s+([A-Za-z0-9\s]+(?:berth|terminal|port|anchorage|area))', r'to\s+([A-Za-z0-9\s]+(?:berth|terminal|port|anchorage|area))']
            for pattern in location_patterns:
                location_match = re.search(pattern, line, re.IGNORECASE)
                if location_match:
                    location = location_match.group(1).strip()
                    break
            
            # Create event
            event = {
                "eventType": event_type,
                "startTime": start_time,
                "endTime": end_time,  # We now always have an end time
                "duration": max(0.1, duration),  # Ensure positive duration
                "location": location,
                "description": line.strip()
            }
            
            logger.info(f"Created event: {event_type} from {start_time} to {end_time} at {location}")
            
            events.append(event)
        
        return events
    
    def _extract_vessel_info(self, text: str) -> Dict[str, Any]:
        """
        Extract vessel information from text.
        """
        vessel_info = {
            "name": "Unknown",
            "imo": "",
            "flag": "",
            "dwt": 0
        }
        
        # Extract vessel name
        vessel_patterns = [
            r'[Vv]essel\s*(?:[Nn]ame)?\s*:?\s*([A-Z][A-Za-z0-9\s]+)',
            r'[Mm][Vv]\s+([A-Z][A-Za-z0-9\s]+)',
            r'[Mm][Ss]\s+([A-Z][A-Za-z0-9\s]+)'
        ]
        
        for pattern in vessel_patterns:
            matches = re.findall(pattern, text)
            if matches:
                vessel_info["name"] = matches[0].strip()
                break
        
        # Extract IMO number
        imo_pattern = r'IMO\s*:?\s*(\d{7})'
        imo_matches = re.findall(imo_pattern, text)
        if imo_matches:
            vessel_info["imo"] = f"IMO{imo_matches[0]}"
        
        # Extract flag
        flag_pattern = r'[Ff]lag\s*:?\s*([A-Za-z]+)'
        flag_matches = re.findall(flag_pattern, text)
        if flag_matches:
            vessel_info["flag"] = flag_matches[0]
        
        # Extract DWT
        dwt_pattern = r'[Dd][Ww][Tt]\s*:?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)'
        dwt_matches = re.findall(dwt_pattern, text)
        if dwt_matches:
            try:
                vessel_info["dwt"] = int(dwt_matches[0].replace(',', ''))
            except ValueError:
                pass
        
        return vessel_info
    
    def _extract_port_info(self, text: str) -> Dict[str, Any]:
        """
        Extract port information from text.
        """
        port_info = {
            "name": "Unknown",
            "country": "",
            "code": ""
        }
        
        # Extract port name
        port_patterns = [
            r'[Pp]ort\s*(?:[Oo]f)?\s*:?\s*([A-Z][A-Za-z\s]+)',
            r'[Aa]t\s+(?:the\s+)?[Pp]ort\s+(?:[Oo]f)?\s+([A-Z][A-Za-z\s]+)'
        ]
        
        for pattern in port_patterns:
            matches = re.findall(pattern, text)
            if matches:
                port_info["name"] = matches[0].strip()
                break
        
        # Common port codes
        port_codes = {
            "Singapore": "SGSIN",
            "Rotterdam": "NLRTM",
            "Shanghai": "CNSHA",
            "Hong Kong": "HKHKG",
            "New York": "USNYC",
            "Los Angeles": "USLAX",
            "Dubai": "AEDXB",
            "Mumbai": "INBOM",
            "Sydney": "AUSYD"
        }
        
        # Try to match port name to code
        for port_name, code in port_codes.items():
            if port_name.lower() in port_info["name"].lower():
                port_info["code"] = code
                break
        
        # Extract country
        if port_info["code"]:
            port_info["country"] = {
                "SG": "Singapore",
                "NL": "Netherlands",
                "CN": "China",
                "HK": "Hong Kong",
                "US": "United States",
                "AE": "United Arab Emirates",
                "IN": "India",
                "AU": "Australia"
            }.get(port_info["code"][:2], "")
        
        return port_info
    
    def _calculate_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate statistics from extracted events.
        """
        if not events:
            return {
                "total_events": 0,
                "total_duration_hours": 0,
                "average_event_duration": 0,
                "anomalies_detected": 0
            }
        
        total_events = len(events)
        total_duration = sum(abs(event.get('duration', 0)) for event in events)
        average_duration = total_duration / total_events if total_events > 0 else 0
        anomalies_detected = sum(1 for event in events if event.get('anomalies'))
        
        return {
            "total_events": total_events,
            "total_duration_hours": total_duration,
            "average_event_duration": average_duration,
            "anomalies_detected": anomalies_detected
        }
    
    def _assess_extraction_quality(self, events: List[Dict[str, Any]], text: str) -> Dict[str, Any]:
        """
        Assess the quality of the extraction.
        """
        quality = {
            "confidence": 0.0,
            "completeness": 0.0,
            "issues": []
        }
        
        # Check if we have events
        if not events:
            quality["issues"].append("No events extracted")
            return quality
        
        # Check event completeness
        complete_events = 0
        for event in events:
            if all(k in event and event[k] for k in ["eventType", "startTime", "location"]):
                complete_events += 1
        
        quality["completeness"] = complete_events / len(events) if events else 0
        
        # Check for common event types
        expected_events = ["Arrived", "Berthed", "Cargo Loading", "Cargo Discharge", "Departed"]
        found_events = set(event["eventType"] for event in events)
        missing_events = [e for e in expected_events if e not in found_events]
        
        if missing_events:
            quality["issues"].append(f"Missing expected event types: {', '.join(missing_events)}")
        
        # Check text coverage
        text_length = len(text)
        event_text_length = sum(len(event.get("description", "")) for event in events)
        coverage_ratio = min(1.0, event_text_length / text_length if text_length > 0 else 0)
        
        # Calculate confidence based on completeness and coverage
        quality["confidence"] = (quality["completeness"] * 0.7) + (coverage_ratio * 0.3)
        
        # Check for anomalies
        anomalies = sum(1 for event in events if event.get("anomalies"))
        if anomalies > 0:
            quality["issues"].append(f"Found {anomalies} events with anomalies")
            quality["confidence"] *= (1 - (anomalies / len(events) * 0.5))
        
        return quality