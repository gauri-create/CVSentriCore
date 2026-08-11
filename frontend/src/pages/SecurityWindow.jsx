import React, { useRef, useEffect, useState } from 'react';

function LiveSurveillance({ onNewLog, onStatusChange }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        let stream = null;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((mediaStream) => {
                stream = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            })
            .catch((err) => {
                console.error('Webcam error: ', err);
                onStatusChange('Camera unavailable');
            });

        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video.videoWidth || !video.videoHeight) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
            if (!imageBlob) return;

            const formData = new FormData();
            formData.append('image', imageBlob, 'frame.jpg');

            try {
                const response = await fetch('http://localhost:5001/api/recognize', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.matched) {
                    onStatusChange(`Recognized: ${data.name}`);
                    onNewLog({
                        id: Date.now(),
                        time: new Date().toLocaleTimeString(),
                        name: data.name,
                        type: 'Recognized Employee',
                        status: 'Access Granted'
                    }, false);
                } else {
                    onStatusChange('Unknown Intruder Detected');
                    onNewLog({
                        id: Date.now(),
                        time: new Date().toLocaleTimeString(),
                        name: 'Unknown Intruder',
                        type: 'Unrecognized Face',
                        status: 'Access Denied'
                    }, true);
                }
            } catch (error) {
                console.error('Error communicating with Python AI service:', error);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onNewLog, onStatusChange]);

    return (
        <div>
            <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#111', borderRadius: '6px', marginTop: '15px', border: '2px solid #333', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: '15px', left: '15px', color: '#ff4d4d', fontWeight: 'bold', zIndex: 10, textShadow: '0 1px 3px black' }}>
                    ● WEBCAM LIVE
                </div>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
}

export default function SecurityWindow({ onBack }) {
    const username = localStorage.getItem('username') || 'Security Personnel';
    
    // Master log state shared across the control center
    const [logs, setLogs] = useState([
        { id: 1, time: '03:15 AM', name: 'Ganesh', status: 'Access Granted', type: 'Recognized Employee' },
        { id: 2, time: '02:40 AM', name: 'Unknown Intruder', status: 'Access Denied', type: 'Unrecognized Face' },
    ]);

    const [currentStatus, setCurrentStatus] = useState('Scanning...');

    // State for active security alerts
    const [activeAlert, setActiveAlert] = useState({
        isAlert: false,
        message: '',
        time: ''
    });

    const handleNewLog = (newLog, isIntruder) => {
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);
        if (isIntruder) {
            setActiveAlert({
                isAlert: true,
                message: `🚨 SECURITY BREACH: Unknown individual detected on camera stream!`,
                time: newLog.time
            });
        }
    };

    const dismissAlert = () => {
        setActiveAlert({ isAlert: false, message: '', time: '' });
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            
            {/* Top Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={onBack} 
                    style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    ⬅ Back to Dashboard
                </button>
                <h2>🛡️ CVSentriCore Security Control Center</h2>
                <span style={{ fontWeight: 'bold', color: '#28a745' }}>Operator: {username}</span>
            </div>

            {/* Emergency Alert Banner */}
            {activeAlert.isAlert && (
                <div style={{ 
                    backgroundColor: '#ff4d4d', 
                    color: 'white', 
                    padding: '15px 20px', 
                    borderRadius: '6px', 
                    marginBottom: '20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(255, 77, 77, 0.4)'
                }}>
                    <div>
                        <strong style={{ fontSize: '18px' }}>{activeAlert.message}</strong>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>Timestamp: {activeAlert.time}</div>
                    </div>
                    <button 
                        onClick={dismissAlert}
                        style={{ backgroundColor: 'white', color: '#ff4d4d', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Acknowledge & Clear Alert
                    </button>
                </div>
            )}

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                
                {/* Left Column: Live Laptop Camera Feed */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h3>Live Laptop Camera Feed & Recognition Stream</h3>
                    <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontWeight: 'bold' }}>
                        Status: <span style={{ color: '#007bff' }}>{currentStatus}</span>
                    </div>
                    <LiveSurveillance onNewLog={handleNewLog} onStatusChange={setCurrentStatus} />
                </div>

                {/* Right Column: System Status */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h3>Security Status</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px', lineHeight: '2' }}>
                        <li>🟢 Camera Hardware: <strong>Connected</strong></li>
                        <li>🟢 Facial Match Engine: <strong>Active</strong></li>
                        <li>🟢 Intrusion Alarms: <strong style={{ color: activeAlert.isAlert ? 'red' : 'green' }}>{activeAlert.isAlert ? 'TRIGGERED' : 'Armed'}</strong></li>
                        <li>🔒 Threat Level: <strong style={{ color: activeAlert.isAlert ? 'red' : 'green' }}>{activeAlert.isAlert ? 'HIGH (Alert Active)' : 'NORMAL'}</strong></li>
                    </ul>
                </div>

            </div>

            {/* Bottom Section: Identification & Timestamp Logs */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                <h3>Identification & Access Logs (Real-time Timestamped)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Timestamp</th>
                            <th style={{ padding: '12px' }}>Identified Person / Status</th>
                            <th style={{ padding: '12px' }}>Detection Type</th>
                            <th style={{ padding: '12px' }}>Access Decision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: log.name.includes('Unknown') ? '#fff5f5' : 'transparent' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.time}</td>
                                <td style={{ padding: '12px' }}>{log.name}</td>
                                <td style={{ padding: '12px' }}>{log.type}</td>
                                <td style={{ padding: '12px', color: log.status === 'Access Granted' ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {log.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}