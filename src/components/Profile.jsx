import React, { useState } from 'react'; // ⬅️ CRITICAL FIX: Restored useState
import { ShoppingBag, Settings, LogOut, User } from 'lucide-react';
// ⬅️ CRITICAL FIX: Restored EditProfilePage import
import EditProfilePage from './EditProfilePage.jsx';

// NOTE: Placeholder for Button component (Ensures the file is self-contained)
const Button = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className}`}>
        {children}
    </button>
);

// Mock data (Centralized data structure for the user)
const USER_PROFILE_MOCK = {
    initial: 'J',
    name: 'user',
    email: 'user@gmail.com',
    ordersCompleted: 3,
    // Add fields to hold phone/address data for display
    phone: "9999999999", 
    address: "address"
};

const ProfilePage = ({ isDarkMode, onLogout }) => {
    // ⭐️ CRITICAL FIX: Restored State management
    const [user, setUser] = useState(USER_PROFILE_MOCK); 
    const [isEditing, setIsEditing] = useState(false);
    
    // ⭐️ CRITICAL FIX: Restored handleSave handler
    const handleSave = (newFormData) => {
        // Update local display state with new data from the form
        setUser(p => ({ 
            ...p, 
            name: newFormData.name, 
            email: newFormData.email,
            phone: newFormData.phone, 
            address: newFormData.address,
            // Re-calculate initial based on new name
            initial: newFormData.name ? newFormData.name[0].toUpperCase() : 'U'
        })); 
        setIsEditing(false); // Close the modal
    };

    // Default View Mode
    return (
        <div className="relative">
            {/* Main Profile Card */}
            <div className={`py-20 max-w-3xl mx-auto p-6 rounded-3xl shadow-xl my-8 transition-shadow duration-300 ${
                isDarkMode ? 'bg-gray-800 text-white shadow-purple-800/50' : 'bg-white text-gray-900 shadow-pink-300/80'
            }`}>
                <div className="flex flex-col items-center">
                    {/* User Avatar Initial */}
                    <div className="w-24 h-24 rounded-full bg-pink-500 dark:bg-purple-500 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg">
                        {user.initial}
                    </div>
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{user.email}</p>
                </div>

                <div className="space-y-4">
                    {/* Orders Section */}
                    <div className={`p-4 rounded-xl flex justify-between items-center transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-pink-500 dark:text-cyan-400" />
                            <span>My Orders ({user.ordersCompleted} Completed)</span>
                        </div>
                        <Button className="text-sm text-pink-600 dark:text-cyan-400 hover:text-pink-800 dark:hover:text-cyan-200">View History</Button>
                    </div>
                    
                    {/* Settings - EDIT BUTTON */}
                    <div className={`p-4 rounded-xl flex justify-between items-center transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            <span>Account Settings</span>
                        </div>
                        <Button 
                            // ⬅️ Fix: Handler is now correctly defined
                            onClick={() => setIsEditing(true)} 
                            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                        >
                            Edit
                        </Button>
                    </div>

                    {/* Logout Button */}
                    <Button 
                        onClick={onLogout} 
                        className="w-full mt-6 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </div>
            
            {/* ⭐️ Modal Trigger: Renders the edit form as an overlay */}
            <EditProfilePage 
                isDarkMode={isDarkMode} 
                isOpen={isEditing} 
                onSave={handleSave} 
                onCancel={() => setIsEditing(false)} 
            />
        </div>
    );
};
export default ProfilePage
