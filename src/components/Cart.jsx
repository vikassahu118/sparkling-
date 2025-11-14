import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, Tag, Truck, LoaderCircle, AlertTriangle } from 'lucide-react';

// --- CONFIGURATION ---
// Ensure this matches your backend port exactly (check your terminal)
const API_BASE_URL = 'http://localhost:8000/api/v1/cart';

const Button = ({ children, onClick, className = '', disabled = false, ...props }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        {...props}
    >
        {children}
    </button>
);

const ImageWithFallback = ({ src, alt, className = '' }) => (
    <img 
        src={src || 'https://placehold.co/60x60/9333ea/ffffff?text=Product'}
        alt={alt} 
        className={`object-cover ${className}`}
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/60x60/9333ea/ffffff?text=IMG' }}
    />
);

export const Cart = ({ isDarkMode, isOpen, onClose, onCheckout, appliedDiscounts, onApplyDiscount }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(''); // For debugging
    const [discountCode, setDiscountCode] = useState('');

    // --- HELPER: Find the Token ---
    const getAuthToken = () => {
        // Try all common names for the token
        return localStorage.getItem('token') || 
               localStorage.getItem('accessToken') || 
               localStorage.getItem('customerToken') ||
               localStorage.getItem('adminToken');
    };

    // --- API: Fetch Cart ---
    const fetchCartItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        setDebugInfo('');

        const token = getAuthToken();

        // DEBUG LOGGING
        console.log("🔍 DEBUG - Fetching Cart...");
        console.log("Target URL:", API_BASE_URL);
        console.log("Token Found:", token ? "Yes (Hidden)" : "NO TOKEN FOUND");

        if (!token) {
            setError("Please log in to view your cart.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_BASE_URL, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Response Status:", response.status);

            if (!response.ok) {
                // Handle 401 specifically
                if (response.status === 401) {
                    throw new Error("Session expired. Please logout and login again.");
                }
                // Handle 404 (Cart empty/not created yet is okay)
                if (response.status === 404) {
                    setItems([]);
                    return;
                }
                throw new Error(`Server Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Cart Data Received:", data);

            // Handle different data structures { data: [] } vs []
            const cartItems = Array.isArray(data) ? data : (data.data || []);
            setItems(cartItems);

        } catch (err) {
            console.error("❌ Cart Error:", err);
            setError(err.message);
            setDebugInfo(`Check Console: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- API: Update Quantity ---
    const handleUpdateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        // Optimistic UI update
        setItems(prev => prev.map(item => item.cart_item_id === cartItemId ? { ...item, quantity } : item));

        try {
            const token = getAuthToken();
            await fetch(`${API_BASE_URL}/${cartItemId}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
        } catch (err) {
            console.error("Update failed", err);
            fetchCartItems(); // Revert on error
        }
    };

    // --- API: Remove Item ---
    const handleRemoveItem = async (cartItemId) => {
        // Optimistic UI update
        setItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));

        try {
            const token = getAuthToken();
            await fetch(`${API_BASE_URL}/${cartItemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Remove failed", err);
            fetchCartItems(); // Revert on error
        }
    };

    useEffect(() => {
        if (isOpen) fetchCartItems();
    }, [isOpen, fetchCartItems]);

    // --- RENDER HELPERS ---
    const sidebarBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    
    const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.discounted_price || item.price || 0);
        return sum + (price * (item.quantity || 1));
    }, 0);

    const formatPrice = (p) => `₹${parseFloat(p || 0).toFixed(2)}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        className={`fixed right-0 top-0 h-full w-full max-w-md ${sidebarBg} z-[9999] shadow-2xl flex flex-col`}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-5 border-b ${borderColor}`}>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingCart className="text-pink-500" /> Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X /></button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <LoaderCircle className="animate-spin text-pink-500 w-10 h-10" />
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500 p-4 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20">
                                    <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                                    <p className="font-bold">Error Loading Cart</p>
                                    <p className="text-sm">{error}</p>
                                    {debugInfo && <p className="text-xs mt-2 font-mono bg-black/10 p-1 rounded">{debugInfo}</p>}
                                    <Button onClick={fetchCartItems} className="mt-4 bg-red-500 text-white">Retry</Button>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <Button onClick={onClose} className="mt-4 bg-pink-500 text-white">Start Shopping</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.cart_item_id || item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <ImageWithFallback src={item.image_url || item.image} className="w-20 h-20 rounded-lg" />
                                            <div className="flex-1">
                                                <h3 className="font-bold line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex items-center border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                                        <button onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                                                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                        <button onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                                                    </div>
                                                    <p className="font-bold text-pink-600">{formatPrice((item.discounted_price || item.price) * item.quantity)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.cart_item_id)} className="text-gray-400 hover:text-red-500 self-start"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className={`p-5 border-t ${borderColor} space-y-4`}>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <Button onClick={() => { onClose(); onCheckout(); }} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3">
                                    Proceed to Checkout
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};