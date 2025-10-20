// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingBag, Users, Package, TrendingUp, X, ChevronRight, Edit3, Trash2, DollarSign, BarChart2, Zap, CornerDownRight, Plus, MapPin, Phone, Mail, Save, Tag, Image as ImageIcon, Menu } from 'lucide-react';

// // --- API INTEGRATION: Define the base URL for your backend API ---
// const API_BASE_URL = 'http://localhost:8000/api/v1';

// // NOTE: All mock data except products is kept for preview purposes.
// // Product data will now be fetched from your backend.

// const MOCK_ORDERS = [
//     { id: 'O1001', customer: 'Jane Doe', email: 'jane@example.com', phone: '555-1234', address: '123 Main St, Bubble City', total: 1199, status: 'Shipped', date: '2025-10-01', payment: 'Credit Card', items: [{ name: 'Unicorn Dress', qty: 1, price: 1199 }] },
//     { id: 'O1002', customer: 'John Smith', email: 'john@example.com', phone: '555-5678', address: '456 Oak Ave, Sparkle Town', total: 2538, status: 'Pending', date: '2025-10-03', payment: 'PayPal', items: [{ name: 'Dino Set', qty: 2, price: 999 }, { name: 'Sneakers', qty: 1, price: 540 }] },
//     { id: 'O1003', customer: 'User X', email: 'userx@example.com', phone: '555-9012', address: '789 Pine Ln, Cloud Land', total: 639, status: 'Delivered', date: '2025-09-28', payment: 'COD', items: [{ name: 'Baby Onesie', qty: 1, price: 639 }] },
// ];

// const MOCK_USERS = [
//     { id: 'U1', name: 'Jane Doe', email: 'jane@example.com', orders: 3 },
//     { id: 'U2', name: 'John Smith', email: 'john@example.com', orders: 5 },
// ];

// // API INTEGRATION: MOCK_PRODUCTS is no longer needed as we will fetch from the API.
// // const MOCK_PRODUCTS = [ ... ];

// const MOCK_REFUND_QUEUE = [
//     { id: 'R1', orderId: 'O1003', customer: 'User X', amount: 639, reason: 'Wrong size ordered.', requestedBy: 'Order Manager', status: 'Pending Finance' },
// ];

// const MOCK_DAILY_SALES = [
//     { date: '2025-10-04', orders: 5, revenue: 5400, net: 5250, discounts: 150 },
//     { date: '2025-10-03', orders: 12, revenue: 8900, net: 8400, discounts: 500 },
//     { date: '2025-10-02', orders: 8, revenue: 7500, net: 7100, discounts: 400 },
//     { date: '2025-10-01', orders: 10, revenue: 6400, net: 6000, discounts: 400 },
//     { date: '2025-09-30', orders: 15, revenue: 10500, net: 9800, discounts: 700 },
// ];

// // Reusable Dashboard Card Component
// const DashboardCard = ({ title, value, icon: Icon, colorClass, linkLabel, onClick }) => (
//     <motion.div
//         whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
//         className={`rounded-2xl p-6 shadow-xl transition-all duration-300 ${colorClass}`}
//     >
//         <div className="flex justify-between items-start">
//             <div>
//                 <p className="text-sm font-medium opacity-80">{title}</p>
//                 <h3 className="text-3xl font-extrabold mt-1">{value}</h3>
//             </div>
//             <div className="p-3 rounded-full bg-white/30">
//                 <Icon className="w-6 h-6 text-white" />
//             </div>
//         </div>
//         <button onClick={onClick} className="text-xs font-semibold mt-4 flex items-center opacity-90 hover:opacity-100">
//             {linkLabel} <ChevronRight className="w-4 h-4 ml-1" />
//         </button>
//     </motion.div>
// );

// // Offer Bar Update Modal
// const OfferBarModal = ({ onClose, onSave, currentOfferText, isDarkMode }) => {
//     const [text, setText] = useState(currentOfferText || '');

//     useEffect(() => {
//         setText(currentOfferText);
//     }, [currentOfferText]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSave(text);
//         onClose();
//     };

//     return (
//         <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
//             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                 className={`fixed inset-0 m-auto h-fit max-w-lg p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
//                 onClick={e => e.stopPropagation()}
//             >
//                 <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
//                     <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Update Offer Bar</h3>
//                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="font-semibold mb-2 block">Offer Text</label>
//                         <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={`w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} placeholder="e.g., 🎉 Mega Sale! Up to 50% OFF..." required />
//                     </div>
//                     <div className="pt-4 border-t dark:border-gray-700">
//                         <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors">
//                             <Save className="w-5 h-5 mr-2 inline" /> Save Changes
//                         </button>
//                     </div>
//                 </form>
//             </motion.div>
//         </>
//     );
// };

// // Site Settings Section
// const SiteSettings = ({ onUpdateOfferClick, currentOfferText, cardBaseClasses }) => (
//     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//         <div className={`p-6 rounded-2xl shadow-lg ${cardBaseClasses}`}>
//             <h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Promotional Offer Bar</h3>
//             <div className="p-4 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 border dark:border-gray-600">
//                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Display Text:</p>
//                 <p className="font-semibold">{currentOfferText}</p>
//             </div>
//             <button onClick={onUpdateOfferClick} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
//                 <Edit3 className="w-4 h-4" /> Update Offer Text
//             </button>
//         </div>
//     </motion.div>
// );

// Dashboard Sub-Component
// const Dashboard = ({ products, orders, users, setActiveSection, userRole }) => {
//     const canViewFinance = userRole === 'admin' || userRole === 'finance_manager';
//     // The products prop is now guaranteed to be an array, so .filter is safe to use.
//     const stockAlertsCount = useMemo(() => 
//         (Array.isArray(products) ? products : []).filter(p => p.stock <= 10).length, 
//         [products]
//     );
//     const lowStockItems = useMemo(() => 
//         (Array.isArray(products) ? products : []).filter(p => p.stock <= 10), 
//         [products]
//     );

//     const financeCards = [
//         { title: "Total Revenue", value: `₹52,100`, icon: DollarSign, colorClass: "bg-gradient-to-r from-pink-500 to-purple-600 text-white", linkLabel: "View Sales", section: 'finance' },
//         { title: "Net Profit", value: `₹18,500`, icon: TrendingUp, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Reports", section: 'finance' },
//         { title: "Avg. Daily Traffic", value: `8,900`, icon: BarChart2, colorClass: "bg-gradient-to-r from-indigo-500 to-blue-600 text-white", linkLabel: "Google Analytics", section: 'dashboard' },
//         { title: "Pending Tickets", value: 14, icon: X, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Resolve Tickets", section: 'dashboard' },
//     ];
//     const operationalCards = [
//         { title: "Total Orders", value: orders.length, icon: ShoppingBag, colorClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white", linkLabel: "Manage Orders", section: 'orders' },
//         { title: "Total Sells (Units)", value: `1,250`, icon: Package, colorClass: "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white", linkLabel: "View Products", section: 'products' },
//         { title: "Stock Alerts", value: stockAlertsCount, icon: Package, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Fix Inventory", section: 'products' },
//         { title: "Active Users", value: users.length, icon: Users, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Users", section: 'users' },
//     ];
//     const renderedCards = [...financeCards, ...operationalCards].filter(card => {
//         if (card.section === 'finance' && !canViewFinance) return false;
//         if (card.section === 'products' && userRole === 'finance_manager') return false;
//         if (card.section === 'users' && userRole !== 'admin') return false;
//         return true;
//     });

