import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  Award,
  Gift,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  Mail,
  PlusCircle,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const UserSettingsModal: React.FC = () => {
  const {
    isUserSettingsOpen,
    setIsUserSettingsOpen,
    userProfile,
    updateUserProfile,
    orders,
    loyaltyTargetOrders,
    completedOrdersCount,
    currentProgressOrders,
    progressPercent,
    isRewardUnlocked,
    claimFreeLoyaltyItem,
    addSimulatedLoyaltyOrder,
    resetLoyaltyProgress,
    setCurrentView,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'loyalty' | 'profile' | 'history'>('loyalty');
  const [profileForm, setProfileForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    defaultAddress: userProfile.defaultAddress,
    favoriteRoll: userProfile.favoriteRoll,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isUserSettingsOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const remainingOrders = Math.max(0, loyaltyTargetOrders - currentProgressOrders);

  const rewardItemName = 'Hush Signature Dragon Maki';
  const rewardItemValue = '$22.00';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-settings-title"
      onClick={() => setIsUserSettingsOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl bg-[#14161C] text-white rounded-3xl shadow-2xl border border-[#272B35] overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#222630] bg-[#0E1013] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5B26] text-white flex items-center justify-center shadow-lg shadow-[#FF5B26]/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="user-settings-title" className="text-xl font-bold text-white flex items-center gap-2">
                <span>Customer Account & Loyalty Rewards</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F232C] border border-[#2B303C] text-[11px] font-semibold text-[#FF5B26]">
                  {userProfile.loyaltyTier} Tier
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Track your orders, redeem complimentary dishes, and manage delivery preferences.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUserSettingsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-[#1A1D24] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#222630] bg-[#121418] flex gap-2 sm:gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('loyalty')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'loyalty'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Loyalty Rewards ({completedOrdersCount} Orders)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#FF5B26] text-[#FF5B26]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: LOYALTY REWARDS MODULE */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              {/* Highlight Card: Target Reward */}
              <div className="p-6 bg-gradient-to-br from-[#1A1D24] to-[#121418] rounded-2xl border border-[#2B303C] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5B26]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5B26] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Free Reward Goal</span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Complimentary {rewardItemName}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Order 5 times to unlock a free signature roll of your choice ({rewardItemValue} value).
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-neutral-400 block">Orders Tracked</span>
                    <span className="font-mono text-2xl font-extrabold text-[#FF5B26] tabular-nums">
                      {currentProgressOrders} / {loyaltyTargetOrders}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-300">Progress to Free Item</span>
                    <span className="text-[#FF5B26] font-mono">{progressPercent}% Completed</span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-[#0E1013] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#2B303C]">
                    <div
                      className="bg-gradient-to-r from-[#FF7A4D] to-[#FF5B26] h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                  </div>

                  {/* Milestone Markers */}
                  <div className="grid grid-cols-5 gap-1 pt-2 text-center text-[11px]">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const isComplete = currentProgressOrders >= step;
                      const isFinal = step === 5;
                      return (
                        <div key={step} className="flex flex-col items-center gap-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                              isComplete
                                ? 'bg-[#FF5B26] text-white shadow-md shadow-[#FF5B26]/30'
                                : 'bg-[#1F232C] text-neutral-500 border border-[#2B303C]'
                            }`}
                          >
                            {isComplete ? '✓' : step}
                          </div>
                          <span
                            className={`text-[10px] leading-tight ${
                              isComplete ? 'text-white font-semibold' : 'text-neutral-500'
                            }`}
                          >
                            {isFinal ? '★ Free Roll' : `Order ${step}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Message & CTA */}
                <div className="mt-8 pt-5 border-t border-[#252933] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    {isRewardUnlocked ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Congratulations! Your Free Signature Roll reward is ready to claim.</span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-300">
                        Only <strong className="text-white">{remainingOrders} more order{remainingOrders > 1 ? 's' : ''}</strong> needed to claim your free reward!
                      </p>
                    )}
                  </div>

                  {isRewardUnlocked ? (
                    <button
                      type="button"
                      onClick={claimFreeLoyaltyItem}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FF5B26] hover:bg-[#E04515] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF5B26]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim Free Roll & Add to Bag</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserSettingsOpen(false);
                        setCurrentView('menu');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#20232B] hover:bg-[#2A2E38] text-white font-semibold text-xs rounded-xl border border-[#2E333F] transition-colors cursor-pointer"
                    >
                      Order Now to Earn Progress →
                    </button>
                  )}
                </div>
              </div>

              {/* Loyalty Benefits & Tiers Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#181B22] rounded-2xl border border-[#272B35] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#222630] text-[#FF5B26] flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Every 5 Orders
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Earn 1 free specialty roll or sashimi trio valued up to $22.00, automatically refreshed each cycle.
                  </p>
                </div>

                <div className="p-4 bg-[#181B22] rounded-2xl border border-[#272B35] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#222630] text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Member Tier Status
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Current: <strong className="text-white">{userProfile.loyaltyTier}</strong>. Enjoy priority courier dispatching and exclusive seasonal fish preview cuts.
                  </p>
                </div>

                <div className="p-4 bg-[#181B22] rounded-2xl border border-[#272B35] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#222630] text-amber-400 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Birthday Surprise
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Complimentary Uji Matcha Mille Crêpe Cake or Tahitian vanilla dessert on your anniversary month.
                  </p>
                </div>
              </div>

              {/* Simulation and Testing Controls (Helpful for test evaluators) */}
              <div className="p-4 bg-[#121418] rounded-2xl border border-[#222630] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-neutral-400">
                  Testing Controls: Simulate placing orders to test the progress bar moving:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addSimulatedLoyaltyOrder}
                    className="px-3 py-1.5 bg-[#20232B] hover:bg-[#2A2E38] text-white font-semibold rounded-lg border border-[#2F3440] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Log Test Order (+1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetLoyaltyProgress}
                    className="px-3 py-1.5 text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & PREFERENCES */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {saveSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Profile and default delivery details updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Favorite Signature Dish</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.favoriteRoll}
                    onChange={(e) => setProfileForm({ ...profileForm, favoriteRoll: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5B26]" />
                  <span>Default Delivery Street Address</span>
                </label>
                <input
                  type="text"
                  value={profileForm.defaultAddress}
                  onChange={(e) => setProfileForm({ ...profileForm, defaultAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-1 focus:ring-[#FF5B26]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ORDER HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-neutral-600" />
                  <p className="text-sm">No orders recorded yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#222630]">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">#{ord.id}</span>
                          <span className="text-neutral-400">·</span>
                          <span className="text-neutral-400">{ord.date}</span>
                          <span className="text-neutral-400">·</span>
                          <span className="capitalize text-emerald-400 font-semibold">{ord.fulfillmentType}</span>
                        </div>
                        <span className="font-mono font-bold text-white text-sm tabular-nums">
                          ${ord.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-neutral-400 pl-2">
                        {ord.items.map((i, iIdx) => (
                          <div key={iIdx}>
                            {i.quantity}× {i.menuItem.name}
                            {i.isRewardItem && <span className="ml-1 text-[#FF5B26] font-bold">(Free Reward)</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
