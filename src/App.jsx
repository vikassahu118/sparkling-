import React, { useState, useEffect } from 'react';

// Component Imports (Consolidated at the top)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './components/HeroSection.jsx';
import { ProductGrid } from './components/ProductGrid.jsx';
import About from './components/About.jsx';
import DiscountPopup from './components/DiscountPopup.jsx';
import { Cart } from './components/Cart.jsx';
// 👇 FIXED IMPORT PATHS: Using the full, correct file names
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
             isDarkMode={isDarkMode}
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
  
  // FIX 1: Initial cart state set to an empty array (as previously agreed for dynamic loading)
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
      // Create a robust product object with necessary properties
      const actualProduct = product && product.id ? product : {
          id: 999, // Fallback ID
          name: 'Rainbow Unicorn Dress', // Default name to match screenshot
          price: 1199.00, // Using 1199.00 as the default price
          image: '/mock.jpg'
      };

      console.log(`${action} triggered for: ${actualProduct?.name || 'product'} (ID: ${actualProduct.id})`);

      // WISHLIST LOGIC
      if (action === 'Add to Wishlist') {
          const exists = wishlistItems.some(item => item.id === actualProduct.id);
          if (!exists) {
              // Note: Using Date.now() for unique ID for items added directly, 
              // but relying on product.id when available for cart/wishlist tracking.
              const newItem = { 
                ...actualProduct, 
                id: actualProduct.id || Date.now(), 
                name: actualProduct.name, 
                price: actualProduct.price 
              };
              setWishlistItems(prev => [...prev, newItem]);
              setIsWishlistOpen(true);
          } else {
            console.log("Item already in wishlist.");
          }
      } 
      
      // ADD TO CART LOGIC
      else if (action === 'Add to Cart') {
          setCartItems(prevItems => {
              const existingItem = prevItems.find(item => item.id === actualProduct.id);

              if (existingItem) {
                  return prevItems.map(item =>
                      item.id === actualProduct.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                  );
              } else {
                  const newItem = {
                      id: actualProduct.id,
                      name: actualProduct.name,
                      price: actualProduct.price,
                      quantity: 1
                  };
                  return [...prevItems, newItem];
              }
          });
          setIsCartOpen(true);
      }
  };
  
  const handleRemoveWishlistItem = (itemId) => {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // ------------------------------------------
  // CART HANDLERS
  // ------------------------------------------

  const handleUpdateQuantity = (itemId, newQuantity) => { 
    if (newQuantity <= 0) {
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
    alert('Checkout initiated! (This is a placeholder action)');
  };

  const handleApplyDiscount = (discountCode) => { 
    console.log(`Applying discount: ${discountCode}`);
    setDiscounts(prev => [...prev, { code: discountCode, amount: 5.00 }]);
  };
  
  // MOVE ALL TO CART LOGIC (RESTORED)
  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;

    setCartItems(prevCart => {
        let updatedCart = [...prevCart];
        
        wishlistItems.forEach(wishItem => {
            const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === wishItem.id);
            
            if (existingItemIndex !== -1) {
                // Item exists: Increase quantity by 1 
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1,
                };
            } else {
                // Item is new: Add to cart
                updatedCart.push({ ...wishItem, quantity: 1 });
            }
        });
        return updatedCart;
    });

    // Clear the wishlist and open the cart
    setWishlistItems([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    console.log('Moved all items from wishlist to cart.');
  };
  
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

      {/* 3. Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={handleRemoveWishlistItem}
        // 👇 CRITICAL FIX: Restoring the handler for "Move All to Cart"
        onMoveAllToCart={handleMoveAllToCart}
        isDarkMode={isDarkMode}
      />
      
      {/* Discount Popup */}
      <DiscountPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onApplyCode={handleApplyCode}
      />

      {/* 4. Footer */}
      <Footer onViewChange={onViewChange} isDarkMode={isDarkMode} />

      {/* 5. Cart */}
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
