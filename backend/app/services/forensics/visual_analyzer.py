"""
Visual Analysis Service
-----------------------
Advanced image channel decomposition and bit plane analysis.

Author: Senior DevOps Engineer  
Version: 1.0.0
"""

import io
import base64
import numpy as np
from PIL import Image
from typing import Dict, List, Any, Tuple
import logging

logger = logging.getLogger(__name__)


class VisualAnalyzer:
    """
    Production-grade visual analysis for steganography detection.
    
    Features:
        - RGB/RGBA channel decomposition
        - 8-level bit plane extraction (0-7)
        - Channel arithmetic operations (XOR, ADD, SUB)
        - Histogram analysis
        - Entropy calculation
        - Anomaly detection in LSB layers
    """
    
    # Supported color modes
    SUPPORTED_MODES = {'RGB', 'RGBA', 'L', 'LA', 'P'}
    
    # Bit operations
    BIT_OPERATIONS = ['xor', 'add', 'sub', 'and', 'or']
    
    def __init__(self):
        """Initialize visual analyzer with logging."""
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def analyze(
        self, 
        image_bytes: bytes,
        include_bit_planes: bool = True,
        include_operations: bool = True,
        include_histograms: bool = True
    ) -> Dict[str, Any]:
        """
        Comprehensive visual analysis of image.
        
        Args:
            image_bytes: Raw image data
            include_bit_planes: Extract all 8 bit planes per channel
            include_operations: Perform channel operations
            include_histograms: Calculate color histograms
            
        Returns:
            Dictionary with visual analysis results
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            
            # Convert to supported mode
            if img.mode not in self.SUPPORTED_MODES:
                self.logger.warning(f"Converting {img.mode} to RGB")
                img = img.convert('RGB')
            
            # Convert to numpy array
            img_array = np.array(img)
            
            result = {
                'image_info': self._get_image_info(img, img_array),
                'channels': self._decompose_channels(img_array),
            }
            
            if include_bit_planes:
                result['bit_planes'] = self._extract_all_bit_planes(img_array)
            
            if include_operations:
                result['operations'] = self._perform_channel_operations(img_array)
            
            if include_histograms:
                result['histograms'] = self._calculate_histograms(img_array)
            
            # Always include anomaly detection
            result['anomaly_analysis'] = self._detect_anomalies(img_array)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Visual analysis failed: {str(e)}")
            raise ValueError(f"Failed to analyze image visually: {str(e)}")
    
    def _get_image_info(self, img: Image.Image, img_array: np.ndarray) -> Dict[str, Any]:
        """Extract basic image information."""
        return {
            'mode': img.mode,
            'size': {'width': img.width, 'height': img.height},
            'channels': img_array.shape[2] if len(img_array.shape) == 3 else 1,
            'dtype': str(img_array.dtype),
            'shape': list(img_array.shape)
        }
    
    def _decompose_channels(self, img_array: np.ndarray) -> Dict[str, str]:
        """
        Decompose image into separate color channels.
        
        Returns:
            Dictionary of channel name -> base64 encoded PNG
        """
        channels = {}
        
        # Grayscale image
        if len(img_array.shape) == 2:
            channels['grayscale'] = self._array_to_base64(img_array)
            return channels
        
        # Color image
        num_channels = img_array.shape[2]
        channel_names = ['red', 'green', 'blue', 'alpha'][:num_channels]
        
        for i, name in enumerate(channel_names):
            channel_data = img_array[:, :, i]
            channels[name] = self._array_to_base64(channel_data)
        
        return channels
    
    def _extract_all_bit_planes(self, img_array: np.ndarray) -> Dict[str, Dict[str, str]]:
        """
        Extract all 8 bit planes (0-7) for each channel.
        
        Bit 0 = LSB (Least Significant Bit)
        Bit 7 = MSB (Most Significant Bit)
        
        Returns:
            Nested dict: channel -> bit_level -> base64 image
        """
        bit_planes = {}
        
        # Grayscale
        if len(img_array.shape) == 2:
            bit_planes['grayscale'] = self._extract_channel_bit_planes(img_array)
            return bit_planes
        
        # Color channels
        num_channels = img_array.shape[2]
        channel_names = ['red', 'green', 'blue', 'alpha'][:num_channels]
        
        for i, name in enumerate(channel_names):
            channel_data = img_array[:, :, i]
            bit_planes[name] = self._extract_channel_bit_planes(channel_data)
        
        return bit_planes
    
    def _extract_channel_bit_planes(self, channel: np.ndarray) -> Dict[str, str]:
        """Extract all 8 bit planes from a single channel."""
        bit_planes = {}
        
        for bit_level in range(8):
            # Extract bit plane
            bit_plane = (channel >> bit_level) & 1
            
            # Scale to 0-255 for visualization
            bit_plane_visual = bit_plane * 255
            
            bit_planes[f'bit_{bit_level}'] = self._array_to_base64(bit_plane_visual.astype(np.uint8))
        
        return bit_planes
    
    def _perform_channel_operations(self, img_array: np.ndarray) -> Dict[str, str]:
        """
        Perform arithmetic and logical operations between channels.
        
        Operations:
            - XOR: Highlights differences between channels
            - ADD: Combines channel information
            - SUB: Shows differences (absolute)
            - AND: Logical AND
            - OR: Logical OR
        
        Returns:
            Dictionary of operation -> base64 encoded result
        """
        operations = {}
        
        # Need at least 3 channels for operations
        if len(img_array.shape) < 3 or img_array.shape[2] < 3:
            return {}
        
        r = img_array[:, :, 0]
        g = img_array[:, :, 1]
        b = img_array[:, :, 2]
        
        # XOR operations (common for stego detection)
        operations['xor_rg'] = self._array_to_base64(np.bitwise_xor(r, g))
        operations['xor_rb'] = self._array_to_base64(np.bitwise_xor(r, b))
        operations['xor_gb'] = self._array_to_base64(np.bitwise_xor(g, b))
        operations['xor_rgb'] = self._array_to_base64(
            np.bitwise_xor(np.bitwise_xor(r, g), b)
        )
        
        # Arithmetic operations
        operations['add_rg'] = self._array_to_base64(
            np.clip(r.astype(np.int16) + g.astype(np.int16), 0, 255).astype(np.uint8)
        )
        operations['sub_rg'] = self._array_to_base64(
            np.abs(r.astype(np.int16) - g.astype(np.int16)).astype(np.uint8)
        )
        operations['sub_rb'] = self._array_to_base64(
            np.abs(r.astype(np.int16) - b.astype(np.int16)).astype(np.uint8)
        )
        
        # Logical operations
        operations['and_rg'] = self._array_to_base64(np.bitwise_and(r, g))
        operations['or_rg'] = self._array_to_base64(np.bitwise_or(r, g))
        
        return operations
    
    def _calculate_histograms(self, img_array: np.ndarray) -> Dict[str, List[int]]:
        """
        Calculate color histograms for each channel.
        
        Returns:
            Dictionary of channel -> histogram (256 bins)
        """
        histograms = {}
        
        # Grayscale
        if len(img_array.shape) == 2:
            hist, _ = np.histogram(img_array, bins=256, range=(0, 256))
            histograms['grayscale'] = hist.tolist()
            return histograms
        
        # Color channels
        num_channels = img_array.shape[2]
        channel_names = ['red', 'green', 'blue', 'alpha'][:num_channels]
        
        for i, name in enumerate(channel_names):
            hist, _ = np.histogram(img_array[:, :, i], bins=256, range=(0, 256))
            histograms[name] = hist.tolist()
        
        # Combined histogram
        hist_all, _ = np.histogram(img_array.flatten(), bins=256, range=(0, 256))
        histograms['combined'] = hist_all.tolist()
        
        return histograms
    
    def _detect_anomalies(self, img_array: np.ndarray) -> Dict[str, Any]:
        """
        Detect visual anomalies that may indicate steganography.
        
        Checks:
            - LSB entropy (randomness in least significant bits)
            - Channel correlation
            - Unusual histogram patterns
            - Bit plane patterns
        
        Returns:
            Dictionary with anomaly findings and metrics
        """
        findings = []
        metrics = {}
        
        # Analyze each channel
        if len(img_array.shape) == 2:
            channels_to_analyze = [('grayscale', img_array)]
        else:
            num_channels = img_array.shape[2]
            channel_names = ['red', 'green', 'blue', 'alpha'][:num_channels]
            channels_to_analyze = [
                (name, img_array[:, :, i]) 
                for i, name in enumerate(channel_names)
            ]
        
        for channel_name, channel_data in channels_to_analyze:
            # 1. LSB entropy analysis
            lsb = channel_data & 1
            lsb_entropy = self._calculate_entropy(lsb)
            metrics[f'{channel_name}_lsb_entropy'] = round(lsb_entropy, 4)
            
            # High LSB entropy suggests hidden data
            if lsb_entropy > 0.95:  # Close to 1.0 = maximum entropy
                findings.append({
                    'type': 'High LSB Entropy',
                    'severity': 'high',
                    'channel': channel_name,
                    'entropy': round(lsb_entropy, 4),
                    'message': f'{channel_name} LSB shows high randomness (possible steganography)',
                    'recommendation': 'Extract and analyze LSB data'
                })
            
            # 2. Channel entropy
            channel_entropy = self._calculate_entropy(channel_data)
            metrics[f'{channel_name}_entropy'] = round(channel_entropy, 4)
            
            # 3. LSB pattern detection (simple visual pattern)
            lsb_pattern_score = self._detect_lsb_pattern(lsb)
            metrics[f'{channel_name}_lsb_pattern'] = round(lsb_pattern_score, 4)
            
            if lsb_pattern_score > 0.3:
                findings.append({
                    'type': 'LSB Pattern Detected',
                    'severity': 'medium',
                    'channel': channel_name,
                    'score': round(lsb_pattern_score, 4),
                    'message': f'{channel_name} LSB shows non-random patterns',
                    'recommendation': 'Visualize LSB bit plane for manual inspection'
                })
        
        # 4. Channel correlation (for RGB images)
        if len(img_array.shape) == 3 and img_array.shape[2] >= 3:
            r, g, b = img_array[:, :, 0], img_array[:, :, 1], img_array[:, :, 2]
            
            corr_rg = np.corrcoef(r.flat, g.flat)[0, 1]
            corr_rb = np.corrcoef(r.flat, b.flat)[0, 1]
            corr_gb = np.corrcoef(g.flat, b.flat)[0, 1]
            
            metrics['channel_correlation'] = {
                'red_green': round(corr_rg, 4),
                'red_blue': round(corr_rb, 4),
                'green_blue': round(corr_gb, 4),
                'average': round((corr_rg + corr_rb + corr_gb) / 3, 4)
            }
            
            # Low correlation unusual for natural images
            if metrics['channel_correlation']['average'] < 0.3:
                findings.append({
                    'type': 'Low Channel Correlation',
                    'severity': 'medium',
                    'message': 'Unusually low correlation between color channels',
                    'correlation': metrics['channel_correlation'],
                    'recommendation': 'May indicate channel-specific manipulation'
                })
        
        return {
            'anomalies_detected': len(findings),
            'findings': findings,
            'metrics': metrics,
            'overall_suspicious': len([f for f in findings if f['severity'] == 'high']) > 0
        }
    
    def _calculate_entropy(self, data: np.ndarray) -> float:
        """
        Calculate Shannon entropy of data.
        
        Entropy measures randomness:
            - 0 = completely ordered
            - 1 = maximum randomness (for binary data)
            - ~8 = maximum entropy for byte data (0-255)
        
        Returns:
            Entropy value
        """
        # Flatten array
        flat_data = data.flatten()
        
        # Calculate histogram
        hist, _ = np.histogram(flat_data, bins=np.arange(257), density=True)
        
        # Remove zeros
        hist = hist[hist > 0]
        
        # Calculate entropy
        entropy = -np.sum(hist * np.log2(hist + 1e-10))
        
        # Normalize to 0-1 range for bit data
        if data.max() <= 1:
            return entropy  # Already 0-1
        else:
            return entropy / 8.0  # Normalize byte entropy
    
    def _detect_lsb_pattern(self, lsb: np.ndarray) -> float:
        """
        Detect visual patterns in LSB plane.
        
        Uses simple edge detection to find structure in LSB.
        Higher scores indicate more visual pattern (suspicious).
        
        Returns:
            Pattern score (0-1)
        """
        # Count transitions (0->1 or 1->0) in rows
        row_transitions = np.sum(np.abs(np.diff(lsb, axis=1)))
        
        # Count transitions in columns  
        col_transitions = np.sum(np.abs(np.diff(lsb, axis=0)))
        
        # Total pixels
        total_pixels = lsb.size
        
        # Transition ratio (random data would have ~50% transitions)
        transition_ratio = (row_transitions + col_transitions) / (total_pixels * 2)
        
        # Deviation from 0.5 indicates pattern
        pattern_score = abs(transition_ratio - 0.5) * 2
        
        return min(pattern_score, 1.0)
    
    def _array_to_base64(self, array: np.ndarray) -> str:
        """
        Convert numpy array to base64-encoded PNG image.
        
        Args:
            array: 2D numpy array (grayscale image)
            
        Returns:
            Data URI string (data:image/png;base64,...)
        """
        # Ensure uint8 type
        if array.dtype != np.uint8:
            array = array.astype(np.uint8)
        
        # Create PIL Image
        if len(array.shape) == 2:
            img = Image.fromarray(array, mode='L')
        else:
            img = Image.fromarray(array)
        
        # Encode to PNG in memory
        buffer = io.BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        
        # Convert to base64
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{img_base64}"


# Testing function
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    analyzer = VisualAnalyzer()
    
    # Create test image with LSB data
    test_img = np.random.randint(0, 256, (100, 100, 3), dtype=np.uint8)
    
    # Embed pattern in LSB
    test_img[:, :, 0] = test_img[:, :, 0] & 0xFE  # Clear LSB
    test_img[:50, :50, 0] = test_img[:50, :50, 0] | 1  # Set LSB in corner
    
    # Convert to bytes
    img_pil = Image.fromarray(test_img, mode='RGB')
    buffer = io.BytesIO()
    img_pil.save(buffer, format='PNG')
    
    result = analyzer.analyze(buffer.getvalue())
    print("Visual analysis test:")
    print(f"- Channels: {list(result['channels'].keys())}")
    print(f"- Anomalies detected: {result['anomaly_analysis']['anomalies_detected']}")
    print(f"- Red LSB entropy: {result['anomaly_analysis']['metrics'].get('red_lsb_entropy', 0)}")
