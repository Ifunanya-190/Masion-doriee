import { useState, useEffect } from "react";
import { IconResolver } from "./icons";

const TIERS = [
  { name: "Bronze", min: 0, icon: "🥉", benefit: "Welcome Drink", next: 100 },
  { name: "Silver", min: 100, icon: "🥈", benefit: "10% Off All Orders", next: 300 },
  { name: "Gold", min: 300, icon: "🥇", benefit: "Priority Seating", next: 600 },
  { name: "Platinum", min: 600, icon: "👑", benefit: "Chef's Private Table", next: null },
];

function getTier(points) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

export default function LoyaltyWidget() {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
    setPoints(stored);

    const handleStorage = () => {
      const updated = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
      if (updated > points) {
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
      }
      setPoints(updated);
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(() => {
      const current = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
      if (current !== points) {
        if (current > points) {
          setFlash(true);
          setTimeout(() => setFlash(false), 1500);
        }
        setPoints(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [points]);

  const tier = getTier(points);
  const progress = tier.next ? ((points - tier.min) / (tier.next - tier.min)) * 100 : 100;

  return (
    <>
      {/* FAB Button */}
      <button
        className={`loyalty-fab ${flash ? "animate-bounce" : ""} flex items-center justify-center`}
        onClick={() => setOpen(!open)}
        title="Loyalty Rewards"
      >
        <IconResolver name="👑" style={{ width: "24px", height: "24px" }} />
      </button>

      {/* Points Earned Flash */}
      {flash && (
        <div className="fixed bottom-24 left-24 z-[901] bg-gold text-bg font-ui text-xs font-bold px-4 py-2 rounded-full animate-slide-in-up">
          +10 pts earned!
        </div>
      )}

      {/* Dashboard Panel */}
      {open && (
        <div
          className="fixed bottom-24 left-24 z-[901] w-[300px] bg-bg-card border border-gold/20 rounded-xl p-6 animate-slide-up"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-4 bg-transparent border-none text-tan text-lg cursor-pointer hover:text-cream"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="mb-2.5 flex justify-center text-gold">
              <IconResolver name={tier.icon} style={{ width: "40px", height: "40px" }} />
            </div>
            <div className="font-heading text-xl font-bold text-cream-light">{tier.name} Member</div>
            <div className="font-ui text-[10px] text-tan uppercase tracking-[.15em] mt-1">Loyalty Rewards</div>
          </div>

          {/* Points */}
          <div className="text-center mb-5 pb-5 border-b border-cream/5">
            <div className="font-heading text-3xl font-bold text-gold">{points}</div>
            <div className="font-ui text-[11px] text-tan mt-1">Total Points</div>
          </div>

          {/* Progress Bar */}
          {tier.next && (
            <div className="mb-5">
              <div className="flex justify-between font-ui text-[10px] text-tan mb-2">
                <span>{tier.name}</span>
                <span>{TIERS[TIERS.indexOf(tier) + 1]?.name}</span>
              </div>
              <div className="h-2 bg-cream/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background: "linear-gradient(90deg, #c06b1a, #d48a2c, #e89c3a)",
                  }}
                />
              </div>
              <div className="font-ui text-[10px] text-tan-dark mt-1.5 text-center">
                {tier.next - points} pts to next tier
              </div>
            </div>
          )}

          {/* Current Benefit */}
          <div className="bg-gold/5 border border-gold/10 rounded-lg p-4 text-center">
            <div className="font-ui text-[9px] text-gold font-semibold uppercase tracking-[.12em] mb-1">Your Benefit</div>
            <div className="font-heading text-sm text-cream-light">{tier.benefit}</div>
          </div>

          {/* Earn Info */}
          <div className="font-ui text-[10px] text-tan-dark text-center mt-4">
            Earn <span className="text-gold font-semibold">10 pts</span> per dish added to cart
          </div>
        </div>
      )}
    </>
  );
}
