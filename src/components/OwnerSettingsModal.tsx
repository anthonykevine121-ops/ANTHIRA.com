import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  Save,
  RotateCcw,
  Sliders,
  DollarSign,
  Utensils,
  Check,
  Building,
} from 'lucide-react';

export const OwnerSettingsModal: React.FC = () => {
  const {
    isOwnerModalOpen,
    setIsOwnerModalOpen,
    restaurantInfo,
    updateRestaurantInfo,
    resetRestaurantInfoToDefault,
    menuItems,
    toggleItemAvailability,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'general' | 'ordering' | 'stock'>('general');

  // Local form state
  const [formData, setFormData] = useState({
    name: restaurantInfo.name,
    tagline: restaurantInfo.tagline,
    phone: restaurantInfo.phone,
    email: restaurantInfo.email,
    address: restaurantInfo.address,
    city: restaurantInfo.city,
    state: restaurantInfo.state,
    zip: restaurantInfo.zip,
    defaultDeliveryFee: restaurantInfo.defaultDeliveryFee,
    minimumDeliveryOrder: restaurantInfo.minimumDeliveryOrder,
    taxRatePercent: restaurantInfo.taxRatePercent,
    estimatedPickupMinutes: restaurantInfo.estimatedPickupMinutes,
    estimatedDeliveryMinutes: restaurantInfo.estimatedDeliveryMinutes,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOwnerModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo({
      name: formData.name,
      tagline: formData.tagline,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      defaultDeliveryFee: Number(formData.defaultDeliveryFee),
      minimumDeliveryOrder: Number(formData.minimumDeliveryOrder),
      taxRatePercent: Number(formData.taxRatePercent),
      estimatedPickupMinutes: formData.estimatedPickupMinutes,
      estimatedDeliveryMinutes: formData.estimatedDeliveryMinutes,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all restaurant information, menu, and fees to factory defaults?')) {
      resetRestaurantInfoToDefault();
      setIsOwnerModalOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-modal-title"
      onClick={() => setIsOwnerModalOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl bg-[#14161C] text-white rounded-2xl shadow-2xl border border-[#272B35] overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#222630] bg-[#0E1013] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5B26] text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 id="owner-modal-title" className="text-xl font-bold text-white">
                Restaurant Owner Control Panel
              </h2>
              <p className="text-xs text-neutral-400">
                Update restaurant details, delivery fees, and live dish inventory in real time.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOwnerModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1A1D24] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 border-b border-[#222630] bg-[#121418] flex gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Store Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ordering')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ordering'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Delivery & Tax Rates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'stock'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Inventory Toggles ({menuItems.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {savedSuccess && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Restaurant updates saved successfully and updated live across the site!</span>
            </div>
          )}

          {activeTab === 'general' && (
            <form id="owner-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Telephone (Customer line)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Public Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'ordering' && (
            <form id="owner-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Standard Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={formData.defaultDeliveryFee}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultDeliveryFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Min Delivery Order ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.minimumDeliveryOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumDeliveryOrder: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Sales Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={formData.taxRatePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRatePercent: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Pickup Estimate Label
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedPickupMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedPickupMinutes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Delivery Estimate Label
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedDeliveryMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedDeliveryMinutes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white"
                  />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 mb-2">
                Click any dish to toggle availability for today's service:
              </p>
              <div className="divide-y divide-[#222630]">
                {menuItems.map((dish) => (
                  <div key={dish.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{dish.name}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">${dish.price.toFixed(2)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleItemAvailability(dish.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        dish.isAvailable
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-900'
                          : 'bg-red-950/80 text-red-400 border border-red-600/50 hover:bg-red-900'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock (Available)' : 'Sold Out for Today'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-[#222630] bg-[#0E1013] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          {activeTab !== 'stock' && (
            <button
              type="submit"
              form="owner-form"
              className="px-6 py-2.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
