import tensorflow as tf
import numpy as np

@tf.keras.utils.register_keras_serializable()
class SRMFilterInitializer(tf.keras.initializers.Initializer):
    def __init__(self):
        filters = np.zeros([5, 5, 1, 30], dtype=np.float32)
        filters[2, 2, 0, 0] = -1; filters[2, 3, 0, 0] = 1
        filters[2, 2, 0, 1] = -1; filters[3, 2, 0, 1] = 1
        filters[1, 2, 0, 2] = -1; filters[3, 2, 0, 2] = 1
        filters[2, 1, 0, 3] = -1; filters[2, 3, 0, 3] = 1
        filters[1, 1, 0, 4] = -1; filters[3, 3, 0, 4] = 1
        filters[1, 3, 0, 5] = -1; filters[3, 1, 0, 5] = 1
        filters[1, 2, 0, 6] = -1; filters[2, 1, 0, 6] = 1; filters[2, 3, 0, 6] = 1; filters[3, 2, 0, 6] = 1
        filters[1, 1, 0, 7] = -1; filters[1, 3, 0, 7] = 1; filters[3, 1, 0, 7] = 1; filters[3, 3, 0, 7] = -1
        filters[2, 1, 0, 8] = 1; filters[2, 2, 0, 8] = -2; filters[2, 3, 0, 8] = 1
        filters[1, 2, 0, 9] = 1; filters[2, 2, 0, 9] = -2; filters[3, 2, 0, 9] = 1
        filters[1, 1, 0, 10] = 1; filters[2, 2, 0, 10] = -2; filters[3, 3, 0, 10] = 1
        filters[1, 3, 0, 11] = 1; filters[2, 2, 0, 11] = -2; filters[3, 1, 0, 11] = 1
        filters[1, 2, 0, 12] = -1; filters[2, 1, 0, 12] = 2; filters[2, 2, 0, 12] = -2; filters[2, 3, 0, 12] = 2; filters[3, 2, 0, 12] = -1
        filters[1, 1, 0, 13] = -1; filters[1, 3, 0, 13] = 2; filters[2, 2, 0, 13] = -2; filters[3, 1, 0, 13] = 2; filters[3, 3, 0, 13] = -1
        filters[1, 2, 0, 14] = -1; filters[2, 2, 0, 14] = 2; filters[2, 3, 0, 14] = -2; filters[3, 3, 0, 14] = 2; filters[3, 2, 0, 14] = -1
        filters[1, 3, 0, 15] = -1; filters[2, 3, 0, 15] = 2; filters[2, 2, 0, 15] = -2; filters[3, 2, 0, 15] = 2; filters[3, 1, 0, 15] = -1
        filters[1, 1, 0, 16] = 1; filters[1, 2, 0, 16] = -2; filters[2, 1, 0, 16] = -2; filters[2, 2, 0, 16] = 4
        filters[1, 2, 0, 17] = 1; filters[1, 3, 0, 17] = -2; filters[2, 2, 0, 17] = -2; filters[2, 3, 0, 17] = 4
        filters[2, 1, 0, 18] = 1; filters[2, 2, 0, 18] = -2; filters[3, 1, 0, 18] = -2; filters[3, 2, 0, 18] = 4
        filters[2, 2, 0, 19] = 1; filters[2, 3, 0, 19] = -2; filters[3, 2, 0, 19] = -2; filters[3, 3, 0, 19] = 4
        filters[2, 2, 0, 20] = -1; filters[2, 3, 0, 20] = 1
        filters[2, 2, 0, 21] = -1; filters[3, 2, 0, 21] = 1
        filters[1, 1, 0, 22] = -1; filters[1, 4, 0, 22] = 1; filters[2, 2, 0, 22] = -1; filters[2, 3, 0, 22] = 1; filters[3, 1, 0, 22] = 1; filters[3, 4, 0, 22] = -1; filters[4, 2, 0, 22] = 1; filters[4, 3, 0, 22] = -1
        filters[1, 1, 0, 23] = -1; filters[1, 3, 0, 23] = 1; filters[2, 2, 0, 23] = 1; filters[2, 4, 0, 23] = -1; filters[3, 1, 0, 23] = 1; filters[3, 3, 0, 23] = -1; filters[4, 2, 0, 23] = -1; filters[4, 4, 0, 23] = 1
        filters[1, 2, 0, 24] = -1; filters[2, 1, 0, 24] = 1; filters[2, 3, 0, 24] = -1; filters[3, 2, 0, 24] = 1; filters[3, 4, 0, 24] = 1; filters[4, 1, 0, 24] = -1; filters[4, 3, 0, 24] = 1
        filters[1, 3, 0, 25] = -1; filters[2, 2, 0, 25] = 1; filters[2, 4, 0, 25] = -1; filters[3, 1, 0, 25] = 1; filters[3, 3, 0, 25] = 1; filters[4, 2, 0, 25] = -1; filters[4, 4, 0, 25] = 1
        filters[1, 4, 0, 26] = 1; filters[2, 1, 0, 26] = -1; filters[2, 3, 0, 26] = 1; filters[3, 2, 0, 26] = -1; filters[3, 4, 0, 26] = 1; filters[4, 1, 0, 26] = 1; filters[4, 3, 0, 26] = -1
        filters[1, 3, 0, 27] = 1; filters[2, 2, 0, 27] = -1; filters[2, 4, 0, 27] = 1; filters[3, 1, 0, 27] = -1; filters[3, 3, 0, 27] = 1; filters[4, 2, 0, 27] = 1; filters[4, 4, 0, 27] = -1
        filters[2, 1, 0, 28] = 1; filters[2, 2, 0, 28] = -2; filters[2, 3, 0, 28] = 1
        filters[1, 2, 0, 29] = 1; filters[2, 2, 0, 29] = -2; filters[3, 2, 0, 29] = 1
        self.filters = tf.convert_to_tensor(filters, dtype=tf.float32)

    def __call__(self, shape, dtype=None):
        return self.filters
    
    def get_config(self):
        return {}

