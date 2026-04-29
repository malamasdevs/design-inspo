"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/*
 * Design Inspo 3 — "Ren Ishikawa"
 * A fictional creative director portfolio.
 * Dark, bold, experimental hover effects, massive type.
 */

const PROJECTS = [
  {
    name: "Nike Air Max", tag: "Campaign", year: "2025", role: "Creative Direction",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 40%, #2d1b4e 100%)",
    letter: "N", glow: "rgba(139,92,246,0.3)", accent: "#8b5cf6",
  },
  {
    name: "Spotify Wrapped", tag: "Digital Experience", year: "2024", role: "Art Direction",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1e3a2f 40%, #0d503a 100%)",
    letter: "S", glow: "rgba(52,211,153,0.3)", accent: "#34d399",
  },
  {
    name: "Porsche Taycan", tag: "Brand Film", year: "2024", role: "Direction & Edit",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #2a1a1a 40%, #4a1c1c 100%)",
    letter: "P", glow: "rgba(248,113,113,0.3)", accent: "#f87171",
  },
  {
    name: "Apple Vision", tag: "Spatial Design", year: "2024", role: "Interaction Design",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 40%, #1e3a5f 100%)",
    letter: "A", glow: "rgba(96,165,250,0.3)", accent: "#60a5fa",
  },
  {
    name: "Balenciaga SS25", tag: "Fashion", year: "2023", role: "Set Design",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #2d2418 40%, #4a3520 100%)",
    letter: "B", glow: "rgba(251,191,36,0.25)", accent: "#fbbf24",
  },
  {
    name: "Aesop Interiors", tag: "Retail", year: "2023", role: "Spatial & Digital",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1f1f1f 40%, #2a2a2a 100%)",
    letter: "Ae", glow: "rgba(200,200,200,0.2)", accent: "#a3a3a3",
  },
];

const APPROACH = [
  { num: "01", title: "Research", desc: "Every project begins with deep immersion into brand, culture, and audience. Understanding before creating." },
  { num: "02", title: "Concept", desc: "Distilling research into a singular creative vision. Bold ideas that challenge convention and provoke emotion." },
  { num: "03", title: "Execution", desc: "Obsessive attention to craft across every medium. The work speaks through precision and restraint." },
];

const AWARDS = [
  { year: "2025", name: "Cannes Lions Grand Prix" },
  { year: "2024", name: "Cannes Lions Gold" },
  { year: "2024", name: "D&AD Yellow Pencil" },
  { year: "2024", name: "One Show Gold" },
  { year: "2023", name: "FWA Site of the Year" },
  { year: "2023", name: "ADC Annual Awards" },
];

const STILLS = [
  { w: "360px", h: "240px", bg: "linear-gradient(135deg, #1a1a2e, #2d1b4e)" },
  { w: "240px", h: "240px", bg: "linear-gradient(135deg, #1e3a2f, #0d503a)" },
  { w: "400px", h: "240px", bg: "linear-gradient(135deg, #2a1a1a, #4a1c1c)" },
  { w: "240px", h: "240px", bg: "linear-gradient(135deg, #1a1a2e, #1e3a5f)" },
  { w: "320px", h: "240px", bg: "linear-gradient(135deg, #2d2418, #4a3520)" },
  { w: "280px", h: "240px", bg: "linear-gradient(135deg, #1f1f1f, #2a2a2a)" },
  { w: "360px", h: "240px", bg: "linear-gradient(135deg, #0a1a1a, #1a2e2e)" },
  { w: "240px", h: "240px", bg: "linear-gradient(135deg, #1a0a1a, #2e1a2e)" },
];

const CATEGORIES = ["All", "Campaign", "Digital Experience", "Brand Film", "Fashion", "Spatial Design", "Retail"];
const CLIENTS_MARQUEE = "Nike \u2014 Spotify \u2014 Porsche \u2014 Apple \u2014 Balenciaga \u2014 Aesop \u2014 ";

