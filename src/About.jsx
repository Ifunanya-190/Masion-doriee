import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import emailjs from "@emailjs/browser";
import { Anim, CountUp, Footer } from "./utils";
import { BRAND, NAV_LINKS, BASE_URL, EMAIL_CONFIG } from "./data";

const mont = (size, color, weight = 400) => ({ fontFamily: "'Montserrat',sans-serif", fontSize: size, color, fontWeight: weight });
const play = (size, weight = 700) => ({ fontFamily: "'Playfair Display',serif", fontSize: size, fontWeight: weight });

const TEAM = [
  { initials: "JD", name: "Julian Dorée",    role: "Founder & Head Chef",       since: "Est. 2012", bio: "Trained in Lyon at 17, Julian spent two decades in Michelin-starred kitchens across Europe before bringing his vision of honest, extraordinary food to London." },
  { initials: "CM", name: "Camille Moreau",  role: "Pastry Director",           since: "Since 2014", bio: "A graduate of Le Cordon Bleu Paris, Camille transforms simple ingredients into desserts that feel like memories — delicate, precise, and deeply personal." },
  { initials: "MA", name: "Marcus Adeola",   role: "Sommelier & Beverage Lead", since: "Since 2016", bio: "Marcus curates every wine list and pairing menu with the kind of instinct that only comes from 15 years of dedicated study and an extraordinary palate." },
  { initials: "SR", name: "Sofia Reyes",     role: "Sous Chef",                 since: "Since 2019", bio: "Sofia bridges tradition and innovation — her seasonal menus have become the most anticipated events in the Maison Dorée calendar." },
];

const TIMELINE = [
  { year: "2012", title: "The Beginning",        desc: "Julian Dorée opens Maison Dorée on Artisan Way with a small team and an unwavering belief in honest, exceptional food." },
  { year: "2014", title: "First Recognition",    desc: "Named Best New Restaurant in London by The Evening Standard. Camille Moreau joins as Pastry Director." },
  { year: "2016", title: "The Wine Programme",   desc: "Marcus Adeola builds the award-winning cellar. Maison Dorée earns its first sommelier commendation from Decanter." },
  { year: "2019", title: "Expanding the Vision", desc: "The tasting menu launches to critical acclaim. Sofia Reyes joins, bringing a seasonal philosophy that redefines the kitchen." },
  { year: "2022", title: "A Decade of Craft",    desc: "Ten years, thousands of guests, and one unwavering standard. We celebrate with a limited chef's table series, sold out in hours." },
  { year: "2026", title: "Present Day",          desc: "Maison Dorée continues to evolve — new menus, new partnerships, and the same obsessive commitment to the plate." },
];

const VALUES = [
  { symbol: "✦", title: "Quality",   desc: "We source only the finest ingredients — from heritage farms to pristine waters — ensuring every bite exceeds expectations." },
  { symbol: "◈", title: "Tradition", desc: "Our recipes are inspired by centuries of European culinary heritage, refined with modern technique and artful precision." },
  { symbol: "❋", title: "Passion",   desc: "Every plate is crafted with love and meticulous attention to detail by our dedicated team of world-class chefs." },
];

