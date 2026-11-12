export default function OrderTracker({ order, onClose, showToast }) {
  const steps = [
    { key: "Order Received",     icon: "⏳", doneIcon: "✓", title: "Order Received",     desc: "We've received your request and are preparing details." },
    { key: "Preparing in Kitchen", icon: "🔥", doneIcon: "✓", title: "Preparing in Kitchen", desc: "Chef Julian is crafting your signature dishes now." },
    { key: order.method === "delivery" ? "Out for Delivery" : "Ready for Pickup", icon: "🚚", doneIcon: "✓",
      title: order.method === "delivery" ? "Out for Delivery" : "Ready for Pickup",
      desc: order.method === "delivery" ? "Our courier is heading to your destination." : "Freshly packed and waiting at our collection counter." },
    { key: order.method === "delivery" ? "Delivered" : "Completed", icon: "🍽️", doneIcon: "🍽️",
      title: order.method === "delivery" ? "Delivered" : "Order Completed",
      desc: order.method === "delivery" ? "Enjoy your gourmet experience!" : "Thank you for dining with Maison Dorée." },
  ];

  const currentIdx = steps.findIndex(s => s.key === order.status);

  return (
    <div className="overlay active" onClick={onClose}>
      <div className="qr-modal flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>

        <div className="section-tag mb-2.5">Live Tracker</div>
        <h3 className="font-heading text-2xl font-bold text-cream-light mb-1">Track Your Order</h3>
        <div className="font-ui text-[10px] text-gold font-bold tracking-wider mb-6">ORDER ID: {order.id}</div>

        <div className="bg-gold/5 border border-gold/15 p-4 mb-6 rounded">
          <div className="flex justify-between font-ui text-[10px] text-tan uppercase tracking-wide mb-1">
            <span>Method: {order.method}</span>
            <span>Total: {order.total}</span>
          </div>
          <div className="font-ui text-xs text-cream-muted truncate">Items: {order.items?.join(", ")}</div>
        </div>

        <div className="tracker-stepper">
          <div className="tracker-stepper-progress" style={{
            height: currentIdx === 0 ? "0%" : currentIdx === 1 ? "33%" : currentIdx === 2 ? "66%" : "100%"
          }} />
          {steps.map((step, i) => {
            const done   = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} className={`tracker-step ${active ? "active" : ""} ${done ? "completed" : ""}`}>
                <div className="tracker-step-icon">
                  {done ? "✓" : active ? step.icon : i + 1}
                </div>
                <div>
                  <div className="tracker-step-title">{step.title}</div>
                  <div className="tracker-step-desc">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary w-full mt-8" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}