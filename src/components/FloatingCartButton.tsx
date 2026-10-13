import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';

export const FloatingCartButton: React.FC = () => {
  const {
    totalCartItemCount,
    subtotal,
    setCurrentView,
    setIsCartOpen,
    currentView,
    lastAddedItem,
    cartBounceKey,
  } = useRestaurant();

  const [isBouncing, setIsBouncing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [lastItemName, setLastItemName] = useState('');

  // Trigger attention animation whenever an item is added
  useEffect(() => {
    if (cartBounceKey > 0 && lastAddedItem) {
      setIsBouncing(true);
      setLastItemName(lastAddedItem.name);
      setShowNotification(true);

      const bounceTimer = setTimeout(() => {
        setIsBouncing(false);
      }, 700);

      const notifTimer = setTimeout(() => {
        setShowNotification(false);
      }, 2600);

      return () => {
        clearTimeout(bounceTimer);
        clearTimeout(notifTimer);
      };
    }
  }, [cartBounceKey, lastAddedItem]);

  // Don't show floating icon if already on cart, checkout or confirmation
  if (currentView === 'cart' || currentView === 'checkout' || currentView === 'confirmation') {
    return null;
  }

  const handleClick = () => {
    setIsCartOpen(false); // Close modal drawer if any
    setCurrentView('cart'); // Open the Cart Page as requested
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-24 sm:bottom-24 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Toast popup showing the recently added item */}
      {showNotification && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs"
        >
          <div className="bg-[#1A1D24] text-white px-3.5 py-2 rounded-xl shadow-2xl border border-[#FF5B26]/60 flex items-center gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </span>
            <div className="truncate">
              <span className="font-semibold text-[#FF5B26] block text-[10px] uppercase tracking-wider">
                Added to Cart
              </span>
              <span className="text-white font-medium truncate block max-w-[180px]">
                {lastItemName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Cart Button */}
      <button
        type="button"
        onClick={handleClick}
        className={`pointer-events-auto group relative flex items-center gap-2.5 sm:gap-3 p-3 sm:px-4 sm:py-3 rounded-full transition-all duration-300 cursor-pointer shadow-2xl ${
          isBouncing
            ? 'scale-115 ring-4 ring-[#FF5B26] bg-[#FF5B26] text-white shadow-[#FF5B26]/60'
            : totalCartItemCount > 0
            ? 'bg-[#14161C] hover:bg-[#1C1F28] text-white border-2 border-[#FF5B26] hover:scale-105 active:scale-95 shadow-black/80'
            : 'bg-[#14161C]/90 hover:bg-[#1A1D24] text-neutral-300 border border-[#272B35] hover:scale-105 active:scale-95 shadow-black/60'
        }`}
        title={`View Cart (${totalCartItemCount} items)`}
        aria-label={`Open Cart Page with ${totalCartItemCount} items, subtotal $${subtotal.toFixed(2)}`}
      >
        {/* Subtle glow effect when items exist */}
        {totalCartItemCount > 0 && (
          <span className="absolute inset-0 rounded-full bg-[#FF5B26]/10 blur-sm -z-10 group-hover:bg-[#FF5B26]/20 transition-all" />
        )}

        {/* Icon & Count Badge */}
        <div className="relative flex items-center justify-center">
          <ShoppingBag
            className={`w-5 h-5 transition-transform duration-300 ${
              isBouncing
                ? 'scale-110 text-white'
                : totalCartItemCount > 0
                ? 'text-[#FF5B26] group-hover:scale-110'
                : 'text-neutral-400 group-hover:text-white'
            }`}
          />

          {/* Badge count that updates on add */}
          {totalCartItemCount > 0 && (
            <span
              className={`absolute -top-2.5 -right-2.5 font-mono text-[11px] font-extrabold min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-[#14161C] transition-transform ${
                isBouncing
                  ? 'bg-white text-[#FF5B26] scale-125'
                  : 'bg-[#FF5B26] text-white scale-100'
              }`}
            >
              {totalCartItemCount}
            </span>
          )}
        </div>

        {/* Cart Text & Subtotal (Visible on sm+ screens, or when cart has items) */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isBouncing ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
            }`}
          >
            Cart Page
          </span>
          <span
            className={`font-mono text-xs font-bold ${
              isBouncing ? 'text-white' : 'text-white'
            }`}
          >
            {totalCartItemCount > 0 ? `$${subtotal.toFixed(2)}` : 'Empty'}
          </span>
        </div>

        {/* Quick arrow hint */}
        <ArrowRight
          className={`hidden sm:block w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
            isBouncing ? 'text-white' : 'text-neutral-400 group-hover:text-white'
          }`}
        />
      </button>
    </div>
  );
};