def rgb_to_grayscale(x):
    """Convert RGB to grayscale"""
    return tf.image.rgb_to_grayscale(x)

def TLU(x, T=3.0):
    """Thresholded Linear Unit activation"""
    return tf.where(tf.abs(x) >= T, x, tf.zeros_like(x))

def build_srm_branch(input_layer, num_srm_filters=30):
    gray_input = tf.keras.layers.Lambda(
        rgb_to_grayscale, 
        output_shape=(224, 224, 1), 
        name='To_Grayscale'
    )(input_layer)
    
    srm_init = SRMFilterInitializer()
    noise_features = tf.keras.layers.Conv2D(
        num_srm_filters, (5, 5), 
        padding='same', 
        name='SRM_Filter_Bank',
        kernel_initializer=srm_init,
        trainable=False,
        use_bias=True
    )(gray_input)
    
    tlu_features = tf.keras.layers.Lambda(
        TLU, 
        output_shape=(224, 224, 30), 
        name='TLU_Activation'
    )(noise_features)
    
    bottleneck = tf.keras.layers.Conv2D(
        3, (1, 1), 
        padding='same', 
        trainable=True,
        name='SRM_to_RGB_Bottleneck'
    )(tlu_features)
    
    normalized_noise = tf.keras.layers.BatchNormalization(
        name='Normalize_Noise_Stream'
    )(bottleneck)
    
    return normalized_noise

def build_mobilenetv2_hpf_model():
    """Rebuild MobileNetV2 HPF-Enabled model matching notebook architecture"""
    input_layer = tf.keras.Input(shape=(224, 224, 3), name='Input_Image')
    processed_input = build_srm_branch(input_layer, num_srm_filters=30)
    
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None
    )
    
    x = base_model(processed_input)
    output = tf.keras.layers.GlobalAveragePooling2D(name='GlobalAvgPool')(x)
    output = tf.keras.layers.Dropout(0.5, name='Head_Dropout')(output)
    output = tf.keras.layers.Dense(1, activation='sigmoid', name='Classifier')(output)
    
    model = tf.keras.Model(inputs=input_layer, outputs=output, name='MobileNetV2_HPF_Enabled')
    return model

def build_vgg16_hpf_model():
    """Rebuild VGG16 HPF-Enabled model matching notebook architecture"""
    input_layer = tf.keras.Input(shape=(224, 224, 3), name='Input_Image')
    processed_input = build_srm_branch(input_layer, num_srm_filters=30)
    
    base_model = tf.keras.applications.VGG16(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None
    )
    
    x = base_model(processed_input)
    output = tf.keras.layers.GlobalAveragePooling2D(name='GlobalAvgPool')(x)
    output = tf.keras.layers.Dropout(0.5, name='Head_Dropout')(output)
    output = tf.keras.layers.Dense(1, activation='sigmoid', name='Classifier')(output)
    
    model = tf.keras.Model(inputs=input_layer, outputs=output, name='VGG16_HPF_Enabled')
    return model

