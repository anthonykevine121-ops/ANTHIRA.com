import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { SlidersHorizontal, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { restaurantInfo, setCurrentView, setIsOwnerModalOpen } = useRestaurant();

  const handleNav = (view: 'home' | 'menu' | 'about' | 'contact') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090B] text-neutral-400 border-t border-[#1C1F26] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#FF5B26] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-md shadow-[#FF5B26]/20">
                H
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {restaurantInfo.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {restaurantInfo.tagline}. Line-caught wild seafood air-shipped four times weekly directly from Tokyo's Toyosu Market, served with aged akazu vinegar rice.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Omakase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Menu & Online Ordering
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Toyosu Heritage & Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Table Reservations & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Hours Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kitchen Hours
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Mon – Thu:</span>
                <span className="font-mono text-white">12:00 PM – 10:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sat:</span>
                <span className="font-mono text-white">12:00 PM – 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-mono text-white">12:30 PM – 9:30 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              San Francisco Lounge
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5B26] shrink-0 mt-0.5" />
                <span>
                  {restaurantInfo.address}
                  <br />
                  {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zip}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF5B26] shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}
                  className="hover:text-white font-mono"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF5B26] shrink-0" />
                <a href={`mailto:${restaurantInfo.email}`} className="hover:text-white">
                  {restaurantInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with owner mode button & copyright */}
        <div className="pt-8 border-t border-[#1C1F26] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.</span>
            <span>·</span>
            <span>Financial District, San Francisco</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="text-neutral-400 hover:text-[#FF5B26] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Owner Management Mode</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
