import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ASSET_IMAGES } from '../data/defaultRestaurantData';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Truck,
  Car,
  Users,
  Calendar,
  Check,
} from 'lucide-react';

export const ContactLocationPage: React.FC = () => {
  const { restaurantInfo, validateZip, isOpenNow } = useRestaurant();

  // Delivery Zone Checker input
  const [zipInput, setZipInput] = useState('');
  const [checkedResult, setCheckedResult] = useState<{
    tested: boolean;
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleTestZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim()) return;
    const res = validateZip(zipInput);
    setCheckedResult({
      tested: true,
      isValid: res.isValid,
      message: res.message,
    });
  };

  // Interactive Reservation Table Booking
  const [partySize, setPartySize] = useState('2');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('7:00 PM');
  const [seatingType, setSeatingType] = useState('sushi-bar');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const timeSlots = ['5:30 PM', '6:15 PM', '7:00 PM', '7:45 PM', '8:30 PM', '9:15 PM'];

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resPhone) return;
    setReservationSuccess(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-white text-[#121418]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
            Visit & Connect
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#121418]">
            Reservations, Hours & Delivery Area
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 font-light">
            Located at 580 Bush Street in the Financial District. Omakase bar counter seats & curbside takeout available daily.
          </p>
        </div>

        {/* Section 5 matching mockup: Split view with Food Platter on Left and Booking / Info on Right */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-12 border border-[#E9EBEF] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Food Slate Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#E0E2E8] shadow-lg aspect-square bg-[#0E1013]">
                <img
                  src={ASSET_IMAGES.crispyWagyuGyoza}
                  alt="Artisanal Japanese dining experience at Hush Modern Restaurant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="mt-4 p-4 bg-white rounded-xl border border-[#E6DFD5] space-y-1 text-xs">
                <span className="font-bold text-[#121418] block">
                  Itamae Omakase Sushi Counter
                </span>
                <p className="text-neutral-500">
                  Direct front-row seating overlooking master sushi chefs slicing Toyosu seafood.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Table Reservation & Takeout Form (Matches mockup layout) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E6DFD5] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5]">
                <div>
                  <h3 className="text-xl font-bold text-[#121418]">
                    Reserve an Omakase Experience
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Instant confirmation for dinner & sushi bar seatings.
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isOpenNow ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {isOpenNow ? '● Open Now' : 'Advance Bookings'}
                </span>
              </div>

              {reservationSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">
                    Reservation Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                    Thank you, {resName}! We have reserved your {seatingType === 'sushi-bar' ? 'Sushi Bar Counter' : 'Private Table'} for {partySize} guests at {selectedTimeSlot}. A text message confirmation has been sent to {resPhone}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setReservationSuccess(false)}
                    className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                  >
                    Book another time
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookTable} className="space-y-4">
                  {/* Party size selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#121418] mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF5B26]" />
                      <span>Party Size</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[
                        { label: '2 Guests', val: '2' },
                        { label: '4 Guests', val: '4' },
                        { label: '6 Guests', val: '6' },
                        { label: '8+ Guests', val: '8' },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setPartySize(item.val)}
                          className={`py-2 px-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                            partySize === item.val
                              ? 'bg-[#FF5B26] text-white border-[#FF5B26] shadow-sm'
                              : 'bg-[#F9FAFB] text-neutral-600 border-[#E5E7EB] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seating preference */}
                  <div>
                    <label className="block text-xs font-bold text-[#121418] mb-1.5">
                      Seating Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSeatingType('sushi-bar')}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          seatingType === 'sushi-bar'
                            ? 'border-[#FF5B26] bg-[#FF5B26]/5 text-[#121418] font-bold'
                            : 'border-[#E5E7EB] text-neutral-600'
                        }`}
                      >
                        <span className="block font-semibold">Sushi Bar Counter</span>
                        <span className="text-[11px] text-neutral-400">Front row itamae view</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeatingType('table')}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          seatingType === 'table'
                            ? 'border-[#FF5B26] bg-[#FF5B26]/5 text-[#121418] font-bold'
                            : 'border-[#E5E7EB] text-neutral-600'
                        }`}
                      >
                        <span className="block font-semibold">Main Dining Table</span>
                        <span className="text-[11px] text-neutral-400">Spacious & intimate</span>
                      </button>
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="block text-xs font-bold text-[#121418] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF5B26]" />
                      <span>Available Time Slots (Tonight)</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 text-center rounded-lg border font-semibold transition-all cursor-pointer ${
                            selectedTimeSlot === slot
                              ? 'bg-[#121418] text-white border-[#121418]'
                              : 'bg-[#F9FAFB] text-neutral-600 border-[#E5E7EB] hover:bg-neutral-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#121418] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={resName}
                        onChange={(e) => setResName(e.target.value)}
                        placeholder="e.g. Kenji Tanaka"
                        className="w-full px-3 py-2 text-xs border border-[#D1D5DB] rounded-lg bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#121418] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={resPhone}
                        onChange={(e) => setResPhone(e.target.value)}
                        placeholder="(415) 555-0199"
                        className="w-full px-3 py-2 text-xs border border-[#D1D5DB] rounded-lg bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FF5B26] hover:bg-[#E04515] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md shadow-[#FF5B26]/20 transition-all cursor-pointer"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3 Main Location & Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Address & Valet */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E9EBEF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E2E8] flex items-center justify-center text-[#FF5B26] shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#121418]">Address & Parking</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {restaurantInfo.address}
              <br />
              {restaurantInfo.city}, {restaurantInfo.state} {restaurantInfo.zip}
            </p>
            <div className="pt-2 text-xs text-neutral-500 flex items-start gap-1.5 border-t border-[#E9EBEF]">
              <Car className="w-4 h-4 text-[#FF5B26] shrink-0 mt-0.5" />
              <span>Complimentary valet parking available on Bush St after 5:30 PM.</span>
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E9EBEF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E2E8] flex items-center justify-center text-[#FF5B26] shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#121418]">Kitchen Hours</h3>
            <div className="space-y-1 text-xs text-neutral-600">
              {restaurantInfo.hours.map((h, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-[#F0F2F5] last:border-0">
                  <span className="font-semibold text-[#121418]">{h.day}</span>
                  <span className="font-mono text-neutral-500">
                    {h.open} – {h.close}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Direct Phone & Inquiries */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E9EBEF] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E2E8] flex items-center justify-center text-[#FF5B26] shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#121418]">Direct Contact</h3>
            <div className="space-y-2 text-xs sm:text-sm text-neutral-600">
              <div>
                <span className="text-neutral-400 block text-xs">Host & Phone Orders:</span>
                <a
                  href={`tel:${restaurantInfo.phone.replace(/[^0-9]/g, '')}`}
                  className="font-mono font-bold text-[#121418] hover:text-[#FF5B26]"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div>
                <span className="text-neutral-400 block text-xs">Private Dining & Events:</span>
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-[#121418] hover:text-[#FF5B26]"
                >
                  {restaurantInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Delivery Area Checker */}
        <div className="bg-[#0E1013] text-white rounded-3xl p-6 sm:p-10 border border-[#272B35]">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
              <Truck className="w-4 h-4" />
              <span>Direct Neighborhood Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Check If We Deliver to Your Address
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              We deliver within our temperature-regulated courier zone to guarantee your sushi and sashimi arrive chilled, pristine, and beautifully composed.
            </p>

            <form onSubmit={handleTestZip} className="flex max-w-md mx-auto gap-2 pt-2">
              <input
                type="text"
                placeholder="Enter 5-digit ZIP code (e.g. 94108)"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-[#16181E] border border-[#2B303C] rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5B26]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF5B26] hover:bg-[#E04515] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Check ZIP
              </button>
            </form>

            {checkedResult && (
              <div
                className={`p-4 rounded-lg text-xs max-w-md mx-auto text-left flex items-start gap-2.5 animate-in fade-in ${
                  checkedResult.isValid
                    ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-200'
                    : 'bg-amber-950/80 border border-amber-600/50 text-amber-200'
                }`}
              >
                {checkedResult.isValid ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block mb-0.5">
                    {checkedResult.isValid ? 'Eligible for Fast Delivery!' : 'Outside Delivery Radius'}
                  </span>
                  <span>{checkedResult.message}</span>
                </div>
              </div>
            )}

            {/* List of active delivery zones */}
            <div className="pt-6 border-t border-neutral-800 text-left">
              <span className="text-xs font-semibold text-neutral-300 block mb-3 text-center">
                Currently Serviced ZIP Codes:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {restaurantInfo.deliveryZones.map((zone) => (
                  <div
                    key={zone.zip}
                    className="p-2.5 bg-[#16181E] rounded-lg border border-[#252933] flex items-center justify-between"
                  >
                    <span className="font-mono font-bold text-white">{zone.zip}</span>
                    <span className="text-neutral-400 text-[11px] truncate max-w-[120px] text-right">
                      {zone.neighborhood}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
