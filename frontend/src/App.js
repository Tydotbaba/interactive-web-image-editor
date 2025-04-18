// Frontend code for an interactive image processing application
// This code allows users to upload an image, apply a grayscale filter, and view the processed image.
// The application communicates with a backend server to process the image.
// The backend server is expected to be running on localhost:8000 and should have an endpoint '/process_image'.
// The backend server should accept a POST request with the image data and the desired operation (grayscale).
// The backend server should return the processed image in base64 format.
// The frontend code uses React for building the user interface.
import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGrayscale = async () => {
    if (selectedImage) {
      try {
        const response = await fetch('http://localhost:8000/process_image', { // Backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            image_base64: selectedImage,
            operation: 'grayscale',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setProcessedImage(data.processed_image);
        } else {
          console.error('Error processing image:', response.statusText);
          // Consider displaying an error message to the user
        }
      } catch (error) {
        console.error('Error sending request:', error);
        // Consider displaying an error message to the user
      }
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div className="App App-header">
      <h1>Interactive Image Processor</h1>
      <input type="file" onChange={handleImageUpload} />

      {selectedImage && (
        <div>
          <h2>Original Image:</h2>
          <img src={selectedImage} alt="Original" style={{ maxWidth: '300px' }} />
        </div>
      )}

      <button onClick={handleGrayscale} disabled={!selectedImage}>
        Apply Grayscale
      </button>

      {processedImage && (
        <div>
          <h2>Processed Image (Grayscale):</h2>
          <img src={processedImage} alt="Processed" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}

export default App;