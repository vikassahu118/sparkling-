// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, ShoppingCart, Minus, Plus, Trash2, Tag, Truck } from 'lucide-react';

// // --- Placeholder/Helper Components (Updated Button) ---

// // ⭐ MODIFIED: Button component now correctly handles the disabled prop and styling
// const Button = ({ children, onClick, className = '', disabled = false, ...props }) => (
//     <button 
//         onClick={onClick} 
//         disabled={disabled}
//         className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
//         {...props}
//     >
//         {children}
//     </button>
// );

// const ImageWithFallback = ({ src, alt, className = '' }) => (
//     // ⭐ MODIFIED: Added image source and alt for realism
//     <img 
//         src={src || 'https://placehold.co/60x60/9333ea/ffffff?text=Product'}
//         alt={alt} 
//         className={`object-cover ${className}`}
//         onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/60x60/9333ea/ffffff?text=IMG' }}
//     />
// );

// // --- Main Cart Component ---

// export const Cart = ({ 
//     isDarkMode, 
//     isOpen, 
//     onClose, 
//     items, 
//     onUpdateQuantity, 
//     onRemoveItem, 
//     onCheckout, // This function must handle the routing/state change to show CheckoutPage
//     appliedDiscounts, 
//     onApplyDiscount 
// }) => {
//     const [discountCode, setDiscountCode] = React.useState('');
    
//     // --- 1. CORE PRICE CALCULATION LOGIC ---
    
//     const shippingCost = 99.00; // Fixed shipping for now
//     const freeShippingThreshold = 500.00;
    
//     const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    
//     const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + (discount.amount || 0), 0);

//     const finalShippingCost = subtotal >= freeShippingThreshold ? 0.00 : shippingCost;

//     const finalTotal = subtotal + finalShippingCost - totalDiscountAmount;

//     // --- Styling Classes ---

//     const sidebarBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
//     const overlayBg = isDarkMode ? 'bg-black/70 backdrop-blur' : 'bg-black/50 backdrop-blur-sm';
//     const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    
//     // Logic to prevent background scrolling
//     React.useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//              // Cleanup on unmount
//              document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);

