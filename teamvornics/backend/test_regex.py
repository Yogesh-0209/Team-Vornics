import re

def test_regex_patterns():
    # Test cases
    test_cases = [
        ('5l', '51'),  # Should convert 'l' to '1'
        ('5O', '50'),  # Should convert 'O' to '0'
        ('Test 5l', 'Test 51'),
        ('Test 5O', 'Test 50'),
        ('l5', '15'),  # Should convert leading 'l' to '1'
        ('O5', '05'),  # Should convert leading 'O' to '0'
    ]
    
    # Original patterns that might cause issues
    original_patterns = [
        (r'\b(\d)l\b', r'\11'),  # This might cause "invalid group reference 11"
        (r'\b(\d)O\b', r'\10')   # This might cause "invalid group reference 10"
    ]
    
    # Fixed patterns using lambda functions
    fixed_patterns = [
        (r'\b(\d)l\b', lambda m: m.group(1) + '1'),
        (r'\b(\d)O\b', lambda m: m.group(1) + '0')
    ]
    
    print("Testing original patterns (might cause errors):")
    try:
        for pattern, replacement in original_patterns:
            for input_text, expected_output in test_cases:
                try:
                    result = re.sub(pattern, replacement, input_text)
                    print(f"Pattern: {pattern}, Input: {input_text}, Result: {result}")
                except Exception as e:
                    print(f"Error with pattern {pattern} on input {input_text}: {str(e)}")
    except Exception as e:
        print(f"Error in original patterns: {str(e)}")
    
    print("\nTesting fixed patterns with lambda functions:")
    try:
        for pattern, replacement in fixed_patterns:
            for input_text, expected_output in test_cases:
                try:
                    result = re.sub(pattern, replacement, input_text)
                    print(f"Pattern: {pattern}, Input: {input_text}, Result: {result}")
                except Exception as e:
                    print(f"Error with pattern {pattern} on input {input_text}: {str(e)}")
    except Exception as e:
        print(f"Error in fixed patterns: {str(e)}")

if __name__ == "__main__":
    test_regex_patterns()