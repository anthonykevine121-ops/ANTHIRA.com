import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ASSET_IMAGES } from '../data/defaultRestaurantData';
import { ArrowRight, Sparkles, Clock, MapPin, Truck, ShoppingBag, ShieldCheck, Check, Plus } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    restaurantInfo,
    setCurrentView,
    fulfillmentType,
    setFulfillmentType,
    addToCart,
    menuItems,
  } = useRestaurant();

  const [heroAdded, setHeroAdded] = useState(false);

  const handleStartOrder = (type: 'delivery' | 'pickup') => {
    setFulfillmentType(type);
    setCurrentView('menu');
  };

  const handleAddHeroPlatter = () => {
    const platter =
      menuItems.find((m) => m.name.toLowerCase().includes('slate') || m.price === 58) ||
      menuItems[0];
    if (platter) {
      addToCart(platter, 1);
      setHeroAdded(true);
      setTimeout(() => setHeroAdded(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0E1013] text-white">
      {/* Background radial gradient & texture highlights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF5B26]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1A1D24]/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs (Matches mockup) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D23] border border-[#2A2E38] text-xs font-semibold text-[#FF5B26]">
              <span className="w-2 h-2 rounded-full bg-[#FF5B26] animate-pulse" />
              <span>Modern Tokyo Cuisine & Omakase</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] [text-wrap:balance]">
              Hush Modern
              <br />
              <span className="text-white/90">Restaurant</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light max-w-lg">
              Fresh Toyosu market catch, aged akazu sushi rice, and meticulous knife craft. Experience contemporary Japanese gastronomy delivered to your doorstep or ready for pickup.
            </p>

            {/* Interactive Fulfillment Choice Switch */}
            <div className="bg-[#16181E] border border-[#272B35] p-1.5 rounded-xl max-w-md">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    fulfillmentType === 'delivery'
                      ? 'bg-[#FF5B26] text-white shadow-md shadow-[#FF5B26]/20'
                      : 'text-neutral-400 hover:text-white hover:bg-[#20232B]'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Delivery ({restaurantInfo.estimatedDeliveryMinutes})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    fulfillmentType === 'pickup'
                      ? 'bg-[#FF5B26] text-white shadow-md shadow-[#FF5B26]/20'
                      : 'text-neutral-400 hover:text-white hover:bg-[#20232B]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pickup ({restaurantInfo.estimatedPickupMinutes})</span>
                </button>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartOrder(fulfillmentType)}
                className="px-7 py-3.5 bg-[#FF5B26] hover:bg-[#E04515] text-white font-semibold text-sm rounded-full tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-[#FF5B26]/25 hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('menu')}
                className="px-6 py-3.5 bg-[#181B22] hover:bg-[#222630] text-white font-medium text-sm rounded-full border border-[#2B303C] hover:border-neutral-500 transition-all cursor-pointer"
              >
                View Full Menu
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF5B26] shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Speed</span>
                  <span>25m Average</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF5B26] shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Toyosu Fresh</span>
                  <span>Air-flown 4x/wk</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5B26] shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Zero Fee</span>
                  <span>Curbside Pickup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Slate Sushi Platter (Matches the mockup photo presentation) */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative group max-w-lg w-full">
              {/* Outer decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF5B26]/20 via-[#FF5B26]/5 to-transparent rounded-3xl blur-2xl opacity-75" />

              {/* Main Slate Board Container with subtle rotation and 3D shadow */}
              <div className="relative rounded-2xl overflow-hidden border border-[#2B303C] shadow-2xl bg-[#121418] transition-transform duration-500 group-hover:scale-[1.01]">
                <img
                  src={ASSET_IMAGES.heroSlatePlatter}
                  alt="Overhead presentation of Hush Modern Restaurant sushi platter with salmon nigiri, sashimi, and maki rolls"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover object-center aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Dish Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#121418]/90 backdrop-blur-md p-3 rounded-xl border border-[#2B303C] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#FF5B26] font-bold block">
                      Chef's Signature Board
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      Modern Slate Omakase Platter
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHeroPlatter}
                    className={`px-3.5 py-1.5 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                      heroAdded
                        ? 'bg-emerald-600 scale-105 ring-2 ring-emerald-400/50'
                        : 'bg-[#FF5B26] hover:bg-[#E04515] active:scale-95'
                    }`}
                    title="Add to Cart"
                  >
                    {heroAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>$58.00 · Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Torn Paper / Sumi-e Ink Brush Border Transition to Clean White Section (Matching mockup) */}
      <div className="relative w-full overflow-hidden leading-none z-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-20 text-white fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,80 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};
