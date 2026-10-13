import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ASSET_IMAGES } from '../data/defaultRestaurantData';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Utensils, Award } from 'lucide-react';

export const RestaurantHighlights: React.FC = () => {
  const { menuItems, setSelectedDish, setCurrentView } = useRestaurant();

  const specialtyItems = [
    {
      item: menuItems.find((m) => m.id === 'chirashi-sashimi-donburi') || menuItems[1],
      badge: 'Chef Omakase',
      highlight: 'Toyosu line-caught bluefin, salmon, yellowtail & Hokkaido ikura',
    },
    {
      item: menuItems.find((m) => m.id === 'hush-signature-dragon') || menuItems[2],
      badge: 'Signature Roll',
      highlight: 'Crispy tiger prawn, BBQ unagi kabayaki, avocado & spicy tobiko',
    },
    {
      item: menuItems.find((m) => m.id === 'crispy-wagyu-lace-gyoza') || menuItems[3],
      badge: 'Izakaya Favorite',
      highlight: 'A5 Miyazaki wagyu beef with golden crispy lace skirt & chili ponzu',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0E1013] text-white border-t border-[#1C1F26] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5B26]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header (Centered like in the mockup) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Itamae Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Our Specialty Sushi Craft
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light">
            Rooted in Tokyo traditions, elevated with contemporary flair. Each creation is composed with balance, texture, and uncompromising freshness.
          </p>
        </div>

        {/* 3 Showcase Floating Cards on Dark Slate (Matches mockup Section 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialtyItems.map((entry, idx) => {
            const dish = entry.item;
            if (!dish) return null;
            return (
              <div
                key={idx}
                onClick={() => setSelectedDish(dish)}
                className="group bg-[#16181E] hover:bg-[#1A1D24] rounded-2xl overflow-hidden border border-[#272B35] hover:border-[#FF5B26]/50 shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[#0A0B0D] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181E] via-transparent to-transparent opacity-80" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-[#0E1013]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#2A2E38] text-[11px] font-semibold text-[#FF5B26]">
                    {entry.badge}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF5B26] transition-colors mb-1.5">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 font-light leading-relaxed">
                      {entry.highlight}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#252933] flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      ${dish.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDish(dish);
                      }}
                      className="px-3.5 py-1.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Customize & Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181A20] border border-[#272B35] flex items-center justify-center text-[#FF5B26]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Toyosu Direct</span>
              <span className="text-neutral-400 text-[11px]">Sustainably wild-caught</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181A20] border border-[#272B35] flex items-center justify-center text-[#FF5B26]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Aburi Torched</span>
              <span className="text-neutral-400 text-[11px]">Binchotan sear & glaze</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181A20] border border-[#272B35] flex items-center justify-center text-[#FF5B26]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Red Akazu Rice</span>
              <span className="text-neutral-400 text-[11px]">Organic Koshihikari grains</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181A20] border border-[#272B35] flex items-center justify-center text-[#FF5B26]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Fresh Hon-Wasabi</span>
              <span className="text-neutral-400 text-[11px]">Shizuoka grated root</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
