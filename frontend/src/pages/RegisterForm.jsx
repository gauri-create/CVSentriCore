import React, { useState } from 'react';
import { addEmployee } from '../services/api';

export default function RegisterForm({ userRoles }) {
    // Safely parse roles whether passed as a string or array
    const rolesString = Array.isArray(userRoles) ? userRoles.join(',') : (userRoles || '');
    const isOwner = rolesString.includes('ROLE_OWNER');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        role: 'ROLE_SECURITY'
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Package text fields and file into FormData for multipart submission
            const data = new FormData();
            data.append('username', formData.username);
            data.append('password', formData.password);
            data.append('email', formData.email);
            data.append('fullName', formData.fullName);
            data.append('role', formData.role);
            
            if (profilePicture) {
                data.append('profilePicture', profilePicture);
            }

            const result = await addEmployee(data);
            setSuccess(result.message || 'Employee registered successfully!');
            
            // Reset form
            setFormData({ username: '', password: '', email: '', fullName: '', role: 'ROLE_SECURITY' });
            setProfilePicture(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '30px auto', padding: '25px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
            <h2>Register New Staff</h2>
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Assign Role / Designation</label>
                    <select name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                        {isOwner && <option value="ROLE_OWNER">Owner / Admin</option>}
                        <option value="ROLE_HR">HR Personnel</option>
                        <option value="ROLE_SECURITY">Security Staff</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Profile Picture</label>
                    <input type="file" onChange={handleFileChange} style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Register New Employee
                </button>
            </form>
        </div>
    );
}