import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Anim, Footer } from "./utils";
import { BRAND, FEATURED, MENU_ITEMS } from "./data";
import { LOCAL_IP } from "./ip-config";
import MealBuilder from "./components/MealBuilder";

const BASE_URL = `http://${LOCAL_IP}:5000`;

const CHEF_QUOTES = [
  "The secret is patience and the finest ingredients.",
  "Every plate tells a story of passion and precision.",
  "We don't just cook — we create experiences.",
  "Fresh, local, seasonal — that is our philosophy.",
];

export default function LuxuryBakery({
  cart, setCart, qrModal, setQrModal, qrType, setQrType,
  toastMsg, setToastMsg, addToCart, openQR, showToast,
  cartOpen, setCartOpen,
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [hoursLeft, setHoursLeft] = useState("");

  useEffect(() => { setTimeout(() => setHeroLoaded(true), 100); }, []);

  // Rotating chef quotes
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % CHEF_QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Kitchen countdown (hours until 11 PM)
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const close = new Date(now);
      close.setHours(23, 0, 0, 0);
      if (now >= close) { setHoursLeft("Closed"); return; }
      const diff = close - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setHoursLeft(`${h}h ${m}m`);
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-bg text-cream font-body min-h-screen overflow-x-hidden">

      {/* ═══════════ HERO ═══════════ */}
      <section id="home" className="min-h-screen flex items-center pt-[68px] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 45%, rgba(180,90,10,.07) 0%, transparent 55%)" }} />
        <div className="hero-flex flex items-center w-full max-w-[1200px] mx-auto gap-12" style={{ padding: "60px 48px" }}>
          {/* Left */}
          <div className="flex-1" style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateX(0)" : "translateX(-40px)", transition: "all 1s ease .2s" }}>
            <div className="section-tag mb-3.5">Fine Dining Experience</div>
            <h1 className="font-heading font-black text-cream-light mb-9 block leading-none" style={{ fontSize: "clamp(42px, 5.5vw, 76px)" }}>
              LUXURY<br />DINING
            </h1>
            <div className="flex gap-3.5 flex-wrap">
              <button className="btn-primary" onClick={() => openQR("order")}>Our Menu</button>
              <button className="btn-outline" onClick={() => openQR("reservation")}>Book a Spot</button>
            </div>
            <div className="flex gap-9 mt-[52px]">
              {[["120+", "Dishes"], ["12", "Years"], ["4.9", "Rating"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-heading text-[30px] font-bold text-gold">{n}</div>
                  <div className="font-ui text-[9px] text-brown font-medium tracking-[.16em] uppercase mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — Hero Image */}
          <div className="hero-img-wrap flex-1 flex justify-center items-center relative" style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "scale(1)" : "scale(.9)", transition: "all 1.2s ease .4s" }}>
            <div className="relative" style={{ width: "min(440px, 80vw)", height: "min(440px, 80vw)" }}>
              <div className="absolute -inset-5 rounded-full" style={{ background: "radial-gradient(circle, rgba(180,90,10,.1) 0%, transparent 65%)" }} />
              <div className="hero-dish w-full h-full flex items-center justify-center">
                <img className="dish-img" src="/images/hero-dish.png" alt="Signature dish" style={{ width: "85%", height: "85%", objectFit: "contain", filter: "drop-shadow(0 20px 40px rgba(0,0,0,.5))" }} />
              </div>
              {["★", "✦", "✧"].map((c, i) => (
                <div key={i} className="absolute text-gold" style={{ fontSize: i === 0 ? 22 : 13, opacity: .5, top: i === 0 ? "82%" : i === 1 ? "12%" : "78%", left: i === 0 ? "8%" : i === 1 ? "82%" : "88%", animation: `pulse ${2 + i}s ease-in-out infinite ${i * .5}s` }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED / FAVOURITES ═══════════ */}
      <section id="discover" className="max-w-[1200px] mx-auto" style={{ padding: "120px 48px" }}>
        <Anim>
          <div className="text-center mb-16">
            <div className="section-tag">Chef's Selection</div>
            <div className="gold-divider" />
            <h2 id="favourites" className="font-heading font-bold text-cream-light mt-2" style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}>Signature Dishes</h2>
            <p className="font-ui text-[13px] text-brown mt-2.5">Exquisite flavours crafted to perfection</p>
          </div>
        </Anim>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {FEATURED.map((item, i) => (
            <Anim key={item.id} delay={i * .12}>
              <div className="card-hover bg-bg-card-alt border border-cream/[.06] overflow-hidden">
                <div className="h-60 bg-bg-img flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 60%, rgba(180,90,10,.08), transparent 65%)" }} />
                  <img className="dish-img w-[70%] h-[70%] object-contain transition-transform duration-500 hover:scale-[1.08]" src={item.img} alt={item.name} style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,.4))" }} />
                  <div className="absolute top-3.5 left-3.5 bg-gold font-ui text-[9px] text-bg font-bold tracking-[.1em] uppercase" style={{ padding: "5px 12px" }}>{item.tag}</div>
                </div>
                <div className="p-8 pb-9">
                  <h3 className="font-heading text-[19px] font-semibold text-cream-light mb-4 leading-tight">{item.name}</h3>
                  <p className="font-ui text-xs text-tan-dark leading-relaxed mb-7">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[22px] font-bold text-gold">{item.price}</span>
                    <button className="btn-primary !py-2.5 !px-5 !text-[10px]" onClick={() => addToCart(item)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </Anim>
          ))}
        </div>

        {/* ── QR BANNER ── */}
        <Anim delay={.2}>
          <div className="mt-28 border border-gold/15 flex items-center justify-between gap-11 flex-wrap" style={{ background: "linear-gradient(135deg, #161008 0%, #1e160e 100%)", padding: "60px 52px" }}>
            <div>
              <div className="section-tag mb-3">Skip the Queue</div>
              <h3 className="font-heading font-bold text-cream-light leading-tight" style={{ fontSize: "clamp(22px, 3vw, 36px)" }}>Scan. Reserve.<br />Indulge.</h3>
              <p className="font-ui text-xs text-tan-dark mt-3 max-w-[340px] leading-relaxed">
                Use our QR codes to secure your table or pre-order your favourites. Scan with any phone camera — no app needed.
              </p>
              <div className="flex gap-3 mt-6 flex-wrap">
                <button className="btn-primary" onClick={() => openQR("reservation")}>Scan to Reserve</button>
                <button className="btn-outline" onClick={() => openQR("order")}>Scan to Order</button>
              </div>
            </div>
            <div className="flex gap-9 flex-wrap">
              {[{ type: "reservation", label: "Reserve Table", url: `${BASE_URL}/reserve.html` }, { type: "order", label: "Order Now", url: `${BASE_URL}/order.html` }].map(({ type, label, url }) => (
                <div key={type} className="text-center cursor-pointer" onClick={() => openQR(type)}>
                  <div className="qr-scan-ring inline-block p-2.5 bg-white rounded-xl">
                    <QRCodeSVG value={url} size={100} bgColor="#ffffff" fgColor="#1a1008" level="H" />
                  </div>
                  <div className="font-ui text-[10px] text-tan font-medium tracking-[.15em] uppercase mt-2.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Anim>
      </section>

      {/* ═══════════ CHEF'S TABLE LIVE ═══════════ */}
      <section id="chefs-table" style={{ padding: "100px 48px", background: "linear-gradient(180deg, #0c0a08 0%, #161008 50%, #0c0a08 100%)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Anim>
            <div className="text-center mb-16">
              <div className="section-tag">Live From The Kitchen</div>
              <div className="gold-divider" />
              <h2 className="font-heading font-bold text-cream-light mt-2" style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}>Chef's Table</h2>
            </div>
          </Anim>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Quote */}
            <Anim delay={0.1}>
              <div className="glass-card p-8 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="chef-live-dot" />
                  <span className="font-ui text-[10px] text-gold-accent font-bold tracking-[.15em] uppercase">Live</span>
                </div>
                <div className="flex-1 flex items-center">
                  <blockquote className="font-body text-2xl italic text-cream-muted leading-relaxed transition-opacity duration-500" key={quoteIdx}>
                    "{CHEF_QUOTES[quoteIdx]}"
                  </blockquote>
                </div>
                <div className="mt-6 pt-6 border-t border-cream/5">
                  <div className="font-heading text-sm font-semibold text-cream-light">Chef Julian Dorée</div>
                  <div className="font-ui text-[11px] text-tan">Executive Chef & Founder</div>
                </div>
              </div>
            </Anim>
            {/* Today's Special + Kitchen */}
            <Anim delay={0.2}>
              <div className="flex flex-col gap-6">
                <div className="glass-card p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-ui text-[10px] text-gold font-semibold tracking-[.12em] uppercase">Today's Special</div>
                    <div className="font-ui text-xs text-tan-dark">
                      Kitchen closes in <span className="text-gold font-semibold">{hoursLeft}</span>
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-cream-light mb-2">Pan-Seared Sea Bass</h3>
                  <p className="font-ui text-xs text-tan leading-relaxed">
                    Citrus beurre blanc, wilted spinach, micro herbs — served with a side of truffle mash
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-heading text-xl font-bold text-gold">$38.00</span>
                    <button className="btn-primary !py-2 !px-4 !text-[10px]" onClick={() => addToCart(FEATURED[0])}>Order Now</button>
                  </div>
                </div>
                <div className="glass-card p-8">
                  <div className="font-ui text-[10px] text-gold font-semibold tracking-[.12em] uppercase mb-3">🔥 From the Kitchen</div>
                  <p className="font-ui text-sm text-cream-muted leading-relaxed">
                    Right now, our kitchen is preparing tonight's special: <span className="text-gold">Pan-Seared Sea Bass</span> with
                    citrus beurre blanc and hand-picked micro herbs from our rooftop garden…
                  </p>
                  <div className="flex gap-3 mt-4">
                    {["🐟 Fresh Catch", "🌿 Garden Herbs", "🧈 Artisan Butter"].map((tag) => (
                      <span key={tag} className="font-ui text-[10px] text-tan bg-cream/[.03] border border-cream/5 rounded-full px-3 py-1">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Anim>
          </div>
        </div>
      </section>

      {/* ═══════════ BUILD YOUR MEAL ═══════════ */}
      <MealBuilder onAddToCart={addToCart} />

      {/* ═══════════ MENU ═══════════ */}
      <section id="menu" className="bg-bg-dark" style={{ padding: "80px 48px 120px" }}>
        <div className="max-w-[1200px] mx-auto">
          <Anim>
            <div className="text-center mb-16">
              <div className="section-tag">Our Offerings</div>
              <div className="gold-divider" />
              <h2 className="font-heading font-bold text-cream-light mt-2" style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}>Core Menu</h2>
              <div className="flex gap-1.5 justify-center mt-3.5">
                {[0, 1, 2].map((i) => <span key={i} className="star-icon">★</span>)}
              </div>
            </div>
          </Anim>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {MENU_ITEMS.map((item, i) => (
              <Anim key={item.id} delay={i * .08}>
                <div className="shop-card">
                  <div className="h-[190px] flex items-center justify-center bg-bg-img-alt relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(180,90,10,.06), transparent 65%)" }} />
                    <img className="dish-img w-[65%] h-[65%] object-contain transition-transform duration-400 hover:scale-[1.06]" src={item.img} alt={item.name} style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,.4))" }} />
                  </div>
                  <div className="p-6">
                    <h4 className="font-heading text-base font-semibold text-cream mb-4 leading-tight">{item.name}</h4>
                    <div className="font-ui text-[11px] text-brown mb-7 leading-relaxed">{item.weight}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-lg font-bold text-gold">{item.price}</span>
                      <button
                        className="bg-transparent border border-cream/[.12] text-cream w-[30px] h-[30px] cursor-pointer text-base transition-all duration-300 font-ui hover:border-gold hover:text-gold"
                        onClick={() => addToCart(item)}
                      >+</button>
                    </div>
                  </div>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <Footer />
    </div>
  );
}
