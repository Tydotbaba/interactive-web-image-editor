import React, { useState } from 'react';
import './App.css'; // You might still have some custom styles
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
    const [activeOperation, setActiveOperation] = useState(null);

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
      console.log(isOpen)
    };

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

    const handleOperationClick = (operation) => {
      setActiveOperation(operation);
      applyOperation(operation, getOperationParams(operation));
    };
  
    const getOperationParams = (operation) => {
      switch (operation) {
        case 'blur':
          return { blurRadius };
        case 'erosion':
        case 'dilation':
        case 'opening':
        case 'closing':
        case 'gradient':
        case 'tophat':
        case 'blackhat':
          return { kernelSize, iterations };
        case 'rotate':
          return { angle };
        case 'resize':
          return { scaleX, scaleY };
        case 'threshold':
          return { thresholdValue };
        default:
          return {};
      }
    };
  

    return (
      <div>
      <div className="main sans-serif">
      {/* Sidebar */}
      <aside className="zone bg-lightest-blue top-0 left-0 bottom-0" >
        <h2 className="f4 fw6 mv3 tc">Operations</h2>
        <ul className="list pl0 mv0">
          <li className="mv2">
            <button onClick={() => handleOperationClick('grayscale')} className={`f6 link dim br2 ph3 pv2 dib white bg-gray w-100 tl ${activeOperation === 'grayscale' ? 'bg-dark-gray' : ''}`}>Grayscale</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('blur')} className={`f6 link dim br2 ph3 pv2 dib white bg-green w-100 tl ${activeOperation === 'blur' ? 'bg-dark-green' : ''}`}>Blur</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('erosion')} className={`f6 link dim br2 ph3 pv2 dib white bg-dark-red w-100 tl ${activeOperation === 'erosion' ? 'bg-red' : ''}`}>Erosion</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('dilation')} className={`f6 link dim br2 ph3 pv2 dib white bg-dark-green w-100 tl ${activeOperation === 'dilation' ? 'bg-green' : ''}`}>Dilation</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('opening')} className={`f6 link dim br2 ph3 pv2 dib white bg-dark-blue w-100 tl ${activeOperation === 'opening' ? 'bg-blue' : ''}`}>Opening</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('closing')} className={`f6 link dim br2 ph3 pv2 dib white bg-purple w-100 tl ${activeOperation === 'closing' ? 'bg-dark-purple' : ''}`}>Closing</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('gradient')} className={`f6 link dim br2 ph3 pv2 dib white bg-orange w-100 tl ${activeOperation === 'gradient' ? 'bg-dark-orange' : ''}`}>Gradient</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('tophat')} className={`f6 link dim br2 ph3 pv2 dib white bg-navy w-100 tl ${activeOperation === 'tophat' ? 'bg-dark-navy' : ''}`}>Top Hat</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('blackhat')} className={`f6 link dim br2 ph3 pv2 dib white bg-dark-pink w-100 tl ${activeOperation === 'blackhat' ? 'bg-pink' : ''}`}>Black Hat</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('rotate')} className={`f6 link dim br2 ph3 pv2 dib white bg-light-purple w-100 tl ${activeOperation === 'rotate' ? 'bg-purple' : ''}`}>Rotate</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('resize')} className={`f6 link dim br2 ph3 pv2 dib white bg-light-blue w-100 tl ${activeOperation === 'resize' ? 'bg-blue' : ''}`}>Resize</button>
          </li>
          <li className="mv2">
            <button onClick={() => handleOperationClick('threshold')} className={`f6 link dim br2 ph3 pv2 dib white bg-light-green w-100 tl ${activeOperation === 'threshold' ? 'bg-green' : ''}`}>Threshold</button>
          </li>
        </ul>
      </aside>

      
      {/* Main Content */}
      <div className="flex-row-m w-100 justify-center " >
        <h1 className="f1-l f1-m f1-ns fw6 black mv3">Interactive Image Processor</h1>

        <div className="flex flex-wrap justify-center">
          <div className="mr3">
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

          <div className="flex flex-wrap">
            <div className="mt4-m w-100-m ml5-l ">
              <label htmlFor="imageUrl" className="db fw6 lh-copy f6 ">
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
            </div>
            <button onClick={handleLoadImageFromUrl} className="f6 link dim dib br2 ph3 pv2 ml3 mt3 center  dib white bg-blue mt2">
              Load URL
            </button>
          </div>
        </div>

        
        {activeOperation === 'blur' && (
          <div className="mt3-l mt3-m tc">
            <label className="db fw6 lh-copy f6">Blur Radius:</label>
            <input
              type="number"
              value={blurRadius}
              onChange={(e) => setBlurRadius(parseInt(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20"
              disabled={!selectedImage}
            />
            <button onClick={() => applyOperation('blur', { blurRadius })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-green ml2">Apply</button>
          </div>
        )}

        {(activeOperation === 'erosion' || activeOperation === 'dilation' || activeOperation === 'opening' || activeOperation === 'closing' || activeOperation === 'gradient' || activeOperation === 'tophat' || activeOperation === 'blackhat') && (
          <div className="mt4 tc">
            <label className="db fw6 lh-copy f6">Kernel Size:</label>
            <input
              type="number"
              value={kernelSize}
              onChange={(e) => setKernelSize(parseInt(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20 mr2"
              disabled={!selectedImage}
            />
            <label className="db fw6 lh-copy f6">Iterations:</label>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20"
              disabled={!selectedImage}
            />
            <button onClick={() => applyOperation(activeOperation, { kernelSize, iterations })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-red ml2">Apply</button>
          </div>
        )}

        {activeOperation === 'rotate' && (
          <div className="mt4 tc">
            <label className="db fw6 lh-copy f6">Angle:</label>
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20"
              disabled={!selectedImage}
            />
            <button onClick={() => applyOperation('rotate', { angle })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-purple ml2">Apply</button>
          </div>
        )}

        {activeOperation === 'resize' && (
          <div className="mt4 tc">
            <label className="db fw6 lh-copy f6 mr2">Scale X:</label>
            <input
              type="number"
              value={scaleX}
              onChange={(e) => setScaleX(parseFloat(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20 mr2"
              disabled={!selectedImage}
            />
            <label className="db fw6 lh-copy f6 mr2">Scale Y:</label>
            <input
              type="number"
              value={scaleY}
              onChange={(e) => setScaleY(parseFloat(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20"
              disabled={!selectedImage}
            />
            <button onClick={() => applyOperation('resize', { scaleX, scaleY })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-blue ml2">Apply</button>
          </div>
        )}

        {activeOperation === 'threshold' && (
          <div className="mt4 tc">
            <label className="db fw6 lh-copy f6">Threshold Value:</label>
            <input
              type="number"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(parseInt(e.target.value))}
              className="pa2 input-reset ba b--black-20 w-20"
              disabled={!selectedImage}
            />
            <button onClick={() => applyOperation('threshold', { thresholdValue })} disabled={!selectedImage} className="f6 link dim br2 ph3 pv2 mb2 dib white bg-light-green ml2">Apply</button>
          </div>
        )}

        {selectedImage && (
          <div className="flex flex-wrap  justify-center mt1">
            <div className="ma2">
              <h2 className="f4 fw6">Original Image:</h2>
              <img src={selectedImage} alt="Original" className="mw-100" width={500} />
            </div>
            {processedImage && (
              <div className="ma2">
                <h2 className="f4 fw6">Processed Image:</h2>
                <img src={processedImage} alt="Processed" className="wm-100"  width={500} />
              </div>
            )}
          </div>
        )}
      </div>
      </div>


      <footer className="bg-light-gray pa3 vw-100 tc">
        <p className="f3">Image Processing App © {new Date().getFullYear()}</p>
        <p className="f6">Built with React</p>
        <p className="f6">Backend powered by Flask</p>
        <p className="f6">Image processing powered by OpenCV</p>
        <p className="f6">Source code available on <a href="https://github.com/Tydotbaba/interactive-web-image-editor" className="link dim blue">GitHub</a></p>
      </footer>
      </div>
      
    );
}

export default App;