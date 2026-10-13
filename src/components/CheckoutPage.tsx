import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { PaymentMethod } from '../types/restaurant';
import {
  Truck,
  Store,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    tax,
    discountAmount,
    appliedPromo,
    grandTotal,
    fulfillmentType,
    setFulfillmentType,
    deliveryZip,
    setDeliveryZip,
    validateZip,
    restaurantInfo,
    placeOrder,
    setCurrentView,
  } = useRestaurant();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('580 Bush St');
  const [apartment, setApartment] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Timing State
  const [timingType, setTimingType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDay, setScheduledDay] = useState<'today' | 'tomorrow'>('today');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string>('7:00 PM');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('demo_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  // UI / Step Flow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Postal code validation
  const zipValidation = useMemo(() => {
    return validateZip(deliveryZip);
  }, [deliveryZip, validateZip]);

  const availableTimeSlots = [
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
  ];

  const validateCurrentStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (fulfillmentType === 'delivery') {
        if (!streetAddress.trim()) {
          newErrors.streetAddress = 'Street address is required for delivery.';
        }
        if (!deliveryZip.trim()) {
          newErrors.deliveryZip = 'ZIP code is required.';
        } else if (!zipValidation.isValid) {
          newErrors.deliveryZip = zipValidation.message;
        }
      }
    }

    if (stepNumber === 2) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!email.trim()) {
        newErrors.email = 'Email address is required for receipt delivery.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!phone.trim()) {
        newErrors.phone = 'Phone number is required for delivery/pickup alerts.';
      } else if (phone.replace(/[^0-9]/g, '').length < 10) {
        newErrors.phone = 'Please provide a valid 10-digit phone number.';
      }
    }

    if (stepNumber === 3) {
      if (paymentMethod === 'demo_card') {
        if (!cardNumber.trim() || cardNumber.length < 10) {
          newErrors.cardNumber = 'Please enter a valid test card number.';
        }
        if (!cardExpiry.trim()) {
          newErrors.cardExpiry = 'MM/YY required.';
        }
        if (!cardCvc.trim() || cardCvc.length < 3) {
          newErrors.cardCvc = 'Valid CVC required.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1) as any);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as any);
  };

  const handlePlaceOrder = async () => {
    if (!validateCurrentStep(1) || !validateCurrentStep(2) || !validateCurrentStep(3)) {
      return;
    }

    if (cart.length === 0) {
      setErrors({ form: 'Your cart is empty. Please add items to checkout.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const scheduledLabel =
        timingType === 'asap'
          ? fulfillmentType === 'delivery'
            ? `ASAP (~${restaurantInfo.estimatedDeliveryMinutes})`
            : `ASAP (~${restaurantInfo.estimatedPickupMinutes})`
          : `${scheduledDay === 'today' ? 'Today' : 'Tomorrow'} at ${scheduledTimeSlot}`;

      const cardSuffix = paymentMethod === 'demo_card' ? cardNumber.slice(-4) || '4242' : undefined;

      placeOrder({
        customer: {
          firstName,
          lastName,
          email,
          phone,
          streetAddress: fulfillmentType === 'delivery' ? streetAddress : undefined,
          apartment: fulfillmentType === 'delivery' ? apartment : undefined,
          zipCode: fulfillmentType === 'delivery' ? deliveryZip : undefined,
          deliveryNotes: fulfillmentType === 'delivery' ? deliveryNotes : undefined,
        },
        paymentMethod,
        scheduledTime: scheduledLabel,
        paymentLast4: cardSuffix,
      });
    } catch (e) {
      console.error(e);
      setErrors({ form: 'An unexpected error occurred during submission. Your cart has been preserved.' });
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your bag is empty</h2>
        <p className="text-sm text-neutral-400">
          Please select dishes from our sushi menu before checking out.
        </p>
        <button
          onClick={() => setCurrentView('menu')}
          className="px-6 py-2.5 bg-[#FF5B26] text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#0E1013] text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('menu')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping / Menu</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Multi-Step Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between border-b border-[#222630] pb-4">
              {[
                { num: 1, label: 'Fulfillment' },
                { num: 2, label: 'Contact' },
                { num: 3, label: 'Payment' },
                { num: 4, label: 'Review' },
              ].map((step) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num as any);
                  }}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    currentStep === step.num
                      ? 'text-[#FF5B26]'
                      : step.num < currentStep
                      ? 'text-emerald-400 cursor-pointer'
                      : 'text-neutral-500'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                      currentStep === step.num
                        ? 'bg-[#FF5B26] text-white'
                        : step.num < currentStep
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#222630] text-neutral-400'
                    }`}
                  >
                    {step.num < currentStep ? '✓' : step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              ))}
            </div>

            {/* Error banner if any form error */}
            {errors.form && (
              <div className="p-4 bg-red-950/80 border border-red-700/60 rounded-xl text-red-200 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* STEP 1: Fulfillment & Schedule */}
            {currentStep === 1 && (
              <div className="bg-[#14161C] p-6 sm:p-8 rounded-2xl border border-[#272B35] shadow-xs space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Fulfillment & Timing</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Select delivery or curbside pickup for your order.
                  </p>
                </div>

                {/* Fulfillment Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType('delivery');
                      setErrors((prev) => ({ ...prev, streetAddress: '', deliveryZip: '' }));
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfillmentType === 'delivery'
                        ? 'border-[#FF5B26] bg-[#FF5B26]/10 ring-1 ring-[#FF5B26]'
                        : 'border-[#272B35] bg-[#181B22] hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-[#FF5B26]' : 'text-neutral-400'}`} />
                      <span className="font-mono text-xs font-bold text-white">
                        ${restaurantInfo.defaultDeliveryFee.toFixed(2)} Fee
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white">Chilled Courier Delivery</div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Estimated {restaurantInfo.estimatedDeliveryMinutes}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType('pickup');
                      setErrors((prev) => ({ ...prev, streetAddress: '', deliveryZip: '' }));
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfillmentType === 'pickup'
                        ? 'border-[#FF5B26] bg-[#FF5B26]/10 ring-1 ring-[#FF5B26]'
                        : 'border-[#272B35] bg-[#181B22] hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Store className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-[#FF5B26]' : 'text-neutral-400'}`} />
                      <span className="font-mono text-xs font-bold text-emerald-400">Free</span>
                    </div>
                    <div className="font-bold text-sm text-white">Curbside & Counter Pickup</div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Ready in {restaurantInfo.estimatedPickupMinutes}
                    </div>
                  </button>
                </div>

                {/* Delivery Address Fields */}
                {fulfillmentType === 'delivery' && (
                  <div className="space-y-4 pt-4 border-t border-[#222630]">
                    <h3 className="text-sm font-bold text-white">Delivery Address</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="e.g. 580 Bush St"
                          className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                            errors.streetAddress ? 'border-red-500' : 'border-[#272B35]'
                          }`}
                        />
                        {errors.streetAddress && (
                          <p className="text-xs text-red-400 mt-1">{errors.streetAddress}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={deliveryZip}
                          onChange={(e) => setDeliveryZip(e.target.value)}
                          placeholder="94108"
                          className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                            errors.deliveryZip ? 'border-red-500' : 'border-[#272B35]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Zone check feedback banner */}
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        zipValidation.isValid
                          ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-200'
                          : 'bg-amber-950/80 border border-amber-600/50 text-amber-200'
                      }`}
                    >
                      {zipValidation.isValid ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block">
                          {zipValidation.isValid ? 'Delivery Zone Confirmed' : 'Delivery Notice'}
                        </span>
                        <span>{zipValidation.message}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Apt, Suite, Floor (Optional)
                        </label>
                        <input
                          type="text"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="e.g. Apt 12B"
                          className="w-full px-3 py-2 text-sm border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Drop-Off Instructions
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="e.g. Leave with doorman"
                          className="w-full px-3 py-2 text-sm border border-[#272B35] rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pickup Location Details */}
                {fulfillmentType === 'pickup' && (
                  <div className="p-4 bg-[#181B22] rounded-xl border border-[#272B35] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF5B26]">
                      <Store className="w-4 h-4" />
                      <span>Takeout Counter Location</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {restaurantInfo.name} — Host Stand & Curbside
                    </p>
                    <p className="text-xs text-neutral-400">
                      {restaurantInfo.address}, {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zip}
                    </p>
                  </div>
                )}

                {/* Timing Selection */}
                <div className="pt-4 border-t border-[#222630] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Order Timing</h3>
                    <div className="flex items-center gap-1 bg-[#16181E] p-1 border border-[#272B35] rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setTimingType('asap')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          timingType === 'asap' ? 'bg-[#FF5B26] text-white' : 'text-neutral-400'
                        }`}
                      >
                        ASAP
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimingType('scheduled')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          timingType === 'scheduled' ? 'bg-[#FF5B26] text-white' : 'text-neutral-400'
                        }`}
                      >
                        Schedule Ahead
                      </button>
                    </div>
                  </div>

                  {timingType === 'asap' ? (
                    <div className="p-3 bg-[#181B22] rounded-xl border border-[#272B35] flex items-center gap-3 text-xs text-neutral-300">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        Your sushi will be pressed immediately.{' '}
                        <strong className="text-white">
                          Estimated {fulfillmentType === 'delivery' ? restaurantInfo.estimatedDeliveryMinutes : restaurantInfo.estimatedPickupMinutes}.
                        </strong>
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#181B22] rounded-xl border border-[#272B35]">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Date
                        </label>
                        <select
                          value={scheduledDay}
                          onChange={(e) => setScheduledDay(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-lg bg-[#121418] text-white"
                        >
                          <option value="today">Today</option>
                          <option value="tomorrow">Tomorrow</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Time Slot
                        </label>
                        <select
                          value={scheduledTimeSlot}
                          onChange={(e) => setScheduledTimeSlot(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-lg bg-[#121418] text-white"
                        >
                          {availableTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue to Contact</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Customer Contact */}
            {currentStep === 2 && (
              <div className="bg-[#14161C] p-6 sm:p-8 rounded-2xl border border-[#272B35] shadow-xs space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    We'll send order receipts and courier notifications here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Kenji"
                      className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                        errors.firstName ? 'border-red-500' : 'border-[#272B35]'
                      }`}
                    />
                    {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Takahashi"
                      className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                        errors.lastName ? 'border-red-500' : 'border-[#272B35]'
                      }`}
                    />
                    {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kenji@example.com"
                      className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                        errors.email ? 'border-red-500' : 'border-[#272B35]'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(415) 555-0199"
                      className={`w-full px-3 py-2 text-sm border rounded-xl bg-[#16181E] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5B26] ${
                        errors.phone ? 'border-red-500' : 'border-[#272B35]'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#222630]">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ← Back to Fulfillment
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continue to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-[#14161C] p-6 sm:p-8 rounded-2xl border border-[#272B35] shadow-xs space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Select your preferred payment method to complete your order.
                  </p>
                </div>

                {/* Demo Payment Disclaimer */}
                <div className="p-3.5 bg-amber-950/80 border border-amber-600/50 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Configurable Demo Payment Integration</span>
                    <span>
                      Operating in safe demonstration mode. No live card will be charged. Any simulated card format is accepted.
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-neutral-300">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('demo_card')}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        paymentMethod === 'demo_card'
                          ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-white ring-1 ring-[#FF5B26]'
                          : 'border-[#272B35] bg-[#181B22] text-neutral-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#FF5B26]" />
                      <span>Credit Card (Demo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        paymentMethod === 'apple_pay'
                          ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-white ring-1 ring-[#FF5B26]'
                          : 'border-[#272B35] bg-[#181B22] text-neutral-300'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Apple Pay (Demo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-white ring-1 ring-[#FF5B26]'
                          : 'border-[#272B35] bg-[#181B22] text-neutral-300'
                      }`}
                    >
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>Pay at Counter</span>
                    </button>
                  </div>

                  {/* Card form if credit card selected */}
                  {paymentMethod === 'demo_card' && (
                    <div className="p-4 bg-[#181B22] rounded-xl border border-[#272B35] space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-lg bg-[#121418] text-white font-mono"
                        />
                        {errors.cardNumber && <p className="text-xs text-red-400 mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                            Expires (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-lg bg-[#121418] text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                            Security Code (CVC)
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-2 text-xs border border-[#272B35] rounded-lg bg-[#121418] text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 bg-neutral-900 border border-neutral-700 text-white rounded-xl text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Apple Pay Tokenized Device Authorization</span>
                      </div>
                      <span className="font-mono text-emerald-400">Ready</span>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="p-3 bg-[#181B22] rounded-xl border border-[#272B35] text-xs text-neutral-400">
                      You will pay directly upon receiving your order {fulfillmentType === 'delivery' ? 'from our courier' : 'at the sushi bar counter'}.
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#222630]">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
                  >
                    ← Back to Contact
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Review Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Final Review & Submit */}
            {currentStep === 4 && (
              <div className="bg-[#14161C] p-6 sm:p-8 rounded-2xl border border-[#272B35] shadow-xs space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Review & Place Order</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Please verify your sushi order before final transmission to our kitchen.
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-[#222630] text-xs text-neutral-300">
                  <div className="pt-2 flex justify-between">
                    <div>
                      <span className="font-bold text-white block mb-0.5">Fulfillment</span>
                      <span>
                        {fulfillmentType === 'delivery'
                          ? `Delivery to: ${streetAddress}, ${apartment ? apartment + ', ' : ''}${deliveryZip}`
                          : `Curbside Pickup at: ${restaurantInfo.address}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#FF5B26] font-bold underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <div>
                      <span className="font-bold text-white block mb-0.5">Timing</span>
                      <span>
                        {timingType === 'asap'
                          ? `ASAP (~${fulfillmentType === 'delivery' ? restaurantInfo.estimatedDeliveryMinutes : restaurantInfo.estimatedPickupMinutes})`
                          : `Scheduled for ${scheduledDay === 'today' ? 'Today' : 'Tomorrow'} at ${scheduledTimeSlot}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#FF5B26] font-bold underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <div>
                      <span className="font-bold text-white block mb-0.5">Contact</span>
                      <span>{firstName} {lastName} · {email} · {phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-[#FF5B26] font-bold underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <div>
                      <span className="font-bold text-white block mb-0.5">Payment</span>
                      <span>
                        {paymentMethod === 'demo_card'
                          ? `Credit Card ending in •••• ${cardNumber.slice(-4) || '4242'}`
                          : paymentMethod === 'apple_pay'
                          ? 'Apple Pay (Demo Token)'
                          : 'Cash on Delivery/Counter'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-[#FF5B26] font-bold underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Final Order Placement Button */}
                <div className="pt-6 border-t border-[#222630] space-y-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 px-6 bg-[#FF5B26] hover:bg-[#E04515] disabled:bg-[#FF5B26]/60 text-white font-bold text-sm rounded-full flex items-center justify-between shadow-xl shadow-[#FF5B26]/30 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 mx-auto">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting to Itamae Line...</span>
                      </span>
                    ) : (
                      <>
                        <span>Place Order Now</span>
                        <span className="font-mono font-bold tabular-nums">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center">
                    By placing your order, you agree to Hush Modern Restaurant's culinary terms.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Itemized Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#14161C] p-6 rounded-2xl border border-[#272B35] shadow-xs sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
                <h3 className="text-lg font-bold text-white">Order Summary</h3>
                <span className="text-xs font-mono text-neutral-400 tabular-nums">
                  {cart.reduce((a, b) => a + b.quantity, 0)} items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="text-xs space-y-1">
                    <div className="flex justify-between items-baseline font-medium text-white">
                      <span>
                        <span className="font-mono font-bold mr-1.5 text-[#FF5B26]">
                          {item.quantity}×
                        </span>
                        {item.menuItem.name}
                      </span>
                      <span className="font-mono tabular-nums">${item.lineTotal.toFixed(2)}</span>
                    </div>

                    {item.selectedModifiers.length > 0 && (
                      <div className="text-[11px] text-neutral-400 pl-5 space-y-0.5">
                        {item.selectedModifiers.map((m, idx) => (
                          <div key={idx}>+ {m.optionName}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#222630] text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    {fulfillmentType === 'delivery' ? 'Delivery Fee' : 'Curbside Pickup'}
                  </span>
                  <span className="font-mono tabular-nums text-white">
                    {fulfillmentType === 'delivery'
                      ? deliveryFee === 0
                        ? 'FREE'
                        : `$${deliveryFee.toFixed(2)}`
                      : 'Free'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Sales Tax ({restaurantInfo.taxRatePercent}%)</span>
                  <span className="font-mono tabular-nums text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#272B35]">
                  <span>Total Amount</span>
                  <span className="font-mono font-bold tabular-nums text-[#FF5B26]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#181B22] rounded-xl border border-[#272B35] text-[11px] text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Packed in insulated chilled bento boxes with cooling packs for sashimi freshness.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
