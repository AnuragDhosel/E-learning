import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/api/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/api/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async getMe() {
        const response = await api.get('/api/auth/me');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.put('/api/auth/profile', profileData);
        return response.data;
    },

    async changePassword(passwordData) {
        const response = await api.put('/api/auth/change-password', passwordData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },
};
