import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // FIX: Corrected import from 'motion/react'
import { Star, Sparkles } from 'lucide-react';

// --- Local Utility Component Definitions (FIX for missing imports) ---

// Simple Badge Component
const Badge = ({ children, className = '' }) => (
    <div className={`inline-block text-sm font-medium rounded-full px-4 py-1.5 shadow-md ${className}`}>
        {children}
    </div>
);

// Simple Button Component
const Button = ({ children, className = '', variant, ...props }) => {
    const baseClasses = "px-8 py-4 text-lg rounded-xl transform transition-all duration-200 shadow-lg hover:shadow-xl font-medium touch-optimized";

    const variantClasses = variant === 'outline'
        ? "border-2 border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
        : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

// ImageWithFallback Component (Simple version)
const ImageWithFallback = ({ src, alt, className = '' }) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const handleError = () => {
        // Fallback to a placehold.co image if the main URL fails
        const width = 500;
        const height = 500;
        setImgSrc(`https://placehold.co/${width}x${height}/a855f7/ffffff?text=Sparkling+Bubbles`);
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
};
// -------------------------------------------------------------------


export default function HeroSection({ onShopNowClick, isDarkMode }) { // FIX: Changed to default export
    const floatingElements = [
        { icon: Star, color: 'text-yellow-400', delay: 0, x: 20, y: 30 },
        { icon: Sparkles, color: 'text-pink-400', delay: 0.5, x: 80, y: 20 },
        { icon: Star, color: 'text-purple-400', delay: 1, x: 15, y: 70 },
        { icon: Sparkles, color: 'text-blue-400', delay: 1.5, x: 85, y: 60 },
    ];

    const imageSrc = "https://images.unsplash.com/photo-1696483150935-2f719f1dfa6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGtpZHMlMjB3ZWFyaW5nJTIwY29sb3JmdWwlMjBjbG90aGVzfGVufDF8fHx8MTc1ODcxNzg0NXww&ixlib=rb-4.1.0&q=80&w=1080";

    return (
        <div className="relative min-h-[80vh] py-16 flex items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div className="absolute inset-0 z-0">
                {floatingElements.map((element, index) => (
                    <motion.div
                        key={index}
                        className={`absolute ${element.color}`}
                        style={{ left: `${element.x}%`, top: `${element.y}%` }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3,
                            delay: element.delay,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    >
                        <element.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-70" />
                    </motion.div>
                ))}
            </motion.div>

            <div className="container mx-auto px-4 z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Badge className="mb-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2">
                                ✨ New Collection Available
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Sparkling Dreams for Little Bubbles ✨
                        </motion.h1>

                        <motion.p
                            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Discover magical outfits that spark imagination and bring joy to every adventure.
                            Premium quality, playful designs, and unbeatable comfort for your little ones.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                onClick={onShopNowClick}
                            >
                                Shop Now 🛍️
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => onShopNowClick()} // Assuming 'View Collection' also navigates to shop
                            >
                                View Collection 👗
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="flex justify-center lg:justify-start gap-8 mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-pink-600">__</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Kids</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">__</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">__</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Hero Image */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div
                            className="relative rounded-3xl overflow-hidden shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {/* <ImageWithFallback
                                src={imageSrc}
                                alt="Happy kids wearing colorful clothes"
                                className="w-full h-[350px] sm:h-[450px] lg:h-[550px] object-cover"
                            /> */}

                            {/* Floating Discount Badge */}
                            {/* <motion.div
                                className="absolute top-6 right-6"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-lg shadow-lg">
                                    🔥 30% OFF
                                </Badge>
                            </motion.div> */}

                            {/* Floating Hearts */}
                            {/* <motion.div
                                className="absolute bottom-6 left-6"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <div className="text-2xl">💖</div>
                            </motion.div> */}
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        <motion.div
                            className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20"
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [360, 180, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
