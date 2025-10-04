import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, X, ChevronRight, Edit3, Trash2, DollarSign, BarChart2, Zap, CornerDownRight, Plus, MapPin, Phone, Mail, Save, Tag, Image as ImageIcon } from 'lucide-react'; // Added Image icon

// NOTE: This dashboard uses mock data and pure local state management. 

// Mock Data Structures
const MOCK_ORDERS = [
    { id: 'O1001', customer: 'Jane Doe', email: 'jane@example.com', phone: '555-1234', address: '123 Main St, Bubble City', total: 1199, status: 'Shipped', date: '2025-10-01', payment: 'Credit Card', items: [{ name: 'Unicorn Dress', qty: 1, price: 1199 }] },
    { id: 'O1002', customer: 'John Smith', email: 'john@example.com', phone: '555-5678', address: '456 Oak Ave, Sparkle Town', total: 2538, status: 'Pending', date: '2025-10-03', payment: 'PayPal', items: [{ name: 'Dino Set', qty: 2, price: 999 }, { name: 'Sneakers', qty: 1, price: 540 }] },
    { id: 'O1003', customer: 'User X', email: 'userx@example.com', phone: '555-9012', address: '789 Pine Ln, Cloud Land', total: 639, status: 'Delivered', date: '2025-09-28', payment: 'COD', items: [{ name: 'Baby Onesie', qty: 1, price: 639 }] },
];

const MOCK_USERS = [
    { id: 'U1', name: 'Jane Doe', email: 'jane@example.com', orders: 3 },
    { id: 'U2', name: 'John Smith', email: 'john@example.com', orders: 5 },
];

const MOCK_REFUND_QUEUE = [
    { id: 'R1', orderId: 'O1003', customer: 'User X', amount: 639, reason: 'Wrong size ordered.', requestedBy: 'Order Manager', status: 'Pending Finance' },
];

// ⭐️ NEW MOCK DATA: Daily Payments and Orders
const MOCK_DAILY_SALES = [
    { date: '2025-10-04', orders: 5, revenue: 5400, net: 5250, discounts: 150 },
    { date: '2025-10-03', orders: 12, revenue: 8900, net: 8400, discounts: 500 },
    { date: '2025-10-02', orders: 8, revenue: 7500, net: 7100, discounts: 400 },
    { date: '2025-10-01', orders: 10, revenue: 6400, net: 6000, discounts: 400 },
    { date: '2025-09-30', orders: 15, revenue: 10500, net: 9800, discounts: 700 },
];

// Reusable Dashboard Card Component (Unchanged)
const DashboardCard = ({ title, value, icon: Icon, colorClass, linkLabel, onClick }) => (
    <motion.div 
        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} 
        className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${colorClass}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <h3 className="text-3xl font-extrabold mt-1">{value}</h3>
            </div>
            <div className="p-3 rounded-full bg-white/30">
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <button onClick={onClick} className="text-xs font-semibold mt-4 flex items-center opacity-90 hover:opacity-100">
            {linkLabel} <ChevronRight className="w-4 h-4 ml-1" />
        </button>
    </motion.div>
);

