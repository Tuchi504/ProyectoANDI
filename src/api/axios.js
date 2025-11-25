import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Adjust if backend is on a different port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Don't redirect if the error is from the login endpoint
            // This allows the login page to handle incorrect credentials properly
            const isLoginRequest = error.config?.url?.includes('/api/User/login');

            if (!isLoginRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login only if not already trying to login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;
