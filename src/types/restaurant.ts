export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number; // e.g. 0 for base, +3.5 for extra cheese
}

export interface DishModifier {
  id: string;
  name: string;
  required: boolean;
  maxSelections?: number; // 1 for single-choice, >1 for multi
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  italianName?: string;
  description: string;
  price: number;
  image: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'chef-choice')[];
  calories?: number;
  prepTimeMinutes?: number;
  isAvailable: boolean;
  modifiers?: DishModifier[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  iconName?: string;
}

export interface SelectedModifier {
  modifierId: string;
  modifierName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique cart line item id (item.id + serialized modifiers)
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions?: string;
  unitPrice: number;
  lineTotal: number;
  isRewardItem?: boolean;
}

export interface DeliveryZone {
  zip: string;
  neighborhood: string;
  minOrder: number;
  fee: number;
  estimatedMinutes: number;
}

export interface RestaurantHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  cuisine: string;
  story: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  socialInstagram: string;
  socialFacebook: string;
  hours: RestaurantHours[];
  deliveryZones: DeliveryZone[];
  defaultDeliveryFee: number;
  minimumDeliveryOrder: number;
  taxRatePercent: number; // e.g. 8.5 for 8.5%
  estimatedPickupMinutes: string;
  estimatedDeliveryMinutes: string;
  currencySymbol: string;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'demo_card' | 'apple_pay' | 'cash';
export type OrderStatus = 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress?: string;
  apartment?: string;
  zipCode?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt: number;
  customer: CustomerDetails;
  fulfillmentType: FulfillmentType;
  scheduledTime: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tipAmount: number;
  tipPercent?: number;
  discountAmount: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentLast4?: string;
  status: OrderStatus;
  statusUpdatedAt: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  favoriteRoll: string;
  loyaltyTier: 'Member' | 'Silver' | 'Gold' | 'Black Slate VIP';
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  requiredOrders: number;
  rewardDishId: string;
  dishName: string;
  value: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}
