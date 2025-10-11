import React, { useState, useEffect } from 'react';

const OfferBar = () => {
  // State for the offer text, loading status, and visibility
  const [offerText, setOfferText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/offers/active');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // --- THIS IS THE FIX ---
        // We now check for the correct path: data.data.description
        if (data && data.data && data.data.description) {
          setOfferText(data.data.description); // Get text from the correct path
        } else {
          setOfferText(''); 
          console.warn("Offer description was not found in the API response structure.");
        }

      } catch (error) {
        console.error("Failed to fetch offer:", error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, []);

  const handleClose = () => setIsVisible(false);

  // Inline styles for the animation
  const styles = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
  `;

  if (isLoading || !offerText || !isVisible) {
    return null;
  }

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

export default OfferBar;