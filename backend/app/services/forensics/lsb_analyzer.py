"""
LSB Analysis Service
--------------------
Advanced Least Significant Bit extraction and analysis.

Author: Senior DevOps Engineer
Version: 1.0.0
"""

import io
import hashlib
import uuid
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from collections import Counter
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)


class LSBAnalyzer:
    """
    Enterprise-grade LSB extraction with file type detection and data analysis.
    
    Features:
        - Multi-channel LSB extraction (RGB, individual channels)
        - Configurable bit depth (1-8 bits per channel)
        - LSB/MSB order support
        - File signature detection
        - Text encoding detection
        - Entropy analysis
        - Automatic file saving for download
    """
    
    # File signatures (magic bytes)
    FILE_SIGNATURES = {
        b'PK\x03\x04': {'type': 'ZIP', 'ext': '.zip', 'mime': 'application/zip'},
        b'PK\x05\x06': {'type': 'ZIP (empty)', 'ext': '.zip', 'mime': 'application/zip'},
        b'\x89PNG\r\n\x1a\n': {'type': 'PNG', 'ext': '.png', 'mime': 'image/png'},
        b'\xff\xd8\xff': {'type': 'JPEG', 'ext': '.jpg', 'mime': 'image/jpeg'},
        b'GIF87a': {'type': 'GIF', 'ext': '.gif', 'mime': 'image/gif'},
        b'GIF89a': {'type': 'GIF', 'ext': '.gif', 'mime': 'image/gif'},
        b'%PDF': {'type': 'PDF', 'ext': '.pdf', 'mime': 'application/pdf'},
        b'Rar!\x1a\x07': {'type': 'RAR', 'ext': '.rar', 'mime': 'application/x-rar'},
        b'7z\xbc\xaf\x27\x1c': {'type': '7-Zip', 'ext': '.7z', 'mime': 'application/x-7z-compressed'},
        b'\x1f\x8b\x08': {'type': 'GZIP', 'ext': '.gz', 'mime': 'application/gzip'},
        b'BM': {'type': 'BMP', 'ext': '.bmp', 'mime': 'image/bmp'},
        b'RIFF': {'type': 'WebP/WAV', 'ext': '.webp', 'mime': 'image/webp'},
        b'\x00\x00\x00\x0c': {'type': 'JPEG2000', 'ext': '.jp2', 'mime': 'image/jp2'},
    }
    
    # Text encodings to try
    TEXT_ENCODINGS = ['utf-8', 'ascii', 'latin-1', 'utf-16-le', 'utf-16-be', 'cp1252']
    
    def __init__(self, temp_dir: str = './temp_extracted'):
        """
        Initialize LSB analyzer.
        
        Args:
            temp_dir: Directory to save extracted files
        """
        self.temp_dir = Path(temp_dir)
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def extract(
        self,
        image_bytes: bytes,
        channels: str = 'RGB',
        bit_order: str = 'LSB',
        bits_per_channel: int = 1,
        max_bytes: int = 1024 * 1024  # 1MB default max
    ) -> Dict[str, Any]:
        """
        Extract hidden data from LSB with comprehensive analysis.
        
        Args:
            image_bytes: Raw image data
            channels: Which channels to use ('RGB', 'R', 'G', 'B', etc.)
            bit_order: 'LSB' or 'MSB'
            bits_per_channel: Number of bits to extract per channel (1-8)
            max_bytes: Maximum bytes to extract (safety limit)
            
        Returns:
            Dictionary with extracted data and analysis
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            
            # Con vert to RGB if needed
            if img.mode not in ('RGB', 'RGBA'):
                img = img.convert('RGB')
            
            img_array = np.array(img)
            
            # Extract LSB data
            extracted_bytes = self._extract_lsb_data(
                img_array,
                channels,
                bit_order,
                bits_per_channel,
                max_bytes
            )
            
            if not extracted_bytes:
                return {
                    'success': False,
                    'error': 'No data extracted',
                    'extracted_size': 0
                }
            
            # Analyze extracted data
            data_info = self._analyze_extracted_data(extracted_bytes)
            file_detection = self._detect_file_type(extracted_bytes)
            text_analysis = self._try_decode_text(extracted_bytes)
            entropy_analysis = self._analyze_entropy(extracted_bytes)
            
            # Save file for download
            file_info = self._save_extracted_file(
                extracted_bytes,
                file_detection.get('ext', '.bin')
            )
            
            # Overall assessment
            assessment = self._assess_data_quality(
                extracted_bytes,
                file_detection,
                text_analysis,
                entropy_analysis
            )
            
            return {
                'success': True,
                'extraction_config': {
                    'channels': channels,
                    'bit_order': bit_order,
                    'bits_per_channel': bits_per_channel
                },
                'data_info': data_info,
                'file_detection': file_detection,
                'text_analysis': text_analysis,
                'entropy_analysis': entropy_analysis,
                'file_download': file_info,
                'assessment': assessment
            }
            
        except Exception as e:
            self.logger.error(f"LSB extraction failed: {str(e)}")
            raise ValueError(f"Failed to extract LSB data: {str(e)}")
    
    def _extract_lsb_data(
        self,
        img_array: np.ndarray,
        channels: str,
        bit_order: str,
        bits_per_channel: int,
        max_bytes: int
    ) -> bytes:
        """
        Core LSB extraction algorithm.
        
        Returns:
            Extracted bytes
        """
        height, width = img_array.shape[:2]
        
        # Determine which channels to use
        channel_indices = self._parse_channels(channels, img_array.shape[2] if len(img_array.shape) == 3 else 1)
        
        # Collect bits
        bit_array = []
        max_bits = max_bytes * 8
        
        for y in range(height):
            for x in range(width):
                if len(bit_array) >= max_bits:
                    break
                
                pixel = img_array[y, x]
                
                for ch_idx in channel_indices:
                    if len(img_array.shape) == 2:
                        channel_value = pixel
                    else:
                        channel_value = pixel[ch_idx]
                    
                    # Extract bits
                    if bit_order == 'LSB':
                        for bit_pos in range(bits_per_channel):
                            bit = (channel_value >> bit_pos) & 1
                            bit_array.append(bit)
                    else:  # MSB
                        for bit_pos in range(bits_per_channel):
                            bit = (channel_value >> (7 - bit_pos)) & 1
                            bit_array.append(bit)
                    
                    if len(bit_array) >= max_bits:
                        break
                
                if len(bit_array) >= max_bits:
                    break
        
        # Convert bits to bytes
        return self._bits_to_bytes(bit_array)
    
    def _parse_channels(self, channels_str: str, available_channels: int) -> List[int]:
        """Parse channel string to indices."""
        channel_map = {'R': 0, 'G': 1, 'B': 2, 'A': 3}
        
        if channels_str == 'RGB':
            return [0, 1, 2] if available_channels >= 3 else list(range(available_channels))
        elif channels_str == 'RGBA':
            return list(range(min(4, available_channels)))
        else:
            # Individual channels like 'R', 'RG', etc.
            indices = []
            for ch in channels_str:
                if ch in channel_map:
                    idx = channel_map[ch]
                    if idx < available_channels:
                        indices.append(idx)
            return indices if indices else [0]
    
    def _bits_to_bytes(self, bits: List[int]) -> bytes:
        """Convert bit array to bytes."""
        byte_array = []
        
        for i in range(0, len(bits), 8):
            byte_bits = bits[i:i+8]
            
            if len(byte_bits) < 8:
                # Pad with zeros
                byte_bits.extend([0] * (8 - len(byte_bits)))
            
            # Convert bits to byte (MSB first)
            byte_val = sum(bit << (7 - idx) for idx, bit in enumerate(byte_bits))
            byte_array.append(byte_val)
        
        return bytes(byte_array)
    
    def _analyze_extracted_data(self, data: bytes) -> Dict[str, Any]:
        """Analyze basic properties of extracted data."""
        size_bytes = len(data)
        
        # Preview first bytes in hex
        preview_hex = ' '.join(f'{b:02x}' for b in data[:32])
        
        # Count byte frequencies
        byte_counts = Counter(data)
        most_common = byte_counts.most_common(5)
        
        return {
            'size_bytes': size_bytes,
            'size_kb': round(size_bytes / 1024, 2),
            'size_mb': round(size_bytes / (1024 * 1024), 2),
            'first_32_bytes_hex': preview_hex,
            'md5_hash': hashlib.md5(data).hexdigest(),
            'sha256_hash': hashlib.sha256(data).hexdigest()[:32],
            'most_common_bytes': [
                {'byte': f'0x{b:02x}', 'count': c, 'percentage': round(c/size_bytes*100, 2)}
                for b, c in most_common
            ]
        }
    
    def _detect_file_type(self, data: bytes) -> Dict[str, Any]:
        """Detect file type from magic bytes."""
        # Check known signatures
        for signature, info in self.FILE_SIGNATURES.items():
            if data.startswith(signature):
                return {
                    'detected': True,
                    'type': info['type'],
                    'ext': info['ext'],
                    'mime': info['mime'],
                    'confidence': 'high',
                    'signature': ' '.join(f'{b:02x}' for b in signature)
                }
        
        # Try python-magic if available
        try:
            import magic
            mime = magic.from_buffer(data, mime=True)
            file_type = magic.from_buffer(data)
            
            return {
                'detected': True,
                'type': file_type,
                'mime': mime,
                'ext': self._mime_to_ext(mime),
                'confidence': 'medium'
            }
        except ImportError:
            pass
        except Exception as e:
            self.logger.warning(f"Magic detection failed: {str(e)}")
        
        # Unknown file type
        return {
            'detected': False,
            'type': 'Unknown',
            'ext': '.bin',
            'confidence': 'none'
        }
    
    def _try_decode_text(self, data: bytes) -> Dict[str, Any]:
        """Try to decode data as text in various encodings."""
        results = []
        
        for encoding in self.TEXT_ENCODINGS:
            try:
                decoded = data.decode(encoding)
                
                # Check if text is mostly printable
                printable_count = sum(1 for c in decoded if c.isprintable() or c in '\n\r\t')
                printable_ratio = printable_count / len(decoded) if decoded else 0
                
                if printable_ratio > 0.7:  # At least 70% printable
                    results.append({
                        'encoding': encoding,
                        'printable_ratio': round(printable_ratio, 3),
                        'preview': decoded[:200],
                        'full_text': decoded if len(decoded) < 10000 else decoded[:10000] + '\n[truncated...]',
                        'length': len(decoded),
                        'confidence': 'high' if printable_ratio > 0.9 else 'medium'
                    })
            except (UnicodeDecodeError, AttributeError):
                continue
        
        if results:
            # Return best match (highest printable ratio)
            best = max(results, key=lambda x: x['printable_ratio'])
            return {
                'is_text': True,
                'best_encoding': best,
                'all_matches': results
            }
        
        return {'is_text': False}
    
    def _analyze_entropy(self, data: bytes) -> Dict[str, Any]:
        """Calculate entropy and randomness metrics."""
        if not data:
            return {'entropy': 0, 'normalized_entropy': 0}
        
        # Byte frequency
        byte_counts = Counter(data)
        total = len(data)
        
        # Shannon entropy
        entropy = -sum(
            (count / total) * np.log2(count / total)
            for count in byte_counts.values()
        )
        normalized_entropy = entropy / 8.0  # Normalize to 0-1
        
        # Chi-square test for randomness
        expected = total / 256
        chi_square = sum(
            (count - expected) ** 2 / expected
            for count in byte_counts.values()
        )
        
        # Serial correlation (measure of pattern)
        serial_corr = self._calculate_serial_correlation(data)
        
        # Convert numpy types to Python native types for JSON serialization
        return {
            'entropy': float(entropy),
            'normalized_entropy': float(normalized_entropy),
            'chi_square': float(chi_square),
            'serial_correlation': float(serial_corr),
            'is_high_entropy': bool(normalized_entropy > 0.95),
            'is_random': bool(abs(serial_corr) < 0.1),
            'assessment': self._assess_randomness(normalized_entropy, serial_corr)
        }
    
    def _calculate_serial_correlation(self, data: bytes, lag: int = 1) -> float:
        """Calculate serial correlation (pattern detection)."""
        if len(data) < lag + 1:
            return 0.0
        
        arr = np.array(list(data))
        n = len(arr) - lag
        
        if n <= 0:
            return 0.0
        
        mean = np.mean(arr)
        
        numerator = np.sum((arr[:-lag] - mean) * (arr[lag:] - mean))
        denominator = np.sum((arr - mean) ** 2)
        
        if denominator == 0:
            return 0.0
        
        return numerator / denominator
    
    def _assess_randomness(self, entropy: float, correlation: float) -> str:
        """Assess data randomness level."""
        if entropy > 0.95 and abs(correlation) < 0.1:
            return 'Very Random (likely encrypted/compressed)'
        elif entropy > 0.8:
            return 'Random (possibly encrypted)'
        elif entropy > 0.5:
            return 'Semi-random (mixed data)'
        else:
            return 'Patterned (likely meaningful data)'
    
    def _assess_data_quality(
        self,
        data: bytes,
        file_detection: Dict,
        text_analysis: Dict,
        entropy_analysis: Dict
    ) -> Dict[str, Any]:
        """Overall assessment of extracted data quality."""
        confidence_score = 0
        indicators = []
        
        # File signature detected
        if file_detection.get('detected') and file_detection.get('confidence') == 'high':
            confidence_score += 40
            indicators.append(f"Valid {file_detection['type']} file signature detected")
        
        # Text detected
        if text_analysis.get('is_text'):
            confidence_score += 30
            indicators.append(f"Valid text in {text_analysis['best_encoding']['encoding']}")
        
        # High entropy (encrypted/compressed data)
        if entropy_analysis.get('is_high_entropy'):
            confidence_score += 20
            indicators.append("High entropy suggests compressed/encrypted data")
        
        # Low entropy but structured
        if entropy_analysis.get('normalized_entropy', 0) < 0.5 and not text_analysis.get('is_text'):
            confidence_score -= 20
            indicators.append("Low entropy with no text (likely noise)")
        
        # Determine likelihood
        if confidence_score >= 60:
            likelihood = 'Very Likely'
            color = 'green'
        elif confidence_score >= 30:
            likelihood = 'Possibly'
            color = 'yellow'
        else:
            likelihood = 'Unlikely'
            color = 'red'
        
        return {
            'contains_hidden_data': bool(confidence_score >= 30),
            'confidence_score': int(confidence_score),
            'likelihood': likelihood,
            'color': color,
            'indicators': indicators,
            'recommendations': self._generate_recommendations(file_detection, text_analysis, entropy_analysis)
        }
    
    def _generate_recommendations(
        self,
        file_detection: Dict,
        text_analysis: Dict,
        entropy_analysis: Dict
    ) -> List[str]:
        """Generate actionable recommendations."""
        recommendations = []
        
        if file_detection.get('detected'):
            recommendations.append(
                f"Download and examine the {file_detection['type']} file"
            )
        
        if text_analysis.get('is_text'):
            recommendations.append("Review extracted text for hidden messages")
        
        if entropy_analysis.get('is_high_entropy'):
            recommendations.append(
                "High entropy data may be encrypted - try password-based tools (steghide)"
            )
        
        if not file_detection.get('detected') and not text_analysis.get('is_text'):
            recommendations.append(
                "Try different extraction parameters (channels, bit order, bits per channel)"
            )
            recommendations.append("Consider trying MSB instead of LSB")
        
        return recommendations
    
    def _save_extracted_file(self, data: bytes, extension: str) -> Dict[str, str]:
        """Save extracted data to file for download."""
        file_id = str(uuid.uuid4())
        filename = f"extracted_{file_id}{extension}"
        filepath = self.temp_dir / filename
        
        try:
            with open(filepath, 'wb') as f:
                f.write(data)
            
            return {
                'available': True,
                'file_id': file_id,
                'filename': filename,
                'filepath': str(filepath),
                'download_url': f'/api/forensics/download/{file_id}',
                'size_bytes': len(data)
            }
        except Exception as e:
            self.logger.error(f"Failed to save extracted file: {str(e)}")
            return {
                'available': False,
                'error': str(e)
            }
    
    def _mime_to_ext(self, mime: str) -> str:
        """Convert MIME type to file extension."""
        mime_map = {
            'application/zip': '.zip',
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'application/pdf': '.pdf',
            'text/plain': '.txt',
            'application/json': '.json'
        }
        return mime_map.get(mime, '.bin')


# Testing function
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    analyzer = LSBAnalyzer(temp_dir='./test_temp')
    
    # Create test image with embedded text
    test_img = np.random.randint(0, 256, (100, 100, 3), dtype=np.uint8)
    test_text = b"CTF{hidden_flag_12345}"
    
    # Embed text in LSB
    bit_array = []
    for byte in test_text:
        for i in range(8):
            bit_array.append((byte >> (7-i)) & 1)
    
    # Embed in red channel LSB
    for i, bit in enumerate(bit_array):
        y = i // test_img.shape[1]
        x = i % test_img.shape[1]
        if y < test_img.shape[0]:
            test_img[y, x, 0] = (test_img[y, x, 0] & 0xFE) | bit
    
    # Convert to bytes
    img_pil = Image.fromarray(test_img, mode='RGB')
    buffer = io.BytesIO()
    img_pil.save(buffer, format='PNG')
    
    result = analyzer.extract(buffer.getvalue(), channels='R', bits_per_channel=1)
    print("LSB extraction test:")
    print(f"- Success: {result['success']}")
    print(f"- Size extracted: {result['data_info']['size_bytes']} bytes")
    print(f"- Text detected: {result['text_analysis'].get('is_text', False)}")
    if result['text_analysis'].get('is_text'):
        print(f"- Text preview: {result['text_analysis']['best_encoding']['preview']}")
