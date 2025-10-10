import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, X, ChevronRight, Edit3, Trash2, DollarSign, BarChart2, Zap, CornerDownRight, Plus, MapPin, Phone, Mail, Save, Tag, Image as ImageIcon, Menu } from 'lucide-react';

// NOTE: This dashboard uses mock data and pure local state management for preview purposes.

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

const MOCK_PRODUCTS = [
     { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://placehold.co/600x400/f871b0/ffffff?text=Product', originalPrice: 1599, discountedPrice: 1199.00, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], sizes: ['S', 'M', 'L'], category: 'Tops', isNew: true, isBestseller: true, description: 'A sparkling unicorn dress perfect for parties.', stock: 45 },
     { id: '2', name: 'Cool Dino T-Shirt Set', image: 'https://placehold.co/600x400/34d399/ffffff?text=Product', originalPrice: 1299, discountedPrice: 999.00, discount: 23, rating: 4.6, reviews: 89, colors: ['green', 'blue', 'orange'], sizes: ['XS', 'S', 'M'], category: 'Shirts', isBestseller: true, description: 'Two cool tees with dinosaur prints.', stock: 12 },
     { id: '3', name: 'Cute Baby Onesie', image: 'https://placehold.co/600x400/fcd34d/ffffff?text=Product', originalPrice: 799, discountedPrice: 639.00, discount: 20, rating: 4.9, reviews: 234, colors: ['white', 'pink', 'yellow'], sizes: ['XS'], category: 'Cord Sets', isNew: true, description: 'Soft cotton onesie for infants.', stock: 0 },
     { id: '4', name: 'Colorful Sneakers', image: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Product', originalPrice: 2199, discountedPrice: 1539.00, discount: 30, rating: 4.7, reviews: 67, colors: ['multicolor', 'rainbow', 'black'], sizes: ['M', 'L'], category: 'Culotte', description: 'Vibrant sneakers for active kids.', stock: 7 },
     { id: '5', name: 'Winter Cozy Jacket', image: 'https://placehold.co/600x400/ef4444/ffffff?text=Product', originalPrice: 2499, discountedPrice: 1749.00, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], sizes: ['M', 'L', 'XL'], category: 'Dresses', isBestseller: true, description: 'Warm puffy jacket with fleece lining.', stock: 3 },
 ];

const MOCK_REFUND_QUEUE = [
    { id: 'R1', orderId: 'O1003', customer: 'User X', amount: 639, reason: 'Wrong size ordered.', requestedBy: 'Order Manager', status: 'Pending Finance' },
];

const MOCK_DAILY_SALES = [
    { date: '2025-10-04', orders: 5, revenue: 5400, net: 5250, discounts: 150 },
    { date: '2025-10-03', orders: 12, revenue: 8900, net: 8400, discounts: 500 },
    { date: '2025-10-02', orders: 8, revenue: 7500, net: 7100, discounts: 400 },
    { date: '2025-10-01', orders: 10, revenue: 6400, net: 6000, discounts: 400 },
    { date: '2025-09-30', orders: 15, revenue: 10500, net: 9800, discounts: 700 },
];

// Reusable Dashboard Card Component
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

// Offer Bar Update Modal
const OfferBarModal = ({ onClose, onSave, currentOfferText, isDarkMode }) => {
    const [text, setText] = useState(currentOfferText || '');

    useEffect(() => {
        setText(currentOfferText);
    }, [currentOfferText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(text);
        onClose();
    };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed inset-0 m-auto h-fit max-w-lg p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Update Offer Bar</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-semibold mb-2 block">Offer Text</label>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={`w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} placeholder="e.g., 🎉 Mega Sale! Up to 50% OFF..." required />
                    </div>
                    <div className="pt-4 border-t dark:border-gray-700">
                        <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
                            <Save className="w-5 h-5 mr-2 inline" /> Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

// Site Settings Section
const SiteSettings = ({ onUpdateOfferClick, currentOfferText, cardBaseClasses }) => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
        <div className={`p-6 rounded-2xl shadow-lg ${cardBaseClasses}`}>
            <h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Promotional Offer Bar</h3>
            <div className="p-4 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 border dark:border-gray-600">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Display Text:</p>
                <p className="font-semibold">{currentOfferText}</p>
            </div>
            <button onClick={onUpdateOfferClick} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Update Offer Text
            </button>
        </div>
    </motion.div>
);

// Dashboard Sub-Component
const Dashboard = ({ products, orders, users, setActiveSection, userRole }) => {
    const canViewFinance = userRole === 'admin' || userRole === 'finance_manager';
    const financeCards = [
        { title: "Total Revenue", value: `₹52,100`, icon: DollarSign, colorClass: "bg-gradient-to-r from-pink-500 to-purple-600 text-white", linkLabel: "View Sales", section: 'finance' },
        { title: "Net Profit", value: `₹18,500`, icon: TrendingUp, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Reports", section: 'finance' },
        { title: "Avg. Daily Traffic", value: `8,900`, icon: BarChart2, colorClass: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white", linkLabel: "Google Analytics", section: 'dashboard' },
        { title: "Pending Tickets", value: 14, icon: X, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Resolve Tickets", section: 'dashboard' },
    ];
    const operationalCards = [
        { title: "Total Orders", value: orders.length, icon: ShoppingBag, colorClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white", linkLabel: "Manage Orders", section: 'orders' },
        { title: "Total Sells (Units)", value: `1,250`, icon: Package, colorClass: "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white", linkLabel: "View Products", section: 'products' },
        { title: "Stock Alerts", value: products.filter(p => p.stock <= 10).length, icon: Package, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Fix Inventory", section: 'products' },
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
                {renderedCards.map((card, index) => <DashboardCard key={index} {...card} onClick={() => setActiveSection(card.section)} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {(userRole === 'admin' || userRole === 'product_manager') && (
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-orange-500 dark:text-orange-400">Low Stock Items</h3>
                        <ul className="space-y-2">
                            {products.filter(p => p.stock <= 10).map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <span>{p.name}</span>
                                    <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>Stock: {p.stock}</span>
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

// Product Management Modal Component
const ProductFormModal = ({ onClose, isDarkMode, product, onSave }) => {
    const isEditing = !!product;
    const [formData, setFormData] = useState(product ? { ...product, originalPrice: product.originalPrice || product.price, discountedPrice: product.discountedPrice || product.price, images: product.images || [], newImageColor: '', newImageUrl: '' } : { id: Date.now().toString(), name: '', price: 0, stock: 0, category: 'Tops', description: '', images: [], newImageColor: '', newImageUrl: '', discountedPrice: 0, originalPrice: 0, discount: 0, rating: 4.5, reviews: 0, colors: [], sizes: ['S', 'M'] });
    const AVAILABLE_COLORS = useMemo(() => [{ name: 'Pink', class: 'bg-pink-500', value: 'pink' }, { name: 'Blue', class: 'bg-blue-500', value: 'blue' }, { name: 'Red', class: 'bg-red-500', value: 'red' }, { name: 'Green', class: 'bg-green-500', value: 'green' }, { name: 'Yellow', class: 'bg-yellow-500', value: 'yellow' }, { name: 'Purple', class: 'bg-purple-500', value: 'purple' }, { name: 'White', class: 'bg-white border border-gray-400', value: 'white' }, { name: 'Black', class: 'bg-black', value: 'black' }], []);
    const calculateDiscount = useCallback((original, discounted) => (Number(original) > Number(discounted) && Number(original) > 0) ? Math.floor(((Number(original) - Number(discounted)) / Number(original)) * 100) : 0, []);

    useEffect(() => {
        const discountValue = calculateDiscount(formData.originalPrice, formData.discountedPrice);
        if (discountValue !== formData.discount) setFormData(p => ({ ...p, discount: discountValue }));
    }, [formData.originalPrice, formData.discountedPrice, formData.discount, calculateDiscount]);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
    const handleColorSelect = (colorValue) => setFormData(p => ({ ...p, newImageColor: colorValue }));
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(p => ({ ...p, newImageUrl: reader.result }));
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setFormData(p => ({ ...p, newImageUrl: '' }));
        }
    };
    const handleImageAdd = () => {
        if (formData.newImageUrl && formData.newImageColor) {
            if (formData.images.some(img => img.color === formData.newImageColor)) {
                alert(`Image for color "${formData.newImageColor.toUpperCase()}" already added. Delete it first to replace.`);
                return;
            }
            setFormData(p => ({ ...p, images: [...p.images, { color: p.newImageColor, url: p.newImageUrl }], newImageColor: '', newImageUrl: '', colors: [...new Set([...p.colors, p.newImageColor])] }));
        } else {
            alert('Please select a color and upload an Image.');
        }
    };
    const handleImageRemove = (index) => {
        setFormData(p => {
            const newImages = p.images.filter((_, i) => i !== index);
            return { ...p, images: newImages, colors: [...new Set(newImages.map(img => img.color))] };
        });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, price: formData.discountedPrice }); onClose(); };

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]" onClick={onClose} />
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg lg:max-w-4xl p-4 sm:p-8 rounded-3xl shadow-2xl z-[1001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
                    <h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block font-semibold">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} required />
                        <label className="block font-semibold">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} rows="4" required />
                        <label className="block font-semibold">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} required>
                            {['Tops', 'Shirts', 'Cord Sets', 'Dresses', 'Culotte', 'Accessories'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Original Price (₹)</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
                            </div>
                            <div>
                                <label className="block font-semibold">Discounted Price (₹)</label>
                                <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-green-500 dark:text-green-400`} readOnly />
                            </div>
                            <div>
                                <label className="block font-semibold">Stock Quantity</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="block font-semibold">1. Select Color & Add Photo ({formData.images.length})</label>
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg border dark:border-gray-700">
                            {AVAILABLE_COLORS.map(color => (
                                <motion.button key={color.value} type="button" onClick={() => handleColorSelect(color.value)} className={`w-8 h-8 rounded-full shadow-md transition-all duration-150 ${color.class} ${formData.newImageColor === color.value ? 'ring-4 ring-offset-2 ring-pink-500 dark:ring-offset-gray-800' : 'hover:scale-110'}`} aria-label={`Select color ${color.name}`} title={color.name} />
                            ))}
                        </div>
                        <label className="block font-semibold">2. Upload Image File</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-grow`} />
                        {formData.newImageUrl && formData.newImageColor && (
                            <div className="flex items-center gap-2 p-2 border rounded-lg dark:border-gray-700">
                                <img src={formData.newImageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                                <span className="text-sm">Ready to add: **{formData.newImageColor.toUpperCase()}**</span>
                            </div>
                        )}
                        <button type="button" onClick={handleImageAdd} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center"><Plus className="w-5 h-5 mr-2" /> Add Photo to Product</button>
                        <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-700">
                            {formData.images.map((img, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /><span className="text-sm font-medium">{img.color.toUpperCase()}</span></div>
                                    <button type="button" onClick={() => handleImageRemove(index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Colors: {formData.colors.length > 0 ? formData.colors.join(', ') : 'None'}</p>
                    </div>
                    <div className="col-span-1 lg:col-span-2 pt-4 border-t dark:border-gray-700">
                        <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors"><Save className="w-5 h-5 mr-2 inline" /> {isEditing ? 'Save Changes' : 'Create Product'}</button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

// Product Management Section
const ProductManagement = ({ products, setProducts, isDarkMode, cardBaseClasses, userRole }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const canEditProducts = userRole === 'admin' || userRole === 'product_manager';

    const handleAction = (action, product) => {
        if (!canEditProducts) return alert('Permission denied.');
        if (action === 'Add') { setProductToEdit(null); setIsModalOpen(true); } 
        else if (action === 'Edit') { setProductToEdit(product); setIsModalOpen(true); } 
        else if (action === 'Delete') { setProducts(products.filter(p => p.id !== product.id)); }
    };
    const handleProductSave = (formData) => {
        const savedData = { ...formData, price: Number(formData.discountedPrice), status: formData.stock > 0 ? (formData.stock <= 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock' };
        if (productToEdit) { setProducts(products.map(p => p.id === savedData.id ? savedData : p)); } 
        else { setProducts(prev => [...prev, savedData]); }
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <AnimatePresence>{isModalOpen && <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} product={productToEdit} onSave={handleProductSave} />}</AnimatePresence>
            <div className="flex space-x-4 border-b border-gray-700/50">
                <button onClick={() => setActiveTab('products')} className={`pb-2 font-semibold transition-colors ${activeTab === 'products' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>Product Inventory</button>
                {(userRole === 'admin' || userRole === 'product_manager') && <button onClick={() => setActiveTab('coupons')} className={`pb-2 font-semibold transition-colors ${activeTab === 'coupons' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>Coupon Management</button>}
            </div>
            {activeTab === 'products' && (
                <div className="space-y-6">
                    {canEditProducts && <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors" onClick={() => handleAction('Add', null)}>+ Add New Product</button>}
                    <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th><th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th></tr></thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{p.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">₹{p.discountedPrice.toFixed(2)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>{p.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{p.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {canEditProducts && (<><button onClick={() => handleAction('Edit', p)} className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleAction('Delete', p)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Trash2 className="w-4 h-4" /></button></>)}
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

// Order Detail Modal
const OrderDetailModal = ({ order, isDarkMode, onClose }) => (
    <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg lg:max-w-4xl p-4 sm:p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
                <h3 className="text-2xl sm:text-3xl font-bold text-pink-500">Order #{order.id} Details</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 rounded-xl dark:bg-gray-700/50 bg-gray-50 shadow-inner">
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-purple-500"><Users className="w-5 h-5" /> Customer Info</h4>
                    <p className="flex items-center gap-2"><span className="font-semibold w-20">Name:</span> {order.customer}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 mr-1 text-cyan-400" /> {order.phone}</p>
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 mr-1 text-cyan-400" /> {order.email}</p>
                    <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mr-1 mt-1 text-cyan-400 flex-shrink-0" /><span className="font-semibold w-20 flex-shrink-0">Address:</span> {order.address}</p>
                    <p className="flex items-center gap-2"><span className="font-semibold w-20">Payment:</span> {order.payment}</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-pink-500"><ShoppingBag className="w-5 h-5" /> Items ({order.items.length})</h4>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {order.items.map((item, index) => <li key={index} className="flex justify-between p-2 rounded-md dark:bg-gray-700 bg-gray-100 text-sm"><span>{item.name} x {item.qty}</span><span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span></li>)}
                    </ul>
                    <div className="pt-2 border-t dark:border-gray-700"><p className="text-lg font-bold flex justify-between">Total: <span className="text-pink-500">₹{order.total.toFixed(2)}</span></p></div>
                </div>
            </div>
        </motion.div>
    </>
);

// Order Management Section
const OrderManagement = ({ orders, setOrders, setRefundQueue, isDarkMode, cardBaseClasses, userRole }) => {
    const canManageOrders = userRole === 'admin' || userRole === 'product_manager';
    const [selectedOrder, setSelectedOrder] = useState(null);
    const handleStatusUpdate = (orderId, newStatus) => setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    const handleRefundRequest = (order) => {
        const refundReason = prompt(`Reason for refund/return request for Order ${order.id}?`);
        if (refundReason) {
            setRefundQueue(prev => [...prev, { id: 'R' + Date.now(), orderId: order.id, customer: order.customer, amount: order.total, reason: refundReason, requestedBy: 'Order Manager', status: 'Pending Finance' }]);
            alert(`Refund request for Order ${order.id} sent to Finance Manager.`);
        }
    };
    const getStatusBadge = (status) => {
        const classes = "px-2 py-0.5 rounded-full text-xs font-semibold";
        if (status === 'Delivered') return <span className={`bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ${classes}`}>{status}</span>;
        if (status === 'Shipped') return <span className={`bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ${classes}`}>{status}</span>;
        if (status === 'Pending') return <span className={`bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ${classes}`}>{status}</span>;
        return <span className={`bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${classes}`}>{status}</span>;
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <AnimatePresence>{selectedOrder && <OrderDetailModal order={selectedOrder} isDarkMode={isDarkMode} onClose={() => setSelectedOrder(null)} />}</AnimatePresence>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order List</h3>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>{canManageOrders && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Tracking/Returns</th>}</tr></thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400 cursor-pointer hover:underline" onClick={() => setSelectedOrder(o)}>{o.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{o.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{o.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(o.status)}</td>
                                {canManageOrders && (<td className="px-6 py-4 whitespace-nowrap text-right text-sm"><select value={o.status} onChange={(e) => handleStatusUpdate(o.id, e.target.value)} className="p-1 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm">{['Pending', 'Shipped', 'Delivered', 'Return Requested', 'Canceled'].map(s => <option key={s} value={s}>{s}</option>)}</select>{(o.status === 'Delivered' || o.status === 'Return Requested') && <button onClick={() => handleRefundRequest(o)} className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">Refund</button>}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// --- Finance Management Section ---
const FinanceManagement = ({ isDarkMode, cardBaseClasses, userRole, refundQueue, setRefundQueue }) => {
    const canValidateCoupons = userRole === 'admin';
    const handleRefundDecision = (requestId, decision) => setRefundQueue(prev => prev.filter(r => r.id !== requestId));
    const PAYMENT_DATA = [{ label: 'Today', orders: 5, total: 5400, discount: 150 }, { label: 'This Week', orders: 25, total: 18200, discount: 900 }, { label: 'This Month', orders: 125, total: 52100, discount: 5000 }];

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h3>
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-purple-500">Total Payments Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-cyan-500">Daily Sales and Payments</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th><th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Orders</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Revenue</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Discount</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Net Payment</th></tr></thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {MOCK_DAILY_SALES.map((d) => (<tr key={d.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{d.date}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-center">{d.orders}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-green-500 text-right">₹{d.revenue.toFixed(2)}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-red-500 text-right">₹{d.discounts.toFixed(2)}</td><td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-right">₹{d.net.toFixed(2)}</td></tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
                <h4 className="text-xl font-bold mb-4 text-red-500">Refund Validation Queue</h4>
                {refundQueue.length === 0 ? <p className="text-gray-500">No refunds pending validation.</p> : (
                    <ul className="space-y-3">
                        {refundQueue.map(refund => (
                            <li key={refund.id} className="flex justify-between flex-wrap items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-700">
                                <div className='mb-2 sm:mb-0'><p className="font-semibold text-lg text-red-600">Order {refund.orderId}</p><p className="text-xs text-gray-700 dark:text-gray-300">Amount: ₹{refund.amount.toFixed(2)} | Reason: {refund.reason}</p></div>
                                <div className="space-x-2"><button onClick={() => handleRefundDecision(refund.id, 'Approved')} className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button><button onClick={() => handleRefundDecision(refund.id, 'Declined')} className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">Decline</button></div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {canValidateCoupons && <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}><h4 className="text-xl font-bold mb-4 text-pink-500">Coupon Validation Queue (Admin Only)</h4><p className="text-sm text-gray-500">Coupons are approved by Admin or Finance Manager.</p></div>}
        </motion.div>
    );
};

// Coupon Form Modal
const CouponFormModal = ({ onClose, onSave, isDarkMode }) => {
    const [formData, setFormData] = useState({ code: '', discount: 10, usageLimit: 100, minOrderValue: 0 });
    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value.toUpperCase().replace(/\s/g, '') }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.discount > 99 || !formData.code) { alert("Coupon code and discount (max 99%) are required."); return; }
        onSave(formData);
        onClose();
    };
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg p-4 sm:p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700"><h3 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>Request New Coupon</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="font-semibold mb-1 flex items-center"><Tag className='w-4 h-4 mr-2 text-pink-500' /> Coupon Code</label><input type="text" name="code" value={formData.code} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} placeholder="SUMMER20" required maxLength={15} /></div>
                    <div className="grid grid-cols-2 gap-4"><div><label className="block font-semibold mb-1">Discount (%)</label><input type="number" name="discount" value={formData.discount} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="1" max="99" required /></div><div><label className="block font-semibold mb-1">Usage Limit</label><input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="1" required /></div></div>
                    <div><label className="block font-semibold mb-1">Min. Order Value (₹)</label><input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" /></div>
                    <div className="pt-4 border-t dark:border-gray-700"><button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"><Tag className="w-5 h-5 mr-2 inline" /> Submit for Approval</button></div>
                </form>
            </motion.div>
        </>
    );
};

// Coupon Management Section
const CouponManagement = ({ isDarkMode, cardBaseClasses, userRole }) => {
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [myCoupons, setMyCoupons] = useState([{ id: 10, code: 'WELCOME10', discount: 10, status: 'Active (Approved)', uses: 50 }, { id: 11, code: 'SPRING20', discount: 20, status: 'Pending Approval', uses: 0 }]);
    const handleCouponRequestSave = (formData) => setMyCoupons(prev => [...prev, { id: Date.now(), ...formData, status: 'Pending Finance Approval', uses: 0 }]);

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <AnimatePresence>{isCouponModalOpen && <CouponFormModal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} onSave={handleCouponRequestSave} isDarkMode={isDarkMode} />}</AnimatePresence>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Coupon Requests</h3>
            {(userRole === 'admin' || userRole === 'product_manager') && <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors" onClick={() => setIsCouponModalOpen(true)}>+ Request New Coupon</button>}
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uses</th></tr></thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {myCoupons.map((c) => (<tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400">{c.code}</td><td className="px-6 py-4 whitespace-nowrap text-sm">{c.discount}%</td><td className={`px-6 py-4 whitespace-nowrap text-sm ${c.status.includes('Approved') ? 'text-green-500 font-bold' : 'text-orange-500'}`}>{c.status}</td><td className="px-6 py-4 whitespace-nowrap text-sm">{c.uses}</td></tr>))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// User Management Section
const UserManagement = ({ users, isDarkMode, cardBaseClasses }) => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer List</h3>
        <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Orders</th><th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((u) => (<tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-500">{u.orders}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm"><button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-medium">View Details</button></td></tr>))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

// Main Admin Page Component
const AdminPage = ({ isDarkMode, onViewChange, userRole, products: initialProducts, setProducts: setAppProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const [refundQueue, setRefundQueue] = useState(MOCK_REFUND_QUEUE);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [currentOfferText, setOfferText] = useState("🎉 Summer Sale! Get 25% Off On All T-Shirts!");

    // Sync local product state with app-level product state
    useEffect(() => { setAppProducts(products) }, [products, setAppProducts]);

    const initialSection = useMemo(() => {
        const role = userRole?.role_name?.toLowerCase();
        if (role === 'product_manager') return 'products';
        if (role === 'finance_manager') return 'finance';
        return 'dashboard';
    }, [userRole]);
    const [activeSection, setActiveSection] = useState(initialSection);

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        setIsSidebarOpen(false);
    };

    const allNavItems = useMemo(() => [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, roles: ['admin'] },
        { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'product_manager'] },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, roles: ['admin', 'product_manager', 'finance_manager'] },
        { id: 'finance', label: 'Finance', icon: DollarSign, roles: ['admin', 'finance_manager'] },
        { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
        { id: 'settings', label: 'Settings', icon: Zap, roles: ['admin'] },
    ], []);

    const filteredNavItems = useMemo(() => {
        const role = userRole?.role_name?.toLowerCase();
        if (!role) return [];
        return allNavItems.filter(item => item.roles.includes(role));
    }, [userRole, allNavItems]);

    useEffect(() => {
        const role = userRole?.role_name?.toLowerCase();
        if (activeSection === 'dashboard' && role !== 'admin') {
            setActiveSection(filteredNavItems[0]?.id || 'products');
        }
    }, [userRole, activeSection, filteredNavItems]);

    const renderSection = () => {
        const roleString = userRole?.role_name?.toLowerCase();
        switch (activeSection) {
            case 'products': return <ProductManagement products={products} setProducts={setProducts} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
            case 'orders': return <OrderManagement orders={MOCK_ORDERS} setOrders={()=>{}} setRefundQueue={setRefundQueue} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
            case 'users': return <UserManagement users={MOCK_USERS} setUsers={()=>{}} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
            case 'finance': return <FinanceManagement isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} refundQueue={refundQueue} setRefundQueue={setRefundQueue} />;
            case 'settings': return <SiteSettings isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} onUpdateOfferClick={() => setIsOfferModalOpen(true)} currentOfferText={currentOfferText} />;
            default: return <Dashboard products={products} orders={MOCK_ORDERS} users={MOCK_USERS} setActiveSection={setActiveSection} isDarkMode={isDarkMode} userRole={roleString} />;
        }
    };

    return (
        <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <AnimatePresence>{isOfferModalOpen && <OfferBarModal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} onSave={setOfferText} currentOfferText={currentOfferText} isDarkMode={isDarkMode} />}</AnimatePresence>
            <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}</AnimatePresence>
            
            {/* Sidebar */}
            <div className="flex">
                 {/* Mobile Sidebar */}
                <motion.div initial={false} animate={isSidebarOpen ? { x: 0 } : { x: '-100%' }} transition={{ ease: "easeInOut" }} className={`fixed top-0 left-0 h-full w-64 p-6 flex-col z-30 lg:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                    <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
                    <nav className="space-y-2 flex-grow">
                        {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : 'hover:bg-gray-700/50 hover:text-white'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
                    </nav>
                </motion.div>
                {/* Desktop Sidebar */}
                <div className={`w-64 p-6 flex-col h-screen z-10 hidden lg:flex fixed top-0 left-0 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
                    <nav className="space-y-2 flex-grow">
                        {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
                    </nav>
                     <div className="pt-6 border-t border-gray-700/50">
                        <button onClick={() => { if(window.confirm("Are you sure you want to exit?")) onViewChange('home')}} className={`w-full text-left flex items-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors`}><X className="w-5 h-5 mr-3" />Exit Admin</button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-4 sm:p-8 lg:ml-64 flex-1 overflow-y-auto">
                <header className="flex justify-between items-center pb-6 mb-8 border-b border-gray-700/50">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-full -ml-2"><Menu className="w-6 h-6 text-pink-500" /></button>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold capitalize ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>{activeSection.replace('_', ' ')}</h2>
                    <p className="hidden sm:block text-sm">Logged in as: <span className="font-semibold capitalize">{userRole?.role_name}</span></p>
                </header>
                {renderSection()}
            </main>
        </div>
    );
};


// Dummy App component to render the AdminPage for preview
export default function App() {
    // Simulate a logged-in admin user for preview
    const mockUserRole = {
        role_name: 'admin',
        first_name: 'Vikas',
        last_name: 'Admin'
    };

    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for preview

    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <AdminPage
            isDarkMode={isDarkMode}
            onViewChange={(view) => console.log("Changing view to:", view)}
            userRole={mockUserRole}
            products={products}
            setProducts={setProducts}
            currentOfferText={"🎉 Summer Sale! Get 25% Off On All T-Shirts!"}
            setOfferText={(text) => console.log("New offer text:", text)}
        />
      </div>
    );
}
