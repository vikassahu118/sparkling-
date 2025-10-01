import React, { useState } from 'react';
import { motion } from 'motion/react';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import { Badge, Button } from './ui';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

export function ProductGrid({ products, onProductClick, onAddToCart, onAddToWishlist }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const defaultProducts = [
    {
      id: '1',
      name: 'Rainbow Unicorn Dress',
      image: 'https://images.unsplash.com/photo-1560359601-01c9c800ee60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZHJlc3MlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxNDMzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 1599,
      discountedPrice: 1199,
      discount: 25,
      rating: 4.8,
      reviews: 156,
      sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
      colors: ['pink', 'purple', 'blue'],
      category: 'girls',
      isNew: true,
      isBestseller: true
    },
    {
      id: '2',
      name: 'Cool Dino T-Shirt Set',
      image: 'https://images.unsplash.com/photo-1585528761181-2865fc48723f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNoaXJ0JTIwcGFudHN8ZW58MXx8fHwxNzU5MTQzNDA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 1299,
      discountedPrice: 999,
      discount: 23,
      rating: 4.6,
      reviews: 89,
      sizes: ['2-3Y', '4-5Y', '6-7Y'],
      colors: ['green', 'blue', 'orange'],
      category: 'boys',
      isBestseller: true
    },
    {
      id: '3',
      name: 'Cute Baby Onesie',
      image: 'https://images.unsplash.com/photo-1545877872-3e6582cbc37c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwb25lc2llJTIwY3V0ZXxlbnwxfHx8fDE3NTkxNDM0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 799,
      discountedPrice: 639,
      discount: 20,
      rating: 4.9,
      reviews: 234,
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
      colors: ['white', 'pink', 'yellow'],
      category: 'infants',
      isNew: true
    },
    {
      id: '4',
      name: 'Colorful Sneakers',
      image: 'https://images.unsplash.com/photo-1669762162480-fb67378e307b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc2hvZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxNDM0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 2199,
      discountedPrice: 1539,
      discount: 30,
      rating: 4.7,
      reviews: 67,
      sizes: ['25', '26', '27', '28', '29', '30'],
      colors: ['multicolor', 'rainbow'],
      category: 'accessories'
    },
    {
      id: '5',
      name: 'Winter Cozy Jacket',
      image: 'https://images.unsplash.com/photo-1513978121979-75bfaa6a713b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwamFja2V0JTIwd2ludGVyfGVufDF8fHx8MTc1OTE0MzQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 2499,
      discountedPrice: 1749,
      discount: 30,
      rating: 4.9,
      reviews: 145,
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
      colors: ['navy', 'red', 'green'],
      category: 'outerwear',
      isBestseller: true
    },
    {
      id: '6',
      name: 'Party Princess Dress',
      image: 'https://images.unsplash.com/photo-1694083884221-d23d8b1a83b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGFydHklMjBkcmVzc3xlbnwxfHx8fDE3NTkxNDM0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      originalPrice: 1899,
      discountedPrice: 1329,
      discount: 30,
      rating: 4.8,
      reviews: 201,
      sizes: ['3-4Y', '5-6Y', '7-8Y'],
      colors: ['gold', 'silver', 'purple'],
      category: 'girls',
      isNew: true
    }
  ];

  const productsToShow = products.length > 0 ? products : defaultProducts;

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Featured Products 🌟
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Handpicked favorites that kids love and parents trust
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsToShow.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                      NEW
                    </Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-orange-500 text-white px-2 py-1 text-xs">
                      BESTSELLER
                    </Badge>
                  )}
                </div>

                {/* Discount Badge */}
                <motion.div
                  className="absolute top-3 right-3"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                    {product.discount}% OFF
                  </Badge>
                </motion.div>

                {/* Hover Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    y: hoveredProduct === product.id ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
                >
                  <Button
                    size="sm"
                    onClick={() => onProductClick(product)}
                    className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAddToWishlist(product)}
                    className="bg-white text-gray-800 hover:bg-gray-100 rounded-full p-3"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Product Name */}
                <h3 
                  className="font-bold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-pink-600 transition-colors line-clamp-2"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-pink-600">
                    ₹{product.discountedPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Colors:</span>
                  {product.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                        color === 'pink' ? 'bg-pink-400' :
                        color === 'blue' ? 'bg-blue-400' :
                        color === 'purple' ? 'bg-purple-400' :
                        color === 'green' ? 'bg-green-400' :
                        color === 'orange' ? 'bg-orange-400' :
                        color === 'yellow' ? 'bg-yellow-400' :
                        color === 'white' ? 'bg-white' :
                        color === 'black' ? 'bg-black' :
                        color === 'red' ? 'bg-red-400' :
                        color === 'multicolor' ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400' :
                        color === 'rainbow' ? 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400' :
                        'bg-gray-400'
                      }`}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            className="px-8 py-3 border-2 border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-xl"
          >
            Load More Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}