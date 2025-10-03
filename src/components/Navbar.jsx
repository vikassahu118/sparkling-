import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Sun, Moon, Heart, Menu, X, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"; 

// FIX 2: Define a simple Badge component, as it was used but not imported/defined.
const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center justify-center rounded-full font-semibold leading-none ${className}`}>
    {children}
  </span>
);

// FIX 1: Changed 'export function Header' to 'export default function Navbar' 
// to resolve the 'does not provide an export named default' error and align with file name convention.
export default function Navbar({ 
  isDarkMode, 
  toggleTheme, 
  cartCount, 
  onCartClick, 
  onSearchClick,
  currentView,
  onViewChange,
  // ⬅️ Prop is correctly accepted here
  onWishlistClick,
  onProfileClick
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auto theme detection based on time of day
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic header styling based on dark mode and scroll state
  const getHeaderBackground = () => {
    if (isDarkMode) {
      return isScrolled 
        ? 'bg-gray-900/98 dark:bg-gray-900/98 backdrop-blur-xl' 
        : 'bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md';
    } else {
      return isScrolled 
        ? 'bg-white/98 backdrop-blur-xl' 
        : 'bg-white/95 backdrop-blur-md';
    }
  };

  const getHeaderBorder = () => {
    return isDarkMode 
      ? 'border-purple-800/80 dark:border-purple-800/80' 
      : 'border-pink-200/80';
  };

  const getLogoGradient = () => {
    return isDarkMode
      ? 'from-purple-400 via-cyan-400 to-pink-400'
      : 'from-cyan-400 via-pink-400 to-purple-500';
  };

  const getTextGradient = () => {
    return isDarkMode
      ? 'from-purple-400 via-cyan-400 to-pink-400'
      : 'from-cyan-500 via-pink-500 to-purple-600';
  };

  const getActionButtonBg = () => {
    return isDarkMode
      ? 'bg-gray-800/90 dark:bg-gray-800/90 border-purple-700/60 dark:border-purple-700/60'
      : 'bg-white/90 border-pink-200/60';
  };

  const getHoverColors = () => {
    return isDarkMode
      ? 'hover:bg-purple-800/60 dark:hover:bg-purple-800/60'
      : 'hover:bg-pink-100';
  };

  const getIconColors = () => {
    return isDarkMode
      ? 'text-gray-300 dark:text-gray-300'
      : 'text-gray-600';
  };

  const navItems = [
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'shop', label: 'Shop', emoji: '🛍️' },
    // { id: 'categories', label: 'Categories', emoji: '📂' },
    { id: 'deals', label: 'Special Deals', emoji: '🎉' },
    { id: 'about', label: 'About Us', emoji: '✨' },
    // { id: 'contact', label: 'Contact', emoji: '📞' }
  ];

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        className={`sticky top-0 z-50 ${getHeaderBackground()} border-b ${getHeaderBorder()} transition-all duration-500 ${
          isScrolled ? 'shadow-2xl' : 'shadow-lg'
        } safe-area-top`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo ... (unchanged) */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className={`relative w-12 h-12 bg-gradient-to-r ${getLogoGradient()} rounded-full flex items-center justify-center shadow-lg`}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {isDarkMode ? (
                  <Star className="w-6 h-6 text-white" />
                ) : (
                  <Sparkles className="w-6 h-6 text-white" />
                )}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: isDarkMode ? [
                      '0 0 0 0 rgba(168, 85, 247, 0.4)',
                      '0 0 0 10px rgba(168, 85, 247, 0)',
                      '0 0 0 0 rgba(236, 72, 153, 0.4)',
                      '0 0 0 10px rgba(236, 72, 153, 0)'
                    ] : [
                      '0 0 0 0 rgba(59, 130, 246, 0.4)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(236, 72, 153, 0.4)',
                      '0 0 0 10px rgba(236, 72, 153, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              <div className="sm:block">
                <motion.h1 
                  className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent`}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                >
                  Sparkling Bubbles
                </motion.h1>
                <p className={`text-xs ${isDarkMode ? 'text-purple-300' : 'text-gray-500'} transition-colors duration-500`}>
                  Kids Fashion Paradise {isDarkMode ? '🌙' : '✨'}
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation ... (unchanged) */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.button
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      currentView === item.id
                        ? isDarkMode 
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-gray-800/90 text-gray-200 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-cyan-900/40 backdrop-blur-md border border-purple-700/60'
                          : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 backdrop-blur-md border border-pink-200/60'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: isDarkMode 
                        ? '0 8px 25px rgba(168, 85, 247, 0.4)' 
                        : '0 8px 25px rgba(236, 72, 153, 0.3)'
                    }}
                    animate={currentView === item.id ? {
                      boxShadow: isDarkMode ? [
                        '0 4px 15px rgba(168, 85, 247, 0.4)',
                        '0 6px 20px rgba(34, 211, 238, 0.5)',
                        '0 4px 15px rgba(168, 85, 247, 0.4)'
                      ] : [
                        '0 4px 15px rgba(236, 72, 153, 0.3)',
                        '0 6px 20px rgba(147, 51, 234, 0.4)',
                        '0 4px 15px rgba(236, 72, 153, 0.3)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-base">{item.emoji}</span>
                      {item.label}
                    </span>
                    {currentView !== item.id && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${
                          isDarkMode 
                            ? 'from-purple-500 to-cyan-500' 
                            : 'from-pink-400 to-purple-500'
                        } opacity-0 group-hover:opacity-10 rounded-2xl`}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Action Buttons Container */}
              <motion.div 
                className={`hidden sm:flex items-center space-x-2 ${getActionButtonBg()} backdrop-blur-md rounded-2xl p-2 shadow-lg transition-all duration-500`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Search */}
                <motion.button
                  onClick={onSearchClick}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(236, 72, 153, 0.1)',
                    boxShadow: isDarkMode ? '0 0 15px rgba(168, 85, 247, 0.4)' : '0 0 15px rgba(236, 72, 153, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all duration-300 touch-optimized ${getHoverColors()}`}
                >
                  <Search className={`w-5 h-5 ${getIconColors()}`} />
                </motion.button>

                {/* Wishlist ⬅️ FIX APPLIED HERE */}
                <motion.button
                  onClick={onWishlistClick} // 👈 ADDED onClick handler
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(236, 72, 153, 0.1)',
                    boxShadow: isDarkMode ? '0 0 15px rgba(168, 85, 247, 0.4)' : '0 0 15px rgba(236, 72, 153, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all duration-300 touch-optimized ${getHoverColors()}`}
                >
                  <Heart className={`w-5 h-5 ${getIconColors()}`} />
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={onCartClick}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(236, 72, 153, 0.1)',
                    boxShadow: isDarkMode ? '0 0 15px rgba(168, 85, 247, 0.4)' : '0 0 15px rgba(236, 72, 153, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-xl transition-all duration-300 touch-optimized ${getHoverColors()}`}
                >
                  <ShoppingCart className={`w-5 h-5 ${getIconColors()}`} />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className={`${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-600'
                      } text-white px-1.5 py-0.5 text-xs animate-pulse`}>
                        {cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </motion.button>

                {/* User */}
                <motion.button
                onClick={onProfileClick}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(236, 72, 153, 0.1)',
                    boxShadow: isDarkMode ? '0 0 15px rgba(168, 85, 247, 0.4)' : '0 0 15px rgba(236, 72, 153, 0.3)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all duration-300 touch-optimized ${getHoverColors()}`}
                >
                  <User className={`w-5 h-5 ${getIconColors()}`} />
                </motion.button>
              </motion.div>

              {/* Theme Toggle ... (unchanged) */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: isDarkMode 
                    ? '0 0 25px rgba(168, 85, 247, 0.6)' 
                    : '0 0 20px rgba(236, 72, 153, 0.4)'
                }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-2xl text-white shadow-lg touch-optimized transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-400' 
                    : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                }`}
                animate={{
                  background: isDarkMode ? [
                    'linear-gradient(45deg, #a855f7, #22d3ee)',
                    'linear-gradient(45deg, #8b5cf6, #06b6d4)',
                    'linear-gradient(45deg, #a855f7, #22d3ee)'
                  ] : [
                    'linear-gradient(45deg, #22d3ee, #a855f7)',
                    'linear-gradient(45deg, #ec4899, #8b5cf6)',
                    'linear-gradient(45deg, #22d3ee, #a855f7)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    rotate: isDarkMode ? [0, 180, 360] : [0, -180, -360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </motion.button>

              {/* Mobile Menu Button ... (unchanged) */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`lg:hidden p-2 rounded-xl ${getActionButtonBg()} backdrop-blur-md shadow-lg touch-optimized transition-all duration-500`}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className={`w-6 h-6 ${getIconColors()}`} />
                  ) : (
                    <Menu className={`w-6 h-6 ${getIconColors()}`} />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`lg:hidden sticky top-[73px] z-40 ${getHeaderBackground()} border-b ${getHeaderBorder()} shadow-lg`}
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Mobile Nav Links ... (unchanged) */}
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl text-left transition-all duration-500 touch-optimized ${
                      currentView === item.id
                        ? isDarkMode 
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-gray-800/90 text-gray-200 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-cyan-900/40 border border-purple-700/60'
                          : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 border border-pink-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile Action Buttons */}
              <motion.div 
                className={`flex sm:hidden justify-center gap-3 mt-4 p-3 ${getActionButtonBg()} backdrop-blur-md rounded-2xl transition-all duration-500`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={onSearchClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl touch-optimized transition-all duration-300 ${
                    isDarkMode ? 'bg-purple-800/60' : 'bg-pink-100'
                  }`}
                >
                  <Search className={`w-5 h-5 ${
                    isDarkMode ? 'text-purple-300' : 'text-pink-600'
                  }`} />
                </motion.button>
                
                {/* Wishlist ⬅️ FIX APPLIED HERE */}
                <motion.button
                  onClick={onWishlistClick} // 👈 ADDED onClick handler
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl touch-optimized transition-all duration-300 ${
                    isDarkMode ? 'bg-purple-800/60' : 'bg-pink-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${
                    isDarkMode ? 'text-purple-300' : 'text-pink-600'
                  }`} />
                </motion.button>
                
                <motion.button
                  onClick={onCartClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-3 rounded-xl touch-optimized transition-all duration-300 ${
                    isDarkMode ? 'bg-purple-800/60' : 'bg-pink-100'
                  }`}
                >
                  <ShoppingCart className={`w-5 h-5 ${
                    isDarkMode ? 'text-purple-300' : 'text-pink-600'
                  }`} />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge className={`absolute -top-1 -right-1 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-600'
                      } text-white px-1.5 py-0.5 text-xs`}>
                        {cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </motion.button>
                <motion.button
                onClick={onProfileClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl touch-optimized transition-all duration-300 ${
                    isDarkMode ? 'bg-purple-800/60' : 'bg-pink-100'
                  }`}
                >
                  <User className={`w-5 h-5 ${
                    isDarkMode ? 'text-purple-300' : 'text-pink-600'
                  }`} />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}