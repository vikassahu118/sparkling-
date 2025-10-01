import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react';
// import { Button, Badge, Input } from './ui';
// import { ImageWithFallback } from './figma/ImageWithFallback';

export function Cart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  appliedDiscounts = [],
  onApplyDiscount
}) {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  const totalDiscount = appliedDiscounts.reduce((sum, discount) => sum + discount.discount, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - totalDiscount + shipping;

  const handleApplyDiscount = async () => {
    setIsApplyingDiscount(true);
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-pink-600" />
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
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
              <div className="flex-1 overflow-y-auto p-6">
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
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
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
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">Size: {item.selectedSize || item.sizes?.[0] || 'S'}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <div className="flex items-center gap-1">
                              <div 
                                className={`w-3 h-3 rounded-full border ${
                                  (item.selectedColor || item.colors?.[0]) === 'pink' ? 'bg-pink-400' :
                                  (item.selectedColor || item.colors?.[0]) === 'blue' ? 'bg-blue-400' :
                                  (item.selectedColor || item.colors?.[0]) === 'purple' ? 'bg-purple-400' :
                                  (item.selectedColor || item.colors?.[0]) === 'green' ? 'bg-green-400' :
                                  'bg-gray-400'
                                }`}
                              />
                              <span className="text-sm text-gray-500 capitalize">{item.selectedColor || item.colors?.[0] || 'default'}</span>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-pink-600">₹{item.discountedPrice}</span>
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
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
                            <span className="text-sm font-medium text-green-600">
                              -₹{discount.discount}
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
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || isApplyingDiscount}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      >
                        {isApplyingDiscount ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{totalDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Add ₹{999 - subtotal} more for free shipping!
                      </p>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-pink-600">₹{total}</span>
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
}