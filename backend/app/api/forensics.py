"""
Forensics API Endpoints
------------------------
REST API for image forensics analysis.

Author: Senior DevOps Engineer
Version: 1.0.0
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from typing import Optional
import logging
from pathlib import Path

from backend.app.services.forensics import (
    MetadataExtractor,
    StringExtractor,
    VisualAnalyzer,
    LSBAnalyzer
)
from backend.app.services.forensics.superimposed_analyzer import analyze_superimposed
import tempfile
import os

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(
    prefix="/api/forensics",
    tags=["forensics"],
    responses={404: {"description": "Not found"}}
)

# Initialize analyzers (singleton pattern for performance)
metadata_extractor = MetadataExtractor()
string_extractor = StringExtractor()
visual_analyzer = VisualAnalyzer()
lsb_analyzer = LSBAnalyzer(temp_dir='./temp_extracted')


@router.post("/metadata")
async def extract_metadata(file: UploadFile = File(...)):
    """
    Extract all metadata from image including EXIF, GPS, and comments.
    
    **Returns:**
    - basic: Image properties
    - exif: EXIF data with camera, datetime, capture settings
    - gps: GPS coordinates if available
    - comments: Embedded comments and descriptions
    - suspicious_findings: Detected anomalies
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        if len(contents) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(status_code=400, detail="File too large (max 50MB)")
        
        result = metadata_extractor.extract(contents)
        
        return {
            "success": True,
            "filename": file.filename,
            "data": result
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Metadata extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/strings")
async def extract_strings(
    file: UploadFile = File(...),
    min_length: int = Query(4, ge=1, le=20, description="Minimum string length"),
    max_strings: int = Query(1000, ge=100, le=5000, description="Maximum strings to return")
):
    """
    Extract readable strings from image binary data.
    
    **Parameters:**
    - min_length: Minimum string length (default: 4)
    - max_strings: Maximum strings to return (default: 1000)
    
    **Returns:**
    - ascii_strings: ASCII printable strings
    - patterns: Special patterns (URLs, emails, base64, etc.)
    - encoding_info: Detected encoding
    - suspicious_findings: Security-relevant findings
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        extractor = StringExtractor(min_length=min_length)
        result = extractor.extract(contents, max_strings=max_strings)
        
        return {
            "success": True,
            "filename": file.filename,
            "data": result
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"String extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/visual")
async def visual_analysis(
    file: UploadFile = File(...),
    include_bit_planes: bool = Query(True, description="Extract all bit planes"),
    include_operations: bool = Query(True, description="Perform channel operations"),
    include_histograms: bool = Query(True, description="Calculate histograms")
):
    """
    Perform visual analysis: channel decomposition and bit plane extraction.
    
    **Parameters:**
    - include_bit_planes: Extract all 8 bit planes (default: true)
    - include_operations: Perform channel operations (default: true)
    - include_histograms: Calculate color histograms (default: true)
    
    **Returns:**
    - channels: Separate R, G, B, Alpha channels as base64 images
    - bit_planes: All 8 bit planes for each channel
    - operations: XOR, ADD, SUB operations between channels
    - histograms: Color distribution data
    - anomaly_analysis: Detected visual anomalies
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Limit image size for visual analysis (memory intensive)
        if len(contents) > 20 * 1024 * 1024:  # 20MB
            raise HTTPException(
                status_code=400,
                detail="Image too large for visual analysis (max 20MB)"
            )
        
        result = visual_analyzer.analyze(
            contents,
            include_bit_planes=include_bit_planes,
            include_operations=include_operations,
            include_histograms=include_histograms
        )
        
        return {
            "success": True,
            "filename": file.filename,
            "data": result
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Visual analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/lsb/extract")
async def extract_lsb(
    file: UploadFile = File(...),
    channels: str = Query('RGB', description="Channels to use (RGB, R, G, B, RG, etc.)"),
    bit_order: str = Query('LSB', description="Bit order (LSB or MSB)"),
    bits_per_channel: int = Query(1, ge=1, le=8, description="Bits per channel (1-8)"),
    max_bytes: int = Query(1024*1024, ge=1024, le=10*1024*1024, description="Max bytes to extract")
):
    """
    Extract hidden data from Least Significant Bits.
    
    **Parameters:**
    - channels: Which channels to use (default: RGB)
    - bit_order: LSB (least significant) or MSB (most significant)
    - bits_per_channel: Number of bits to extract per channel (1-8)
    - max_bytes: Maximum bytes to extract (default: 1MB)
    
    **Returns:**
    - data_info: Size, hash, and preview of extracted data
    - file_detection: Detected file type from magic bytes
    - text_analysis: Text decoding if applicable
    - entropy_analysis: Randomness and entropy metrics
    - file_download: Download link for extracted file
    - assessment: Overall quality assessment
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Validate parameters
        if bit_order not in ('LSB', 'MSB'):
            raise HTTPException(status_code=400, detail="bit_order must be LSB or MSB")
        
        valid_channels = {'R', 'G', 'B', 'A', 'RGB', 'RGBA', 'RG', 'RB', 'GB'}
        if channels.upper() not in valid_channels:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid channels. Must be one of: {', '.join(valid_channels)}"
            )
        
        result = lsb_analyzer.extract(
            contents,
            channels=channels.upper(),
            bit_order=bit_order,
            bits_per_channel=bits_per_channel,
            max_bytes=max_bytes
        )
        
        return {
            "success": True,
            "filename": file.filename,
            "data": result
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"LSB extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/download/{file_id}")
async def download_extracted_file(file_id: str):
    """
    Download extracted file from LSB analysis.
    
    **Parameters:**
    - file_id: UUID of extracted file
    
    **Returns:**
    - File download
    """
    try:
        # Security: Validate UUID format
        import uuid
        try:
            uuid.UUID(file_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid file ID")
        
        # Find file
        temp_dir = Path('./temp_extracted')
        matching_files = list(temp_dir.glob(f"extracted_{file_id}*"))
        
        if not matching_files:
            raise HTTPException(status_code=404, detail="File not found or expired")
        
        filepath = matching_files[0]
        
        # Security: Ensure file is within temp directory
        if not filepath.resolve().is_relative_to(temp_dir.resolve()):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return FileResponse(
            path=filepath,
            filename=filepath.name,
            media_type='application/octet-stream'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File download failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/superimposed")
async def superimposed_analysis(
    file: UploadFile = File(...),
    mode: str = Query('both', description="Mode: 'channels', 'bitplanes', or 'both'"),
    channels: str = Query('R,G,B', description="Channels to superimpose (comma-separated)"),
    bit_planes: str = Query('0,1,2', description="Bit planes to superimpose (comma-separated)"),
    blend_mode: str = Query('average', description="Blend mode: 'average', 'max', or 'xor'")
):
    """
    Superimpose different color channels and bit planes to reveal hidden patterns.
    
    **Parameters:**
    - mode: Analysis mode ('channels', 'bitplanes', or 'both')
    - channels: Which color channels to superimpose (R,G,B)
    - bit_planes: Which bit planes to analyze (0-7, LSB is 0)
    - blend_mode: How to combine ('average', 'max', 'xor')
    
    **Returns:**
    - superimposed_images: Base64 encoded images showing superposition
    - analysis: Detected patterns and anomalies
    - recommendations: What to look for in the images
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        if len(contents) > 20 * 1024 * 1024:  # 20MB
            raise HTTPException(
                status_code=400,
                detail="Image too large for superimposed analysis (max 20MB)"
            )
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        
        try:
            # Parse channels and bit planes
            channel_list = [ch.strip().upper() for ch in channels.split(',')]
            bit_plane_list = [int(b.strip()) for b in bit_planes.split(',')]
            
            # Validate
            if any(ch not in ['R', 'G', 'B'] for ch in channel_list):
                raise ValueError("Invalid channel. Must be R, G, or B")
            
            if any(b < 0 or b > 7 for b in bit_plane_list):
                raise ValueError("Bit planes must be between 0 and 7")
            
            if blend_mode not in ['average', 'max', 'xor']:
                raise ValueError("Blend mode must be 'average', 'max', or 'xor'")
            
            # Run analysis
            config = {
                'mode': mode,
                'channels': channel_list,
                'bit_planes': bit_plane_list,
                'blend_mode': blend_mode
            }
            
            result = analyze_superimposed(tmp_path, config)
            
            return {
                "success": True,
                "filename": file.filename,
                "data": result
            }
        
        finally:
            # Cleanup temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Superimposed analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/analyze-all")
async def analyze_all(
    file: UploadFile = File(...),
    quick_mode: bool = Query(False, description="Quick mode (skip bit planes)")
):
    """
    Run all forensic analysis modules at once.
    
    **Comprehensive Analysis:**
    - Metadata extraction
    - String extraction
    - Visual analysis
    - LSB extraction (with default settings)
    
    **Parameters:**
    - quick_mode: Skip time-intensive operations (bit planes, operations)
    
    **Returns:**
    - Complete forensic analysis report
    """
    try:
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")
        
        if len(contents) > 20 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large for full analysis (max 20MB)")
        
        # Run all analyses
        metadata = metadata_extractor.extract(contents)
        strings = string_extractor.extract(contents, max_strings=500)
        
        visual = visual_analyzer.analyze(
            contents,
            include_bit_planes=not quick_mode,
            include_operations=not quick_mode,
            include_histograms=True
        )
        
        lsb = lsb_analyzer.extract(
            contents,
            channels='RGB',
            bit_order='LSB',
            bits_per_channel=1,
            max_bytes=512 * 1024  # 512KB for quick analysis
        )
        
        # Generate summary
        summary = {
            'total_suspicious_findings': (
                len(metadata.get('suspicious_findings', [])) +
                len(strings.get('suspicious_findings', [])) +
                len(visual.get('anomaly_analysis', {}).get('findings', []))
            ),
            'metadata_available': metadata.get('exif', {}).get('available', False),
            'gps_available': metadata.get('gps', {}).get('available', False),
            'strings_found': strings.get('statistics', {}).get('total_strings', 0),
            'visual_anomalies': visual.get('anomaly_analysis', {}).get('anomalies_detected', 0),
            'lsb_data_likely': lsb.get('assessment', {}).get('contains_hidden_data', False),
            'overall_risk_level': 'high' if lsb.get('assessment', {}).get('contains_hidden_data') else 'low'
        }
        
        return {
            "success": True,
            "filename": file.filename,
            "summary": summary,
            "metadata": metadata,
            "strings": strings,
            "visual": visual,
            "lsb": lsb
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Full analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
async def health_check():
    """Health check endpoint for forensics module."""
    return {
        "status": "healthy",
        "modules": {
            "metadata_extractor": "ready",
            "string_extractor": "ready",
            "visual_analyzer": "ready",
            "lsb_analyzer": "ready"
        }
    }
