import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ASSET_IMAGES } from '../data/defaultRestaurantData';
import { Check, ArrowRight, Sparkles, Plus, ShoppingBag } from 'lucide-react';
import { SelectedModifier } from '../types/restaurant';

export const CustomSushiSection: React.FC = () => {
  const { menuItems, setSelectedDish, addToCart, setCurrentView } = useRestaurant();
  const [added, setAdded] = useState(false);

  const signaturePlatter =
    menuItems.find((m) => m.id === 'hush-slate-omakase-platter') || menuItems[0];

  const handleQuickAddPlatter = () => {
    if (!signaturePlatter) return;
    const defaultModifiers: SelectedModifier[] = [];
    if (signaturePlatter.modifiers) {
      signaturePlatter.modifiers.forEach((mod) => {
        if (mod.options.length > 0) {
          const firstOpt = mod.options[0];
          defaultModifiers.push({
            modifierId: mod.id,
            modifierName: mod.name,
            optionId: firstOpt.id,
            optionName: firstOpt.name,
            priceDelta: firstOpt.priceDelta,
          });
        }
      });
    }
    addToCart(signaturePlatter, 1, defaultModifiers, '');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenCustomizer = () => {
    setSelectedDish(signaturePlatter);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#121418] text-white border-t border-[#1E222A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Customization Bullet Points */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Omakase Box</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Make to Your Liking:
              <br />
              <span className="text-[#FF5B26]">Custom Sushi Combos</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Craft your bespoke sushi set from our selection of pristine raw cuts, torched aburi specialties, and house-infused dipping sauces. Prepared fresh and packed in temperature-retaining presentation bento boxes.
            </p>

            {/* Customizer Checklist */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Choose your preferred nigiri cuts (Salmon, Bluefin Tuna, Yellowtail, Hokkaido Uni)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Customize rice type (Aged Akazu White Rice or Organic Brown Sushi Rice)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Select house sauces: Barrel-Aged Nikiri Soy, Spicy Yuzu Ponzu, or Gluten-Free Tamari</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Add izakaya appetizers: Wagyu lace dumplings, red miso soup, or truffle edamame</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleQuickAddPlatter}
                className={`px-7 py-3.5 text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-600 shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-[#FF5B26] hover:bg-[#E04515] shadow-[#FF5B26]/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (${signaturePlatter.price.toFixed(0)})</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleOpenCustomizer}
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-[#2F3440] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Customize Pieces
              </button>
            </div>
          </div>

          {/* Right Column: Circular plate sushi showcase (Matches Section 4 mockup) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Circular backing glow */}
              <div className="absolute inset-0 bg-[#FF5B26]/10 rounded-full blur-3xl transform scale-90" />

              <div className="relative aspect-square rounded-full overflow-hidden border-4 border-[#272B35] shadow-2xl bg-[#0A0B0E]">
                <img
                  src={ASSET_IMAGES.dragonMakiRoll}
                  alt="Specialty sushi rolls on dark slate plate with chopsticks"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#121418]/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#2B303C] text-center shadow-lg whitespace-nowrap">
                  <span className="text-xs font-bold text-white block">
                    Hand-Rolled to Order
                  </span>
                  <span className="text-[11px] text-[#FF5B26] font-medium">
                    100% Sustainably Sourced
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
