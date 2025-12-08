"""
Superimposed Analysis Module
Overlays different color channels and bit planes to reveal hidden patterns
"""

import io
import base64
import numpy as np
from PIL import Image
from typing import Dict, Any, List


class SuperimposedAnalyzer:
    """Analyzes images by superimposing different channels and bit planes"""
    
    def __init__(self, image_path: str):
        self.image = Image.open(image_path).convert('RGB')
        self.image_array = np.array(self.image)
        self.height, self.width, _ = self.image_array.shape
    
    def analyze(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform superimposed analysis
        
        Args:
            config: Configuration with:
                - mode: 'channels' or 'bitplanes' or 'both'
                - channels: list of channels to superimpose (R, G, B)
                - bit_planes: list of bit planes (0-7)
                - blend_mode: 'average', 'max', 'xor'
        
        Returns:
            Dictionary with analysis results and superimposed images
        """
        mode = config.get('mode', 'both')
        results = {
            'mode': mode,
            'original_dimensions': f"{self.width}x{self.height}",
            'superimposed_images': {}
        }
        
        if mode in ['channels', 'both']:
            channel_results = self._superimpose_channels(config)
            results['superimposed_images'].update(channel_results)
            results['channel_analysis'] = self._analyze_channel_superposition(channel_results)
        
        if mode in ['bitplanes', 'both']:
            bitplane_results = self._superimpose_bitplanes(config)
            results['superimposed_images'].update(bitplane_results)
            results['bitplane_analysis'] = self._analyze_bitplane_superposition(bitplane_results)
        
        if mode == 'both':
            combined = self._combine_all(config)
            results['superimposed_images']['combined_all'] = combined
            results['combined_analysis'] = self._analyze_combined(combined)
        
        return results
    
    def _superimpose_channels(self, config: Dict) -> Dict[str, str]:
        """Superimpose selected color channels"""
        channels = config.get('channels', ['R', 'G', 'B'])
        blend_mode = config.get('blend_mode', 'average')
        
        results = {}
        
        # Extract channels
        r, g, b = self.image_array[:,:,0], self.image_array[:,:,1], self.image_array[:,:,2]
        channel_map = {'R': r, 'G': g, 'B': b}
        
        # Superimpose selected channels
        selected_channels = [channel_map[ch] for ch in channels if ch in channel_map]
        
        if len(selected_channels) > 0:
            if blend_mode == 'average':
                superimposed = np.mean(selected_channels, axis=0).astype(np.uint8)
            elif blend_mode == 'max':
                superimposed = np.max(selected_channels, axis=0).astype(np.uint8)
            elif blend_mode == 'xor':
                superimposed = selected_channels[0]
                for ch in selected_channels[1:]:
                    superimposed = np.bitwise_xor(superimposed, ch)
            else:
                superimposed = np.mean(selected_channels, axis=0).astype(np.uint8)
            
            # Convert to image
            img = Image.fromarray(superimposed, mode='L')
            results[f'channels_{"_".join(channels)}'] = self._image_to_base64(img)
            
            # Also create colored version
            colored = np.stack([superimposed] * 3, axis=-1)
            colored_img = Image.fromarray(colored, mode='RGB')
            results[f'channels_{"_".join(channels)}_colored'] = self._image_to_base64(colored_img)
        
        return results
    
    def _superimpose_bitplanes(self, config: Dict) -> Dict[str, str]:
        """Superimpose selected bit planes"""
        bit_planes = config.get('bit_planes', [0, 1, 2])  # LSB planes by default
        blend_mode = config.get('blend_mode', 'average')
        
        results = {}
        
        # Extract bit planes from each channel
        for channel_name, channel_idx in [('R', 0), ('G', 1), ('B', 2)]:
            channel_data = self.image_array[:,:,channel_idx]
            planes = []
            
            for bit in bit_planes:
                plane = ((channel_data >> bit) & 1) * 255
                planes.append(plane)
            
            if len(planes) > 0:
                if blend_mode == 'average':
                    superimposed = np.mean(planes, axis=0).astype(np.uint8)
                elif blend_mode == 'max':
                    superimposed = np.max(planes, axis=0).astype(np.uint8)
                elif blend_mode == 'xor':
                    superimposed = planes[0]
                    for plane in planes[1:]:
                        superimposed = np.bitwise_xor(superimposed, plane)
                else:
                    superimposed = np.mean(planes, axis=0).astype(np.uint8)
                
                img = Image.fromarray(superimposed, mode='L')
                results[f'bitplanes_{channel_name}_{"_".join(map(str, bit_planes))}'] = self._image_to_base64(img)
        
        return results
    
    def _combine_all(self, config: Dict) -> str:
        """Combine channels and bitplanes superposition"""
        # Combine all RGB channels' LSB planes
        all_lsbs = []
        for ch_idx in range(3):
            channel_data = self.image_array[:,:,ch_idx]
            lsb = ((channel_data >> 0) & 1) * 255
            all_lsbs.append(lsb)
        
        combined = np.mean(all_lsbs, axis=0).astype(np.uint8)
        img = Image.fromarray(combined, mode='L')
        return self._image_to_base64(img)
    
    def _analyze_channel_superposition(self, channel_results: Dict) -> Dict:
        """Analyze channel superposition for anomalies"""
        return {
            'num_superpositions': len(channel_results),
            'techniques_used': list(channel_results.keys()),
            'recommendation': 'Check grayscale images for hidden patterns or text'
        }
    
    def _analyze_bitplane_superposition(self, bitplane_results: Dict) -> Dict:
        """Analyze bit plane superposition"""
        return {
            'num_superpositions': len(bitplane_results),
            'channels_analyzed': ['R', 'G', 'B'],
            'recommendation': 'Examine LSB planes for hidden data patterns'
        }
    
    def _analyze_combined(self, combined_image: str) -> Dict:
        """Analyze combined superposition"""
        return {
            'type': 'All RGB LSB planes combined',
            'purpose': 'Reveals hidden data across all channels',
            'recommendation': 'Look for visible patterns, text, or QR codes'
        }
    
    def _image_to_base64(self, img: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"


# Standalone function for API
def analyze_superimposed(image_path: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze image with superimposed channels/bitplanes
    
    Args:
        image_path: Path to image file
        config: Configuration dict
    
    Returns:
        Analysis results with base64 encoded images
    """
    analyzer = SuperimposedAnalyzer(image_path)
    return analyzer.analyze(config)
