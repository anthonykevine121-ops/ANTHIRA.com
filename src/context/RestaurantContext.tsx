import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  RestaurantInfo,
  MenuItem,
  CartItem,
  SelectedModifier,
  Order,
  FulfillmentType,
  DeliveryZone,
  UserProfile,
  LoyaltyReward,
} from '../types/restaurant';
import {
  DEFAULT_RESTAURANT_INFO,
  MENU_CATEGORIES,
  INITIAL_MENU_ITEMS,
} from '../data/defaultRestaurantData';

interface PromoDiscount {
  code: string;
  type: 'percent' | 'fixed' | 'free_delivery';
  value: number; // e.g. 10 for 10%, 5 for $5
  minOrder?: number;
  description: string;
}

const AVAILABLE_PROMOS: Record<string, PromoDiscount> = {
  WELCOME10: { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your entire order' },
  FREEROLL: { code: 'FREEROLL', type: 'fixed', value: 22, description: 'Free Signature Dragon Roll Reward ($22.00 off)' },
  TASTEITALY: { code: 'TASTEITALY', type: 'fixed', value: 5, minOrder: 30, description: '$5 off orders over $30' },
  FREEDELIVERY: { code: 'FREEDELIVERY', type: 'free_delivery', value: 0, minOrder: 25, description: 'Free delivery on orders $25+' },
};

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  phone: '(415) 555-0188',
  defaultAddress: '580 Bush St, Apt 4B, San Francisco, CA 94108',
  favoriteRoll: 'Hush Signature Dragon Maki',
  loyaltyTier: 'Gold',
};

// Seed 2 initial past orders if user opens the site fresh, so progress is visible at 2/5 (40%)
const SEED_PAST_ORDERS: Order[] = [
  {
    id: 'HM-9142',
    date: 'Oct 8, 2026',
    createdAt: Date.now() - 5 * 86400000,
    customer: {
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@example.com',
      phone: '(415) 555-0188',
      streetAddress: '580 Bush St',
      apartment: 'Apt 4B',
      zipCode: '94108',
    },
    fulfillmentType: 'delivery',
    scheduledTime: 'Delivered',
    items: [
      {
        id: 'salmon-nigiri-trio-seed',
        menuItem: INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedModifiers: [],
        unitPrice: 18.5,
        lineTotal: 18.5,
      },
      {
        id: 'crispy-gyoza-seed',
        menuItem: INITIAL_MENU_ITEMS[4],
        quantity: 1,
        selectedModifiers: [],
        unitPrice: 16.5,
        lineTotal: 16.5,
      },
    ],
    subtotal: 35.0,
    tax: 3.06,
    deliveryFee: 3.99,
    tipAmount: 6.3,
    discountAmount: 0,
    total: 48.35,
    paymentMethod: 'demo_card',
    paymentLast4: '4242',
    status: 'completed',
    statusUpdatedAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'HM-8219',
    date: 'Oct 11, 2026',
    createdAt: Date.now() - 2 * 86400000,
    customer: {
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@example.com',
      phone: '(415) 555-0188',
    },
    fulfillmentType: 'pickup',
    scheduledTime: 'Picked Up',
    items: [
      {
        id: 'chirashi-bowl-seed',
        menuItem: INITIAL_MENU_ITEMS[3],
        quantity: 1,
        selectedModifiers: [],
        unitPrice: 36.0,
        lineTotal: 36.0,
      },
    ],
    subtotal: 36.0,
    tax: 3.15,
    deliveryFee: 0,
    tipAmount: 6.48,
    discountAmount: 0,
    total: 45.63,
    paymentMethod: 'apple_pay',
    status: 'completed',
    statusUpdatedAt: Date.now() - 2 * 86400000,
  },
];

interface RestaurantContextType {
  // Restaurant Info
  restaurantInfo: RestaurantInfo;
  updateRestaurantInfo: (updated: Partial<RestaurantInfo>) => void;
  resetRestaurantInfoToDefault: () => void;
  isOpenNow: boolean;

