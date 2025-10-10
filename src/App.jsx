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

// --- Placeholder Page Components (Unchanged) ---
const Shop = () => <div className="text-center py-40 text-4xl font-bold text-cyan-600">🛍️ Shop All Our Latest Styles!</div>;
const Categories = () => <div className="text-center py-40 text-4xl font-bold text-pink-600">📂 Explore Categories</div>;
const Deals = () => <div className="text-center py-40 text-4xl font-bold text-purple-600">🎉 Special Deals Just for You!</div>;

const HomePage = ({ onViewChange, isDarkMode, handleProductAction, wishlistItems, products }) => (
    <>
        <HeroSection
            onShopNowClick={() => onViewChange('shop')}
            isDarkMode={isDarkMode}
        />
        <ProductGrid
            products={products}
            onProductClick={(p) => handleProductAction('View', p)}
            onAddToCart={(p) => handleProductAction('Add to Cart', p)}
            onAddToWishlist={(p) => handleProductAction('Add to Wishlist', p)}
            isDarkMode={isDarkMode}
            wishlistItems={wishlistItems}
        />
    </>
);

const MOCK_PRODUCT_DATA = [
    { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?w=600', originalPrice: 1599, discountedPrice: 1199.00, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], sizes: ['S', 'M', 'L'], category: 'Tops', isNew: true, isBestseller: true, description: 'A sparkling unicorn dress perfect for parties.', stock: 45 },
    { id: '2', name: 'Cool Dino T-Shirt Set', image: 'https://images.unsplash.com/photo-1585528761181-2865fc48723f?w=600', originalPrice: 1299, discountedPrice: 999.00, discount: 23, rating: 4.6, reviews: 89, colors: ['green', 'blue', 'orange'], sizes: ['XS', 'S', 'M'], category: 'Shirts', isBestseller: true, description: 'Two cool tees with dinosaur prints.', stock: 12 },
    { id: '3', name: 'Cute Baby Onesie', image: 'https://images.unsplash.com/photo-1545877872-3e6582cbc37c?w=600', originalPrice: 799, discountedPrice: 639.00, discount: 20, rating: 4.9, reviews: 234, colors: ['white', 'pink', 'yellow'], sizes: ['XS'], category: 'Cord Sets', isNew: true, description: 'Soft cotton onesie for infants.', stock: 0 },
    { id: '4', name: 'Colorful Sneakers', image: 'https://images.unsplash.com/photo-1669762162480-fb67378e307b?w=600', originalPrice: 2199, discountedPrice: 1539.00, discount: 30, rating: 4.7, reviews: 67, colors: ['multicolor', 'rainbow', 'black'], sizes: ['M', 'L'], category: 'Culotte', description: 'Vibrant sneakers for active kids.', stock: 78 },
    { id: '5', name: 'Winter Cozy Jacket', image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?w=600', originalPrice: 2499, discountedPrice: 1749.00, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], sizes: ['M', 'L', 'XL'], category: 'Dresses', isBestseller: true, description: 'Warm puffy jacket with fleece lining.', stock: 3 },
    { id: '6', name: 'Winter Cozy Jacket', image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?w=600', originalPrice: 2499, discountedPrice: 1749.00, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], sizes: ['M', 'L', 'XL'], category: 'Pants', isBestseller: true, description: 'Warm puffy jacket with fleece lining.', stock: 3 },
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

    // ✅ FIX 1: This check is now robust. It looks for the role_name property inside the currentUserRole object.
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

    const handleCustomerLoginSuccess = (name, role) => {
        setCurrentUserName(name);
        setCurrentUserRole(role);
        onViewChange('profile');
    }

    // ✅ FIX 2: This function is completely rewritten to handle the login data correctly.
    const handleManagerLoginSuccess = (loginData) => {
        const user = loginData.user;
        const roleName = user.role_name; // Get the role name string (e.g., "admin")

        const allowedRoles = ['admin', 'product_manager', 'finance_manager'];

        // Security check: Only allow users with a valid manager role
if (roleName && allowedRoles.includes(roleName.toLowerCase())) {
            setCurrentUserName(user.first_name || roleName.replace('_', ' '));
            setCurrentUserRole(user); // Store the ENTIRE user object in state
            onViewChange('admin');
            window.history.pushState({}, '', '/');
        } else {
            // If a regular customer tries to log in here, throw an error
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

    const handleProductAction = (action, product) => {
        const actualProduct = product && product.id ? product : {
            id: 999, name: 'Rainbow Unicorn Dress', price: 1199.00, image: '/mock.jpg'
        };
        console.log(`${action} triggered for: ${actualProduct?.name || 'product'} (ID: ${actualProduct.id})`);
        if (action === 'Add to Wishlist') {
            setWishlistItems(prev => {
                const exists = prev.some(item => item.id === actualProduct.id);
                if (exists) {
                    return prev.filter(item => item.id !== actualProduct.id);
                } else {
                    const newItem = {
                        ...actualProduct, id: actualProduct.id || Date.now(), name: actualProduct.name, price: actualProduct.price
                    };
                    setIsWishlistOpen(true);
                    return [...prev, newItem];
                }
            });
        }
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
                        id: actualProduct.id, name: actualProduct.name, price: actualProduct.price, quantity: 1
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
        setIsCartOpen(false);
        onViewChange('checkout');
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

    useEffect(() => {
        setIsPopupVisible(true);
        window.onViewChange = onViewChange;
    }, []);

    useEffect(() => {
        const path = window.location.pathname.substring(1);
        if (path) {
            const normalizedPath = path.includes('/') ? path.split('/')[0] : path;
            if (['admin_login', 'shop', 'profile', 'user_auth', 'admin', 'checkout'].includes(normalizedPath)) {
                setCurrentView(normalizedPath);
            }
        }
    }, []);

    const renderView = () => {
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
                    products={products}
                />;
            case 'shop':
                return (
                    <ProductGrid
                        onProductClick={(p) => handleProductAction('View', p)}
                        onAddToCart={(p) => handleProductAction('Add to Cart', p)}
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
            case 'profile': return <ProfilePage isDarkMode={isDarkMode} onLogout={handleLogout} />;
            case 'user_auth': return <CustomerAuth isDarkMode={isDarkMode} onLoginSuccess={handleCustomerLoginSuccess} />;
            case 'admin_login':
                return (
                    <div className="min-h-screen flex items-center justify-center">
                        <AdminLogin isDarkMode={isDarkMode} onLoginSuccess={handleManagerLoginSuccess} />
                    </div>
                );
            default:
                return <HomePage onViewChange={onViewChange} isDarkMode={isDarkMode} handleProductAction={handleProductAction} wishlistItems={wishlistItems} products={products} />;
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