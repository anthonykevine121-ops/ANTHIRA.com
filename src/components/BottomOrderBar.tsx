import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, ArrowRight, Truck, Store, Flame } from 'lucide-react';

export const BottomOrderBar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    totalCartItemCount,
    grandTotal,
    subtotal,
    fulfillmentType,
    restaurantInfo,
    isOpenNow,
  } = useRestaurant();

  // Hide the bar during checkout or order confirmation to keep those flows distraction-free
  if (currentView === 'checkout' || currentView === 'confirmation' || currentView === 'cart') {
    return null;
  }

  const handleBottomAction = () => {
    if (totalCartItemCount > 0) {
      setCurrentView('cart');
    } else {
      setCurrentView('menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick order bar"
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#0E1013]/95 backdrop-blur-md border-t border-[#222630] py-2.5 sm:py-3 px-4 sm:px-8 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Info: Cart summary or kitchen status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#181B22] border border-[#272B35] flex items-center justify-center text-[#FF5B26] shrink-0">
            {totalCartItemCount > 0 ? (
              <ShoppingBag className="w-4 h-4" />
            ) : (
              <Flame className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            {totalCartItemCount > 0 ? (
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {totalCartItemCount} {totalCartItemCount === 1 ? 'Dish' : 'Dishes'} in Bag
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FF5B26] tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
                  {fulfillmentType === 'delivery' ? (
                    <>
                      <Truck className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate">Delivery ({restaurantInfo.estimatedDeliveryMinutes})</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span className="truncate">Curbside Pickup ({restaurantInfo.estimatedPickupMinutes})</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    Hush Modern Restaurant
                  </span>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="hidden sm:inline text-xs text-neutral-400">
                    {isOpenNow ? 'Kitchen Open for Orders' : 'Advance Orders Open'}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <span className="truncate">
                    Delivery & Curbside Pickup · {restaurantInfo.estimatedPickupMinutes} ready time
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action: Prominent "Order Now" & "View Cart" Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {totalCartItemCount > 0 ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex px-4 py-2 sm:py-2.5 bg-[#1A1D24] hover:bg-[#242832] text-neutral-200 hover:text-white font-semibold text-xs rounded-full border border-[#2B303C] transition-colors cursor-pointer"
              >
                + Add Dishes
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('cart');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#FF5B26] hover:bg-[#E04515] active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#FF5B26]/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart & Checkout (${subtotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('cart');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex px-3.5 py-2 bg-[#181B22] hover:bg-[#20232B] text-neutral-300 hover:text-white font-semibold text-xs rounded-full border border-[#272B35] transition-colors cursor-pointer items-center gap-1.5"
                title="View empty cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                <span>Cart (0)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#FF5B26] hover:bg-[#E04515] active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#FF5B26]/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
