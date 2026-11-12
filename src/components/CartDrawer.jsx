import { Link } from "react-router-dom";

export default function CartDrawer({ cart, setCart, onClose, showToast, userProfile, onCheckout }) {
  const total = cart.reduce((s, i) => s + parseFloat(i.price.replace("$", "")), 0).toFixed(2);

  return (
    <div className="overlay active" onClick={onClose}>
      <div
        className="cart-drawer absolute top-0 right-0 h-full bg-bg-card border-l border-gold/10 flex flex-col active"
        style={{ padding: "48px 40px" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-heading text-2xl font-bold text-cream-light">Your Order</h3>
          <button onClick={onClose} className="bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center mt-[60px]">
              <div className="text-[40px] mb-4 opacity-20 text-cream">🍽️</div>
              <p className="font-ui text-sm text-brown-dark">Your order is empty</p>
              <Link to="/" onClick={onClose} className="font-ui text-[11px] text-gold mt-4 inline-block hover:underline">
                Browse the menu →
              </Link>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex gap-4 mb-5 pb-5 border-b border-cream/5">
                <div className="w-[60px] h-[60px] bg-bg-warm rounded flex items-center justify-center shrink-0">
                  <img src={item.img} className="w-4/5 h-4/5 object-contain" alt={item.name} />
                </div>
                <div className="flex-1">
                  <div className="font-heading text-sm font-bold text-cream-light">{item.name}</div>
                  <div className="font-ui text-xs text-gold">{item.price}</div>
                </div>
                <button
                  onClick={() => setCart(c => c.filter((_, idx) => idx !== i))}
                  className="bg-transparent border-none text-brown-dark cursor-pointer hover:text-cream text-base"
                >✕</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-auto pt-8 border-t border-gold/20">
            {userProfile && (
              <div className="font-ui text-[10px] text-gold mb-3 flex justify-between">
                <span>Loyalty points earned</span>
                <span>+{cart.length * 10} pts</span>
              </div>
            )}
            <div className="flex justify-between mb-5">
              <span className="font-ui text-xs text-tan font-semibold uppercase">Total</span>
              <span className="font-heading text-xl font-bold text-cream-light">${total}</span>
            </div>
            <button className="btn-primary w-full" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
