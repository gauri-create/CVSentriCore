import React, { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess, onBackToLanding }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser({ username, password });
            onLoginSuccess(data);
        } catch (err) {
            setError(err.message || 'Invalid credentials.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src="/CVSentriCore.png" alt="CVSentriCore Logo" style={styles.logoMini} />
                    <h2 style={{ color: '#00d2ff', margin: '10px 0 0 0' }}>CVSentriCore</h2>
                    <p style={{ color: '#8892b0', fontSize: '0.85rem', margin: '5px 0 0 0' }}>Enterprise Authentication</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>

                {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
                
                {onBackToLanding && (
                    <button onClick={onBackToLanding} style={styles.backButton}>
                        ← Back to Home
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#0a192f', 
        fontFamily: 'Arial, sans-serif' 
    },
    card: { 
        background: '#112240', 
        border: '1px solid #1e3a8a',
        padding: '2.5rem', 
        borderRadius: '10px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', 
        width: '340px',
        color: '#ffffff'
    },
    logoMini: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #00d2ff'
    },
    formGroup: { 
        marginBottom: '1.2rem', 
        textAlign: 'left' 
    },
    label: {
        color: '#a0aec0',
        fontSize: '0.9rem'
    },
    input: { 
        width: '100%', 
        padding: '0.7rem', 
        marginTop: '0.4rem', 
        boxSizing: 'border-box', 
        backgroundColor: '#0a192f',
        border: '1px solid #1e3a8a', 
        borderRadius: '4px',
        color: '#ffffff',
        outline: 'none'
    },
    button: { 
        width: '100%', 
        padding: '0.75rem', 
        backgroundColor: '#00d2ff', 
        color: '#0a192f', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '5px'
    },
    backButton: {
        width: '100%',
        marginTop: '15px',
        background: 'transparent',
        border: 'none',
        color: '#8892b0',
        cursor: 'pointer',
        fontSize: '0.85rem'
    }
};