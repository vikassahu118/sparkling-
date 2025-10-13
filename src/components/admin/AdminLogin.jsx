import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

const API_BASE_URL = 'http://192.168.31.3:8000/api/v1';

const AdminLogin = ({ isDarkMode, onLoginSuccess }) => {
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrMobile, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials.');
            }

            // Check if the response contains the necessary user and token data
            if (data.data && data.data.user && data.data.accessToken) {
                
                // --- ✅ FIXED CODE START ---
                // 1. Save the access token to localStorage.
                // This makes it available for other parts of the application (like AdminPage).
                localStorage.setItem('adminToken', data.data.accessToken);

                // 2. (Optional but recommended) Save the user info as well.
                // We must stringify the object before saving it.
                localStorage.setItem('adminUser', JSON.stringify(data.data.user));
                // --- ✅ FIXED CODE END ---

                // 3. Signal to the parent component that login was successful.
                // This allows the parent (e.g., App.jsx) to change the view to the dashboard.
                onLoginSuccess(data.data);

            } else {
                throw new Error('Login response from server was incomplete.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 transition-colors duration-200`;
    const darkInputClasses = `bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500`;
    const lightInputClasses = `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-pink-500`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`py-20 max-w-md mx-auto p-8 rounded-3xl shadow-2xl my-12 ${
                isDarkMode ? 'bg-gray-800 text-white shadow-purple-900/40' : 'bg-white text-gray-900 shadow-pink-300/80'
            }`}
        >
            <h2 className={`text-3xl font-extrabold mb-2 text-center bg-gradient-to-r ${
                isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'
            } bg-clip-text text-transparent`}>
                Admin Login
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your management credentials</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Email or Mobile Number"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`}
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-500/10 border border-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                <motion.button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                        <LogIn className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Logging In...' : 'Login to Dashboard'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AdminLogin;