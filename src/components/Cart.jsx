import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, Tag, Loader2 } from 'lucide-react';

// --- Utility Components (Must be defined here or imported separately) ---

// 1. ImageWithFallback Component
const ImageWithFallback = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);
  const handleError = () => setHasError(true);
  const placeholderUrl = `https://placehold.co/80x80/f0f4f8/94a3b8?text=${encodeURIComponent(alt ? alt.charAt(0) : 'P')}`;

  return (
    <div className={`relative ${className} bg-gray-200 dark:bg-gray-600`}>
      <img
        src={hasError ? placeholderUrl : src}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={handleError}
        style={{ opacity: hasError ? 0.7 : 1 }}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-medium">
          {alt ? alt.substring(0, 5) : 'Image'}
        </div>
      )}
    </div>
  );
};

// 2. Button Component
const Button = ({ children, onClick, className = '', variant = 'default', size = 'default', disabled = false }) => {
  let baseClasses = 'font-semibold rounded-xl transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';
  let variantClasses = '';
  let sizeClasses = '';

  if (variant === 'default') {
    variantClasses = 'bg-pink-600 text-white hover:bg-pink-700 active:shadow-none';
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-none';
  } else if (variant === 'outline') {
    variantClasses = 'bg-white text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-none';
  }

  if (size === 'sm') {
    sizeClasses = 'px-3 py-1.5 text-sm';
  } else if (size === 'default') {
    sizeClasses = 'px-4 py-2';
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// 3. Badge Component
const Badge = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-0.5 text-xs font-medium rounded-full ${className}`}>
      {children}
    </span>
  );
};

// 4. Input Component
const Input = ({ placeholder, value, onChange, className = '', type = 'text' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
    />
  );
};

// --- Cart Sidebar Component ---
export const Cart = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  appliedDiscounts = [],
  onApplyDiscount
}) => { 
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  const totalDiscount = appliedDiscounts.reduce((sum, discount) => sum + discount.discount, 0);
  const freeShippingThreshold = 999;
  const standardShippingCost = 99;
  
  const shipping = subtotal >= freeShippingThreshold ? 0 : standardShippingCost;
  const total = subtotal - totalDiscount + shipping;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyDiscount = () => {
    if (!discountCode) return;
    setIsApplyingDiscount(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onApplyDiscount(discountCode);
      setDiscountCode('');
      setIsApplyingDiscount(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - High Z-INDEX */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Cart Sidebar - Highest Z-INDEX */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 z-[9999] shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-pink-600" />
                  <h2 className="text-xl font-bold dark:text-white">Shopping Cart</h2>
                  <Badge className="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300">
                    {items.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Add some magical items to get started!
                    </p>
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Size: {item.selectedSize || item.sizes?.[0] || 'S'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <div 
                                className={`w-3 h-3 rounded-full border border-gray-300 dark:border-gray-500 ${
                                  (item.selectedColor || item.colors?.[0] || '').toLowerCase() === 'pink' ? 'bg-pink-400' :
                                  (item.selectedColor || item.colors?.[0] || '').toLowerCase() === 'blue' ? 'bg-blue-400' :
                                  (item.selectedColor || item.colors?.[0] || '').toLowerCase() === 'purple' ? 'bg-purple-400' :
                                  (item.selectedColor || item.colors?.[0] || '').toLowerCase() === 'green' ? 'bg-green-400' :
                                  'bg-gray-400'
                                }`}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {item.selectedColor || item.colors?.[0] || 'default'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-pink-600 dark:text-pink-400">₹{item.discountedPrice}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{item.originalPrice}</span>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 w-fit h-fit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount Code Section */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {/* Applied Discounts */}
                    {appliedDiscounts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Discounts:</h4>
                        {appliedDiscounts.map((discount, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                {discount.code}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-300">
                              -₹{discount.discount.toFixed(0)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Discount Code Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1 text-sm"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || isApplyingDiscount}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white min-w-[100px] flex justify-center items-center"
                      >
                        {isApplyingDiscount ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Apply'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm dark:text-white">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-₹{totalDiscount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm dark:text-white">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add ₹{remainingForFreeShipping.toFixed(0)} more for free shipping!
                      </p>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <div className="flex justify-between font-bold text-lg dark:text-white">
                        <span>Total</span>
                        <span className="text-pink-600 dark:text-pink-400">₹{total.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={onCheckout}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Proceed to Checkout 🚀
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
