# utils/preprocessing.py
"""
Module tiền xử lý ảnh cho Steganalysis
Bao gồm các bộ lọc SRM và phương pháp tăng cường nhiễu
"""

import numpy as np
import cv2
from typing import Tuple, Optional

class SRMFilters:
    """
    Spatial Rich Model (SRM) filters để phát hiện nhiễu steganography
    Tham khảo: Fridrich & Kodovský (2012)
    """
    
    # Kernel 5x5 cơ bản
    BASIC_5x5 = np.array([
        [-1, 2, -2, 2, -1],
        [2, -6, 8, -6, 2],
        [-2, 8, -12, 8, -2],
        [2, -6, 8, -6, 2],
        [-1, 2, -2, 2, -1]
    ], dtype=np.float32) / 12.0
    
    # Kernel 3x3 edge detection
    EDGE_3x3 = np.array([
        [-1, 2, -1],
        [2, -4, 2],
        [-1, 2, -1]
    ], dtype=np.float32) / 4.0
    
    # High-pass filter
    HIGH_PASS = np.array([
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0]
    ], dtype=np.float32)
    
    @staticmethod
    def apply_filter(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        """
        Áp dụng kernel filter lên ảnh
        
        Args:
            image: Input image (grayscale hoặc RGB)
            kernel: Convolution kernel
            
        Returns:
            Filtered image
        """
        if len(image.shape) == 3:
            # RGB image - convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray = image
        
        # Apply filter
        filtered = cv2.filter2D(gray, cv2.CV_32F, kernel)
        
        # Normalize to [0, 255]
        filtered = cv2.normalize(filtered, None, 0, 255, cv2.NORM_MINMAX)
        filtered = filtered.astype(np.uint8)
        
        return filtered
    
    @staticmethod
    def multi_filter_response(image: np.ndarray, 
                             filters: list = None) -> np.ndarray:
        """
        Áp dụng nhiều filters và stack lại
        
        Args:
            image: Input image
            filters: List of kernels to apply
            
        Returns:
            Stacked filter responses (H, W, num_filters)
        """
        if filters is None:
            filters = [
                SRMFilters.BASIC_5x5,
                SRMFilters.EDGE_3x3,
                SRMFilters.HIGH_PASS
            ]
        
        responses = []
        for kernel in filters:
            response = SRMFilters.apply_filter(image, kernel)
            responses.append(response)
        
        # Stack along channel dimension
        stacked = np.stack(responses, axis=-1)
        return stacked


class ImagePreprocessor:
    """
    Pipeline tiền xử lý ảnh cho model MobileNetV2
    """
    
    def __init__(self, 
                 target_size: Tuple[int, int] = (224, 224),
                 use_srm: bool = True,
                 srm_filters: Optional[list] = None):
        """
        Args:
            target_size: Kích thước resize (height, width)
            use_srm: Có sử dụng SRM filters không
            srm_filters: Custom filters (None = dùng mặc định)
        """
        self.target_size = target_size
        self.use_srm = use_srm
        self.srm_filters = srm_filters
    
    def resize_image(self, image: np.ndarray) -> np.ndarray:
        """Resize ảnh về target_size"""
        return cv2.resize(image, self.target_size, interpolation=cv2.INTER_LINEAR)
    
    def normalize(self, image: np.ndarray, method: str = '0-1') -> np.ndarray:
        """
        Chuẩn hóa ảnh
        
        Args:
            image: Input image
            method: '0-1' hoặc 'imagenet'
        """
        image = image.astype(np.float32)
        
        if method == '0-1':
            return image / 255.0
        elif method == 'imagenet':
            # ImageNet normalization
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            return (image / 255.0 - mean) / std
        else:
            raise ValueError(f"Unknown normalization method: {method}")
    
    def apply_srm_preprocessing(self, image: np.ndarray) -> np.ndarray:
        """
        Áp dụng SRM filters trước khi đưa vào model
        
        Args:
            image: RGB image array
            
        Returns:
            Preprocessed image
        """
        # Áp dụng filter cơ bản
        filtered = SRMFilters.apply_filter(image, SRMFilters.BASIC_5x5)
        
        # Convert back to RGB (3 channels)
        if len(filtered.shape) == 2:
            filtered = cv2.cvtColor(filtered, cv2.COLOR_GRAY2RGB)
        
        return filtered
    
    def preprocess(self, 
                   image: np.ndarray,
                   add_batch_dim: bool = True) -> np.ndarray:
        """
        Pipeline tiền xử lý đầy đủ
        
        Args:
            image: Input image (H, W, C) RGB format
            add_batch_dim: Thêm batch dimension không
            
        Returns:
            Preprocessed image ready for model
        """
        # Step 1: Resize
        resized = self.resize_image(image)
        
        # Step 2: Apply SRM if enabled
        if self.use_srm:
            processed = self.apply_srm_preprocessing(resized)
        else:
            processed = resized
        
        # Step 3: Normalize
        normalized = self.normalize(processed, method='0-1')
        
        # Step 4: Add batch dimension
        if add_batch_dim:
            normalized = np.expand_dims(normalized, axis=0)
        
        return normalized
    
    def preprocess_batch(self, images: list) -> np.ndarray:
        """
        Tiền xử lý batch ảnh
        
        Args:
            images: List of numpy arrays
            
        Returns:
            Batch of preprocessed images (N, H, W, C)
        """
        processed = []
        for img in images:
            proc_img = self.preprocess(img, add_batch_dim=False)
            processed.append(proc_img)
        
        return np.array(processed)


class DataAugmentation:
    """
    Data augmentation cho training (nếu cần)
    Lưu ý: Augmentation phải cẩn thận để không phá vỡ dấu vết nhiễu
    """
    
    @staticmethod
    def random_flip(image: np.ndarray, p: float = 0.5) -> np.ndarray:
        """Flip ngẫu nhiên theo chiều ngang"""
        if np.random.random() < p:
            return cv2.flip(image, 1)
        return image
    
    @staticmethod
    def random_crop(image: np.ndarray, 
                   crop_size: Tuple[int, int],
                   p: float = 0.5) -> np.ndarray:
        """Random crop (nếu ảnh lớn hơn crop_size)"""
        if np.random.random() > p:
            return image
        
        h, w = image.shape[:2]
        crop_h, crop_w = crop_size
        
        if h <= crop_h or w <= crop_w:
            return image
        
        top = np.random.randint(0, h - crop_h)
        left = np.random.randint(0, w - crop_w)
        
        return image[top:top+crop_h, left:left+crop_w]
    
    @staticmethod
    def slight_brightness(image: np.ndarray, 
                         factor_range: Tuple[float, float] = (0.9, 1.1),
                         p: float = 0.5) -> np.ndarray:
        """
        Điều chỉnh độ sáng nhẹ
        CẢNH BÁO: Chỉ dùng với factor gần 1.0 để không phá nhiễu
        """
        if np.random.random() > p:
            return image
        
        factor = np.random.uniform(*factor_range)
        adjusted = image.astype(np.float32) * factor
        return np.clip(adjusted, 0, 255).astype(np.uint8)


# ============= UTILITY FUNCTIONS =============

def calculate_image_stats(image: np.ndarray) -> dict:
    """
    Tính các thống kê cơ bản của ảnh
    
    Returns:
        Dictionary chứa mean, std, min, max cho mỗi channel
    """
    stats = {
        'shape': image.shape,
        'dtype': str(image.dtype)
    }
    
    if len(image.shape) == 3:
        for i, channel in enumerate(['R', 'G', 'B']):
            stats[f'{channel}_mean'] = float(np.mean(image[:,:,i]))
            stats[f'{channel}_std'] = float(np.std(image[:,:,i]))
            stats[f'{channel}_min'] = int(np.min(image[:,:,i]))
            stats[f'{channel}_max'] = int(np.max(image[:,:,i]))
    else:
        stats['mean'] = float(np.mean(image))
        stats['std'] = float(np.std(image))
        stats['min'] = int(np.min(image))
        stats['max'] = int(np.max(image))
    
    return stats


def visualize_srm_response(image: np.ndarray, 
                          save_path: Optional[str] = None) -> np.ndarray:
    """
    Visualize SRM filter response
    
    Args:
        image: Input image
        save_path: Path to save visualization (optional)
        
    Returns:
        Visualization array
    """
    import matplotlib.pyplot as plt
    
    # Apply filters
    basic = SRMFilters.apply_filter(image, SRMFilters.BASIC_5x5)
    edge = SRMFilters.apply_filter(image, SRMFilters.EDGE_3x3)
    high_pass = SRMFilters.apply_filter(image, SRMFilters.HIGH_PASS)
    
    # Create visualization
    fig, axes = plt.subplots(2, 2, figsize=(12, 12))
    
    axes[0, 0].imshow(image)
    axes[0, 0].set_title('Original Image')
    axes[0, 0].axis('off')
    
    axes[0, 1].imshow(basic, cmap='gray')
    axes[0, 1].set_title('SRM Basic 5x5')
    axes[0, 1].axis('off')
    
    axes[1, 0].imshow(edge, cmap='gray')
    axes[1, 0].set_title('Edge Detection 3x3')
    axes[1, 0].axis('off')
    
    axes[1, 1].imshow(high_pass, cmap='gray')
    axes[1, 1].set_title('High-pass Filter')
    axes[1, 1].axis('off')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
    
    # Convert to array
    fig.canvas.draw()
    vis_array = np.frombuffer(fig.canvas.tostring_rgb(), dtype=np.uint8)
    vis_array = vis_array.reshape(fig.canvas.get_width_height()[::-1] + (3,))
    
    plt.close()
    
    return vis_array


# ============= USAGE EXAMPLE =============

if __name__ == "__main__":
    # Test preprocessing pipeline
    import PIL.Image as PILImage
    
    # Load sample image
    img = PILImage.open("sample.jpg")
    img_array = np.array(img)
    
    # Initialize preprocessor
    preprocessor = ImagePreprocessor(
        target_size=(224, 224),
        use_srm=True
    )
    
    # Preprocess
    processed = preprocessor.preprocess(img_array)
    
    print(f"Input shape: {img_array.shape}")
    print(f"Output shape: {processed.shape}")
    print(f"Output range: [{processed.min():.3f}, {processed.max():.3f}]")
    
    # Calculate stats
    stats = calculate_image_stats(img_array)
    print("\nImage statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Visualize SRM response
    visualize_srm_response(img_array, save_path="srm_visualization.png")
    print("\nSRM visualization saved!")