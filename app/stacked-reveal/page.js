"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/*
 * Design Inspo 2 — "Vantage"
 * A fictional venture studio. Dark editorial, stacked scroll, bold numbers.
 */

const CASES = [
  {
    num: "01", bg: "#0c0c0e", textColor: "#e8e6e3", accent: "#4d7cfe",
    category: "Series A \u00b7 $14M raised", project: "Helix AI",
    description: "Built the product, hired the team, closed the round. From zero to 50K users in 9 months.",
    metric: "50K", metricLabel: "Active users",
    gradient: "radial-gradient(ellipse at 30% 50%, rgba(77,124,254,0.08) 0%, transparent 60%)",
  },
  {
    num: "02", bg: "#0a111e", textColor: "#e8e6e3", accent: "#38bdf8",
    category: "Seed \u00b7 $3.2M raised", project: "Canopy",
    description: "Climate-tech marketplace connecting verified carbon offsets with enterprise buyers. 340% MoM growth.",
    metric: "340%", metricLabel: "Monthly growth",
    gradient: "radial-gradient(ellipse at 70% 40%, rgba(56,189,248,0.06) 0%, transparent 60%)",
  },
  {
    num: "03", bg: "#160a0a", textColor: "#e8e6e3", accent: "#f97066",
    category: "Pre-Seed \u00b7 $1.8M raised", project: "Forma",
    description: "Generative design tools for architects. Reduced iteration time from weeks to hours.",
    metric: "12x", metricLabel: "Faster iterations",
    gradient: "radial-gradient(ellipse at 40% 60%, rgba(249,112,102,0.06) 0%, transparent 60%)",
  },
  {
    num: "04", bg: "#0a1a1a", textColor: "#e8e6e3", accent: "#2dd4bf",
    category: "Series A \u00b7 $18M raised", project: "Meridian",
    description: "Next-gen payment rails for cross-border commerce. Processing 4.2M transactions monthly across 40 markets.",
    metric: "4.2M", metricLabel: "Transactions monthly",
    gradient: "radial-gradient(ellipse at 60% 30%, rgba(45,212,191,0.06) 0%, transparent 60%)",
  },
  {
    num: "05", bg: "#e8e6e3", textColor: "#0c0c0e", accent: "#0c0c0e",
    category: "Series B \u00b7 $42M raised", project: "Kinetic",
    description: "Autonomous warehouse robotics. Deployed across 120 facilities in North America and Europe.",
    metric: "120", metricLabel: "Facilities live",
    gradient: "radial-gradient(ellipse at 50% 50%, rgba(12,12,14,0.04) 0%, transparent 60%)",
  },
];

const NAV_ITEMS = ["Portfolio", "Thesis", "Team", "Contact"];

const TEAM = [
  { name: "Elena Vasquez", role: "Managing Partner", line: "Former GP at Sequoia. 14 years building from zero to IPO." },
  { name: "James Chen", role: "Partner, Engineering", line: "Ex-CTO at Stripe. Believes great products are built, not funded." },
  { name: "Amara Osei", role: "Partner, Operations", line: "Scaled three companies past $100M ARR. Operator-first investor." },
  { name: "Kai Tanaka", role: "Principal", line: "Deep-tech specialist. PhD in ML, 6 years at DeepMind before Vantage." },
];

const MARQUEE_TEXT = "We build \u00b7 We invest \u00b7 We scale \u00b7 ";

