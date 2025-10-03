import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🚨 FIX: Imported Mail icon
import { User, Phone, MapPin, Save, X, Mail } from 'lucide-react';

// NOTE: Placeholder for Button component
const Button = ({ children, onClick, className = '' }) => (
    <motion.button 
        onClick={onClick} 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${className}`}
    >
        {children}
    </motion.button>
);

// Mock User Data for Form Initialization
const MOCK_USER_DATA = {
    name: "user",
    email: "user@gmail.com",
    phone: "9999999999",
    address: "address"
};


const EditProfilePage = ({ isDarkMode, onSave, onCancel, isOpen }) => {
    // State to hold form data
    const [formData, setFormData] = useState(MOCK_USER_DATA);
    const [isSaving, setIsSaving] = useState(false);

    // Logic to prevent background scrolling (optional but good for modals)
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);
    
    // ⭐️ FIX: Reset form data when the modal opens to ensure consistency with ProfilePage.jsx data
    React.useEffect(() => {
        if (isOpen) {
            // NOTE: In a real app, you would pass the current user data as a prop and use that here.
            // For now, we rely on MOCK_USER_DATA which ProfilePage uses.
            setFormData(MOCK_USER_DATA); 
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        setIsSaving(true);
        console.log('Saving profile data:', formData);
        
        // Simulate an API save delay
        setTimeout(() => {
            setIsSaving(false);
            onSave(formData); 
        }, 1500);
    };

    const inputClasses = `w-full p-3 rounded-lg border focus:ring-2 focus:ring-pink-500 transition-colors duration-200`;
    const darkInputClasses = `bg-gray-700 border-gray-600 text-white placeholder-gray-400`;
    const lightInputClasses = `bg-white border-gray-300 text-gray-900 placeholder-gray-500`;
    
    // Read-only classes for email field
    const readOnlyClasses = isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-gray-300' 
        : 'bg-gray-100 border-gray-200 text-gray-600';


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                        onClick={onCancel} // Click overlay to cancel
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-2xl p-6 rounded-3xl shadow-2xl z-[1001] transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 text-white shadow-purple-900/40' : 'bg-white text-gray-900 shadow-pink-300/80'}`}
                        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <h2 className={`text-3xl font-extrabold mb-8 text-center bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>
                            Edit Account Details
                        </h2>

                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            
                            {/* Name Field */}
                            <div className="flex items-center space-x-4">
                                <User className="w-6 h-6 text-pink-500 dark:text-cyan-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* ⭐️ FIX: Email Field (Read-Only) */}
                            <div className="flex items-center space-x-4">
                                <Mail className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Email Address (Primary Login)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        className={`${inputClasses} ${readOnlyClasses}`}
                                        readOnly
                                    />
                                </div>
                            </div>


                            {/* Phone Number Field */}
                            <div className="flex items-center space-x-4">
                                <Phone className="w-6 h-6 text-pink-500 dark:text-cyan-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses}`}
                                        pattern="[0-9]{10}"
                                        placeholder="e.g., 9876543210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 text-pink-500 dark:text-cyan-400 flex-shrink-0 mt-3" />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Shipping Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`${inputClasses} ${isDarkMode ? darkInputClasses : lightInputClasses}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between space-x-4 pt-4">
                                <Button 
                                    type="button" 
                                    onClick={onCancel} 
                                    className={`w-1/2 border border-gray-400 dark:border-gray-600 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    disabled={isSaving}
                                >
                                    <X className="w-5 h-5 mr-2 inline" /> Cancel
                                </Button>
                                
                                <Button 
                                    type="submit" 
                                    className="w-1/2 bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <Save className="w-5 h-5 mr-2" />
                                    )}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
export default EditProfilePage;
