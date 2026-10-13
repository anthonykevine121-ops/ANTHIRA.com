import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ASSET_IMAGES } from '../data/defaultRestaurantData';
import { Sparkles, Utensils, ShieldCheck, HeartHandshake, ArrowRight, Flame } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { restaurantInfo, setCurrentView } = useRestaurant();

  const values = [
    {
      icon: ShieldCheck,
      title: 'Toyosu Fish Market Direct',
      description: 'We partner directly with selective intermediate wholesalers in Tokyo to air-ship seasonal bluefin tuna, sea urchin, and line-caught snapper within 24 hours of catch.',
    },
    {
      icon: Utensils,
      title: 'Aged Red Akazu Sushi Rice',
      description: 'Our sushi rice is seasoned with traditional red sake-lees vinegar (akazu), fermented for 3 years to develop umami notes that marry with rich fatty fish.',
    },
    {
      icon: Flame,
      title: 'Binchotan Aburi Searing',
      description: 'We flash-sear select nigiri cuts over pure Japanese white Kishu Binchotan charcoal, rendering pristine fats without creating bitter acrid smoke.',
    },
    {
      icon: HeartHandshake,
      title: 'Omakase Hospitality (Omotenashi)',
      description: 'Every interaction at Hush honors the spirit of Omotenashi: anticipating your dining comfort with unhurried grace, warmth, and attention to detail.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#0E1013] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Story Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D23] border border-[#2A2E38] text-xs font-semibold text-[#FF5B26]">
            <span>Toyosu Direct</span>
            <span aria-hidden="true">·</span>
            <span>Edomae Sushi Craft</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Tokyo Heritage, Knife Mastery, & Modern Gastronomy
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            {restaurantInfo.story}
          </p>
        </div>

        {/* Big Visual Split */}
        <div className="relative rounded-3xl overflow-hidden border border-[#272B35] shadow-2xl">
          <img
            src={ASSET_IMAGES.heroSlatePlatter}
            alt="Artisanal sushi platter at Hush Modern Restaurant"
            referrerPolicy="no-referrer"
            className="w-full h-[400px] sm:h-[520px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-xl text-white">
            <span className="text-xs uppercase tracking-widest text-[#FF5B26] font-bold block mb-2">
              The Omakase Spirit
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
              "Sushi is not merely fish on rice; it is a fleeting dialogue of temperature, texture, and ocean season."
            </h3>
          </div>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#FF5B26] font-bold block mb-2">
              The Craft
            </span>
            <h2 className="text-3xl font-bold text-white">
              The Four Pillars of Hush Modern
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#16181E] p-6 rounded-2xl border border-[#272B35] shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0E1013] border border-[#2B303C] flex items-center justify-center text-[#FF5B26]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{val.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef Spotlight */}
        <div className="bg-[#14161C] rounded-3xl p-8 sm:p-12 border border-[#272B35] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-[#2B303C] shadow-md bg-[#0A0B0E]">
            <img
              src={ASSET_IMAGES.salmonNigiriTrio}
              alt="Pristine salmon nigiri sushi prepared by master itamae"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#FF5B26] font-bold block">
              Meet the Itamae
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Executive Chef Kenji Takahashi
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              With 18 years of classical sushi training in Ginza and Roppongi, Chef Kenji founded Hush to celebrate the purity of traditional Edomae preparation while welcoming modern dining rhythms. Each morning, he inspects the overnight air shipments from Toyosu to curate that day's nigiri menu.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => setCurrentView('menu')}
                className="px-6 py-3 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span>Explore the Seasonal Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
