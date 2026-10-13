import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, SelectedModifier } from '../types/restaurant';
import { Search, Plus, Filter, Sparkles, AlertCircle, ShoppingBag, Check } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const {
    categories,
    menuItems,
    setSelectedDish,
    addToCart,
    fulfillmentType,
    setFulfillmentType,
    restaurantInfo,
    setIsCartOpen,
    totalCartItemCount,
  } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  // Filtered menu items
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Category filter
      if (activeCategory !== 'all' && dish.categoryId !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter !== 'all') {
        if (!dish.dietary.includes(dietaryFilter as any)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(query);
        const matchItalian = dish.italianName?.toLowerCase().includes(query);
        const matchDesc = dish.description.toLowerCase().includes(query);
        return matchName || matchItalian || matchDesc;
      }

      return true;
    });
  }, [menuItems, activeCategory, dietaryFilter, searchQuery]);

  const handleCardClick = (dish: MenuItem) => {
    if (!dish.isAvailable) return;
    setSelectedDish(dish);
  };

  const handleQuickAdd = (e: React.MouseEvent, dish: MenuItem) => {
    e.stopPropagation();
    if (!dish.isAvailable) return;

    // Directly add dish to cart with initial default options if modifiers exist
    const defaultModifiers: SelectedModifier[] = [];
    if (dish.modifiers && dish.modifiers.length > 0) {
      dish.modifiers.forEach((mod) => {
        if (mod.options.length > 0) {
          const firstOpt = mod.options[0];
          defaultModifiers.push({
            modifierId: mod.id,
            modifierName: mod.name,
            optionId: firstOpt.id,
            optionName: firstOpt.name,
            priceDelta: firstOpt.priceDelta,
          });
        }
      });
    }

    addToCart(dish, 1, defaultModifiers, '');
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId((curr) => (curr === dish.id ? null : curr));
    }, 1500);
  };

  return (
    <div className="py-10 sm:py-16 bg-[#0E1013] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Menu Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#FF5B26] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Toyosu Market Seasonal Arrivals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            The Omakase & Roll Menu
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light">
            All nigiri hand-pressed with seasoned akazu Koshihikari rice. All sashimi sliced fresh to order.
          </p>

          {/* Fulfillment Toggle Banner */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1 bg-[#16181E] rounded-full border border-[#272B35]">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'bg-[#FF5B26] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Delivery ({restaurantInfo.estimatedDeliveryMinutes})
              </button>
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'bg-[#FF5B26] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Curbside Pickup ({restaurantInfo.estimatedPickupMinutes})
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls: Search, Dietary Filters, Category Tabs */}
        <div className="space-y-6 pt-4">
          {/* Top row: Search input & Dietary filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nigiri, sashimi, dragon rolls, gyoza..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#16181E] border border-[#272B35] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5B26]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'gluten-free', label: 'Gluten-Free' },
                { id: 'chef-choice', label: "Chef's Signatures" },
                { id: 'vegetarian', label: 'Vegetarian' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDietaryFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    dietaryFilter === filter.id
                      ? 'bg-[#FF5B26] text-white shadow-sm'
                      : 'bg-[#16181E] border border-[#272B35] text-neutral-400 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-[#222630] flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'border-[#FF5B26] text-[#FF5B26]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Full Menu ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'border-[#FF5B26] text-[#FF5B26]'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="py-20 text-center bg-[#16181E] rounded-2xl border border-[#272B35] space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No dishes found</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
              We couldn't find any dishes matching "{searchQuery}" with the current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setActiveCategory('all');
              }}
              className="text-xs font-semibold text-[#FF5B26] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => handleCardClick(dish)}
                className={`group bg-[#16181E] hover:bg-[#1A1D24] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  dish.isAvailable
                    ? 'border-[#272B35] hover:border-[#FF5B26]/50 shadow-md hover:shadow-xl cursor-pointer'
                    : 'border-[#272B35] opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Image slot */}
                <div className="relative aspect-[4/3] bg-[#0A0B0E] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181E] via-transparent to-transparent opacity-80" />

                  {/* Sold out overlay */}
                  {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest bg-[#0E1013] px-3 py-1.5 rounded">
                        Sold Out for Today
                      </span>
                    </div>
                  )}

                  {/* Quick Add Button removed from image overlay in favor of clean bottom action */}
                </div>

                {/* Dish content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 truncate">
                      {dish.italianName && <span className="text-[#FF5B26] font-medium truncate">{dish.italianName}</span>}
                      {dish.italianName && <span aria-hidden="true">·</span>}
                      <span>{dish.prepTimeMinutes}m</span>
                      {dish.dietary.includes('chef-choice') && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold">Chef's Pick</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF5B26] transition-colors mb-2">
                      {dish.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4 font-light">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#252933] flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      ${dish.price.toFixed(2)}
                    </span>

                    {dish.isAvailable ? (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, dish)}
                        className={`text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                          addedDishId === dish.id
                            ? 'bg-emerald-600 scale-102 ring-2 ring-emerald-400/50'
                            : 'bg-[#FF5B26] hover:bg-[#E04515] active:scale-95'
                        }`}
                        title="Add to Cart"
                      >
                        {addedDishId === dish.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-neutral-500">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Mobile Cart Bar if cart has items */}
        {totalCartItemCount > 0 && (
          <div className="sm:hidden fixed bottom-4 left-4 right-4 z-30">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-5 bg-[#FF5B26] text-white rounded-full shadow-2xl flex items-center justify-between font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>View Bag ({totalCartItemCount} items)</span>
              </div>
              <span>Open Bag →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
