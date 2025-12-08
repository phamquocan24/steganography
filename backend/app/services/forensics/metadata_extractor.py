"""
Metadata Extraction Service
----------------------------
Extracts and analyzes image metadata including EXIF, GPS, and embedded comments.

Author: Senior DevOps Engineer
Version: 1.0.0
"""

import io
import re
import base64
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import logging

logger = logging.getLogger(__name__)


class MetadataExtractor:
    """
    Professional-grade metadata extraction with security controls
    and comprehensive error handling.
    """
    
    # Security: Define allowed metadata keys to prevent information leakage
    SAFE_EXIF_TAGS = {
        'Make', 'Model', 'Software', 'DateTime', 'DateTimeOriginal',
        'DateTimeDigitized', 'Orientation', 'XResolution', 'YResolution',
        'ResolutionUnit', 'ExposureTime', 'FNumber', 'ISO', 'Flash',
        'FocalLength', 'WhiteBalance', 'ColorSpace', 'Artist', 'Copyright',
        'ImageDescription', 'UserComment'
    }
    
    # Suspicious patterns that may indicate steganography
    SUSPICIOUS_PATTERNS = {
        'base64': re.compile(r'(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?'),
        'ctf_flag': re.compile(r'(?:CTF|FLAG|flag)\{[^}]+\}', re.IGNORECASE),
        'url': re.compile(r'https?://[^\s]+'),
        'email': re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
        'hex': re.compile(r'0x[0-9a-fA-F]{8,}'),
        'path': re.compile(r'(?:[A-Z]:\\|/)[^\x00-\x1F\s]+'),
    }
    
    def __init__(self):
        """Initialize metadata extractor with logging."""
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def extract(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Main extraction method with comprehensive error handling.
        
        Args:
            image_bytes: Raw image data
            
        Returns:
            Dictionary containing all extracted metadata and analysis
            
        Raises:
            ValueError: If image cannot be processed
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            
            return {
                'basic': self._extract_basic_info(img, len(image_bytes)),
                'exif': self._extract_exif_data(img),
                'gps': self._extract_gps_data(img),
                'comments': self._extract_comments(img),
                'software_info': self._extract_software_info(img),
                'suspicious_findings': self._detect_suspicious_metadata(img),
                'metadata_hash': self._calculate_metadata_hash(img),
                'extraction_timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            
        except Exception as e:
            self.logger.error(f"Metadata extraction failed: {str(e)}")
            raise ValueError(f"Failed to extract metadata: {str(e)}")
    
    def _extract_basic_info(self, img: Image.Image, file_size: int) -> Dict[str, Any]:
        """Extract basic image properties."""
        return {
            'format': img.format or 'Unknown',
            'mode': img.mode,
            'size': {
                'width': img.width,
                'height': img.height,
                'dimensions': f"{img.width}x{img.height}",
                'megapixels': round((img.width * img.height) / 1_000_000, 2)
            },
            'file_size': {
                'bytes': file_size,
                'kb': round(file_size / 1024, 2),
                'mb': round(file_size / (1024 * 1024), 2)
            },
            'color_info': {
                'mode': img.mode,
                'bands': len(img.getbands()) if hasattr(img, 'getbands') else 0,
                'has_alpha': img.mode in ('RGBA', 'LA', 'PA')
            },
            'dpi': img.info.get('dpi', (0, 0))
        }
    
    def _extract_exif_data(self, img: Image.Image) -> Dict[str, Any]:
        """
        Extract EXIF data with security filtering.
        
        Only extracts safe, whitelisted EXIF tags to prevent
        potential security issues.
        """
        try:
            exif_data = img._getexif()
            if not exif_data:
                return {'available': False, 'data': {}}
            
            parsed_exif = {}
            camera_info = {}
            capture_settings = {}
            datetime_info = {}
            
            for tag_id, value in exif_data.items():
                tag_name = TAGS.get(tag_id, str(tag_id))
                
                # Security: Only process whitelisted tags
                if tag_name not in self.SAFE_EXIF_TAGS:
                    continue
                
                # Convert bytes to string
                if isinstance(value, bytes):
                    try:
                        value = value.decode('utf-8', errors='ignore')
                    except:
                        value = str(value)
                
                # Categorize EXIF data
                if tag_name in ('Make', 'Model', 'Software'):
                    camera_info[tag_name.lower()] = value
                elif tag_name in ('DateTime', 'DateTimeOriginal', 'DateTimeDigitized'):
                    datetime_info[tag_name.lower()] = value
                elif tag_name in ('ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'Flash', 'WhiteBalance'):
                    capture_settings[tag_name.lower()] = value
                else:
                    parsed_exif[tag_name.lower()] = value
            
            return {
                'available': True,
                'camera': camera_info,
                'datetime': datetime_info,
                'capture_settings': capture_settings,
                'other': parsed_exif,
                'tag_count': len(exif_data)
            }
            
        except Exception as e:
            self.logger.warning(f"EXIF extraction failed: {str(e)}")
            return {'available': False, 'error': str(e)}
    
    def _extract_gps_data(self, img: Image.Image) -> Dict[str, Any]:
        """Extract and parse GPS coordinates."""
        try:
            exif_data = img._getexif()
            if not exif_data:
                return {'available': False}
            
            gps_ifd = exif_data.get(34853)  # GPSInfo tag
            if not gps_ifd:
                return {'available': False}
            
            gps_data = {}
            for tag_id, value in gps_ifd.items():
                tag_name = GPSTAGS.get(tag_id, str(tag_id))
                gps_data[tag_name] = value
            
            # Parse coordinates
            if 'GPSLatitude' in gps_data and 'GPSLongitude' in gps_data:
                lat = self._convert_gps_coordinate(
                    gps_data['GPSLatitude'],
                    gps_data.get('GPSLatitudeRef', 'N')
                )
                lon = self._convert_gps_coordinate(
                    gps_data['GPSLongitude'],
                    gps_data.get('GPSLongitudeRef', 'E')
                )
                
                return {
                    'available': True,
                    'latitude': lat,
                    'longitude': lon,
                    'altitude': gps_data.get('GPSAltitude', 'Unknown'),
                    'timestamp': gps_data.get('GPSTimeStamp', 'Unknown'),
                    'coordinates_string': f"{lat}, {lon}",
                    'google_maps_url': f"https://www.google.com/maps?q={lat},{lon}"
                }
            
            return {'available': True, 'data': gps_data}
            
        except Exception as e:
            self.logger.warning(f"GPS extraction failed: {str(e)}")
            return {'available': False, 'error': str(e)}
    
    def _convert_gps_coordinate(self, coord: Tuple, ref: str) -> float:
        """Convert GPS coordinate from degrees/minutes/seconds to decimal."""
        try:
            degrees = float(coord[0])
            minutes = float(coord[1])
            seconds = float(coord[2])
            
            decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
            
            if ref in ('S', 'W'):
                decimal = -decimal
            
            return round(decimal, 6)
        except:
            return 0.0
    
    def _extract_comments(self, img: Image.Image) -> Dict[str, Any]:
        """Extract image comments and descriptions."""
        comments = {}
        
        # PIL info dict
        for key in ('Comment', 'comment', 'Description', 'description', 
                   'ImageDescription', 'UserComment'):
            if key in img.info:
                value = img.info[key]
                if isinstance(value, bytes):
                    value = value.decode('utf-8', errors='ignore')
                comments[key.lower()] = value
        
        # Check EXIF for comments
        try:
            exif = img._getexif()
            if exif:
                for tag_id, value in exif.items():
                    tag_name = TAGS.get(tag_id, '')
                    if 'comment' in tag_name.lower() or 'description' in tag_name.lower():
                        if isinstance(value, bytes):
                            value = value.decode('utf-8', errors='ignore')
                        comments[tag_name.lower()] = value
        except:
            pass
        
        return {
            'available': bool(comments),
            'data': comments,
            'total_length': sum(len(str(v)) for v in comments.values())
        }
    
    def _extract_software_info(self, img: Image.Image) -> Dict[str, Any]:
        """Extract software and editing history."""
        software_info = {
            'software': img.info.get('Software', img.info.get('software', 'Unknown')),
            'creator_tool': img.info.get('CreatorTool', 'Unknown'),
            'photoshop_present': False,
            'gimp_present': False,
            'metadata_present': False
        }
        
        # Check for Photoshop/GIMP signatures
        try:
            exif = img._getexif()
            if exif:
                software_str = str(exif.get(305, '')).lower()  # Software tag
                software_info['photoshop_present'] = 'photoshop' in software_str
                software_info['gimp_present'] = 'gimp' in software_str
        except:
            pass
        
        # Check for XMP/IPTC metadata (advanced editing)
        if hasattr(img, 'applist'):
            software_info['metadata_present'] = len(img.applist) > 0
        
        return software_info
    
    def _detect_suspicious_metadata(self, img: Image.Image) -> List[Dict[str, Any]]:
        """
        Detect suspicious patterns in metadata that may indicate steganography.
        
        Returns:
            List of suspicious findings with severity and details
        """
        findings = []
        
        # Collect all text metadata
        all_text = []
        for key, value in img.info.items():
            if isinstance(value, (str, bytes)):
                if isinstance(value, bytes):
                    try:
                        value = value.decode('utf-8', errors='ignore')
                    except:
                        continue
                all_text.append((key, value))
        
        # Check EXIF comments
        try:
            exif = img._getexif()
            if exif:
                for tag_id, value in exif.items():
                    tag_name = TAGS.get(tag_id, '')
                    if isinstance(value, (str, bytes)):
                        if isinstance(value, bytes):
                            value = value.decode('utf-8', errors='ignore')
                        all_text.append((tag_name, value))
        except:
            pass
        
        # Analyze each text field
        for key, text in all_text:
            # Long comments (suspicious)
            if len(text) > 200:
                findings.append({
                    'type': 'Long Metadata',
                    'severity': 'medium',
                    'location': key,
                    'message': f'Unusually long metadata field ({len(text)} chars)',
                    'preview': text[:100] + '...'
                })
            
            # Pattern matching
            for pattern_name, pattern in self.SUSPICIOUS_PATTERNS.items():
                matches = pattern.findall(text)
                if matches:
                    severity = 'high' if pattern_name == 'ctf_flag' else 'medium'
                    findings.append({
                        'type': f'{pattern_name.upper()} Pattern',
                        'severity': severity,
                        'location': key,
                        'message': f'Found {len(matches)} {pattern_name} pattern(s)',
                        'matches': matches[:5]  # Limit to 5 matches
                    })
        
        # Check for unusual metadata count
        total_metadata = len(img.info)
        try:
            exif = img._getexif()
            if exif:
                total_metadata += len(exif)
        except:
            pass
        
        if total_metadata > 50:
            findings.append({
                'type': 'Excessive Metadata',
                'severity': 'low',
                'message': f'Image has {total_metadata} metadata fields (unusually high)',
                'recommendation': 'Review metadata for hidden information'
            })
        
        return findings
    
    def _calculate_metadata_hash(self, img: Image.Image) -> str:
        """Calculate hash of metadata for integrity checking."""
        import hashlib
        
        metadata_str = str(sorted(img.info.items()))
        try:
            exif = img._getexif()
            if exif:
                metadata_str += str(sorted(exif.items()))
        except:
            pass
        
        return hashlib.sha256(metadata_str.encode()).hexdigest()[:16]


# Testing function
if __name__ == "__main__":
    # Quick test
    logging.basicConfig(level=logging.INFO)
    extractor = MetadataExtractor()
    
    # Create test image with metadata
    test_img = Image.new('RGB', (100, 100), color='red')
    test_img.info['Comment'] = 'Test comment CTF{test_flag}'
    
    buffer = io.BytesIO()
    test_img.save(buffer, format='PNG')
    
    result = extractor.extract(buffer.getvalue())
    print("Metadata extraction test:")
    print(f"- Basic info: {result['basic']['size']}")
    print(f"- Suspicious findings: {len(result['suspicious_findings'])}")
