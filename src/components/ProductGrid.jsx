import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, ChevronDown, Filter, X, Minus, Plus } from 'lucide-react';

// --- API Configuration ---
const API_BASE_URL = "http://localhost:8000/api/v1";
const ASSET_BASE_URL = "http://localhost:8000"; // Base URL for images

// --- Data Mappings ---
const AVAILABLE_SIZES_MAP = [
    { name: '1y-2y', id: 1 }, { name: '2y-3y', id: 2 }, { name: '3y-4y', id: 3 }, { name: '4y-5y', id: 4 },
    { name: '5y-6y', id: 5 }, { name: '6y-7y', id: 6 }, { name: '7y-8y', id: 7 }, { name: '8y-9y', id: 8 },
    { name: '9y-10y', id: 9 }, { name: '10y-11y', id: 10 }, { name: '11y-12y', id: 11 }, { name: '12y-13y', id: 12 }
];

// --- Data Transformation Helper ---
const transformApiProduct = (apiProduct) => {
    if (!apiProduct) return null;

    const originalPrice = parseFloat(apiProduct.original_price || 0);
    const discountedPrice = parseFloat(apiProduct.discounted_price || apiProduct.original_price || 0);
    const discount = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

    let allImages = new Set();
    let allColors = new Set();
    const variants = apiProduct.variants || [];

    if (apiProduct.available_colors && apiProduct.available_colors.length > 0) {
        apiProduct.available_colors.forEach(c => {
            if (c.image) allImages.add(c.image);
            if (c.color) allColors.add(c.color);
        });
    } else if (variants.length > 0) {
        variants.forEach(variant => {
            if (variant.imageUrls && Array.isArray(variant.imageUrls)) variant.imageUrls.forEach(url => allImages.add(url));
            else if (variant.image) allImages.add(variant.image);
        });
    }
    
    if (allImages.size === 0 && apiProduct.image) {
        allImages.add(apiProduct.image);
    }

    const images = Array.from(allImages).map(img => {
        if (img && img.startsWith('/')) return `${ASSET_BASE_URL}${img}`;
        if (img && img.startsWith('data:image')) return img;
        return img;
    }).filter(Boolean);

    const colors = Array.from(allColors).map(c => c.toLowerCase());

    let sizes = [];
    if (variants.length > 0) {
        sizes = [...new Set(variants.map(v => {
            if (v.size?.age_range) return v.size.age_range;
            if (v.sizeId) {
                const sizeObj = AVAILABLE_SIZES_MAP.find(s => s.id === v.sizeId);
                return sizeObj ? sizeObj.name : null;
            }
            return null;
        }).filter(Boolean))];
    } else if (apiProduct.sizes && apiProduct.sizes.length > 0) {
        sizes = apiProduct.sizes; // Keep existing sizes
    } else {
        sizes = ['1y-2y', '3y-4y', '5y-6y', '7y-8y']; // Mock fallback
    }

    const stock = variants.reduce((acc, v) => acc + (v.stock_quantity || v.stockQuantity || 0), 0);
    
    const productData = {
        id: apiProduct.id,
        name: apiProduct.name,
        description: apiProduct.description,
        category: apiProduct.category || 'Uncategorized',
        discountedPrice: discountedPrice,
        originalPrice: originalPrice,
        stock: apiProduct.stock_quantity || stock || 10,
        rating: apiProduct.rating || 4.5,
        reviews: apiProduct.review_count || 0,
        colors: colors.length > 0 ? colors : (apiProduct.colors || ['multicolor']),
        sizes: sizes,
        isNew: apiProduct.is_new || false,
        isBestseller: apiProduct.is_bestseller || false,
        discount: discount,
    };

    if (images.length > 0) {
        productData.image = images[0];
        productData.images = images;
    }

    return productData;
};


// --- Helper & UI Components ---
const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const placeholder = `https://placehold.co/600x400/f7f7f7/cbd5e0?text=Image+Not+Found`;
    useEffect(() => { setImgSrc(src); }, [src]);
    return <img src={imgSrc || placeholder} alt={alt} className={className} onError={() => setImgSrc(placeholder)} />;
};
const Badge = ({ children, className }) => <span className={`font-bold rounded-full text-xs px-2.5 py-1 ${className}`}>{children}</span>;
const Button = ({ children, className, onClick, ...props }) => <button className={`font-semibold rounded-lg transition-transform duration-200 ease-in-out active:scale-95 ${className}`} onClick={onClick} {...props}>{children}</button>;

