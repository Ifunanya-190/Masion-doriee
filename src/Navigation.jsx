import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BRAND = "Maison Dorée";

const NAV_LINKS = [
  { name: "Home", path: "/", section: "home" },
  { name: "About Us", path: "/about" },
  { name: "Favourites", path: "/", section: "favourites" },
  { name: "Menu", path: "/", section: "menu" },
  { name: "Contact", path: "/contact" },
];

export default function Navigation({ 
  onQROpen, 
  cartCount, 
  onCartOpen, 
  userProfile, 
  onProfileOpen, 
  activeOrder, 
  onTrackerOpen 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  /* ── Scroll-Spy: track which homepage section is visible ── */
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionIds = ["menu", "chefs-table", "favourites", "discover", "home"];
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "discover" || id === "favourites") setActiveSection("favourites");
          else if (id === "menu") setActiveSection("menu");
          else if (id === "chefs-table") setActiveSection("chefs-table");
          else if (id === "home") setActiveSection("home");
        }
      });
    };

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const obs = new IntersectionObserver(handleIntersect, {
            threshold: 0.3,
            rootMargin: "-68px 0px 0px 0px",
          });
          obs.observe(el);
          observers.push(obs);
        }
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [location.pathname]);

  /* ── Determine active link ── */
  const isActive = useCallback(
    (link) => {
      if (location.pathname !== "/") {
        return location.pathname === link.path && !link.section;
      }
      if (link.section) return activeSection === link.section;
      if (link.name === "Home") return activeSection === "home";
      return false;
    },
    [location.pathname, activeSection]
  );

  /* ── Handle nav click with scroll ── */
  const handleNavClick = (e, link) => {
    setMenuOpen(false);

    if (link.section) {
      e.preventDefault();

      if (location.pathname === "/") {
        const targetId = link.section === "favourites" ? "favourites" : link.section;
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        setActiveSection(link.section);
      } else {
        navigate("/");
        setTimeout(() => {
          const targetId = link.section === "favourites" ? "favourites" : link.section;
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
          setActiveSection(link.section);
        }, 200);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-bg-nav backdrop-blur-[14px] border-b border-cream/5 px-6 md:px-12 h-[68px] flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="no-underline" onClick={() => { setMenuOpen(false); setActiveSection("home"); }}>
        <div className="font-logo text-[28px] text-gold tracking-[.02em]">{BRAND}</div>
      </Link>

      {/* Desktop Nav */}
      <div className="desktop-nav flex gap-7 items-center">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.name}
            to={l.path}
            className={`nav-link ${isActive(l) ? "active" : ""}`}
            onClick={(e) => handleNavClick(e, l)}
          >
            {l.name}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Active Order tracking indicator */}
        {activeOrder && activeOrder.status !== "Completed" && activeOrder.status !== "Delivered" && (
          <button 
            className="tracker-active-badge flex items-center gap-1 border-none cursor-pointer"
            onClick={onTrackerOpen}
          >
            <span>⏳</span>
            <span className="hidden sm:inline">Track Order</span>
          </button>
        )}
        <button
          className="btn-primary !py-2 !px-[18px] !text-[10px]"
          onClick={() => onQROpen?.("reservation")}
        >
          Reserve Table
        </button>
        
        {/* Cart */}
        <div
          className="relative cursor-pointer flex items-center"
          onClick={() => onCartOpen?.()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8b99a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && <span className="qty-badge">{cartCount}</span>}
        </div>

        {/* Profile / Account Login */}
        <div 
          className="cursor-pointer flex items-center justify-center"
          onClick={onProfileOpen}
        >
          {userProfile ? (
            <div className="w-8 h-8 rounded-full border border-gold bg-gold/10 text-gold flex items-center justify-center font-ui text-xs font-bold hover:bg-gold/20 transition-all duration-300">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8b99a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-gold transition-all duration-300">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        <button
          className="hamburger bg-transparent border-none text-cream text-[22px] cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              className={`nav-link ${isActive(l) ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, l)}
            >
              {l.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
