import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
            // Clear token from localStorage
            localStorage.removeItem('token');

            // Redirect to login page (if using React Router)
            // window.location.href = '/login';

            console.error('Unauthorized - Token expired or invalid');
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Forbidden - Insufficient permissions');
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server Error - Please try again later');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
