"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/*
 * Design Inspo 2 — "Vantage"
 * A fictional venture studio. Inspired by nfinitepaper.com.
 * Dark editorial, stacked scroll, bold numbers.
 */

const CASES = [
  {
    num: "01",
    bg: "#0c0c0e",
    textColor: "#e8e6e3",
    accent: "#4d7cfe",
    category: "Series A · $14M raised",
    project: "Helix AI",
    description: "Built the product, hired the team, closed the round. From zero to 50K users in 9 months.",
    metric: "50K",
    metricLabel: "Active users",
  },
  {
    num: "02",
    bg: "#0e1a2e",
    textColor: "#e8e6e3",
    accent: "#38bdf8",
    category: "Seed · $3.2M raised",
    project: "Canopy",
    description: "Climate-tech marketplace connecting verified carbon offsets with enterprise buyers. 340% MoM growth.",
    metric: "340%",
    metricLabel: "Monthly growth",
  },
  {
    num: "03",
    bg: "#1a0e0e",
    textColor: "#e8e6e3",
    accent: "#f97066",
    category: "Pre-Seed · $1.8M raised",
    project: "Forma",
    description: "Generative design tools for architects. Reduced iteration time from weeks to hours.",
    metric: "12x",
    metricLabel: "Faster iterations",
  },
  {
    num: "04",
    bg: "#e8e6e3",
    textColor: "#0c0c0e",
    accent: "#0c0c0e",
    category: "Series B · $42M raised",
    project: "Kinetic",
    description: "Autonomous warehouse robotics. Deployed across 120 facilities in North America and Europe.",
    metric: "120",
    metricLabel: "Facilities live",
  },
];

const NAV_ITEMS = ["Portfolio", "Thesis", "Team", "Contact"];

