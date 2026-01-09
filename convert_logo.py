
from PIL import Image
import os

source = 'assets/images/ora-web/clear_logo.png'
dest_public = 'public/clear_logo.webp'
dest_src = 'src/assets/images/ora-web/clear_logo.webp'

# Ensure source exists
if not os.path.exists(source):
    print(f"Source file not found: {source}")
    exit(1)

try:
    img = Image.open(source)
    img.save(dest_public, 'WEBP')
    
    # Also save to src/assets directory, creating it if needed
    os.makedirs(os.path.dirname(dest_src), exist_ok=True)
    img.save(dest_src, 'WEBP')
    
    print("Conversion successful")
except Exception as e:
    print(f"Error converting image: {e}")
    exit(1)
