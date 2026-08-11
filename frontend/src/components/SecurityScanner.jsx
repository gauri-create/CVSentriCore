import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const SecurityScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [latestLog, setLatestLog] = useState({ name: 'Initializing...', status: 'Waiting' });
  const [isAlertActive, setIsAlertActive] = useState(false);

  // 1. Start the webcam stream when component loads
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Webcam access error: ", err));

    // 2. Set up automated scanning loop (every 3 seconds)
    const interval = setInterval(() => {
      captureAndSendFrame();
    }, 3000);

    return () => clearInterval(interval); // Cleanup timer on unmount
  }, []);

  // 3. Capture frame from video and send to Python AI Service
  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      try {
        // Step A: Send to Python AI Service for recognition
        const aiResponse = await axios.post('http://localhost:5001/api/recognize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const result = aiResponse.data;
        setLatestLog(result);

        // Trigger visual alert if unknown intruder detected
        if (result.status === 'Access Denied') {
          setIsAlertActive(true);
        } else {
          setIsAlertActive(false);
        }

        // Step B: Automatically send result to Spring Boot to log into MySQL
        await axios.post('http://localhost:8080/api/security/log', {
          name: result.name,
          status: result.status,
          type: result.type || 'Automated Scan'
        });

      } catch (error) {
        console.error("Scanning pipeline error:", error);
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>CVSentriCore - Live AI Surveillance</h2>
      
      {/* Emergency Alert Banner */}
      {isAlertActive && (
        <div style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '15px', marginBottom: '15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px', animation: 'pulse 1s infinite' }}>
          🚨 SECURITY ALERT: Unrecognized Individual Detected! 🚨
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Live Webcam View */}
        <div style={{ border: isAlertActive ? '4px solid red' : '4px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '480px', height: '360px', background: '#000' }} />
        </div>

        {/* Hidden canvas used to take snapshots */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Live Status Panel */}
        <div style={{ width: '300px', padding: '20px', background: '#f4f4f4', borderRadius: '8px', textAlign: 'left', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Live Status Feed</h3>
          <p><strong>Status:</strong> <span style={{ color: latestLog.status === 'Access Granted' ? 'green' : 'red' }}>{latestLog.status}</span></p>
          <p><strong>Identified As:</strong> {latestLog.name}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>* System auto-scans every 3 seconds and syncs with MySQL database.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityScanner;