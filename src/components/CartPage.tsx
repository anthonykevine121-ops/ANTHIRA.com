import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Store,
  Tag,
  Check,
  AlertCircle,
  Gift,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
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
    restaurantInfo,
    setCurrentView,
    setIsUserSettingsOpen,
    currentProgressOrders,
    loyaltyTargetOrders,
    progressPercent,
    isRewardUnlocked,
    claimFreeLoyaltyItem,
    menuItems,
    addToCart,
  } = useRestaurant();

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  // Recommendations for items not yet in cart
  const recommendations = menuItems
    .filter((dish) => !cart.some((c) => c.menuItem.id === dish.id))
    .slice(0, 3);

  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#0E1013] text-white min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#181B22] border border-[#272B35] flex items-center justify-center mx-auto text-neutral-500 shadow-xl">
            <ShoppingBag className="w-10 h-10 stroke-1 text-[#FF5B26]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Cart is Empty</h1>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              You haven't added any dishes to your order yet. Explore our handcrafted nigiri, specialty dragon rolls, and omakase platters.
            </p>
          </div>

          {/* Loyalty Banner inside empty cart */}
          <div className="p-4 bg-[#14161C] rounded-2xl border border-[#272B35] text-left flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <span className="font-bold text-white block">Member Rewards Active</span>
              <span className="text-neutral-400">
                You have {currentProgressOrders} of {loyaltyTargetOrders} orders toward a free signature roll.
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-[#FF5B26]/25 transition-all cursor-pointer"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#0E1013] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F2228] gap-4">
          <div>
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu & Add More Items</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Your Shopping Cart</span>
              <span className="text-xs font-mono font-bold text-neutral-400 px-3 py-1 rounded-full bg-[#1A1D24] border border-[#272B35]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCart}
              className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 px-3 py-2 rounded-lg border border-[#272B35] hover:border-red-500/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Loyalty Rewards Progress Bar on Cart Page */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#181A22] to-[#14161C] rounded-2xl border border-[#272B35] flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Loyalty Rewards Program</span>
                <span className="text-[10px] font-mono font-bold text-[#FF5B26] bg-[#FF5B26]/10 px-2 py-0.5 rounded-full">
                  {currentProgressOrders} of {loyaltyTargetOrders} Orders
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isRewardUnlocked
                  ? 'Reward Unlocked! Claim your complimentary Signature Dragon Roll today.'
                  : `You are only ${loyaltyTargetOrders - currentProgressOrders} order away from a complimentary signature roll!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="w-32 bg-[#0E1013] h-2.5 rounded-full overflow-hidden border border-[#2B303C]">
              <div
                className="bg-[#FF5B26] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {isRewardUnlocked ? (
              <button
                type="button"
                onClick={claimFreeLoyaltyItem}
                className="px-3.5 py-1.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Claim Free Roll
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsUserSettingsOpen(true)}
                className="text-xs font-semibold text-neutral-300 hover:text-white underline cursor-pointer shrink-0"
              >
                View Rewards
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Cart Items on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itemized List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="p-4 sm:p-5 bg-[#14161C] rounded-2xl border border-[#272B35] shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover object-center bg-[#0E1013] shrink-0 border border-[#272B35]"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white truncate">
                          {item.menuItem.name}
                        </h3>
                      </div>

                      {item.isRewardItem && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#FF5B26]/10 text-[#FF5B26] text-[10px] font-bold">
                          Free Loyalty Reward Item
                        </span>
                      )}

                      {/* Selected Modifiers */}
                      {item.selectedModifiers.length > 0 && (
                        <div className="text-[11px] text-neutral-400 space-y-0.5">
                          {item.selectedModifiers.map((m, idx) => (
                            <div key={idx} className="flex justify-between max-w-xs">
                              <span>+ {m.optionName}</span>
                              {m.priceDelta > 0 && (
                                <span className="font-mono text-[#FF5B26]">+${m.priceDelta.toFixed(2)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <p className="text-[11px] italic text-neutral-400">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}

                      <div className="text-xs font-mono text-neutral-400 pt-1">
                        Unit Price: ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Steppers and Line total */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222630]">
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      ${item.lineTotal.toFixed(2)}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#272B35] rounded-xl bg-[#181B22] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-mono text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations / Quick Add */}
            {recommendations.length > 0 && (
              <div className="pt-6 space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5B26]" />
                  <span>Frequently Paired With Your Order</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recommendations.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3 bg-[#14161C] rounded-xl border border-[#272B35] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">{dish.name}</span>
                        <span className="font-mono text-neutral-400">${dish.price.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(dish, 1, [], '')}
                        className="px-2.5 py-1 bg-[#20232B] hover:bg-[#FF5B26] text-white font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="p-6 bg-[#14161C] rounded-2xl border border-[#272B35] shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white pb-3 border-b border-[#222630]">
                Order Summary
              </h2>

              {/* Fulfillment Switcher */}
              <div className="p-1 bg-[#0E1013] rounded-xl border border-[#272B35] grid grid-cols-2 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    fulfillmentType === 'pickup'
                      ? 'bg-[#FF5B26] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Pickup (~20-25m)</span>
                </button>
              </div>

              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs text-emerald-200">
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

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#222630] text-xs text-neutral-300">
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

                <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-[#222630]">
                  <span>Total Due</span>
                  <span className="font-mono font-bold tabular-nums text-[#FF5B26]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setCurrentView('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 px-6 bg-[#FF5B26] hover:bg-[#E04515] text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-xl shadow-[#FF5B26]/30 flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="font-mono font-bold tabular-nums">${grandTotal.toFixed(2)}</span>
              </button>

              <div className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Checkout · Instant Kitchen Transmission</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
