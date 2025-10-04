import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock } from 'lucide-react';

// Mock credentials for testing different roles
const MOCK_CREDENTIALS = {
    admin: 'admin123',
    product: 'product123',
    finance: 'finance123',
    order: 'order123'
};

// Maps username to role ID
const ROLE_MAP = {
    admin: 'admin',
    product: 'product_manager',
    finance: 'finance_manager',
    order: 'product_manager' // Order Manager uses the product_manager role for simplicity
};

const AdminLogin = ({ isDarkMode, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const normalizedUsername = username.toLowerCase().trim();
        const expectedPassword = MOCK_CREDENTIALS[normalizedUsername];

        setTimeout(() => {
            if (expectedPassword === password) {
                const role = ROLE_MAP[normalizedUsername];
                if (role) {
                    onLoginSuccess(role);
                } else {
                    setError('Unknown role. Please use "admin", "product", or "finance".');
                }
            } else {
                setError('Invalid credentials. Try "admin" and "admin123".');
            }
            setIsLoading(false);
        }, 1000);
    };

    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 transition-colors duration-200`;
    const darkInputClasses = `bg-gray-700 border-gray-600 text-white placeholder-gray-400`;
    const lightInputClasses = `bg-white border-gray-300 text-gray-900 placeholder-gray-500`;

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
                
                {/* Username Field */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Username (e.g., admin, product)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Password (e.g., admin123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`}
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-500/10 border border-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Login Button */}
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
