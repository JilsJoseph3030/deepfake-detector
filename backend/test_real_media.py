import requests
import tempfile
import os

print("--- Testing Deepfake Backend with Real Media ---")

# Start backend first manually if not running, or we can just import the functions from main
import main

# Test 1: Real Photo (Lenna)
print("\n[+] Test 1: Real Photo (Lenna test image)")
real_img_url = "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png"
resp = requests.get(real_img_url)
if resp.status_code == 200:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as f:
        f.write(resp.content)
        real_path = f.name
    
    print(f"Downloaded Lenna image to {real_path}")
    hf_response, status = main.query_hf(real_path)
    print(f"HF Response: {hf_response}")
    os.remove(real_path)
else:
    print("Failed to download real photo.")

# Test 2: AI Generated Photo (thispersondoesnotexist.com)
print("\n[+] Test 2: AI Generated Photo (thispersondoesnotexist.com)")
fake_img_url = "https://thispersondoesnotexist.com/"
resp = requests.get(fake_img_url)
if resp.status_code == 200:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as f:
        f.write(resp.content)
        fake_path = f.name
    
    print(f"Downloaded AI image to {fake_path}")
    hf_response, status = main.query_hf(fake_path)
    print(f"HF Response: {hf_response}")
    os.remove(fake_path)
else:
    print("Failed to download AI photo.")

print("\n--- Testing Complete ---")
