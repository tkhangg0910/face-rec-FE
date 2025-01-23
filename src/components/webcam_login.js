'use client';

import React, { useState, useRef, useEffect } from 'react';

const WebcamLogin = ({ onCapture , setUsername}) => {
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

  const captureAndSendFrame = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageBase64 = canvas.toDataURL('image/jpeg');

      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            stopWebcam();
            setUsername(data.name);
          } else {
            console.log('No username found in response.');
          }
        })
        .catch((error) => {
          console.error('Error sending frame:', error);
        });
    }
  };

  useEffect(() => {
    if (isWebcamOn) {
      const intervalId = setInterval(() => captureAndSendFrame(), 330);
      return () => clearInterval(intervalId); 
    }
  }, [isWebcamOn]);

  return (
    <div className="webcam-login-container">
      <div className="webcam-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
          style={{ transform: 'scaleX(-1)', display: 'block', margin: 'auto' }}
        ></video>
      </div>

      <div className="controls ">
        <div className="buttons mt-3">
          {isWebcamOn ? (
            <button
              onClick={stopWebcam}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Turn Off Webcam
            </button>
          ) : (
            <button
              onClick={startWebcam}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Turn On Webcam
            </button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default WebcamLogin;