export default function About() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [qrModal,    setQrModal]    = useState(false);
  const [qrType,     setQrType]     = useState("reservation");
  const [cart,       setCart]       = useState([]);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [toastMsg,   setToastMsg]   = useState("");
  const [activeNav,  setActiveNav]  = useState("About Us");
  const [activeYear, setActiveYear] = useState("2026");
  const navigate = useNavigate();

  useEffect(() => {
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
    }
  }, []);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2800); };
  const addToCart = (item) => { setCart(c => [...c, item]); showToast(`${item.name} added to cart`); };
  const openQR    = (type) => { setQrType(type); setQrModal(true); };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const userName  = prompt("Please enter your name for the order:");
    if (!userName) return;
    const userEmail = prompt("Please enter your email for confirmation:");
    if (!userEmail) return;
    showToast("Processing your order...");
    try {
      await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, {
        name: userName, email: userEmail,
        title: "New Online Order",
        message: `Order Items: ${cart.map(i => i.name).join(", ")}\nTotal: $${cart.reduce((s, i) => s + parseFloat(i.price.replace("$", "")), 0).toFixed(2)}`
      });
      showToast("Order placed and email sent!");
      setCart([]); setCartOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to send order email.");
    }
  };

  const s = {
    nav:  { position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(15,13,11,.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(232,217,192,.05)", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontFamily: "'Great Vibes',cursive", fontSize: 28, fontWeight: 400, color: "#d48a2c", letterSpacing: ".02em" },
  };

  return (
    <div style={{ background: "#0f0d0b", color: "#e8d9c0", fontFamily: "'Cormorant Garamond','Georgia',serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <Link to="/" style={{ ...s.logo, textDecoration: "none" }}>{BRAND}</Link>

        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            l.scroll
              ? <span key={l.id} className="nav-link" onClick={() => navigate("/", { state: { scrollTo: l.id } })}>{l.name}</span>
              : <Link key={l.id} to={l.to} className={`nav-link ${activeNav === l.name ? "active" : ""}`} style={{ textDecoration: "none" }} onClick={() => setActiveNav(l.name)}>{l.name}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* RESERVE BUTTON */}
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 10 }} onClick={() => openQR("reservation")}>
            Reserve Table
          </button>

          {/* CART ICON */}
          <div style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => setCartOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8b99a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cart.length > 0 && <span className="qty-badge">{cart.length}</span>}
          </div>

          {/* HAMBURGER */}
          <button className="hamburger" style={{ background: "none", border: "none", color: "#e8d9c0", fontSize: 22, cursor: "pointer" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(l => (
              l.scroll
                ? <span key={l.id} className="nav-link" onClick={() => { setMenuOpen(false); navigate("/", { state: { scrollTo: l.id } }); }}>{l.name}</span>
                : <Link key={l.id} to={l.to} className="nav-link" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>{l.name}</Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO BANNER ── */}
      <section style={{ marginTop: 68, padding: "140px 48px 100px", background: "linear-gradient(135deg, #0c0a08 0%, #161008 50%, #0c0a08 100%)", borderBottom: "1px solid rgba(212,138,44,.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(212,138,44,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <Anim>
            <div className="section-tag" style={{ marginBottom: 16 }}>Our Heritage</div>
            <h1 style={{ ...play("clamp(36px,4vw,56px)", 900), color: "#f0e6d0", lineHeight: 1.05, marginBottom: 20 }}>
              Culinary Excellence<br />Since 2012
            </h1>
            <div className="gold-divider" />
            <p style={{ ...mont(14, "#7a6a5a"), maxWidth: 560, margin: "20px auto 0", lineHeight: 1.9 }}>
              Discover the story behind {BRAND} — where culinary artistry meets timeless elegance and every plate is a love letter to the craft.
            </p>
          </Anim>

          {/* STAT COUNTERS */}
          <div style={{ display: "flex", justifyContent: "center", gap: 64, marginTop: 64, flexWrap: "wrap" }}>
            {[
              { target: 14,   suffix: "",  label: "Years of Excellence" },
              { target: 1000, suffix: "+", label: "Happy Guests Daily"  },
              { target: 100,  suffix: "%", label: "Fresh Ingredients"   },
              { target: 3,    suffix: "",  label: "Sommelier Awards"    },
            ].map((stat, i) => (
              <Anim key={stat.label} delay={i * 0.12}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...play(42, 700), color: "#d48a2c", lineHeight: 1 }}>
                    <CountUp target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div style={{ ...mont(10, "#5a4e42", 600), letterSpacing: ".16em", textTransform: "uppercase", marginTop: 8 }}>
                    {stat.label}
                  </div>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ padding: "100px 48px", background: "#0f0d0b" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap" }}>
          <Anim style={{ flex: "1 1 450px" }}>
            <div className="section-tag" style={{ marginBottom: 14 }}>Our Story</div>
            <h2 style={{ ...play(40), color: "#f0e6d0", margin: "12px 0 28px", lineHeight: 1.15 }}>
              Where Every Plate<br />Tells a Story
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: "#a89a88", lineHeight: 1.85, fontStyle: "italic", marginBottom: 24, borderLeft: "2px solid rgba(212,138,44,.3)", paddingLeft: 20 }}>
              "We believe that dining is more than sustenance; it's an art form, a moment of connection, and a celebration of the finest ingredients the world has to offer."
            </p>
            <p style={{ ...mont(13, "#6b5e50"), lineHeight: 1.9, marginBottom: 16 }}>
              Founded by Chef Julian Dorée in 2012, {BRAND} has become a sanctuary for those who appreciate the art of fine dining. We source the finest ingredients from trusted purveyors worldwide — from A5 Wagyu to hand-dived scallops — and transform them into unforgettable culinary experiences.
            </p>
            <p style={{ ...mont(13, "#6b5e50"), lineHeight: 1.9 }}>
              We don't follow trends. We set the standard — quietly, consistently, and with an unwavering belief that great food changes people.
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <Link to="/contact" style={{ textDecoration: "none" }}>
                <button className="btn-primary">Get in Touch</button>
              </Link>
              <button className="btn-outline" onClick={() => openQR("reservation")}>Reserve a Table</button>
            </div>
          </Anim>

          <Anim delay={0.2} style={{ flex: "0.85 1 340px" }}>
            <div style={{ borderRadius: 12, padding: 28, border: "1px solid rgba(212,138,44,.12)", background: "linear-gradient(135deg,rgba(212,138,44,0.06) 0%,rgba(212,138,44,0.02) 100%)", transition: "all .5s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,138,44,.3)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(212,138,44,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,138,44,.12)"; e.currentTarget.style.boxShadow = "none"; }}>
              <img src="/images/hero-dish.png" alt="Signature Dish" style={{ width: "100%", opacity: 0.88, borderRadius: 8, filter: "brightness(1.05)" }} />
              <div style={{ ...mont(10, "#d48a2c", 600), textAlign: "center", marginTop: 20, letterSpacing: ".12em", textTransform: "uppercase" }}>
                ★ Authentic Craftsmanship · Est. 2012 ★
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: "80px 48px 100px", background: "#0c0a08" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Anim>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="section-tag" style={{ marginBottom: 12 }}>Our Journey</div>
              <div className="gold-divider" />
              <h2 style={{ ...play("clamp(26px,3.5vw,40px)"), color: "#f0e6d0", marginTop: 8 }}>A Decade of Craft</h2>
            </div>
          </Anim>

          {/* YEAR PILLS */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 48 }}>
            {TIMELINE.map(t => (
              <button key={t.year}
                style={{ background: activeYear === t.year ? "#d48a2c" : "transparent", color: activeYear === t.year ? "#0f0d0b" : "#5a4e42", border: `1px solid ${activeYear === t.year ? "#d48a2c" : "rgba(232,217,192,.1)"}`, fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, padding: "8px 16px", cursor: "pointer", transition: "all .3s", letterSpacing: ".06em" }}
                onClick={() => setActiveYear(t.year)}
              >{t.year}</button>
            ))}
          </div>

          {/* ACTIVE ENTRY */}
          {TIMELINE.filter(t => t.year === activeYear).map(t => (
            <Anim key={t.year}>
              <div style={{ background: "#141210", border: "1px solid rgba(212,138,44,.15)", padding: "44px 48px", borderTop: "2px solid #d48a2c", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
                <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 16 }}>{t.year}</div>
                <h3 style={{ ...play(28), color: "#f0e6d0", marginBottom: 16 }}>{t.title}</h3>
                <p style={{ ...mont(14, "#7a6a5a"), lineHeight: 1.85 }}>{t.desc}</p>
              </div>
            </Anim>
          ))}

          {/* TIMELINE DOT STRIP */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 40, overflowX: "auto", padding: "8px 0" }}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setActiveYear(t.year)}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: activeYear === t.year ? "#d48a2c" : "rgba(212,138,44,.25)", border: `2px solid ${activeYear === t.year ? "#d48a2c" : "rgba(212,138,44,.2)"}`, margin: "0 auto 8px", transition: "all .3s", boxShadow: activeYear === t.year ? "0 0 12px rgba(212,138,44,.5)" : "none" }} />
                  <div style={{ ...mont(9, activeYear === t.year ? "#d48a2c" : "#4a3e32", 600), letterSpacing: ".06em" }}>{t.year}</div>
                </div>
                {i < TIMELINE.length - 1 && <div style={{ width: 48, height: 1, background: "rgba(212,138,44,.15)", margin: "0 4px 20px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: "100px 48px", background: "#0f0d0b" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Anim>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="section-tag" style={{ marginBottom: 12 }}>What Drives Us</div>
              <div className="gold-divider" />
              <h2 style={{ ...play("clamp(26px,3.5vw,40px)"), color: "#f0e6d0", marginTop: 8 }}>Our Values</h2>
            </div>
          </Anim>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {VALUES.map((v, i) => (
              <Anim key={v.title} delay={i * 0.15}>
                <div className="card-hover" style={{ background: "#121010", border: "1px solid rgba(232,217,192,.06)", padding: "44px 36px", borderTop: "2px solid rgba(212,138,44,.3)", cursor: "pointer" }}>
                  <div style={{ ...play(32, 400), color: "#d48a2c", marginBottom: 20, display: "inline-block" }}>{v.symbol}</div>
                  <h3 style={{ ...play(22, 700), color: "#f0e6d0", marginBottom: 14 }}>{v.title}</h3>
                  <p style={{ ...mont(13, "#6b5e50"), lineHeight: 1.85 }}>{v.desc}</p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: "80px 48px 120px", background: "#0c0a08" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Anim>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="section-tag" style={{ marginBottom: 12 }}>The People</div>
              <div className="gold-divider" />
              <h2 style={{ ...play("clamp(26px,3.5vw,40px)"), color: "#f0e6d0", marginTop: 8 }}>Meet the Team</h2>
              <p style={{ ...mont(13, "#5a4e42"), marginTop: 12 }}>The hands and hearts behind every dish</p>
            </div>
          </Anim>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {TEAM.map((member, i) => (
              <Anim key={member.name} delay={i * 0.12}>
                <div className="card-hover" style={{ background: "#121010", border: "1px solid rgba(232,217,192,.06)", padding: "40px 32px", textAlign: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(212,138,44,.07)", border: "1px solid rgba(212,138,44,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#d48a2c", letterSpacing: ".04em" }}>
                    {member.initials}
                  </div>
                  <h3 style={{ ...play(18, 700), color: "#f0e6d0", marginBottom: 6 }}>{member.name}</h3>
                  <div style={{ ...mont(9, "#d48a2c", 600), letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4 }}>{member.role}</div>
                  <div style={{ ...mont(9, "#3a3028", 500), letterSpacing: ".1em", marginBottom: 18 }}>{member.since}</div>
                  <div style={{ width: 32, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,138,44,.4),transparent)", margin: "0 auto 18px" }} />
                  <p style={{ ...mont(12, "#6b5e50"), lineHeight: 1.85 }}>{member.bio}</p>
                </div>
              </Anim>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <Anim>
        <section style={{ padding: "80px 48px", background: "linear-gradient(135deg,#161008 0%,#1e160e 100%)", borderTop: "1px solid rgba(212,138,44,.12)", borderBottom: "1px solid rgba(212,138,44,.12)", textAlign: "center" }}>
          <div className="section-tag" style={{ marginBottom: 12 }}>Ready to Experience It?</div>
          <h2 style={{ ...play("clamp(24px,3vw,38px)"), color: "#f0e6d0", marginBottom: 16 }}>Your Table is Waiting</h2>
          <p style={{ ...mont(13, "#6b5e50"), maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.85 }}>
            Reserve a table, pre-order your dishes, or simply come as you are. We'll take care of the rest.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => openQR("reservation")}>Reserve a Table</button>
            <Link to="/contact" style={{ textDecoration: "none" }}><button className="btn-outline">Contact Us</button></Link>
          </div>
        </section>
      </Anim>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── QR MODAL ── */}
      {qrModal && (
        <div className="overlay" onClick={() => setQrModal(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQrModal(false)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#8a7a68", fontSize: 20, cursor: "pointer" }}>✕</button>
            <div className="section-tag" style={{ marginBottom: 10 }}>{qrType === "reservation" ? "Table Reservation" : "Quick Order"}</div>
            <h3 style={{ ...play(26), color: "#f0e6d0", marginBottom: 8 }}>{qrType === "reservation" ? "Reserve Your Spot" : "Order & Collect"}</h3>
            <p style={{ ...mont(12, "#6b5e50"), lineHeight: 1.8, marginBottom: 28 }}>
              {qrType === "reservation" ? "Scan the QR code with your phone camera to instantly reserve a table. No account or app needed." : "Scan to open our full menu, add items to your order, and select a pickup time."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: -16, border: "1px solid rgba(212,138,44,.15)", borderRadius: 16, animation: "scanRing 2s ease-in-out infinite" }} />
                <div style={{ padding: 20, background: "white", borderRadius: 16, boxShadow: "0 0 40px rgba(212,138,44,0.1)" }}>
                  <QRCodeSVG value={qrType === "reservation" ? `${BASE_URL}/reserve.html` : `${BASE_URL}/order.html`} size={180} bgColor="#ffffff" fgColor="#1a1008" level="H" includeMargin />
                </div>
                <div style={{ position: "absolute", top: "50%", left: -20, right: -20, height: 2, background: "linear-gradient(90deg,transparent,rgba(212,138,44,.5),transparent)", animation: "scanLine 2s ease-in-out infinite" }} />
              </div>
            </div>
            <div style={{ background: "#1e160e", border: "1px solid rgba(212,138,44,.1)", padding: "18px 22px", marginBottom: 24 }}>
              <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 10 }}>How it works</div>
              {(qrType === "reservation"
                ? ["Scan the QR code with your camera", "Fill in your date and party size", "Confirm your booking instantly"]
                : ["Scan the QR code with your camera", "Browse the menu and add items", "Choose your collection time"]
              ).map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, background: "#d48a2c", color: "#0f0d0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", ...mont(10, "#0f0d0b", 700), flexShrink: 0 }}>{i + 1}</div>
                  <span style={mont(12, "#8a7a68")}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={qrType === "reservation" ? "/reserve.html" : "/order.html"} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "14px 0", display: "block" }}>
                {qrType === "reservation" ? "Open Reservation" : "Open Menu"}
              </a>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setQrType(qrType === "reservation" ? "order" : "reservation")}>
                Switch to {qrType === "reservation" ? "Order" : "Reserve"}
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 16, ...mont(10, "#3a3028") }}>No app required · Works with any smartphone camera</div>
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" style={{ position: "absolute", top: 0, right: 0, width: "min(420px,92vw)", height: "100%", background: "#110e0c", padding: "48px 40px", borderLeft: "1px solid rgba(212,138,44,.1)", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h3 style={{ ...play(24), color: "#f0e6d0" }}>Your Order</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#8a7a68", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>🛒</div>
                  <p style={mont(14, "#4a3e32")}>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(232,217,192,.05)" }}>
                    <div style={{ width: 60, height: 60, background: "#1a1614", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={item.img} alt={item.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...play(14), color: "#e8d9c0" }}>{item.name}</div>
                      <div style={mont(12, "#d48a2c")}>{item.price}</div>
                    </div>
                    <button onClick={() => setCart(c => c.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#4a3e32", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ marginTop: "auto", paddingTop: 32, borderTop: "1px solid rgba(212,138,44,.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={mont(12, "#8a7a68", 600)}>TOTAL</span>
                  <span style={{ ...play(20, 700), color: "#f0e6d0" }}>${cart.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0).toFixed(2)}</span>
                </div>
                <button className="btn-primary" style={{ width: "100%" }} onClick={handleCheckout}>Checkout Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}