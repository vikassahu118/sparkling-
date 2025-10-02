import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

const DiscountPopup = ({ isVisible, onClose, onApplyCode }) => {
  const [timeLeft, setTimeLeft] = useState(10); // 5 minutes
  const [minimized, setMinimized] = useState(false);
  const [expired, setExpired] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!isVisible || expired) return;

    if (timeLeft <= 0) {
      setExpired(true);
      setMinimized(false);
      setTimeout(() => setRemoved(true), 5000);
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isVisible, timeLeft, expired]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleApplyCode = () => {
    if (!expired) {
      onApplyCode("WELCOME20");
      onClose();
    }
  };

  const handleMaybeLater = () => setMinimized(true);
  const handleRestore = () => setMinimized(false);

  if (removed) return null;

  return (
    <>
      <AnimatePresence>
        {/* Full Popup */}
        {isVisible && !minimized && !expired && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-gradient-to-r from-pink-400 to-purple-500 w-full max-w-sm sm:max-w-md relative">
                
                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 cursor-pointer right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-50"
                >
                  <X className="w-5 h-5 pointer-events-none" />
                </motion.button>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="mb-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                    Sparkling Welcome Gift! 🎉✨
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                    Get flat 20% OFF on your first sparkling order! Perfect for your little bubbles! 🫧
                  </p>

                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 sm:px-6 py-2 text-sm sm:text-lg font-bold flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" />
                    WELCOME20
                  </Badge>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Offer expires in:
                  </p>
                  <div className="text-lg sm:text-2xl font-bold text-red-500 mb-4 sm:mb-6">{formatTime(timeLeft)}</div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleApplyCode}
                      disabled={expired}
                      className={`flex-1 rounded-xl py-2 font-bold text-white ${
                        expired
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      }`}
                    >
                      Claim Now! 🛍
                    </button>
                    <button
                      onClick={handleMaybeLater}
                      className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl py-2 font-bold"
                    >
                      Maybe Later
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    *Valid on orders above ₹999. One time use only.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimized floating icon */}
      {isVisible && minimized && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 z-50 cursor-pointer flex flex-col items-center"
          onClick={!expired ? handleRestore : undefined}
        >
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg relative ${
              expired ? "bg-gray-400" : "bg-pink-500 dark:bg-purple-600"
            }`}
          >
            <Gift
              className={`w-6 h-6 sm:w-8 sm:h-8 text-white ${
                !expired ? "animate-bounce" : "animate-pulse"
              }`}
            />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {!expired ? formatTime(timeLeft) : "EXPIRED"}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DiscountPopup;
