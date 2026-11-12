import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Anim } from "./utils";
import { BRAND } from "./data";

const mont = (size, color, weight = 400) => ({ fontFamily: "'Montserrat',sans-serif", fontSize: size, color, fontWeight: weight });
const play = (size, weight = 700) => ({ fontFamily: "'Playfair Display',serif", fontSize: size, fontWeight: weight });

const TIERS = [
  { name: "Bronze",   min: 0,   max: 99,   color: "#cd7f32", icon: "🥉", perks: ["Welcome discount 5%", "Birthday treat"] },
  { name: "Silver",   min: 100, max: 299,  color: "#c0c0c0", icon: "🥈", perks: ["10% off all orders", "Priority seating", "Birthday treat"] },
  { name: "Gold",     min: 300, max: 599,  color: "#d48a2c", icon: "🥇", perks: ["15% off all orders", "Free starter", "Priority seating", "Monthly chef's note"] },
  { name: "Platinum", min: 600, max: Infinity, color: "#e8d9c0", icon: "👑", perks: ["20% off all orders", "Free wine pairing", "Chef's table access", "Concierge service"] },
];

const COUPONS = [
  { code: "WELCOME10", desc: "10% off your next order", valid: true,  expiry: "2026-12-31", minSpend: "$0" },
  { code: "BDAY2026",  desc: "Free dessert on your birthday", valid: true,  expiry: "2026-12-31", minSpend: "$30" },
  { code: "GOLD15",    desc: "15% off for Gold members", valid: false, expiry: "2026-09-01", minSpend: "$50" },
];

const TABS = ["Overview", "Orders", "Reservations", "Loyalty", "Coupons", "Settings"];

function getTier(points) {
  return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
}

