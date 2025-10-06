import React, { useState, useEffect } from 'react';

// Component Imports 
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
import OfferBar from "./components/OfferBar.jsx";
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminPage from './components/admin/AdminPage.jsx';
import CustomerAuth from './components/CustomerAuth.jsx'; 

// --- Placeholder Page Components (Unchanged) ---
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;


// ⬅️ Component: Combines Hero and ProductGrid for the Home View
const HomePage = ({ onViewChange, isDarkMode, handleProductAction, wishlistItems, products }) => ( 
    <>
        <HeroSection 
            onShopNowClick={() => onViewChange('shop')} 
            isDarkMode={isDarkMode} 
        />
        <ProductGrid 
            products={products} // ⭐️ Uses centralized product list
            onProductClick={(p) => handleProductAction('View', p)}
            onAddToCart={(p) => handleProductAction('Add to Cart', p)}
            onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
            isDarkMode={isDarkMode} 
            wishlistItems={wishlistItems} 
        />
    </>
);

// ⭐️ Mock Product Data (Centralized Source of Truth)
const MOCK_PRODUCT_DATA = [
    { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?w=600', originalPrice: 1599, discountedPrice: 1199.00, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], sizes: ['S', 'M', 'L'], category: 'Tops', isNew: true, isBestseller: true, description: 'A sparkling unicorn dress perfect for parties.', stock: 45 },
    { id: '2', name: 'Cool Dino T-Shirt Set', image: 'https://images.unsplash.com/photo-1585528761181-2865fc48723f?w=600', originalPrice: 1299, discountedPrice: 999.00, discount: 23, rating: 4.6, reviews: 89, colors: ['green', 'blue', 'orange'], sizes: ['XS', 'S', 'M'], category: 'Shirts', isBestseller: true, description: 'Two cool tees with dinosaur prints.', stock: 12 },
    { id: '3', name: 'Cute Baby Onesie', image: 'https://images.unsplash.com/photo-1545877872-3e6582cbc37c?w=600', originalPrice: 799, discountedPrice: 639.00, discount: 20, rating: 4.9, reviews: 234, colors: ['white', 'pink', 'yellow'], sizes: ['XS'], category: 'Cord Sets', isNew: true, description: 'Soft cotton onesie for infants.', stock: 0 },
    { id: '4', name: 'Colorful Sneakers', image: 'https://images.unsplash.com/photo-1669762162480-fb67378e307b?w=600', originalPrice: 2199, discountedPrice: 1539.00, discount: 30, rating: 4.7, reviews: 67, colors: ['multicolor', 'rainbow', 'black'], sizes: ['M', 'L'], category: 'Culotte', description: 'Vibrant sneakers for active kids.', stock: 78 },
    { id: '5', name: 'Winter Cozy Jacket', image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?w=600', originalPrice: 2499, discountedPrice: 1749.00, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], sizes: ['M', 'L', 'XL'], category: 'Dresses', isBestseller: true, description: 'Warm puffy jacket with fleece lining.', stock: 3 },
];


export default function App() {
// =======================================================
// ✅ APP STATE AND HANDLERS
// =======================================================
  
  // App-level visibility states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  // State for Authentication/Role Tracking
  const [currentUserRole, setCurrentUserRole] = useState(null); 
  const [currentUserName, setCurrentUserName] = useState(null); 
  
  // Data states
  const [wishlistItems, setWishlistItems] = useState([]); 
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  // ⭐️ Product State is now centralized
  const [products, setProducts] = useState(MOCK_PRODUCT_DATA); 
  
  // UI States
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ⭐️ NEW: A convenient way to check if we are in an Admin view
  const isAdminView = currentView === 'admin' && (currentUserRole === 'admin' || currentUserRole === 'product_manager' || currentUserRole === 'finance_manager');

  // --- Handlers ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  
  // Profile Click Logic (ONLY for general users)
  const onProfileClick = () => {
    if (currentUserRole === 'user') {
        onViewChange('profile'); 
    } else {
        onViewChange('user_auth'); 
    }
  };

  // Handler for Customer Login Success
  const handleCustomerLoginSuccess = (name, role) => {
    setCurrentUserName(name);
    setCurrentUserRole(role);
    onViewChange('profile'); 
  }

  // Handler for Admin/Manager Login Success (Used by AdminLogin component)
  const handleManagerLoginSuccess = (role) => {
    setCurrentUserName(role.toUpperCase().replace('_', ' '));
    setCurrentUserRole(role);
    onViewChange('admin'); 
    // FIX: Change URL back to home on successful login/navigation
    window.history.pushState({}, '', '/'); 
  };
  
  // Generic Logout Handler
  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentUserName(null);
    onViewChange('home');
  };

  // Updated onViewChange to handle URL changes
  const onViewChange = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update the browser URL without reloading
    const path = viewId === 'home' ? '/' : `/${viewId}`;
    if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
    }
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

      // WISHLIST LOGIC (Toggle: Add if missing, remove if present)
      if (action === 'Add to Wishlist') {
          setWishlistItems(prev => {
              const exists = prev.some(item => item.id === actualProduct.id);
              if (exists) {
                  return prev.filter(item => item.id !== actualProduct.id);
              } else {
                  const newItem = { 
                    ...actualProduct, 
                    id: actualProduct.id || Date.now(), 
                    name: actualProduct.name, 
                    price: actualProduct.price 
                  };
                  setIsWishlistOpen(true); 
                  return [...prev, newItem];
              }
          });
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
  // CART HANDLERS (Unchanged)
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
  };

  const handleRemoveItem = (itemId) => { 
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => { 
    console.log('Initiating checkout...');
    alert('Checkout initiated! (This is a placeholder action)');
  };

  const handleApplyDiscount = (discountCode) => { 
    console.log(`Applying discount: ${discountCode}`);
    setDiscounts(prev => [...prev, { code: discountCode, amount: 5.00 }]);
  };
  
  const handleMoveAllToCart = () => {
    if (wishlistItems.length === 0) return;

    setCartItems(prevCart => {
        let updatedCart = [...prevCart];
        
        wishlistItems.forEach(wishItem => {
            const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === wishItem.id);
            
            if (existingItemIndex !== -1) {
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1,
                };
            } else {
                updatedCart.push({ ...wishItem, quantity: 1 });
            }
        });
        return updatedCart;
    });

    setWishlistItems([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ⭐️ FIX: Restore useEffect for Discount Popup Visibility
  useEffect(() => {
    // Show popup on every homepage load
    setIsPopupVisible(true);
    // Also attach onViewChange to window for admin access
    window.onViewChange = onViewChange;
  }, []); // Empty dependency array ensures it runs once on mount


  // Effect to read URL on mount (Simulates router) - Runs after the popup check
  useEffect(() => {
    const path = window.location.pathname.substring(1); // Remove leading '/'
    if (path) {
        // Check if the path matches a known route, defaulting to 'home' if not found
        const normalizedPath = path.includes('/') ? path.split('/')[0] : path;
        
        if (['admin_login', 'shop', 'profile', 'user_auth', 'admin'].includes(normalizedPath)) {
            setCurrentView(normalizedPath);
        }
    }
  }, []);

  // --- Router/Render Logic ---
  const renderView = () => {
    // Use the isAdminView boolean check
    if (isAdminView) {
        return <AdminPage 
            isDarkMode={isDarkMode} 
            onViewChange={onViewChange} 
            userRole={currentUserRole}
            products={products}
            setProducts={setProducts} 
        />;
    }
    
    switch (currentView) {
      case 'home':
        return <HomePage 
            onViewChange={onViewChange} 
            isDarkMode={isDarkMode} 
            handleProductAction={handleProductAction} 
            wishlistItems={wishlistItems}
            products={products} // ⭐️ Passed product state
        />;
      case 'shop':
        return (
            <ProductGrid
                onProductClick={(p) => handleProductAction('View', p)}
                onAddToCart={(p) => handleProductAction('Add to Cart', p)}
                onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
                isDarkMode={isDarkMode}
                wishlistItems={wishlistItems}
                products={products} // ⭐️ Passed product state
            />
        );
      case 'categories':
        return <Categories />;
      case 'deals':
        return <Deals />;
      case 'about':
        return <About onViewChange={onViewChange} />;
      
      // Standard Customer Routes
      case 'profile':
        return <ProfilePage isDarkMode={isDarkMode} onLogout={handleLogout} />;
      case 'user_auth':
        return <CustomerAuth isDarkMode={isDarkMode} onLoginSuccess={handleCustomerLoginSuccess} />;

      // Admin/Manager Routes (Accessed via hidden URL/direct routing)
      case 'admin_login': 
        return <AdminLogin isDarkMode={isDarkMode} onLoginSuccess={handleManagerLoginSuccess} />;
      
      default:
        return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} handleProductAction={handleProductAction} wishlistItems={wishlistItems} products={products} />;
    }
  };

  // The main App structure
  return (
    <div className={`${isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'} font-inter transition-colors duration-500`}>
      
      {/* 1. Conditional Rendering for OfferBar */}
      {!isAdminView && <OfferBar />}

      {/* 2. Conditional Rendering for Navbar */}
      {!isAdminView && (
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
      )}

      {/* 3. Main Content Area: Always render, its content handles its own layout */}
      <main className={isAdminView ? "h-screen" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {renderView()}
      </main>

       {/* Search Modal (Only needed for main site) */}
      {!isAdminView && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            isDarkMode={isDarkMode}
          />
      )}

      {/* 4. Wishlist Sidebar (Only needed for main site) */}
      {!isAdminView && (
          <WishlistSidebar
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistItems={wishlistItems}
            onRemoveItem={handleRemoveWishlistItem}
            onMoveAllToCart={handleMoveAllToCart}
            isDarkMode={isDarkMode}
          />
      )}
      
      {/* 5. Discount Popup (Only needed for main site) */}
      {!isAdminView && (
          <DiscountPopup
            isVisible={isPopupVisible}
            onClose={() => setIsPopupVisible(false)}
            onApplyCode={handleApplyCode}
          />
      )}

      {/* 6. Conditional Rendering for Footer */}
      {!isAdminView && <Footer onViewChange={onViewChange} isDarkMode={isDarkMode} />}

      {/* 7. Cart (Only needed for main site) */}
      {!isAdminView && (
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
      )}
    </div>
  );
}