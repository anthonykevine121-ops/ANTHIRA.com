import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, Menu as MenuIcon, X, SlidersHorizontal, MapPin, Clock, Phone, Award, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    restaurantInfo,
    currentView,
    setCurrentView,
    totalCartItemCount,
    setIsCartOpen,
    setIsOwnerModalOpen,
    setIsUserSettingsOpen,
    currentProgressOrders,
    loyaltyTargetOrders,
    isOpenNow,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'menu' | 'cart' | 'about' | 'contact' | 'checkout' | 'confirmation') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E1013]/95 backdrop-blur-md border-b border-[#1F2228] transition-all">
      {/* Top micro-bar for hours, phone, and quick account access */}
      <div className="bg-[#090A0C] text-[#D0D4DC] text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between font-sans border-b border-[#181A1F]">
        <div className="flex items-center gap-3 sm:gap-6 truncate">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-[#FF5B26]'}`}
              aria-hidden="true"
            />
            <span className="font-medium text-white">{isOpenNow ? 'Kitchen Open for Orders' : 'Taking Advance Scheduled Orders'}</span>
          </div>
          <span className="hidden md:inline text-neutral-600">·</span>
          <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-[#FF5B26]" />
            <span>Daily: 12:00 PM – 11:00 PM</span>
          </div>
          <span className="hidden lg:inline text-neutral-600">·</span>
          <div className="hidden lg:flex items-center gap-1.5 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#FF5B26]" />
            <span className="truncate">{restaurantInfo.address}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-neutral-400 shrink-0">
          <a
            href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Call restaurant"
          >
            <Phone className="w-3 h-3 text-[#FF5B26]" />
            <span className="hidden sm:inline font-mono text-[11px]">{restaurantInfo.phone}</span>
          </a>

          {/* User Settings & Loyalty shortcut */}
          <button
            onClick={() => setIsUserSettingsOpen(true)}
            className="text-[11px] text-neutral-300 hover:text-[#FF5B26] flex items-center gap-1.5 transition-colors pl-2 border-l border-neutral-800 cursor-pointer"
            title="Open Loyalty Rewards & User Settings"
          >
            <Award className="w-3 h-3 text-[#FF5B26]" />
            <span className="font-semibold text-white">Rewards</span>
            <span className="font-mono text-[10px] text-[#FF5B26]">({currentProgressOrders}/{loyaltyTargetOrders})</span>
          </button>

          <button
            onClick={() => setIsOwnerModalOpen(true)}
            className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors pl-2 border-l border-neutral-800 cursor-pointer hidden md:flex"
            title="Restaurant Owner Control Panel"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Owner</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark in English */}
        <div className="flex items-center">
          <button
            onClick={() => handleNav('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded bg-[#FF5B26] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-md shadow-[#FF5B26]/20">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#FF5B26] transition-colors">
                Hush
              </span>
              <span className="text-[10px] tracking-widest uppercase text-neutral-400 -mt-1 font-medium">
                Modern Restaurant
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links in English */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-neutral-300">
          <button
            onClick={() => handleNav('home')}
            className={`cursor-pointer transition-colors hover:text-[#FF5B26] relative py-1 ${
              currentView === 'home' ? 'text-white font-semibold' : ''
            }`}
          >
            Home
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B26] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleNav('menu')}
            className={`cursor-pointer transition-colors hover:text-[#FF5B26] relative py-1 ${
              currentView === 'menu' ? 'text-white font-semibold' : ''
            }`}
          >
            Menu & Ordering
            {currentView === 'menu' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B26] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleNav('cart')}
            className={`cursor-pointer transition-colors hover:text-[#FF5B26] relative py-1 flex items-center gap-1.5 ${
              currentView === 'cart' ? 'text-white font-semibold' : ''
            }`}
          >
            <span>Cart</span>
            {totalCartItemCount > 0 && (
              <span className="bg-[#FF5B26] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {totalCartItemCount}
              </span>
            )}
            {currentView === 'cart' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B26] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`cursor-pointer transition-colors hover:text-[#FF5B26] relative py-1 ${
              currentView === 'about' ? 'text-white font-semibold' : ''
            }`}
          >
            Our Story & Craft
            {currentView === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B26] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`cursor-pointer transition-colors hover:text-[#FF5B26] relative py-1 ${
              currentView === 'contact' ? 'text-white font-semibold' : ''
            }`}
          >
            Location & Hours
            {currentView === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B26] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Loyalty Rewards button */}
          <button
            onClick={() => setIsUserSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181B22] hover:bg-[#222630] border border-[#272B35] text-xs font-semibold text-white transition-colors cursor-pointer"
            title="Loyalty Rewards"
          >
            <Award className="w-3.5 h-3.5 text-[#FF5B26]" />
            <span className="hidden sm:inline">Loyalty:</span>
            <span className="text-[#FF5B26] font-mono">{currentProgressOrders}/{loyaltyTargetOrders}</span>
          </button>

          <button
            onClick={() => handleNav('menu')}
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#FF5B26] hover:bg-[#E04515] transition-colors rounded-full shadow-md shadow-[#FF5B26]/20 focus:outline-none cursor-pointer"
          >
            Order Now
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 rounded-full text-white hover:text-[#FF5B26] hover:bg-[#1A1D23] transition-colors cursor-pointer"
            aria-label={`Shopping bag with ${totalCartItemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF5B26] text-white font-mono text-[11px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalCartItemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-neutral-300 hover:text-white hover:bg-[#1A1D23] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1F2228] bg-[#0E1013] px-4 pt-3 pb-6 shadow-2xl">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors ${
                currentView === 'home' ? 'bg-[#181A1F] text-[#FF5B26]' : 'text-neutral-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('menu')}
              className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors ${
                currentView === 'menu' ? 'bg-[#181A1F] text-[#FF5B26]' : 'text-neutral-200'
              }`}
            >
              Menu & Ordering
            </button>
            <button
              onClick={() => handleNav('cart')}
              className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors flex items-center justify-between ${
                currentView === 'cart' ? 'bg-[#181A1F] text-[#FF5B26]' : 'text-neutral-200'
              }`}
            >
              <span>Shopping Cart</span>
              {totalCartItemCount > 0 && (
                <span className="bg-[#FF5B26] text-white text-xs px-2 py-0.5 rounded-full font-mono">
                  {totalCartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors ${
                currentView === 'about' ? 'bg-[#181A1F] text-[#FF5B26]' : 'text-neutral-200'
              }`}
            >
              Our Story & Craft
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors ${
                currentView === 'contact' ? 'bg-[#181A1F] text-[#FF5B26]' : 'text-neutral-200'
              }`}
            >
              Location & Hours
            </button>

            <div className="pt-4 border-t border-[#1F2228] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsUserSettingsOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#181A20] text-white border border-[#2B303C] rounded-full font-medium text-sm"
              >
                <Award className="w-4 h-4 text-[#FF5B26]" />
                <span>Loyalty Rewards ({currentProgressOrders}/{loyaltyTargetOrders} Orders)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF5B26] text-white rounded-full font-medium text-sm shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({totalCartItemCount} items)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOwnerModalOpen(true);
                }}
                className="w-full py-2.5 text-center text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Restaurant Owner Settings
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
