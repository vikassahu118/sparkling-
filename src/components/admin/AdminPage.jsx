import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, X, ChevronRight, Edit3, Trash2, Tag, DollarSign, BarChart, HardHat } from 'lucide-react';

// NOTE: This dashboard uses mock data and pure local state management. 
// In a real application, all data manipulation would require Firebase Firestore or an external API.

// Mock data structures
const MOCK_PRODUCTS = [
    { id: '1', name: 'Rainbow Unicorn Dress', price: 1199, stock: 45, category: 'Tops', status: 'In Stock' },
    { id: '2', name: 'Cool Dino T-Shirt Set', price: 999, stock: 12, category: 'Shirts', status: 'Low Stock' },
    { id: '3', name: 'Cute Baby Onesie', price: 639, stock: 0, category: 'Cord Sets', status: 'Out of Stock' },
    { id: '4', name: 'Colorful Sneakers', price: 1539, stock: 78, category: 'Culotte', status: 'In Stock' },
    { id: '5', name: 'Winter Cozy Jacket', price: 1749, stock: 3, category: 'Dresses', status: 'Low Stock' },
];

const MOCK_ORDERS = [
    { id: 'O1001', customer: 'Jane Doe', total: 1199, status: 'Shipped', date: '2025-10-01' },
    { id: 'O1002', customer: 'John Smith', total: 2538, status: 'Pending', date: '2025-10-03' },
    { id: 'O1003', customer: 'User X', total: 639, status: 'Delivered', date: '2025-09-28' },
];

const MOCK_USERS = [
    { id: 'U1', name: 'Jane Doe', email: 'jane@example.com', role: 'admin', orders: 3 },
    { id: 'U2', name: 'John Smith', email: 'john@example.com', role: 'product_manager', orders: 5 },
    { id: 'U3', name: 'User X', email: 'userx@example.com', role: 'finance_manager', orders: 1 },
];

