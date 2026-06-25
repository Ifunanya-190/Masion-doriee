import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Anim, Footer } from "./utils";
import { BRAND } from "./data";

const EMAIL_CONFIG = {
  SERVICE_ID: "service_dgigp18",
  TEMPLATE_ID: "template_7up07qm",
  PUBLIC_KEY: "w9XKj8v7KhAtFlQYt",
};

const HOURS = [
  { day: "Monday", time: "11:00 AM — 11:00 PM" },
  { day: "Tuesday", time: "11:00 AM — 11:00 PM" },
  { day: "Wednesday", time: "11:00 AM — 11:00 PM" },
  { day: "Thursday", time: "11:00 AM — 11:00 PM" },
  { day: "Friday", time: "11:00 AM — 12:00 AM" },
  { day: "Saturday", time: "10:00 AM — 12:00 AM" },
  { day: "Sunday", time: "10:00 AM — 11:00 PM" },
];

export default function Contact({ showToast }) {
  const [sending, setSending] = useState(false);
  const todayIndex = new Date().getDay();
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun=6, Mon=0...

  useEffect(() => {
    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init({ publicKey: EMAIL_CONFIG.PUBLIC_KEY });
    }
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
      title: "New Website Inquiry",
    };

    if (EMAIL_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      try {
        await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, formData);
        showToast("✓ Message sent successfully! We'll get back to you soon.");
        e.target.reset();
      } catch (err) {
        console.error("Email failed:", err);
        showToast("✗ Failed to send message. Please try again.");
      }
    }
    setSending(false);
  };

  return (
    <div className="bg-bg text-cream font-body min-h-screen overflow-x-hidden">
      {/* ── HERO BANNER ── */}
      <section
        className="border-b border-gold/10 mt-[68px]"
        style={{
          padding: "140px 48px 100px",
          background: "linear-gradient(135deg, #0c0a08 0%, #161008 100%)",
        }}
      >
        <div className="max-w-[1000px] mx-auto text-center">
          <Anim>
            <div className="section-tag mb-4">Get In Touch</div>
            <h1 className="font-heading font-bold text-cream-light mb-5 leading-tight" style={{ fontSize: "clamp(36px, 4vw, 52px)" }}>
              We'd Love to<br />Hear From You
            </h1>
            <p className="font-ui text-base text-cream-muted max-w-[600px] mx-auto leading-relaxed">
              Questions about reservations, private events, or just want to say hello? Reach out anytime.
            </p>
          </Anim>
        </div>
      </section>

      {/* ── CONTACT CONTENT ── */}
      <section style={{ padding: "100px 48px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex gap-20 items-start flex-wrap mb-20">
            {/* ── CONTACT INFO ── */}
            <Anim className="flex-[1_1_350px]">
              <h2 className="font-heading text-[32px] font-bold text-cream-light mb-12">
                Contact Info
              </h2>

              {/* Visit Us */}
              <div className="mb-12">
                <div className="font-ui text-[10px] text-gold font-semibold tracking-[.12em] uppercase mb-3">
                  📍 Visit Us
                </div>
                <p className="font-ui text-sm text-cream-muted leading-relaxed">
                  124 Artisan Way<br />
                  London, UK<br />
                  <span className="text-tan text-xs">Fine dining in the heart of the city</span>
                </p>
              </div>

              {/* Email */}
              <div className="mb-12">
                <div className="font-ui text-[10px] text-gold font-semibold tracking-[.12em] uppercase mb-3">
                  📧 Email
                </div>
                <p className="font-ui text-[15px] text-cream-muted font-semibold">hello@maisondoree.com</p>
                <p className="font-ui text-xs text-tan">We respond within 24 hours</p>
              </div>

              {/* Phone */}
              <div className="mb-12">
                <div className="font-ui text-[10px] text-gold font-semibold tracking-[.12em] uppercase mb-3">
                  📞 Phone
                </div>
                <p className="font-ui text-[15px] text-cream-muted font-semibold">+44 (0) 20 1234 5678</p>
                <p className="font-ui text-xs text-tan">Call us for private dining inquiries</p>
              </div>

              {/* Tip Card */}
              <div
                className="p-6 rounded-lg border border-gold/10"
                style={{
                  background: "linear-gradient(135deg, rgba(212,138,44,.08) 0%, rgba(212,138,44,.02) 100%)",
                }}
              >
                <div className="font-ui text-[11px] text-gold font-semibold mb-2">💡 Tip</div>
                <p className="font-ui text-xs text-tan">
                  For private dining events or large party reservations, we recommend calling us directly for a personalised experience.
                </p>
              </div>
            </Anim>

            {/* ── CONTACT FORM ── */}
            <Anim delay={0.2} className="flex-[1.2_1_400px]">
              <div className="glass-card p-12">
                <h3 className="font-heading text-[28px] font-bold text-cream-light mb-8">
                  Send us a Message
                </h3>
                <form onSubmit={handleContact} className="flex flex-col gap-6">
                  <div>
                    <label className="font-ui text-[10px] text-gold font-semibold uppercase tracking-[.1em] block mb-2.5">
                      Your Name *
                    </label>
                    <input name="name" required className="input-field" placeholder="Jean-Luc" />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] text-gold font-semibold uppercase tracking-[.1em] block mb-2.5">
                      Email Address *
                    </label>
                    <input name="email" type="email" required className="input-field" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] text-gold font-semibold uppercase tracking-[.1em] block mb-2.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      className="input-field resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary !rounded !mt-2 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                  <p className="font-ui text-[11px] text-tan-dark text-center mt-2">
                    We'll get back to you within 24 hours
                  </p>
                </form>
              </div>
            </Anim>
          </div>

          {/* ── OPERATING HOURS ── */}
          <Anim>
            <div className="border-t border-gold/10 pt-20">
              <h2 className="font-heading text-[32px] font-bold text-cream-light text-center mb-10">
                Opening Hours
              </h2>
              <div className="max-w-[500px] mx-auto">
                {HOURS.map((h, i) => {
                  const isToday = dayMap[todayIndex] === i;
                  return (
                    <div
                      key={h.day}
                      className={`flex justify-between items-center py-3 px-4 rounded-lg mb-1 font-ui text-sm transition-all duration-300 ${
                        isToday
                          ? "bg-gold/10 border border-gold/20 text-gold font-semibold"
                          : "text-tan hover:bg-cream/[0.02]"
                      }`}
                    >
                      <span>{h.day} {isToday && <span className="text-[10px] ml-2 uppercase tracking-wider opacity-70">Today</span>}</span>
                      <span className={isToday ? "text-cream-light" : ""}>{h.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Anim>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
