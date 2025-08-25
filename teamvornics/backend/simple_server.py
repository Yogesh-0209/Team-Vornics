def detect_anomalies_simple(events):
    """
    A simple function to detect anomalies in events
    """
    for event in events:
        # Check for missing end time
        if not event.get('endTime'):
            event['anomalies'] = event.get('anomalies', []) + ['Missing end time']
        
        # Check for end time before start time
        elif event.get('startTime') and event.get('endTime'):
            try:
                start = event['startTime']
                end = event['endTime']
                if start > end:
                    event['anomalies'] = event.get('anomalies', []) + ['End time before start time']
            except Exception:
                pass
        
        # Check for unusually long duration
        if event.get('duration', 0) > 24:
            event['anomalies'] = event.get('anomalies', []) + ['Unusually long duration']
    
    return events