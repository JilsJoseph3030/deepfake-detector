import os
import time
import requests
import cv2
import tempfile
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = FastAPI(title="VERITY Backend", version="1.0.0")

# Allow requests from the Next.js frontend (Vercel + localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "VERITY ML Engine", "version": "1.0.0"}

HF_API_URL = "https://api-inference.huggingface.co/models/prithivMLmods/Deep-Fake-Detector-Model"
hf_api_key = os.environ.get("HF_API_KEY", "")
headers = {"Authorization": f"Bearer {hf_api_key}"}

def extract_frame_from_video(video_path: str, output_image_path: str):
    cap = cv2.VideoCapture(video_path)
    success, image = cap.read()
    if success:
        cv2.imwrite(output_image_path, image)
    cap.release()
    return success

def query_hf(file_path: str):
    with open(file_path, "rb") as f:
        data = f.read()
    
    # Try up to 4 times in case the model is waking up (can take 30s+)
    for _ in range(4):
        response = requests.post(HF_API_URL, headers=headers, data=data)
        if response.status_code == 503:
            # Model is loading, sleep and retry
            time.sleep(15)
            continue
        break
    return response.json(), response.status_code

@app.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    filename = file.filename if file.filename else "unnamed_video.mp4"
    # Basic filename sanitization
    filename = "".join(c for c in filename if c.isalnum() or c in ".-_")
    is_image = file.content_type.startswith("image") if file.content_type else False

    # Save uploaded file to temp file
    temp_ext = ".jpg" if is_image else ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=temp_ext) as temp_media:
        temp_media.write(await file.read())
        temp_media_path = temp_media.name

    target_image_path = temp_media_path

    # If it's a video, extract the first frame for the image model
    if not is_image:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as img_tmp:
            target_image_path = img_tmp.name
        success = extract_frame_from_video(temp_media_path, target_image_path)
        if not success:
            try:
                os.remove(temp_media_path)
                os.remove(target_image_path)
            except:
                pass
            return {"error": "Failed to extract frame from video"}

    # Query Hugging Face
    hf_response, status_code = query_hf(target_image_path)
    
    # Clean up temp files
    try:
        os.remove(temp_media_path)
        if not is_image:
            os.remove(target_image_path)
    except:
        pass

    confidence = 0
    verdict = "authentic"
    verdict_label = "No Strong Manipulation Indicators"
    severity = "low"
    
    # Parse HF response
    # Expected format: [{'label': 'Fake', 'score': 0.98}, {'label': 'Real', 'score': 0.02}]
    # Handle error responses from HF
    if status_code != 200 or not isinstance(hf_response, list):
        confidence = 50
        verdict = "error"
        verdict_label = "Unable to Verify (API Error)"
        error_msg = hf_response.get("error", "Unknown error") if isinstance(hf_response, dict) else str(hf_response)
        summary = f"Hugging Face API Error: {error_msg}"
    else:
        fake_score = 0
        real_score = 0
        for item in hf_response:
            label = item.get("label", "").lower()
            score = item.get("score", 0)
            if "fake" in label or "altered" in label or "manipulated" in label:
                fake_score = max(fake_score, score)
            elif "real" in label or "authentic" in label or "original" in label:
                real_score = max(real_score, score)
        
        # Determine confidence based on Fake score (0-100)
        confidence = int(fake_score * 100)
        
        if confidence >= 75:
            verdict = "manipulation_indicators"
            verdict_label = "Strong Synthetic Evidence"
            severity = "high"
            summary = "The AI model detected high-confidence synthetic artifacts."
        elif confidence >= 40:
            verdict = "manipulation_indicators"
            verdict_label = "Manipulation Indicators Detected"
            severity = "medium"
            summary = "The AI model detected moderate manipulation indicators."
        else:
            verdict = "authentic"
            verdict_label = "No Strong Manipulation Indicators"
            severity = "low"
            summary = "The media appears authentic based on AI analysis."

    mock_payload = {
        "id": f"case_{int(time.time())}",
        "fileName": filename,
        "mediaType": "image" if is_image else "video",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "verdict": verdict,
        "verdictLabel": verdict_label,
        "verdictColor": "red" if confidence >= 75 else ("yellow" if confidence >= 40 else "green"),
        "confidence": confidence,
        "summary": summary,
        "provenance": {
            "c2pa": False,
            "metadata": "partial",
            "software": "Hugging Face Inference API",
            "status": "Origin cannot be fully established"
        },
        "visualForensics": {
            "score": confidence,
            "findings": [
                {
                    "title": "Hugging Face Model Output",
                    "severity": severity,
                    "technical": f"prithivMLmods/Deep-Fake-Detector-Model returned {confidence}% deepfake probability.",
                    "plainLanguage": summary
                }
            ]
        },
        "audioForensics": {
            "score": 0,
            "findings": []
        },
        "sourceTrace": []
    }

    return mock_payload

if __name__ == "__main__":
    import uvicorn
    # Disable reload in production to prevent arbitrary code execution vulnerabilities
    is_dev = os.environ.get("ENV") == "development"
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=is_dev)
