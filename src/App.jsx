import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx'; // Changed back to explicit .jsx
import Footer from './components/Footer.jsx'; // Changed back to explicit .jsx
import HeroSection from './components/HeroSection.jsx'; // Changed back to explicit .jsx


// --- Placeholder Page Components (for demonstration) ---
// Note: The Home placeholder is no longer needed as HeroSection takes its place
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;
const About = () => <div className="text-center py-40 text-4xl font-bold text-gray-600 dark:text-gray-300">✨ About Our Brand</div>;
const Contact = () => <div className="text-center py-40 text-4xl font-bold text-gray-600 dark:text-gray-300">📞 Get In Touch!</div>;

export default function App() {
  // 1. Core Routing State: Controls which component (page) is displayed
  const [currentView, setCurrentView] = useState('home');

  // 2. Theme State: Controls dark mode globally
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 3. Dummy Cart State: Used for the Navbar cart count
  const [cartCount, setCartCount] = useState(3);

  // Handlers
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // The central routing function passed to Navbar and Footer
  const onViewChange = (viewId) => {
    console.log(`Navigating to view: ${viewId}`);
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // Conditional Rendering Logic (The Router)
  const renderView = () => {
    // 2. Use HeroSection for the 'home' view
    const heroSection = (
      <HeroSection 
        onShopNowClick={() => onViewChange('shop')} 
        isDarkMode={isDarkMode} 
      />
    );

    switch (currentView) {
      case 'home':
        return heroSection;
      case 'shop':
        return <Shop />;
      case 'categories':
        return <Categories />;
      case 'deals':
        return <Deals />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return heroSection;
    }
  };

  // The main App structure
  return (
    // Apply dark mode class and global background style
    <div className={`${isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'} font-inter transition-colors duration-500`}>

      {/* 1. Navbar: Controls routing, theme, and actions */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        cartCount={cartCount}
        onCartClick={() => console.log('Cart opened!')}
        onSearchClick={() => console.log('Search opened!')}
        currentView={currentView}
        onViewChange={onViewChange}
      />

      {/* 2. Main Content Area: Renders the current 'page' */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderView()}
      </main>
      

      {/* 3. Footer: Provides additional navigation links */}
      <Footer onViewChange={onViewChange} isDarkMode={isDarkMode} />
    </div>
  );
}
