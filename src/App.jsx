import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QRCodeSVG } from "qrcode.react";
import emailjs from "@emailjs/browser";
import { LOCAL_IP } from "./ip-config";
import LuxuryBakery from './LuxuryBakery';
import About from './About';
import Contact from './Contact';
import Navigation from './Navigation';
import LoyaltyWidget from './components/LoyaltyWidget';
import { IconResolver } from './components/icons';

const BASE_URL = `http://${LOCAL_IP}:5000`;

const EMAIL_CONFIG = {
  SERVICE_ID: "service_dgigp18",
  TEMPLATE_ID: "template_7up07qm",
  PUBLIC_KEY: "w9XKj8v7KhAtFlQYt",
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [qrModal, setQrModal] = useState(false);
  const [qrType, setQrType] = useState("reservation");
  const [toastMsg, setToastMsg] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");

  // Profile / Login State
  const [userProfile, setUserProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Delivery configuration
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");

  // Payment configuration
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "qr"
  const [paymentVerifying, setPaymentVerifying] = useState(false);

  // Live order tracker state
  const [activeOrder, setActiveOrder] = useState(null);
  const [trackerOpen, setTrackerOpen] = useState(false);

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
    }

    // Seed mock users
    if (!localStorage.getItem("registeredUsers")) {
      localStorage.setItem("registeredUsers", JSON.stringify([
        { name: "Julian Dorée", email: "chef@website.com", points: 350 },
        { name: "Jane Doe", email: "jane@example.com", points: 120 }
      ]));
    }

    // Load profile if stored
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
    // Load active order if stored
    const storedOrder = localStorage.getItem("activeOrder");
    if (storedOrder) {
      const order = JSON.parse(storedOrder);
      const elapsed = Date.now() - order.timestamp;
      if (elapsed < 60000) { // Active for 60 seconds
        setActiveOrder(order);
        setReceiptData(order);
      }
    }
  }, []);

  // Sync order tracker status progression
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === "Completed" || activeOrder.status === "Delivered") return;

    const interval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        let nextStatus = prev.status;
        if (prev.status === "Order Received") {
          nextStatus = "Preparing in Kitchen";
        } else if (prev.status === "Preparing in Kitchen") {
          nextStatus = prev.method === "delivery" ? "Out for Delivery" : "Ready for Pickup";
        } else if (prev.status === "Out for Delivery" || prev.status === "Ready for Pickup") {
          nextStatus = prev.method === "delivery" ? "Delivered" : "Completed";
        }

        const updatedOrder = { ...prev, status: nextStatus };
        localStorage.setItem("activeOrder", JSON.stringify(updatedOrder));
        return updatedOrder;
      });
    }, 12000); // Progress every 12 seconds

    return () => clearInterval(interval);
  }, [activeOrder]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const addToCart = (item) => {
    setCart((c) => [...c, item]);
    showToast(`${item.name} added to cart`);
    
    // Save loyalty points
    const currentPoints = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
    const newPoints = currentPoints + 10;
    localStorage.setItem("loyaltyPoints", newPoints.toString());

    // Sync profile points
    if (userProfile) {
      const updatedProfile = { ...userProfile, points: newPoints };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }
  };

  const openQR = (type) => {
    setQrType(type);
    setQrModal(true);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Pre-populate checkout details if logged in
    if (userProfile) {
      setCheckoutName(userProfile.name);
      setCheckoutEmail(userProfile.email);
    }
    setCheckoutModalOpen(true);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = storedUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    
    if (user) {
      setUserProfile(user);
      localStorage.setItem("userProfile", JSON.stringify(user));
      setLoginEmail("");
      setProfileModalOpen(false);
      showToast(`Welcome back, ${user.name}!`);
    } else {
      showToast("Account not found. Try Signing Up.");
      setIsSigningUp(true);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!loginName || !loginEmail) return;

    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const exists = storedUsers.some(u => u.email.toLowerCase() === loginEmail.toLowerCase());

    if (exists) {
      showToast("Email already exists. Signing you in...");
      const user = storedUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
      setUserProfile(user);
      localStorage.setItem("userProfile", JSON.stringify(user));
      setLoginName("");
      setLoginEmail("");
      setProfileModalOpen(false);
      return;
    }

    const newUser = {
      name: loginName,
      email: loginEmail,
      points: 0
    };
    
    storedUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));
    setUserProfile(newUser);
    localStorage.setItem("userProfile", JSON.stringify(newUser));
    
    setLoginName("");
    setLoginEmail("");
    setProfileModalOpen(false);
    showToast(`Account created! Welcome, ${newUser.name}.`);
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("userProfile");
    showToast("Signed out successfully");
  };

  const submitCheckout = async (e) => {
    e.preventDefault();
    const finalName = userProfile ? userProfile.name : checkoutName;
    const finalEmail = userProfile ? userProfile.email : checkoutEmail;
    
    if (!finalName || !finalEmail) return;

    if (isDelivery && (!deliveryAddress || !deliveryPhone)) {
      showToast("Please enter delivery address and phone.");
      return;
    }

    if (paymentMethod === "qr") {
      setPaymentVerifying(true);
      setTimeout(() => {
        setPaymentVerifying(false);
        executeOrderPlacement(finalName, finalEmail);
      }, 2000);
    } else {
      executeOrderPlacement(finalName, finalEmail);
    }
  };

  const executeOrderPlacement = async (finalName, finalEmail) => {
    showToast("Processing your order...");
    setCheckoutModalOpen(false);
    
    const orderId = "MD-" + Math.floor(100000 + Math.random() * 900000);
    const items = cart.map((i) => i.name).join(", ");
    const cartTotalVal = cart.reduce((s, i) => s + parseFloat(i.price.replace("$", "")), 0);
    const finalTotal = isDelivery ? cartTotalVal + 5 : cartTotalVal;
    
    // Update loyalty points
    const currentPoints = parseInt(localStorage.getItem("loyaltyPoints") || "0", 10);
    const addedPoints = cart.length * 10;
    const newPoints = currentPoints + addedPoints;
    localStorage.setItem("loyaltyPoints", newPoints.toString());

    if (userProfile) {
      const updatedProfile = { ...userProfile, points: newPoints };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }

    const orderData = {
      id: orderId,
      status: "Order Received",
      items: cart.map((i) => i.name),
      total: `$${finalTotal.toFixed(2)}`,
      method: isDelivery ? "delivery" : "pickup",
      address: isDelivery ? deliveryAddress : "",
      phone: isDelivery ? deliveryPhone : "",
      timestamp: Date.now(),
      paymentMethod: paymentMethod,
      customerName: finalName,
      customerEmail: finalEmail
    };

    setActiveOrder(orderData);
    setReceiptData(orderData);
    localStorage.setItem("activeOrder", JSON.stringify(orderData));
    
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      try {
        await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, {
          name: finalName,
          email: finalEmail,
          title: `Order Placed - ${orderId}`,
          message: `Order ID: ${orderId}\nMethod: ${isDelivery ? "Delivery" : "Pickup"}\nItems: ${items}\nTotal: $${finalTotal.toFixed(2)}\nAddress: ${isDelivery ? deliveryAddress : "N/A"}\nPhone: ${isDelivery ? deliveryPhone : "N/A"}`
        });
        showToast("Order placed! Tracking initiated.");
        setCart([]);
        setCartOpen(false);
        setCheckoutName("");
        setCheckoutEmail("");
        setDeliveryAddress("");
        setDeliveryPhone("");
        setIsDelivery(false);
        setPaymentMethod("cod");
        setTrackerOpen(true);
      } catch (err) {
        console.error("Order failed:", err);
        showToast("Failed to send order email.");
      }
    } else {
      setTimeout(() => {
        showToast("Order placed successfully! Tracking initiated.");
        setCart([]);
        setCartOpen(false);
        setCheckoutName("");
        setCheckoutEmail("");
        setDeliveryAddress("");
        setDeliveryPhone("");
        setIsDelivery(false);
        setPaymentMethod("cod");
        setTrackerOpen(true);
      }, 1500);
    }
  };

  return (
    <BrowserRouter>
      <Navigation 
        onQROpen={openQR} 
        cartCount={cart.length} 
        onCartOpen={() => setCartOpen(true)}
        userProfile={userProfile}
        onProfileOpen={() => setProfileModalOpen(true)}
        activeOrder={activeOrder}
        onTrackerOpen={() => setTrackerOpen(true)}
      />
      
      <LoyaltyWidget />
      
      {/* Toast Notification */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
      
      <Routes>
        <Route 
          path="/" 
          element={
            <LuxuryBakery 
              cart={cart}
              setCart={setCart}
              qrModal={qrModal}
              setQrModal={setQrModal}
              qrType={qrType}
              setQrType={setQrType}
              toastMsg={toastMsg}
              setToastMsg={setToastMsg}
              addToCart={addToCart}
              openQR={openQR}
              showToast={showToast}
              cartOpen={cartOpen}
              setCartOpen={setCartOpen}
            />
          } 
        />
        <Route 
          path="/about" 
          element={<About />} 
        />
        <Route 
          path="/contact" 
          element={
            <Contact 
              showToast={showToast}
            />
          } 
        />
      </Routes>

      {/* ═══════════ GLOBAL CART DRAWER ═══════════ */}
      <div className={`overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)}>
        <div className={`cart-drawer absolute top-0 right-0 h-full bg-bg-card border-l border-gold/10 flex flex-col ${cartOpen ? 'active' : ''}`} style={{ padding: "48px 40px" }} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-heading text-2xl font-bold text-cream-light">Your Order</h3>
            <button onClick={() => setCartOpen(false)} className="bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center mt-[60px]">
                <div className="text-[40px] mb-4 opacity-20 flex justify-center text-cream">
                  <IconResolver name="🍽️" style={{ width: "48px", height: "48px" }} />
                </div>
                <p className="font-ui text-sm text-brown-dark">Your order is empty</p>
              </div>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="flex gap-4 mb-5 pb-5 border-b border-cream/5">
                  <div className="w-[60px] h-[60px] bg-bg-warm rounded flex items-center justify-center">
                    <img src={item.img} className="w-4/5 h-4/5 object-contain" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="font-heading text-sm font-bold text-cream-light">{item.name}</div>
                    <div className="font-ui text-xs text-gold">{item.price}</div>
                  </div>
                  <button onClick={() => setCart((c) => c.filter((_, idx) => idx !== i))} className="bg-transparent border-none text-brown-dark cursor-pointer hover:text-cream">✕</button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-auto pt-8 border-t border-gold/20">
              <div className="flex justify-between mb-5">
                <span className="font-ui text-xs text-tan font-semibold">TOTAL</span>
                <span className="font-heading text-xl font-bold text-cream-light">${cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0).toFixed(2)}</span>
              </div>
              <button className="btn-primary w-full" onClick={handleCheckout}>Checkout Now</button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ GLOBAL QR MODAL ═══════════ */}
      <div className={`overlay ${qrModal ? 'active' : ''}`} onClick={() => setQrModal(false)}>
        <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setQrModal(false)} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
          <div className="section-tag mb-2.5">{qrType === "reservation" ? "Table Reservation" : "Quick Order"}</div>
          <h3 className="font-heading text-[26px] font-bold text-cream-light mb-2">{qrType === "reservation" ? "Reserve Your Spot" : "Order & Collect"}</h3>
          <p className="font-ui text-xs text-tan-dark leading-relaxed mb-8">
            {qrType === "reservation" ? "Scan the QR code with your phone camera to instantly reserve a table. No account or app needed." : "Scan to open our full menu, add items to your order, and select a pickup time."}
          </p>
          <div className="bg-gold/5 border border-dashed border-gold/20 p-3 rounded-lg mb-6 font-ui text-[10px] text-brown-warm leading-relaxed">
            <strong>Note:</strong> Since this is a local preview, scanning with your phone requires both devices to be on the same Wi-Fi network.
          </div>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-4 border border-gold/15 rounded-2xl" style={{ animation: "scan-ring 2s ease-in-out infinite" }} />
              <div className="p-5 bg-white rounded-2xl" style={{ boxShadow: "0 0 40px rgba(212,138,44,0.15)" }}>
                <QRCodeSVG value={qrType === "reservation" ? `${BASE_URL}/reserve.html` : `${BASE_URL}/order.html`} size={180} bgColor="#ffffff" fgColor="#1a1008" level="H" includeMargin={true} />
              </div>
              <div className="absolute top-1/2 -left-5 -right-5 h-0.5" style={{ background: "linear-gradient(90deg,transparent,rgba(212,138,44,.5),transparent)", animation: "scan-line 2s ease-in-out infinite" }} />
            </div>
          </div>
          <div className="bg-bg-warm-light border border-gold/10 mb-6" style={{ padding: "18px 22px" }}>
            <div className="font-ui text-[10px] text-gold font-semibold tracking-[.15em] uppercase mb-2.5">How it works</div>
            {(qrType === "reservation" ? ["Scan the QR code with your camera", "Fill in your date and party size", "Confirm your booking instantly"] : ["Scan the QR code with your camera", "Browse the menu and add items", "Choose your collection time"]).map((step, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <div className="w-[22px] h-[22px] bg-gold text-bg rounded-full flex items-center justify-center font-ui text-[10px] font-bold shrink-0">{i + 1}</div>
                <span className="font-ui text-xs text-tan">{step}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            <a href={qrType === "reservation" ? "/reserve.html" : "/order.html"} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center no-underline block" style={{ padding: "14px 0" }}>
              {qrType === "reservation" ? "Open Reservation" : "Open Menu"}
            </a>
            <button className="btn-outline flex-1" onClick={() => setQrType(qrType === "reservation" ? "order" : "reservation")}>
              Switch to {qrType === "reservation" ? "Order" : "Reserve"}
            </button>
          </div>
          <div className="text-center mt-5 font-ui text-[10px] text-brown-darker">No app required · Works with any smartphone camera</div>
        </div>
      </div>

      {/* ═══════════ GLOBAL CHECKOUT MODAL ═══════════ */}
      <div className={`overlay ${checkoutModalOpen ? 'active' : ''}`} onClick={() => setCheckoutModalOpen(false)}>
        <div className="qr-modal flex flex-col" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setCheckoutModalOpen(false)} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
          <div className="section-tag mb-2.5">Checkout</div>
          <h3 className="font-heading text-[26px] font-bold text-cream-light mb-2">Complete Your Order</h3>
          <p className="font-ui text-xs text-tan-dark leading-relaxed mb-6">
            Provide details to complete your order and receive your receipt.
          </p>
          
          <form onSubmit={submitCheckout} className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-1">
            {/* User details */}
            {userProfile ? (
              <div className="bg-bg-warm-light border border-gold/10 p-3 rounded mb-2 flex justify-between items-center">
                <div>
                  <div className="font-ui text-[10px] text-gold uppercase tracking-wider">Ordering As</div>
                  <div className="font-heading text-sm font-semibold text-cream-light">{userProfile.name}</div>
                  <div className="font-ui text-[11px] text-tan">{userProfile.email}</div>
                </div>
                <span className="text-gold text-xs">✓ Logged In</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Name</label>
                  <input 
                    type="text" 
                    value={checkoutName} 
                    onChange={(e) => setCheckoutName(e.target.value)} 
                    placeholder="e.g. Jane Doe" 
                    required 
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={checkoutEmail} 
                    onChange={(e) => setCheckoutEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required 
                    className="input-field w-full"
                  />
                </div>
              </div>
            )}

            {/* Dining Method Toggle */}
            <div>
              <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Dining Method</label>
              <div className="checkout-toggle">
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${!isDelivery ? "active" : ""}`}
                  onClick={() => setIsDelivery(false)}
                >
                  Table Pickup (Free)
                </button>
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${isDelivery ? "active" : ""}`}
                  onClick={() => setIsDelivery(true)}
                >
                  Home Delivery (+$5.00)
                </button>
              </div>
            </div>

            {/* Delivery Fields */}
            {isDelivery && (
              <div className="flex flex-col gap-3 animation-fade-in">
                <div>
                  <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Delivery Address</label>
                  <input 
                    type="text" 
                    value={deliveryAddress} 
                    onChange={(e) => setDeliveryAddress(e.target.value)} 
                    placeholder="Street, City, Postcode" 
                    required 
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Contact Phone</label>
                  <input 
                    type="tel" 
                    value={deliveryPhone} 
                    onChange={(e) => setDeliveryPhone(e.target.value)} 
                    placeholder="+44 7123 456789" 
                    required 
                    className="input-field w-full"
                  />
                </div>
              </div>
            )}

            {/* Payment Method Toggle */}
            <div>
              <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Payment Option</label>
              <div className="checkout-toggle">
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${paymentMethod === "cod" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  {isDelivery ? "Cash on Delivery" : "Pay at Counter"}
                </button>
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${paymentMethod === "qr" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("qr")}
                >
                  Scan QR & Pay Now
                </button>
              </div>
            </div>

            {/* QR Mock Payment Code */}
            {paymentMethod === "qr" && (
              <div className="payment-qr-wrap">
                <div className="font-ui text-[10px] text-gold uppercase tracking-wider mb-2 font-bold">Maison Dorée Instant Pay</div>
                <div className="payment-qr-img">
                  <QRCodeSVG 
                    value={`https://maisondoree.com/pay?amt=${(cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0) + (isDelivery ? 5 : 0)).toFixed(2)}`} 
                    size={110} 
                    bgColor="#ffffff" 
                    fgColor="#1a1008" 
                    level="M" 
                  />
                </div>
                <div className="font-ui text-[11px] text-cream-muted text-center mb-1">
                  Scan with your banking app or wallet to transfer
                </div>
                <div className="font-heading text-lg font-bold text-gold">
                  ${(cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0) + (isDelivery ? 5 : 0)).toFixed(2)}
                </div>
              </div>
            )}

            {/* Total display */}
            <div className="border-t border-gold/15 pt-4 mt-2 flex justify-between items-center">
              <div>
                <span className="font-ui text-[10px] text-tan uppercase tracking-wide">Basket total:</span>
                <span className="font-ui text-[11px] text-cream-muted ml-1.5">${cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0).toFixed(2)}</span>
                {isDelivery && <div className="font-ui text-[10px] text-gold mt-0.5">Delivery fee: +$5.00</div>}
              </div>
              <div className="text-right">
                <div className="font-ui text-[10px] text-tan uppercase tracking-wide">Final Amount</div>
                <div className="font-heading text-xl font-bold text-gold">
                  ${(cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0) + (isDelivery ? 5 : 0)).toFixed(2)}
                </div>
              </div>
            </div>

            {paymentVerifying ? (
              <div className="flex flex-col items-center justify-center py-2.5">
                <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mb-2" />
                <div className="font-ui text-[11px] text-gold uppercase tracking-wider font-semibold">Verifying QR Payment...</div>
              </div>
            ) : (
              <button type="submit" className="btn-primary w-full mt-4">
                {paymentMethod === "qr" ? "I Have Paid — Verify & Complete" : "Place Order"}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ═══════════ PROFILE / LOGIN MODAL ═══════════ */}
      <div className={`overlay ${profileModalOpen ? 'active' : ''}`} onClick={() => setProfileModalOpen(false)}>
        <div className="qr-modal flex flex-col" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setProfileModalOpen(false)} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
          
          {userProfile ? (
            // Profile View
            <div>
              <div className="section-tag mb-2.5">Your Profile</div>
              <h3 className="font-heading text-2xl font-bold text-cream-light mb-4">Gourmet Account</h3>
              
              <div className="flex gap-4 items-center bg-gold/5 border border-gold/15 p-4 rounded mb-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold text-lg font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-heading text-base font-semibold text-cream-light">{userProfile.name}</div>
                  <div className="font-ui text-xs text-tan">{userProfile.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-warm-light border border-gold/10 p-3 text-center">
                  <div className="font-ui text-[9px] text-tan uppercase tracking-wide mb-1">Loyalty points</div>
                  <div className="font-heading text-lg font-bold text-gold">{userProfile.points} pts</div>
                </div>
                <div className="bg-bg-warm-light border border-gold/10 p-3 text-center">
                  <div className="font-ui text-[9px] text-tan uppercase tracking-wide mb-1">Status Tier</div>
                  <div className="font-heading text-lg font-bold text-cream-light flex items-center justify-center gap-1">
                    <IconResolver name={
                      userProfile.points >= 600 ? "👑" :
                      userProfile.points >= 300 ? "🥇" :
                      userProfile.points >= 100 ? "🥈" : "🥉"
                    } style={{ width: "16px", height: "16px" }} />
                    <span>
                      {userProfile.points >= 600 ? "Platinum" :
                       userProfile.points >= 300 ? "Gold" :
                       userProfile.points >= 100 ? "Silver" : "Bronze"}
                    </span>
                  </div>
                </div>
              </div>

              {activeOrder ? (
                <div className="border border-gold/15 p-4 mb-6 rounded bg-gold/5 flex justify-between items-center">
                  <div>
                    <div className="font-ui text-xs font-bold text-cream-light">Active Order: {activeOrder.id}</div>
                    <div className="font-ui text-[10px] text-gold mt-0.5">{activeOrder.status}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="btn-primary !py-2 !px-3 !text-[10px]" onClick={() => { setProfileModalOpen(false); setTrackerOpen(true); }}>Track</button>
                    <button className="btn-outline !py-2 !px-3 !text-[10px]" onClick={() => {
                      setReceiptData(activeOrder);
                      setReceiptModalOpen(true);
                    }}>Receipt</button>
                    {(activeOrder.status === "Delivered" || activeOrder.status === "Completed") && (
                      <button className="btn-outline !py-2 !px-3 !text-[10px]" onClick={() => {
                        setActiveOrder(null);
                        localStorage.removeItem("activeOrder");
                        showToast("Order history cleared from active tracking.");
                      }}>Dismiss</button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="font-ui text-xs text-tan text-center mb-6 py-2 border border-dashed border-cream/5 rounded">No active orders tracking.</div>
              )}

              <button className="btn-outline w-full" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            // Login / Register Form with Toggles
            <div>
              <div className="checkout-toggle mb-5">
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${!isSigningUp ? "active" : ""}`}
                  onClick={() => setIsSigningUp(false)}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className={`checkout-toggle-btn ${isSigningUp ? "active" : ""}`}
                  onClick={() => setIsSigningUp(true)}
                >
                  Sign Up
                </button>
              </div>

              <div className="section-tag mb-2.5">{isSigningUp ? "Create Account" : "Sign In"}</div>
              <h3 className="font-heading text-2xl font-bold text-cream-light mb-2">
                {isSigningUp ? "Join Maison Dorée" : "Welcome Back"}
              </h3>
              <p className="font-ui text-xs text-tan-dark leading-relaxed mb-6">
                {isSigningUp 
                  ? "Sign up to track orders, earn loyalty points, and secure exclusive chef benefits."
                  : "Access your loyalty rewards, check order history, and track active deliveries."}
              </p>
              
              {isSigningUp ? (
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                  <div>
                    <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Your Name</label>
                    <input 
                      type="text" 
                      value={loginName} 
                      onChange={(e) => setLoginName(e.target.value)} 
                      placeholder="e.g. Jean-Luc" 
                      required 
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      required 
                      className="input-field w-full"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-4">Create Account</button>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                  <div>
                    <label className="block font-ui text-[10px] font-semibold tracking-wider text-tan uppercase mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      required 
                      className="input-field w-full"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-4">Sign In</button>
                  <div className="font-ui text-[10px] text-tan-dark text-center mt-2">
                    Try logging in with demo user: <span className="text-gold">jane@example.com</span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ ORDER TRACKER MODAL ═══════════ */}
      <div className={`overlay ${trackerOpen && activeOrder ? 'active' : ''}`} onClick={() => {
        setTrackerOpen(false);
        // Clear active order once it has finished and tracker is closed
        if (activeOrder && (activeOrder.status === "Delivered" || activeOrder.status === "Completed")) {
          setActiveOrder(null);
          localStorage.removeItem("activeOrder");
          showToast("Order tracking completed & cleared.");
        }
      }}>
        <div className="qr-modal flex flex-col" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => {
            setTrackerOpen(false);
            if (activeOrder && (activeOrder.status === "Delivered" || activeOrder.status === "Completed")) {
              setActiveOrder(null);
              localStorage.removeItem("activeOrder");
              showToast("Order tracking completed & cleared.");
            }
          }} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
          <div className="section-tag mb-2.5">Live Tracker</div>
          <h3 className="font-heading text-2xl font-bold text-cream-light mb-1">Track Your Order</h3>
          <div className="font-ui text-[10px] text-gold font-bold tracking-wider mb-6">ORDER ID: {activeOrder?.id}</div>
          
          {activeOrder && (
            <>
              <div className="bg-gold/5 border border-gold/15 p-4 mb-6 rounded">
                <div className="flex justify-between font-ui text-[10px] text-tan uppercase tracking-wide mb-1">
                  <span>Method: {activeOrder.method}</span>
                  <span>Total: {activeOrder.total}</span>
                </div>
                <div className="font-ui text-xs text-cream-muted truncate">Items: {activeOrder.items.join(", ")}</div>
              </div>

              {/* Stepper */}
              <div className="tracker-stepper">
                {/* Progress Line */}
                <div className="tracker-stepper-progress" style={{
                  height: 
                    activeOrder.status === "Order Received" ? "0%" :
                    activeOrder.status === "Preparing in Kitchen" ? "33%" :
                    (activeOrder.status === "Out for Delivery" || activeOrder.status === "Ready for Pickup") ? "66%" : "100%"
                }} />

                {/* Step 1 */}
                <div className={`tracker-step ${activeOrder.status === "Order Received" ? "active" : "completed"}`}>
                  <div className="tracker-step-icon">
                    {activeOrder.status === "Order Received" ? "⏳" : "✓"}
                  </div>
                  <div>
                    <div className="tracker-step-title">Order Received</div>
                    <div className="tracker-step-desc">We've received your request and are preparing details.</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`tracker-step ${
                  activeOrder.status === "Preparing in Kitchen" ? "active cooking-glow" :
                  (activeOrder.status === "Order Received" ? "" : "completed")
                }`}>
                  <div className="tracker-step-icon">
                    {activeOrder.status === "Preparing in Kitchen" ? "🔥" : 
                     (activeOrder.status === "Order Received" ? "2" : "✓")}
                  </div>
                  <div>
                    <div className="tracker-step-title">Preparing in Kitchen</div>
                    <div className="tracker-step-desc">Chef Julian is crafting your signature dishes now.</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`tracker-step ${
                  (activeOrder.status === "Out for Delivery" || activeOrder.status === "Ready for Pickup") ? "active cooking-glow" :
                  (activeOrder.status === "Delivered" || activeOrder.status === "Completed") ? "completed" : ""
                }`}>
                  <div className="tracker-step-icon">
                    {(activeOrder.status === "Out for Delivery" || activeOrder.status === "Ready for Pickup") ? "🚚" : 
                     ((activeOrder.status === "Delivered" || activeOrder.status === "Completed") ? "✓" : "3")}
                  </div>
                  <div>
                    <div className="tracker-step-title">
                      {activeOrder.method === "delivery" ? "Out for Delivery" : "Ready for Pickup"}
                    </div>
                    <div className="tracker-step-desc">
                      {activeOrder.method === "delivery" 
                        ? "Our courier is heading to your destination." 
                        : "Freshly packed and waiting at our collection counter."}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`tracker-step ${
                  (activeOrder.status === "Delivered" || activeOrder.status === "Completed") ? "active completed" : ""
                }`}>
                  <div className="tracker-step-icon">
                    {(activeOrder.status === "Delivered" || activeOrder.status === "Completed") ? "🍽️" : "4"}
                  </div>
                  <div>
                    <div className="tracker-step-title">
                      {activeOrder.method === "delivery" ? "Delivered" : "Order Completed"}
                    </div>
                    <div className="tracker-step-desc">
                      {activeOrder.method === "delivery" 
                        ? "Enjoy your gourmet experience at home!" 
                        : "Thank you for dining with Maison Dorée."}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 w-full mt-8">
            <button className="btn-outline flex-1" onClick={() => {
              setReceiptData(activeOrder);
              setReceiptModalOpen(true);
            }}>View Receipt</button>
            <button className="btn-primary flex-1" onClick={() => {
              setTrackerOpen(false);
              if (activeOrder && (activeOrder.status === "Delivered" || activeOrder.status === "Completed")) {
                setActiveOrder(null);
                localStorage.removeItem("activeOrder");
                showToast("Order tracking completed & cleared.");
              }
            }}>Done</button>
          </div>
        </div>
      </div>

      {/* ═══════════ TRANSACTION RECEIPT MODAL ═══════════ */}
      {receiptModalOpen && receiptData && (
        <div className="overlay active" onClick={() => setReceiptModalOpen(false)}>
          <div className="qr-modal flex flex-col items-center" style={{ background: "#fdfbf7", color: "#1c120c", border: "1px solid #d48a2c", maxWidth: "400px", padding: "40px 30px" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setReceiptModalOpen(false)} className="absolute top-4 right-5 bg-transparent border-none text-[#8a7a68] text-xl cursor-pointer hover:text-[#1c120c]">✕</button>
            
            {/* Header */}
            <div className="text-center w-full">
              <div className="font-logo text-3xl text-[#d48a2c] mb-1">Maison Dorée</div>
              <div className="font-ui text-[9px] text-[#8a7a68] tracking-[.2em] uppercase mb-4">Official Receipt</div>
              
              {/* PAID stamp */}
              <div className="inline-block border-2 border-dashed border-[#d48a2c] text-[#d48a2c] font-ui text-[11px] font-bold uppercase px-3 py-1 rounded mb-6 tracking-widest" style={{ transform: "rotate(-3deg)" }}>
                {receiptData.paymentMethod === "qr" ? "✓ Paid via QR Code" : "Pending COD Payment"}
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="w-full border-t border-dashed border-[#8a7a68]/30 my-4" />

            {/* Transaction metadata */}
            <div className="w-full font-ui text-[11px] text-[#5a4e42] flex flex-col gap-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="flex justify-between">
                <span>Receipt Number:</span>
                <span className="font-bold text-[#1c120c]">{receiptData.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{new Date(receiptData.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Name:</span>
                <span className="font-bold text-[#1c120c]">{receiptData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Address:</span>
                <span>{receiptData.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Type:</span>
                <span className="capitalize">{receiptData.method}</span>
              </div>
              {receiptData.method === "delivery" && (
                <>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-right max-w-[200px] font-bold text-[#1c120c]">{receiptData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact Phone:</span>
                    <span>{receiptData.phone}</span>
                  </div>
                </>
              )}
            </div>

            {/* Dotted Divider */}
            <div className="w-full border-t border-dashed border-[#8a7a68]/30 my-4" />

            {/* Items list */}
            <div className="w-full" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="font-ui text-[10px] text-[#8a7a68] uppercase tracking-wider mb-2 font-semibold">Ordered Items</div>
              <div className="flex flex-col gap-2">
                {receiptData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-ui text-xs text-[#1c120c]">
                    <span>{item}</span>
                    <span>Included</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="w-full border-t border-dashed border-[#8a7a68]/30 my-4" />

            {/* Totals & Payment method */}
            <div className="w-full font-ui text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="flex justify-between text-[#5a4e42] mb-1">
                <span>Payment Method:</span>
                <span className="font-semibold text-[#1c120c]">
                  {receiptData.paymentMethod === "qr" ? "Instant Mobile QR Pay" : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#1c120c] mt-2 pt-2 border-t border-[#8a7a68]/15">
                <span>Total Amount:</span>
                <span className="text-[#d48a2c]">{receiptData.total}</span>
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="w-full border-t border-dashed border-[#8a7a68]/30 my-5" />

            {/* Mock Barcode */}
            <div className="flex flex-col items-center opacity-60 mb-6">
              <div className="h-8 w-48 bg-repeat-x" style={{ backgroundImage: "linear-gradient(90deg, #1c120c 2px, transparent 2px, transparent 4px, #1c120c 4px, #1c120c 7px, transparent 7px, transparent 9px)" }} />
              <div className="font-ui text-[9px] text-[#8a7a68] mt-1">{receiptData.id}</div>
            </div>

            {/* Print/Close actions */}
            <div className="w-full flex gap-3">
              <button className="btn-primary flex-1" style={{ background: "#d48a2c", color: "#fdfbf7" }} onClick={() => window.print()}>Print Receipt</button>
              <button className="btn-outline flex-1" style={{ borderColor: "#8a7a68", color: "#8a7a68" }} onClick={() => setReceiptModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