// --- Product Detail Modal Component ---
const ProductDetail = ({ product, isOpen, onClose, onAddToCart, onAddToWishlist, isWishlisted, isLoading }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const colorMap = { pink: 'bg-pink-400', purple: 'bg-purple-400', blue: 'bg-blue-400', green: 'bg-green-400', white: 'bg-gray-200', yellow: 'bg-yellow-400', multicolor: 'bg-gradient-to-r from-pink-400 to-yellow-400', black: 'bg-black', red: 'bg-red-500' };

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedSize(product.sizes?.[0] || null);
            setSelectedColor(product.colors?.[0] || null);
        }
    }, [product]);

    if (!isOpen) return null;

    const handleAddToCartClick = () => {
        if (product) {
            onAddToCart(product, selectedSize, selectedColor, quantity);
            onClose();
        }
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ duration: 0.3, ease: 'easeInOut' }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10"><X className="w-6 h-6 text-gray-600 dark:text-gray-300" /></Button>
                        <div className="p-6 sm:p-8 lg:p-10">
                            {!product ? ( 
                                <div className="text-center py-20">Loading...</div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                                    <div className="flex flex-col gap-4">
                                        <div className="aspect-square w-full overflow-hidden rounded-2xl relative">
                                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            {isLoading && <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3">{product.name}</h2>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}</div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews} reviews)</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{product.description}</p>
                                        
                                        {product.sizes && product.sizes.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Select Size: <span className="font-medium">{selectedSize}</span></h4>
                                                <div className="flex flex-wrap gap-2">{product.sizes.map((size) => (<button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-full font-medium transition-colors text-sm ${selectedSize === size ? 'bg-pink-500 text-white border-pink-500' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}>{size}</button>))}</div>
                                            </div>
                                        )}

                                        {product.colors && product.colors.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Color: <span className="font-medium capitalize">{selectedColor}</span></h4>
                                                <div className="flex flex-wrap gap-3">{product.colors.map((color) => (<button key={color} onClick={() => setSelectedColor(color)} title={color} className={`w-8 h-8 rounded-full capitalize transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-pink-500 ${colorMap[color] || 'bg-gray-300'} ${selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-pink-500' : ''}`} />))}</div>
                                            </div>
                                        )}
                                        
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Quantity</h4>
                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full w-fit">
                                                <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="w-4 h-4" /></Button>
                                                <span className="font-bold w-10 text-center">{quantity}</span>
                                                <Button onClick={() => setQuantity(q => Math.min(10, q + 1))} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-4 h-4" /></Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-6 mt-auto">
                                            <span className="text-3xl font-bold text-pink-600">₹{product.discountedPrice}</span>
                                            {product.discountedPrice < product.originalPrice && <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button onClick={handleAddToCartClick} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-4 font-medium flex items-center justify-center"><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Button>
                                            <Button onClick={() => onAddToWishlist(product)} className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"><Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 dark:text-gray-300'}`} /></Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Price Range Slider ---
const PriceRangeSlider = React.memo(({ min, max, step, price, setPrice, isDarkMode }) => {
    const [minVal, setMinVal] = useState(price.min);
    const [maxVal, setMaxVal] = useState(price.max);
    const range = useRef(null);
    
    // Dynamically set thumb border color based on dark mode or active state
    const thumbBorderColor = isDarkMode ? 'currentColor' : '#ec4899'; // Use currentColor or pink-500 for consistency
    const thumbBgColor = isDarkMode ? '#1f2937' : '#ffffff'; // Dark gray for dark mode, white for light

    const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

    useEffect(() => { setMinVal(price.min); setMaxVal(price.max); }, [price]);
    useEffect(() => {
        const minPercent = getPercent(minVal);
        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${getPercent(maxVal) - minPercent}%`;
        }
    }, [minVal, maxVal, getPercent]);

    return (
        <div className="pt-4">
            <div className="relative flex items-center h-2">
                <input type="range" min={min} max={max} value={minVal} step={step} onChange={(e) => { const value = Math.min(Number(e.target.value), maxVal - step); setMinVal(value); setPrice({ ...price, min: value }); }} className="thumb thumb--left" style={{ zIndex: minVal > max - 100 ? "5" : "3" }} />
                <input type="range" min={min} max={max} value={maxVal} step={step} onChange={(e) => { const value = Math.max(Number(e.target.value), minVal + step); setMaxVal(value); setPrice({ ...price, max: value }); }} className="thumb thumb--right" />
                <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                    <div ref={range} className="absolute h-1 rounded-md bg-pink-500" />
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <span className="font-medium text-gray-800 dark:text-white">₹{minVal}</span>
                <span className="font-medium text-gray-800 dark:text-white">₹{maxVal}</span>
            </div>
            <style>{`
                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                }
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    pointer-events: all;
                    width: 20px;
                    height: 20px;
                    background-color: ${thumbBgColor}; /* Use dynamic background color */
                    border-radius: 50%; /* Make it a perfect circle */
                    border: 3px solid ${thumbBorderColor}; /* Thicker border for visibility */
                    cursor: grab;
                    transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
                    box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2); /* Pink glow for visibility */
                }
                .thumb::-moz-range-thumb {
                    -moz-appearance: none;
                    appearance: none;
                    pointer-events: all;
                    width: 20px;
                    height: 20px;
                    background-color: ${thumbBgColor}; /* Use dynamic background color */
                    border-radius: 50%; /* Make it a perfect circle */
                    border: 3px solid ${thumbBorderColor}; /* Thicker border for visibility */
                    cursor: grab;
                    transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
                    box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2); /* Pink glow for visibility */
                }
                /* Add hover/active states if desired */
                .thumb::-webkit-slider-thumb:hover,
                .thumb::-moz-range-thumb:hover {
                    transform: scale(1.1);
                }
                .thumb::-webkit-slider-thumb:active,
                .thumb::-moz-range-thumb:active {
                    cursor: grabbing;
                    transform: scale(0.9);
                }
            `}</style>
        </div>
    );
});

// --- Filter Sidebar ---
const FilterSidebar = ({ isOpen, onClose, filters, setFilters, products, defaultFilters, isDarkMode, sortOption, setSortOption }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL']; // Consider using product.sizes to populate this if dynamic
    const uniqueColors = useMemo(() => [...new Set(products.flatMap(p => p.colors))], [products]);
    const colorMap = { pink: 'bg-pink-400', purple: 'bg-purple-400', blue: 'bg-blue-400', green: 'bg-green-400', white: 'bg-gray-200', yellow: 'bg-yellow-400', multicolor: 'bg-gradient-to-r from-pink-400 to-yellow-400', black: 'bg-black', red: 'bg-red-500' };

    const clearFilters = () => { setFilters(defaultFilters); setSortOption('Default'); };
    const panelVariants = isMobile ? { visible: { y: 0 }, hidden: { y: "100%" } } : { visible: { x: 0 }, hidden: { x: "100%" } };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" />
                    <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="hidden" transition={{ type: 'spring', stiffness: 400, damping: 40 }} className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 h-[85vh]' : 'top-0 right-0 h-full w-full max-w-md'} bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col rounded-t-3xl md:rounded-none`}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h3>
                            <Button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-6 h-6 text-gray-600 dark:text-gray-300" /></Button>
                        </div>
                        <div className="flex-grow p-6 overflow-y-auto space-y-8">
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">Price Range</h4>
                                <PriceRangeSlider min={500} max={5000} step={100} price={filters.price} setPrice={newPrice => setFilters(p => ({ ...p, price: newPrice }))} isDarkMode={isDarkMode} />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Sort By</h4>
                                <div className="relative">
                                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className={`w-full px-4 py-3 border rounded-xl font-medium transition-colors bg-transparent dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none`}>
                                        <option>Default</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Colors</h4>
                                <div className="flex flex-wrap gap-3">{uniqueColors.map(c => <button key={c} onClick={() => setFilters(p => ({ ...p, color: p.color === c ? null : c }))} className={`w-9 h-9 rounded-full capitalize transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-pink-500 ${colorMap[c] || 'bg-gray-300'} ${filters.color === c ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-pink-500' : ''}`} />)}</div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Sizes</h4>
                                <div className="flex flex-wrap gap-3">{AVAILABLE_SIZES.map(s => <button key={s} onClick={() => setFilters(p => ({ ...p, sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s] }))} className={`px-4 py-2 border rounded-full font-medium transition-colors text-sm ${filters.sizes.includes(s) ? 'bg-pink-500 text-white border-pink-500' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}>{s}</button>)}</div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
                            <Button onClick={clearFilters} className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600">Clear</Button>
                            <Button onClick={onClose} className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600">Apply Filters</Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- Product Card ---
const ProductCard = React.memo(({ product, onProductClick, onAddToCart, onAddToWishlist, isWishlisted }) => {
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative overflow-hidden">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} className="cursor-pointer" onClick={() => onProductClick(product)}>
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                </motion.div>
                <motion.button onClick={() => onAddToWishlist(product)} className="absolute bottom-3 right-3 p-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl transition-all hover:scale-110 z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 dark:text-gray-300 hover:text-red-500'}`} />
                </motion.button>
                {product.isNew && <Badge className="absolute top-3 left-3 bg-green-500 text-white">NEW</Badge>}
                {product.isBestseller && <Badge className="absolute top-3 left-3 bg-orange-500 text-white">BESTSELLER</Badge>}
                {product.discount > 0 && <motion.div className="absolute top-3 right-3" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}><Badge className="bg-red-500 text-white text-sm px-3 py-1.5">{product.discount}% OFF</Badge></motion.div>}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}</div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews})</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-pink-600 line-clamp-2 h-14" onClick={() => onProductClick(product)}>{product.name}</h3>
                <div className="flex items-center gap-2 my-3">
                    <span className="text-xl font-bold text-pink-600">₹{product.discountedPrice}</span>
                    {product.discountedPrice < product.originalPrice && <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>}
                </div>
                <div className="mt-auto">
                    <Button onClick={() => onAddToCart(product)} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium flex items-center justify-center"><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</Button>
                </div>
            </div>
        </motion.div>
    );
});