const AdminPage = ({ isDarkMode, onViewChange, userRole, products, setProducts }) => { 
    // Shared Refund State
    const [refundQueue, setRefundQueue] = useState(MOCK_REFUND_QUEUE);

    const initialSection = useMemo(() => {
        if (userRole === 'product_manager') return 'products';
        if (userRole === 'finance_manager') return 'finance';
        return 'dashboard';
    }, [userRole]);

    const [activeSection, setActiveSection] = useState(initialSection);
    // FIX: Orders and Users remain local state within AdminPage, mock data is used here
    const [orders, setOrders] = useState(MOCK_ORDERS); 
    const [users, setUsers] = useState(MOCK_USERS);

    const containerClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    const sidebarClasses = isDarkMode ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-lg';
    const mainContentClasses = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
    const cardBaseClasses = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const headerClasses = isDarkMode ? 'text-purple-400' : 'text-pink-600';

    const renderSection = () => {
        switch (activeSection) {
            case 'products':
                // Pass product state and setter to ProductManagement
                return <ProductManagement products={products} setProducts={setProducts} isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} />;
            case 'orders':
                return <OrderManagement orders={orders} setOrders={setOrders} setRefundQueue={setRefundQueue} isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} />;
            case 'users':
                return <UserManagement users={users} setUsers={setUsers} isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} />;
            case 'finance':
                // ⭐️ Pass Daily Sales Data
                return <FinanceManagement isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} refundQueue={refundQueue} setRefundQueue={setRefundQueue} />;
            case 'dashboard':
            default:
                return <Dashboard products={products} orders={orders} users={users} setActiveSection={setActiveSection} isDarkMode={isDarkMode} userRole={userRole} />;
        }
    };

    const allNavItems = useMemo(() => [
        { id: 'dashboard', label: 'Admin Dashboard', icon: TrendingUp, roles: ['admin'] },
        { id: 'products', label: 'Product Manager', icon: Package, roles: ['admin', 'product_manager'] },
        { id: 'orders', label: 'Order Manager', icon: ShoppingBag, roles: ['admin', 'product_manager'] },
        { id: 'finance', label: 'Finance Manager', icon: DollarSign, roles: ['admin', 'finance_manager'] },
        { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
    ], []);

    // ⭐️ Filter navigation based on user role
    const filteredNavItems = useMemo(() => {
        if (!userRole) return [];
        return allNavItems.filter(item => item.roles.includes(userRole));
    }, [userRole, allNavItems]);
    
    // Fallback to the first available section if the current one is restricted
    useEffect(() => {
        if (activeSection === 'dashboard' && userRole !== 'admin') {
            setActiveSection(filteredNavItems[0]?.id || 'products'); // Default to products if not admin
        }
    }, [userRole, activeSection, filteredNavItems]);


    return (
        <div className={`min-h-screen flex ${containerClasses}`}>
            {/* Sidebar */}
            <motion.div 
                initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}
                className={`w-64 p-6 flex flex-col ${sidebarClasses} sticky top-0 h-screen`}
            >
                <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>
                    {userRole?.toUpperCase().replace('_', ' ') || 'MANAGER'}
                </h1>
                <nav className="space-y-2 flex-grow">
                    {filteredNavItems.map(item => (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            whileHover={{ x: 5 }}
                            className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 ${
                                activeSection === item.id
                                    ? 'bg-pink-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>
                <div className="pt-6 border-t border-gray-700/50">
                    <motion.button
                        onClick={() => onViewChange('admin_login')} 
                        className={`w-full text-left flex items-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors`}
                    >
                        <X className="w-5 h-5 mr-3" />
                        <span className="font-medium">Exit Admin</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <main className={`flex-1 p-8 overflow-y-auto ${mainContentClasses}`}>
                <header className="flex justify-between items-center pb-6 mb-8 border-b border-gray-700/50">
                    <h2 className={`text-4xl font-extrabold capitalize ${headerClasses}`}>
                        {activeSection.replace('_', ' ')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Logged in as: <span className="font-semibold text-white dark:text-gray-200 capitalize">{userRole}</span>
                    </p>
                </header>
                {renderSection()}
            </main>
        </div>
    );
};

// --- Dashboard Sub-Components (Unchanged) ---
const Dashboard = ({ products, orders, users, setActiveSection, isDarkMode, userRole }) => {
    // ... (content of Dashboard)
    const canViewFinance = userRole === 'admin' || userRole === 'finance_manager';
    
    const totalRevenue = 52100.00; 
    const netProfit = 18500.00;
    const pendingTickets = 14;
    
    const totalOrders = orders.length;
    const lowStockItems = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    const totalSells = 1250; 
    const totalTraffic = 8900; 

    const financeCards = [
        { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, colorClass: "bg-gradient-to-r from-pink-500 to-purple-600 text-white", linkLabel: "View Sales", section: 'finance' },
        { title: "Net Profit", value: `₹${netProfit.toLocaleString()}`, icon: TrendingUp, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Reports", section: 'finance' },
        { title: "Avg. Daily Traffic", value: `${totalTraffic.toLocaleString()}`, icon: BarChart2, colorClass: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white", linkLabel: "Google Analytics", section: 'dashboard' },
        { title: "Pending Tickets", value: pendingTickets, icon: X, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Resolve Tickets", section: 'dashboard' },
    ];

    const operationalCards = [
        { title: "Total Orders", value: totalOrders, icon: ShoppingBag, colorClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white", linkLabel: "Manage Orders", section: 'orders' },
        { title: "Total Sells (Units)", value: totalSells.toLocaleString(), icon: Package, colorClass: "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white", linkLabel: "View Products", section: 'products' },
        { title: "Stock Alerts", value: lowStockItems + outOfStockItems, icon: Package, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Fix Inventory", section: 'products' },
        { title: "Active Users", value: users.length, icon: Users, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Users", section: 'users' },
    ];
    
    const renderedCards = [...financeCards, ...operationalCards].filter(card => {
        if (card.section === 'finance' && !canViewFinance) return false;
        if (card.section === 'products' && userRole === 'finance_manager') return false;
        if (card.section === 'users' && userRole !== 'admin') return false;
        return true;
    });


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderedCards.map((card, index) => (
                    <DashboardCard 
                        key={index}
                        title={card.title} 
                        value={card.value} 
                        icon={card.icon} 
                        colorClass={card.colorClass}
                        linkLabel={card.linkLabel}
                        onClick={() => setActiveSection(card.section)}
                    />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {(userRole === 'admin' || userRole === 'product_manager') && (
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-orange-500 dark:text-orange-400">Low Stock Items</h3>
                        <ul className="space-y-2">
                            {products.filter(p => p.stock <= 10).map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <span>{p.name}</span>
                                    <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                        Stock: {p.stock}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {(userRole === 'admin' || userRole === 'product_manager') && (
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Recent Orders</h3>
                        <ul className="space-y-2">
                            {orders.slice(0, 3).map(o => (
                                <li key={o.id} className="flex justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
                                    <span>Order {o.id} ({o.customer})</span>
                                    <span className="font-semibold">{o.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Product Management Modal Component (New) ---
const ProductFormModal = ({ isOpen, onClose, isDarkMode, product, onSave }) => {
    // Determine if we are adding a new product or editing an existing one
    const isEditing = !!product;
    
    // NOTE: Added discountedPrice, originalPrice, and discount to initial state
    const [formData, setFormData] = useState(product ? { 
        ...product, // Use existing product data
        originalPrice: product.originalPrice || product.price, // Fallback for price property
        discountedPrice: product.discountedPrice || product.price,
        images: product.images || [],
        newImageColor: '', 
        newImageUrl: '',
        newImageFile: null, // ⭐️ NEW: State for file upload
    } : {
        // Initial state for new product
        id: Date.now().toString(), name: '', price: 0, stock: 0, category: 'Tops', description: '', images: [], newImageColor: '', newImageUrl: '', discountedPrice: 0, originalPrice: 0, discount: 0, rating: 4.5, reviews: 0, colors: [], sizes: ['S', 'M'], newImageFile: null
    });

    // List of common colors and their Tailwind classes
    const AVAILABLE_COLORS = useMemo(() => [
        { name: 'Pink', class: 'bg-pink-500', value: 'pink' },
        { name: 'Blue', class: 'bg-blue-500', value: 'blue' },
        { name: 'Red', class: 'bg-red-500', value: 'red' },
        { name: 'Green', class: 'bg-green-500', value: 'green' },
        { name: 'Yellow', class: 'bg-yellow-500', value: 'yellow' },
        { name: 'Purple', class: 'bg-purple-500', value: 'purple' },
        { name: 'White', class: 'bg-white border border-gray-400', value: 'white' },
        { name: 'Black', class: 'bg-black', value: 'black' },
    ], []);

    // Helper to calculate discount based on original and discounted price
    const calculateDiscount = useCallback((original, discounted) => {
        const org = Number(original);
        const disc = Number(discounted);
        if (org > disc && org > 0) {
            return Math.floor(((org - disc) / org) * 100);
        }
        return 0;
    }, []);

    useEffect(() => {
        // Recalculate discount whenever price fields change
        const discountValue = calculateDiscount(formData.originalPrice, formData.discountedPrice);
        if (discountValue !== formData.discount) {
             setFormData(p => ({ ...p, discount: discountValue }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.originalPrice, formData.discountedPrice, calculateDiscount]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? Number(value) : value;
        
        setFormData(p => ({
            ...p,
            [name]: finalValue
        }));
    };
    
    const handleColorSelect = (colorValue) => {
        setFormData(p => ({
            ...p,
            newImageColor: colorValue
        }));
    };
    
    // ⭐️ NEW HANDLER: Reads the uploaded file and converts it to Base64 URL
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // reader.result is the Base64 data URL
                setFormData(p => ({ ...p, newImageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
             setFormData(p => ({ ...p, newImageUrl: '' }));
        }
    };
    
    const handleImageAdd = () => {
        // ⭐️ CHECK FOR Base64 URL instead of external URL
        if (formData.newImageUrl && formData.newImageColor) {
            // Check if color already exists
            if (formData.images.some(img => img.color === formData.newImageColor)) {
                alert(`Image for color "${formData.newImageColor.toUpperCase()}" already added. Delete it first to replace.`);
                return;
            }
            setFormData(p => ({
                ...p,
                images: [...p.images, { color: p.newImageColor, url: p.newImageUrl }],
                newImageColor: '', // Clear selection after adding
                newImageUrl: '', // Clear URL after adding
                colors: [...new Set([...p.colors, p.newImageColor])], // Auto-update colors array
            }));
        } else {
            alert('Please select a color and upload an Image.');
        }
    };
    
    const handleImageRemove = (index) => {
        setFormData(p => {
            const newImages = p.images.filter((_, i) => i !== index);
            // Re-derive colors from remaining images
            const newColors = [...new Set(newImages.map(img => img.color))];
            return {
                ...p,
                images: newImages,
                colors: newColors,
            };
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Set the primary price used in cart/wishlist to the discounted price
        const dataToSave = { ...formData, price: formData.discountedPrice };
        onSave(dataToSave);
        onClose();
    };
    
    const inputClasses = `w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`;
    const headerClasses = isDarkMode ? 'text-purple-400' : 'text-pink-600';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]" onClick={onClose} />
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-4xl p-8 rounded-3xl shadow-2xl z-[1001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
                    <h3 className={`text-3xl font-bold ${headerClasses}`}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Column 1: Basic Details */}
                    <div className="space-y-4">
                        <label className="block font-semibold">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} required />
                        
                        <label className="block font-semibold">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={inputClasses} rows="4" required />
                        
                        <label className="block font-semibold">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={inputClasses} required>
                            <option value="Tops">Tops</option>
                            <option value="Shirts">Shirts</option>
                            <option value="Cord Sets">Cord Sets</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Culotte">Culotte</option>
                            <option value="Accessories">Accessories</option>
                        </select>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Original Price (₹)</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={inputClasses} min="0" required />
                            </div>
                            <div>
                                <label className="block font-semibold">Discounted Price (₹)</label>
                                <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className={inputClasses} min="0" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} className={`${inputClasses} font-bold text-green-500 dark:text-green-400`} readOnly />
                            </div>
                            <div>
                                <label className="block font-semibold">Stock Quantity</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={inputClasses} min="0" required />
                            </div>
                        </div>
                    </div>
                    
                    {/* Column 2: Photos and Colors */}
                    <div className="space-y-4">
                        <label className="block font-semibold">1. Select Color & Add Photo ({formData.images.length})</label>
                        
                        {/* ⭐️ Color Selector Palette */}
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border dark:border-gray-700">
                            {AVAILABLE_COLORS.map(color => (
                                <motion.button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleColorSelect(color.value)}
                                    className={`w-8 h-8 rounded-full shadow-md transition-all duration-150 ${color.class} ${
                                        formData.newImageColor === color.value 
                                            ? 'ring-4 ring-offset-2 ring-pink-500 dark:ring-offset-gray-800' 
                                            : 'hover:scale-110'
                                    }`}
                                    aria-label={`Select color ${color.name}`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        
                        {/* ⭐️ FIX: File Upload Input */}
                        <label className="block font-semibold">2. Upload Image File</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange} 
                                className={`${inputClasses} flex-grow`}
                            />
                        </div>
                        
                        {/* ⭐️ Current Image Preview */}
                        {formData.newImageUrl && formData.newImageColor && (
                            <div className="flex items-center gap-2 p-2 border rounded-lg dark:border-gray-700">
                                <img src={formData.newImageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                                <span className="text-sm">Ready to add: **{formData.newImageColor.toUpperCase()}**</span>
                            </div>
                        )}
                        
                        {/* Add Button */}
                        <button type="button" onClick={handleImageAdd} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center">
                            <Plus className="w-5 h-5 mr-2" /> Add Photo to Product
                        </button>
                        
                        
                        {/* Image List */}
                        <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-700">
                            {formData.images.map((img, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{img.color.toUpperCase()}</span>
                                    </div>
                                    <button type="button" onClick={() => handleImageRemove(index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Colors: {formData.colors.length > 0 ? formData.colors.join(', ') : 'None'}</p>
                        
                        {/* Status/Rating (Static for simplicity, but included in data model) */}
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block font-semibold">Rating (Mock)</label>
                                <p className="p-2 font-medium text-yellow-500">{formData.rating || 'N/A'}</p>
                            </div>
                             <div>
                                <label className="block font-semibold">Reviews (Mock)</label>
                                <p className="p-2 font-medium">{formData.reviews || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 pt-4 border-t dark:border-gray-700">
                        <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors">
                            <Save className="w-5 h-5 mr-2 inline" /> {isEditing ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Product Management Section (Product Manager/Admin) ---
const ProductManagement = ({ products, setProducts, isDarkMode, cardBaseClasses, userRole }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null); // Holds product data if editing
    
    // Admin can manage coupons; Product Manager can only see the Product Inventory tab
    const canManageCoupons = userRole === 'admin';
    const canEditProducts = userRole === 'admin' || userRole === 'product_manager';

    const handleAction = (action, product) => {
        if (!canEditProducts) return alert('Permission denied.');

        if (action === 'Add') {
            setProductToEdit(null);
            setIsModalOpen(true);
        } else if (action === 'Edit') {
            // Find full product data (passed from table)
            setProductToEdit(product);
            setIsModalOpen(true);
        } else if (action === 'Delete') {
            // FIX: Use setProducts to update the global state
            setProducts(products.filter(p => p.id !== product.id));
            console.log(`Deleted product ${product.id}`);
        }
    };
    
    const handleProductSave = (formData) => {
        // Ensure price fields are numeric and map 'price' to 'discountedPrice' for consistency
        const savedData = {
            ...formData,
            originalPrice: Number(formData.originalPrice),
            discountedPrice: Number(formData.discountedPrice),
            price: Number(formData.discountedPrice), // Set primary price for cart/wishlist
            stock: Number(formData.stock),
            status: formData.stock > 0 ? (formData.stock <= 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
        };

        if (productToEdit) {
            // FIX: Use setProducts to update the global state
            setProducts(products.map(p => p.id === savedData.id ? savedData : p));
            console.log('Product updated:', savedData.id);
        } else {
            // FIX: Use setProducts to update the global state
            setProducts(prev => [...prev, savedData]);
            console.log('New product added:', savedData.name);
        }
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            
            <ProductFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                isDarkMode={isDarkMode} 
                product={productToEdit} 
                onSave={handleProductSave}
            />

            {/* Tabs for Product vs. Coupons */}
            <div className="flex space-x-4 border-b border-gray-700/50">
                <button onClick={() => setActiveTab('products')} className={`pb-2 font-semibold transition-colors ${activeTab === 'products' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>
                    Product Inventory
                </button>
                {(userRole === 'admin' || userRole === 'product_manager') && ( // Product Manager can also manage coupons he requests
                    <button onClick={() => setActiveTab('coupons')} className={`pb-2 font-semibold transition-colors ${activeTab === 'coupons' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>
                        Coupon Management
                    </button>
                )}
            </div>
            
            {activeTab === 'products' && (
                <div className="space-y-6">
                    {canEditProducts && (
                        <button 
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
                            onClick={() => handleAction('Add', null)}
                        >
                            + Add New Product
                        </button>
                    )}
                    
                    <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{p.name}</td>
                                        {/* Display discounted price */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">₹{p.discountedPrice.toFixed(2)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                            {p.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {canEditProducts && (
                                                <>
                                                    <button onClick={() => handleAction('Edit', p)} className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleAction('Delete', p)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'coupons' && (userRole === 'admin' || userRole === 'product_manager') && <CouponManagement isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} />}
        </motion.div>
    );
};

// --- Order Management Section (Product Manager/Admin) ---
const OrderManagement = ({ orders, setOrders, setRefundQueue, isDarkMode, cardBaseClasses, userRole }) => {
    // ... (content of OrderManagement)
    const canManageOrders = userRole === 'admin' || userRole === 'product_manager';
    const [selectedOrder, setSelectedOrder] = useState(null); // For detail view

    // Mock function for processing tracking and returns
    const handleStatusUpdate = (orderId, newStatus) => {
        console.log(`Order ${orderId} tracking status updated to ${newStatus}`);
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };
    
    // Mock function to raise a refund request
    const handleRefundRequest = (order) => {
        const refundReason = prompt(`Reason for refund/return request for Order ${order.id}?`);
        if (refundReason) {
             const newRequest = {
                id: 'R' + Date.now(),
                orderId: order.id,
                customer: order.customer,
                amount: order.total,
                reason: refundReason,
                requestedBy: 'Order Manager',
                status: 'Pending Finance'
            };
            setRefundQueue(prev => [...prev, newRequest]);
            alert(`Refund request for Order ${order.id} sent to Finance Manager.`);
        }
    };
    
    const getStatusBadge = (status) => {
        let classes = "px-2 py-0.5 rounded-full text-xs font-semibold";
        if (status === 'Delivered') return <span className={`bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ${classes}`}>{status}</span>;
        if (status === 'Shipped') return <span className={`bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ${classes}`}>{status}</span>;
        if (status === 'Pending') return <span className={`bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ${classes}`}>{status}</span>;
        if (status.includes('Return')) return <span className={`bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 ${classes}`}>{status}</span>;
        return <span className={`bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${classes}`}>{status}</span>;
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            
            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} isDarkMode={isDarkMode} onClose={() => setSelectedOrder(null)} />
            )}

            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order List</h3>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            {canManageOrders && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Tracking/Returns</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td 
                                    className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400 cursor-pointer hover:underline"
                                    onClick={() => setSelectedOrder(o)} // Open detail modal
                                >
                                    {o.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{o.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{o.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(o.status)}
                                </td>
                                {canManageOrders && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <select 
                                            value={o.status} 
                                            onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                            className="p-1 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm"
                                        >
                                            {['Pending', 'Shipped', 'Delivered', 'Return Requested', 'Canceled'].map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        {(o.status === 'Delivered' || o.status === 'Return Requested') && (
                                            <button onClick={() => handleRefundRequest(o)} className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">
                                                Refund
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// --- Order Detail Modal (New Component) ---
const OrderDetailModal = ({ order, isDarkMode, onClose }) => {
    // ... (content of OrderDetailModal)
    const modalBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
    const inputClasses = `p-2 rounded-lg border w-full dark:bg-gray-700 dark:border-gray-600`;

    if (!order) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-4xl p-8 rounded-3xl shadow-2xl z-[2001] ${modalBg}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
                    <h3 className="text-3xl font-bold text-pink-500">Order #{order.id} Details</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* User Details */}
                    <div className="space-y-4 p-4 rounded-xl dark:bg-gray-700/50 bg-gray-50 shadow-inner">
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-purple-500"><User className="w-5 h-5" /> Customer Info</h4>
                        <p className="flex items-center gap-2"><span className="font-semibold w-20">Name:</span> {order.customer}</p>
                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 mr-1 text-cyan-400" /> {order.phone}</p>
                        <p className="flex items-center gap-2"><Mail className="w-4 h-4 mr-1 text-cyan-400" /> {order.email}</p>
                        <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mr-1 mt-1 text-cyan-400 flex-shrink-0" /><span className="font-semibold w-20 flex-shrink-0">Address:</span> {order.address}</p>
                        <p className="flex items-center gap-2"><span className="font-semibold w-20">Payment:</span> {order.payment}</p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-pink-500"><ShoppingBag className="w-5 h-5" /> Items ({order.items.length})</h4>
                        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {order.items.map((item, index) => (
                                <li key={index} className="flex justify-between p-2 rounded-md dark:bg-gray-700 bg-gray-100 text-sm">
                                    <span>{item.name} x {item.qty}</span>
                                    <span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-2 border-t dark:border-gray-700">
                            <p className="text-lg font-bold flex justify-between">
                                Total: <span className="text-pink-500">₹{order.total.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};


// --- Finance Management Section (Finance Manager/Admin) ---
const FinanceManagement = ({ isDarkMode, cardBaseClasses, userRole, refundQueue, setRefundQueue }) => {
    // ... (content of FinanceManagement)
    const canValidateCoupons = userRole === 'admin';
    const totalPaymentsToday = 5400;
    const totalPaymentsWeek = 18200;
    const totalPaymentsMonth = 52100;

    const handleRefundDecision = (requestId, decision) => {
        console.log(`Refund request ${requestId} ${decision}d.`);
        // In a real app, update state and trigger external payment API
        setRefundQueue(prev => prev.filter(r => r.id !== requestId));
    }
    
    // Mock data for payments
    const PAYMENT_DATA = [
        { label: 'Today', orders: 5, total: totalPaymentsToday, discount: 150 },
        { label: 'This Week', orders: 25, total: totalPaymentsWeek, discount: 900 },
        { label: 'This Month', orders: 125, total: totalPaymentsMonth, discount: 5000 },
    ];


    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h3>
            
            {/* Total Orders & Payments Summary */}
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-purple-500">Total Payments Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {PAYMENT_DATA.map(data => (
                        <div key={data.label} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
                            <p className="text-sm font-medium text-pink-500">{data.label}</p>
                            <p className="font-bold text-lg">{data.orders} Orders</p>
                            <p className="text-sm">Total: <span className="font-semibold text-green-500">₹{data.total.toLocaleString()}</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Discount: ₹{data.discount.toLocaleString()}</p>
                            <p className="text-sm font-bold text-blue-500">Net: ₹{(data.total - data.discount).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* ⭐️ NEW: Daily Payments and Orders Table */}
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-cyan-500">Daily Sales and Payments</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Orders</th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Revenue</th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Discount</th>
                                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Net Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {MOCK_DAILY_SALES.map((d) => (
                                <tr key={d.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{d.date}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{d.orders}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-500 text-right">₹{d.revenue.toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-500 text-right">₹{d.discounts.toFixed(2)}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-right">₹{d.net.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Refund Validation Queue */}
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-red-500">Refund Validation Queue</h4>
                
                {refundQueue.length === 0 ? (
                    <p className="text-gray-500">No refunds pending validation.</p>
                ) : (
                    <ul className="space-y-3">
                        {refundQueue.map(refund => (
                            <li key={refund.id} className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-700">
                                <div>
                                    <p className="font-semibold text-lg text-red-600">Order {refund.orderId}</p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">Amount: ₹{refund.amount.toFixed(2)} | Reason: {refund.reason}</p>
                                </div>
                                <div className="space-x-2">
                                    <button 
                                        onClick={() => handleRefundDecision(refund.id, 'Approved')} 
                                        className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleRefundDecision(refund.id, 'Declined')} 
                                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {canValidateCoupons && (
                <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                    <h4 className="text-xl font-bold mb-4 text-pink-500">Coupon Validation Queue (Admin Only)</h4>
                    {/* Mock Coupon Queue logic here, simplified as this is primary for Admin */}
                    <p className="text-sm text-gray-500">Coupons are managed by Admin/Product Manager, approved by Admin or Finance Manager (see dedicated CouponManagement section for creation).</p>
                </div>
            )}
        </motion.div>
    );
};

// --- Coupon Management Section (Product Manager) ---
const CouponManagement = ({ isDarkMode, cardBaseClasses, userRole }) => {
    // ... (content of CouponManagement)
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    
    // Mock state for coupons created by Product Manager
    const [myCoupons, setMyCoupons] = useState([
        { id: 10, code: 'WELCOME10', discount: 10, status: 'Active (Approved)', uses: 50 },
        { id: 11, code: 'SPRING20', discount: 20, status: 'Pending Approval', uses: 0 },
    ]);
    
    // ⭐️ Handler to add user-defined coupon request
    const handleCouponRequestSave = (formData) => {
        const newCoupon = {
            id: Date.now(),
            code: formData.code,
            discount: formData.discount,
            status: 'Pending Finance Approval',
            uses: 0,
        };
        setMyCoupons(prev => [...prev, newCoupon]);
        console.log('New coupon requested for approval:', formData.code);
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            
            {/* ⭐️ Coupon Form Modal Integration */}
            <CouponFormModal 
                isOpen={isCouponModalOpen}
                onClose={() => setIsCouponModalOpen(false)}
                onSave={handleCouponRequestSave}
                isDarkMode={isDarkMode}
            />

            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Coupon Requests</h3>
            
            {(userRole === 'admin' || userRole === 'product_manager') && (
                <button 
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors"
                    // FIX: Open the modal instead of auto-adding mock data
                    onClick={() => setIsCouponModalOpen(true)}
                >
                    + Request New Coupon
                </button>
            )}
            
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uses</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {myCoupons.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400">{c.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.discount}%</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${c.status.includes('Approved') ? 'text-green-500 font-bold' : 'text-orange-500'}`}>
                                    {c.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.uses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

// --- User Management Section (Admin Only) ---
const UserManagement = ({ users, setUsers, isDarkMode, cardBaseClasses }) => {
    // ... (content of UserManagement)
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer List</h3>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Orders</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-500">{u.orders}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-medium">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};


// ⭐️ New Component: Coupon Creation Modal
const CouponFormModal = ({ isOpen, onClose, onSave, isDarkMode }) => {
    // ... (content of CouponFormModal)
    const [formData, setFormData] = useState({
        code: '',
        discount: 10,
        usageLimit: 100,
        minOrderValue: 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(p => ({
            ...p,
            [name]: type === 'number' ? Number(value) : value.toUpperCase().replace(/\s/g, ''),
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.discount > 99 || !formData.code) {
            alert("Coupon code and discount (max 99%) are required.");
            return;
        }
        onSave(formData);
        // Reset form after successful submission
        setFormData({ code: '', discount: 10, usageLimit: 100, minOrderValue: 0 });
        onClose();
    };

    const inputClasses = `w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`;
    const headerClasses = isDarkMode ? 'text-purple-400' : 'text-pink-600';
    const modalBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg p-8 rounded-3xl shadow-2xl z-[2001] ${modalBg}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
                    <h3 className={`text-2xl font-bold ${headerClasses}`}>Request New Coupon</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Coupon Code */}
                    <div>
                        <label className=" font-semibold mb-1 flex items-center"><Tag className='w-4 h-4 mr-2 text-pink-500' /> Coupon Code</label>
                        <input type="text" name="code" value={formData.code} onChange={handleChange} className={inputClasses} placeholder="SUMMER20" required maxLength={15} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Discount Percentage */}
                        <div>
                            <label className="block font-semibold mb-1">Discount (%)</label>
                            <input type="number" name="discount" value={formData.discount} onChange={handleChange} className={inputClasses} min="1" max="99" required />
                        </div>
                        {/* Usage Limit */}
                        <div>
                            <label className="block font-semibold mb-1">Usage Limit</label>
                            <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className={inputClasses} min="1" required />
                        </div>
                    </div>
                    
                    {/* Min Order Value */}
                    <div>
                        <label className="block font-semibold mb-1">Min. Order Value (₹)</label>
                        <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className={inputClasses} min="0" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t dark:border-gray-700">
                        <button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors">
                            <Tag className="w-5 h-5 mr-2 inline" /> Submit for Approval
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminPage;
