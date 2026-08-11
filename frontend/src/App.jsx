import React, { useState } from 'react';
import Login from './pages/Login';
import HomeDashboard from './pages/HomeDashboard';
import RegisterForm from './pages/RegisterForm';
import SecurityWindow from './pages/SecurityWindow';
// frontend\src\pages\HomeDashBoard.jsx
export default function App() {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');

    const handleLoginSuccess = (data) => {
        setUser(data);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userRoles', JSON.stringify(data.roles));
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.clear();
        setCurrentView('dashboard');
    };

    // 1. If not logged in, render Login page
    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // 2. If logged in, show the Dashboard window selection hub
    if (currentView === 'dashboard') {
        return (
            <HomeDashboard 
                user={user} 
                onSelectWindow={(view) => setCurrentView(view)} 
                onLogout={handleLogout} 
            />
        );
    }

    // 3. Registration Window view
    if (currentView === 'register') {
        return (
            <div>
                <button 
                    onClick={() => setCurrentView('dashboard')} 
                    style={{ margin: '20px', padding: '8px 16px', cursor: 'pointer' }}
                >
                    ⬅ Back to Dashboard
                </button>
                <RegisterForm userRoles={user.roles} />
            </div>
        );
    }

    // 4. Security Window view
   // 4. Security Window view
    if (currentView === 'security') {
        return <SecurityWindow onBack={() => setCurrentView('dashboard')} />;
    
    }
}