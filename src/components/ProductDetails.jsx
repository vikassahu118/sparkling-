import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Star, Clock, ShoppingCart, Zap, Check } from 'lucide-react';

// Utility Components
const Badge = ({ children, className = '' }) => (
  <div className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = '', variant, size, ...props }) => {
  const baseClasses = 'transition-all duration-300 rounded-xl font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600';

  if (variant === 'outline') {
    variantClasses = 'bg-transparent border-2 hover:bg-gray-50 dark:hover:bg-gray-800';
  }

  let sizeClasses = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeClasses = 'px-3 py-1 text-sm';

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

const ImageWithFallback = ({ src, alt, className = '' }) => {
  const placeholderUrl = `https://placehold.co/400x400/9333ea/ffffff?text=${encodeURIComponent(alt || 'Product')}`;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => { setImgSrc(src); }, [src]);

  return <img src={imgSrc || placeholderUrl} alt={alt} className={className} onError={() => setImgSrc(placeholderUrl)} />;
};

// Color Mapping for Tailwind Classes
const colorMap = {
    pink: 'bg-pink-400',
    purple: 'bg-purple-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    white: 'bg-gray-100 border border-gray-300',
    yellow: 'bg-yellow-400',
    multicolor: 'bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400',
    black: 'bg-black',
    red: 'bg-red-500',
    orange: 'bg-orange-500'
};

export default function ProductDetail({ product, isOpen, onClose, onAddToCart, onAddToWishlist, isWishlisted }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (product && isOpen) {
      // Auto-select first option if available, or reset
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setTimeLeft(3600);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
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

  // Disable button if size or color is missing
  const isActionDisabled = !selectedSize || !selectedColor;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto flex flex-col">
              
              {/* Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate pr-4">{product.name}</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X className="w-6 h-6 text-gray-700 dark:text-white" /></Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Left Column: Images */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-900">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover aspect-square" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-green-500 text-white shadow-sm">NEW</Badge>}
                      {product.isBestseller && <Badge className="bg-orange-500 text-white shadow-sm">BESTSELLER</Badge>}
                    </div>
                    {product.discount > 0 && (
                       <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm animate-pulse">
                         {product.discount}% OFF
                       </div>
                    )}
                  </div>
                  
                  {/* Offer Timer */}
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-2xl text-center shadow-lg">
                    <div className="flex items-center justify-center gap-2 mb-1"><Clock className="w-4 h-4" /><span className="font-medium text-sm">Offer ends in</span></div>
                    <div className="text-2xl font-bold font-mono tracking-wider">{formatTime(timeLeft)}</div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />)}</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description || "Premium quality comfort for your little one."}</p>

                  <div className="flex items-end gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">₹{product.discountedPrice}</span>
                    {product.originalPrice > product.discountedPrice && (
                        <>
                            <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-2">Save ₹{product.originalPrice - product.discountedPrice}</Badge>
                        </>
                    )}
                  </div>

                  {/* Selectors */}
                  <div className="space-y-4">
                    {/* Sizes */}
                    <div>
                       <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">Select Size</span>
                          {!selectedSize && <span className="text-xs text-red-500 font-medium">* Required</span>}
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {product.sizes && product.sizes.length > 0 ? product.sizes.map(size => (
                              <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedSize === size ? 'border-pink-500 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300 shadow-inner' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-pink-300'}`}>{size}</button>
                          )) : <span className="text-sm text-gray-400">One Size</span>}
                       </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Select Color</span>
                            {!selectedColor && <span className="text-xs text-red-500 font-medium">* Required</span>}
                       </div>
                       <div className="flex flex-wrap gap-3">
                          {product.colors && product.colors.length > 0 ? product.colors.map(color => {
                              const bgClass = colorMap[color.toLowerCase()] || 'bg-gray-200';
                              return (
                                  <button key={color} onClick={() => setSelectedColor(color)} className={`group w-10 h-10 rounded-full relative focus:outline-none transition-transform active:scale-95 ${bgClass} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-pink-500 dark:ring-offset-gray-800 scale-110' : 'hover:scale-105 opacity-90'}`} title={color}>
                                      {selectedColor === color && <Check className={`w-4 h-4 absolute inset-0 m-auto ${color === 'white' ? 'text-black' : 'text-white'}`} />}
                                  </button>
                              );
                          }) : <span className="text-sm text-gray-400">As shown</span>}
                       </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">Quantity</span>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">-</button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">+</button>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                     <Button onClick={handleAddToCart} disabled={isActionDisabled} className={`flex-1 py-3.5 text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/30 ${isActionDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
                        <ShoppingCart className="w-5 h-5 mr-2 inline" /> {isActionDisabled ? 'Select Options' : 'Add to Cart'}
                     </Button>
                     <Button onClick={() => onAddToWishlist(product)} variant="outline" className={`p-3.5 border-2 ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:text-pink-500'}`}>
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                     </Button>
                  </div>
                  
                  <Button onClick={handleAddToCart} disabled={isActionDisabled} className={`w-full py-3.5 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30 ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Zap className="w-5 h-5 mr-2 inline" /> Buy Now
                  </Button>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}