//     const formatPrice = (price) => {
//         const safePrice = parseFloat(price);
//         return `₹${(isNaN(safePrice) ? 0 : safePrice).toFixed(2)}`;
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     {/* Overlay */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className={`fixed inset-0 ${overlayBg} z-[9998]`}
//                         onClick={onClose}
//                     />

//                     {/* Sidebar */}
//                     <motion.div
//                         initial={{ x: '100%' }}
//                         animate={{ x: 0 }}
//                         exit={{ x: '100%' }}
//                         transition={{ type: "spring", damping: 30, stiffness: 300 }}
//                         className={`fixed right-0 top-0 h-full w-full max-w-sm ${sidebarBg} z-[9999] shadow-2xl`}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="flex flex-col h-full">
                            
//                             {/* Header */}
//                             <div className={`flex items-center justify-between p-5 border-b ${borderColor} flex-shrink-0`}>
//                                 <div className="flex items-center gap-3">
//                                     <ShoppingCart className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
//                                     <h2 className="text-xl font-bold">Shopping Cart</h2>
//                                 </div>
//                                 <Button
//                                     onClick={onClose}
//                                     className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 >
//                                     <X className="w-5 h-5" />
//                                 </Button>
//                             </div>

//                             {/* Cart Items List */}
//                             <div className="flex-1 overflow-y-auto p-5 space-y-4">
//                                 {items.length === 0 ? (
//                                     <div className="text-center py-12">
//                                         <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                                         <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
//                                             Your cart is empty
//                                         </h3>
//                                         <Button onClick={onClose} className="mt-4 bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700">
//                                             Start Shopping
//                                         </Button>
//                                     </div>
//                                 ) : (
//                                     items.map((item) => (
//                                         <div key={item.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm items-start">
//                                             <ImageWithFallback 
//                                                 src={item.image} 
//                                                 alt={item.name} 
//                                                 className="w-16 h-16 flex-shrink-0" 
//                                             />
//                                             <div className="flex-1 min-w-0">
//                                                 <h3 className="font-medium truncate text-gray-800 dark:text-white">{item.name}</h3>
//                                                 {/* Price per unit (ensures item.price is handled) */}
//                                                 <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(item.price)}</p>
//                                                 <div className="flex items-center mt-2 space-x-2">
//                                                     {/* Quantity Controls */}
//                                                     <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
//                                                         <button 
//                                                             onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
//                                                             className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg"
//                                                             aria-label="Decrease quantity"
//                                                             disabled={item.quantity <= 1} // Disable if quantity is 1
//                                                         >
//                                                             <Minus className="w-4 h-4" />
//                                                         </button>
//                                                         <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
//                                                         <button 
//                                                             onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
//                                                             className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg"
//                                                             aria-label="Increase quantity"
//                                                         >
//                                                             <Plus className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
                                                    
//                                                     {/* Total Price per Item */}
//                                                     <span className="text-sm font-bold text-pink-600 dark:text-cyan-400 ml-auto">
//                                                         {/* Calculation uses the safe price value */}
//                                                         {formatPrice((item.price || 0) * (item.quantity || 0))}
//                                                     </span>

//                                                     {/* Remove Button */}
//                                                     <button 
//                                                         onClick={() => onRemoveItem(item.id)}
//                                                         className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
//                                                         aria-label="Remove item"
//                                                     >
//                                                         <Trash2 className="w-4 h-4" />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
                            
//                             {/* Footer/Checkout Section */}
//                             {items.length > 0 && (
//                                 <div className={`p-5 border-t ${borderColor} flex-shrink-0`}>
//                                     {/* Discount Code Input */}
//                                     <div className="flex mb-4 gap-2">
//                                         <input
//                                             type="text"
//                                             placeholder="Enter discount code"
//                                             value={discountCode}
//                                             onChange={(e) => setDiscountCode(e.target.value)}
//                                             className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
//                                         />
//                                         <Button 
//                                             onClick={() => onApplyDiscount(discountCode)}
//                                             className="bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
//                                             disabled={!discountCode}
//                                         >
//                                             Apply
//                                         </Button>
//                                     </div>
                                    
//                                     {/* Discount Applied */}
//                                     {appliedDiscounts.map((discount, index) => (
//                                         <div key={index} className="flex justify-between text-sm text-green-600 dark:text-green-400 mb-1">
//                                             <span className="flex items-center gap-1">
//                                                 <Tag className="w-4 h-4" /> 
//                                                 Discount ({discount.code})
//                                             </span>
//                                             <span className="font-bold">- {formatPrice(discount.amount)}</span>
//                                         </div>
//                                     ))}

//                                     {/* Price Summary */}
//                                     <div className="space-y-1 text-sm">
//                                         <div className="flex justify-between">
//                                             <span>Subtotal:</span>
//                                             <span className="font-medium">{formatPrice(subtotal)}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="flex items-center gap-1">
//                                                 <Truck className="w-4 h-4 text-cyan-500" />
//                                                 Shipping:
//                                             </span>
//                                             <span className={`font-medium ${finalShippingCost === 0 ? 'text-green-500 dark:text-green-400' : ''}`}>
//                                                 {finalShippingCost === 0 ? 'FREE' : formatPrice(finalShippingCost)}
//                                             </span>
//                                         </div>
//                                         {/* Free Shipping Message */}
//                                         {finalShippingCost !== 0 && (
//                                             <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
//                                                 Add {formatPrice(freeShippingThreshold - subtotal)} more for FREE Shipping!
//                                             </p>
//                                         )}
                                        
//                                         <div className={`flex justify-between text-lg font-bold pt-2 border-t ${borderColor}`}>
//                                             <span>Total:</span>
//                                             <span className="text-pink-600 dark:text-cyan-400">{formatPrice(finalTotal)}</span>
//                                         </div>
//                                     </div>

//                                     {/* Checkout Button */}
//                                     <Button 
//                                         onClick={() => {
//                                             onClose(); // Close the cart sidebar first
//                                             onCheckout(); // Then trigger the navigation
//                                         }}
//                                         className="w-full mt-4 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors py-3 shadow-lg"
//                                         disabled={items.length === 0}
//                                     >
//                                         Proceed to Checkout
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// };

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, Tag, Truck, LoaderCircle } from 'lucide-react';

