import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"; 
import { ShoppingCart, Search, User, Sun, Moon, Heart, Menu, X, Sparkles, Star } from 'lucide-react';

// =======================================================
// ✅ COMPONENT 1: OfferBar
// =======================================================
const OfferBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const offerText = "🎉 Mega Sale! Up to 70% OFF — Free Shipping on Orders Over ₹999 🛍️";
  const handleClose = () => setIsVisible(false);

  const styles = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        className={`
          w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white 
          overflow-hidden transition-all duration-700 ease-in-out
          ${isVisible ? 'max-h-12' : 'max-h-0 invisible opacity-0'}
        `}
      >
        <div className="relative flex items-center h-10 px-4">
            <div className="flex-1 overflow-hidden">
              <div className="flex whitespace-nowrap animate-marquee">
                <span className="mx-12 text-sm font-bold tracking-wider">{offerText}</span>
                <span className="mx-12 text-sm font-bold tracking-wider" aria-hidden="true">{offerText}</span>
                <span className="mx-12 text-sm font-bold tracking-wider" aria-hidden="true">{offerText}</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Dismiss"
              className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 flex h-6 w-6 items-center justify-center rounded-full text-white/80 transition-colors duration-200 hover:bg-white/20 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
      </div>
    </>
  );
};

export default OfferBar
