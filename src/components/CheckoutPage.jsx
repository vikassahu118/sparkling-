import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, ShoppingBag, LoaderCircle } from 'lucide-react';

// Main Checkout Page
const CheckoutPage = ({ onGoBack }) => {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  
  // --- ⭐ 1. API & Data State ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ⭐ 2. Form State ---
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- ⭐ 3. Data Fetching (Copied from your Cart.js) ---
  const fetchCartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("Authentication token not found. Please log in.");

      const response = await fetch('/api/v1/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart data.');
      
      const data = await response.json();
      
      if (data && Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        setItems([]);
        setError("Your cart is empty."); // Handle empty cart
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);


  // --- ⭐ 4. Price Calculation (Using 'discounted_price') ---
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.discounted_price || 0);
    const quantity = parseInt(item.quantity || 0);
    return sum + (price * quantity);
  }, 0);

  const shippingFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingFee;


  // --- Event Handlers ---
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // ⭐ TODO: Replace with real API call
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(4); // Order Confirmation
      }, 2000);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onGoBack) {
      onGoBack(); // Go back to cart or product page
    }
  };

  const handleShippingChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };

  // --- Render Functions ---
  const renderShippingForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Shipping Information</h3>
      {/* ⭐ Now connected to state */}
      <input name="name" value={shippingDetails.name} onChange={handleShippingChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Name" />
      <input name="address" value={shippingDetails.address} onChange={handleShippingChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Address Line 1" />
      <input name="city" value={shippingDetails.city} onChange={handleShippingChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="City" />
      <div className="flex gap-4">
        <input name="state" value={shippingDetails.state} onChange={handleShippingChange} className="w-1/2 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="State/Province" />
        <input name="zip" value={shippingDetails.zip} onChange={handleShippingChange} className="w-1/2 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Zip/Postal Code" />
      </div>
      <button onClick={handleNext} className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors">Continue to Payment</button>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Payment Method</h3>
      <div className="p-4 border-2 border-pink-500 rounded-xl bg-pink-50 dark:bg-pink-900/10 text-pink-600">
        <p className="font-medium">Cash on Delivery (COD)</p>
        <p className="text-sm">Available for this order.</p>
      </div>
      <div className="p-4 border rounded-xl dark:border-gray-600 opacity-50">Credit Card (Temporarily Unavailable)</div>
      <button onClick={handleNext} className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors">Review Order</button>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Review & Place Order</h3>
      
      {/* Shipping Details Review */}
      <div className="p-5 border rounded-xl dark:border-gray-700">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Shipping To:</h4>
          <address className="not-italic text-gray-600 dark:text-gray-400">
            <strong>{shippingDetails.name}</strong><br />
            {shippingDetails.address}<br />
            {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zip}
          </address>
      </div>

      <div className="p-5 border rounded-xl dark:border-gray-700">
        <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">Order Totals</h4>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span></div>
          <div className="flex justify-between pt-2 border-t dark:border-gray-700 font-bold text-lg text-gray-800 dark:text-white">
            <span>Total:</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button onClick={handleNext} disabled={isProcessing} className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'}`}>
        {isProcessing ? 'Processing Order...' : 'Place Order'}
      </button>
    </div>
  );

  const renderConfirmation = () => (
    // This part is perfect, no changes needed
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
      <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">Order Placed Successfully!</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">Your order has been confirmed and will be shipped soon.</p>
      <p className="mt-4 font-semibold text-pink-600">Order ID: #10000{Math.floor(Math.random() * 999)}</p>
    </motion.div>
  );

  const getStepContent = () => {
    switch (step) {
      case 1: return renderShippingForm();
      case 2: return renderPaymentForm();
      case 3: return renderReview();
      case 4: return renderConfirmation();
      default: return renderShippingForm();
    }
  };

  // --- ⭐ 5. Handle Loading/Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <LoaderCircle className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-red-500 p-8">
        <p className="text-xl">{error}</p>
        <button onClick={onGoBack} className="ml-4 p-2 bg-pink-500 text-white rounded">Go Back</button>
      </div>
    );
  }

  // --- Main Return ---
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            {step === 4 ? 'Order Confirmation' : 'Checkout'}
          </h1>
          {step < 4 && (
            <button onClick={handleBack} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-pink-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-1" />
              {step === 1 ? 'Back to Cart' : 'Back'}
            </button>
          )}
        </div>

        {/* Progress Bar (No changes) */}
        {step < 4 && (
          <div className="flex justify-between items-center mb-10 text-sm font-medium text-gray-500 dark:text-gray-400">
            {['Shipping', 'Payment', 'Review'].map((label, index) => (
              <div key={label} className={`flex flex-col items-center flex-1 ${index < step ? 'text-pink-600 dark:text-pink-400' : ''}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${index < step ? 'border-pink-500 bg-pink-100 dark:bg-pink-900' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'} font-bold`}>{index + 1}</div>
                <span className="mt-1">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div layout className={`md:col-span-2 p-6 ${step < 4 ? 'bg-white dark:bg-gray-800 shadow-xl rounded-2xl' : 'md:col-span-3'}`}>
            {getStepContent()}
          </motion.div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl h-fit">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-white"><ShoppingBag className="w-6 h-6 mr-2 text-pink-500" /> Order Summary</h2>
              
              {/* ⭐ 6. Updated to use correct item keys */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.cart_item_id} className="flex items-start gap-3 border-b pb-3 dark:border-gray-700">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800 dark:text-white line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-pink-600">₹{(parseFloat(item.discounted_price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span>{shippingFee === 0 ? <span className='text-green-500'>FREE</span> : `₹${shippingFee.toFixed(2)}`}</span></div>
                <div className="flex justify-between pt-2 border-t dark:border-gray-700 font-bold text-xl text-gray-800 dark:text-white">
                  <span>Total:</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;