//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-10">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {renderedCards.map((card, index) => <DashboardCard key={index} {...card} onClick={() => setActiveSection(card.section)} />)}
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {(userRole === 'admin' || userRole === 'product_manager') && (
//                     <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
//                         <h3 className="text-xl font-bold mb-4 text-orange-500 dark:text-orange-400">Low Stock Items</h3>
//                         <ul className="space-y-2">
//                             {lowStockItems.map(p => (
//                                 <li key={p.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
//                                     <span>{p.name}</span>
//                                     <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>Stock: {p.stock}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//                 {(userRole === 'admin' || userRole === 'product_manager') && (
//                     <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
//                         <h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Recent Orders</h3>
//                         <ul className="space-y-2">
//                             {orders.slice(0, 3).map(o => (
//                                 <li key={o.id} className="flex justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
//                                     <span>Order {o.id} ({o.customer})</span>
//                                     <span className="font-semibold">{o.status}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </motion.div>
//     );
// };

// // Product Management Modal Component
// const ProductFormModal = ({ onClose, isDarkMode, product, onSave }) => {
//     const isEditing = !!product;
//     const [formData, setFormData] = useState(product ? { ...product, originalPrice: product.originalPrice || product.price, discountedPrice: product.discountedPrice || product.price, images: product.images || [], newImageColor: '', newImageUrl: '' } : { id: null, name: '', price: 0, stock: 0, category: 'Tops', description: '', images: [], newImageColor: '', newImageUrl: '', discountedPrice: 0, originalPrice: 0, discount: 0, rating: 4.5, reviews: 0, colors: [], sizes: ['S', 'M'] });
//     const AVAILABLE_COLORS = useMemo(() => [{ name: 'Pink', class: 'bg-pink-500', value: 'pink' }, { name: 'Blue', class: 'bg-blue-500', value: 'blue' }, { name: 'Red', class: 'bg-red-500', value: 'red' }, { name: 'Green', class: 'bg-green-500', value: 'green' }, { name: 'Yellow', class: 'bg-yellow-500', value: 'yellow' }, { name: 'Purple', class: 'bg-purple-500', value: 'purple' }, { name: 'White', class: 'bg-white border border-gray-400', value: 'white' }, { name: 'Black', class: 'bg-black', value: 'black' }], []);
//     const calculateDiscount = useCallback((original, discounted) => (Number(original) > Number(discounted) && Number(original) > 0) ? Math.floor(((Number(original) - Number(discounted)) / Number(original)) * 100) : 0, []);

//     useEffect(() => {
//         const discountValue = calculateDiscount(formData.originalPrice, formData.discountedPrice);
//         if (discountValue !== formData.discount) setFormData(p => ({ ...p, discount: discountValue }));
//     }, [formData.originalPrice, formData.discountedPrice, formData.discount, calculateDiscount]);

//     const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
//     const handleColorSelect = (colorValue) => setFormData(p => ({ ...p, newImageColor: colorValue }));
//     const handleFileChange = (e) => {
//         if (e.target.files[0]) {
//             const reader = new FileReader();
//             reader.onloadend = () => setFormData(p => ({ ...p, newImageUrl: reader.result }));
//             reader.readAsDataURL(e.target.files[0]);
//         } else {
//             setFormData(p => ({ ...p, newImageUrl: '' }));
//         }
//     };
//     const handleImageAdd = () => {
//         if (formData.newImageUrl && formData.newImageColor) {
//             if (formData.images.some(img => img.color === formData.newImageColor)) {
//                 alert(`Image for color "${formData.newImageColor.toUpperCase()}" already added. Delete it first to replace.`);
//                 return;
//             }
//             setFormData(p => ({ ...p, images: [...p.images, { color: p.newImageColor, url: p.newImageUrl }], newImageColor: '', newImageUrl: '', colors: [...new Set([...p.colors, p.newImageColor])] }));
//         } else {
//             alert('Please select a color and upload an Image.');
//         }
//     };
//     const handleImageRemove = (index) => {
//         setFormData(p => {
//             const newImages = p.images.filter((_, i) => i !== index);
//             return { ...p, images: newImages, colors: [...new Set(newImages.map(img => img.color))] };
//         });
//     };
//     const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, price: formData.discountedPrice }); onClose(); };

//     return (
//         <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]" onClick={onClose} />
//             <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                 className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg lg:max-w-4xl p-4 sm:p-8 rounded-3xl shadow-2xl z-[1001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
//                 onClick={e => e.stopPropagation()}>
//                 <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
//                     <h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
//                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                         <label className="block font-semibold">Name</label>
//                         <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} required />
//                         <label className="block font-semibold">Description</label>
//                         <textarea name="description" value={formData.description} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} rows="4" required />
//                         <label className="block font-semibold">Category</label>
//                         <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} required>
//                             {['Tops', 'Shirts', 'Cord Sets', 'Dresses', 'Culotte', 'Accessories'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                         </select>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block font-semibold">Original Price (₹)</label>
//                                 <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold">Discounted Price (₹)</label>
//                                 <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block font-semibold">Discount (%)</label>
//                                 <input type="number" name="discount" value={formData.discount} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold text-green-500 dark:text-green-400`} readOnly />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold">Stock Quantity</label>
//                                 <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" required />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="space-y-4">
//                         <label className="block font-semibold">1. Select Color & Add Photo ({formData.images.length})</label>
//                         <div className="flex flex-wrap gap-2 p-3 rounded-lg border dark:border-gray-700">
//                             {AVAILABLE_COLORS.map(color => (
//                                 <motion.button key={color.value} type="button" onClick={() => handleColorSelect(color.value)} className={`w-8 h-8 rounded-full shadow-md transition-all duration-150 ${color.class} ${formData.newImageColor === color.value ? 'ring-4 ring-offset-2 ring-pink-500 dark:ring-offset-gray-800' : 'hover:scale-110'}`} aria-label={`Select color ${color.name}`} title={color.name} />
//                             ))}
//                         </div>
//                         <label className="block font-semibold">2. Upload Image File</label>
//                         <input type="file" accept="image/*" onChange={handleFileChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-grow`} />
//                         {formData.newImageUrl && formData.newImageColor && (
//                             <div className="flex items-center gap-2 p-2 border rounded-lg dark:border-gray-700">
//                                 <img src={formData.newImageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
//                                 <span className="text-sm">Ready to add: **{formData.newImageColor.toUpperCase()}**</span>
//                             </div>
//                         )}
//                         <button type="button" onClick={handleImageAdd} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center"><Plus className="w-5 h-5 mr-2" /> Add Photo to Product</button>
//                         <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-700">
//                             {formData.images.map((img, index) => (
//                                 <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
//                                     <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /><span className="text-sm font-medium">{img.color.toUpperCase()}</span></div>
//                                     <button type="button" onClick={() => handleImageRemove(index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
//                                 </div>
//                             ))}
//                         </div>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">Current Colors: {formData.colors.length > 0 ? formData.colors.join(', ') : 'None'}</p>
//                     </div>
//                     <div className="col-span-1 lg:col-span-2 pt-4 border-t dark:border-gray-700">
//                         <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors"><Save className="w-5 h-5 mr-2 inline" /> {isEditing ? 'Save Changes' : 'Create Product'}</button>
//                     </div>
//                 </form>
//             </motion.div>
//         </>
//     );
// };

// // Product Management Section
// const ProductManagement = ({ products, setProducts, isDarkMode, cardBaseClasses, userRole }) => {
//     const [activeTab, setActiveTab] = useState('products');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [productToEdit, setProductToEdit] = useState(null);
//     const canEditProducts = userRole === 'admin' || userRole === 'product_manager';

//     const handleAction = async (action, product) => {
//         if (!canEditProducts) return alert('Permission denied.');
        
//         if (action === 'Add') {
//             setProductToEdit(null);
//             setIsModalOpen(true);
//         } else if (action === 'Edit') {
//             setProductToEdit(product);
//             setIsModalOpen(true);
//         } else if (action === 'Delete') {
//             // --- API INTEGRATION: Delete a product ---
//             if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//                 try {
//                     const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
//                         method: 'DELETE',
//                     });

//                     if (!response.ok) {
//                         throw new Error('Failed to delete product.');
//                     }
                    
//                     // Update state after successful deletion
//                     setProducts(products.filter(p => p.id !== product.id));
//                     alert('Product deleted successfully!');

//                 } catch (error) {
//                     console.error('Error deleting product:', error);
//                     alert('Error: Could not delete product.');
//                 }
//             }
//         }
//     };

    

//     const handleProductSave = async (formData) => {
//         const isEditing = !!productToEdit;
//         const savedData = { ...formData, price: Number(formData.discountedPrice) };

//         if (isEditing) {
//             // --- API INTEGRATION: Update an existing product ---
//             try {
//                 const response = await fetch(`${API_BASE_URL}/products/${savedData.id}`, {
//                     method: 'PATCH',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(savedData),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to update product.');
//                 }

//                 const updatedProduct = await response.json();
//                 setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
//                 alert('Product updated successfully!');

//             } catch (error) {
//                 console.error('Error updating product:', error);
//                 alert('Error: Could not update product.');
//             }
//         } else {
//             // --- API INTEGRATION: Add a new product ---
//             try {
//                 // Remove null ID before sending to backend
//                 const { id, ...newProductData } = savedData; 

//                 const response = await fetch(`${API_BASE_URL}/products`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(newProductData),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to create product.');
//                 }
                
//                 const createdProduct = await response.json();
//                 setProducts(prev => [...prev, createdProduct]);
//                 alert('Product created successfully!');

//             } catch (error) {
//                 console.error('Error creating product:', error);
//                 alert('Error: Could not create product.');
//             }
//         }
//     };

//     return (
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//             <AnimatePresence>{isModalOpen && <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} product={productToEdit} onSave={handleProductSave} />}</AnimatePresence>
//             <div className="flex space-x-4 border-b border-gray-700/50">
//                 <button onClick={() => setActiveTab('products')} className={`pb-2 font-semibold transition-colors ${activeTab === 'products' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>Product Inventory</button>
//                 {(userRole === 'admin' || userRole === 'product_manager') && <button onClick={() => setActiveTab('coupons')} className={`pb-2 font-semibold transition-colors ${activeTab === 'coupons' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white dark:hover:text-gray-200'}`}>Coupon Management</button>}
//             </div>
//             {activeTab === 'products' && (
//                 <div className="space-y-6">
//                     {canEditProducts && <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors" onClick={() => handleAction('Add', null)}>+ Add New Product</button>}
//                     <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
//                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                             <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th><th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th></tr></thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                 {products.map((p) => (
//                                     <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{p.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm">₹{p.discountedPrice.toFixed(2)}</td>
//                                         <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>{p.stock}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm">{p.category}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                                             {canEditProducts && (<><button onClick={() => handleAction('Edit', p)} className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleAction('Delete', p)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Trash2 className="w-4 h-4" /></button></>)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//             {activeTab === 'coupons' && (userRole === 'admin' || userRole === 'product_manager') && <CouponManagement isDarkMode={isDarkMode} cardBaseClasses={cardBaseClasses} userRole={userRole} />}
//         </motion.div>
//     );
// };

// // Order Detail Modal
// const OrderDetailModal = ({ order, isDarkMode, onClose }) => (
//     <>
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
//         <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg lg:max-w-4xl p-4 sm:p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
//             <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
//                 <h3 className="text-2xl sm:text-3xl font-bold text-pink-500">Order #{order.id} Details</h3>
//                 <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="space-y-4 p-4 rounded-xl dark:bg-gray-700/50 bg-gray-50 shadow-inner">
//                     <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-purple-500"><Users className="w-5 h-5" /> Customer Info</h4>
//                     <p className="flex items-center gap-2"><span className="font-semibold w-20">Name:</span> {order.customer}</p>
//                     <p className="flex items-center gap-2"><Phone className="w-4 h-4 mr-1 text-cyan-400" /> {order.phone}</p>
//                     <p className="flex items-center gap-2"><Mail className="w-4 h-4 mr-1 text-cyan-400" /> {order.email}</p>
//                     <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mr-1 mt-1 text-cyan-400 flex-shrink-0" /><span className="font-semibold w-20 flex-shrink-0">Address:</span> {order.address}</p>
//                     <p className="flex items-center gap-2"><span className="font-semibold w-20">Payment:</span> {order.payment}</p>
//                 </div>
//                 <div className="space-y-4">
//                     <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-pink-500"><ShoppingBag className="w-5 h-5" /> Items ({order.items.length})</h4>
//                     <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
//                         {order.items.map((item, index) => <li key={index} className="flex justify-between p-2 rounded-md dark:bg-gray-700 bg-gray-100 text-sm"><span>{item.name} x {item.qty}</span><span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span></li>)}
//                     </ul>
//                     <div className="pt-2 border-t dark:border-gray-700"><p className="text-lg font-bold flex justify-between">Total: <span className="text-pink-500">₹{order.total.toFixed(2)}</span></p></div>
//                 </div>
//             </div>
//         </motion.div>
//     </>
// );

// // Order Management Section
// const OrderManagement = ({ orders, setOrders, setRefundQueue, isDarkMode, cardBaseClasses, userRole }) => {
//     const canManageOrders = userRole === 'admin' || userRole === 'product_manager';
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const handleStatusUpdate = (orderId, newStatus) => setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
//     const handleRefundRequest = (order) => {
//         const refundReason = prompt(`Reason for refund/return request for Order ${order.id}?`);
//         if (refundReason) {
//             setRefundQueue(prev => [...prev, { id: 'R' + Date.now(), orderId: order.id, customer: order.customer, amount: order.total, reason: refundReason, requestedBy: 'Order Manager', status: 'Pending Finance' }]);
//             alert(`Refund request for Order ${order.id} sent to Finance Manager.`);
//         }
//     };
//     const getStatusBadge = (status) => {
//         const classes = "px-2 py-0.5 rounded-full text-xs font-semibold";
//         if (status === 'Delivered') return <span className={`bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ${classes}`}>{status}</span>;
//         if (status === 'Shipped') return <span className={`bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ${classes}`}>{status}</span>;
//         if (status === 'Pending') return <span className={`bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ${classes}`}>{status}</span>;
//         return <span className={`bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${classes}`}>{status}</span>;
//     };

//     return (
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//             <AnimatePresence>{selectedOrder && <OrderDetailModal order={selectedOrder} isDarkMode={isDarkMode} onClose={() => setSelectedOrder(null)} />}</AnimatePresence>
//             <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order List</h3>
//             <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>{canManageOrders && <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Tracking/Returns</th>}</tr></thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {orders.map((o) => (
//                             <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400 cursor-pointer hover:underline" onClick={() => setSelectedOrder(o)}>{o.id}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm">{o.customer}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm">₹{o.total.toFixed(2)}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(o.status)}</td>
//                                 {canManageOrders && (<td className="px-6 py-4 whitespace-nowrap text-right text-sm"><select value={o.status} onChange={(e) => handleStatusUpdate(o.id, e.target.value)} className="p-1 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm">{['Pending', 'Shipped', 'Delivered', 'Return Requested', 'Canceled'].map(s => <option key={s} value={s}>{s}</option>)}</select>{(o.status === 'Delivered' || o.status === 'Return Requested') && <button onClick={() => handleRefundRequest(o)} className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">Refund</button>}</td>)}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </motion.div>
//     );
// };

// // --- Finance Management Section ---
// const FinanceManagement = ({ isDarkMode, cardBaseClasses, userRole, refundQueue, setRefundQueue }) => {
//     const canValidateCoupons = userRole === 'admin';
//     const handleRefundDecision = (requestId, decision) => setRefundQueue(prev => prev.filter(r => r.id !== requestId));
//     const PAYMENT_DATA = [{ label: 'Today', orders: 5, total: 5400, discount: 150 }, { label: 'This Week', orders: 25, total: 18200, discount: 900 }, { label: 'This Month', orders: 125, total: 52100, discount: 5000 }];

//     return (
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//             <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h3>
//             <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
//                 <h4 className="text-xl font-bold mb-4 text-purple-500">Total Payments Summary</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//                     {PAYMENT_DATA.map(data => (
//                         <div key={data.label} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
//                             <p className="text-sm font-medium text-pink-500">{data.label}</p>
//                             <p className="font-bold text-lg">{data.orders} Orders</p>
//                             <p className="text-sm">Total: <span className="font-semibold text-green-500">₹{data.total.toLocaleString()}</span></p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Discount: ₹{data.discount.toLocaleString()}</p>
//                             <p className="text-sm font-bold text-blue-500">Net: ₹{(data.total - data.discount).toLocaleString()}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
//                 <h4 className="text-xl font-bold mb-4 text-cyan-500">Daily Sales and Payments</h4>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                         <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th><th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Orders</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Revenue</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Discount</th><th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Net Payment</th></tr></thead>
//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {MOCK_DAILY_SALES.map((d) => (<tr key={d.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{d.date}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-center">{d.orders}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-green-500 text-right">₹{d.revenue.toFixed(2)}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-red-500 text-right">₹{d.discounts.toFixed(2)}</td><td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-right">₹{d.net.toFixed(2)}</td></tr>))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}>
//                 <h4 className="text-xl font-bold mb-4 text-red-500">Refund Validation Queue</h4>
//                 {refundQueue.length === 0 ? <p className="text-gray-500">No refunds pending validation.</p> : (
//                     <ul className="space-y-3">
//                         {refundQueue.map(refund => (
//                             <li key={refund.id} className="flex justify-between flex-wrap items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-700">
//                                 <div className='mb-2 sm:mb-0'><p className="font-semibold text-lg text-red-600">Order {refund.orderId}</p><p className="text-xs text-gray-700 dark:text-gray-300">Amount: ₹{refund.amount.toFixed(2)} | Reason: {refund.reason}</p></div>
//                                 <div className="space-x-2"><button onClick={() => handleRefundDecision(refund.id, 'Approved')} className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button><button onClick={() => handleRefundDecision(refund.id, 'Declined')} className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">Decline</button></div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//             {canValidateCoupons && <div className={`p-6 rounded-xl shadow-lg ${cardBaseClasses}`}><h4 className="text-xl font-bold mb-4 text-pink-500">Coupon Validation Queue (Admin Only)</h4><p className="text-sm text-gray-500">Coupons are approved by Admin or Finance Manager.</p></div>}
//         </motion.div>
//     );
// };

// // Coupon Form Modal
// const CouponFormModal = ({ onClose, onSave, isDarkMode }) => {
//     const [formData, setFormData] = useState({ code: '', discount: 10, usageLimit: 100, minOrderValue: 0 });
//     const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value.toUpperCase().replace(/\s/g, '') }));
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.discount > 99 || !formData.code) { alert("Coupon code and discount (max 99%) are required."); return; }
//         onSave(formData);
//         onClose();
//     };
//     return (
//         <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} />
//             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg p-4 sm:p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
//                 <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700"><h3 className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>Request New Coupon</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button></div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div><label className="font-semibold mb-1 flex items-center"><Tag className='w-4 h-4 mr-2 text-pink-500' /> Coupon Code</label><input type="text" name="code" value={formData.code} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} placeholder="SUMMER20" required maxLength={15} /></div>
//                     <div className="grid grid-cols-2 gap-4"><div><label className="block font-semibold mb-1">Discount (%)</label><input type="number" name="discount" value={formData.discount} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="1" max="99" required /></div><div><label className="block font-semibold mb-1">Usage Limit</label><input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="1" required /></div></div>
//                     <div><label className="block font-semibold mb-1">Min. Order Value (₹)</label><input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white`} min="0" /></div>
//                     <div className="pt-4 border-t dark:border-gray-700"><button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"><Tag className="w-5 h-5 mr-2 inline" /> Submit for Approval</button></div>
//                 </form>
//             </motion.div>
//         </>
//     );
// };

// // Coupon Management Section
// const CouponManagement = ({ isDarkMode, cardBaseClasses, userRole }) => {
//     const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
//     const [myCoupons, setMyCoupons] = useState([{ id: 10, code: 'WELCOME10', discount: 10, status: 'Active (Approved)', uses: 50 }, { id: 11, code: 'SPRING20', discount: 20, status: 'Pending Approval', uses: 0 }]);
//     const handleCouponRequestSave = (formData) => setMyCoupons(prev => [...prev, { id: Date.now(), ...formData, status: 'Pending Finance Approval', uses: 0 }]);

//     return (
//         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//             <AnimatePresence>{isCouponModalOpen && <CouponFormModal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} onSave={handleCouponRequestSave} isDarkMode={isDarkMode} />}</AnimatePresence>
//             <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Coupon Requests</h3>
//             {(userRole === 'admin' || userRole === 'product_manager') && <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors" onClick={() => setIsCouponModalOpen(true)}>+ Request New Coupon</button>}
//             <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uses</th></tr></thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {myCoupons.map((c) => (<tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400">{c.code}</td><td className="px-6 py-4 whitespace-nowrap text-sm">{c.discount}%</td><td className={`px-6 py-4 whitespace-nowrap text-sm ${c.status.includes('Approved') ? 'text-green-500 font-bold' : 'text-orange-500'}`}>{c.status}</td><td className="px-6 py-4 whitespace-nowrap text-sm">{c.uses}</td></tr>))}
//                     </tbody>
//                 </table>
//             </div>
//         </motion.div>
//     );
// };

// // User Management Section
// const UserManagement = ({ users, isDarkMode, cardBaseClasses }) => (
//     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
//         <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer List</h3>
//         <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Orders</th><th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th></tr></thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {users.map((u) => (<tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-500">{u.orders}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm"><button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-medium">View Details</button></td></tr>))}
//                 </tbody>
//             </table>
//         </div>
//     </motion.div>
// );


// // Main Admin Page Component
// const AdminPage = ({ isDarkMode, onViewChange, userRole, products: initialProducts, setProducts: setAppProducts }) => {
//     const [products, setProducts] = useState(Array.isArray(initialProducts) ? initialProducts : []);
//     const [refundQueue, setRefundQueue] = useState(MOCK_REFUND_QUEUE);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    
//     // --- MODIFICATION START ---
//     // 1. Changed initial state to reflect loading status.
//     const [currentOfferText, setOfferText] = useState("Loading offer...");

//     // 2. Created a new async function to handle the POST request.
// // AdminPage.jsx

// const handleOfferSave = async (newOfferText) => {
//     try {
//         const authToken = localStorage.getItem('adminToken');
//         if (!authToken) {
//             alert('You are not logged in. Please log in to continue.');
//             return;
//         }

//         const response = await fetch(`${API_BASE_URL}/offers`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${authToken}`,
//             },
//             // ✅ FIXED: Changed 'message' key to 'description' to match your API
//             body: JSON.stringify({ description: newOfferText }),
//         });

//         if (!response.ok) {
//             if (response.status === 401) {
//                 throw new Error('Authorization failed. Your session might have expired.');
//             }
//             throw new Error('Failed to update the offer on the server.');
//         }

//         // Get the response from the server
//         const responseData = await response.json();

//         // ✅ FIXED: Update the UI state from the server's response
//         // This is better practice as it uses the database as the source of truth.
//         setOfferText(responseData.data.description);
        
//         alert('Offer bar updated successfully!');

//     } catch (error) {
//         console.error('Error updating offer:', error);
//         alert(`Could not save the new offer. Reason: ${error.message}`);
//     }
// };
// const handleLogout = () => {
//     if (window.confirm("Are you sure you want to exit?")) {
//         // ✅ Clear the token and user data from storage
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('adminUser');
        
//         // Then change the view
//         onViewChange('login'); // It's better to go to 'login' than 'home'
//     }
// }
//     // --- MODIFICATION END ---
    
//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/products`);
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setProducts(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error("Failed to fetch products:", error);
//                 setProducts([]);
//             }
//         };

//         // --- MODIFICATION START ---
//         // 3. (Bonus) Fetch the current offer when the component loads.
//         const fetchCurrentOffer = async () => {
//            try {
//         const response = await fetch('http://localhost:8000/api/v1/offers/active');
        
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
        
//         // --- THIS IS THE FIX ---
//         // We now check for the correct path: data.data.description
//         if (data && data.data && data.data.description) {
//           setOfferText(data.data.description); // Get text from the correct path
//         } else {
//           setOfferText(''); 
//           console.warn("Offer description was not found in the API response structure.");
//         }

//       } catch (error) {
//         console.error("Failed to fetch offer:", error);
//         setIsVisible(false);
//       } finally {
//         setIsLoading(false);
//       }
//         };
//         // --- MODIFICATION END ---

//         fetchProducts();
//         fetchCurrentOffer(); // Call the new function.
//     }, []); 

//     useEffect(() => { setAppProducts(products) }, [products, setAppProducts]);

//     const initialSection = useMemo(() => {
//         const role = userRole?.role_name?.toLowerCase();
//         if (role === 'product_manager') return 'products';
//         if (role === 'finance_manager') return 'finance';
//         return 'dashboard';
//     }, [userRole]);
//     const [activeSection, setActiveSection] = useState(initialSection);

//     const handleSectionChange = (sectionId) => {
//         setActiveSection(sectionId);
//         setIsSidebarOpen(false);
//     };

//     const allNavItems = useMemo(() => [
//         { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, roles: ['admin'] },
//         { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'product_manager'] },
//         { id: 'orders', label: 'Orders', icon: ShoppingBag, roles: ['admin', 'product_manager', 'finance_manager'] },
//         { id: 'finance', label: 'Finance', icon: DollarSign, roles: ['admin', 'finance_manager'] },
//         { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
//         { id: 'settings', label: 'Settings', icon: Zap, roles: ['admin'] },
//     ], []);

//     const filteredNavItems = useMemo(() => {
//         const role = userRole?.role_name?.toLowerCase();
//         if (!role) return [];
//         return allNavItems.filter(item => item.roles.includes(role));
//     }, [userRole, allNavItems]);

//     useEffect(() => {
//         const role = userRole?.role_name?.toLowerCase();
//         if (activeSection === 'dashboard' && role !== 'admin') {
//             setActiveSection(filteredNavItems[0]?.id || 'products');
//         }
//     }, [userRole, activeSection, filteredNavItems]);

//     const renderSection = () => {
//         const roleString = userRole?.role_name?.toLowerCase();
//         switch (activeSection) {
//             case 'products': return <ProductManagement products={products} setProducts={setProducts} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
//             case 'orders': return <OrderManagement orders={MOCK_ORDERS} setOrders={()=>{}} setRefundQueue={setRefundQueue} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
//             case 'users': return <UserManagement users={MOCK_USERS} setUsers={()=>{}} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
//             case 'finance': return <FinanceManagement isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} refundQueue={refundQueue} setRefundQueue={setRefundQueue} />;
//             case 'settings': return <SiteSettings isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} onUpdateOfferClick={() => setIsOfferModalOpen(true)} currentOfferText={currentOfferText} />;
//             default: return <Dashboard products={products} orders={MOCK_ORDERS} users={MOCK_USERS} setActiveSection={setActiveSection} isDarkMode={isDarkMode} userRole={roleString} />;
//         }
//     };

//     return (
//         <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//              {/* --- MODIFICATION START --- */}
//              {/* 4. Pass the new handleOfferSave function to the modal's onSave prop. */}
//             <AnimatePresence>{isOfferModalOpen && <OfferBarModal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} onSave={handleOfferSave} currentOfferText={currentOfferText} isDarkMode={isDarkMode} />}</AnimatePresence>
//             {/* --- MODIFICATION END --- */}
//             <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}</AnimatePresence>
            
//             <div className="flex">
//                <motion.div initial={false} animate={isSidebarOpen ? { x: 0 } : { x: '-100%' }} transition={{ ease: "easeInOut" }} className={`fixed top-0 left-0 h-full w-64 p-6 flex-col z-30 lg:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                     <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
//                     <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
//                     <nav className="space-y-2 flex-grow">
//                         {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : 'hover:bg-gray-700/50 hover:text-white'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
//                     </nav>
//                 </motion.div>
//                 <div className={`w-64 p-6 flex-col h-screen z-10 hidden lg:flex fixed top-0 left-0 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                     <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
//                     <nav className="space-y-2 flex-grow">
//                         {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
//                     </nav>
//                      <div className="pt-6 border-t border-gray-700/50">
//                         <button onClick={handleLogout} className={`w-full text-left flex items-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors`}><X className="w-5 h-5 mr-3" />Exit Admin</button>
//                     </div>
//                 </div>
//             </div>

//             <main className="p-4 sm:p-8 lg:ml-64 flex-1 overflow-y-auto">
//                 <header className="flex justify-between items-center pb-6 mb-8 border-b border-gray-700/50">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-full -ml-2"><Menu className="w-6 h-6 text-pink-500" /></button>
//                     <h2 className={`text-2xl sm:text-4xl font-extrabold capitalize ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>{activeSection.replace('_', ' ')}</h2>
//                     <p className="hidden sm:block text-sm">Logged in as: <span className="font-semibold capitalize">{userRole?.role_name}</span></p>
//                 </header>
//                 {renderSection()}
//             </main>
//         </div>
//     );
// };
// export default AdminPage;





import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, X, ChevronRight, Edit3, Trash2, DollarSign, BarChart2, Zap, CornerDownRight, Plus, MapPin, Phone, Mail, Save, Tag, Image as ImageIcon, Menu } from 'lucide-react';

// --- API INTEGRATION: Define the base URL for your backend API ---
// ⭐ FIX: Use relative URL for Vite proxy
const API_BASE_URL = '/api/v1';

// --- Data Transformation Helper ---
// (No changes needed here, assuming it matches your API response structure)
const transformApiProduct = (apiProduct) => {
    if (!apiProduct) return null;
    const originalPrice = parseFloat(apiProduct.original_price || 0);
    const discountedPrice = parseFloat(apiProduct.discounted_price || originalPrice);
    const discount = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

    const variants = apiProduct.variants || [];
    const sizes = [...new Set(variants.map(v => v.size?.age_range).filter(Boolean))];
    const colors = [...new Set(variants.map(v => v.color?.name).filter(Boolean))];
    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
    // Prefer image_urls, fallback to potentially single image
    const images = apiProduct.image_urls || (apiProduct.image ? [apiProduct.image] : []);

    return {
        id: apiProduct.id,
        name: apiProduct.name,
        description: apiProduct.description,
        category: apiProduct.category || 'Uncategorized',
        discountedPrice: discountedPrice,
        originalPrice: originalPrice,
        image: images[0] || `https://placehold.co/600x400?text=${apiProduct.name.replace(/\s/g, '+')}`,
        // Keep original images structure if needed by form, adjust as necessary
        images: images.map(url => ({ url, color: 'default' })),
        stock: stock, // Total stock derived from variants
        rating: apiProduct.rating || 4.5,
        reviews: apiProduct.review_count || 0,
        colors: colors, // Derived from variants
        sizes: sizes, // Derived from variants
        isNew: apiProduct.is_new || false,
        isBestseller: apiProduct.is_bestseller || false,
        discount: discount,
        variants: variants, // Keep raw variants for editing
    };
};


// Mock data (kept for preview if needed, replace with API calls)
const MOCK_ORDERS = [ { id: 'O1001', customer: 'Jane Doe', email: 'jane@example.com', phone: '555-1234', address: '123 Main St, Bubble City', total: 1199, status: 'Shipped', date: '2025-10-01', payment: 'Credit Card', items: [{ name: 'Unicorn Dress', qty: 1, price: 1199 }] }, { id: 'O1002', customer: 'John Smith', email: 'john@example.com', phone: '555-5678', address: '456 Oak Ave, Sparkle Town', total: 2538, status: 'Pending', date: '2025-10-03', payment: 'PayPal', items: [{ name: 'Dino Set', qty: 2, price: 999 }, { name: 'Sneakers', qty: 1, price: 540 }] }, ];
const MOCK_USERS = [ { id: 'U1', name: 'Jane Doe', email: 'jane@example.com', orders: 3 }, { id: 'U2', name: 'John Smith', email: 'john@example.com', orders: 5 }, ];
const MOCK_REFUND_QUEUE = [ { id: 'R1', orderId: 'O1003', customer: 'User X', amount: 639, reason: 'Wrong size ordered.', requestedBy: 'Order Manager', status: 'Pending Finance' }, ];
const MOCK_DAILY_SALES = [ { date: '2025-10-04', orders: 5, revenue: 5400, net: 5250, discounts: 150 }, { date: '2025-10-03', orders: 12, revenue: 8900, net: 8400, discounts: 500 }, ];

// --- All UI Components (Unchanged) ---
const DashboardCard = ({ title, value, icon: Icon, colorClass, linkLabel, onClick }) => ( <motion.div whileHover={{ y: -5 }} className={`rounded-2xl p-6 shadow-lg ${colorClass}`}><div className="flex justify-between items-start"><div><p className="text-sm font-medium opacity-80">{title}</p><h3 className="text-3xl font-extrabold mt-1">{value}</h3></div><div className="p-3 rounded-full bg-white/30"><Icon className="w-6 h-6 text-white" /></div></div><button onClick={onClick} className="text-xs font-semibold mt-4 flex items-center opacity-90 hover:opacity-100">{linkLabel} <ChevronRight className="w-4 h-4 ml-1" /></button></motion.div> );
const OfferBarModal = ({ onClose, onSave, currentOfferText, isDarkMode }) => { const [text, setText] = useState(currentOfferText || ''); useEffect(() => { setText(currentOfferText); }, [currentOfferText]); const handleSubmit = (e) => { e.preventDefault(); onSave(text); onClose(); }; return ( <> <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000]" onClick={onClose} /> <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className={`fixed inset-0 m-auto h-fit max-w-lg p-8 rounded-3xl shadow-2xl z-[2001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}> <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700"><h3 className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Update Offer Bar</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="font-semibold mb-2 block">Offer Text</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} className={`w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} placeholder="e.g., 🎉 Mega Sale! Up to 50% OFF..." required /></div><div className="pt-4 border-t dark:border-gray-700"><button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl"><Save className="w-5 h-5 mr-2 inline" /> Save Changes</button></div></form></motion.div></> ); };
const SiteSettings = ({ onUpdateOfferClick, currentOfferText, cardBaseClasses }) => ( <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6"><div className={`p-6 rounded-2xl shadow-lg ${cardBaseClasses}`}><h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Promotional Offer Bar</h3><div className="p-4 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 border dark:border-gray-600"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Display Text:</p><p className="font-semibold">{currentOfferText}</p></div><button onClick={onUpdateOfferClick} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold flex items-center gap-2"><Edit3 className="w-4 h-4" /> Update Offer Text</button></div></motion.div> );

// Dashboard Sub-Component
const Dashboard = ({ products, orders, users, setActiveSection, userRole }) => {
    const stockAlertsCount = useMemo(() => (Array.isArray(products) ? products : []).filter(p => p.stock <= 10).length, [products]);
    const lowStockItems = useMemo(() => (Array.isArray(products) ? products : []).filter(p => p.stock <= 10), [products]);
    const financeCards = [ { title: "Total Revenue", value: `₹52,100`, icon: DollarSign, colorClass: "bg-gradient-to-r from-pink-500 to-purple-600 text-white", linkLabel: "View Sales", section: 'finance' }, { title: "Net Profit", value: `₹18,500`, icon: TrendingUp, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Reports", section: 'finance' }];
    const operationalCards = [ { title: "Total Orders", value: orders.length, icon: ShoppingBag, colorClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white", linkLabel: "Manage Orders", section: 'orders' }, { title: "Stock Alerts", value: stockAlertsCount, icon: Package, colorClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white", linkLabel: "Fix Inventory", section: 'products' }, { title: "Active Users", value: users.length, icon: Users, colorClass: "bg-gradient-to-r from-green-500 to-teal-600 text-white", linkLabel: "View Users", section: 'users' }];
    return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...financeCards, ...operationalCards].map((card, i) => <DashboardCard key={i} {...card} onClick={() => setActiveSection(card.section)} />)}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"><h3 className="text-xl font-bold mb-4 text-orange-500">Low Stock Items</h3><ul>{lowStockItems.slice(0, 5).map(p => (<li key={p.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mb-1"><span>{p.name}</span><span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>Stock: {p.stock}</span></li>))}</ul></div><div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"><h3 className="text-xl font-bold mb-4 text-cyan-500">Recent Orders</h3><ul>{orders.slice(0, 3).map(o => (<li key={o.id} className="flex justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm mb-1"><span>Order {o.id} ({o.customer})</span><span className="font-semibold">{o.status}</span></li>))}</ul></div></div></motion.div> );
};

// --- CORRECTED: ProductFormModal ---
const ProductFormModal = ({ onClose, isDarkMode, product, onSave }) => {
    const isEditing = !!product;
    const initialFormData = useMemo(() => (
        product ? 
        { 
            id: product.id, 
            name: product.name || '', 
            description: product.description || '', 
            category: product.category || 'Tops', 
            originalPrice: product.originalPrice || 0, 
            discountedPrice: product.discountedPrice || product.originalPrice || 0 
        } : 
        { 
            id: null, 
            name: '', 
            description: '', 
            category: 'Tops', 
            originalPrice: 0, 
            discountedPrice: 0 
        }
    ), [product]);
    
    const [formData, setFormData] = useState(initialFormData);
    const [variants, setVariants] = useState(product?.variants || []);
    const [currentVariant, setCurrentVariant] = useState({ colorId: 1, sizeId: 1, stockQuantity: 10, imageUrl: '' });

    // UseMemo for potentially dynamic data if fetched from API later
    const AVAILABLE_COLORS = useMemo(() => [{ name: 'Pink', id: 1 }, { name: 'Blue', id: 2 }, { name: 'Red', id: 3 }, { name: 'Green', id: 4 }, { name: 'Yellow', id: 5 }, { name: 'Purple', id: 6 }, { name: 'White', id: 7 }, { name: 'Black', id: 8 }], []);
    const AVAILABLE_SIZES_MAP = useMemo(() => [
        { name: '1y-2y', id: 1 }, { name: '2y-3y', id: 2 }, { name: '3y-4y', id: 3 }, { name: '4y-5y', id: 4 },
        { name: '5y-6y', id: 5 }, { name: '6y-7y', id: 6 }, { name: '7y-8y', id: 7 }, { name: '8y-9y', id: 8 },
        { name: '9y-10y', id: 9 }, { name: '10y-11y', id: 10 }, { name: '11y-12y', id: 11 }, { name: '12y-13y', id: 12 }
    ], []);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
    const handleVariantChange = (e) => setCurrentVariant(p => ({ ...p, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

    const handleAddVariant = () => {
        if (!currentVariant.colorId || !currentVariant.sizeId) {
            alert('Please select a color and size for the variant.');
            return;
        }
        if (variants.some(v => v.colorId === currentVariant.colorId && v.sizeId === currentVariant.sizeId)) {
            alert('This color and size combination already exists.');
            return;
        }
        // Assuming imageUrls is an array in your backend variant model
        setVariants(prev => [...prev, { ...currentVariant, imageUrls: [currentVariant.imageUrl].filter(Boolean) }]); 
        setCurrentVariant({ colorId: 1, sizeId: 1, stockQuantity: 10, imageUrl: '' });
    };

    const handleRemoveVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        // Pass combined formData and variants array
        onSave({ ...formData, variants }); 
        onClose(); 
    };

    // Helper to get color/size name from ID
    const getColorName = (id) => AVAILABLE_COLORS.find(c => c.id === id)?.name || 'N/A';
    const getSizeName = (id) => AVAILABLE_SIZES_MAP.find(s => s.id === id)?.name || 'N/A';

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]" onClick={onClose} />
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className={`fixed inset-0 m-auto h-fit max-h-[90vh] overflow-y-auto max-w-lg lg:max-w-4xl p-8 rounded-3xl shadow-2xl z-[1001] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-700/50">
                    <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-pink-600'}`}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block font-semibold">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} required /></div>
                        <div><label className="block font-semibold">Category</label><select name="category" value={formData.category} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} required>{['Tops', 'Shirts', 'Cord Sets', 'Dresses', 'Culotte', 'Accessories'].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                        <div className="md:col-span-2"><label className="block font-semibold">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} rows="3" required /></div>
                        <div><label className="block font-semibold">Original Price (₹)</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} required min="0" step="0.01"/></div>
                        <div><label className="block font-semibold">Discounted Price (₹)</label><input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600`} min="0" step="0.01"/></div>
                    </div>
                    
                    {/* Variant Management */}
                    <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                        <h4 className="text-xl font-bold text-pink-500">Product Variants</h4>
                        {/* List Existing Variants */}
                        {variants.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border dark:border-gray-600 rounded-lg">
                                {variants.map((variant, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                        <span>{getColorName(variant.colorId)} / {getSizeName(variant.sizeId)} - Stock: {variant.stockQuantity}</span>
                                        <button type="button" onClick={() => handleRemoveVariant(index)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Add New Variant Form */}
                        <div className="p-4 rounded-lg border dark:border-gray-600 space-y-3">
                            <p className="text-sm font-semibold">Add New Variant:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                <div><label className="text-sm font-medium">Color</label><select name="colorId" value={currentVariant.colorId} onChange={handleVariantChange} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm">{AVAILABLE_COLORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                <div><label className="text-sm font-medium">Size</label><select name="sizeId" value={currentVariant.sizeId} onChange={handleVariantChange} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm">{AVAILABLE_SIZES_MAP.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                                <div><label className="text-sm font-medium">Stock</label><input type="number" name="stockQuantity" value={currentVariant.stockQuantity} onChange={handleVariantChange} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" min="0"/></div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Image URL (Optional)</label>
                                <input type="text" name="imageUrl" value={currentVariant.imageUrl} onChange={handleVariantChange} placeholder="e.g., /images/product_pink_1y-2y.jpg" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm" />
                            </div>
                            <button type="button" onClick={handleAddVariant} className="w-full py-2 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center text-sm"><Plus className="w-4 h-4 mr-1" /> Add Variant</button>
                        </div>
                    </div>
                   
                    {/* Removed broken image handling section */}
                    {/* Removed read-only discount and separate stock input */}

                    <div className="col-span-1 lg:col-span-2 pt-4 border-t dark:border-gray-700"><button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl"><Save className="w-5 h-5 mr-2 inline" /> {isEditing ? 'Save Changes' : 'Create Product'}</button></div>
                </form>
            </motion.div>
        </>
    );
};

// --- CORRECTED: ProductManagement Section ---
const ProductManagement = ({ products, setProducts, isDarkMode, cardBaseClasses, userRole }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const canEditProducts = userRole === 'admin' || userRole === 'product_manager';

    const handleAction = async (action, product) => {
        if (!canEditProducts) return alert('Permission denied.');
        const authToken = localStorage.getItem('adminToken'); // Get token for delete check
        if (!authToken && (action === 'Edit' || action === 'Delete')) return alert('Authentication error. Please log in again.');
        
        if (action === 'Add') {
            setProductToEdit(null);
            setIsModalOpen(true);
        } else if (action === 'Edit') {
            setProductToEdit(product);
            setIsModalOpen(true);
        } else if (action === 'Delete') {
            // --- API INTEGRATION: Delete a product ---
            if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                try {
                    const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
                        method: 'DELETE',
                        // ⭐ FIX: Added Authorization header
                        headers: { 
                            'Authorization': `Bearer ${authToken}` 
                        },
                    });

                    if (!response.ok) {
                         if (response.status === 401 || response.status === 403) throw new Error('Authorization failed.');
                        throw new Error(`Failed to delete product. Status: ${response.status}`);
                    }
                    
                    // Update state after successful deletion
                    setProducts(currentProducts => currentProducts.filter(p => p.id !== product.id));
                    alert('Product deleted successfully!');

                } catch (error) {
                    console.error('Error deleting product:', error);
                    alert(`Error: Could not delete product. ${error.message}`);
                }
            }
        }
    };

    // --- REFACTORED: handleProductSave ---
    const handleProductSave = async (formData) => {
        const isEditing = !!formData.id;
        const authToken = localStorage.getItem('adminToken');
        if (!authToken) return alert('Authentication error. Please log in again.');

        // Construct payload based on API expectation (adjust if needed)
        const productPayload = {
            name: formData.name,
            description: formData.description,
            original_price: Number(formData.originalPrice),
            price: Number(formData.discountedPrice), // Assuming 'price' is discounted price
            category: formData.category,
            // variants should be an array of objects like: { colorId, sizeId, stockQuantity, imageUrls: ["url"] }
            variants: formData.variants.map(v => ({ 
                colorId: v.colorId,
                sizeId: v.sizeId,
                stock_quantity: v.stockQuantity, // Ensure key matches backend (e.g., stock_quantity vs stockQuantity)
                imageUrls: v.imageUrls || [] // Send image URLs if available
            })), 
        };

        const url = `${API_BASE_URL}/products${isEditing ? `/${formData.id}` : ''}`;
        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify(productPayload),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) throw new Error('Authorization failed.');
                const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product.`);
            }

            const savedProductData = await response.json();
            // Transform the response back for UI consistency
            const savedProduct = transformApiProduct(savedProductData.data || savedProductData); 

            if (isEditing) {
                setProducts(currentProducts => currentProducts.map(p => (p.id === savedProduct.id ? savedProduct : p)));
            } else {
                setProducts(currentProducts => [...currentProducts, savedProduct]);
            }
            alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);

        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
            alert(`Error: Could not save product. ${error.message}`);
        }
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <AnimatePresence>
                {isModalOpen && <ProductFormModal onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} product={productToEdit} onSave={handleProductSave} />}
            </AnimatePresence>
            <div className="flex justify-between items-center">
                 <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Product Inventory</h3>
                 {canEditProducts && <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2" onClick={() => handleAction('Add', null)}><Plus className="w-5 h-5"/> Add New</button>}
            </div>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock</th><th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th><th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th></tr></thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {(Array.isArray(products) ? products : []).map((p) => (
                            // ⭐ FIX: Added key prop
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{p.discountedPrice.toFixed(2)}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock <= 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>{p.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {canEditProducts && (<><button onClick={() => handleAction('Edit', p)} className="p-1 rounded-full text-purple-400 hover:text-purple-200 hover:bg-gray-700"><Edit3 className="w-4 h-4" /></button><button onClick={() => handleAction('Delete', p)} className="p-1 rounded-full text-red-400 hover:text-red-200 hover:bg-gray-700"><Trash2 className="w-4 h-4" /></button></>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// Order Detail Modal (Unchanged)
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

// Order Management Section (Unchanged)
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

// --- Finance Management Section (Unchanged) ---
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

// Coupon Form Modal (Unchanged)
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

// Coupon Management Section (Unchanged)
const CouponManagement = ({ isDarkMode, cardBaseClasses, userRole }) => {
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [myCoupons, setMyCoupons] = useState([{ id: 10, code: 'WELCOME10', discount: 10, status: 'Active (Approved)', uses: 50 }, { id: 11, code: 'SPRING20', discount: 20, status: 'Pending Approval', uses: 0 }]);
    const handleCouponRequestSave = (formData) => setMyCoupons(prev => [...prev, { id: Date.now(), ...formData, status: 'Pending Finance Approval', uses: 0 }]);

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <AnimatePresence>{isCouponModalOpen && <CouponFormModal onClose={() => setIsCouponModalOpen(false)} onSave={handleCouponRequestSave} isDarkMode={isDarkMode} />}</AnimatePresence>
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

// User Management Section (Unchanged)
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
    // ⭐ FIX: Initialize products state properly, handle loading
    const [products, setProducts] = useState([]); 
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(null);

    const [refundQueue, setRefundQueue] = useState(MOCK_REFUND_QUEUE);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [currentOfferText, setOfferText] = useState("Loading offer...");

    // Fetch Products on Mount
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            setProductError(null);
            try {
                // ⭐ FIX: Use relative URL
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                const apiResponse = await response.json();
                // ⭐ FIX: Use transform function and check data structure
                const transformed = Array.isArray(apiResponse.data) 
                    ? apiResponse.data.map(transformApiProduct).filter(Boolean) 
                    : [];
                setProducts(transformed); 
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProductError(`Failed to load products: ${error.message}`);
                setProducts([]); // Ensure products is an array on error
            } finally {
                 setIsLoadingProducts(false);
            }
        };

        const fetchCurrentOffer = async () => {
            try {
                 // ⭐ FIX: Use relative URL
                const response = await fetch(`${API_BASE_URL}/offers/active`);
                if (!response.ok) throw new Error('Could not fetch the current offer.');
                const data = await response.json();
                setOfferText(data?.message || "No active offer set.");
            } catch (error) {
                console.error("Failed to fetch offer text:", error);
                setOfferText("Could not load the current offer.");
            }
        };

        fetchProducts();
        fetchCurrentOffer();
    }, []); 

    // Update parent state when local products change
    useEffect(() => { 
        if (setAppProducts) { // Check if prop exists
            setAppProducts(products);
        }
    }, [products, setAppProducts]);

    const handleOfferSave = async (newOfferText) => {
        try {
            const authToken = localStorage.getItem('adminToken'); 
            if (!authToken) {
                alert('You are not logged in. Please log in to continue.');
                return;
            }
             // ⭐ FIX: Use relative URL
            const response = await fetch(`${API_BASE_URL}/offers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                },
                body: JSON.stringify({ message: newOfferText }),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) throw new Error('Authorization failed.');
                throw new Error('Failed to update the offer on the server.');
            }
            setOfferText(newOfferText);
            alert('Offer bar updated successfully!');
        } catch (error) {
            console.error('Error updating offer:', error);
            alert(`Could not save the new offer. Reason: ${error.message}`);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to exit?")) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            onViewChange('login'); 
        }
    }
    
    // Determine initial section based on role
    const initialSection = useMemo(() => {
        const role = userRole?.role_name?.toLowerCase();
        if (role === 'product_manager') return 'products';
        if (role === 'finance_manager') return 'finance';
        return 'dashboard'; // Default for admin or unknown
    }, [userRole]);
    const [activeSection, setActiveSection] = useState(initialSection);

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        setIsSidebarOpen(false);
    };

    // Navigation items based on roles
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
        if (!role) return []; // Handle case where role might be undefined
        return allNavItems.filter(item => item.roles.includes(role));
    }, [userRole, allNavItems]);
    
    // Fallback if current section becomes invalid due to role change
    useEffect(() => {
        const currentSectionAllowed = filteredNavItems.some(item => item.id === activeSection);
        if (!currentSectionAllowed && filteredNavItems.length > 0) {
            setActiveSection(filteredNavItems[0].id); // Go to the first allowed section
        } else if (filteredNavItems.length === 0) {
             setActiveSection('dashboard'); // Fallback if no items allowed (shouldn't happen with roles)
        }
    }, [userRole, activeSection, filteredNavItems]);

    // Render the active section component
    const renderSection = () => {
        const roleString = userRole?.role_name?.toLowerCase();
        // ⭐ FIX: Handle loading and error states for products
        if (activeSection === 'products' || activeSection === 'dashboard') {
             if (isLoadingProducts) return <p>Loading products...</p>;
             if (productError) return <p className="text-red-500">Error: {productError}</p>;
        }

        switch (activeSection) {
            case 'products': return <ProductManagement products={products} setProducts={setProducts} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
            case 'orders': return <OrderManagement orders={MOCK_ORDERS} setOrders={()=>{}} setRefundQueue={setRefundQueue} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} />;
            case 'users': return <UserManagement users={MOCK_USERS} isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} />; // Removed setUsers prop
            case 'finance': return <FinanceManagement isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} userRole={roleString} refundQueue={refundQueue} setRefundQueue={setRefundQueue} />;
            case 'settings': return <SiteSettings isDarkMode={isDarkMode} cardBaseClasses={isDarkMode ? 'bg-gray-800' : 'bg-white'} onUpdateOfferClick={() => setIsOfferModalOpen(true)} currentOfferText={currentOfferText} />;
            default: return <Dashboard products={products} orders={MOCK_ORDERS} users={MOCK_USERS} setActiveSection={setActiveSection} isDarkMode={isDarkMode} userRole={roleString} />;
        }
    };

    return (
        <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <AnimatePresence>{isOfferModalOpen && <OfferBarModal onClose={() => setIsOfferModalOpen(false)} onSave={handleOfferSave} currentOfferText={currentOfferText} isDarkMode={isDarkMode} />}</AnimatePresence>
            <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}</AnimatePresence>
            
            {/* Mobile Sidebar */}
            <motion.div 
                 initial={false} 
                 animate={isSidebarOpen ? { x: 0 } : { x: '-100%' }} 
                 transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
                 className={`fixed top-0 left-0 h-full w-64 p-6 flex flex-col z-30 lg:hidden shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
             >
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700/50"><X className="w-6 h-6" /></button>
                <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
                <nav className="space-y-2 flex-grow overflow-y-auto">
                    {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : 'hover:bg-gray-700/50 hover:text-white'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
                </nav>
                 <div className="pt-6 border-t border-gray-700/50 mt-auto">
                     <button onClick={handleLogout} className={`w-full text-left flex items-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors`}><X className="w-5 h-5 mr-3" />Exit Admin</button>
                 </div>
            </motion.div>

            {/* Desktop Sidebar */}
            <div className={`w-64 p-6 flex-col h-screen z-10 hidden lg:flex fixed top-0 left-0 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>{userRole?.role_name?.toUpperCase().replace('_', ' ') || 'MANAGER'}</h1>
                <nav className="space-y-2 flex-grow">
                    {filteredNavItems.map(item => <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left flex items-center p-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-pink-500 text-white shadow-lg' : isDarkMode ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}><item.icon className="w-5 h-5 mr-3" />{item.label}</button>)}
                </nav>
                 <div className="pt-6 border-t border-gray-700/50 mt-auto">
                     <button onClick={handleLogout} className={`w-full text-left flex items-center p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors`}><X className="w-5 h-5 mr-3" />Exit Admin</button>
                 </div>
            </div>

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
export default AdminPage;