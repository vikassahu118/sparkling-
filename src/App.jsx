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
import CheckoutPage from './components/CheckoutPage.jsx';

// --- Configuration & Mappings ---

// Map text sizes to Database IDs
const SIZE_MAP = {
    '1y-2y': 1, '2y-3y': 2, '3y-4y': 3, '4y-5y': 4,
    '5y-6y': 5, '6y-7y': 6, '7y-8y': 7, '8y-9y': 8,
    '9y-10y': 9, '10y-11y': 10, '11y-12y': 11, '12y-13y': 12
};

// Map text colors to Database IDs (Adjust based on your actual DB table)
const COLOR_MAP = {
    'multicolor': 1, 
    'pink': 2, 
    'blue': 3, 
    'red': 4, 
    'green': 5, 
    'white': 6, 
    'yellow': 7, 
    'purple': 8, 
    'black': 9
};

// --- Placeholder Page Components ---
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;

// Updated HomePage Component
const HomePage = ({ onViewChange, isDarkMode, handleProductAction, onAddToCart, wishlistItems, products }) => (
    <>
        <HeroSection
            onShopNowClick={() => onViewChange('shop')}
            isDarkMode={isDarkMode}
        />
        <ProductGrid
            products={products}
            onProductClick={(p) => handleProductAction('View', p)}
            onAddToCart={onAddToCart}
            onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
            isDarkMode={isDarkMode}
            wishlistItems={wishlistItems}
        />
    </>
);

