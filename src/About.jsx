import { Anim, CountUp, Footer } from "./utils";
import { BRAND } from "./data";

export default function About() {
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
            <div className="section-tag mb-4">Our Heritage</div>
            <h1 className="font-heading font-bold text-cream-light mb-5 leading-tight" style={{ fontSize: "clamp(36px, 4vw, 52px)" }}>
              Culinary Excellence<br />Since 2012
            </h1>
            <p className="font-ui text-base text-cream-muted max-w-[600px] mx-auto leading-relaxed">
              Discover the story behind {BRAND} — where culinary artistry meets timeless elegance
            </p>
          </Anim>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="bg-bg" style={{ padding: "100px 48px" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex gap-20 items-center flex-wrap mb-[100px]">
            {/* Text Column */}
            <Anim className="flex-[1_1_450px]">
              <div className="font-ui text-xs text-gold font-semibold tracking-[.15em] uppercase mb-5">
                Our Story
              </div>
              <h2 className="font-heading text-[42px] font-bold text-cream-light mb-8">
                Where Every Plate Tells a Story
              </h2>
              <p className="font-ui text-[15px] text-cream-muted leading-relaxed mb-6 italic">
                "We believe that dining is more than sustenance; it's an art form, a moment of connection, and a celebration of the finest ingredients the world has to offer. Every dish that leaves our kitchen carries hours of dedication, heritage techniques, and the heart of our culinary team."
              </p>
              <p className="font-ui text-sm text-tan leading-relaxed mb-5">
                Founded by Chef Julian Dorée in 2012, {BRAND} has become a sanctuary for those who
                appreciate the art of fine dining. We source the finest ingredients from trusted purveyors
                worldwide — from A5 Wagyu to hand-dived scallops — and transform them into unforgettable
                culinary experiences.
              </p>

              {/* Animated Stats */}
              <div className="flex gap-8 mt-9">
                {[
                  { target: "14", label: "Years of Excellence" },
                  { target: "1000", label: "Happy Guests Daily", suffix: "+" },
                  { target: "100", label: "Fresh Ingredients", suffix: "%" },
                ].map((stat, i) => (
                  <Anim key={stat.label} delay={0.1 + i * 0.1}>
                    <div>
                      <div className="font-heading text-[28px] font-bold text-gold">
                        <CountUp target={stat.target} suffix={stat.suffix || ""} />
                      </div>
                      <div className="font-ui text-[11px] text-tan-dark font-semibold tracking-[.08em] mt-2">
                        {stat.label}
                      </div>
                    </div>
                  </Anim>
                ))}
              </div>
            </Anim>

            {/* Image Column */}
            <Anim delay={0.2} className="flex-[0.8_1_350px]">
              <div
                className="rounded-xl p-6 border border-gold/20 overflow-hidden transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_40px_rgba(212,138,44,0.08)]"
                style={{
                  background: "linear-gradient(135deg, rgba(212,138,44,0.08) 0%, rgba(212,138,44,0.02) 100%)",
                }}
              >
                <img
                  src="/images/hero-dish.png"
                  className="w-full opacity-85 rounded-lg"
                  style={{ filter: "brightness(1.1)" }}
                  alt="Signature Dish"
                />
                <div className="font-ui text-[10px] text-gold font-semibold text-center mt-6 tracking-[.1em] uppercase">
                  ★ Authentic Craftsmanship ★
                </div>
              </div>
            </Anim>
          </div>

          {/* ── VALUES ── */}
          <div className="border-t border-gold/10 pt-20">
            <Anim>
              <h2 className="font-heading text-4xl font-bold text-cream-light text-center mb-14">
                Our Values
              </h2>
            </Anim>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
              {[
                {
                  title: "Quality",
                  desc: "We source only the finest ingredients — from heritage farms to pristine waters — ensuring every bite exceeds expectations.",
                },
                {
                  title: "Tradition",
                  desc: "Our recipes are inspired by centuries of European culinary heritage, refined with modern technique and artful precision.",
                },
                {
                  title: "Passion",
                  desc: "Every plate is crafted with love and meticulous attention to detail by our dedicated team of world-class chefs.",
                },
              ].map((value, i) => (
                <Anim key={value.title} delay={i * 0.15}>
                  <div className="glass-card p-10 cursor-pointer group">
                    <div className="font-heading text-2xl text-gold mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">
                      ✦
                    </div>
                    <h3 className="font-heading text-[22px] font-bold text-cream-light mb-3">
                      {value.title}
                    </h3>
                    <p className="font-ui text-[13px] text-tan leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
