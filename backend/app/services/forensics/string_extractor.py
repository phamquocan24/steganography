"""
String Extraction Service
-------------------------
Extracts and analyzes strings from binary data with advanced pattern recognition.

Author: Senior DevOps Engineer
Version: 1.0.0
"""

import re
import base64
import binascii
from typing import Dict, List, Any, Set, Tuple
from collections import Counter
from chardet import detect
import logging

logger = logging.getLogger(__name__)


class StringExtractor:
    """
    Enterprise-grade string extraction with security-focused pattern recognition.
    
    Features:
        - Multi-encoding support (ASCII, UTF-8, UTF-16, Latin-1)
        - Pattern matching (URLs, emails, IPs, paths, base64, hex)
        - CTF flag detection
        - Statistical analysis
        - Automated base64 validation and decoding
    """
    
    # Minimum string length to avoid noise
    MIN_STRING_LENGTH = 4
    
    # Regex patterns for common data types
    PATTERNS = {
        'url': re.compile(
            rb'https?://(?:[a-zA-Z0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        ),
        'email': re.compile(
            rb'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        ),
        'ipv4': re.compile(
            rb'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        ),
        'ipv6': re.compile(
            rb'\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b'
        ),
        'base64': re.compile(
            rb'(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})'
        ),
        'hex': re.compile(
            rb'(?:0x)?[0-9a-fA-F]{8,}'
        ),
        'windows_path': re.compile(
            rb'[A-Z]:\\(?:[^\x00-\x1F\x7F"<>|*?]+\\)*[^\x00-\x1F\x7F"<>|*?]+'
        ),
        'linux_path': re.compile(
            rb'/(?:[a-zA-Z0-9._-]+/)*[a-zA-Z0-9._-]+'
        ),
        'mac_address': re.compile(
            rb'(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}'
        ),
        'ctf_flag': re.compile(
            rb'(?:CTF|FLAG|flag)\{[^}]{1,100}\}'
        ),
        'uuid': re.compile(
            rb'\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b'
        ),
        'jwt': re.compile(
            rb'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'
        )
    }
    
    # Security keywords to flag
    SECURITY_KEYWORDS = {
        'password', 'passwd', 'pwd', 'pass', 'credential', 'cred',
        'token', 'api_key', 'apikey', 'secret', 'private_key',
        'access_token', 'auth', 'authorization', 'session'
    }
    
    def __init__(self, min_length: int = 4):
        """
        Initialize string extractor.
        
        Args:
            min_length: Minimum string length to extract (default: 4)
        """
        self.min_length = max(min_length, 1)
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def extract(self, data: bytes, max_strings: int = 1000) -> Dict[str, Any]:
        """
        Main extraction method with comprehensive analysis.
        
        Args:
            data: Binary data to analyze
            max_strings: Maximum strings to return (prevents memory issues)
            
        Returns:
            Dictionary with extracted strings and analysis
        """
        try:
            # Extract strings in different encodings
            ascii_strings = self._extract_ascii(data)
            utf8_strings = self._extract_utf8(data)
            utf16_strings = self._extract_utf16(data)
            
            # Find special patterns
            patterns = self._find_patterns(data)
            
            # Detect encoding
            encoding_info = self._detect_encoding(data)
            
            # Statistical analysis
            all_strings = list(set(ascii_strings + utf8_strings + utf16_strings))
            stats = self._calculate_statistics(all_strings)
            
            # Security analysis
            suspicious = self._detect_suspicious_strings(all_strings, patterns)
            
            return {
                'ascii_strings': ascii_strings[:max_strings],
                'utf8_strings': utf8_strings[:max_strings],
                'utf16_strings': utf16_strings[:max_strings],
                'patterns': patterns,
                'encoding_info': encoding_info,
                'statistics': stats,
                'suspicious_findings': suspicious,
                'total_unique_strings': len(all_strings)
            }
            
        except Exception as e:
            self.logger.error(f"String extraction failed: {str(e)}")
            raise ValueError(f"Failed to extract strings: {str(e)}")
    
    def _extract_ascii(self, data: bytes) -> List[str]:
        """Extract ASCII printable strings (0x20-0x7E)."""
        pattern = rb'[\x20-\x7E]{' + str(self.min_length).encode() + rb',}'
        matches = re.findall(pattern, data)
        return [m.decode('ascii', errors='ignore') for m in matches]
    
    def _extract_utf8(self, data: bytes) -> List[str]:
        """Extract UTF-8 strings."""
        # Pattern for UTF-8 continuation bytes
        pattern = rb'(?:[\x20-\x7E]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}){' + str(self.min_length).encode() + rb',}'
        matches = re.findall(pattern, data)
        
        utf8_strings = []
        for m in matches:
            try:
                decoded = m.decode('utf-8')
                # Filter out if it's just ASCII (already captured)
                if not all(ord(c) < 128 for c in decoded):
                    utf8_strings.append(decoded)
            except UnicodeDecodeError:
                continue
        
        return utf8_strings
    
    def _extract_utf16(self, data: bytes) -> List[str]:
        """Extract UTF-16 encoded strings."""
        utf16_strings = []
        
        # Try both little-endian and big-endian
        for encoding in ('utf-16-le', 'utf-16-be'):
            try:
                decoded = data.decode(encoding, errors='ignore')
                # Extract printable sequences
                pattern = r'[\x20-\x7E]{' + str(self.min_length) + r',}'
                matches = re.findall(pattern, decoded)
                utf16_strings.extend(matches)
            except:
                continue
        
        return list(set(utf16_strings))
    
    def _find_patterns(self, data: bytes) -> Dict[str, List[Any]]:
        """
        Find special patterns using regex.
        
        Returns:
            Dictionary of pattern type -> list of matches
        """
        results = {}
        
        for pattern_name, pattern in self.PATTERNS.items():
            matches = pattern.findall(data)
            
            if matches:
                decoded_matches = []
                for m in matches:
                    try:
                        decoded = m.decode('utf-8', errors='ignore')
                        decoded_matches.append(decoded)
                    except:
                        decoded_matches.append(str(m))
                
                # Special handling for base64
                if pattern_name == 'base64':
                    decoded_matches = self._validate_and_decode_base64(decoded_matches)
                
                # Remove duplicates while preserving order
                seen = set()
                unique_matches = []
                for item in decoded_matches:
                    # For base64, use the 'encoded' key as identifier
                    identifier = item['encoded'] if isinstance(item, dict) else item
                    if identifier not in seen:
                        seen.add(identifier)
                        unique_matches.append(item)
                
                results[pattern_name] = unique_matches[:100]  # Limit to 100 per pattern
        
        return results
    
    def _validate_and_decode_base64(self, candidates: List[str]) -> List[Dict[str, str]]:
        """
        Validate base64 strings and attempt decoding.
        
        Returns:
            List of dicts with 'encoded', 'decoded', and 'is_binary' keys
        """
        valid_base64 = []
        
        for candidate in candidates:
            # Skip if too short
            if len(candidate) < 8:
                continue
            
            # Must be multiple of 4 or have padding
            if len(candidate) % 4 != 0:
                continue
            
            try:
                # Attempt to decode
                decoded_bytes = base64.b64decode(candidate)
                
                # Check if decoded data is printable text
                try:
                    decoded_text = decoded_bytes.decode('utf-8')
                    is_printable = all(32 <= ord(c) <= 126 or c in '\n\r\t' for c in decoded_text)
                    
                    valid_base64.append({
                        'encoded': candidate,
                        'decoded': decoded_text if is_printable else '<binary data>',
                        'decoded_length': len(decoded_bytes),
                        'is_binary': not is_printable,
                        'confidence': 'high' if is_printable else 'medium'
                    })
                except UnicodeDecodeError:
                    # Binary data
                    valid_base64.append({
                        'encoded': candidate,
                        'decoded': f'<binary: {len(decoded_bytes)} bytes>',
                        'decoded_length': len(decoded_bytes),
                        'is_binary': True,
                        'confidence': 'medium'
                    })
                    
            except (binascii.Error, ValueError):
                # Not valid base64
                continue
        
        return valid_base64
    
    def _detect_encoding(self, data: bytes) -> Dict[str, Any]:
        """Detect the primary encoding of the data."""
        try:
            detection = detect(data)
            
            return {
                'encoding': detection.get('encoding', 'unknown'),
                'confidence': detection.get('confidence', 0),
                'language': detection.get('language', 'unknown')
            }
        except Exception as e:
            self.logger.warning(f"Encoding detection failed: {str(e)}")
            return {
                'encoding': 'unknown',
                'confidence': 0,
                'language': 'unknown'
            }
    
    def _calculate_statistics(self, strings: List[str]) -> Dict[str, Any]:
        """Calculate statistical metrics on extracted strings."""
        if not strings:
            return {
                'total_strings': 0,
                'unique_strings': 0,
                'average_length': 0,
                'median_length': 0,
                'longest_string_length': 0,
                'shortest_string_length': 0
            }
        
        lengths = [len(s) for s in strings]
        sorted_lengths = sorted(lengths)
        
        # Most common strings
        counter = Counter(strings)
        most_common = counter.most_common(10)
        
        return {
            'total_strings': len(strings),
            'unique_strings': len(set(strings)),
            'average_length': round(sum(lengths) / len(lengths), 2),
            'median_length': sorted_lengths[len(sorted_lengths) // 2],
            'longest_string_length': max(lengths),
            'shortest_string_length': min(lengths),
            'most_common_strings': [
                {'string': s, 'count': c} 
                for s, c in most_common
            ]
        }
    
    def _detect_suspicious_strings(
        self, 
        strings: List[str], 
        patterns: Dict[str, List]
    ) -> List[Dict[str, Any]]:
        """
        Detect suspicious strings that may indicate security issues or hidden data.
        
        Returns:
            List of suspicious findings with severity and details
        """
        findings = []
        
        # Check for security keywords
        for string in strings:
            lower_string = string.lower()
            for keyword in self.SECURITY_KEYWORDS:
                if keyword in lower_string:
                    findings.append({
                        'type': 'Security Keyword',
                        'severity': 'high',
                        'keyword': keyword,
                        'context': string,
                        'message': f'Found security-sensitive keyword: {keyword}',
                        'recommendation': 'Review for potential credential leakage'
                    })
                    break  # Only flag once per string
        
        # Check for CTF flags (high priority)
        if 'ctf_flag' in patterns and patterns['ctf_flag']:
            findings.append({
                'type': 'CTF Flag Detected',
                'severity': 'critical',
                'flags': patterns['ctf_flag'],
                'message': f'Found {len(patterns["ctf_flag"])} potential CTF flag(s)',
                'recommendation': 'This may be a CTF challenge or test file'
            })
        
        # Check for multiple base64 strings (suspicious)
        if 'base64' in patterns and len(patterns['base64']) > 5:
            findings.append({
                'type': 'Multiple Base64 Strings',
                'severity': 'medium',
                'count': len(patterns['base64']),
                'message': f'Found {len(patterns["base64"])} base64-encoded strings',
                'recommendation': 'Review decoded content for hidden data'
            })
        
        # Check for private keys
        key_indicators = ['BEGIN RSA PRIVATE KEY', 'BEGIN PRIVATE KEY', 'BEGIN OPENSSH PRIVATE KEY']
        for string in strings:
            if any(indicator in string for indicator in key_indicators):
                findings.append({
                    'type': 'Private Key Detected',
                    'severity': 'critical',
                    'message': 'Potential private key found in image',
                    'recommendation': 'IMMEDIATE ACTION REQUIRED: Remove private key',
                    'context': string[:100] + '...'
                })
        
        # Check for JWT tokens
        if 'jwt' in patterns and patterns['jwt']:
            findings.append({
                'type': 'JWT Token Detected',
                'severity': 'high',
                'count': len(patterns['jwt']),
                'message': f'Found {len(patterns["jwt"])} JWT token(s)',
                'tokens': patterns['jwt'][:3],  # Show first 3
                'recommendation': 'Verify if these are valid authentication tokens'
            })
        
        # Check for unusual string patterns
        long_strings = [s for s in strings if len(s) > 100]
        if long_strings:
            findings.append({
                'type': 'Long Strings',
                'severity': 'low',
                'count': len(long_strings),
                'message': f'Found {len(long_strings)} strings longer than 100 characters',
                'preview': long_strings[0][:100] + '...' if long_strings else '',
                'recommendation': 'Long strings may contain encoded data'
            })
        
        return findings


# Testing function
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    extractor = StringExtractor(min_length=4)
    
    # Test data
    test_data = b"""
    This is a test string.
    Email: test@example.com
    URL: https://example.com/path
    Base64: VGhpcyBpcyBhIHRlc3Q=
    CTF{test_flag_12345}
    Password: secret123
    192.168.1.1
    C:\\Users\\Test\\file.txt
    """
    
    result = extractor.extract(test_data)
    print("String extraction test:")
    print(f"- ASCII strings found: {len(result['ascii_strings'])}")
    print(f"- Patterns found: {list(result['patterns'].keys())}")
    print(f"- Suspicious findings: {len(result['suspicious_findings'])}")