const MOCK_PRODUCT_DATA = [
    { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?w=600', originalPrice: 1599, discountedPrice: 1199.00, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], sizes: ['S', 'M', 'L'], category: 'Tops', isNew: true, isBestseller: true, description: 'A sparkling unicorn dress perfect for parties.', stock: 45 },
];

export default function App() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [products, setProducts] = useState(MOCK_PRODUCT_DATA);
    const [currentView, setCurrentView] = useState('home');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const isAdminView = currentView === 'admin' && currentUserRole?.role_name;
    const isLayoutFreeView = currentView === 'checkout' || currentView === 'admin_login' || isAdminView;

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    const onProfileClick = () => {
        if (currentUserRole === 'user') {
            onViewChange('profile');
        } else {
            onViewChange('user_auth');
        }
    };

    const handleCustomerLoginSuccess = (user) => {
        setCurrentUserName(user.first_name);
        setCurrentUserRole(user);
        onViewChange('profile');
    };

    const handleManagerLoginSuccess = (loginData) => {
        const user = loginData.user;
        const roleName = user.role_name;
        const allowedRoles = ['admin', 'product_manager', 'finance_manager'];

        if (roleName && allowedRoles.includes(roleName.toLowerCase())) {
            setCurrentUserName(user.first_name || roleName.replace('_', ' '));
            setCurrentUserRole(user);
            onViewChange('admin');
            window.history.pushState({}, '', '/');
        } else {
            throw new Error("Access Denied: You do not have manager privileges.");
        }
    };

    const handleLogout = () => {
        setCurrentUserRole(null);
        setCurrentUserName(null);
        onViewChange('home');
    };

    const onViewChange = (viewId) => {
        setCurrentView(viewId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const path = viewId === 'home' ? '/' : `/${viewId}`;
        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }
    };

    const handleApplyCode = (code) => {
        console.log(`Discount code applied: ${code}`);
    };

    // --- CART LOGIC (UPDATED) ---
    // In src/App.jsx

// In src/App.jsx

// In src/App.jsx

const handleAddToCart = async (cartItem) => {
    console.log("Adding to cart:", cartItem);

    // 1. Optimistically update the UI
    setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );

        if (existingItemIndex >= 0) {
            const newItems = [...prevItems];
            newItems[existingItemIndex] = {
                ...newItems[existingItemIndex],
                quantity: newItems[existingItemIndex].quantity + cartItem.quantity
            };
            return newItems;
        }
        return [...prevItems, cartItem];
    });
    
    setIsCartOpen(true);

    // 2. Auth Check
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) return;

    // 3. Find Variant ID
    let variantId = null;
    const fullProduct = products.find(p => p.id === cartItem.id);
    
    if (fullProduct && fullProduct.variants && Array.isArray(fullProduct.variants)) {
        const match = fullProduct.variants.find(v => {
            const vSize = v.size?.age_range || v.size; 
            const vColor = v.color?.name || v.color;
            return vSize === cartItem.size && vColor?.toLowerCase() === cartItem.color?.toLowerCase();
        });
        if (match) variantId = match.id;
    }

    // Fallback
    if (!variantId) {
        console.warn("Using fallback Variant ID: 6");
        variantId = 6; 
    }

    try {
        const response = await fetch('http://localhost:8000/api/v1/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // ✅ THE FIX: Send EVERY common name for the ID
            body: JSON.stringify({
                quantity: parseInt(cartItem.quantity),
                
                // 1. Snake Case (Most likely for your DB)
                product_variant_id: variantId, 
                
                // 2. Camel Case
                productVariantId: variantId,
                
                // 3. Short Snake
                variant_id: variantId,
                
                // 4. Short Camel
                variantId: variantId,

                // 5. Explicit IDs just in case
                product_id: parseInt(cartItem.id),
                size_id: SIZE_MAP[cartItem.size] || 1,
                color_id: COLOR_MAP[cartItem.color?.toLowerCase()] || 1
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
        } else {
            console.log("✅ Successfully saved to database!");
        }

    } catch (error) {
        console.error("Network Error:", error);
    }
};

    // --- REFACTORED: Wishlist Logic with API Integration ---
    const handleProductAction = async (action, product) => {
        if (action !== 'Add to Wishlist') return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("Please log in to manage your wishlist.");
            onViewChange('user_auth');
            return;
        }

        const isWishlisted = wishlistItems.some(item => item.product_id === product.id);

        if (isWishlisted) {
            // Find the wishlist item ID to delete
            const wishlistItem = wishlistItems.find(item => item.product_id === product.id);
            if (wishlistItem) {
                await handleRemoveWishlistItem(wishlistItem.id);
            }
        } else {
            // Optimistically add to UI
            const optimisticItem = { id: `temp-${Date.now()}`, product_id: product.id, product: product };
            setWishlistItems(prev => [...prev, optimisticItem]);
            setIsWishlistOpen(true);

            try {
                const response = await fetch('http://localhost:8000/api/v1/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ product_id: product.id })
                });
                if (!response.ok) throw new Error('Failed to add item to wishlist.');
                // Re-fetch to get the real ID from the database
                fetchWishlist();
            } catch (error) {
                console.error("Error adding to wishlist:", error);
                alert(error.message);
                // Revert optimistic update on failure
                setWishlistItems(prev => prev.filter(item => item.product_id !== product.id));
            }
        }
    };

    const handleRemoveWishlistItem = async (wishlistItemId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Optimistic UI update
        setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));

        try {
            const response = await fetch(`http://localhost:8000/api/v1/wishlist/${wishlistItemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to remove item from wishlist.');
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert(error.message);
            fetchWishlist(); // Re-sync with DB on failure
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }
        setCartItems(prevItems => prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        onViewChange('checkout');
    };

    const handleApplyDiscount = (discountCode) => {
        setDiscounts(prev => [...prev, { code: discountCode, amount: 5.00 }]);
    };

    const handleMoveAllToCart = () => {
        if (wishlistItems.length === 0) return;
        
        wishlistItems.forEach(wishItem => {
            handleAddToCart({
                ...wishItem.product, // Use the nested product data
                quantity: 1,
                size: wishItem.product?.sizes?.[0] || '1y-2y',
                color: wishItem.product?.colors?.[0] || 'multicolor',
            });
        });

        setWishlistItems([]);
        setIsWishlistOpen(false);
        setIsCartOpen(true);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const fetchWishlist = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setWishlistItems([]); // Clear wishlist if not logged in
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/v1/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data.data || []);
            } else {
                setWishlistItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setWishlistItems([]);
        }
    };

    useEffect(() => {
        setIsPopupVisible(true);
        window.onViewChange = onViewChange;
    }, []);

    useEffect(() => {
        const path = window.location.pathname.substring(1);
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');

        fetchWishlist(); // Fetch wishlist on initial load
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUserRole(user);
                setCurrentUserName(user.first_name);
                if (path && ['shop', 'profile', 'checkout'].includes(path)) {
                    setCurrentView(path);
                } else {
                    setCurrentView('profile'); // Default to profile if logged in
                }
            } catch (e) {
                setCurrentView('user_auth');
            }
        } else if (path && ['admin_login', 'shop', 'user_auth', 'admin'].includes(path)) {
             setCurrentView(path);
        } 
    }, []);

    const renderView = () => {
        if (isAdminView) {
            return <AdminPage 
                isDarkMode={isDarkMode} 
                onViewChange={onViewChange} 
                onLogout={() => handleLogout('admin_login')}
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
                    onAddToCart={handleAddToCart}
                    wishlistItems={wishlistItems}
                    products={products}
                />;
            case 'shop':
                return (
                    <ProductGrid
                        onProductClick={(p) => { /* Placeholder for detail view */ }}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
                        isDarkMode={isDarkMode}
                        wishlistItems={wishlistItems}
                        products={products}
                    />
                );
            case 'checkout':
                return <CheckoutPage
                    cartItems={cartItems}
                    onGoBack={() => onViewChange('shop')}
                />;
            case 'categories': return <Categories />;
            case 'deals': return <Deals />;
            case 'about': return <About onViewChange={onViewChange} />;
            case 'profile': return <ProfilePage user={currentUserRole} isDarkMode={isDarkMode} onLogout={handleLogout} />;
            case 'user_auth': return <CustomerAuth isDarkMode={isDarkMode} onLoginSuccess={handleCustomerLoginSuccess} />;
            case 'admin_login':
                return (
                    <div className="min-h-screen flex items-center justify-center">
                        <AdminLogin isDarkMode={isDarkMode} onLoginSuccess={handleManagerLoginSuccess} />
                    </div>
                );
            default:
                return <HomePage 
                    onViewChange={onViewChange} 
                    isDarkMode={isDarkMode} 
                    handleProductAction={handleProductAction} 
                    onAddToCart={handleAddToCart}
                    wishlistItems={wishlistItems} 
                    products={products} 
                />;
        }
    };

    return (
        <div className={`${isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'} font-inter transition-colors duration-500`}>
            {!isLayoutFreeView && <OfferBar />}
            {!isLayoutFreeView && (
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
            <main className={isLayoutFreeView ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
                {renderView()}
            </main>
            {!isLayoutFreeView && (
                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    isDarkMode={isDarkMode}
                />
            )}
            {!isLayoutFreeView && (
                <WishlistSidebar
                    isOpen={isWishlistOpen}
                    onClose={() => setIsWishlistOpen(false)}
                    wishlistItems={wishlistItems}
                    onRemoveItem={handleRemoveWishlistItem}
                    onMoveAllToCart={handleMoveAllToCart}
                    isDarkMode={isDarkMode}
                />
            )}
            {!isLayoutFreeView && (
                <DiscountPopup
                    isVisible={isPopupVisible}
                    onClose={() => setIsPopupVisible(false)}
                    onApplyCode={handleApplyCode}
                />
            )}
            {!isLayoutFreeView && <Footer onViewChange={onViewChange} isDarkMode={isDarkMode} />}
            {!isLayoutFreeView && (
                <Cart
                    isDarkMode={isDarkMode}
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    onCheckout={handleCheckout}
                    appliedDiscounts={discounts}
                    onApplyDiscount={handleApplyDiscount}
                />
            )}
        </div>
    );
}