def build_resnet50_hpf_model():
    """Rebuild ResNet50 HPF-Enabled model matching notebook architecture"""
    input_layer = tf.keras.Input(shape=(224, 224, 3), name='Input_Image')
    processed_input = build_srm_branch(input_layer, num_srm_filters=30)
    
    base_model = tf.keras.applications.ResNet50(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None
    )
    
    x = base_model(processed_input)
    output = tf.keras.layers.GlobalAveragePooling2D(name='GlobalAvgPool')(x)
    output = tf.keras.layers.Dropout(0.5, name='Head_Dropout')(output)
    output = tf.keras.layers.Dense(1, activation='sigmoid', name='Classifier')(output)
    
    model = tf.keras.Model(inputs=input_layer, outputs=output, name='ResNet50_HPF_Enabled')
    return model

def build_mobilenetv2_no_hpf_model():
    """Rebuild MobileNetV2 without HPF (content branch only)"""
    input_layer = tf.keras.Input(shape=(224, 224, 3), name='Input_Image')
    
    # Content branch: preprocess with MobileNetV2's preprocess_input
    processed_input = tf.keras.layers.Lambda(
        tf.keras.applications.mobilenet_v2.preprocess_input,
        name='Content_Preprocess'
    )(input_layer)
    
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None
    )
    
    x = base_model(processed_input)
    output = tf.keras.layers.GlobalAveragePooling2D(name='GlobalAvgPool')(x)
    output = tf.keras.layers.Dropout(0.5, name='Head_Dropout')(output)
    output = tf.keras.layers.Dense(1, activation='sigmoid', name='Classifier')(output)
    
    model = tf.keras.Model(inputs=input_layer, outputs=output, name='MobileNetV2_HPF_Disabled')
    return model

def build_baseline_cnn_model():
    """Rebuild Baseline CNN model matching notebook architecture"""
    model = tf.keras.Sequential([
        tf.keras.Input(shape=(224, 224, 3), dtype=tf.float32, name='Input_Image'),
        tf.keras.layers.Rescaling(1./255, name='Rescale_0_to_1'),
        tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2,2),
        tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2,2),
        tf.keras.layers.Conv2D(128, (3,3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2,2),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ], name='Baseline_CNN')
    return model

def load_model_with_reconstruction(model_path: str):
    """
    Load a model by patching Lambda layer to provide output_shape
    This bypasses Keras 3 Lambda layer deserialization issues
    
    Args:
        model_path: Path to the .keras model file
        
    Returns:
        Loaded Keras model with weights
    """
    # Enable unsafe deserialization
    try:
        tf.keras.config.enable_unsafe_deserialization()
    except AttributeError:
        pass
    
    # Create a custom Lambda class that provides output_shape and forces correct function
    class PatchedLambda(tf.keras.layers.Lambda):
        def __init__(self, function, output_shape=None, **kwargs):
            layer_name = kwargs.get('name', '')
            
            # Force correct function and output_shape based on layer name
            if layer_name == 'To_Grayscale':
                function = rgb_to_grayscale
                output_shape = (224, 224, 1)
            elif layer_name == 'TLU_Activation':
                function = TLU
                output_shape = (224, 224, 30)
            elif layer_name == 'Content_Preprocess':
                function = tf.keras.applications.mobilenet_v2.preprocess_input
                output_shape = (224, 224, 3)
            
            super().__init__(function, output_shape=output_shape, **kwargs)

    # Custom objects for loading
    custom_objects = {
        'SRMFilterInitializer': SRMFilterInitializer,
        'rgb_to_grayscale': rgb_to_grayscale,
        'TLU': TLU,
        'Lambda': PatchedLambda
    }
    
    print(f"Loading model from {model_path} with PatchedLambda...")
    
    # Load the model with the patched Lambda layer
    try:
        model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        print("Successfully loaded original model with PatchedLambda!")
        return model
    except Exception as e:
        print(f"Failed to load model directly: {e}")
        print("Attempting reconstruction and weight transfer...")
        
        # Fallback: Build new model and try to load weights
        if 'MobileNetV2_HPF_Enabled' in model_path:
            new_model = build_mobilenetv2_hpf_model()
        elif 'MobileNetV2_HPF_Disabled' in model_path:
            new_model = build_mobilenetv2_no_hpf_model()
        elif 'VGG16' in model_path:
            new_model = build_vgg16_hpf_model()
        elif 'ResNet50' in model_path:
            new_model = build_resnet50_hpf_model()
        elif 'Baseline_CNN' in model_path:
            new_model = build_baseline_cnn_model()
        else:
            raise ValueError(f"Unknown model type for {model_path}")
            
        # Try loading weights
        try:
            new_model.load_weights(model_path)
            print("Successfully loaded weights into reconstructed model!")
            return new_model
        except Exception as w_e:
            print(f"Failed to load weights: {w_e}")
            raise e
