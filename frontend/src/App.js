import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
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
      <Container className="mt-4">
      <h1>Interactive Image Processor</h1>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Image:</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formImageUrl" className="mb-3">
            <Form.Label>Or enter image URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleLoadImageFromUrl} disabled={!imageUrl}>
            Load URL
          </Button>
        </Col>
      </Row>

      {selectedImage && (
        <Row className="mb-3">
          <Col md={6}>
            <h2>Original Image:</h2>
            <Image src={selectedImage} alt="Original" fluid style={{ maxWidth: '300px' }} />
          </Col>
          {processedImage && (
            <Col md={6}>
              <h2>Processed Image:</h2>
              <Image src={processedImage} alt="Processed" fluid style={{ maxWidth: '300px' }} />
            </Col>
          )}
        </Row>
      )}

      <h2 className="mt-4">Basic Adjustments</h2>
      <Row className="mb-3">
        <Col md="auto">
          <Button variant="outline-secondary" onClick={() => applyOperation('grayscale')} disabled={!selectedImage}>Grayscale</Button>
        </Col>
        <Col md="auto">
          <Form.Label className="me-2">Blur Radius:</Form.Label>
          <Form.Control
            type="number"
            value={blurRadius}
            onChange={(e) => setBlurRadius(parseInt(e.target.value))}
            style={{ width: '60px' }}
            disabled={!selectedImage}
          />
          <Button variant="primary" onClick={() => applyOperation('blur', { blurRadius })} disabled={!selectedImage} className="ms-2">Apply Blur</Button>
        </Col>
      </Row>

      <h2 className="mt-4">Morphological Filters</h2>
      <Row className="mb-3">
        <Col md="auto">
          <Form.Label className="me-2">Kernel Size:</Form.Label>
          <Form.Control
            type="number"
            value={kernelSize}
            onChange={(e) => setKernelSize(parseInt(e.target.value))}
            style={{ width: '60px' }}
            disabled={!selectedImage}
          />
        </Col>
        <Col md="auto">
          <Form.Label className="me-2">Iterations:</Form.Label>
          <Form.Control
            type="number"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            style={{ width: '60px' }}
            disabled={!selectedImage}
          />
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('erosion', { kernelSize, iterations })} disabled={!selectedImage}>Erosion</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('dilation', { kernelSize, iterations })} disabled={!selectedImage}>Dilation</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('opening', { kernelSize, iterations })} disabled={!selectedImage}>Opening</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('closing', { kernelSize, iterations })} disabled={!selectedImage}>Closing</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('gradient', { kernelSize, iterations })} disabled={!selectedImage}>Gradient</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('tophat', { kernelSize, iterations })} disabled={!selectedImage}>Top Hat</Button>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => applyOperation('blackhat', { kernelSize, iterations })} disabled={!selectedImage}>Black Hat</Button>
        </Col>
      </Row>

      <h2 className="mt-4">Geometric Transformations</h2>
      <Row className="mb-3">
        <Col md="auto">
          <Form.Label className="me-2">Angle:</Form.Label>
          <Form.Control
            type="number"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            style={{ width: '70px' }}
            disabled={!selectedImage}
          />
          <Button variant="info" onClick={() => applyOperation('rotate', { angle })} disabled={!selectedImage} className="ms-2">Rotate</Button>
        </Col>
        <Col md="auto">
          <Form.Label className="me-2">Scale X:</Form.Label>
          <Form.Control
            type="number"
            value={scaleX}
            onChange={(e) => setScaleX(parseFloat(e.target.value))}
            style={{ width: '60px' }}
            disabled={!selectedImage}
          />
        </Col>
        <Col md="auto">
          <Form.Label className="me-2">Scale Y:</Form.Label>
          <Form.Control
            type="number"
            value={scaleY}
            onChange={(e) => setScaleY(parseFloat(e.target.value))}
            style={{ width: '60px' }}
            disabled={!selectedImage}
          />
          <Button variant="info" onClick={() => applyOperation('resize', { scaleX, scaleY })} disabled={!selectedImage} className="ms-2">Resize</Button>
        </Col>
      </Row>

      <h2 className="mt-4">Segmentation</h2>
      <Row className="mb-3">
        <Col md="auto">
          <Form.Label className="me-2">Threshold Value:</Form.Label>
          <Form.Control
            type="number"
            value={thresholdValue}
            onChange={(e) => setThresholdValue(parseInt(e.target.value))}
            style={{ width: '70px' }}
            disabled={!selectedImage}
          />
          <Button variant="success" onClick={() => applyOperation('threshold', { thresholdValue })} disabled={!selectedImage} className="ms-2">Threshold</Button>
        </Col>
      </Row>
    </Container>
    );
}

export default App;