import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  AlertCircle,
  Truck,
  Store,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    discountAmount,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    fulfillmentType,
    setFulfillmentType,
    setCurrentView,
    restaurantInfo,
  } = useRestaurant();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-[#121418] text-white shadow-2xl flex flex-col border-l border-[#272B35]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-[#222630] bg-[#0E1013] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF5B26]" />
              <h2 id="cart-drawer-title" className="text-xl font-bold text-white">
                Your Sushi Order
              </h2>
              <span className="font-mono text-xs text-neutral-400 tabular-nums">
                ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1A1D24] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Switch (Delivery vs Pickup) */}
          <div className="p-4 bg-[#16181E] border-b border-[#222630]">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0E1013] rounded-xl border border-[#272B35]">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'bg-[#FF5B26] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery (~30-40m)</span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'bg-[#FF5B26] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Pickup (~20-25m)</span>
              </button>
            </div>
          </div>

          {/* Cart Item List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#181A20] border border-[#272B35] flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-lg font-bold text-white">Your bag is currently empty</h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Explore our handcrafted nigiri, specialty dragon rolls, and omakase platters to build your order.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('menu');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3.5 bg-[#181B22] rounded-xl border border-[#272B35] shadow-xs space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover object-center bg-[#0E1013] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="font-mono text-sm font-bold text-white tabular-nums shrink-0">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Modifiers List */}
                        {item.selectedModifiers.length > 0 && (
                          <div className="text-[11px] text-neutral-400 mt-1 space-y-0.5">
                            {item.selectedModifiers.map((m, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>+ {m.optionName}</span>
                                {m.priceDelta > 0 && (
                                  <span className="font-mono tabular-nums text-[#FF5B26]">+${m.priceDelta.toFixed(2)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <p className="text-[11px] italic text-neutral-400 mt-1 line-clamp-1">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls and delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#252933]">
                      <div className="flex items-center border border-[#272B35] rounded-lg bg-[#121418]">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          className="p-1 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-mono text-xs font-bold tabular-nums text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          className="p-1 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-xs text-neutral-500 hover:text-red-400 transition-colors pt-2 cursor-pointer"
                >
                  Clear all items from bag
                </button>
              </div>
            )}
          </div>

          {/* Promo code & Totals Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#222630] bg-[#0E1013] space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold">{appliedPromo.code}</span>
                        <span className="text-emerald-300 block text-[11px]">{appliedPromo.description}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs text-emerald-300 hover:text-red-400 font-semibold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Promo code (e.g. WELCOME10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26] uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#20232B] hover:bg-[#2B303C] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{promoError}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Itemized Calculation Summary */}
              <div className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-[#222630]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    {fulfillmentType === 'delivery' ? 'Estimated Delivery Fee' : 'Curbside Pickup'}
                  </span>
                  <span className="font-mono tabular-nums text-white">
                    {fulfillmentType === 'delivery'
                      ? deliveryFee === 0
                        ? 'FREE'
                        : `$${deliveryFee.toFixed(2)}`
                      : 'Free'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes ({restaurantInfo.taxRatePercent}%)</span>
                  <span className="font-mono tabular-nums text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#222630]">
                  <span>Estimated Total</span>
                  <span className="font-mono font-bold tabular-nums text-[#FF5B26]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 px-4 bg-[#FF5B26] hover:bg-[#E04515] text-white font-bold text-sm rounded-xl flex items-center justify-between shadow-lg shadow-[#FF5B26]/25 transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="font-mono font-bold tabular-nums">${grandTotal.toFixed(2)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentView('cart');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 text-center text-xs font-semibold text-neutral-300 hover:text-white bg-[#1A1D24] hover:bg-[#222630] border border-[#272B35] rounded-xl transition-colors cursor-pointer"
                  >
                    View Full Cart Page →
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
