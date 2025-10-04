import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Mail, ChevronLeft, UserPlus } from 'lucide-react';

// Mock function to simulate user authentication success
const MOCK_CUSTOMER_LOGIN = {
    user: 'Jane Doe',
    role: 'user'
};

const CustomerAuth = ({ isDarkMode, onLoginSuccess, onGuestContinue }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        setTimeout(() => {
            // Mock authentication success for any input
            if (email && password) {
                onLoginSuccess(MOCK_CUSTOMER_LOGIN.user, MOCK_CUSTOMER_LOGIN.role);
            } else {
                setError('Please fill in both fields.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-pink-500 transition-colors duration-200`;
    const darkInputClasses = `bg-gray-700 border-gray-600 text-white placeholder-gray-400`;
    const lightInputClasses = `bg-white border-gray-300 text-gray-900 placeholder-gray-500`;
    const containerBg = isDarkMode ? 'bg-gray-800 text-white shadow-purple-900/40' : 'bg-white text-gray-900 shadow-pink-300/80';
    const headerGradient = isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`py-16 max-w-md mx-auto p-8 rounded-3xl shadow-2xl my-12 ${containerBg}`}
        >
            <h2 className={`text-3xl font-extrabold mb-2 text-center bg-gradient-to-r ${headerGradient} bg-clip-text text-transparent`}>
                {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                {isLogin ? 'Sign in to view your profile and orders.' : 'Join the Sparkling Bubbles family!'}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Email Field */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Password"
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

                {/* Login/Signup Button */}
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
                        isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </motion.button>
            </form>
            
            {/* Toggle Link */}
            <div className="text-center mt-6">
                <button 
                    onClick={() => setIsLogin(p => !p)} 
                    className="text-sm text-purple-500 dark:text-purple-400 hover:underline"
                    disabled={isLoading}
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </motion.div>
    );
};
export default CustomerAuth;
