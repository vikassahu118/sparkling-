import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Import the Phone icon for the mobile number field
import { LogIn, User, Lock, Mail, UserPlus, Phone } from 'lucide-react'; 
import authService from './services/authService'; // Make sure this path is correct

const CustomerAuth = ({ isDarkMode, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Add state for new registration fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Clear all form fields and errors when toggling
    const toggleForm = () => {
        setIsLogin(p => !p);
        setError(null);
        setFirstName('');
        setLastName('');
        setMobile('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let response;
            if (isLogin) {
                // Handle Login
                response = await authService.login(email, password);
            } else {
                // Handle Registration
                const userData = { firstName, lastName, email, mobile, password };
                response = await authService.register(userData);
            }
            
            // Your backend will likely return user data and a token.
            // Adjust the logic below to match your actual API response structure.
            // Example response: { data: { user: { id: '...', first_name: 'Jane', role_name: 'Customer' }, token: '...' } }
            if (response.data && response.data.user) {
                // NOTE: Also handle the JWT token here! e.g., localStorage.setItem('token', response.data.token);
                const userFullName = `${response.data.user.first_name} ${response.data.user.last_name}`;
                onLoginSuccess(userFullName, response.data.user.role_name);
            } else {
                 throw new Error("Login failed: Invalid response from server.");
            }

        } catch (err) {
            // Display specific error message from the backend if available
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
            className={`py-12 max-w-md mx-auto p-8 rounded-3xl shadow-2xl my-12 ${containerBg}`}
        >
            <h2 className={`text-3xl font-extrabold mb-2 text-center bg-gradient-to-r ${headerGradient} bg-clip-text text-transparent`}>
                {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                {isLogin ? 'Sign in to view your profile and orders.' : 'Join the Sparkling Bubbles family!'}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                
                {/* Registration-only Fields */}
                {!isLogin && (
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex gap-4">
                            {/* First Name */}
                            <div className="relative w-1/2">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required disabled={isLoading} />
                            </div>
                            {/* Last Name */}
                            <div className="relative w-1/2">
                                 <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} p-3`} required disabled={isLoading} />
                            </div>
                        </div>
                        {/* Mobile Number */}
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required disabled={isLoading} />
                        </div>
                    </motion.div>
                )}

                {/* Email Field */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required disabled={isLoading} />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required disabled={isLoading} />
                </div>

                {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-500/10 border border-red-500 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <motion.button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isLoading}>
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </motion.button>
            </form>
            
            <div className="text-center mt-6">
                <button onClick={toggleForm} className="text-sm text-purple-500 dark:text-purple-400 hover:underline" disabled={isLoading}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </motion.div>
    );
};
export default CustomerAuth;