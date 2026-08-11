import React from 'react';
import Navbar from '../components/Navbar';

export default function HomeDashboard({ user, onSelectWindow, onLogout }) {
    const roles = user?.roles || [];
    const rolesString = roles.join(', ');

    // RBAC Permissions Logic based on roles
    const isOwner = roles.includes('ROLE_OWNER');
    const isHR = roles.includes('ROLE_HR');
    const isSecurity = roles.includes('ROLE_SECURITY');

    // Access flags
    const canRegister = isOwner || isHR;
    const canAccessSecurity = isOwner || isSecurity;
    const canAccessMembers = isOwner || isHR; // HR and Owner can view organizational members

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a192f', color: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
            <Navbar user={user} onLogout={onLogout} />
            
            <div style={{ padding: '50px 20px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ color: '#00d2ff', fontSize: '2.2rem', marginBottom: '10px' }}>Welcome back, {user?.username || 'User'}!</h1>
                <p style={{ color: '#8892b0', marginBottom: '45px', fontSize: '1.05rem' }}>
                    Assigned Designations (RBAC): <span style={{ color: '#ffffff' }}>{rolesString}</span>
                </p>

                <h3 style={{ color: '#a0aec0', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '25px' }}>
                    Authorized System Portals
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap' }}>
                    
                    {/* 1. Staff Registration Portal (Owner & HR) */}
                    {canRegister && (
                        <div 
                            onClick={() => onSelectWindow('register')}
                            style={styles.dashboardCard}
                        >
                            <h2 style={styles.cardHeader}>👤 Staff Registration</h2>
                            <p style={styles.cardDesc}>Onboard new HR, Security team members or administrators with role permissions.</p>
                        </div>
                    )}

                    {/* 2. Security Window Portal (Owner & Security Team) */}
                    {canAccessSecurity && (
                        <div 
                            onClick={() => onSelectWindow('security')}
                            style={styles.dashboardCard}
                        >
                            <h2 style={styles.cardHeader}>🛡️ Security Window</h2>
                            <p style={styles.cardDesc}>Real-time facial detection stream monitor, live logs, and access security center.</p>
                        </div>
                    )}

                    {/* 3. Members of Organization Portal (Owner & HR) */}
                    {canAccessMembers && (
                        <div 
                            onClick={() => onSelectWindow('members')}
                            style={styles.dashboardCard}
                        >
                            <h2 style={styles.cardHeader}>👥 Members Window</h2>
                            <p style={styles.cardDesc}>View directory and status of all registered personnel within the organization.</p>
                        </div>
                    )}

                    {!canRegister && !canAccessSecurity && !canAccessMembers && (
                        <p style={{ color: '#ff6b6b' }}>No system portals are currently assigned to your account permissions.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    dashboardCard: {
        backgroundColor: '#112240',
        border: '2px solid #1e3a8a', 
        borderRadius: '12px', 
        padding: '30px 20px', 
        width: '260px', 
        cursor: 'pointer', 
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        textAlign: 'left',
        transition: 'all 0.2s ease-in-out'
    },
    cardHeader: {
        color: '#00d2ff',
        fontSize: '1.2rem',
        marginTop: '0',
        marginBottom: '12px'
    },
    cardDesc: {
        color: '#8892b0',
        fontSize: '0.88rem',
        lineHeight: '1.5',
        margin: '0'
    }
};