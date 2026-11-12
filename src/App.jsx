import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";
import { LOCAL_IP } from "./ip-config";
import Navigation from './Navigation';
import LoyaltyWidget from './components/LoyaltyWidget';
import CartDrawer from './components/CartDrawer';
import QRModal from './components/QRModal';
import OrderTracker from './components/OrderTracker';
import Login from './components/Login';
import Checkout from './components/Checkout';

// Pages
import LuxuryBakery from './LuxuryBakery';
import About from './About';
import Contact from './Contact';
import Profile from './Profile';

export const BASE_URL = `http://${LOCAL_IP}:5000`;

export const EMAIL_CONFIG = {
  SERVICE_ID: "service_dgigp18",
  TEMPLATE_ID: "template_7up07qm",
  PUBLIC_KEY: "w9XKj8v7KhAtFlQYt",
};

export default function App() {
  const [cart, setCart]                   = useState([]);
  const [qrModal, setQrModal]             = useState(false);
  const [qrType, setQrType]               = useState("reservation");
  const [toastMsg, setToastMsg]           = useState("");
  const [cartOpen, setCartOpen]           = useState(false);
  const [trackerOpen, setTrackerOpen]     = useState(false);
  const [userProfile, setUserProfile]     = useState(null);
  const [activeOrder, setActiveOrder]     = useState(null);

  useEffect(() => {
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
    }
    // Seed demo users
    if (!localStorage.getItem("registeredUsers")) {
      localStorage.setItem("registeredUsers", JSON.stringify([
        { name: "Julian Dorée", email: "chef@website.com", points: 350 },
        { name: "Jane Doe",     email: "jane@example.com", points: 120 },
      ]));
    }
    // Restore session
    const stored = localStorage.getItem("userProfile");
    if (stored) setUserProfile(JSON.parse(stored));

    const storedOrder = localStorage.getItem("activeOrder");
    if (storedOrder) {
      const order = JSON.parse(storedOrder);
      const elapsed = Date.now() - order.timestamp;
      if (elapsed < 3600000) setActiveOrder(order); // keep for 1hr
    }
  }, []);

  // Order status progression
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === "Completed" || activeOrder.status === "Delivered") return;
    const interval = setInterval(() => {
      setActiveOrder(prev => {
        if (!prev) return null;
        const map = {
          "Order Received":     "Preparing in Kitchen",
          "Preparing in Kitchen": prev.method === "delivery" ? "Out for Delivery" : "Ready for Pickup",
          "Out for Delivery":   "Delivered",
          "Ready for Pickup":   "Completed",
        };
        const next = map[prev.status] || prev.status;
        const updated = { ...prev, status: next };
        localStorage.setItem("activeOrder", JSON.stringify(updated));
        return updated;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2800); };

  const addToCart = (item) => {
    setCart(c => [...c, item]);
    showToast(`${item.name} added to cart`);
    // Award points
    if (userProfile) {
      const pts = (userProfile.points || 0) + 10;
      const updated = { ...userProfile, points: pts };
      setUserProfile(updated);
      localStorage.setItem("userProfile", JSON.stringify(updated));
      // Update registeredUsers too
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const idx = users.findIndex(u => u.email === userProfile.email);
      if (idx !== -1) { users[idx].points = pts; localStorage.setItem("registeredUsers", JSON.stringify(users)); }
    }
  };

  const openQR = (type) => { setQrType(type); setQrModal(true); };

  // Shared props passed to all pages
  const sharedProps = {
    cart, setCart,
    addToCart,
    openQR,
    showToast,
    cartOpen, setCartOpen,
    userProfile, setUserProfile,
    activeOrder, setActiveOrder,
    trackerOpen, setTrackerOpen,
  };

  return (
    <BrowserRouter>
      <Navigation
        onQROpen={openQR}
        cartCount={cart.length}
        onCartOpen={() => setCartOpen(true)}
        userProfile={userProfile}
        activeOrder={activeOrder}
        onTrackerOpen={() => setTrackerOpen(true)}
      />

      <LoyaltyWidget />

      {toastMsg && <div className="toast">{toastMsg}</div>}

      <Routes>
        <Route path="/"         element={<LuxuryBakery {...sharedProps} />} />
        <Route path="/about"    element={<About    {...sharedProps} />} />
        <Route path="/contact"  element={<Contact  {...sharedProps} />} />
        <Route path="/profile"  element={<Profile  {...sharedProps} />} />
        <Route path="/login"    element={<Login    {...sharedProps} />} />
        <Route path="/checkout" element={<Checkout {...sharedProps} />} />
      </Routes>

      {/* Global cart drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          onClose={() => setCartOpen(false)}
          showToast={showToast}
          userProfile={userProfile}
          onCheckout={() => { setCartOpen(false); window.location.href = "/checkout"; }}
        />
      )}

      {/* Global QR modal */}
      {qrModal && (
        <QRModal
          type={qrType}
          setType={setQrType}
          onClose={() => setQrModal(false)}
        />
      )}

      {/* Global order tracker */}
      {trackerOpen && activeOrder && (
        <OrderTracker
          order={activeOrder}
          onClose={() => {
            setTrackerOpen(false);
            if (activeOrder.status === "Delivered" || activeOrder.status === "Completed") {
              setActiveOrder(null);
              localStorage.removeItem("activeOrder");
              showToast("Order tracking cleared.");
            }
          }}
          showToast={showToast}
        />
      )}
    </BrowserRouter>
  );
}