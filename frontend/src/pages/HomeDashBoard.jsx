export default function HomeDashboard({ user, onSelectWindow, onLogout }) {
    const rolesString = user?.roles ? user.roles.join(', ') : '';

    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome back, {user?.username || 'User'}!</h1>
            <p style={{ color: 'gray', marginBottom: '30px' }}>Permissions: {rolesString}</p>

            <h3>Select System Window</h3>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <div 
                    onClick={() => onSelectWindow('register')}
                    style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '30px', width: '250px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                >
                    <h2>👤 Registration</h2>
                    <p>Register new HR or Security team members.</p>
                </div>

                <div 
                    onClick={() => onSelectWindow('security')}
                    style={{ border: '2px solid #28a745', borderRadius: '8px', padding: '30px', width: '250px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                >
                    <h2>🛡️ Security Window</h2>
                    <p>Monitor security operations and logs.</p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <button 
                    onClick={onLogout}
                    style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Logout System
                </button>
            </div>
        </div>
    );
}