function getNextTier(points) {
  const idx = TIERS.findIndex(t => points >= t.min && points <= t.max);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export default function Profile({ userProfile, setUserProfile, showToast, activeOrder, setTrackerOpen }) {
  const [tab,           setTab]           = useState("Overview");
  const [orderHistory,  setOrderHistory]  = useState([]);
  const [reservations,  setReservations]  = useState([]);
  const [editName,      setEditName]      = useState(false);
  const [newName,       setNewName]       = useState("");
  const [copiedCode,    setCopiedCode]    = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load order history
    const oh = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    setOrderHistory(oh);
    // Load reservations
    const rv = JSON.parse(localStorage.getItem("reservations") || "[]");
    setReservations(rv);
  }, []);

  if (!userProfile) {
    return (
      <div style={{ background: "#0f0d0b", minHeight: "100vh", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ ...play(28), color: "#f0e6d0" }}>You're not signed in</div>
        <p style={mont(13, "#6b5e50")}>Please sign in to view your profile.</p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: "none", padding: "14px 32px" }}>Sign In</Link>
      </div>
    );
  }

  const pts      = userProfile.points || 0;
  const tier     = getTier(pts);
  const nextTier = getNextTier(pts);
  const progress = nextTier ? Math.min(((pts - tier.min) / (nextTier.min - tier.min)) * 100, 100) : 100;

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("userProfile");
    showToast("Signed out successfully");
    navigate("/");
  };

  const handleSaveName = () => {
    if (!newName.trim()) return;
    const updated = { ...userProfile, name: newName.trim() };
    setUserProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const idx = users.findIndex(u => u.email === userProfile.email);
    if (idx !== -1) { users[idx].name = newName.trim(); localStorage.setItem("registeredUsers", JSON.stringify(users)); }
    setEditName(false);
    showToast("Name updated successfully!");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code ${code} copied!`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const isReservationExpired = (res) => {
    const dt = new Date(`${res.date}T${res.time || "23:59"}`);
    return dt < new Date();
  };

  return (
    <div style={{ background: "#0f0d0b", color: "#e8d9c0", fontFamily: "'Cormorant Garamond','Georgia',serif", minHeight: "100vh", paddingTop: 68 }}>

      {/* ── HERO HEADER ── */}
      <section style={{ background: "linear-gradient(135deg, #0c0a08 0%, #161008 100%)", borderBottom: "1px solid rgba(212,138,44,.08)", padding: "60px 48px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Anim>
            <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
              {/* AVATAR */}
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(212,138,44,.1)", border: `2px solid ${tier.color}`, display: "flex", alignItems: "center", justifyContent: "center", ...play(32, 700), color: tier.color, flexShrink: 0, boxShadow: `0 0 24px ${tier.color}30` }}>
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 6 }}>
                  {tier.icon} {tier.name} Member
                </div>
                {editName ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input value={newName} onChange={e => setNewName(e.target.value)} className="input-field" style={{ fontSize: 14, padding: "8px 14px", maxWidth: 260 }} placeholder="New name..." />
                    <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 10 }} onClick={handleSaveName}>Save</button>
                    <button className="btn-outline" style={{ padding: "8px 14px", fontSize: 10 }} onClick={() => setEditName(false)}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h1 style={{ ...play("clamp(22px,3vw,36px)", 700), color: "#f0e6d0", lineHeight: 1.1 }}>{userProfile.name}</h1>
                    <button onClick={() => { setEditName(true); setNewName(userProfile.name); }} style={{ background: "none", border: "1px solid rgba(212,138,44,.2)", color: "#d48a2c", padding: "4px 10px", fontSize: 10, fontFamily: "'Montserrat',sans-serif", cursor: "pointer", letterSpacing: ".08em" }}>Edit</button>
                  </div>
                )}
                <div style={mont(13, "#6b5e50")}>{userProfile.email}</div>
              </div>
              {/* POINTS BADGE */}
              <div style={{ textAlign: "center" }}>
                <div style={{ ...play(38, 700), color: tier.color, lineHeight: 1 }}>{pts}</div>
                <div style={mont(10, "#5a4e42", 600)}>Loyalty Points</div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            {nextTier && (
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={mont(11, "#6b5e50")}>{tier.name}</span>
                  <span style={mont(11, "#6b5e50")}>{nextTier.min - pts} pts to {nextTier.name}</span>
                </div>
                <div style={{ height: 4, background: "rgba(232,217,192,.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`, borderRadius: 2, transition: "width 1s ease" }} />
                </div>
              </div>
            )}
          </Anim>
        </div>
      </section>

      {/* ── TABS ── */}
      <div style={{ borderBottom: "1px solid rgba(232,217,192,.06)", background: "#0c0a08", position: "sticky", top: 68, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px", display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#d48a2c" : "transparent"}`, color: tab === t ? "#d48a2c" : "#5a4e42", fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", padding: "18px 20px", cursor: "pointer", transition: "all .3s", whiteSpace: "nowrap" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px 80px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <Anim>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 40 }}>
              {[
                { label: "Total Orders",    value: orderHistory.length,                    icon: "🍽️" },
                { label: "Loyalty Points",  value: `${pts} pts`,                           icon: tier.icon },
                { label: "Current Tier",    value: tier.name,                              icon: "⭐" },
                { label: "Reservations",    value: reservations.length,                    icon: "📅" },
              ].map(card => (
                <div key={card.label} style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: "28px 24px", borderTop: "2px solid rgba(212,138,44,.25)" }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ ...play(26, 700), color: "#d48a2c" }}>{card.value}</div>
                  <div style={mont(11, "#5a4e42")}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Active Order */}
            {activeOrder && (
              <div style={{ background: "rgba(212,138,44,.04)", border: "1px solid rgba(212,138,44,.15)", padding: 24, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={mont(10, "#d48a2c", 600)}>Active Order</div>
                  <div style={{ ...play(18), color: "#f0e6d0", marginTop: 4 }}>{activeOrder.id}</div>
                  <div style={{ ...mont(12, "#8a7a68"), marginTop: 4 }}>Status: <span style={{ color: "#d48a2c" }}>{activeOrder.status}</span></div>
                </div>
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 10 }} onClick={() => setTrackerOpen(true)}>
                  Track Order
                </button>
              </div>
            )}

            {/* Recent orders */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...play(22), color: "#f0e6d0", marginBottom: 20 }}>Recent Orders</div>
              {orderHistory.length === 0 ? (
                <div style={{ ...mont(13, "#4a3e32"), padding: 24, border: "1px dashed rgba(232,217,192,.06)", textAlign: "center" }}>No orders yet. <Link to="/" style={{ color: "#d48a2c" }}>Browse the menu →</Link></div>
              ) : (
                orderHistory.slice(0, 3).map((o, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(232,217,192,.04)", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ ...play(15), color: "#e8d9c0" }}>{o.id}</div>
                      <div style={mont(12, "#5a4e42")}>{o.items?.slice(0,2).join(", ")}{o.items?.length > 2 ? ` +${o.items.length - 2} more` : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={mont(13, "#d48a2c")}>{o.total}</div>
                      <div style={mont(10, "#4a3e32")}>{new Date(o.timestamp).toLocaleDateString("en-GB")}</div>
                    </div>
                  </div>
                ))
              )}
              {orderHistory.length > 3 && (
                <button onClick={() => setTab("Orders")} style={{ ...mont(11, "#d48a2c"), background: "none", border: "none", cursor: "pointer", marginTop: 12 }}>View all orders →</button>
              )}
            </div>

            {/* Upcoming reservations */}
            <div>
              <div style={{ ...play(22), color: "#f0e6d0", marginBottom: 20 }}>Upcoming Reservations</div>
              {reservations.filter(r => !isReservationExpired(r)).length === 0 ? (
                <div style={{ ...mont(13, "#4a3e32"), padding: 24, border: "1px dashed rgba(232,217,192,.06)", textAlign: "center" }}>
                  No upcoming reservations. <a href="/reserve.html" style={{ color: "#d48a2c" }}>Reserve a table →</a>
                </div>
              ) : (
                reservations.filter(r => !isReservationExpired(r)).slice(0, 2).map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(232,217,192,.04)", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ ...play(15), color: "#e8d9c0" }}>{r.ref}</div>
                      <div style={mont(12, "#5a4e42")}>{r.date} · {r.time} · {r.guests} guests</div>
                    </div>
                    <div style={{ ...mont(10, "#4caf7d", 600), background: "rgba(76,175,125,.08)", border: "1px solid rgba(76,175,125,.2)", padding: "4px 10px" }}>Upcoming</div>
                  </div>
                ))
              )}
            </div>
          </Anim>
        )}

        {/* ── ORDERS ── */}
        {tab === "Orders" && (
          <Anim>
            <div style={{ ...play(28), color: "#f0e6d0", marginBottom: 32 }}>Order History</div>
            {orderHistory.length === 0 ? (
              <div style={{ ...mont(14, "#4a3e32"), padding: 48, border: "1px dashed rgba(232,217,192,.06)", textAlign: "center" }}>
                You haven't placed any orders yet.<br />
                <Link to="/" style={{ color: "#d48a2c" }}>Browse the menu →</Link>
              </div>
            ) : (
              orderHistory.map((o, i) => (
                <div key={i} style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 24, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ ...play(17, 700), color: "#f0e6d0" }}>{o.id}</div>
                      <div style={mont(11, "#5a4e42")}>{new Date(o.timestamp).toLocaleString("en-GB")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...play(18), color: "#d48a2c" }}>{o.total}</div>
                      <div style={{ ...mont(10, "#8a7a68", 600), background: "rgba(212,138,44,.08)", border: "1px solid rgba(212,138,44,.15)", padding: "3px 8px", display: "inline-block", marginTop: 4 }}>{o.method}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(232,217,192,.04)", paddingTop: 12 }}>
                    {o.items?.map((item, j) => (
                      <div key={j} style={{ ...mont(12, "#6b5e50"), marginBottom: 4 }}>· {item}</div>
                    ))}
                  </div>
                  {o.address && (
                    <div style={{ ...mont(11, "#5a4e42"), marginTop: 8 }}>Delivered to: {o.address}</div>
                  )}
                </div>
              ))
            )}
          </Anim>
        )}

        {/* ── RESERVATIONS ── */}
        {tab === "Reservations" && (
          <Anim>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
              <div style={{ ...play(28), color: "#f0e6d0" }}>Your Reservations</div>
              <a href="/reserve.html" className="btn-primary" style={{ textDecoration: "none", padding: "10px 22px", fontSize: 10 }}>New Reservation</a>
            </div>

            {reservations.length === 0 ? (
              <div style={{ ...mont(14, "#4a3e32"), padding: 48, border: "1px dashed rgba(232,217,192,.06)", textAlign: "center" }}>
                No reservations found.<br />
                <a href="/reserve.html" style={{ color: "#d48a2c" }}>Book a table →</a>
              </div>
            ) : (
              <>
                {/* Upcoming */}
                {reservations.filter(r => !isReservationExpired(r)).length > 0 && (
                  <>
                    <div style={{ ...mont(10, "#d48a2c", 600), letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>Upcoming</div>
                    {reservations.filter(r => !isReservationExpired(r)).map((r, i) => (
                      <div key={i} style={{ background: "#141210", border: "1px solid rgba(76,175,125,.15)", borderLeft: "3px solid #4caf7d", padding: 24, marginBottom: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ ...play(17, 700), color: "#f0e6d0" }}>{r.ref}</div>
                          <div style={mont(12, "#6b5e50")}>{r.date} at {r.time} · {r.guests} guests</div>
                          {r.occasion && <div style={mont(11, "#8a7a68")}>Occasion: {r.occasion}</div>}
                          {r.notes && <div style={mont(11, "#6b5e50", 400)}>Notes: {r.notes}</div>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                          <div style={{ ...mont(10, "#4caf7d", 600), background: "rgba(76,175,125,.08)", border: "1px solid rgba(76,175,125,.2)", padding: "4px 12px" }}>Confirmed</div>
                          <a href={`/order.html?name=${encodeURIComponent(r.name)}&ref=${r.ref}`} style={{ ...mont(10, "#d48a2c"), textDecoration: "none", border: "1px solid rgba(212,138,44,.2)", padding: "4px 12px" }}>Pre-order →</a>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Past */}
                {reservations.filter(r => isReservationExpired(r)).length > 0 && (
                  <>
                    <div style={{ ...mont(10, "#5a4e42", 600), letterSpacing: ".15em", textTransform: "uppercase", margin: "28px 0 16px" }}>Past</div>
                    {reservations.filter(r => isReservationExpired(r)).map((r, i) => (
                      <div key={i} style={{ background: "#0f0d0b", border: "1px solid rgba(232,217,192,.04)", borderLeft: "3px solid rgba(232,217,192,.1)", padding: 20, marginBottom: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, opacity: 0.6 }}>
                        <div>
                          <div style={{ ...play(16), color: "#c8b99a" }}>{r.ref}</div>
                          <div style={mont(12, "#5a4e42")}>{r.date} at {r.time} · {r.guests} guests</div>
                        </div>
                        <div style={{ ...mont(10, "#5a4e42", 600), background: "rgba(232,217,192,.04)", padding: "4px 12px", alignSelf: "flex-start" }}>Completed</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </Anim>
        )}

        {/* ── LOYALTY ── */}
        {tab === "Loyalty" && (
          <Anim>
            <div style={{ ...play(28), color: "#f0e6d0", marginBottom: 12 }}>Loyalty Programme</div>
            <p style={{ ...mont(13, "#6b5e50"), lineHeight: 1.8, marginBottom: 40 }}>Earn 10 points every time you add an item to your cart. Points unlock tiers with exclusive perks.</p>

            {/* CURRENT TIER CARD */}
            <div style={{ background: `linear-gradient(135deg, ${tier.color}12, ${tier.color}06)`, border: `1px solid ${tier.color}40`, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 20, right: 24, fontSize: 48, opacity: .15 }}>{tier.icon}</div>
              <div style={{ ...mont(10, tier.color, 600), letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 8 }}>Your Current Tier</div>
              <div style={{ ...play(42, 900), color: tier.color, marginBottom: 4 }}>{tier.name}</div>
              <div style={{ ...play(28, 700), color: "#f0e6d0", marginBottom: 20 }}>{pts} points</div>
              {nextTier && (
                <>
                  <div style={{ height: 6, background: "rgba(232,217,192,.06)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${tier.color},${nextTier.color})`, borderRadius: 3, transition: "width 1.2s ease" }} />
                  </div>
                  <div style={mont(11, "#6b5e50")}>{nextTier.min - pts} more points to reach {nextTier.icon} {nextTier.name}</div>
                </>
              )}
              <div style={{ marginTop: 24 }}>
                <div style={mont(10, tier.color, 600)}>Your Perks:</div>
                {tier.perks.map(p => (
                  <div key={p} style={{ ...mont(12, "#8a7a68"), marginTop: 6 }}>✓ {p}</div>
                ))}
              </div>
            </div>

            {/* ALL TIERS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {TIERS.map(t => {
                const isCurrentTier = t.name === tier.name;
                const isUnlocked    = pts >= t.min;
                return (
                  <div key={t.name} style={{ background: "#141210", border: `1px solid ${isCurrentTier ? t.color + "60" : "rgba(232,217,192,.06)"}`, padding: "24px 20px", opacity: isUnlocked ? 1 : 0.5 }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>{t.icon}</div>
                    <div style={{ ...play(18, 700), color: isCurrentTier ? t.color : "#c8b99a", marginBottom: 4 }}>{t.name}</div>
                    <div style={mont(11, "#5a4e42")}>From {t.min} pts</div>
                    {isCurrentTier && <div style={{ ...mont(9, t.color, 600), marginTop: 8, letterSpacing: ".1em" }}>CURRENT TIER</div>}
                    <div style={{ marginTop: 12 }}>
                      {t.perks.map(p => <div key={p} style={{ ...mont(11, "#6b5e50"), marginTop: 4 }}>· {p}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 32, background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 24 }}>
              <div style={mont(10, "#d48a2c", 600)}>How to earn points</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {[["Add item to cart", "+10 pts"], ["Complete an order", "+10 pts per item"], ["Make a reservation", "+25 pts"], ["Leave a review", "+15 pts"]].map(([action, pts]) => (
                  <div key={action} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={mont(12, "#6b5e50")}>· {action}</span>
                    <span style={mont(12, "#d48a2c", 600)}>{pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </Anim>
        )}

        {/* ── COUPONS ── */}
        {tab === "Coupons" && (
          <Anim>
            <div style={{ ...play(28), color: "#f0e6d0", marginBottom: 8 }}>Your Coupons</div>
            <p style={{ ...mont(13, "#6b5e50"), marginBottom: 32 }}>Use these at checkout. Tap a code to copy it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {COUPONS.map(c => (
                <div key={c.code} style={{ background: "#141210", border: `1px solid ${c.valid ? "rgba(212,138,44,.2)" : "rgba(232,217,192,.04)"}`, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, opacity: c.valid ? 1 : 0.45 }}>
                  <div>
                    <div style={{ ...play(18, 700), color: c.valid ? "#d48a2c" : "#5a4e42", marginBottom: 6, letterSpacing: ".06em" }}>{c.code}</div>
                    <div style={mont(13, "#8a7a68")}>{c.desc}</div>
                    <div style={mont(11, "#5a4e42")}>Min spend: {c.minSpend} · Expires: {c.expiry}</div>
                  </div>
                  {c.valid ? (
                    <button onClick={() => copyCode(c.code)} className="btn-primary" style={{ padding: "10px 20px", fontSize: 10 }}>
                      {copiedCode === c.code ? "Copied!" : "Copy Code"}
                    </button>
                  ) : (
                    <div style={{ ...mont(10, "#5a4e42", 600), background: "rgba(232,217,192,.04)", border: "1px solid rgba(232,217,192,.08)", padding: "6px 14px" }}>Expired</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, ...mont(12, "#4a3e32"), textAlign: "center" }}>
              More coupons are sent to your email when you level up your tier.
            </div>
          </Anim>
        )}

        {/* ── SETTINGS ── */}
        {tab === "Settings" && (
          <Anim>
            <div style={{ ...play(28), color: "#f0e6d0", marginBottom: 32 }}>Account Settings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 540 }}>

              {/* NAME */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 24 }}>
                <div style={mont(10, "#d48a2c", 600)}>Display Name</div>
                {editName ? (
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <input value={newName} onChange={e => setNewName(e.target.value)} className="input-field" style={{ flex: 1 }} />
                    <button className="btn-primary" style={{ padding: "10px 16px", fontSize: 10 }} onClick={handleSaveName}>Save</button>
                    <button className="btn-outline" style={{ padding: "10px 12px", fontSize: 10 }} onClick={() => setEditName(false)}>✕</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ ...play(16), color: "#f0e6d0" }}>{userProfile.name}</span>
                    <button onClick={() => { setEditName(true); setNewName(userProfile.name); }} style={{ background: "none", border: "1px solid rgba(212,138,44,.2)", color: "#d48a2c", padding: "6px 14px", fontSize: 10, fontFamily: "'Montserrat',sans-serif", cursor: "pointer" }}>Edit</button>
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 24 }}>
                <div style={mont(10, "#d48a2c", 600)}>Email Address</div>
                <div style={{ ...play(16), color: "#f0e6d0", marginTop: 8 }}>{userProfile.email}</div>
                <div style={mont(11, "#4a3e32")}>Email cannot be changed after registration.</div>
              </div>

              {/* MEMBERSHIP */}
              <div style={{ background: "#141210", border: "1px solid rgba(232,217,192,.06)", padding: 24 }}>
                <div style={mont(10, "#d48a2c", 600)}>Membership</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ ...play(16), color: "#f0e6d0" }}>{tier.icon} {tier.name}</span>
                  <span style={{ ...play(16), color: "#d48a2c" }}>{pts} pts</span>
                </div>
                {userProfile.joinedAt && (
                  <div style={mont(11, "#4a3e32")}>Member since {new Date(userProfile.joinedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
                )}
              </div>

              {/* SIGN OUT */}
              <button className="btn-outline" style={{ padding: 16, marginTop: 8 }} onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </Anim>
        )}
      </div>
    </div>
  );
}