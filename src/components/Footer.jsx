import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Sparkles,
    Star,
    Gift,
    ShoppingBag,
    Users,
    Award,
    X,
    Check,
    ExternalLink
} from 'lucide-react';

// Utility component definitions (included locally for single-file operation)
const Button = ({ children, className = '', ...props }) => (
    <button
        className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 shadow-md ${className}`}
        {...props}
    >
        {children}
    </button>
);


export default function Footer({ onViewChange, isDarkMode }) {
    const [showPolicyModal, setShowPolicyModal] = useState(null);
    const [showCustomerCareModal, setShowCustomerCareModal] = useState(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    // --- Style Helper Functions (FIX for Dark Mode) ---
    const getFooterBg = () => {
        return isDarkMode
            ? 'bg-gray-900/90 dark:bg-gray-900/90 border-t border-purple-800'
            : 'bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 border-t border-pink-200';
    };

    const getCardBg = () => {
        return isDarkMode
            ? 'bg-gray-800/80 backdrop-blur-md border border-purple-700/50'
            : 'bg-white/80 backdrop-blur-md border border-pink-200/50';
    };

    const getTextColor = (baseClass) => {
        return isDarkMode 
            ? 'text-gray-300 dark:text-gray-300' 
            : baseClass; // Fallback to light mode color
    };

    const getLinkHoverColor = () => {
        return isDarkMode
            ? 'hover:text-cyan-400 dark:hover:text-cyan-400'
            : 'hover:text-pink-600';
    };
    // ----------------------------------------------------

    const quickLinks = [
        { id: 'home', label: 'Home', emoji: '🏠' },
        { id: 'shop', label: 'Shop All', emoji: '🛍️' },
        // { id: 'categories', label: 'Categories', emoji: '📂' },
        { id: 'deals', label: 'Special Deals', emoji: '🎉' }
    ];

    const categories = [
        { id: 'boys', label: 'Tops', icon: '' },
        { id: 'girls', label: 'Shirts', icon: '' },
        { id: 'baby', label: 'Cord Sets', icon: '' },
        { id: 'accessories', label: 'Culotte Sets', icon: '' },
        { id: 'dresses', label: 'Dresses', icon: '' },
        { id: 'pants', label: 'Pants', icon: '' }

    ];

    const socialLinks = [
        {
            icon: Facebook,
            label: 'Facebook',
            color: 'hover:text-blue-500',
            bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
            url: 'https://facebook.com/sparklingbubbles'
        },
        {
            icon: Instagram,
            label: 'Instagram',
            color: 'hover:text-pink-500',
            bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
            url: 'https://instagram.com/sparklingbubbles'
        },
        {
            icon: Twitter,
            label: 'Twitter',
            color: 'hover:text-sky-500',
            bg: 'hover:bg-sky-50 dark:hover:bg-sky-900/20',
            url: 'https://twitter.com/sparklingbubbles'
        },
        {
            icon: Youtube,
            label: 'YouTube',
            color: 'hover:text-red-500',
            bg: 'hover:bg-red-50 dark:hover:bg-red-900/20',
            url: 'https://youtube.com/@sparklingbubbles'
        }
    ];

    const stats = [
        { icon: Users, value: '__', label: 'Happy Customers' },
        { icon: ShoppingBag, value: '___', label: 'Products' },
        { icon: Star, value: '__', label: 'Rating' },
        { icon: Award, value: '__', label: 'Years Trust' }
    ];

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail) {
            console.log('Please enter your email address! 📧');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
            console.log('Please enter a valid email address! 📧');
            return;
        }

        setIsSubscribed(true);
        console.log('Welcome to Sparkling Bubbles family! 🎉✨ Check your email for 15% off code!');
        setNewsletterEmail('');

        setTimeout(() => {
            setIsSubscribed(false);
        }, 3000);
    };

    return (
        <footer className={`relative mt-20 ${getFooterBg()} transition-colors duration-500`}>
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-4 h-4 bg-gradient-to-r ${isDarkMode ? 'from-purple-700 to-cyan-700' : 'from-pink-300 to-purple-300'} rounded-full opacity-20`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, Math.random() * 10 - 5, 0],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative container mx-auto px-4 py-12">
                {/* Stats Section (Uncommented and fixed for dark mode) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`text-center p-6 ${getCardBg()} rounded-3xl shadow-lg transition-colors duration-500`}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: index * 0.5,
                                }}
                                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl mb-3"
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className={`text-sm mt-1 ${getTextColor('text-gray-600')}`}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <motion.div
                            className="flex items-center space-x-3 mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="relative w-12 h-12 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    Sparkling Bubbles
                                </h3>
                                <p className={`text-xs transition-colors duration-500 ${getTextColor('text-gray-500')}`}>Kids Fashion Paradise ✨</p>
                            </div>
                        </motion.div>

                        <p className={`mb-6 leading-relaxed transition-colors duration-500 ${getTextColor('text-gray-600')}`}>
                            Where imagination meets fashion! Creating magical moments with colorful, comfortable, and safe clothing for your little stars. ✨👶
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <motion.button
                                    key={social.label}
                                    onClick={() => console.log(`Opening ${social.label}! Follow us for updates! ✨`)}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    whileHover={{
                                        scale: 1.2,
                                        rotate: 10,
                                        boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-2xl transition-all duration-300 ${getCardBg()} ${getTextColor('text-gray-600')} ${social.color} ${social.bg} shadow-lg relative group`}
                                >
                                    <social.icon className="w-5 h-5" />
                                    <ExternalLink className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-pink-500" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className={`text-lg font-bold mb-6 flex items-center gap-2 transition-colors duration-500 ${getTextColor('text-gray-800')}`}>
                            <motion.span
                                animate={{ rotate: [0, 20, -20, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🚀
                            </motion.span>
                            Quick Links
                        </h4>
                        <div className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <motion.button
                                    key={link.id}
                                    onClick={() => onViewChange(link.id)}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0 }}
                                    whileHover={{
                                        x: 10,
                                        scale: 1,
                                        backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(236, 72, 153, 0.1)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-3 ${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-all duration-300 p-2 rounded-xl w-full text-left`}
                                >
                                    <span className="text-lg">{link.emoji}</span>
                                    {link.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className={`text-lg font-bold mb-6 flex items-center gap-2 transition-colors duration-500 ${getTextColor('text-gray-800')}`}>
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                👕
                            </motion.span>
                            Categories
                        </h4>
                        <div className="space-y-3">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.label}
                                    onClick={() => onViewChange('shop')}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0 }}
                                    whileHover={{
                                        x: 10,
                                        scale: 1,
                                        backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(236, 72, 153, 0.1)'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-3 ${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-all duration-300 p-2 rounded-xl w-full text-left`}
                                >
                                    <span className="text-lg">{category.icon}</span>
                                    {category.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h4 className={`text-lg font-bold mb-6 flex items-center gap-2 transition-colors duration-500 ${getTextColor('text-gray-800')}`}>
                            <motion.span
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                💝
                            </motion.span>
                            Contact Us
                        </h4>

                        <div className="space-y-3">
                            <motion.button
                                onClick={() => console.log('Opening email client! 📧')}
                                className={`flex items-center gap-3 ${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-purple-900/20 w-full text-left`}
                                whileHover={{ x: 5 }}
                            >
                                <Mail className="w-5 h-5 text-pink-500" />
                                <span className="text-sm">mail</span>
                            </motion.button>
                            <motion.button
                                onClick={() => console.log('Ready to call! 📞')}
                                className={`flex items-center gap-3 ${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-purple-900/20 w-full text-left`}
                                whileHover={{ x: 5 }}
                            >
                                <Phone className="w-5 h-5 text-pink-500" />
                                <span className="text-sm">number</span>
                            </motion.button>
                            <motion.button
                                onClick={() => console.log('Opening location in maps! 📍')}
                                className={`flex items-center gap-3 ${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-purple-900/20 w-full text-left`}
                                whileHover={{ x: 5 }}
                            >
                                <MapPin className="w-5 h-5 text-pink-500" />
                                <span className="text-sm">address</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Newsletter Signup (Uncommented and fixed for dark mode) */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`rounded-3xl p-8 mb-8 border border-pink-200/50 dark:border-purple-700/50 backdrop-blur-md transition-colors duration-500 ${
                        isDarkMode 
                            ? 'bg-purple-900/40 dark:from-purple-900/20 dark:to-cyan-900/20'
                            : 'bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100'
                    }`}
                >
                    <div className="text-center">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4"
                        >
                            <Gift className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Get Exclusive Deals! 🎁
                        </h3>
                        <p className={`mb-6 ${getTextColor('text-gray-600')}`}>
                            Subscribe to our newsletter and get 15% off your first order plus exclusive kids' fashion updates!
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className={`flex-1 px-4 py-3 rounded-2xl border border-pink-200 ${isDarkMode ? 'dark:border-purple-700 bg-gray-800/80 text-white' : 'bg-white/80'} backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
                                disabled={isSubscribed}
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: isSubscribed ? 1 : 1.05 }}
                                whileTap={{ scale: isSubscribed ? 1 : 0.95 }}
                                disabled={isSubscribed}
                                className={`px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${isSubscribed
                                        ? 'bg-green-500 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                    }`}
                            >
                                {isSubscribed ? (
                                    <span className="flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Subscribed!
                                    </span>
                                ) : (
                                    'Subscribe ✨'
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div> */}

                {/* Bottom Bar (Uncommented and fixed for dark mode) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className={`pt-8 text-center border-t ${isDarkMode ? 'border-purple-800' : 'border-pink-200'}`}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className={`flex items-center gap-2 ${getTextColor('text-gray-600')}`}>
                            © 2024 Sparkling Bubbles. Made with
                            <motion.span
                                animate={{
                                    scale: [1, 1.3, 1],
                                    color: ['#ec4899', '#a855f7', '#06b6d4', '#ec4899']
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            >
                                <Heart className="w-4 h-4 fill-current" />
                            </motion.span>
                            for little stars everywhere ✨
                        </p>
                        <div className="flex gap-6 text-sm">
                            <motion.button
                                onClick={() => console.log('Privacy Policy clicked')}
                                whileHover={{ scale: 1.05, color: isDarkMode ? '#22d3ee' : '#ec4899' }}
                                className={`${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors`}
                            >
                                Privacy Policy
                            </motion.button>
                            <motion.button
                                onClick={() => console.log('Terms & Conditions clicked')}
                                whileHover={{ scale: 1.05, color: isDarkMode ? '#22d3ee' : '#ec4899' }}
                                className={`${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors`}
                            >
                                Terms & Conditions
                            </motion.button>
                            <motion.button
                                onClick={() => console.log('Cookie Policy clicked')}
                                whileHover={{ scale: 1.05, color: isDarkMode ? '#22d3ee' : '#ec4899' }}
                                className={`${getTextColor('text-gray-600')} ${getLinkHoverColor()} transition-colors`}
                            >
                                Cookie Policy
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
