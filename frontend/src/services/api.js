// src/services/api.js
import axios from 'axios';

// Create an Axios instance pointing to your backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your Node.js server URL
});

// Automatically attach the JWT token to every request if the user is logged in
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;