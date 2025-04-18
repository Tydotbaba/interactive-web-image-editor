# backend/main.py
from fastapi import FastAPI, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64

app = FastAPI()

# Configure CORS to allow requests from the frontend (adjust origin as needed)
origins = [
    "http://localhost:3000",  # Default React development server port
    "http://localhost",
    "https://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def base64_to_cv2(base64_str):
    try:
        base64_encoded_data = base64_str.split(',')[1]
        image_bytes = base64.b64decode(base64_encoded_data)
        image_np = np.frombuffer(image_bytes, dtype=np.uint8)
        img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error decoding image: {e}")

def cv2_to_base64(img):
    try:
        _, img_encoded = cv2.imencode('.png', img)
        base64_str = base64.b64encode(img_encoded).decode('utf-8')
        return f"data:image/png;base64,{base64_str}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error encoding image: {e}")

@app.post("/process_image")
async def process_image(image_base64: str = Form(...), operation: str = Form(...)):
    try:
        img = base64_to_cv2(image_base64)

        if operation == "grayscale":
            processed_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # Need to convert back to BGR for consistent encoding to PNG
            processed_img_bgr = cv2.cvtColor(processed_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(processed_img_bgr)}
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported operation: {operation}")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)