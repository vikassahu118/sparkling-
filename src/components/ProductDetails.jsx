import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // FIX: Corrected import from 'motion/react'
import { X, Heart, Share2, Star, Clock, ShoppingCart, Zap } from 'lucide-react';

// Utility component definitions (included locally for single-file operation)

const Badge = ({ children, className = '' }) => (
  <div className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = '', variant, size, ...props }) => {
  // Basic variant handling for demonstration
  const baseClasses = 'transition-all duration-300 rounded-xl font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2';

  let variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'; // Ghost default

  if (variant === 'outline') {
    variantClasses = 'bg-transparent border-2 hover:bg-opacity-10';
  }

  let sizeClasses = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeClasses = 'px-3 py-1 text-sm';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const ImageWithFallback = ({ src, alt, className = '' }) => {
  // Placeholder logic for demonstration purposes
  const placeholderUrl = `https://placehold.co/400x400/9333ea/ffffff?text=${encodeURIComponent(alt || 'Product')}`;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(placeholderUrl)}
    />
  );
};


export default function ProductDetail({ product, isOpen, onClose, onAddToCart, onAddToWishlist, isWishlisted  }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  useEffect(() => {
    if (product && isOpen) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      // Reset timer when product opens
      setTimeLeft(3600);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  if (!product) return null;

  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      onAddToCart(product, selectedSize, selectedColor, quantity);
      onClose();
    }
  };

  // Determine if the action buttons should be disabled
  const isActionDisabled = !selectedSize || !selectedColor;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" // Increased Z-index
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4" // Increased Z-index
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Close Button */}
              <div className="sticky top-0 z-10 flex justify-end p-4 bg-white dark:bg-gray-800 rounded-t-3xl border-b border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-white" />
                </Button>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Product Image */}
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden shadow-xl"
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <Badge className="bg-green-500 text-white">NEW</Badge>
                      )}
                      {product.isBestseller && (
                        <Badge className="bg-orange-500 text-white">BESTSELLER</Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Badge className="bg-red-500 text-white px-3 py-1 text-lg font-bold">
                        {product.discount}% OFF
                      </Badge>
                    </motion.div>
                  </motion.div>

                  {/* Special Offer Timer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl text-center shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Limited Time Offer!</span>
                    </div>
                    <div className="text-3xl font-bold font-mono">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm opacity-90">Hurry up! This deal ends soon!</div>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Title & Rating */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                      {product.name}
                    </h1>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400' // Added fill
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description:</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{product.description || "A soft, comfortable, and stylish outfit perfect for everyday adventures and playtime. Made with care for your little one."}</p>
                  </div>


                  {/* Price */}
                  <div className="flex items-center gap-3 border-y border-gray-200 dark:border-gray-700 py-4">
                    <span className="text-4xl font-extrabold text-pink-600 dark:text-pink-400">
                      ₹{product.discountedPrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Save ₹{product.originalPrice - product.discountedPrice}
                    </Badge>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Size: {!selectedSize && <span className="text-red-500 text-sm ml-2">(Required)</span>}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border-2 rounded-lg transition-all text-sm ${selectedSize === size
                              ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 font-bold shadow-inner'
                              : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-purple-400 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Color: {!selectedColor && <span className="text-red-500 text-sm ml-2">(Required)</span>}</h3>
                    <div className="flex gap-3">
                      {product.colors?.map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${selectedColor === color
                              ? 'border-pink-500 dark:border-cyan-400 scale-110 shadow-lg'
                              : 'border-gray-300 dark:border-gray-600 hover:scale-105 opacity-80'
                            }`}
                          style={{
                            backgroundColor: color,
                            // Ensure white border is visible if color is white
                            borderColor: selectedColor === color && color === 'white' ? 'black' : undefined
                          }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quantity:</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium text-lg text-gray-800 dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isActionDisabled}
                      className={`flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 text-lg font-medium shadow-pink-500/50 ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-700 hover:shadow-purple-500/50'}`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>

                    <Button
    onClick={() => onAddToWishlist({
        id: product.id,
        name: product.name,
        price: product.discountedPrice,
        image: product.image,
    })}
    variant="outline"
    // Conditional styling for the button border and text
    className={`p-4 border-2 ${isWishlisted ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20'}`}
>
    {/* Conditional styling for the Heart icon fill */}
    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
</Button>

                    <Button
                      variant="outline"
                      className="p-4 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quick Buy */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isActionDisabled}
                    className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-medium shadow-orange-500/50 ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-600 hover:to-red-600 hover:shadow-red-500/50'}`}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Buy Now - Express Checkout
                  </Button>

                  {/* Product Features */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Why You'll Love It:</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Made with super soft, breathable premium cotton.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Durable and easy to care for (Machine Washable).
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Hypoallergenic and Safe for Sensitive Skin.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Quick Shipping and Hassle-Free Returns.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