  // Menu
  categories: typeof MENU_CATEGORIES;
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  toggleItemAvailability: (itemId: string) => void;
  selectedDish: MenuItem | null;
  setSelectedDish: (dish: MenuItem | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    selectedModifiers?: SelectedModifier[],
    specialInstructions?: string,
    isRewardItem?: boolean
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalCartItemCount: number;
  lastAddedItem: { name: string; timestamp: number } | null;
  cartBounceKey: number;

  // Checkout Calculations
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  deliveryZip: string;
  setDeliveryZip: (zip: string) => void;
  matchedDeliveryZone: DeliveryZone | null;
  deliveryFee: number;
  subtotal: number;
  promoCode: string;
  appliedPromo: PromoDiscount | null;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  discountAmount: number;
  tax: number;
  tipAmount: number;
  tipPercent: number | 'custom' | null;
  setTipPercent: (percent: number | 'custom' | null) => void;
  setCustomTipAmount: (amount: number) => void;
  grandTotal: number;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (orderPayload: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
    scheduledTime: string;
    paymentLast4?: string;
  }) => Order;

  // User Settings & Loyalty Rewards
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isUserSettingsOpen: boolean;
  setIsUserSettingsOpen: (open: boolean) => void;
  loyaltyTargetOrders: number;
  completedOrdersCount: number;
  currentProgressOrders: number;
  progressPercent: number;
  isRewardUnlocked: boolean;
  claimedReward: boolean;
  claimFreeLoyaltyItem: () => void;
  addSimulatedLoyaltyOrder: () => void;
  resetLoyaltyProgress: () => void;

