const API_BASE = '/api';

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
}

export const addEmployee = async (formData) => {
    const token = localStorage.getItem('token'); // or whatever key stores your auth token

    const response = await fetch('http://localhost:5001/api/auth/register', { // adjust URL path if proxy handles it
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Note: Do NOT manually set 'Content-Type': 'multipart/form-data' 
            // when sending FormData; fetch handles boundary generation automatically.
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register employee');
    }

    return await response.json();
};