import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LogIn, User, Lock, Mail, UserPlus, Phone, Calendar, Users } from 'lucide-react';

// --- Real Authentication Service integrated directly into the component file ---
const API_URL = 'http://localhost:8000/api/v1';

const authService = {
    /**
     * Registers a new user by sending their data to the backend.
     * @param {object} userData - The user's registration information.
     * @returns {Promise<object>} An axios promise that resolves with the server's response.
     */
    register: (userData) => {
        return axios.post(`${API_URL}/auth/register`, userData);
    },

    /**
     * Logs in a user by sending their credentials to the backend API.
     * @param {string} identifier - The user's email or mobile number.
     * @param {string} password - The user's password.
     * @returns {Promise<object>} An axios promise that resolves with the server's response.
     */
    login: (identifier, password) => {
        // FIX: The backend controller expects a single `emailOrMobile` field.
        // This payload now matches the `loginUser` function in `auth.controller.js`.
        const payload = {
            emailOrMobile: identifier,
            password,
        };
        return axios.post(`${API_URL}/auth/login`, payload);
    },
};
// --- End of Authentication Service ---

const CustomerAuth = ({ isDarkMode = true, onLoginSuccess = () => {} }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Form field states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState(''); // This state holds the identifier (email or mobile) for login
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Clears all form fields and errors when switching between login and sign-up
    const toggleForm = () => {
        setIsLogin(p => !p);
        setError(null);
        setFirstName('');
        setLastName('');
        setMobile('');
        setEmail('');
        setPassword('');
        setAge('');
        setGender('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let response;
            if (isLogin) {
                // Calls the updated login API with the identifier from the 'email' state
                response = await authService.login(email, password);
            } else {
                // FIX: The backend controller expects camelCase (firstName, lastName).
                // This payload now matches the `registerUser` function in `auth.controller.js`.
                const userData = { 
                    firstName, 
                    lastName, 
                    email, 
                    mobile, 
                    password, 
                    age: parseInt(age, 10),
                    gender 
                };
                // Calls the real register API endpoint
                response = await authService.register(userData);
            }
            
            // Handle a successful response from the server
            // NOTE: The backend register response puts the new user directly in `response.data.data`.
            const user = response.data?.data?.user || response.data?.data;
            if (user) {
                const userFullName = `${user.first_name} ${user.last_name}`;
                onLoginSuccess(userFullName, user.role_name);
                toggleForm(); 
                setIsLogin(true); // Switch to login view after a successful registration
            } else {
                 throw new Error("Authentication failed: Invalid response from server.");
            }

        } catch (err) {
            // Extracts and displays a user-friendly error message from the API response
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Style definitions for the form
    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 focus:outline-none focus:ring-pink-500 transition-colors duration-200`;
    const darkInputClasses = `bg-gray-700 border-gray-600 text-white placeholder-gray-400`;
    const lightInputClasses = `bg-white border-gray-300 text-gray-900 placeholder-gray-500`;
    const containerBg = isDarkMode ? 'bg-gray-800 text-white shadow-purple-900/40' : 'bg-gray-50 text-gray-900 shadow-pink-300/60';
    const headerGradient = isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600';

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${containerBg}`}
            >
                <h2 className={`text-3xl font-extrabold mb-2 text-center bg-gradient-to-r ${headerGradient} bg-clip-text text-transparent`}>
                    {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                </h2>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                    {isLogin ? 'Sign in to view your profile and orders.' : 'Join the Sparkling Bubbles family!'}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <motion.div
                        className="space-y-4 overflow-hidden"
                        animate={{ height: isLogin ? 0 : 'auto', opacity: isLogin ? 0 : 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {/* Registration-only Fields */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative w-full sm:w-1/2">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required={!isLogin} disabled={isLoading} />
                            </div>
                            <div className="relative w-full sm:w-1/2">
                               <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses}`} required={!isLogin} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required={!isLogin} disabled={isLoading} />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative w-full sm:w-1/2">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required={!isLogin} disabled={isLoading} min="1" />
                            </div>
                            <div className="relative w-full sm:w-1/2">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10 appearance-none`} required={!isLogin} disabled={isLoading}>
                                    <option value="" disabled>Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Common Fields for both Login and Registration */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={isLogin ? "Email or Mobile" : "Email Address"}
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} 
                            required 
                            disabled={isLoading} 
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses} pl-10`} required disabled={isLoading} />
                    </div>

                    {error && (
                        <motion.div 
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            className="text-red-500 text-sm p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading}>
                        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
                            <span className="flex items-center justify-center">
                                {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </span>
                        )}
                    </motion.button>
                </form>
                
                <div className="text-center mt-6">
                    <button onClick={toggleForm} className="text-sm text-purple-500 dark:text-purple-400 hover:underline disabled:opacity-50" disabled={isLoading}>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerAuth;

