import { useState } from "react";
import { MEAL_BUILDER } from "../data";
import { Anim } from "../utils";
import { IconResolver } from "./icons";

const STEPS = [
  { key: "proteins", label: "Protein", icon: "🥩", multi: false },
  { key: "sides", label: "Side", icon: "🥗", multi: false },
  { key: "sauces", label: "Sauce", icon: "🫗", multi: false },
  { key: "extras", label: "Extras", icon: "✨", multi: true },
];

export default function MealBuilder({ onAddToCart }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ proteins: null, sides: null, sauces: null, extras: [] });

  const currentStep = STEPS[step];
  const options = MEAL_BUILDER[currentStep.key];

  const handleSelect = (item) => {
    if (currentStep.multi) {
      setSelections((prev) => {
        const arr = prev.extras || [];
        const exists = arr.find((e) => e.name === item.name);
        return { ...prev, extras: exists ? arr.filter((e) => e.name !== item.name) : [...arr, item] };
      });
    } else {
      setSelections((prev) => ({ ...prev, [currentStep.key]: item }));
    }
  };

  const isSelected = (item) => {
    if (currentStep.multi) return (selections.extras || []).some((e) => e.name === item.name);
    return selections[currentStep.key]?.name === item.name;
  };

  const total = [selections.proteins, selections.sides, selections.sauces, ...(selections.extras || [])]
    .filter(Boolean)
    .reduce((sum, item) => sum + item.price, 0);

  const selectedTags = [selections.proteins, selections.sides, selections.sauces, ...(selections.extras || [])].filter(Boolean);

  const handleAdd = () => {
    if (!selections.proteins) return;
    onAddToCart({
      name: `Custom Plate: ${selections.proteins.name}`,
      price: `$${total.toFixed(2)}`,
      img: "/images/hero-dish.png",
    });
    setSelections({ proteins: null, sides: null, sauces: null, extras: [] });
    setStep(0);
  };

  return (
    <section className="bg-bg-dark" style={{ padding: "100px 48px" }}>
      <div className="max-w-[1200px] mx-auto">
        <Anim>
          <div className="text-center mb-16">
            <div className="section-tag">Craft Your Experience</div>
            <div className="gold-divider" />
            <h2 className="font-heading font-bold text-cream-light mt-2" style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}>
              Build Your Plate
            </h2>
            <p className="font-ui text-[13px] text-brown mt-2.5">
              Compose your perfect meal, step by step
            </p>
          </div>
        </Anim>

        <Anim delay={0.1}>
          <div className="glass-card p-8 md:p-10">
            {/* Step Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-ui text-xs font-semibold tracking-[.08em] uppercase transition-all duration-300 border whitespace-nowrap ${
                    step === i
                      ? "bg-gold/10 border-gold/30 text-gold"
                      : "bg-transparent border-cream/5 text-tan hover:border-gold/15 hover:text-cream-muted"
                  }`}
                >
                  <span className="flex items-center text-gold"><IconResolver name={s.icon} style={{ width: "16px", height: "16px" }} /></span>
                  <span>{i + 1}. {s.label}</span>
                  {selections[s.key] && !s.multi && <span className="text-gold">✓</span>}
                  {s.multi && (selections.extras || []).length > 0 && (
                    <span className="bg-gold text-bg-dark text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                      {selections.extras.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {options.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleSelect(item)}
                  className={`meal-step text-center ${isSelected(item) ? "active" : ""}`}
                >
                  <div className="mb-3 flex justify-center text-gold">
                    <IconResolver name={item.emoji} style={{ width: "32px", height: "32px" }} />
                  </div>
                  <div className="font-heading text-sm font-semibold text-cream-light mb-1">{item.name}</div>
                  <div className="font-ui text-xs text-gold font-semibold">${item.price}</div>
                </div>
              ))}
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-cream/5">
                <span className="font-ui text-[10px] text-tan uppercase tracking-wider self-center mr-2">Your plate:</span>
                {selectedTags.map((item) => (
                  <span key={item.name} className="font-ui text-xs bg-gold/10 text-gold border border-gold/20 rounded-full px-3.5 py-1 flex items-center gap-1.5">
                    <IconResolver name={item.emoji} style={{ width: "14px", height: "14px" }} />
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Total + Add Button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-ui text-xs text-tan uppercase tracking-wider mr-3">Total:</span>
                <span className="font-heading text-2xl font-bold text-gold">${total.toFixed(2)}</span>
              </div>
              <button
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!selections.proteins}
                onClick={handleAdd}
              >
                Add Custom Plate to Cart
              </button>
            </div>
          </div>
        </Anim>
      </div>
    </section>
  );
}