  // Navigation & Drawers
  currentView: 'home' | 'menu' | 'about' | 'contact' | 'cart' | 'checkout' | 'confirmation';
  setCurrentView: (view: 'home' | 'menu' | 'about' | 'contact' | 'cart' | 'checkout' | 'confirmation') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOwnerModalOpen: boolean;
  setIsOwnerModalOpen: (open: boolean) => void;
  validateZip: (zip: string) => { isValid: boolean; zone?: DeliveryZone; message: string };
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Restaurant Info
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    try {
      const saved = localStorage.getItem('om_restaurant_info');
      return saved ? JSON.parse(saved) : DEFAULT_RESTAURANT_INFO;
    } catch {
      return DEFAULT_RESTAURANT_INFO;
    }
  });

  const updateRestaurantInfo = (updated: Partial<RestaurantInfo>) => {
    setRestaurantInfo((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('om_restaurant_info', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save restaurant info', e);
      }
      return next;
    });
  };

  const resetRestaurantInfoToDefault = () => {
    setRestaurantInfo(DEFAULT_RESTAURANT_INFO);
    localStorage.removeItem('om_restaurant_info');
  };

  // 2. Menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('om_menu_items');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((m) => (m.id === item.id ? item : m));
      localStorage.setItem('om_menu_items', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) => {
      const updated = prev.map((m) => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
      localStorage.setItem('om_menu_items', JSON.stringify(updated));
      return updated;
    });
  };

  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // 3. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('om_cart_items');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      // Deduplicate and merge any corrupted duplicate items from previous clicks
      const merged: CartItem[] = [];
      for (const item of parsed) {
        if (!item || !item.id) continue;
        const existing = merged.find((m) => m.id === item.id);
        if (existing) {
          existing.quantity += item.quantity || 1;
          existing.lineTotal = Number((existing.unitPrice * existing.quantity).toFixed(2));
        } else {
          merged.push({ ...item });
        }
      }
      return merged;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('om_cart_items', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  const [lastAddedItem, setLastAddedItem] = useState<{ name: string; timestamp: number } | null>(null);
  const [cartBounceKey, setCartBounceKey] = useState<number>(0);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedModifiers: SelectedModifier[] = [],
    specialInstructions = '',
    isRewardItem = false
  ) => {
    // If no modifiers selected but item has modifiers, auto-select defaults
    let effectiveModifiers = selectedModifiers;
    if ((!effectiveModifiers || effectiveModifiers.length === 0) && item.modifiers && item.modifiers.length > 0) {
      effectiveModifiers = [];
      item.modifiers.forEach((mod) => {
        if (mod.options && mod.options.length > 0) {
          const firstOpt = mod.options[0];
          effectiveModifiers.push({
            modifierId: mod.id,
            modifierName: mod.name,
            optionId: firstOpt.id,
            optionName: firstOpt.name,
            priceDelta: firstOpt.priceDelta || 0,
          });
        }
      });
    }

    const modKey = effectiveModifiers
      .map((m) => `${m.modifierId}:${m.optionId}`)
      .sort()
      .join('|');
    const cleanInstructions = specialInstructions.trim() || (isRewardItem ? '★ Loyalty Reward Item (Free)' : undefined);
    const instructionsKey = cleanInstructions ? `-note:${encodeURIComponent(cleanInstructions.slice(0, 30))}` : '';
    const lineId = `${item.id}-${modKey}${instructionsKey}${isRewardItem ? '-reward' : ''}`;

    const modifiersDelta = effectiveModifiers.reduce((acc, m) => acc + m.priceDelta, 0);
    const unitPrice = isRewardItem ? 0 : item.price + modifiersDelta;

    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === lineId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          lineTotal: Number((unitPrice * newQty).toFixed(2)),
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: lineId,
          menuItem: item,
          quantity,
          selectedModifiers: effectiveModifiers,
          specialInstructions: cleanInstructions,
          unitPrice,
          lineTotal: Number((unitPrice * quantity).toFixed(2)),
          isRewardItem,
        };
        return [...prev, newItem];
      }
    });

    // Notify listeners, update floating cart icon animation & count
    setLastAddedItem({ name: item.name, timestamp: Date.now() });
    setCartBounceKey((prev) => prev + 1);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              lineTotal: Number((item.unitPrice * nextQty).toFixed(2)),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // 4. Fulfillment & Totals
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [deliveryZip, setDeliveryZip] = useState<string>('94108');

  const validateZip = (zip: string) => {
    const cleanZip = zip.trim();
    const zone = restaurantInfo.deliveryZones.find((z) => z.zip === cleanZip);
    if (zone) {
      return { isValid: true, zone, message: `Delivery available for ${zone.neighborhood}!` };
    }
    return {
      isValid: false,
      message: `Zip code ${cleanZip || 'entered'} is outside our 5-mile courier radius. You may choose Curbside Pickup or enter another address!`,
    };
  };

  const matchedDeliveryZone = useMemo(() => {
    return restaurantInfo.deliveryZones.find((z) => z.zip === deliveryZip.trim()) || null;
  }, [restaurantInfo.deliveryZones, deliveryZip]);

  // Promo code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return Number(cart.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));
  }, [cart]);

  const applyPromoCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    setPromoError(null);
    if (!code) {
      setPromoError('Please enter a coupon code.');
      return false;
    }
    const found = AVAILABLE_PROMOS[code];
    if (!found) {
      setPromoError(`Code "${code}" is invalid. Try "WELCOME10" or "FREEROLL"`);
      return false;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setPromoError(`Code "${code}" requires a minimum subtotal of $${found.minOrder.toFixed(2)}.`);
      return false;
    }
    setPromoCode(code);
    setAppliedPromo(found);
    return true;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError(null);
  };

  // Delivery Fee calculation
  const deliveryFee = useMemo(() => {
    if (fulfillmentType === 'pickup') return 0;
    if (cart.length === 0) return 0;
    if (appliedPromo?.type === 'free_delivery') return 0;
    if (matchedDeliveryZone) return matchedDeliveryZone.fee;
    return restaurantInfo.defaultDeliveryFee;
  }, [fulfillmentType, cart.length, appliedPromo, matchedDeliveryZone, restaurantInfo.defaultDeliveryFee]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percent') {
      return Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
    }
    if (appliedPromo.type === 'fixed') {
      return Math.min(subtotal, appliedPromo.value);
    }
    return 0;
  }, [appliedPromo, subtotal]);

  // Tax calculation
  const tax = useMemo(() => {
    if (cart.length === 0) return 0;
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    return Number(((taxableSubtotal * restaurantInfo.taxRatePercent) / 100).toFixed(2));
  }, [subtotal, discountAmount, restaurantInfo.taxRatePercent, cart.length]);

  // Tip / Gratuity calculation - zeroed out per user request
  const [tipPercent, setTipPercent] = useState<number | 'custom' | null>(null);
  const [customTipAmount, setCustomTipAmount] = useState<number>(0);

  const tipAmount = useMemo(() => {
    return 0;
  }, []);

  const grandTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const total = Math.max(0, subtotal - discountAmount + tax + deliveryFee);
    return Number(total.toFixed(2));
  }, [cart.length, subtotal, discountAmount, tax, deliveryFee]);

  // 5. Orders & History
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('om_orders');
      if (saved) {
        return JSON.parse(saved);
      }
      return SEED_PAST_ORDERS;
    } catch {
      return SEED_PAST_ORDERS;
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const placeOrder = (orderPayload: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
    scheduledTime: string;
    paymentLast4?: string;
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HM-${randomSuffix}`;
    const now = Date.now();

    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      createdAt: now,
      customer: orderPayload.customer,
      fulfillmentType,
      scheduledTime: orderPayload.scheduledTime,
      items: [...cart],
      subtotal,
      tax,
      deliveryFee,
      tipAmount,
      tipPercent: typeof tipPercent === 'number' ? tipPercent : undefined,
      discountAmount,
      promoCode: appliedPromo?.code,
      total: grandTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentLast4: orderPayload.paymentLast4 || '4242',
      status: 'confirmed',
      statusUpdatedAt: now,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('om_orders', JSON.stringify(updated));
      return updated;
    });

    setActiveOrder(newOrder);
    clearCart();
    setCurrentView('confirmation');
    return newOrder;
  };

  // 6. User Profile & Loyalty Rewards Program
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('om_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('om_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);

  // Loyalty calculations
  const loyaltyTargetOrders = 5;
  const completedOrdersCount = orders.length;
  // Progress towards current cycle of 5 orders
  const currentProgressOrders = completedOrdersCount >= loyaltyTargetOrders ? loyaltyTargetOrders : completedOrdersCount;
  const progressPercent = Math.min(100, Math.round((currentProgressOrders / loyaltyTargetOrders) * 100));
  const isRewardUnlocked = completedOrdersCount >= loyaltyTargetOrders;

  const claimFreeLoyaltyItem = () => {
    // Add free Signature Dragon Maki to cart at $0.00
    const dragonRoll = menuItems.find((m) => m.id === 'hush-signature-dragon') || menuItems[2];
    addToCart(dragonRoll, 1, [], '★ Free Loyalty Reward Member Redemption', true);
    setClaimedReward(true);
    setIsUserSettingsOpen(false);
  };

  const addSimulatedLoyaltyOrder = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const simulatedOrder: Order = {
      id: `HM-SIM-${randomSuffix}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      createdAt: Date.now(),
      customer: {
        firstName: userProfile.name.split(' ')[0] || 'Alex',
        lastName: userProfile.name.split(' ')[1] || 'Chen',
        email: userProfile.email,
        phone: userProfile.phone,
      },
      fulfillmentType: 'delivery',
      scheduledTime: 'Delivered',
      items: [
        {
          id: `sim-item-${randomSuffix}`,
          menuItem: menuItems[0],
          quantity: 1,
          selectedModifiers: [],
          unitPrice: menuItems[0].price,
          lineTotal: menuItems[0].price,
        },
      ],
      subtotal: menuItems[0].price,
      tax: 1.62,
      deliveryFee: 3.99,
      tipAmount: 3.0,
      discountAmount: 0,
      total: menuItems[0].price + 1.62 + 3.99 + 3.0,
      paymentMethod: 'demo_card',
      status: 'completed',
      statusUpdatedAt: Date.now(),
    };

    setOrders((prev) => {
      const next = [simulatedOrder, ...prev];
      localStorage.setItem('om_orders', JSON.stringify(next));
      return next;
    });
  };

  const resetLoyaltyProgress = () => {
    setOrders([]);
    localStorage.removeItem('om_orders');
    setClaimedReward(false);
  };

  // 7. Navigation and Drawers
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'about' | 'contact' | 'cart' | 'checkout' | 'confirmation'>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);

  const isOpenNow = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 12 && hours < 23;
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurantInfo,
        updateRestaurantInfo,
        resetRestaurantInfoToDefault,
        isOpenNow,
        categories: MENU_CATEGORIES,
        menuItems,
        updateMenuItem,
        toggleItemAvailability,
        selectedDish,
        setSelectedDish,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        totalCartItemCount,
        lastAddedItem,
        cartBounceKey,
        fulfillmentType,
        setFulfillmentType,
        deliveryZip,
        setDeliveryZip,
        matchedDeliveryZone,
        deliveryFee,
        subtotal,
        promoCode,
        appliedPromo,
        promoError,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        tax,
        tipAmount,
        tipPercent,
        setTipPercent,
        setCustomTipAmount,
        grandTotal,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        userProfile,
        updateUserProfile,
        isUserSettingsOpen,
        setIsUserSettingsOpen,
        loyaltyTargetOrders,
        completedOrdersCount,
        currentProgressOrders,
        progressPercent,
        isRewardUnlocked,
        claimedReward,
        claimFreeLoyaltyItem,
        addSimulatedLoyaltyOrder,
        resetLoyaltyProgress,
        currentView,
        setCurrentView,
        isCartOpen,
        setIsCartOpen,
        isOwnerModalOpen,
        setIsOwnerModalOpen,
        validateZip,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
