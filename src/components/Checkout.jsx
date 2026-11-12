import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import emailjs from "@emailjs/browser";
import { Anim } from "../utils";
import { BRAND } from "../data";
import { EMAIL_CONFIG } from "../App";

const mont = (size, color, weight = 400) => ({ fontFamily: "'Montserrat',sans-serif", fontSize: size, color, fontWeight: weight });
const play = (size, weight = 700) => ({ fontFamily: "'Playfair Display',serif", fontSize: size, fontWeight: weight });

export default function Checkout({ cart, setCart, userProfile, setActiveOrder, showToast }) {
  const [name,             setName]             = useState(userProfile?.name  || "");
  const [email,            setEmail]            = useState(userProfile?.email || "");
  const [isDelivery,       setIsDelivery]       = useState(false);
  const [address,          setAddress]          = useState("");
  const [phone,            setPhone]            = useState("");
  const [paymentMethod,    setPaymentMethod]    = useState("cod");
  const [verifying,        setVerifying]        = useState(false);
  const [placed,           setPlaced]           = useState(false);
  const [orderId,          setOrderId]          = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
  }, []);

  if (cart.length === 0 && !placed) {
    return (
      <div style={{ background: "#0f0d0b", minHeight: "100vh", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ ...play(28), color: "#f0e6d0" }}>Your cart is empty</div>
        <Link to="/" className="btn-primary" style={{ textDecoration: "none", padding: "14px 32px" }}>Browse Menu</Link>
      </div>
    );
  }

  const subtotal   = cart.reduce((s, i) => s + parseFloat(i.price.replace("$", "")), 0);
  const deliveryFee = isDelivery ? 5 : 0;
  const total      = (subtotal + deliveryFee).toFixed(2);

  const submitOrder = async (e) => {
    e?.preventDefault();
    if (paymentMethod === "qr") { setVerifying(true); await new Promise(r => setTimeout(r, 2000)); setVerifying(false); }

    const id = "MD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);

    const orderData = {
      id,
      status:        "Order Received",
      items:         cart.map(i => i.name),
      total:         `$${total}`,
      method:        isDelivery ? "delivery" : "pickup",
      address:       isDelivery ? address : "",
      phone:         isDelivery ? phone : "",
      timestamp:     Date.now(),
      paymentMethod,
      customerName:  name,
      customerEmail: email,
    };

    setActiveOrder(orderData);
    localStorage.setItem("activeOrder", JSON.stringify(orderData));

    // Save to order history
    const history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    history.unshift({ ...orderData, completedAt: new Date().toISOString() });
    localStorage.setItem("orderHistory", JSON.stringify(history));

    // Update loyalty points
    if (userProfile) {
      const pts = (userProfile.points || 0) + cart.length * 10;
      const updated = { ...userProfile, points: pts };
      localStorage.setItem("userProfile", JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const idx = users.findIndex(u => u.email === userProfile.email);
      if (idx !== -1) { users[idx].points = pts; localStorage.setItem("registeredUsers", JSON.stringify(users)); }
    }

    try {
      await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, {
        name, email,
        title: `Order Placed — ${id}`,
        message: `Order ID: ${id}\nMethod: ${isDelivery ? "Delivery" : "Pickup"}\nItems: ${cart.map(i => i.name).join(", ")}\nTotal: $${total}\nAddress: ${isDelivery ? address : "N/A"}`
      });
    } catch (err) { console.error(err); }

    setCart([]);
    setPlaced(true);
  };

  if (placed) {
    return (
      <div style={{ background: "#0f0d0b", minHeight: "100vh", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px" }}>
        <div style={{ maxWidth: 480, width: "100%", background: "#141210", border: "1px solid rgba(212,138,44,.2)", padding: "52px 40px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d48a2c,transparent)" }} />
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(212,138,44,.08)", border: "2px solid #d48a2c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 30, color: "#d48a2c" }}>✓</div>
          <div style={{ ...mont(9, "#d48a2c", 600), letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 8 }}>Order Confirmed</div>
          <h2 style={{ ...play(28), color: "#f0e6d0", marginBottom: 20 }}>Your Order is Placed!</h2>
          <div style={{ display: "inline-block", background: "rgba(212,138,44,.08)", border: "1px solid rgba(212,138,44,.2)", padding: "8px 24px", ...play(20), color: "#d48a2c", marginBottom: 24 }}>{orderId}</div>
          <p style={{ ...mont(13, "#6b5e50"), lineHeight: 1.8, marginBottom: 28 }}>
            {isDelivery
              ? "Our kitchen is preparing your order. Your courier will be on the way shortly."
              : "Your order is being prepared. Come collect at your chosen time."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/profile" className="btn-primary" style={{ textDecoration: "none", display: "block", padding: "14px 0" }}>Track in My Profile</Link>
            <Link to="/" style={{ ...mont(12, "#5a4e42"), textDecoration: "none", marginTop: 8 }}>Back to Restaurant</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0f0d0b", color: "#e8d9c0", fontFamily: "'Cormorant Garamond','Georgia',serif", minHeight: "100vh", paddingTop: 68 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <Anim>
          <div style={{ marginBottom: 40 }}>
            <div className="section-tag" style={{ marginBottom: 8 }}>Checkout</div>
            <h1 style={{ ...play("clamp(28px,4vw,44px)", 900), color: "#f0e6d0" }}>Complete Your Order</h1>
          </div>
        </Anim>

        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* LEFT — FORM */}
          <div style={{ flex: "1.2 1 380px" }}>
            <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* CUSTOMER DETAILS */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 28 }}>
                <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 20 }}>Your Details</div>
                {userProfile ? (
                  <div style={{ background: "rgba(212,138,44,.05)", border: "1px solid rgba(212,138,44,.12)", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={mont(11, "#d48a2c", 600)}>Ordering as</div>
                      <div style={{ ...play(15), color: "#f0e6d0" }}>{userProfile.name}</div>
                      <div style={mont(12, "#6b5e50")}>{userProfile.email}</div>
                    </div>
                    <span style={{ ...mont(10, "#4caf7d", 600) }}>✓ Logged In</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jean-Luc" className="input-field w-full" />
                    </div>
                    <div>
                      <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>Email</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-field w-full" />
                    </div>
                    <div style={{ ...mont(11, "#5a4e42"), padding: "10px 14px", background: "rgba(212,138,44,.04)", border: "1px solid rgba(212,138,44,.1)" }}>
                      <Link to="/login" style={{ color: "#d48a2c" }}>Sign in</Link> to earn loyalty points and save your order history.
                    </div>
                  </div>
                )}
              </div>

              {/* DINING METHOD */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 28 }}>
                <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 20 }}>Collection Method</div>
                <div className="checkout-toggle" style={{ marginBottom: isDelivery ? 20 : 0 }}>
                  <button type="button" className={`checkout-toggle-btn ${!isDelivery ? "active" : ""}`} onClick={() => setIsDelivery(false)}>Table Pickup (Free)</button>
                  <button type="button" className={`checkout-toggle-btn ${isDelivery ? "active" : ""}`} onClick={() => setIsDelivery(true)}>Home Delivery (+$5.00)</button>
                </div>
                {isDelivery && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                    <div>
                      <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>Delivery Address</label>
                      <input type="text" required value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, Postcode" className="input-field w-full" />
                    </div>
                    <div>
                      <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>Contact Phone</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7123 456789" className="input-field w-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* PAYMENT */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 28 }}>
                <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 20 }}>Payment Method</div>
                <div className="checkout-toggle">
                  <button type="button" className={`checkout-toggle-btn ${paymentMethod === "cod" ? "active" : ""}`} onClick={() => setPaymentMethod("cod")}>
                    {isDelivery ? "Cash on Delivery" : "Pay at Counter"}
                  </button>
                  <button type="button" className={`checkout-toggle-btn ${paymentMethod === "qr" ? "active" : ""}`} onClick={() => setPaymentMethod("qr")}>
                    Scan QR & Pay Now
                  </button>
                </div>
                {paymentMethod === "qr" && (
                  <div className="payment-qr-wrap" style={{ marginTop: 20 }}>
                    <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Maison Dorée Instant Pay</div>
                    <div className="payment-qr-img">
                      <QRCodeSVG value={`https://maisondoree.com/pay?amt=${total}`} size={110} bgColor="#ffffff" fgColor="#1a1008" level="M" />
                    </div>
                    <div style={{ ...mont(12, "#8a7a68"), textAlign: "center", marginTop: 8 }}>Scan with your banking app</div>
                    <div style={{ ...play(22), color: "#d48a2c", textAlign: "center", marginTop: 4 }}>${total}</div>
                  </div>
                )}
              </div>

              {verifying ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 20 }}>
                  <div style={{ width: 20, height: 20, border: "2px solid #d48a2c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span style={mont(12, "#d48a2c", 600)}>Verifying payment...</span>
                </div>
              ) : (
                <button type="submit" className="btn-primary w-full" style={{ fontSize: 12, padding: 18 }}>
                  {paymentMethod === "qr" ? "I Have Paid — Complete Order" : "Place Order"}
                </button>
              )}
            </form>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div style={{ flex: "0.8 1 280px", position: "sticky", top: 88 }}>
            <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 28 }}>
              <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 20 }}>Order Summary</div>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(232,217,192,.04)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...play(14), color: "#e8d9c0" }}>{item.name}</div>
                  </div>
                  <div style={mont(13, "#d48a2c")}>{item.price}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(232,217,192,.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={mont(12, "#6b5e50")}>Subtotal</span>
                  <span style={mont(12, "#c8b99a")}>${subtotal.toFixed(2)}</span>
                </div>
                {isDelivery && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={mont(12, "#6b5e50")}>Delivery</span>
                    <span style={mont(12, "#d48a2c")}>+$5.00</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(212,138,44,.2)" }}>
                  <span style={{ ...play(16), color: "#f0e6d0" }}>Total</span>
                  <span style={{ ...play(20), color: "#d48a2c" }}>${total}</span>
                </div>
              </div>
              {userProfile && (
                <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(212,138,44,.05)", border: "1px solid rgba(212,138,44,.1)" }}>
                  <div style={mont(10, "#d48a2c", 600)}>Loyalty Points</div>
                  <div style={mont(13, "#c8b99a")}>You'll earn +{cart.length * 10} pts for this order</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}