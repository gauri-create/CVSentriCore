import React, { useState } from 'react';
import Login from './pages/Login';
import HomeDashboard from './pages/HomeDashboard';
import RegisterForm from './pages/RegisterForm';
import SecurityWindow from './pages/SecurityWindow';
import LandingPage from './pages/LandingPage';

export default function App() {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('landing'); 

    const handleLoginSuccess = (data) => {
        setUser(data);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userRoles', JSON.stringify(data.roles));
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.clear();
        setCurrentView('landing');
    };

    if (!user) {
        if (currentView === 'login') {
            return (
                <Login 
                    onLoginSuccess={handleLoginSuccess} 
                    onBackToLanding={() => setCurrentView('landing')} 
                />
            );
        }
        return <LandingPage onGoToLogin={() => setCurrentView('login')} />;
    }

    if (currentView === 'dashboard') {
        return (
            <HomeDashboard 
                user={user} 
                onSelectWindow={(view) => setCurrentView(view)} 
                onLogout={handleLogout} 
            />
        );
    }

    if (currentView === 'register') {
        return (
            <div style={{ backgroundColor: '#0a192f', minHeight: '100vh', paddingBottom: '30px' }}>
                <button 
                    onClick={() => setCurrentView('dashboard')} 
                    style={{ margin: '20px 0 0 20px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#112240', color: '#00d2ff', border: '1px solid #00d2ff', borderRadius: '4px', fontWeight: 'bold' }}
                >
                    ⬅ Back to Dashboard
                </button>
                <RegisterForm userRoles={user.roles} />
            </div>
        );
    }

    if (currentView === 'security') {
        return <SecurityWindow onBack={() => setCurrentView('dashboard')} />;
    }
}