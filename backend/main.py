# backend/main.py
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import base64

app = FastAPI()

origins = [
    "http://localhost:3000",
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
async def process_image(
    image_base64: str = Form(...),
    operation: str = Form(...),
    blur_radius: int = Form(default=5),
    kernel_size: int = Form(default=5),
    iterations: int = Form(default=1),
    angle: int = Form(default=45),
    threshold_value: int = Form(default=127),
    scale_x: float = Form(default=0.5),
    scale_y: float = Form(default=0.5)
):
    try:
        img = base64_to_cv2(image_base64)
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary_img = cv2.threshold(gray_img, threshold_value, 255, cv2.THRESH_BINARY)
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        h, w = img.shape[:2]
        center = (w // 2, h // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)

        if operation == "grayscale":
            processed_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            processed_img_bgr = cv2.cvtColor(processed_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(processed_img_bgr)}
        elif operation == "blur":
            blurred_img = cv2.GaussianBlur(img, (blur_radius * 2 + 1, blur_radius * 2 + 1), 0)
            return {"processed_image": cv2_to_base64(blurred_img)}
        elif operation == "erosion":
            eroded_img = cv2.erode(binary_img, kernel, iterations=iterations)
            eroded_img_bgr = cv2.cvtColor(eroded_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(eroded_img_bgr)}
        elif operation == "dilation":
            dilated_img = cv2.dilate(binary_img, kernel, iterations=iterations)
            dilated_img_bgr = cv2.cvtColor(dilated_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(dilated_img_bgr)}
        elif operation == "opening":
            opened_img = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel, iterations=iterations)
            opened_img_bgr = cv2.cvtColor(opened_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(opened_img_bgr)}
        elif operation == "closing":
            closed_img = cv2.morphologyEx(binary_img, cv2.MORPH_CLOSE, kernel, iterations=iterations)
            closed_img_bgr = cv2.cvtColor(closed_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(closed_img_bgr)}
        elif operation == "gradient":
            gradient_img = cv2.morphologyEx(binary_img, cv2.MORPH_GRADIENT, kernel, iterations=iterations)
            gradient_img_bgr = cv2.cvtColor(gradient_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(gradient_img_bgr)}
        elif operation == "tophat":
            tophat_img = cv2.morphologyEx(gray_img, cv2.MORPH_TOPHAT, kernel, iterations=iterations)
            tophat_img_bgr = cv2.cvtColor(tophat_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(tophat_img_bgr)}
        elif operation == "blackhat":
            blackhat_img = cv2.morphologyEx(gray_img, cv2.MORPH_BLACKHAT, kernel, iterations=iterations)
            blackhat_img_bgr = cv2.cvtColor(blackhat_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(blackhat_img_bgr)}
        elif operation == "rotate":
            rotated_img = cv2.warpAffine(img, matrix, (w, h))
            return {"processed_image": cv2_to_base64(rotated_img)}
        elif operation == "resize":
            resized_img = cv2.resize(img, None, fx=scale_x, fy=scale_y, interpolation=cv2.INTER_LINEAR)
            return {"processed_image": cv2_to_base64(resized_img)}
        elif operation == "threshold":
            _, thresholded_img = cv2.threshold(gray_img, threshold_value, 255, cv2.THRESH_BINARY)
            thresholded_img_bgr = cv2.cvtColor(thresholded_img, cv2.COLOR_GRAY2BGR)
            return {"processed_image": cv2_to_base64(thresholded_img_bgr)}
        # More operations can be added here
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported operation: {operation}")

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)