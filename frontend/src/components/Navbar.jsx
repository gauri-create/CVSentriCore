import React from 'react';

export default function Navbar({ user, onLogout }) {
    return (
        <header style={styles.header}>
            <div style={styles.brandContainer}>
                <img src="/logo.png" alt="CVSentriCore Logo" style={styles.logo} />
                <span style={styles.brandName}>CVSentriCore</span>
            </div>
            {user && (
                <div style={styles.userInfo}>
                    <span style={styles.welcomeText}>User: <strong>{user.username}</strong></span>
                    {onLogout && (
                        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
                    )}
                </div>
            )}
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 30px',
        backgroundColor: '#0a192f',
        borderBottom: '1px solid #1e3a8a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logo: {
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '50%',
        border: '2px solid #00d2ff'
    },
    brandName: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#00d2ff',
        letterSpacing: '0.5px'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    welcomeText: {
        fontSize: '0.9rem',
        color: '#a0aec0'
    },
    logoutBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 'bold'
    }
};