// --- Main Product Grid Component ---
export const ProductGrid = ({ onAddToCart = () => { }, onAddToWishlist = () => { }, isDarkMode, wishlistItems = [] }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState('Default');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const apiResponse = await response.json();
                if (Array.isArray(apiResponse.data)) {
                    setProducts(apiResponse.data.map(transformApiProduct).filter(p => p !== null));
                } else { setProducts([]); }
            } catch (e) {
                setError(e.message || "Could not fetch products.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleProductClick = async (productSummary) => {
        setIsDetailOpen(true);
        setSelectedProduct(productSummary);
        setIsDetailLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productSummary.id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const apiResponse = await response.json();
            const detailedProductData = apiResponse.data || apiResponse;

            if (detailedProductData) {
                const transformedDetailedData = transformApiProduct(detailedProductData);
                setSelectedProduct(prevProduct => ({ ...prevProduct, ...transformedDetailedData }));
            }
        } catch (e) {
            console.error("Failed to fetch product details:", e);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleDetailAddToCart = (product, size, color, quantity) => {
        onAddToCart({ id: product.id, name: product.name, price: product.discountedPrice, image: product.image, quantity, size, color });
    };
    
    const maxProductPrice = useMemo(() => products.length > 0 ? Math.max(...products.map(p => p.originalPrice || 0), 5000) : 5000, [products]);
    const minProductPrice = useMemo(() => products.length > 0 ? Math.min(...products.map(p => p.originalPrice || 500), 500) : 500, [products]);
    const defaultFilters = useMemo(() => ({ price: { min: minProductPrice, max: maxProductPrice }, color: null, sizes: [] }), [minProductPrice, maxProductPrice]);
    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        if (products.length > 0) setFilters(defaultFilters);
    }, [defaultFilters, products.length]);
    
    useEffect(() => {
        const handleClickOutside = (e) => { if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(p =>
            (selectedCategory === 'All' || p.category === selectedCategory) &&
            (p.discountedPrice >= filters.price.min && p.discountedPrice <= filters.price.max) &&
            (!filters.color || (p.colors && p.colors.includes(filters.color))) &&
            (filters.sizes.length === 0 || p.sizes.some(s => filters.sizes.includes(s)))
        );
        if (sortOption === 'Price: Low to High') return [...filtered].sort((a, b) => a.discountedPrice - b.discountedPrice);
        if (sortOption === 'Price: High to Low') return [...filtered].sort((a, b) => b.discountedPrice - a.discountedPrice);
        return filtered;
    }, [selectedCategory, filters, products, sortOption]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.price.min !== defaultFilters.price.min || filters.price.max !== defaultFilters.price.max) count++;
        if (filters.color) count++;
        if (filters.sizes.length > 0) count++;
        return count;
    }, [filters, defaultFilters]);

    const removeFilter = (type, value = null) => {
        if (type === 'price') setFilters(p => ({ ...p, price: defaultFilters.price }));
        if (type === 'color') setFilters(p => ({ ...p, color: null }));
        if (type === 'size') setFilters(p => ({ ...p, sizes: p.sizes.filter(s => s !== value) }));
    };

    if (isLoading) return <section className="py-16 px-4 min-h-screen flex justify-center items-center"><div className="text-center"><h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Loading products…</h2></div></section>;
    if (error) return <section className="py-16 px-4 min-h-screen flex justify-center items-center"><div className="text-center"><h3 className="text-2xl font-semibold text-red-500">Error: {error}</h3></div></section>;

    return (
        <section className="py-16 px-4 min-h-screen font-sans">
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Featured Products 🌟</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Handpicked favorites that kids love and parents trust</p>
                </motion.div>
                
                <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="relative" ref={dropdownRef}>
                        <Button onClick={() => setIsDropdownOpen(p => !p)} className="inline-flex items-center justify-center min-w-[200px] rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">{selectedCategory === 'All' ? 'All Categories' : `Showing: ${selectedCategory}`}<ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} /></Button>
                        <AnimatePresence>{isDropdownOpen && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20"><div className="py-1">{categories.map(c => <a key={c} href="#" onClick={e => { e.preventDefault(); setIsDropdownOpen(false); setSelectedCategory(c); }} className={`block px-4 py-2 text-sm ${selectedCategory === c ? 'font-bold text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600`}>{c}</a>)}</div></motion.div>}</AnimatePresence>
                    </div>
                    <Button onClick={() => setIsFilterOpen(true)} className="relative flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"><Filter className="h-4 w-4" /> Filters{activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">{activeFilterCount}</span>}</Button>
                </div>
                <AnimatePresence>{activeFilterCount > 0 && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center items-center gap-2 mb-8 flex-wrap">
                    {(filters.price.min !== defaultFilters.price.min || filters.price.max !== defaultFilters.price.max) && <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5">Price: ₹{filters.price.min}-{filters.price.max} <button onClick={() => removeFilter('price')}><X className="w-3.5 h-3.5" /></button></Badge>}
                    {filters.color && <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5 capitalize">{filters.color} <button onClick={() => removeFilter('color')}><X className="w-3.5 h-3.5" /></button></Badge>}
                    {filters.sizes.map(s => <Badge key={s} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5">{s} <button onClick={() => removeFilter('size', s)}><X className="w-3.5 h-3.5" /></button></Badge>)}
                </motion.div>}</AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAndSortedProducts.length > 0 ? (
                        filteredAndSortedProducts.map(product => {
                            const isProductWishlisted = wishlistItems.some(item => item.id === product.id);
                            return (<ProductCard key={product.id} product={product} onProductClick={handleProductClick} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} isWishlisted={isProductWishlisted} />);
                        })
                    ) : (
                        !isLoading && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full text-center py-12">
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Products Found 😔</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for!</p>
                        </motion.div>
                    )}
                </div>
            </div>
            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} setFilters={setFilters} products={products} defaultFilters={defaultFilters} isDarkMode={isDarkMode} sortOption={sortOption} setSortOption={setSortOption} />
            <ProductDetail product={selectedProduct} isOpen={isDetailOpen} isLoading={isDetailLoading} onClose={() => setIsDetailOpen(false)} onAddToCart={handleDetailAddToCart} onAddToWishlist={onAddToWishlist} isWishlisted={selectedProduct && wishlistItems.some(item => item.id === selectedProduct.id)} />
        </section>
    );
};