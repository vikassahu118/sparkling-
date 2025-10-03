

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, ChevronDown } from 'lucide-react';

// --- UI Component Placeholders (rafce format) ---

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const placeholder = `https://placehold.co/600x400/f7f7f7/cbd5e0?text=Image+Not+Found`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(placeholder)}
    />
  );
};

const Badge = ({ children, className }) => (
  <span className={`font-bold rounded-full text-xs px-2.5 py-1 ${className}`}>
    {children}
  </span>
);

const Button = ({ children, className, onClick, ...props }) => (
  <button className={`font-semibold rounded-lg transition-transform duration-200 ease-in-out active:scale-95 ${className}`} onClick={onClick} {...props}>
    {children}
  </button>
);


// --- Main Product Grid Component (rafce format) ---

export const ProductGrid = ({ products = [], onProductClick, onAddToCart, onAddToWishlist }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultProducts = [
      { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZHJlc3MlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxNDMzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 1599, discountedPrice: 1199, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], category: 'Girls', isNew: true, isBestseller: true },
      { id: '2', name: 'Cool Dino T-Shirt Set', image: 'https://images.unsplash.com/photo-1585528761181-2865fc48723f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNoaXJ0JTIwcGFudHN8ZW58MXx8fHwxNzU5MTQzNDA2fDA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 1299, discountedPrice: 999, discount: 23, rating: 4.6, reviews: 89, colors: ['green', 'blue', 'orange'], category: 'Boys', isBestseller: true },
      { id: '3', name: 'Cute Baby Onesie', image: 'https://images.unsplash.com/photo-1545877872-3e6582cbc37c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwb25lc2llJTIwY3V0ZXxlbnwxfHx8fDE3NTkxNDM0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 799, discountedPrice: 639, discount: 20, rating: 4.9, reviews: 234, colors: ['white', 'pink', 'yellow'], category: 'Infants', isNew: true },
      { id: '4', name: 'Colorful Sneakers', image: 'https://images.unsplash.com/photo-1669762162480-fb67378e307b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxraWRzJTIwc2hvZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxNDM0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 2199, discountedPrice: 1539, discount: 30, rating: 4.7, reviews: 67, colors: ['multicolor', 'rainbow'], category: 'Accessories' },
      { id: '5', name: 'Winter Cozy Jacket', image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxraWRzJTIwamFja2V0JTIwd2ludGVyfGVufDF8fHx8MTc1OTE0MzQ1Mnww&lib=rb-4.1.0&q=80&w=1080', originalPrice: 2499, discountedPrice: 1749, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], category: 'Outerwear', isBestseller: true },
      { id: '6', name: 'Party Princess Dress', image: 'https://images.unsplash.com/photo-1694083884221-d23d8b1a83b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGFydHklMjBkcmVzc3xlbnwxfHx8fDE3NTkxNDM0Nzd8MA&lib=rb-4.1.0&q=80&w=1080', originalPrice: 1899, discountedPrice: 1329, discount: 30, rating: 4.8, reviews: 201, colors: ['gold', 'silver', 'purple'], category: 'Girls', isNew: true },
      { id: '7', name: 'Comfy Corduroy Set', image: 'https://images.unsplash.com/photo-1618511867134-2e7b5b5832ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY29yZHJveSUyMHNldHxlbnwxfHx8fDE3NTkyMzI5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 1799, discountedPrice: 1439, discount: 20, rating: 4.7, reviews: 95, colors: ['brown', 'green', 'blue'], category: 'Cord Sets' },
      { id: '8', name: 'Breezy Culotte Set', image: 'https://images.unsplash.com/photo-1593431632344-f73244d66b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY3Vsb3R0ZSUyMHNldHxlbnwxfHx8fDE3NTkyMzI5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080', originalPrice: 1399, discountedPrice: 1049, discount: 25, rating: 4.6, reviews: 78, colors: ['yellow', 'white', 'blue'], category: 'Culotte Sets' },
  ];

  const productsToUse = products.length > 0 ? products : defaultProducts;

  const categories = useMemo(() => 
    ['All', ...new Set(productsToUse.map(p => p.category))],
    [productsToUse]
  );
  
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return productsToUse;
    }
    return productsToUse.filter(product => product.category === selectedCategory);
  }, [selectedCategory, productsToUse]);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <section className="py-16 px-4 min-h-screen font-sans">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Featured Products 🌟
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Handpicked favorites that kids love and parents trust
          </p>
        </motion.div>

        {/* --- Category Filter Dropdown --- */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center w-full rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-pink-500"
            >
              {selectedCategory === 'All' ? 'All Categories' : `Showing: ${selectedCategory}`}
              <ChevronDown className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {categories.map(category => (
                      <a
                        key={category}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategorySelect(category);
                        }}
                        className={`block px-4 py-2 text-sm ${selectedCategory === category ? 'font-bold text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                        role="menuitem"
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* --- Products Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative overflow-hidden">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} className="cursor-pointer" onClick={() => onProductClick(product)}>
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                </motion.div>
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-green-500 text-white">NEW</Badge>}
                  {product.isBestseller && <Badge className="bg-orange-500 text-white">BESTSELLER</Badge>}
                </div>
                <motion.div
                    className="absolute top-3 right-3"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                    <Badge className="bg-red-500 text-white text-sm px-3 py-1.5">
                        {product.discount}% OFF
                    </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
                >
                  <Button size="sm" onClick={() => onProductClick(product)} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3 h-10 w-10 flex items-center justify-center"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" onClick={() => onAddToWishlist(product)} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3 h-10 w-10 flex items-center justify-center"><Heart className="w-4 h-4" /></Button>
                </motion.div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews})</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-pink-600 transition-colors line-clamp-2" onClick={() => onProductClick(product)}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-pink-600">₹{product.discountedPrice}</span>
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                </div>
                <div className="flex-grow"></div> {/* Spacer */}
                <Button onClick={() => onAddToCart(product)} className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



