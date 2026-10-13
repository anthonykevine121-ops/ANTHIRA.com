import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { SelectedModifier } from '../types/restaurant';
import { X, Plus, Minus, Check, Clock, AlertCircle } from 'lucide-react';

export const DishDetailModal: React.FC = () => {
  const { selectedDish, setSelectedDish, addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize default options when modal opens
  useEffect(() => {
    if (selectedDish) {
      setQuantity(1);
      setSpecialInstructions('');
      setValidationError(null);

      // Auto-select first option for required modifiers
      const defaults: SelectedModifier[] = [];
      if (selectedDish.modifiers) {
        selectedDish.modifiers.forEach((mod) => {
          if (mod.required && mod.options.length > 0) {
            const firstOpt = mod.options[0];
            defaults.push({
              modifierId: mod.id,
              modifierName: mod.name,
              optionId: firstOpt.id,
              optionName: firstOpt.name,
              priceDelta: firstOpt.priceDelta,
            });
          }
        });
      }
      setSelectedModifiers(defaults);
    }
  }, [selectedDish]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDish(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedDish]);

  if (!selectedDish) return null;

  const handleSingleOptionSelect = (
    modifierId: string,
    modifierName: string,
    optionId: string,
    optionName: string,
    priceDelta: number
  ) => {
    setSelectedModifiers((prev) => {
      const filtered = prev.filter((m) => m.modifierId !== modifierId);
      return [
        ...filtered,
        { modifierId, modifierName, optionId, optionName, priceDelta },
      ];
    });
    setValidationError(null);
  };

  const handleMultiOptionToggle = (
    modifierId: string,
    modifierName: string,
    optionId: string,
    optionName: string,
    priceDelta: number
  ) => {
    setSelectedModifiers((prev) => {
      const exists = prev.some((m) => m.modifierId === modifierId && m.optionId === optionId);
      if (exists) {
        return prev.filter((m) => !(m.modifierId === modifierId && m.optionId === optionId));
      } else {
        return [
          ...prev,
          { modifierId, modifierName, optionId, optionName, priceDelta },
        ];
      }
    });
    setValidationError(null);
  };

  const isOptionSelected = (modifierId: string, optionId: string) => {
    return selectedModifiers.some((m) => m.modifierId === modifierId && m.optionId === optionId);
  };

  const unitPrice = useMemo(() => {
    const modsSum = selectedModifiers.reduce((acc, m) => acc + m.priceDelta, 0);
    return selectedDish.price + modsSum;
  }, [selectedDish, selectedModifiers]);

  const itemTotal = useMemo(() => {
    return Number((unitPrice * quantity).toFixed(2));
  }, [unitPrice, quantity]);

  const handleAddToCart = () => {
    const finalModifiers = [...selectedModifiers];
    if (selectedDish.modifiers) {
      for (const mod of selectedDish.modifiers) {
        if (mod.required) {
          const hasSelection = finalModifiers.some((m) => m.modifierId === mod.id);
          if (!hasSelection && mod.options.length > 0) {
            const firstOpt = mod.options[0];
            finalModifiers.push({
              modifierId: mod.id,
              modifierName: mod.name,
              optionId: firstOpt.id,
              optionName: firstOpt.name,
              priceDelta: firstOpt.priceDelta || 0,
            });
          }
        }
      }
    }

    addToCart(selectedDish, quantity, finalModifiers, specialInstructions);
    setSelectedDish(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      onClick={() => setSelectedDish(null)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#14161C] text-white rounded-2xl shadow-2xl border border-[#272B35] overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedDish(null)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white shadow-md transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Dish Header Image */}
          <div className="relative aspect-[16/9] w-full bg-[#0A0B0E] overflow-hidden">
            <img
              src={selectedDish.image}
              alt={selectedDish.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14161C] via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              {selectedDish.italianName && (
                <p className="text-xs uppercase tracking-widest text-[#FF5B26] font-semibold mb-1">
                  {selectedDish.italianName}
                </p>
              )}
              <h2 id="dish-modal-title" className="text-2xl sm:text-3xl text-white font-bold">
                {selectedDish.name}
              </h2>
            </div>
          </div>

          {/* Details & Modifiers Form */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#222630]">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-[#FF5B26]" />
                <span>Prep: ~{selectedDish.prepTimeMinutes} mins</span>
                {selectedDish.calories && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{selectedDish.calories} kcal</span>
                  </>
                )}
              </div>
              <div className="font-mono text-xl font-bold text-white tabular-nums">
                ${selectedDish.price.toFixed(2)}
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {selectedDish.description}
            </p>

            {/* Error Message if required choice missed */}
            {validationError && (
              <div className="p-3 bg-red-950/80 border border-red-700/60 rounded-lg text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Modifiers List */}
            {selectedDish.modifiers && selectedDish.modifiers.length > 0 && (
              <div className="space-y-6 pt-2">
                {selectedDish.modifiers.map((modifier) => (
                  <div key={modifier.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        {modifier.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {modifier.required ? (
                          <span className="text-[#FF5B26] font-medium">Required · Choose 1</span>
                        ) : (
                          <span>Optional</span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {modifier.options.map((option) => {
                        const selected = isOptionSelected(modifier.id, option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (modifier.required) {
                                handleSingleOptionSelect(
                                  modifier.id,
                                  modifier.name,
                                  option.id,
                                  option.name,
                                  option.priceDelta
                                );
                              } else {
                                handleMultiOptionToggle(
                                  modifier.id,
                                  modifier.name,
                                  option.id,
                                  option.name,
                                  option.priceDelta
                                );
                              }
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                              selected
                                ? 'border-[#FF5B26] bg-[#FF5B26]/10 text-white'
                                : 'border-[#272B35] hover:border-neutral-600 text-neutral-300 bg-[#1A1D24]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-${
                                  modifier.required ? 'full' : 'sm'
                                } border flex items-center justify-center transition-colors ${
                                  selected
                                    ? 'bg-[#FF5B26] border-[#FF5B26] text-white'
                                    : 'border-neutral-600'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="font-medium">{option.name}</span>
                            </div>
                            <span className="font-mono text-xs tabular-nums text-neutral-400">
                              {option.priceDelta > 0
                                ? `+$${option.priceDelta.toFixed(2)}`
                                : 'Included'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions Input */}
            <div className="pt-2 space-y-2">
              <label htmlFor="special-instructions" className="block text-xs font-semibold text-white">
                Chef Preparation or Allergy Notes
              </label>
              <textarea
                id="special-instructions"
                rows={2}
                placeholder="e.g. extra pickled ginger, tamari gluten-free on the side, no sesame..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-[#272B35] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5B26] bg-[#16181E] text-white placeholder-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-6 border-t border-[#222630] bg-[#101217] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#272B35] rounded-lg bg-[#16181E] overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 hover:bg-[#20232B] text-white disabled:text-neutral-600 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-mono font-bold text-sm text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 hover:bg-[#20232B] text-white transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#FF5B26] hover:bg-[#E04515] text-white font-bold text-sm rounded-xl flex items-center justify-between shadow-lg shadow-[#FF5B26]/20 transition-all cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="font-mono font-bold tabular-nums">
              ${itemTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