export default function DesignInspo2() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const counterRef = useRef(null);
  const counterNameRef = useRef(null);
  const progressRef = useRef(null);
  const dotsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [currentAccent, setCurrentAccent] = useState(CASES[0].accent);
  const gsapRef = useRef(null);
  const stRef = useRef(null);

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
        gsapRef.current = gsap;
        stRef.current = ScrollTrigger;
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
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${prog})`;
            }
            const seg = 1 / n;
            const active = Math.min(Math.floor(prog / seg), n - 1);

            if (counterRef.current) {
              counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
            }
            if (counterNameRef.current) {
              counterNameRef.current.textContent = CASES[active].project;
            }

            setCurrentAccent(CASES[active].accent);

            // Update dots
            dotsRef.current.forEach((dot, i) => {
              if (!dot) return;
              dot.style.background = i === active ? CASES[active].accent : "rgba(255,255,255,0.1)";
              dot.style.transform = i === active ? "scale(1.3)" : "scale(1)";
            });

            cards.forEach((card, i) => {
              if (!card) return;
              const lp = (prog - i * seg) / seg;
              if (i < active) {
                gsap.set(card, { scale: 0.86, borderRadius: "28px", opacity: 0.2 - (active - i) * 0.1, y: 0, zIndex: i });
              } else if (i === active) {
                const ep = Math.max(0, Math.min(1, lp));
                if (i < n - 1) {
                  gsap.set(card, { scale: 1 - ep * 0.14, borderRadius: ep * 28 + "px", opacity: 1 - ep * 0.8, y: 0, zIndex: i });
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

        // Animate post-stack sections on scroll
        document.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.fromTo(el,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
        });

        cleanupFn = () => { st.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
      } catch { /* fallback */ }
    })();

    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  const dark = "#0c0c0e";
  const light = "#e8e6e3";

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
        <section style={{ padding: "80px 24px", background: dark }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: CASES[0].accent, display: "block", marginBottom: 32 }}>Our thesis</span>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, lineHeight: 1.3, color: light, marginBottom: 32 }}>
            We back technical founders building category-defining companies.
          </p>
        </section>
        <footer style={{ padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.15)" }}>&copy; 2025 Vantage</span>
          <Link href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.15)" }}>MalamasDevs</Link>
        </footer>
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
        padding: "24px 48px", background: "rgba(12,12,14,0.88)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.1s",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>VANTAGE</span>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.4)",
              textDecoration: "none", transition: "color 0.3s", position: "relative",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = light)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.4)")}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* Progress bar with glow */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: "rgba(255,255,255,0.03)" }}>
        <div ref={progressRef} style={{
          height: "100%",
          background: `linear-gradient(90deg, ${currentAccent}, ${currentAccent}aa)`,
          boxShadow: `0 0 12px ${currentAccent}40`,
          transformOrigin: "left", transform: "scaleX(0)", transition: "transform 0.1s linear, background 0.5s ease, box-shadow 0.5s ease",
        }} />
      </div>

      {/* Side counter */}
      <div style={{
        position: "fixed", right: 48, top: "50%", transform: "translateY(-50%)",
        zIndex: 50, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      }}>
        <span ref={counterRef} style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: "rgba(232,230,227,0.2)", letterSpacing: "0.06em",
        }}>01 / 05</span>
        <span ref={counterNameRef} style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11,
          color: "rgba(232,230,227,0.12)", letterSpacing: "0.04em",
        }}>Helix AI</span>
      </div>

      {/* Left dots */}
      <div style={{
        position: "fixed", left: 48, top: "50%", transform: "translateY(-50%)",
        zIndex: 50, display: "flex", flexDirection: "column", gap: 10,
      }}>
        {CASES.map((c, i) => (
          <div key={i} ref={(el) => (dotsRef.current[i] = el)} style={{
            width: 6, height: 6, borderRadius: 3,
            background: i === 0 ? c.accent : "rgba(255,255,255,0.1)",
            transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          }} />
        ))}
      </div>

      {/* Stacked section */}
      <div ref={sectionRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {CASES.map((c, i) => (
          <div key={i} ref={(el) => (cardsRef.current[i] = el)} style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center",
            background: c.bg, overflow: "hidden", willChange: "transform, opacity",
          }}>
            {/* Animated gradient mesh */}
            <div style={{
              position: "absolute", inset: 0, background: c.gradient, pointerEvents: "none",
              animation: "ambientGlow 8s ease-in-out infinite alternate",
            }} />

            {/* Giant number */}
            <span style={{
              position: "absolute", right: "6%", top: "50%", transform: "translateY(-55%)",
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(220px, 30vw, 460px)", opacity: 0.025,
              color: c.textColor, userSelect: "none", pointerEvents: "none", lineHeight: 1,
            }}>{c.num}</span>

            {/* Decorative line */}
            <div style={{
              position: "absolute", left: 80, bottom: "15%",
              width: 60, height: 1, background: c.accent, opacity: 0.2,
            }} />

            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "0 80px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: c.accent, opacity: 0.8, display: "block", marginBottom: 28,
              }}>{c.category}</span>

              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(60px, 11vw, 140px)", color: c.textColor,
                lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: 28,
              }}>{c.project}</h2>

              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 1.4vw, 18px)",
                color: c.textColor, opacity: 0.35, maxWidth: 480, lineHeight: 1.7, marginBottom: 48,
              }}>{c.description}</p>

              <div style={{
                display: "flex", gap: 56, alignItems: "flex-end",
                paddingTop: 28, borderTop: `1px solid ${c.textColor === "#0c0c0e" ? "rgba(12,12,14,0.08)" : "rgba(255,255,255,0.05)"}`,
              }}>
                <div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(44px, 5.5vw, 72px)", color: c.accent, display: "block", lineHeight: 1 }}>{c.metric}</span>
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

            {/* Scroll hint on first card */}
            {i === 0 && (
              <div style={{
                position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: "fadeInUp 1s ease 1.5s both",
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(232,230,227,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
                <div style={{ width: 1, height: 24, background: "rgba(232,230,227,0.08)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {loaded && <div style={{ height: 0 }} />}

      {/* Marquee strip */}
      <div data-reveal style={{
        padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          animation: "marquee 20s linear infinite",
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
          letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,230,227,0.08)",
        }}>
          {Array(8).fill(MARQUEE_TEXT).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* Portfolio Grid */}
      <section data-reveal style={{ padding: "100px 48px", background: dark }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.03em" }}>Portfolio</h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(232,230,227,0.15)" }}>{CASES.length} companies</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {CASES.map((c) => (
              <a key={c.num} href="#" style={{
                padding: "28px 24px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14,
                textDecoration: "none", color: light,
                transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.boxShadow = `0 8px 30px ${c.accent}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18, background: `${c.accent}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: c.accent,
                  }}>{c.project[0]}</div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>{c.project}</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.3)", lineHeight: 1.6, marginBottom: 16 }}>
                  {c.description.split(".")[0]}.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: c.accent }}>{c.metric}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(232,230,227,0.15)", letterSpacing: "0.06em" }}>{c.metricLabel}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Thesis section */}
      <section data-reveal style={{ padding: "120px 48px", background: dark }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase", color: CASES[0].accent,
            display: "block", marginBottom: 36,
          }}>Our thesis</span>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: "clamp(28px, 4.5vw, 52px)", lineHeight: 1.25,
            letterSpacing: "-0.02em", color: light, marginBottom: 48,
          }}>
            We back technical founders building category-defining companies. We write the first check, roll up our sleeves on product, and stay through scale.
          </p>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            {[
              { n: "$240M", l: "Assets under management" },
              { n: "32", l: "Portfolio companies" },
              { n: "4", l: "Unicorns" },
              { n: "89%", l: "Follow-on rate" },
            ].map((s) => (
              <div key={s.l}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: CASES[0].accent, display: "block" }}>{s.n}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.3)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section data-reveal style={{ padding: "100px 48px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase", color: CASES[0].accent,
            display: "block", marginBottom: 48,
          }}>Team</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {TEAM.map((m) => (
              <div key={m.name} style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: 20 }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", marginBottom: 4 }}>{m.name}</h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: CASES[0].accent, letterSpacing: "0.04em", display: "block", marginBottom: 12 }}>{m.role}</span>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7, color: "rgba(232,230,227,0.3)" }}>{m.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-reveal style={{ padding: "120px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.04em", marginBottom: 32,
        }}>
          Let&apos;s build together.
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          <a href="#" style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
            color: CASES[0].accent, padding: "14px 36px",
            border: `1px solid ${CASES[0].accent}40`, borderRadius: 100,
            transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${CASES[0].accent}12`; e.currentTarget.style.borderColor = `${CASES[0].accent}80`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${CASES[0].accent}40`; }}
          >
            hello@vantage.vc
          </a>
          <a href="#" style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
            color: "rgba(232,230,227,0.5)", padding: "14px 36px",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 100,
            transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = light; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,230,227,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            Schedule a call
          </a>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 28 }}>
          {["Twitter", "LinkedIn", "Medium"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.2)",
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = light)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.2)")}
            >{s}</a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.12)", letterSpacing: "0.06em" }}>
          &copy; 2025 Vantage Ventures
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.08)", letterSpacing: "0.06em" }}>
          New York &middot; San Francisco &middot; London
        </span>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(232,230,227,0.12)", letterSpacing: "0.06em", transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = CASES[0].accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.12)")}
        >
          MalamasDevs Design Inspo
        </Link>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ambientGlow {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
