import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, ChevronDown, Filter, X } from 'lucide-react';

// --- Helper & UI Components (Unchanged) ---
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const placeholder = `https://placehold.co/600x400/f7f7f7/cbd5e0?text=Image+Not+Found`;
  return <img src={imgSrc} alt={alt} className={className} onError={() => setImgSrc(placeholder)} />;
};

const Badge = ({ children, className }) => (
  <span className={`font-bold rounded-full text-xs px-2.5 py-1 ${className}`}>{children}</span>
);

const Button = ({ children, className, onClick, ...props }) => (
  <button className={`font-semibold rounded-lg transition-transform duration-200 ease-in-out active:scale-95 ${className}`} onClick={onClick} {...props}>
    {children}
  </button>
);

// --- Memoized Price Range Slider Component for Performance (Unchanged) ---
const PriceRangeSlider = React.memo(({ min, max, step, price, setPrice }) => {
  const [minVal, setMinVal] = useState(price.min);
  const [maxVal, setMaxVal] = useState(price.max);
  const range = useRef(null);

  const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  useEffect(() => {
    setMinVal(price.min);
    setMaxVal(price.max);
  }, [price]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    setMinVal(value);
    setPrice({ ...price, min: value });
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    setMaxVal(value);
    setPrice({ ...price, max: value });
  };

  return (
    <div className="pt-4">
      <div className="relative flex items-center h-2">
        <input type="range" min={min} max={max} value={minVal} step={step} onChange={handleMinChange} className="thumb thumb--left" style={{ zIndex: minVal > max - 100 ? "5" : "3" }}/>
        <input type="range" min={min} max={max} value={maxVal} step={step} onChange={handleMaxChange} className="thumb thumb--right"style={{ zIndex: minVal > max - 100 ? "5" : "3" }} />
        <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-md">
          <div ref={range} className="absolute h-1 rounded-md bg-pink-500" />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <span className="font-medium text-gray-800 dark:text-white">₹{minVal}</span>
        <span className="font-medium text-gray-800 dark:text-white">₹{maxVal}</span>
      </div>
       <style>{`.thumb{pointer-events:none;position:absolute;height:0;width:100%;outline:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent;}.thumb::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;pointer-events:all;width:20px;height:20px;background-color:#fff;border-radius:50%;border:2px solid #ec4899;box-shadow:0 0 5px rgba(0,0,0,0.1);cursor:pointer;}.thumb::-moz-range-thumb{pointer-events:all;width:20px;height:20px;background-color:#fff;border-radius:50%;border:2px solid #ec4899;cursor:pointer;}`}</style>
    </div>
  );
});


