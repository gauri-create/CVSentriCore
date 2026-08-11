import React from 'react';

export default function LandingPage({ onGoToLogin }) {
    return (
        <div style={styles.container}>
            <div style={styles.heroSection}>
                <img src="/CVSentriCore.png" alt="CVSentriCore Logo" style={styles.logoImage} />
                <h1 style={styles.brandTitle}>CVSentriCore</h1>
                <p style={styles.subtitle}>Next-Generation AI Powered Surveillance & Secure Entry</p>
                
                <button onClick={onGoToLogin} style={styles.loginButton}>
                    Enterprise Login
                </button>
            </div>

            <div style={styles.cardsContainer}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Face Recognition</h3>
                    <p style={styles.cardText}>Real-time identity verification using deep learning CNN models to ensure only authorized personnel enter.</p>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Live Monitoring</h3>
                    <p style={styles.cardText}>Constant stream analysis with automated logging of every entry and exit for total transparency.</p>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Access Control</h3>
                    <p style={styles.cardText}>Role-based permissions for Security, HR, and Owners to manage facility security from any device.</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#0a192f',
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box'
    },
    heroSection: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    logoImage: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #00d2ff',
        marginBottom: '20px',
        boxShadow: '0 0 25px rgba(0, 210, 255, 0.4)'
    },
    brandTitle: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#00d2ff',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#a0aec0',
        marginBottom: '30px'
    },
    loginButton: {
        backgroundColor: '#00d2ff',
        color: '#0a192f',
        border: 'none',
        padding: '12px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0, 210, 255, 0.4)'
    },
    cardsContainer: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1100px',
        width: '100%'
    },
    card: {
        backgroundColor: '#112240',
        border: '2px solid #1e3a8a',
        borderRadius: '10px',
        padding: '30px',
        width: '300px',
        boxSizing: 'border-box',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
    },
    cardTitle: {
        color: '#00d2ff',
        fontSize: '1.25rem',
        marginBottom: '15px',
        marginTop: '0'
    },
    cardText: {
        color: '#8892b0',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        margin: '0'
    }
};