export default function DesignInspo2() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);

    let cleanupFn;
    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        setLoaded(true);
        if (mobile) return;

        const section = sectionRef.current;
        const cards = cardsRef.current;
        const n = cards.length;

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${n * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${prog})`;
            const seg = 1 / n;
            const active = Math.min(Math.floor(prog / seg), n - 1);

            if (counterRef.current) {
              counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} — ${CASES[active].project}`;
            }

            cards.forEach((card, i) => {
              if (!card) return;
              const lp = (prog - i * seg) / seg;
              if (i < active) {
                gsap.set(card, { scale: 0.88, borderRadius: "28px", opacity: 0.3 - (active - i) * 0.12, y: 0, zIndex: i });
              } else if (i === active) {
                const ep = Math.max(0, Math.min(1, lp));
                if (i < n - 1) {
                  gsap.set(card, { scale: 1 - ep * 0.12, borderRadius: ep * 28 + "px", opacity: 1 - ep * 0.7, y: 0, zIndex: i });
                } else {
                  gsap.set(card, { scale: 1, borderRadius: "0px", opacity: 1, y: 0, zIndex: i });
                }
              } else if (i === active + 1) {
                const ep = Math.max(0, Math.min(1, lp + 1));
                gsap.set(card, { y: `${(1 - ep) * 100}%`, scale: 1, borderRadius: "0px", opacity: 1, zIndex: i + 10 });
              } else {
                gsap.set(card, { y: "100%", scale: 1, borderRadius: "0px", opacity: 1, zIndex: i });
              }
            });
          },
        });

        cards.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, i === 0 ? { y: 0, scale: 1, opacity: 1, zIndex: 10 } : { y: "100%", scale: 1, opacity: 1, zIndex: i });
        });

        cleanupFn = () => { st.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
      } catch { /* fallback */ }
    })();

    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  const dark = "#0c0c0e";
  const light = "#e8e6e3";
  const blue = "#4d7cfe";

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <div style={{ background: dark, color: light }}>
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", background: "rgba(12,12,14,0.9)", backdropFilter: "blur(12px)",
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>VANTAGE</span>
          <Link href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.3)" }}>
            &larr; Back
          </Link>
        </nav>
        {CASES.map((c, i) => (
          <section key={i} style={{
            minHeight: "100vh", padding: "100px 24px 60px", background: c.bg,
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.accent, marginBottom: 16 }}>
              {c.category}
            </span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(48px, 14vw, 90px)", color: c.textColor, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 20 }}>
              {c.project}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: c.textColor, opacity: 0.4, maxWidth: 400, lineHeight: 1.7, marginBottom: 40 }}>
              {c.description}
            </p>
            <div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color: c.accent, display: "block" }}>{c.metric}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textColor, opacity: 0.3, letterSpacing: "0.08em" }}>{c.metricLabel}</span>
            </div>
          </section>
        ))}
      </div>
    );
  }

  /* ── Desktop ── */
  return (
    <div style={{ background: dark, color: light }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", background: "rgba(12,12,14,0.85)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.1s",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>VANTAGE</span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.4)",
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = light)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.4)")}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* Progress */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: "rgba(255,255,255,0.03)" }}>
        <div ref={progressRef} style={{
          height: "100%", background: `linear-gradient(90deg, ${blue}, #38bdf8)`,
          transformOrigin: "left", transform: "scaleX(0)", transition: "transform 0.1s linear",
        }} />
      </div>

      {/* Side counter */}
      <div ref={counterRef} style={{
        position: "fixed", right: 48, top: "50%", transform: "translateY(-50%)",
        zIndex: 50, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: "rgba(232,230,227,0.2)", letterSpacing: "0.06em",
        writingMode: "vertical-rl", textOrientation: "mixed",
      }}>
        01 — Helix AI
      </div>

      {/* Stacked section */}
      <div ref={sectionRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {CASES.map((c, i) => (
          <div key={i} ref={(el) => (cardsRef.current[i] = el)} style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center",
            background: c.bg, overflow: "hidden", willChange: "transform, opacity",
          }}>
            {/* Giant number */}
            <span style={{
              position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(200px, 28vw, 420px)", opacity: 0.03,
              color: c.textColor, userSelect: "none", pointerEvents: "none", lineHeight: 1,
            }}>{c.num}</span>

            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 80px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: c.accent, opacity: 0.8, display: "block", marginBottom: 28,
              }}>{c.category}</span>

              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(60px, 11vw, 130px)", color: c.textColor,
                lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 28,
              }}>{c.project}</h2>

              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 1.4vw, 18px)",
                color: c.textColor, opacity: 0.35, maxWidth: 480, lineHeight: 1.7, marginBottom: 48,
              }}>{c.description}</p>

              {/* Metric + meta row */}
              <div style={{
                display: "flex", gap: 56, alignItems: "flex-end",
                paddingTop: 28, borderTop: `1px solid ${c.textColor === "#0c0c0e" ? "rgba(12,12,14,0.08)" : "rgba(255,255,255,0.05)"}`,
              }}>
                <div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 5vw, 64px)", color: c.accent, display: "block", lineHeight: 1 }}>{c.metric}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textColor, opacity: 0.25, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.metricLabel}</span>
                </div>
                <a href="#" style={{
                  marginLeft: "auto", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14, fontWeight: 500, color: c.accent, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "gap 0.3s cubic-bezier(0.23,1,0.32,1)",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = "14px")}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
                >
                  Read case study <span style={{ fontSize: 18 }}>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loaded && <div style={{ height: 0 }} />}

      {/* Thesis section */}
      <section style={{ padding: "120px 48px", background: dark }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase", color: blue,
            display: "block", marginBottom: 32,
          }}>Our thesis</span>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: "clamp(24px, 4vw, 44px)", lineHeight: 1.3,
            letterSpacing: "-0.02em", color: light, marginBottom: 40,
          }}>
            We back technical founders building category-defining companies. We write the first check, roll up our sleeves on product, and stay through scale.
          </p>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            {[
              { n: "$240M", l: "Assets under management" },
              { n: "32", l: "Portfolio companies" },
              { n: "4", l: "Unicorns" },
            ].map((s) => (
              <div key={s.l}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: blue, display: "block" }}>{s.n}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.3)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.15)", letterSpacing: "0.06em" }}>
          &copy; 2025 Vantage Ventures
        </span>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(232,230,227,0.15)", letterSpacing: "0.06em", transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = blue)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.15)")}
        >
          MalamasDevs Design Inspo 2
        </Link>
      </footer>
    </div>
  );
}