const API_BASE_URL = '/api/v1/cart';

// --- Helper Components (No changes) ---
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


// --- Main Cart Component ---
export const Cart = ({ 
    isDarkMode, 
    isOpen, 
    onClose, 
    onCheckout,
    appliedDiscounts, 
    onApplyDiscount 
}) => {
    
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discountCode, setDiscountCode] = useState('');

    // --- 2. API FUNCTIONS ---

    // GET /api/v1/cart
    const fetchCartItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authentication token not found. Please log in.");

            const response = await fetch(API_BASE_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (errorText.trim().startsWith('<')) {
                    throw new Error(`Server Error (${response.status}): Received HTML instead of JSON. Check proxy/API URL.`);
                }
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || `Failed to fetch cart. Status: ${response.status}`);
            }
            
            const responseText = await response.text();
            
            if (!responseText) {
                setItems([]);
            } else {
                const data = JSON.parse(responseText);
                
                // --- ⭐ GEMINI FIX #1: Access the .data property from your ApiResponse ---
                // Your backend sends { "data": [...] }, not just [...]
                if (data && Array.isArray(data.data)) {
                    setItems(data.data);
                } else {
                    setItems([]);
                }
                // --- End Fix ---
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // PATCH /api/v1/cart/:cartItemId
    const handleUpdateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;

        const originalItems = [...items];
        
        // --- ⭐ GEMINI FIX #2: Update state using the correct ID key `cart_item_id` ---
        setItems(currentItems => currentItems.map(item => 
            item.cart_item_id === cartItemId ? { ...item, quantity } : item
        ));
        // --- End Fix ---

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authentication token not found.");
            
            const response = await fetch(`${API_BASE_URL}/${cartItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity }),
            });
            if (!response.ok) throw new Error('Failed to update quantity.');
        } catch (err) {
            setError('Could not update item. Please try again.');
            setItems(originalItems); // Revert on failure
        }
    };
    
    // DELETE /api/v1/cart/:cartItemId
    const handleRemoveItem = async (cartItemId) => {
        const originalItems = [...items];
        
        // --- ⭐ GEMINI FIX #3: Filter state using the correct ID key `cart_item_id` ---
        setItems(currentItems => currentItems.filter(item => item.cart_item_id !== cartItemId));
        // --- End Fix ---
        
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authentication token not found.");

            const response = await fetch(`${API_BASE_URL}/${cartItemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to remove item.');
        } catch (err) {
            setError('Could not remove item. Please try again.');
            setItems(originalItems); // Revert on failure
        }
    };

    // --- 3. EFFECTS (No changes) ---
    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
        }
    }, [isOpen, fetchCartItems]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);


    // --- 4. PRICE CALCULATION & HELPERS ---
    const shippingCost = 99.00;
    const freeShippingThreshold = 500.00;
    
    // --- ⭐ GEMINI FIX #4: Calculate subtotal using `discounted_price` ---
    // Your API sends `discounted_price`, not `price`.
    const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.discounted_price || 0);
        const quantity = parseInt(item.quantity || 0);
        return sum + (price * quantity);
    }, 0);
    // --- End Fix ---

    const totalDiscountAmount = (appliedDiscounts || []).reduce((sum, discount) => sum + (discount.amount || 0), 0);
    const finalShippingCost = subtotal >= freeShippingThreshold ? 0.00 : shippingCost;
    const finalTotal = subtotal + finalShippingCost - totalDiscountAmount;

    const formatPrice = (price) => {
        const safePrice = parseFloat(price);
        return `₹${(isNaN(safePrice) ? 0 : safePrice).toFixed(2)}`;
    };

    const sidebarBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
    const overlayBg = isDarkMode ? 'bg-black backdrop-blur' : 'bg-black backdrop-blur-sm';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    
    // --- 5. DYNAMIC RENDER LOGIC ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <LoaderCircle className="w-12 h-12 animate-spin text-pink-500 dark:text-cyan-400" />
                    <p className="mt-4 text-lg">Loading Your Cart...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12 px-4">
                    <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                        Something Went Wrong
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                    <Button onClick={fetchCartItems} className="bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700">
                        Try Again
                    </Button>
                </div>
            );
        }

        // --- ⭐ GEMINI FIX #5: Check `items` array correctly ---
        if (!items || items.length === 0) {
            return (
                <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Your cart is empty
                    </h3>
                    <Button onClick={onClose} className="mt-4 bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700">
                        Start Shopping
                    </Button>
                </div>
            );
        }
        
        // --- ⭐ GEMINI FIX #6: Use correct keys `cart_item_id`, `image_url`, `name`, and `discounted_price` ---
        return items.map((item) => (
            <div key={item.cart_item_id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm items-start">
                <ImageWithFallback 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-16 h-16 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(item.discounted_price)}</p>
                    <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button 
                                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                                className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg"
                                aria-label="Decrease quantity"
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                                onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                                className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-sm font-bold text-pink-600 dark:text-cyan-400 ml-auto">
                            {formatPrice((parseFloat(item.discounted_price) || 0) * (item.quantity || 0))}
                        </span>
                        <button 
                            onClick={() => handleRemoveItem(item.cart_item_id)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        ));
        // --- End Fix ---
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDarkMode ? 0.7 : 0.5 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 ${overlayBg} z-[9998]`}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm z-[9999]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={`flex flex-col h-full ${sidebarBg} shadow-2xl`}>
                            
                            {/* Header */}
                            <div className={`flex items-center justify-between p-5 border-b ${borderColor} flex-shrink-0`}>
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-6 h-6 text-pink-500 dark:text-cyan-400" />
                                    <h2 className="text-xl font-bold">Shopping Cart</h2>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Item List */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {renderContent()}
                            </div>
                            
                            {/* Footer / Checkout */}
                            {/* ⭐ GEMINI FIX #7: Check for items.length > 0 */}
                            {!loading && !error && items && items.length > 0 && (
                                <div className={`p-5 border-t ${borderColor} flex-shrink-0`}>
                                    <div className="flex mb-4 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter discount code"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        <Button 
                                            onClick={() => onApplyDiscount(discountCode)}
                                            className="bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
                                            disabled={!discountCode}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    
                                    {(appliedDiscounts || []).map((discount, index) => (
                                        <div key={index} className="flex justify-between text-sm text-green-600 dark:text-green-400 mb-1">
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-4 h-4" /> 
                                                Discount ({discount.code})
                                            </span>
                                            <span className="font-bold">- {formatPrice(discount.amount)}</span>
                                        </div>
                                    ))}

                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="flex items-center gap-1">
                                                <Truck className="w-4 h-4 text-cyan-500" />
                                                Shipping:
                                            </span>
                                            <span className={`font-medium ${finalShippingCost === 0 ? 'text-green-500 dark:text-green-400' : ''}`}>
                                                {finalShippingCost === 0 ? 'FREE' : formatPrice(finalShippingCost)}
                                            </span>
                                        </div>
                                        {/* ⭐ GEMINI FIX #8: Check subtotal > 0 */}
                                        {finalShippingCost !== 0 && subtotal > 0 && (
                                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
                                                Add {formatPrice(freeShippingThreshold - subtotal)} more for FREE Shipping!
                                            </p>
                                        )}
                                        
                                        <div className={`flex justify-between text-lg font-bold pt-2 border-t ${borderColor}`}>
                                            <span>Total:</span>
                                            <span className="text-pink-600 dark:text-cyan-400">{formatPrice(finalTotal)}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => {
                                            onClose(); 
                                            onCheckout();
                                        }}
                                        className="w-full mt-4 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors py-3 shadow-lg"
                                        disabled={items.length === 0}
                                    >
                                        Proceed to Checkout
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