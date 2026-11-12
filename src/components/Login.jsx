import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Anim } from "../utils";
import { BRAND } from "../data";

const mont = (size, color, weight = 400) => ({ fontFamily: "'Montserrat',sans-serif", fontSize: size, color, fontWeight: weight });
const play = (size, weight = 700) => ({ fontFamily: "'Playfair Display',serif", fontSize: size, fontWeight: weight });

export default function Login({ setUserProfile, showToast }) {
  const [tab,       setTab]       = useState("signin"); // "signin" | "signup"
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [sending,   setSending]   = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    setSending(true);
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setUserProfile(user);
      localStorage.setItem("userProfile", JSON.stringify(user));
      showToast(`Welcome back, ${user.name}!`);
      navigate("/profile");
    } else {
      showToast("Account not found. Please sign up.");
      setTab("signup");
    }
    setSending(false);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setSending(true);
    const users  = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setUserProfile(exists);
      localStorage.setItem("userProfile", JSON.stringify(exists));
      showToast(`Welcome back, ${exists.name}!`);
      navigate("/profile");
      setSending(false);
      return;
    }
    const newUser = { name, email, points: 0, joinedAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    setUserProfile(newUser);
    localStorage.setItem("userProfile", JSON.stringify(newUser));
    showToast(`Welcome to ${BRAND}, ${name}!`);
    navigate("/profile");
    setSending(false);
  };

  return (
    <div style={{ background: "#0f0d0b", color: "#e8d9c0", fontFamily: "'Cormorant Garamond','Georgia',serif", minHeight: "100vh", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px" }}>
      <div style={{ maxWidth: 460, width: "100%" }}>
        <Anim>
          {/* BRAND */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link to="/" style={{ fontFamily: "'Great Vibes',cursive", fontSize: 32, color: "#d48a2c", textDecoration: "none" }}>{BRAND}</Link>
          </div>

          {/* CARD */}
          <div style={{ background: "linear-gradient(165deg, #141210 0%, #0e0c0a 100%)", border: "1px solid rgba(232,217,192,.07)", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d48a2c,transparent)" }} />

            {/* TAB TOGGLE */}
            <div style={{ display: "flex", background: "rgba(232,217,192,.04)", border: "1px solid rgba(232,217,192,.08)", marginBottom: 32 }}>
              {["signin", "signup"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px", background: tab === t ? "#d48a2c" : "transparent", color: tab === t ? "#0a0908" : "#6b5e50", border: "none", fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", transition: "all .3s" }}>
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <div className="section-tag" style={{ marginBottom: 8 }}>{tab === "signin" ? "Welcome Back" : "Create Account"}</div>
            <h1 style={{ ...play(28), color: "#f0e6d0", marginBottom: 8 }}>
              {tab === "signin" ? "Sign In to Your Account" : `Join ${BRAND}`}
            </h1>
            <p style={{ ...mont(12, "#6b5e50"), lineHeight: 1.8, marginBottom: 32 }}>
              {tab === "signin"
                ? "Access your loyalty rewards, order history, and reservations."
                : "Earn loyalty points, track orders, and enjoy exclusive member benefits."}
            </p>

            <form onSubmit={tab === "signin" ? handleSignIn : handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {tab === "signup" && (
                <div>
                  <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".12em", textTransform: "uppercase" }}>Full Name</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jean-Luc Moreau"
                    className="input-field w-full"
                  />
                </div>
              )}
              <div>
                <label style={{ ...mont(10, "#9a8878", 600), display: "block", marginBottom: 8, letterSpacing: ".12em", textTransform: "uppercase" }}>Email Address</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field w-full"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={sending} style={{ marginTop: 8 }}>
                {sending ? "Please wait..." : tab === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {tab === "signin" && (
              <div style={{ ...mont(11, "#5a4e42"), textAlign: "center", marginTop: 20 }}>
                Demo: <span style={{ color: "#d48a2c", cursor: "pointer" }} onClick={() => setEmail("jane@example.com")}>jane@example.com</span>
              </div>
            )}

            <div style={{ ...mont(11, "#5a4e42"), textAlign: "center", marginTop: 16 }}>
              {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
              <span style={{ color: "#d48a2c", cursor: "pointer" }} onClick={() => setTab(tab === "signin" ? "signup" : "signin")}>
                {tab === "signin" ? "Sign Up" : "Sign In"}
              </span>
            </div>

            <div style={{ borderTop: "1px solid rgba(232,217,192,.05)", marginTop: 28, paddingTop: 20, textAlign: "center" }}>
              <Link to="/" style={{ ...mont(11, "#5a4e42"), textDecoration: "none" }}>← Back to Restaurant</Link>
            </div>
          </div>
        </Anim>
      </div>
    </div>
  );
}