/* ── Intersection Observer Hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function MagneticCard({ project, index, visible, active }) {
  const cardRef = useRef(null);
  const cur = useRef({ rx: 0, ry: 0 });
  const tgt = useRef({ rx: 0, ry: 0 });
  const lightPos = useRef({ x: 50, y: 50 });
  const lightTgt = useRef({ x: 50, y: 50 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    tgt.current = {
      rx: ((r.height / 2 - y) / (r.height / 2)) * 12,
      ry: ((x - r.width / 2) / (r.width / 2)) * 12,
    };
    lightTgt.current = { x: (x / r.width) * 100, y: (y / r.height) * 100 };
  }, []);

  useEffect(() => {
    function tick() {
      cur.current.rx += (tgt.current.rx - cur.current.rx) * 0.05;
      cur.current.ry += (tgt.current.ry - cur.current.ry) * 0.05;
      lightPos.current.x += (lightTgt.current.x - lightPos.current.x) * 0.08;
      lightPos.current.y += (lightTgt.current.y - lightPos.current.y) * 0.08;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg) ${hovered ? "translateZ(40px) scale(1.03)" : "translateZ(0) scale(1)"}`;
        const light = cardRef.current.querySelector("[data-light]");
        if (light) {
          light.style.background = `radial-gradient(circle at ${lightPos.current.x}% ${lightPos.current.y}%, rgba(255,255,255,${hovered ? 0.06 : 0}) 0%, transparent 60%)`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [hovered]);

  const show = active && visible;

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); tgt.current = { rx: 0, ry: 0 }; lightTgt.current = { x: 50, y: 50 }; }}
      style={{
        position: "relative", aspectRatio: "3 / 4", borderRadius: 14,
        overflow: "hidden", background: project.gradient,
        border: `1px solid ${hovered ? `${project.accent}30` : "rgba(255,255,255,0.04)"}`,
        cursor: "pointer", transformStyle: "preserve-3d",
        transition: "box-shadow 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.5s ease, opacity 0.6s ease, transform 0.6s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hovered ? `0 35px 70px -20px ${project.glow}` : "0 8px 30px -10px rgba(0,0,0,0.4)",
        willChange: "transform",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
      }}
    >
      {/* Light reflection */}
      <div data-light style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
        transition: "opacity 0.3s",
      }} />

      {/* Oversized letter with glow */}
      <span style={{
        position: "absolute", top: "46%", left: "50%", transform: "translate(-50%, -50%)",
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(120px, 16vw, 220px)", color: "rgba(255,255,255,0.02)",
        textShadow: hovered ? `0 0 60px ${project.glow}` : "none",
        userSelect: "none", pointerEvents: "none", lineHeight: 1,
        transition: "text-shadow 0.5s ease, color 0.5s ease",
      }}>{project.letter}</span>

      {/* Scan lines + grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
        opacity: hovered ? 0.7 : 0.2, transition: "opacity 0.5s",
      }} />

      {/* Hover top highlight */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
      }} />

      {/* Top-right index */}
      <span style={{
        position: "absolute", top: 18, right: 20,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em",
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Bottom info */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "48px 22px 22px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", marginBottom: 8,
        }}>
          {project.tag} &mdash; {project.year}
        </div>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: 20, color: "#fff", letterSpacing: "-0.02em",
        }}>
          {project.name}
        </h3>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.3)", marginTop: 4,
          opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        }}>
          {project.role}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          color: project.accent, marginTop: 8,
          opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1) 0.05s",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          View project <span style={{ fontSize: 14 }}>&rarr;</span>
        </div>
      </div>
    </div>
  );
}

