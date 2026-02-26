import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically add token to every request
api.interceptors.request.use (
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 errors (token expired/invalid)
api.interceptors.response.use (
    (response) =>  response,
    (error) => {
        if(error.response?.staatus === 401) {
            // Token is invalid - clear it
            localStorage.removeItem('token');

            // Redirect to login
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
)   

export const applicationAPI = {
    getAll: () => api.get('/applications'),
    create: (data) => api.post('/applications', data),
    update: (id, data) => api.put(`/applications/${id}`, data),
    delete: (id) => api.delete(`/applications/${id}`)
};

export default api;