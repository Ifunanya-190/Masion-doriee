import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND, FOOTER_COLS } from "./data";

/* ── Intersection Observer Hook ── */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Scroll-Triggered Animation Wrapper ── */
export function Anim({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Animated Counter ── */
export function CountUp({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) { setCount(target); return; }
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Social Icon SVG Paths ── */
export const SOCIAL_ICONS = [
  { name: "fb", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { name: "x", path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.309 17.41z" },
  { name: "ig", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
];

/* ── Shared Footer Component ── */
export function Footer() {
  const navigate = useNavigate();
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyContent, setPolicyContent] = useState("");

  const getPolicyText = (label) => {
    switch (label) {
      case "Privacy Policy":
        return `Maison Dorée is committed to protecting your personal data. We collect names, emails, and address coordinates strictly to process gourmet orders and deliver them securely. Your transactional data is never shared with third parties or sold to advertisement agencies. Payment details scanned via QR code are routed through secure, encrypted checkout pathways to verify bank transfer requests instantly.`;
      case "Refund Policy":
        return `We aim to provide you with the highest quality culinary experiences. Since our gourmet dishes are freshly prepared to order by Chef Julian Dorée, cancellation requests must be made within 15 minutes of placing your order. After this window, the kitchen will have already begun prep and a refund cannot be issued. In the rare event of a quality dispute, please contact our concierge line at +44 (0) 20 1234 5678.`;
      case "Terms of Service":
        return `By making table reservations or placing delivery orders with Maison Dorée, you agree to our booking policies. Table reservations are held for a maximum of 15 minutes after the requested time. For delivery orders, please ensure a contact person is reachable at the provided phone number. Maison Dorée reserves the right to charge cancellation fees for table no-shows without 24 hours notice.`;
      case "FAQ":
        return `Q: What is your delivery range?
A: We deliver within a 15-mile radius of artisan central London. For requests outside this area, contact our private events team.

Q: Are there gluten-free and allergen options?
A: Yes! Our core menu displays allergen indicators. Feel free to use the Meal Builder step controls to omit proteins or select alternative sides.

Q: How do I earn loyalty rewards?
A: You earn 10 points for every custom plate added to your cart. Once logged in, your points automatically translate to Silver, Gold, or Platinum benefits (including free drinks and table priorities).`;
      default:
        return "";
    }
  };

  const handleFooterLink = (link) => {
    if (link.path === "#") {
      setPolicyTitle(link.label);
      setPolicyContent(getPolicyText(link.label));
      setPolicyOpen(true);
      return;
    }
    if (link.path && link.path.startsWith("/order.html")) {
      window.location.href = link.path;
      return;
    }
    if (link.section) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(link.section)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(link.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="bg-bg-darker border-t border-cream/5" style={{ padding: "80px 48px 40px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="footer-grid mb-16">
            {/* Brand Column */}
            <div>
              <div className="font-logo text-2xl text-gold tracking-[.02em] mb-4">{BRAND}</div>
              <p className="font-ui text-xs text-brown-dark leading-relaxed max-w-[210px]">
                An exquisite fine dining experience — crafted with passion, served with elegance since 2012.
              </p>
              <div className="flex gap-3 mt-6">
                {SOCIAL_ICONS.map(soc => (
                  <div key={soc.name} className="social-icon" style={{ width: 36, height: 36 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={soc.path} /></svg>
                  </div>
                ))}
              </div>
            </div>
            {/* Link Columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <h5 className="font-ui text-[10px] text-tan font-semibold tracking-[.18em] uppercase mb-5">{col.heading}</h5>
                {col.links.map(link => (
                  <div
                    key={link.label}
                    onClick={() => handleFooterLink(link)}
                    className="font-ui text-xs text-brown-dark mb-2.5 cursor-pointer transition-colors duration-200 hover:text-gold"
                  >
                    {link.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-cream/5 pt-6 flex justify-between items-center flex-wrap gap-3">
            <div className="font-ui text-[11px] text-brown-darkest">© 2026 {BRAND}. All rights reserved.</div>
            <div className="font-body text-[13px] italic text-brown-darker">Crafted with passion. Served with pride.</div>
          </div>
        </div>
      </footer>

      {policyOpen && (
        <div className="overlay active" onClick={() => setPolicyOpen(false)}>
          <div className="qr-modal flex flex-col" style={{ width: "min(440px, 92vw)" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPolicyOpen(false)} className="absolute top-4 right-5 bg-transparent border-none text-tan text-xl cursor-pointer hover:text-cream">✕</button>
            <div className="section-tag mb-2.5">Legal / Info</div>
            <h3 className="font-heading text-2xl font-bold text-cream-light mb-4">{policyTitle}</h3>
            <p className="font-ui text-xs text-tan-dark leading-relaxed whitespace-pre-wrap mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {policyContent}
            </p>
            <button className="btn-primary w-full" onClick={() => setPolicyOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
