import React from "react";
// 🚨 CRITICAL FIX: Import necessary icons from lucide-react
import { ShoppingBag, Settings, LogOut } from 'lucide-react';

// 🚨 CRITICAL FIX: Placeholder for Button component (Update this to your actual Button import if necessary)
const Button = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className}`}>
        {children}
    </button>
);


const ProfilePage = ({ isDarkMode, onLogout }) => (
    <div className={`py-20 max-w-3xl mx-auto p-6 rounded-3xl shadow-xl my-8 transition-shadow duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white shadow-purple-800/50' : 'bg-white text-gray-900 shadow-pink-300/80'
    }`}>
        <div className="flex flex-col items-center">
            {/* User Avatar Initial (J) */}
            <div className="w-24 h-24 rounded-full bg-pink-500 dark:bg-purple-500 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg">
                J
            </div>
            <h2 className="text-3xl font-bold">Jane Doe</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">jane.doe@example.com</p>
        </div>

        <div className="space-y-4">
            {/* Orders */}
            <div className={`p-4 rounded-xl flex justify-between items-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
                <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-pink-500 dark:text-cyan-400" />
                    <span>My Orders (3 Completed)</span>
                </div>
                {/* Note: Button variant is not strictly necessary for this placeholder */}
                <Button className="text-sm text-pink-600 dark:text-cyan-400 hover:text-pink-800 dark:hover:text-cyan-200">View History</Button>
            </div>
            
            {/* Settings */}
            <div className={`p-4 rounded-xl flex justify-between items-center transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}>
                <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <span>Account Settings</span>
                </div>
                <Button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">Edit</Button>
            </div>

            {/* Logout Button */}
            <Button 
                onClick={onLogout} 
                // Enhanced styling for better dark mode contrast
                className="w-full mt-6 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-300"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </Button>
        </div>
    </div>
);
export default ProfilePage
