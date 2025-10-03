import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Trash2 } from 'lucide-react';


const Button = ({ children, onClick, className = '' }) => <button onClick={onClick} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className}`}>{children}</button>;
const Badge = ({ children, className = '' }) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${className}`}>{children}</span>;
const ImageWithFallback = ({ src, alt, className = '' }) => (
    <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden ${className}`}>
        <span className="text-gray-500 dark:text-gray-400 text-xs">IMG</span>
    </div>
);


const WishlistSidebar = ({ isOpen, onClose, wishlistItems, onRemoveItem, isDarkMode,onMoveAllToCart }) => {
    
    // Logic to prevent background scrolling (optional but good for modals)
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);
    
    // Define base classes based on dark mode state
    const sidebarBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const overlayBg = isDarkMode ? 'bg-black/70 backdrop-blur' : 'bg-black/50 backdrop-blur-sm';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 ${overlayBg} z-[9998]`}
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        // ⭐️ Apply dark mode background and ensure text color is set
                        className={`fixed right-0 top-0 h-full w-full max-w-md ${sidebarBg} z-[9999] shadow-2xl text-gray-900 dark:text-white`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 border-b ${borderColor} flex-shrink-0`}>
                                <div className="flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                    <h2 className="text-xl font-bold">Your Wishlist</h2>
                                    <Badge className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                                        {wishlistItems.length}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    // ⭐️ Update hover colors for dark mode
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Wishlist Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {wishlistItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                                            Your wishlist is empty
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Save your favorite items here!
                                        </p>
                                    </div>
                                ) : (
                                    wishlistItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            // ⭐️ Item card background and shadow
                                            className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md items-center transition-colors duration-300"
                                        >
                                            <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                {/* Text color is inherited from the main sidebar, which is white in dark mode */}
                                                <h3 className="font-medium text-gray-800 dark:text-white truncate">{item.name}</h3>
                                                <span className="font-bold text-pink-600 dark:text-pink-400">₹{item.price}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onRemoveItem(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {/* Action Button */}
                            {wishlistItems.length > 0 && (
                                <div className={`p-6 border-t ${borderColor} flex-shrink-0`}>
                                    <Button 
                                    onClick={onMoveAllToCart}
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300">
                                        Move All to Cart
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
export default WishlistSidebar;