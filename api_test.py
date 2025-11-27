import requests
import sys

try:
    print("Testing Health...")
    r = requests.get("http://localhost:8000/api/v1/health", timeout=10)
    print(f"Health: {r.status_code} {r.text}")

    print("Testing Models...")
    r = requests.get("http://localhost:8000/api/v1/models", timeout=10)
    print(f"Models: {r.status_code} {r.text}")

    print("Testing Prediction...")
    # Create dummy image if not exists
    import os
    import numpy as np
    from PIL import Image
    if not os.path.exists('test_image.jpg'):
        img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
        img.save('test_image.jpg')
        
    files = {'file': open('test_image.jpg', 'rb')}
    data = {'model_name': 'model_MobileNetV2_HPF_Enabled.keras'} # Removed use_srm
    r = requests.post("http://localhost:8000/api/v1/predict", files=files, data=data, timeout=120)
    print(f"Predict: {r.status_code} {r.text}")

except Exception as e:
    print(f"Error: {e}")
