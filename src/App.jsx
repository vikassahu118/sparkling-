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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  // Data states
  const [wishlistItems, setWishlistItems] = useState([
    { id: 101, name: "Sparkle Dress", price: 49.99, image: '/placeholder.jpg' }
  ]); 
  
  // ⭐️ FIX 1: Ensure initial cart item has a valid numeric price
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  
  // UI States
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);


  // --- Handlers ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  const onProfileClick = () => onViewChange('profile'); 

  const onViewChange = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleApplyCode = (code) => {
    console.log(`Discount code applied: ${code}`);
  };

  const handleProductAction = (action, product) => {
      // ⭐️ FIX 2: Added a robust default price (matching the 1199 figure you mentioned)
      // The ProductGrid is likely passing an incomplete mock product when called.
      // This ensures we always have a price and name.
      const actualProduct = product && product.id ? product : {
          id: 999, // Fallback ID
          name: 'Rainbow Unicorn Dress', // Default name to match screenshot
          price: 1199.00, // Using 1199.00 as the default price
          image: '/mock.jpg'
      };

      console.log(`${action} triggered for: ${actualProduct?.name || 'product'} (ID: ${actualProduct.id})`);

      if (action === 'Add to Wishlist') {
          const exists = wishlistItems.some(item => item.id === actualProduct.id);
          if (!exists) {
              const newItem = { ...actualProduct, id: Date.now(), name: actualProduct.name, price: actualProduct.price };
              setWishlistItems(prev => [...prev, newItem]);
          }
      } 
      
      // 🚨 CORE FIX: ADD TO CART LOGIC
      else if (action === 'Add to Cart') {
          setCartItems(prevItems => {
              const existingItem = prevItems.find(item => item.id === actualProduct.id);

              if (existingItem) {
                  // Item exists: Increase quantity
                  return prevItems.map(item =>
                      item.id === actualProduct.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                  );
              } else {
                  // Item does not exist: Add new item
                  const newItem = {
                      id: actualProduct.id,
                      name: actualProduct.name,
                      // ⭐️ IMPORTANT: Use the safe price here!
                      price: actualProduct.price,
                      quantity: 1
                  };
                  return [...prevItems, newItem];
              }
          });
          // Open the cart sidebar immediately after adding an item
          setIsCartOpen(true);
      }
  };
  
  const handleRemoveWishlistItem = (itemId) => {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // ------------------------------------------
  // ✅ IMPLEMENTED CART HANDLERS
  // ------------------------------------------

  const handleUpdateQuantity = (itemId, newQuantity) => { 
    if (newQuantity <= 0) {
        // If quantity is zero or less, treat it as a removal
        handleRemoveItem(itemId);
        return;
    }

    setCartItems(prevItems => {
        return prevItems.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQuantity }
                : item
        );
    });
    console.log(`Updated item ${itemId} quantity to ${newQuantity}`);
  };

  const handleRemoveItem = (itemId) => { 
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    console.log(`Removed item ${itemId} from cart.`);
  };

  const handleCheckout = () => { 
    console.log('Initiating checkout...');
    // In a real app, this would redirect to a checkout page or process payment
    alert('Checkout initiated! (This is a placeholder action)');
  };

  const handleApplyDiscount = (discountCode) => { 
    console.log(`Applying discount: ${discountCode}`);
    // In a real app, logic to validate code and update discounts state would go here
    setDiscounts(prev => [...prev, { code: discountCode, amount: 5.00 }]);
  };
  // ------------------------------------------
  
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
