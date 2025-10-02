// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { X, Gift, Sparkles } from "lucide-react";
// import { Button } from '../ui/button';
// import { Badge } from "../ui/badge";

// const DiscountPopup = ({ isVisible, onClose, onApplyCode }) => {
//   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
//   const [minimized, setMinimized] = useState(false); // floating icon

//   useEffect(() => {
//     if (isVisible && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [isVisible, timeLeft]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleApplyCode = () => {
//     onApplyCode("WELCOME20");
//     onClose();
//   };

//   const handleMaybeLater = () => {
//     setMinimized(true);
//   };

//   const handleRestore = () => {
//     setMinimized(false);
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {/* Full Popup */}
//         {isVisible && !minimized && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={onClose}
//             />

//             <motion.div
//               initial={{ opacity: 0, scale: 0.5, y: -50 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.5, y: -50 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
//             >
//               <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-gradient-to-r from-pink-400 to-purple-500 relative">
//                 <motion.button
//                   onClick={onClose}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </motion.button>

//                 <div className="text-center">
//                   <motion.div
//                     animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
//                     transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//                     className="mb-4"
//                   >
//                     <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
//                       <Gift className="w-10 h-10 text-white" />
//                     </div>
//                   </motion.div>

//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
//                     Sparkling Welcome Gift! 🎉✨
//                   </h2>

//                   <p className="text-gray-600 dark:text-gray-300 mb-4">
//                     Get flat 20% OFF on your first sparkling order! Perfect for your little bubbles! 🫧
//                   </p>

//                   <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 text-lg font-bold flex items-center gap-2 mb-4">
//                     <Sparkles className="w-4 h-4" />
//                     WELCOME20
//                   </Badge>

//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                     Offer expires in:
//                   </p>
//                   <div className="text-2xl font-bold text-red-500 mb-6">{formatTime(timeLeft)}</div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleApplyCode}
//                       className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-2 font-bold"
//                     >
//                       Claim Now! 🛍
//                     </button>
//                     <button
//                       onClick={handleMaybeLater}
//                       className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl py-2 font-bold"
//                     >
//                       Maybe Later
//                     </button>
//                   </div>

//                   <p className="text-xs text-gray-400 mt-4">
//                     *Valid on orders above ₹999. One time use only.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Minimized floating icon with timer */}
//       {isVisible && minimized && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0 }}
//           className="fixed bottom-5 right-5 z-50 cursor-pointer flex flex-col items-center"
//           onClick={handleRestore}
//         >
//           <div className="w-16 h-16 bg-pink-500 dark:bg-purple-600 rounded-full flex items-center justify-center shadow-lg relative">
//             <Gift className="w-8 h-8 text-white animate-bounce" />
//             <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//               {formatTime(timeLeft)}
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default DiscountPopup;



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Gift, Sparkles } from "lucide-react";
import { Button } from '../ui/button';
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
      // Auto-remove after 5 seconds
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-gradient-to-r from-pink-400 to-purple-500 relative">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                    Sparkling Welcome Gift! 🎉✨
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get flat 20% OFF on your first sparkling order! Perfect for your little bubbles! 🫧
                  </p>

                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 text-lg font-bold flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" />
                    WELCOME20
                  </Badge>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Offer expires in:
                  </p>
                  <div className="text-2xl font-bold text-red-500 mb-6">{formatTime(timeLeft)}</div>

                  <div className="flex gap-3">
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
          className="fixed bottom-5 right-5 z-50 cursor-pointer flex flex-col items-center"
          onClick={!expired ? handleRestore : undefined}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative ${
            expired ? "bg-gray-400" : "bg-pink-500 dark:bg-purple-600"
          }`}>
            <Gift
              className={`w-8 h-8 text-white ${
                !expired
                  ? "animate-bounce"
                  : "animate-pulse" // sparkle animation when expired
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