// --- Enhanced Filter Sidebar/Drawer Component (Unchanged) ---
const FilterSidebar = ({ isOpen, onClose, filters, setFilters, products, defaultFilters }) => {
  const isMobile = window.innerWidth < 768;
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const uniqueColors = useMemo(() => [...new Set(products.flatMap(p => p.colors))], [products]);
  
  const colorMap = {
    pink: 'bg-pink-400', purple: 'bg-purple-400', blue: 'bg-blue-400', green: 'bg-green-400', orange: 'bg-orange-400', white: 'bg-gray-200 border border-gray-300', yellow: 'bg-yellow-400', multicolor: 'bg-gradient-to-r from-pink-400 to-yellow-400', rainbow: 'bg-gradient-to-r from-red-400 via-green-400 to-blue-400', navy: 'bg-blue-900', red: 'bg-red-500', gold: 'bg-yellow-500', silver: 'bg-gray-400', brown: 'bg-yellow-800', black: 'bg-black',
  };

  const handleColorSelect = (color) => setFilters(p => ({ ...p, color: p.color === color ? null : color }));
  const handleSizeToggle = (size) => setFilters(p => ({ ...p, sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size] }));
  const clearFilters = () => setFilters(defaultFilters);

  const panelVariants = isMobile ? {
    visible: { y: 0 }, hidden: { y: "100%" }
  } : {
    visible: { x: 0 }, hidden: { x: "100%" }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/60 z-40" />
          <motion.div
            variants={panelVariants} initial="hidden" animate="visible" exit="hidden" transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 h-[85vh]' : 'top-0 right-0 h-full w-full max-w-md'} bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col rounded-t-3xl md:rounded-none`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h3>
              <Button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-6 h-6 text-gray-600 dark:text-gray-300" /></Button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-8">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">Price Range</h4>
                <PriceRangeSlider min={500} max={5000} step={100} price={filters.price} setPrice={newPrice => setFilters(p => ({ ...p, price: newPrice }))} />
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Colors</h4>
                <div className="flex flex-wrap gap-3">{uniqueColors.map(c => <button key={c} onClick={() => handleColorSelect(c)} className={`w-9 h-9 rounded-full capitalize transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-pink-500 ${colorMap[c]||'bg-gray-300'} ${filters.color===c?'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-pink-500':''}`} aria-label={`Filter by ${c}`} />)}</div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Sizes</h4>
                <div className="flex flex-wrap gap-3">{AVAILABLE_SIZES.map(s => <button key={s} onClick={() => handleSizeToggle(s)} className={`px-4 py-2 border rounded-full font-medium transition-colors duration-200 text-sm ${filters.sizes.includes(s) ? 'bg-pink-500 text-white border-pink-500' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600'}`}>{s}</button>)}</div>
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


// --- Memoized Product Card for Performance ---
const ProductCard = React.memo(({ product, onProductClick, onAddToCart, onAddToWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // ⭐️ CRITICAL FIX: Ensure both cart and wishlist actions use the consistently named price property
  const productForAction = useMemo(() => ({
    id: product.id,
    name: product.name,
    // Map discountedPrice to the 'price' property expected by App.jsx
    price: product.discountedPrice, 
    image: product.image,
  }), [product]);

  return (
    <motion.div
      layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} className="cursor-pointer" onClick={() => onProductClick(product)}>
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        </motion.div>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-green-500 text-white">NEW</Badge>}
          {product.isBestseller && <Badge className="bg-orange-500 text-white">BESTSELLER</Badge>}
        </div>
        <motion.div className="absolute top-3 right-3" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}>
          <Badge className="bg-red-500 text-white text-sm px-3 py-1.5">{product.discount}% OFF</Badge>
        </motion.div>
        <AnimatePresence>
          {isHovered &&
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3">
              <Button onClick={() => onProductClick(product)} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3 h-12 w-12 flex items-center justify-center transform hover:scale-110 transition-transform"><Eye className="w-5 h-5" /></Button>
              
              {/* ✅ FIX APPLIED: Use productForAction object for Wishlist */}
              <Button onClick={() => onAddToWishlist(productForAction)} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3 h-12 w-12 flex items-center justify-center transform hover:scale-110 transition-transform"><Heart className="w-5 h-5" /></Button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}</div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating} ({product.reviews})</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-pink-600 transition-colors line-clamp-2 h-14" onClick={() => onProductClick(product)}>{product.name}</h3>
        <div className="flex items-center gap-2 my-3">
          <span className="text-xl font-bold text-pink-600">₹{product.discountedPrice}</span>
          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
        </div>
        <div className="mt-auto">
          <Button onClick={() => onAddToCart(productForAction)} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

// --- Main Product Grid Component (rest of the code is unchanged) ---
export const ProductGrid = ({ products = [], onProductClick = () => {}, onAddToCart = () => {}, onAddToWishlist = () => {} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const defaultFilters = useMemo(() => ({
    price: { min: 500, max: 5000 }, color: null, sizes: [],
  }), []);

  const [filters, setFilters] = useState(defaultFilters);
  
  const defaultProducts = useMemo(() => [
    { id: '1', name: 'Rainbow Unicorn Dress', image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?w=600', originalPrice: 1599, discountedPrice: 1199.00, discount: 25, rating: 4.8, reviews: 156, colors: ['pink', 'purple', 'blue'], sizes: ['S', 'M', 'L'], category: 'Girls', isNew: true, isBestseller: true },
    { id: '2', name: 'Cool Dino T-Shirt Set', image: 'https://images.unsplash.com/photo-1585528761181-2865fc48723f?w=600', originalPrice: 1299, discountedPrice: 999.00, discount: 23, rating: 4.6, reviews: 89, colors: ['green', 'blue', 'orange'], sizes: ['XS', 'S', 'M'], category: 'Boys', isBestseller: true },
    { id: '3', name: 'Cute Baby Onesie', image: 'https://images.unsplash.com/photo-1545877872-3e6582cbc37c?w=600', originalPrice: 799, discountedPrice: 639.00, discount: 20, rating: 4.9, reviews: 234, colors: ['white', 'pink', 'yellow'], sizes: ['XS'], category: 'Infants', isNew: true },
    { id: '4', name: 'Colorful Sneakers', image: 'https://images.unsplash.com/photo-1669762162480-fb67378e307b?w=600', originalPrice: 2199, discountedPrice: 1539.00, discount: 30, rating: 4.7, reviews: 67, colors: ['multicolor', 'rainbow', 'black'], sizes: ['M', 'L'], category: 'Accessories' },
    { id: '5', name: 'Winter Cozy Jacket', image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?w=600', originalPrice: 2499, discountedPrice: 1749.00, discount: 30, rating: 4.9, reviews: 145, colors: ['navy', 'red', 'green'], sizes: ['M', 'L', 'XL'], category: 'Outerwear', isBestseller: true },
  ], []);

  const productsToUse = products.length > 0 ? products : defaultProducts;
  const categories = useMemo(() => ['All', ...new Set(productsToUse.map(p => p.category))], [productsToUse]);

  const filteredProducts = useMemo(() => {
    return productsToUse.filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (p.discountedPrice >= filters.price.min && p.discountedPrice <= filters.price.max) &&
      (!filters.color || p.colors.includes(filters.color)) &&
      (filters.sizes.length === 0 || filters.sizes.some(s => p.sizes.includes(s)))
    );
  }, [selectedCategory, filters, productsToUse]);

  const activeFilterCount = useMemo(() => {
      let count = 0;
      if (filters.price.min !== defaultFilters.price.min || filters.price.max !== defaultFilters.price.max) count++;
      if (filters.color) count++;
      if (filters.sizes.length > 0) count++;
      return count;
  }, [filters, defaultFilters]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const removeFilter = (type, value = null) => {
    if (type === 'price') setFilters(p => ({ ...p, price: defaultFilters.price }));
    if (type === 'color') setFilters(p => ({ ...p, color: null }));
    if (type === 'size') setFilters(p => ({ ...p, sizes: p.sizes.filter(s => s !== value) }));
  };

  return (
    <section className="py-16 px-4 min-h-screen font-sans ">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">Featured Products 🌟</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Handpicked favorites that kids love and parents trust</p>
        </motion.div>

        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="relative">
            <Button onClick={() => setIsDropdownOpen(p => !p)} className="inline-flex items-center justify-center min-w-[200px] rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              {selectedCategory === 'All' ? 'All Categories' : `Showing: ${selectedCategory}`}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            <AnimatePresence>{isDropdownOpen && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20"><div className="py-1">{categories.map(c => <a key={c} href="#" onClick={e => {e.preventDefault(); handleCategorySelect(c);}} className={`block px-4 py-2 text-sm ${selectedCategory === c ? 'font-bold text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600`}>{c}</a>)}</div></motion.div>}</AnimatePresence>
          </div>
          <Button onClick={() => setIsFilterOpen(true)} className="relative flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-6 py-3 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">{activeFilterCount}</span>}
          </Button>
        </div>
        
        <AnimatePresence>
        {activeFilterCount > 0 &&
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center items-center gap-2 mb-8 flex-wrap">
            {(filters.price.min !== defaultFilters.price.min || filters.price.max !== defaultFilters.price.max) && <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5">Price: ₹{filters.price.min}-{filters.price.max} <button onClick={() => removeFilter('price')}><X className="w-3.5 h-3.5" /></button></Badge>}
            {filters.color && <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5 capitalize">{filters.color} <button onClick={() => removeFilter('color')}><X className="w-3.5 h-3.5" /></button></Badge>}
            {filters.sizes.map(s => <Badge key={s} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1.5">{s} <button onClick={() => removeFilter('size', s)}><X className="w-3.5 h-3.5" /></button></Badge>)}
          </motion.div>
        }
        </AnimatePresence>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => <ProductCard key={product.id} product={product} onProductClick={onProductClick} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} />)
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Products Found 😔</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for!</p>
            </motion.div>
          )}
        </div>
      </div>
      
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} setFilters={setFilters} products={productsToUse} defaultFilters={defaultFilters} />
    </section>
  );
};
