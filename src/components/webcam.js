'use client';

import React, { useRef, useState, useEffect } from 'react';

const WebcamComponent = ({images, setImages}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [stream, setStream] = useState(null);
  

  const startWebcam = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
      setIsWebcamOn(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setStream(null);
    setIsWebcamOn(false);
  };

  const captureImage = () => {
    if (isWebcamOn && videoRef.current && canvasRef.current && images.length < 3) {
      const context = canvasRef.current.getContext('2d');
      
      context.setTransform(1, 0, 0, 1, 0, 0); 
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
    
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setImages([...images, dataUrl]);

      // const link = document.createElement('a');
      // link.href = dataUrl;
      // link.download = `E:/Course/Project/FaceRegSys/Venv/face_rec/src/BE/test/captured-image-${images.length + 1}.png`; 
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link); 
    }
  };
  

  useEffect(() => {
    if (isWebcamOn) {
      startWebcam();
    }

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isWebcamOn]);

  return (
    <div>
      {
      (images.length === 0) ?
        (<h3 className="text-lg font-bold">Take a frontal shot</h3>):(images.length === 1) ?
        (<h3 className="text-lg font-bold">Take a right-side profile shot</h3>):(images.length === 2) ?
        (<h3 className="text-lg font-bold">Take a left-side profile shot</h3>):(images.length === 3) ?
        (<h3 className="text-lg font-bold"></h3>):null
      }
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
        style={{ transform: 'scaleX(-1)', display: 'block', margin: 'auto' }}
      ></video>

      <div className="flex justify-between items-center w-full mt-2">
        {isWebcamOn ? (
          <button
            type="button"
            onClick={stopWebcam}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Turn Off Webcam
          </button>
        ) : (
          <button
            type="button"
            onClick={startWebcam}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Turn On Webcam
          </button>
        )}
        <button
          type="button"
          onClick={captureImage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={images.length >= 3} 
        >
          {images.length >= 3 ? 'Max Images Captured' : 'Capture Image'}
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Captured Images</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Captured ${index + 1}`}
                className="w-40 h-40 object-cover border rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} width="640" height="640" style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default WebcamComponent;
