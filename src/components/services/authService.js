import axios from 'axios';

// Ensure you have this set up, pointing to your backend's URL
// e.g., 'http://192.168.31.3:8000/api'
const API_URL = 'http://192.168.31.3:8000/api/v1';

/**
 * Registers a new user.
 * The parameter is now an object to match the backend's expected structure.
 * @param {object} userData - User registration data.
 * @returns {Promise<object>} - The response data from the server.
 */
const register = (userData) => {
    // The keys (firstName, lastName, etc.) should match what your backend controller expects
    return axios.post(`${API_URL}/auth/register`, userData);
};

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The response data from the server.
 */
const login = (email, password) => {
    return axios.post(`${API_URL}/auth/login`, {
        emailOrMobile: email,
        password,
    });
};

const authService = {
    register,
    login,
};

export default authService;