import React, { useState, useEffect } from 'react';

// Component Imports (Consolidated at the top)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './components/HeroSection.jsx';
import { ProductGrid } from './components/ProductGrid.jsx';
import About from './components/About.jsx';
import DiscountPopup from './components/DiscountPopup.jsx';
import { Cart } from './components/Cart.jsx';
import SearchModal from './components/Search.jsx'; 
import WishlistSidebar from './components/Wishlist.jsx';
// 🚨 NEW IMPORT: Importing the ProfilePage from its dedicated file
import ProfilePage from './components/Profile.jsx'; 


// --- Placeholder Page Components ---
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;


// ⬅️ Component: Combines Hero and ProductGrid for the Home View
const HomePage = ({ onViewChange, isDarkMode, handleProductAction }) => (
    <>
        <HeroSection 
            onShopNowClick={() => onViewChange('shop')} 
            isDarkMode={isDarkMode} 
        />
        <ProductGrid 
            products={[]}
            onProductClick={(p) => handleProductAction('View', p)}
            onAddToCart={(p) => handleProductAction('Add to Cart', p)}
            onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
        />
    </>
);


export default function App() {
// =======================================================
// ✅ APP STATE AND HANDLERS
// =======================================================
  
  // App-level visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  // 🚨 REMOVED: isProfileOpen state is no longer needed for a full page view
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  // Data states
  const [wishlistItems, setWishlistItems] = useState([
    { id: 101, name: "Sparkle Dress", price: 49.99, image: '/placeholder.jpg' }
  ]); 
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Sample Item", price: 19.99, quantity: 1 }
  ]);
  const [discounts, setDiscounts] = useState([]);
  
  // UI States
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);


  // --- Handlers ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  // 🚨 UPDATED: Handler now changes the currentView state
  const onProfileClick = () => onViewChange('profile'); 

  const onViewChange = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleApplyCode = (code) => {
    console.log(`Discount code applied: ${code}`);
  };

  const handleProductAction = (action, product) => {
      console.log(`${action} triggered for: ${product?.name || 'product'}`);
      if (action === 'Add to Wishlist') {
          const exists = wishlistItems.some(item => item.id === product.id);
          if (!exists) {
              const newItem = { ...product, id: Date.now(), name: product.name || "New Item", price: product.price || 0 };
              setWishlistItems(prev => [...prev, newItem]);
          }
      }
  };
  
  const handleRemoveWishlistItem = (itemId) => {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Cart Handlers
  const handleUpdateQuantity = (itemId, newQuantity) => { /* logic */ };
  const handleRemoveItem = (itemId) => { /* logic */ };
  const handleCheckout = () => { /* logic */ };
  const handleApplyDiscount = (discountCode) => { /* logic */ };
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- Effects ---
  useEffect(() => {
    setIsPopupVisible(true);
  }, []);


  // --- Router/Render Logic ---
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} handleProductAction={handleProductAction} />;
      case 'shop':
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
        return <About onViewChange={onViewChange} />;
      // 🚨 NEW: Profile page rendering
      case 'profile':
        return <ProfilePage isDarkMode={isDarkMode} />;
      default:
        return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} handleProductAction={handleProductAction} />;
    }
  };

  // The main App structure
  return (
    <div className={`${isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'} font-inter transition-colors duration-500`}>

      {/* 1. Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        // 🚨 PASSED HANDLER: onProfileClick
        onProfileClick={onProfileClick} 
        currentView={currentView}
        onViewChange={onViewChange}
      />

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderView()}
      </main>


       {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={handleRemoveWishlistItem}
        isDarkMode={isDarkMode}
      />
      
      {/* Discount Popup */}
      <DiscountPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onApplyCode={handleApplyCode}
      />

      {/* 3. Footer */}
      <Footer onViewChange={onViewChange} isDarkMode={isDarkMode} />

      {/* 4. Cart */}
      <Cart 
        isDarkMode={isDarkMode}
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        appliedDiscounts={discounts}
        onApplyDiscount={handleApplyDiscount}
      />
    </div>
  );
}
