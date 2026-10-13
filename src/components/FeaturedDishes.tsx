import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, SelectedModifier } from '../types/restaurant';
import { Plus, ArrowRight, Sparkles, Check } from 'lucide-react';

export const FeaturedDishes: React.FC = () => {
  const { menuItems, setSelectedDish, addToCart, setCurrentView } = useRestaurant();
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  // Pick top signature items
  const featured = menuItems.filter((item) => item.dietary.includes('chef-choice')).slice(0, 3);

  const handleCardClick = (dish: MenuItem) => {
    setSelectedDish(dish);
  };

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();

    // Directly add dish to cart with initial default options if modifiers exist
    const defaultModifiers: SelectedModifier[] = [];
    if (dish.modifiers && dish.modifiers.length > 0) {
      dish.modifiers.forEach((mod) => {
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

    addToCart(dish, 1, defaultModifiers, '');
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId((curr) => (curr === dish.id ? null : curr));
    }, 1500);
  };

  return (
    <section className="py-16 sm:py-24 bg-white text-[#121418]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Centered like in the mockup) */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Nigiri & Rolls</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121418]">
            Curated Sushi Selections
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 font-light">
            Every piece is hand-pressed to order by our itamae sushi masters using fresh Toyosu catch and aged akazu vinegar rice.
          </p>
        </div>

        {/* 3-Column Card Layout matching the mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dish) => (
            <div
              key={dish.id}
              onClick={() => handleCardClick(dish)}
              className="group bg-[#FBFBFB] hover:bg-white rounded-2xl overflow-hidden border border-[#E9EBEF] hover:border-[#FF5B26]/40 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Product Image Slot */}
              <div className="relative aspect-[4/3] bg-[#F0F2F5] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5">
                    {dish.italianName && <span className="font-medium text-[#FF5B26]">{dish.italianName}</span>}
                    {dish.italianName && <span aria-hidden="true">·</span>}
                    <span>{dish.prepTimeMinutes}m prep</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#121418] group-hover:text-[#FF5B26] transition-colors mb-2">
                    {dish.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4 font-light">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EEF0F3] flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-lg font-bold text-[#121418] tabular-nums">
                      ${dish.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, dish)}
                    className={`text-xs font-semibold text-white px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                      addedDishId === dish.id
                        ? 'bg-emerald-600 scale-102 ring-2 ring-emerald-400/50'
                        : 'bg-[#FF5B26] hover:bg-[#E04515] active:scale-95'
                    }`}
                  >
                    {addedDishId === dish.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore all menu button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#121418] hover:bg-[#20232B] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-sm"
          >
            <span>Explore Complete Omakase & Roll Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
