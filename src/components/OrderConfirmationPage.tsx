import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  CheckCircle2,
  Clock,
  Printer,
  ShoppingBag,
  Flame,
  Truck,
  Store,
  Phone,
  Gift,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const {
    activeOrder,
    orders,
    restaurantInfo,
    setCurrentView,
    setIsUserSettingsOpen,
    currentProgressOrders,
    loyaltyTargetOrders,
  } = useRestaurant();

  const order = activeOrder || orders[0];

  const [kitchenStage, setKitchenStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setKitchenStage(2), 3500);
    const timer2 = setTimeout(() => setKitchenStage(3), 10000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order?.id]);

  if (!order) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Recent Order Found</h2>
        <p className="text-sm text-neutral-400">
          You have not placed an order yet in this session.
        </p>
        <button
          onClick={() => setCurrentView('menu')}
          className="px-6 py-2.5 bg-[#FF5B26] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
        >
          Explore Sushi Menu
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 sm:py-16 bg-[#0E1013] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-[#14161C] p-6 sm:p-10 rounded-3xl border border-[#272B35] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 border border-emerald-600/50 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-950/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
              Order Transmitted to Itamae Counter
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Thank You for Your Order, {order.customer.firstName}!
            </h1>
            <p className="text-sm text-neutral-400">
              Your order <strong className="font-mono text-white">#{order.id}</strong> has been confirmed and transmitted to the kitchen.
            </p>
          </div>

          {/* Loyalty Rewards Progress Banner */}
          <div className="p-4 bg-[#181B22] rounded-2xl border border-[#272B35] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5B26]/20 text-[#FF5B26] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Loyalty Stamp Earned! ({currentProgressOrders} of {loyaltyTargetOrders} Orders)
                </span>
                <span className="text-[11px] text-neutral-400">
                  {currentProgressOrders >= loyaltyTargetOrders
                    ? 'Congratulations! You have unlocked a Free Signature Dragon Roll!'
                    : `Only ${loyaltyTargetOrders - currentProgressOrders} more order${loyaltyTargetOrders - currentProgressOrders > 1 ? 's' : ''} to unlock your free signature roll.`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsUserSettingsOpen(true)}
              className="px-4 py-2 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
            >
              View Loyalty Rewards →
            </button>
          </div>

          {/* Live Kitchen Status Stepper */}
          <div className="pt-6 pb-2 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {/* Stage 1 */}
              <div className="space-y-2">
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    kitchenStage >= 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#222630] text-neutral-400'
                  }`}
                >
                  ✓
                </div>
                <span className="font-bold block text-white">Ticket Confirmed</span>
                <span className="text-[11px] text-neutral-400 block">Received by itamae</span>
              </div>

              {/* Stage 2 */}
              <div className="space-y-2">
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center transition-colors ${
                    kitchenStage >= 2
                      ? 'bg-[#FF5B26] text-white animate-pulse'
                      : 'bg-[#222630] text-neutral-400'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                </div>
                <span
                  className={`font-bold block ${
                    kitchenStage >= 2 ? 'text-[#FF5B26]' : 'text-neutral-500'
                  }`}
                >
                  Knife Craft & Pressing
                </span>
                <span className="text-[11px] text-neutral-400 block">Nigiri & rolls forming</span>
              </div>

              {/* Stage 3 */}
              <div className="space-y-2">
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center transition-colors ${
                    kitchenStage >= 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#222630] text-neutral-400'
                  }`}
                >
                  {order.fulfillmentType === 'delivery' ? (
                    <Truck className="w-4 h-4" />
                  ) : (
                    <Store className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`font-bold block ${
                    kitchenStage >= 3 ? 'text-emerald-400' : 'text-neutral-500'
                  }`}
                >
                  {order.fulfillmentType === 'delivery' ? 'Out for Delivery' : 'Ready at Host Stand'}
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  {order.fulfillmentType === 'delivery' ? 'Chilled courier en route' : 'Curbside handoff'}
                </span>
              </div>
            </div>

            {/* Connecting progress bar */}
            <div className="w-full bg-[#222630] h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-[#FF5B26] h-full transition-all duration-700"
                style={{
                  width: kitchenStage === 1 ? '33%' : kitchenStage === 2 ? '66%' : '100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Order Details & Receipt */}
        <div className="bg-[#14161C] p-6 sm:p-8 rounded-2xl border border-[#272B35] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222630] gap-2">
            <div>
              <span className="text-xs text-neutral-400">Order Reference</span>
              <div className="font-mono text-lg font-bold text-white">#{order.id}</div>
            </div>
            <div className="text-xs text-neutral-400 sm:text-right">
              <div>Placed on {order.date}</div>
              <div className="font-semibold text-white mt-0.5">
                Timing: {order.scheduledTime}
              </div>
            </div>
          </div>

          {/* Fulfillment & Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#181B22] rounded-xl border border-[#272B35] space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs">
                {order.fulfillmentType === 'delivery' ? (
                  <>
                    <Truck className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Delivery Address</span>
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Curbside Pickup Location</span>
                  </>
                )}
              </span>
              {order.fulfillmentType === 'delivery' ? (
                <>
                  <p className="font-bold text-white">
                    {order.customer.streetAddress} {order.customer.apartment}
                  </p>
                  <p className="text-neutral-400">
                    San Francisco, CA {order.customer.zipCode}
                  </p>
                  {order.customer.deliveryNotes && (
                    <p className="italic text-neutral-400 pt-1">
                      Notes: "{order.customer.deliveryNotes}"
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold text-white">{restaurantInfo.name}</p>
                  <p className="text-neutral-400">{restaurantInfo.address}</p>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Check in with the host stand at 580 Bush St or pull into the curbside parking bay.
                  </p>
                </>
              )}
            </div>

            <div className="p-4 bg-[#181B22] rounded-xl border border-[#272B35] space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#FF5B26]" />
                <span>Customer Confirmation</span>
              </span>
              <p className="font-bold text-white">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-neutral-400">{order.customer.phone}</p>
              <p className="text-neutral-400">{order.customer.email}</p>
              <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                Receipt and tracking notifications sent via email.
              </p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="space-y-3 pt-4 border-t border-[#222630]">
            <h3 className="text-base font-bold text-white">Ordered Dishes</h3>

            <div className="divide-y divide-[#222630]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white">
                      <span className="font-mono font-bold mr-1.5 text-[#FF5B26]">
                        {item.quantity}×
                      </span>
                      {item.menuItem.name}
                    </div>
                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-neutral-400 pl-4 space-y-0.5">
                        {item.selectedModifiers.map((m, mIdx) => (
                          <div key={mIdx}>+ {m.optionName}</div>
                        ))}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="text-[11px] italic text-neutral-400 pl-4">
                        Note: "{item.specialInstructions}"
                      </div>
                    )}
                  </div>
                  <span className="font-mono tabular-nums text-white font-bold">
                    ${item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Table */}
            <div className="pt-3 border-t border-[#222630] space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({order.promoCode || 'Promotion'})</span>
                  <span className="font-mono tabular-nums">-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{order.fulfillmentType === 'delivery' ? 'Delivery Fee' : 'Curbside Pickup'}</span>
                <span className="font-mono tabular-nums">
                  {order.deliveryFee > 0 ? `$${order.deliveryFee.toFixed(2)}` : 'Free'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-mono tabular-nums">${order.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#272B35]">
                <span>Total Paid</span>
                <span className="font-mono font-bold tabular-nums text-[#FF5B26]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#222630] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181B22] border border-[#272B35] hover:bg-[#20232B] text-xs font-bold text-white rounded-lg cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <a
                href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181B22] border border-[#272B35] hover:bg-[#20232B] text-xs font-bold text-white rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF5B26]" />
                <span>Call Host: {restaurantInfo.phone}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Another Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
