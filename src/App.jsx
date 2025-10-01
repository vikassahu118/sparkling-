import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './components/HeroSection.jsx';
import { ProductGrid } from './components/ProductGrid.jsx' // Using named import { ProductGrid }

// --- Placeholder Page Components (for demonstration) ---
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;
const About = () => <div className="text-center py-40 text-4xl font-bold text-gray-600 dark:text-gray-300">✨ About Our Brand</div>;
const Contact = () => <div className="text-center py-40 text-4xl font-bold text-gray-600 dark:text-gray-300">📞 Get In Touch!</div>;


// ⬅️ NEW: Define handlers required by ProductGrid
const handleProductAction = (action, product) => {
    console.log(`${action} triggered for: ${product?.name || 'product'}`);
    // Implement actual logic here (e.g., state updates, navigation)
};


// ⬅️ NEW COMPONENT: Combines Hero and ProductGrid for the Home View
const HomePage = ({ onViewChange, isDarkMode }) => (
    <>
        <HeroSection 
            onShopNowClick={() => onViewChange('shop')} 
            isDarkMode={isDarkMode} 
        />
        {/* 🚨 Product Grid is placed directly after the Hero */}
        <ProductGrid 
            // Passing required handler functions
            products={[]} // Use default internal products
            onProductClick={(p) => handleProductAction('View', p)}
            onAddToCart={(p) => handleProductAction('Add to Cart', p)}
            onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
        />
    </>
);


export default function App() {
  // 1. Core Routing State
  const [currentView, setCurrentView] = useState('home');

  // 2. Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 3. Dummy Cart State
  const [cartCount, setCartCount] = useState(3);

  // Handlers
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const onViewChange = (viewId) => {
    console.log(`Navigating to view: ${viewId}`);
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Conditional Rendering Logic (The Router)
  const renderView = () => {
    switch (currentView) {
      case 'home':
        // ⬅️ CHANGE: Render the new HomePage component for 'home'
        return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} />;
      case 'shop':
        // 🚨 Since 'shop' is just a different view, we can use the ProductGrid here too, 
        // or keep the simple placeholder if 'shop' is meant to be a separate full page.
        // If you want ProductGrid on 'shop' too:
        return (
            <ProductGrid
                onProductClick={(p) => handleProductAction('View', p)}
                onAddToCart={(p) => handleProductAction('Add to Cart', p)}
                onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
            />
        );
      case 'categories':
        return <Categories />;
      case 'deals':
        return <Deals />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        // Default to the home page if the view is unknown
        return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} />;
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