

import React from 'react';

const SearchModal = ({ isOpen, onClose, isDarkMode }) => {
    
    const modalClasses = isDarkMode 
        ? 'bg-gray-900/80' 
        : 'bg-black/50';

    const contentClasses = isDarkMode 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900';
    
    // Logic to prevent background scrolling when open
    // NOTE: This is a side effect and can be moved to a custom hook (like useLockBodyScroll) for cleaner code.
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    return isOpen ? (
        // Modal Overlay (Clicking here closes the modal)
        <div 
            className={`fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 transition-opacity duration-300 ${modalClasses}`} 
            onClick={onClose}
        >
            {/* Modal Content container */}
            <div 
                className={`w-full max-w-xl mt-16 transform transition-all duration-300 ${contentClasses} shadow-2xl rounded-xl`}
                onClick={e => e.stopPropagation()} // Stop click from bubbling to the overlay
            >
                <div className="flex items-center p-3 border-b dark:border-gray-700">
                    {/* Search Icon */}
                    <svg className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    
                    {/* The actual Search Input */}
                    <input
                        type="search"
                        placeholder="Search for clothes, accessories, or collections..."
                        className="w-full text-lg p-2 focus:outline-none bg-transparent"
                        // Add value, onChange, and handleSubmit here for a functional search
                        autoFocus
                    />
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="p-2 ml-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        aria-label="Close search"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                    <p>Start typing to see search results...</p>
                    {/* Search results/history will be rendered here */}
                </div>
            </div>
        </div>
    ) : null;
};

export default SearchModal;