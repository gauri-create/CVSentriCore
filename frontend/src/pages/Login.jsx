import { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
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
                <h2>CVSentriCore Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Password</label>
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
                {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f9', fontFamily: 'Arial, sans-serif' },
    card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px' },
    formGroup: { marginBottom: '1rem', textAlign: 'left' },
    input: { width: '100%', padding: '0.5rem', marginTop: '0.3rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};