export default function DesignInspo3() {
  const gridRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const curParallax = useRef({ x: 0, y: 0, r: 0 });
  const raf = useRef(null);
  const [entered, setEntered] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [tokyoTime, setTokyoTime] = useState("");

  const [approachRef, approachVisible] = useReveal(0.15);
  const [galleryRef, galleryVisible] = useReveal(0.1);
  const [stillsRef, stillsVisible] = useReveal(0.15);
  const [awardsRef, awardsVisible] = useReveal(0.15);
  const [ctaRef, ctaVisible] = useReveal(0.15);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Live Tokyo clock
  useEffect(() => {
    function update() {
      const now = new Date();
      const tokyo = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo", hour12: false }).format(now);
      setTokyoTime(tokyo);
    }
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Grid parallax
  useEffect(() => {
    function onMove(e) {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      mouseRef.current = {
        x: ((e.clientX - cx) / cx) * 10,
        y: ((e.clientY - cy) / cy) * 10,
      };
    }
    function tick() {
      curParallax.current.x += (mouseRef.current.x - curParallax.current.x) * 0.025;
      curParallax.current.y += (mouseRef.current.y - curParallax.current.y) * 0.025;
      const r = (mouseRef.current.x * 0.08);
      curParallax.current.r += (r - curParallax.current.r) * 0.02;
      if (gridRef.current) {
        gridRef.current.style.transform = `translate(${curParallax.current.x}px, ${curParallax.current.y}px) rotate(${curParallax.current.r}deg)`;
      }
      raf.current = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  const bg = "#0a0a0a";
  const light = "#e8e6e3";
  const acid = "#b8f03e";
  const dim = "rgba(232,230,227,0.3)";

  const filteredProjects = activeFilter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tag === activeFilter);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={{ minHeight: "100vh", background: bg, color: light }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.1s",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Ren Ishikawa
        </span>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.15)", letterSpacing: "0.04em" }}>
            Tokyo — {tokyoTime}
          </span>
          {["Index", "Info", "Contact"].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: dim,
              textDecoration: "none", transition: "color 0.3s", position: "relative",
              paddingBottom: 2,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = light; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = dim; }}
            >{item}</a>
          ))}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: acid, letterSpacing: "0.06em",
            padding: "6px 14px", border: `1px solid ${acid}40`, borderRadius: 100,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 3, background: acid,
              animation: "pulse 2s ease-in-out infinite",
            }} />
            Available
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: "clamp(140px, 18vh, 200px) 48px 40px",
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(48px, 10vw, 140px)", lineHeight: 0.92,
          letterSpacing: "-0.05em", maxWidth: "12ch",
        }}>
          Creative<br />Director<span style={{ color: acid }}>.</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(232,230,227,0.15)",
          marginTop: 12, letterSpacing: "0.02em",
        }}>Based in Tokyo</p>

        {/* Animated divider */}
        <div style={{
          width: entered ? 60 : 0, height: 1, background: "rgba(255,255,255,0.08)",
          marginTop: 28, transition: "width 1s cubic-bezier(0.23,1,0.32,1) 0.6s",
        }} />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginTop: 24, flexWrap: "wrap", gap: 20,
          opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, color: dim,
            maxWidth: 440, lineHeight: 1.7,
          }}>
            Multidisciplinary director working across brand, film, digital, and spatial design for global clients.
          </p>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "rgba(232,230,227,0.12)", letterSpacing: "0.08em",
          }}>
            Tokyo — London — Remote
          </span>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "0 48px" }} />

      {/* ── Approach ── */}
      <section ref={approachRef} style={{ padding: "80px 48px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: acid, display: "block", marginBottom: 40,
        }}>Approach</span>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
          maxWidth: 1000, margin: "0 auto",
        }}>
          {APPROACH.map((a, i) => (
            <div key={a.num} style={{
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
              paddingLeft: i > 0 ? 32 : 0, paddingRight: 32,
              opacity: approachVisible ? 1 : 0,
              transform: approachVisible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.12}s`,
            }}>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42,
                color: "rgba(255,255,255,0.03)", display: "block", lineHeight: 1, marginBottom: 16,
              }}>{a.num}</span>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20,
                letterSpacing: "-0.02em", marginBottom: 10,
              }}>{a.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7, color: dim,
              }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Work heading + filter ── */}
      <section style={{ padding: "60px 48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em",
          }}>Selected Work</h2>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(232,230,227,0.15)",
          }}>{filteredProjects.length} projects</span>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 8 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: activeFilter === cat ? light : "rgba(232,230,227,0.25)",
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 0", position: "relative",
              transition: "color 0.3s",
              borderBottom: activeFilter === cat ? `1px solid ${acid}` : "1px solid transparent",
            }}>{cat}</button>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section ref={galleryRef} style={{ padding: "0 48px 80px" }}>
        <div ref={gridRef} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(14px, 1.8vw, 28px)", maxWidth: 1200, margin: "0 auto",
          willChange: "transform",
        }}>
          {PROJECTS.map((p, i) => {
            const active = activeFilter === "All" || p.tag === activeFilter;
            return (
              <div key={i} style={{
                transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${0.05 * i}s`,
                marginTop: i % 3 === 1 ? 40 : 0,
              }}>
                <MagneticCard project={p} index={i} visible={galleryVisible} active={active} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Selected Stills ── */}
      <section ref={stillsRef} style={{
        padding: "60px 0 80px", borderTop: "1px solid rgba(255,255,255,0.03)",
        opacity: stillsVisible ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        <div style={{ padding: "0 48px", marginBottom: 28 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,230,227,0.15)",
          }}>Selected Stills</span>
        </div>
        <div style={{
          display: "flex", gap: 16, overflowX: "auto", padding: "0 48px 16px",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}>
          {STILLS.map((s, i) => (
            <div key={i} style={{
              minWidth: s.w, height: s.h, borderRadius: 10, background: s.bg,
              border: "1px solid rgba(255,255,255,0.03)", flexShrink: 0,
              scrollSnapAlign: "start",
              opacity: stillsVisible ? 1 : 0,
              transform: stillsVisible ? "translateX(0)" : "translateX(30px)",
              transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.06}s`,
            }} />
          ))}
        </div>
      </section>

      {/* ── Clients Marquee ── */}
      <div style={{
        padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          animation: "clientMarquee 30s linear infinite",
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 4vw, 48px)", color: "rgba(232,230,227,0.04)",
          letterSpacing: "-0.02em",
        }}>
          {Array(6).fill(CLIENTS_MARQUEE).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── Awards ── */}
      <section ref={awardsRef} style={{ padding: "80px 48px 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase", color: acid,
            }}>Recognition</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.12)",
            }}>{AWARDS.length} awards since 2023</span>
          </div>
          {AWARDS.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 20,
              padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.03)",
              opacity: awardsVisible ? 1 : 0,
              transform: awardsVisible ? "translateY(0)" : "translateY(10px)",
              transition: `all 0.5s cubic-bezier(0.23,1,0.32,1) ${i * 0.06}s`,
              cursor: "default",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "8px"; e.currentTarget.querySelector("span:last-child").style.color = light; }}
              onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.querySelector("span:last-child").style.color = dim; }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(232,230,227,0.15)", minWidth: 48 }}>{a.year}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.03)", transition: "background 0.3s" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: dim, transition: "color 0.3s" }}>{a.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{
        padding: "clamp(80px, 12vh, 140px) 48px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.8s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "-0.04em",
          marginBottom: 32, lineHeight: 1.0,
        }}>
          Let&apos;s create something<br />extraordinary<span style={{ color: acid }}>.</span>
        </h2>
        <a href="#" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 500,
          color: light, textDecoration: "none", display: "inline-block",
          transition: "color 0.4s ease",
          borderBottom: "1px solid rgba(232,230,227,0.1)",
          paddingBottom: 4,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = acid; e.currentTarget.style.borderColor = `${acid}40`; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = light; e.currentTarget.style.borderColor = "rgba(232,230,227,0.1)"; }}
        >
          ren@ishikawa.studio
        </a>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.15)" }}>or find me on</span>
          {["Instagram", "Behance", "Twitter"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(232,230,227,0.25)",
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = acid)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.25)")}
            >{s}</a>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(255,255,255,0.03)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.1)", letterSpacing: "0.06em" }}>
          &copy; 2025 Ren Ishikawa
        </span>
        <button onClick={scrollToTop} style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(232,230,227,0.1)", letterSpacing: "0.06em",
          background: "none", border: "none", cursor: "pointer",
          transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = acid)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.1)")}
        >Back to top &uarr;</button>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(232,230,227,0.1)", letterSpacing: "0.06em", transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = acid)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.1)")}
        >
          Built with Next.js — MalamasDevs
        </Link>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes clientMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
            margin: 0 auto !important;
          }
          div[style*="grid-template-columns: repeat(3, 1fr)"][style*="gap: 0"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