// Mock Coupons
const MOCK_COUPONS = [
    { code: 'SUMMER25', discount: '25%', uses: 120, status: 'Active', adminApproved: true },
    { code: 'BOGO20', discount: '20%', uses: 5, status: 'Pending', adminApproved: false },
    { code: 'WELCOMENEW', discount: '10%', uses: 500, status: 'Active', adminApproved: true },
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

const AdminPage = ({ isDarkMode, onViewChange }) => {
    // ⭐️ FIX: Simulate the currently logged-in user's role
    const [userRole, setUserRole] = useState('admin'); 
    
    const [activeSection, setActiveSection] = useState('dashboard');
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [users, setUsers] = useState(MOCK_USERS);
    const [coupons, setCoupons] = useState(MOCK_COUPONS); // New state for coupons

    const containerClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    const sidebarClasses = isDarkMode ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-lg';
    const mainContentClasses = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
    const cardBaseClasses = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const headerClasses = isDarkMode ? 'text-purple-400' : 'text-pink-600';

    const renderSection = () => {
        const props = { isDarkMode, cardBaseClasses };
        
        switch (activeSection) {
            case 'products':
                return <ProductManagement {...props} products={products} setProducts={setProducts} setCoupons={setCoupons} setActiveSection={setActiveSection} userRole={userRole} />;
            case 'orders':
                return <OrderManagement {...props} orders={orders} setOrders={setOrders} />;
            case 'users':
                return <UserManagement {...props} users={users} setUsers={setUsers} />;
            case 'finance':
                return <FinanceManagement {...props} orders={orders} products={products} coupons={coupons} />;
            case 'coupons':
                return <CouponManagement {...props} coupons={coupons} setCoupons={setCoupons} userRole={userRole} />;
            case 'dashboard':
            default:
                return <Dashboard products={products} orders={orders} users={users} coupons={coupons} setActiveSection={setActiveSection} />;
        }
    };
    
    const isAdmin = userRole === 'admin';
    const isProductManager = userRole === 'product_manager' || isAdmin;
    const isFinanceManager = userRole === 'finance_manager' || isAdmin;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, roles: ['admin', 'product_manager', 'finance_manager'] },
        // Admin Management Tools
        { id: 'products', label: 'Product Management', icon: Package, roles: ['admin', 'product_manager'] },
        { id: 'orders', label: 'Order Management', icon: ShoppingBag, roles: ['admin', 'product_manager'] },
        { id: 'finance', label: 'Finance Overview', icon: DollarSign, roles: ['admin', 'finance_manager'] },
        { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
        { id: 'coupons', label: 'Coupon Approval', icon: Tag, roles: ['admin'] },
    ].filter(item => item.roles.includes(userRole));

    return (
        <div className={`min-h-screen flex ${containerClasses}`}>
            {/* Sidebar */}
            <motion.div 
                initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}
                className={`w-64 p-6 flex flex-col ${sidebarClasses} sticky top-0 h-screen`}
            >
                <h1 className={`text-3xl font-extrabold mb-8 bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-cyan-400' : 'from-pink-500 to-purple-600'} bg-clip-text text-transparent`}>
                    Admin Panel
                </h1>
                <p className={`text-sm font-semibold mb-4 text-gray-400 capitalize`}>Role: {userRole.replace('_', ' ')}</p>
                
                <nav className="space-y-2 flex-grow">
                    {navItems.map(item => (
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
                        onClick={() => onViewChange('home')}
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
                        {activeSection.replace('management', '')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome, Admin User</p>
                </header>
                {renderSection()}
            </main>
        </div>
    );
};

// --- Dashboard Sub-Components ---

const Dashboard = ({ products, orders, users, coupons, setActiveSection }) => {
    // Mock Statistics for Admin View
    const totalRevenue = 52100.00;
    const grossProfit = 28500.00;
    const netProfit = 18900.00;
    const trafficSessions = 850;
    const salesConversion = '4.2%';
    const ticketsRised = 7;

    const stockAlerts = products.filter(p => p.stock <= 10).length;
    const pendingCoupons = coupons.filter(c => !c.adminApproved).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-10">
            <h3 className="text-2xl font-bold text-gray-400">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Traffic Sessions" 
                    value={trafficSessions.toLocaleString()} 
                    icon={BarChart} 
                    colorClass="bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                    linkLabel="View Analytics"
                    onClick={() => console.log('View traffic analytics')}
                />
                <DashboardCard 
                    title="Total Sales (MoM)" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={DollarSign} 
                    colorClass="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    linkLabel="View Finance"
                    onClick={() => setActiveSection('finance')}
                />
                 <DashboardCard 
                    title="Conversion Rate" 
                    value={salesConversion} 
                    icon={TrendingUp} 
                    colorClass="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    linkLabel="View Sales Data"
                    onClick={() => setActiveSection('orders')}
                />
                <DashboardCard 
                    title="Open Tickets" 
                    value={ticketsRised} 
                    icon={HardHat} 
                    colorClass="bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                    linkLabel="Manage Support"
                    onClick={() => console.log('Manage support tickets')}
                />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-400 pt-6 border-t border-gray-700/50">Management Overviews</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Finance Snapshot */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-green-500 dark:text-green-400">Profit/Loss Snapshot</h3>
                    <div className="space-y-2">
                        <p className="flex justify-between font-medium"><span>Gross Profit:</span> <span className="text-green-500">₹{grossProfit.toLocaleString()}</span></p>
                        <p className="flex justify-between font-medium"><span>Net Profit:</span> <span className="text-green-500">₹{netProfit.toLocaleString()}</span></p>
                        <p className="flex justify-between font-medium"><span>Coupons Pending:</span> <span className="font-bold text-red-500">{pendingCoupons}</span></p>
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-orange-500 dark:text-orange-400">Inventory Alerts ({stockAlerts})</h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {products.filter(p => p.stock <= 10).map(p => (
                            <li key={p.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                <span className="truncate">{p.name}</span>
                                <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                    Stock: {p.stock}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Recent Orders */}
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-cyan-500 dark:text-cyan-400">Recent Orders</h3>
                    <ul className="space-y-2">
                        {orders.slice(0, 3).map(o => (
                            <li key={o.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                <span>Order {o.id}</span>
                                <span className="font-semibold text-purple-500">₹{o.total.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

const ProductManagement = ({ products, setProducts, setCoupons, isDarkMode, cardBaseClasses, setActiveSection, userRole }) => {
    // Only Product Managers and Admins can perform these actions
    const canEdit = userRole === 'product_manager' || userRole === 'admin';
    const handleAction = (action, id) => console.log(`${action} product ${id}`);

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            {canEdit && (
                <div className="flex gap-4">
                    <button 
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
                        onClick={() => handleAction('Add', 'new')}
                    >
                        + Add New Product
                    </button>
                    {userRole === 'admin' && (
                         <button 
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
                            onClick={() => setActiveSection('coupons')}
                        >
                            View Coupon Approvals
                        </button>
                    )}
                </div>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{p.price.toFixed(2)}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>
                                    {p.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {canEdit ? (
                                        <>
                                            <button onClick={() => handleAction('Edit', p.id)} className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleAction('Delete', p.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500 text-xs">No Access</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const OrderManagement = ({ orders, setOrders, isDarkMode, cardBaseClasses }) => {
    // This component remains largely the same, primarily accessible to Product/Admin roles
    const handleStatusUpdate = (id, newStatus) => console.log(`Order ${id} status updated to ${newStatus}`);
    
    const getStatusBadge = (status) => {
        let classes = "px-2 py-0.5 rounded-full text-xs font-semibold";
        if (status === 'Delivered') return <span className={`bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 ${classes}`}>{status}</span>;
        if (status === 'Shipped') return <span className={`bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ${classes}`}>{status}</span>;
        if (status === 'Pending') return <span className={`bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ${classes}`}>{status}</span>;
        return <span className={`bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${classes}`}>{status}</span>;
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order List</h3>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400">{o.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{o.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">₹{o.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(o.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">{o.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const FinanceManagement = ({ orders, products, coupons, isDarkMode, cardBaseClasses }) => {
    // Mock calculations based on order data
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const costOfGoodsSold = totalSales * 0.4; // Mock COGS at 40%
    const operatingExpenses = 5000; // Mock fixed expenses

    const grossProfit = totalSales - costOfGoodsSold;
    const netProfit = grossProfit - operatingExpenses;

    const pendingCouponValue = coupons
        .filter(c => !c.adminApproved && c.discount.endsWith('%'))
        .reduce((sum, c) => sum + parseFloat(c.discount) * 10, 0); // Mock value estimation

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Total Sales (Lifetime)" 
                    value={`₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
                    icon={ShoppingBag} 
                    colorClass="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    linkLabel="Detailed Sales Report"
                    onClick={() => console.log('Detailed Sales Report')}
                />
                <DashboardCard 
                    title="Net Profit (Current)" 
                    value={`₹${netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
                    icon={DollarSign} 
                    colorClass="bg-gradient-to-r from-green-500 to-teal-600 text-white"
                    linkLabel="Profit/Loss Statement"
                    onClick={() => console.log('P/L Statement')}
                />
                <DashboardCard 
                    title="Potential Coupon Liability" 
                    value={`₹${pendingCouponValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
                    icon={Tag} 
                    colorClass="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    linkLabel="Review Coupons"
                    onClick={() => console.log('Review Coupons')}
                />
            </div>
            
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Breakdown</h3>
            <div className={`p-6 ${cardBaseClasses} rounded-xl shadow-lg`}>
                <ul className="space-y-4 text-lg">
                    <li className="flex justify-between font-semibold border-b pb-2">
                        <span>Gross Sales</span>
                        <span className="text-purple-500">₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>- Cost of Goods Sold (COGS)</span>
                        <span className="text-red-500">- ₹{costOfGoodsSold.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </li>
                    <li className="flex justify-between font-bold pt-2 border-t border-dashed">
                        <span>Gross Profit</span>
                        <span className="text-green-500">₹{grossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </li>
                     <li className="flex justify-between">
                        <span>- Operating Expenses</span>
                        <span className="text-red-500">- ₹{operatingExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </li>
                    <li className="flex justify-between font-bold text-xl pt-2 border-t-4 border-green-500/50">
                        <span>Net Profit</span>
                        <span className="text-green-500">₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
};

const UserManagement = ({ users, setUsers, isDarkMode, cardBaseClasses }) => {
    // This is where you would implement Add/Edit/Delete logic for users
    const handleRoleChange = (id, newRole) => console.log(`User ${id} role changed to ${newRole}`);
    
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Customer & Staff List</h3>
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Orders</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize font-bold text-purple-500">
                                    {u.role.replace('_', ' ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-500">{u.orders}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button 
                                        onClick={() => handleRoleChange(u.id, 'admin')} 
                                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-medium p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Edit Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const CouponManagement = ({ coupons, setCoupons, isDarkMode, cardBaseClasses, userRole }) => {
    // Only Admin can approve, Product Manager can add/remove
    const canApprove = userRole === 'admin';
    const canCreate = userRole === 'product_manager' || userRole === 'admin';

    const handleAction = (action, code) => console.log(`${action} coupon ${code}`);
    
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            {canCreate && (
                 <button 
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors"
                    onClick={() => handleAction('Create', 'new')}
                >
                    + Add New Coupon
                </button>
            )}
            <div className={`overflow-x-auto ${cardBaseClasses} rounded-xl shadow-lg`}>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uses</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {coupons.map((c) => (
                            <tr key={c.code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-600 dark:text-pink-400">{c.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.discount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.uses}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        c.adminApproved ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                    }`}>
                                        {c.adminApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {canApprove && !c.adminApproved && (
                                        <button onClick={() => handleAction('Approve', c.code)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            Approve
                                        </button>
                                    )}
                                     {canCreate && (
                                        <button onClick={() => handleAction('Remove', c.code)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            Remove
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminPage;
