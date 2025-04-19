import React, { useState } from 'react';
// import './App.css'; // You might still have some custom styles
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Image from 'react-bootstrap/Image';
// import Form from 'react-bootstrap/Form';

// import './App.css';

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [blurRadius, setBlurRadius] = useState(5);
    const [kernelSize, setKernelSize] = useState(5);
    const [iterations, setIterations] = useState(1);
    const [angle, setAngle] = useState(90);
    const [thresholdValue, setThresholdValue] = useState(127);
    const [scaleX, setScaleX] = useState(0.5);
    const [scaleY, setScaleY] = useState(0.5);

    // ... (handleImageUpload, handleImageUrlChange, handleLoadImageFromUrl functions)

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setProcessedImage(null); // Clear previous processed image
        };
        reader.readAsDataURL(file);
      }
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
        handleLoadImageFromUrl();
    }

    const handleLoadImageFromUrl = () => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
            setProcessedImage(null); // Clear previous processed image
        } else {
            alert('Please enter a valid image URL.');
        }
    }
    

    const applyOperation = async (operation, params = {}) => {
        if (selectedImage) {
            try {
                const formData = new URLSearchParams({
                    image_base64: selectedImage,
                    operation: operation,
                    blur_radius: params.blurRadius !== undefined ? params.blurRadius : blurRadius,
                    kernel_size: params.kernelSize !== undefined ? params.kernelSize : kernelSize,
                    iterations: params.iterations !== undefined ? params.iterations : iterations,
                    angle: params.angle !== undefined ? params.angle : angle,
                    threshold_value: params.thresholdValue !== undefined ? params.thresholdValue : thresholdValue,
                    scale_x: params.scaleX !== undefined ? params.scaleX : scaleX,
                    scale_y: params.scaleY !== undefined ? params.scaleY : scaleY,
                });

                const response = await fetch('http://localhost:8000/process_image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setProcessedImage(data.processed_image);
                } else {
                    console.error(`Error processing image (${operation}):`, response.statusText);
                }
            } catch (error) {
                console.error(`Error sending request (${operation}):`, error);
            }
        } else {
            alert('Please upload an image or enter a URL first.');
        }
    };

    return (
      <div className="pa3 sans-serif bg-light-pink">
      <h1 className="f1 fw6 mv3">Interactive Image Processor</h1>

      <div className="mb3">
        <label htmlFor="upload" className="db fw6 lh-copy f6">
          Upload Image:
        </label>
        <input
          type="file"
          id="upload"
          onChange={handleImageUpload}
          className="pa2 input-reset ba b--black-20 w-100"
        />
      </div>

      <div className="mb3">
        <label htmlFor="imageUrl" className="fw6 lh-copy f6">
          Or enter image URL:
        </label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="pa2 input-reset ba b--black-20 w-100"
        />
        <button onClick={handleLoadImageFromUrl} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-blue mt2">
          Load URL
        </button>
      </div>

      {selectedImage && (
        <div className="mv3">
          <h2 className="f4 fw6 mv2">Original Image:</h2>
          <img src={selectedImage} alt="Original" className="mw-100" style={{ maxWidth: '300px' }} />
        </div>
      )}

      <h2 className="f4 fw6 mt4">Basic Adjustments</h2>
      <div className="mv2">
        <button onClick={() => applyOperation('grayscale')} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-gray">Grayscale</button>
        <label className="ml2 fw6 f6">Blur Radius:</label>
        <input
          type="number"
          value={blurRadius}
          onChange={(e) => setBlurRadius(parseInt(e.target.value))}
          className="w2 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <button onClick={() => applyOperation('blur', { blurRadius })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-green ml2">Apply Blur</button>
      </div>

      <h2 className="f4 fw6 mt4">Morphological Filters</h2>
      <div className="mv2">
        <label className="fw6 f6">Kernel Size:</label>
        <input
          type="number"
          value={kernelSize}
          onChange={(e) => setKernelSize(parseInt(e.target.value))}
          className="w2 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <label className="ml2 fw6 f6">Iterations:</label>
        <input
          type="number"
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
          className="w2 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <button onClick={() => applyOperation('erosion', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-red">Erosion</button>
        <button onClick={() => applyOperation('dilation', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-green ml2">Dilation</button>
        <button onClick={() => applyOperation('opening', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue ml2">Opening</button>
        <button onClick={() => applyOperation('closing', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-purple ml2">Closing</button>
        <button onClick={() => applyOperation('gradient', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-orange ml2">Gradient</button>
        <button onClick={() => applyOperation('tophat', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-navy ml2">Top Hat</button>
        <button onClick={() => applyOperation('blackhat', { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-pink ml2">Black Hat</button>
      </div>

      <h2 className="f4 fw6 mt4">Geometric Transformations</h2>
      <div className="mv2">
        <label className="fw6 f6">Angle:</label>
        <input
          type="number"
          value={angle}
          onChange={(e) => setAngle(parseInt(e.target.value))}
          className="w3 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <button onClick={() => applyOperation('rotate', { angle })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-purple ml2">Rotate</button>
        <label className="ml2 fw6 f6">Scale X:</label>
        <input
          type="number"
          value={scaleX}
          onChange={(e) => setScaleX(parseFloat(e.target.value))}
          className="w2 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <label className="ml2 fw6 f6">Scale Y:</label>
        <input
          type="number"
          value={scaleY}
          onChange={(e) => setScaleY(parseFloat(e.target.value))}
          className="w2 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <button onClick={() => applyOperation('resize', { scaleX, scaleY })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-blue ml2">Resize</button>
      </div>

      <h2 className="f4 fw6 mt4">Segmentation</h2>
      <div className="mv2">
        <label className="fw6 f6">Threshold Value:</label>
        <input
          type="number"
          value={thresholdValue}
          onChange={(e) => setThresholdValue(parseInt(e.target.value))}
          className="w3 pa2 input-reset ba b--black-20 ml1"
          disabled={!selectedImage}
        />
        <button onClick={() => applyOperation('threshold', { thresholdValue })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-green ml2">Threshold</button>
      </div>

      {processedImage && (
        <div className="mv3">
          <h2 className="f4 fw6 mv2">Processed Image:</h2>
          <img src={processedImage} alt="Processed" className="mw-100" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
    );
}

export default App;