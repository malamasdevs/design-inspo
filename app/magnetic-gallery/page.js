"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/*
 * Design Inspo 3 — "Ren Ishikawa"
 * A fictional creative director portfolio. Inspired by chkstepan.com.
 * Dark, bold, experimental hover effects, massive type.
 */

const PROJECTS = [
  {
    name: "Nike Air Max",
    tag: "Campaign",
    year: "2025",
    role: "Creative Direction",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 40%, #2d1b4e 100%)",
    letter: "N",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    name: "Spotify Wrapped",
    tag: "Digital Experience",
    year: "2024",
    role: "Art Direction",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1e3a2f 40%, #0d503a 100%)",
    letter: "S",
    glow: "rgba(52,211,153,0.3)",
  },
  {
    name: "Porsche Taycan",
    tag: "Brand Film",
    year: "2024",
    role: "Direction & Edit",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #2a1a1a 40%, #4a1c1c 100%)",
    letter: "P",
    glow: "rgba(248,113,113,0.3)",
  },
  {
    name: "Apple Vision",
    tag: "Spatial Design",
    year: "2024",
    role: "Interaction Design",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 40%, #1e3a5f 100%)",
    letter: "A",
    glow: "rgba(96,165,250,0.3)",
  },
  {
    name: "Balenciaga SS25",
    tag: "Fashion",
    year: "2023",
    role: "Set Design",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #2d2418 40%, #4a3520 100%)",
    letter: "B",
    glow: "rgba(251,191,36,0.25)",
  },
  {
    name: "Aesop Interiors",
    tag: "Retail",
    year: "2023",
    role: "Spatial & Digital",
    gradient: "linear-gradient(145deg, #0a0a0a 0%, #1f1f1f 40%, #2a2a2a 100%)",
    letter: "A",
    glow: "rgba(200,200,200,0.2)",
  },
];

function MagneticCard({ project, index }) {
  const cardRef = useRef(null);
  const cur = useRef({ rx: 0, ry: 0 });
  const tgt = useRef({ rx: 0, ry: 0 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    tgt.current = { rx: ((r.height / 2 - y) / (r.height / 2)) * 14, ry: ((x - r.width / 2) / (r.width / 2)) * 14 };
  }, []);

  useEffect(() => {
    function tick() {
      cur.current.rx += (tgt.current.rx - cur.current.rx) * 0.07;
      cur.current.ry += (tgt.current.ry - cur.current.ry) * 0.07;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg) ${hovered ? "translateZ(50px) scale(1.04)" : "translateZ(0) scale(1)"}`;
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); tgt.current = { rx: 0, ry: 0 }; }}
      style={{
        position: "relative", aspectRatio: "3 / 4", borderRadius: 14,
        overflow: "hidden", background: project.gradient,
        border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
        transformStyle: "preserve-3d",
        transition: "box-shadow 0.5s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hovered ? `0 35px 70px -20px ${project.glow}` : "0 8px 30px -10px rgba(0,0,0,0.4)",
        willChange: "transform",
      }}
    >
      {/* Oversized letter */}
      <span style={{
        position: "absolute", top: "48%", left: "50%", transform: "translate(-50%, -50%)",
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(140px, 18vw, 260px)", color: "rgba(255,255,255,0.025)",
        userSelect: "none", pointerEvents: "none", lineHeight: 1,
      }}>{project.letter}</span>

      {/* Scan lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        opacity: hovered ? 0.6 : 0.2, transition: "opacity 0.5s",
      }} />

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 40%)",
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
        padding: "48px 22px 22px", background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
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
      </div>
    </div>
  );
}

export default function DesignInspo3() {
  const gridRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const curParallax = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    function onMove(e) {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      mouseRef.current = { x: ((e.clientX - cx) / cx) * 12, y: ((e.clientY - cy) / cy) * 12 };
    }
    function tick() {
      curParallax.current.x += (mouseRef.current.x - curParallax.current.x) * 0.035;
      curParallax.current.y += (mouseRef.current.y - curParallax.current.y) * 0.035;
      if (gridRef.current) gridRef.current.style.transform = `translate(${curParallax.current.x}px, ${curParallax.current.y}px)`;
      raf.current = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => { clearTimeout(timer); window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  const bg = "#0a0a0a";
  const light = "#e8e6e3";
  const acid = "#b8f03e";
  const dim = "rgba(232,230,227,0.3)";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: light }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", background: "rgba(10,10,10,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.1s",
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Ren Ishikawa
        </span>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Index", "Info", "Contact"].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: dim,
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = light)}
              onMouseLeave={(e) => (e.currentTarget.style.color = dim)}
            >{item}</a>
          ))}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: acid, letterSpacing: "0.06em",
            padding: "6px 14px", border: `1px solid ${acid}40`, borderRadius: 100,
          }}>
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
          fontSize: "clamp(48px, 10vw, 140px)", lineHeight: 0.95,
          letterSpacing: "-0.05em", maxWidth: "12ch",
        }}>
          Creative<br />Director<span style={{ color: acid }}>.</span>
        </h1>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginTop: 32, flexWrap: "wrap", gap: 20,
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, color: dim,
            maxWidth: 400, lineHeight: 1.7,
          }}>
            Multidisciplinary director working across brand, film, digital, and spatial design for global clients.
          </p>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "rgba(232,230,227,0.15)", letterSpacing: "0.08em",
          }}>
            Tokyo — London — Remote
          </span>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "0 48px" }} />

      {/* ── Work heading ── */}
      <section style={{ padding: "60px 48px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em",
          }}>Selected Work</h2>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(232,230,227,0.15)",
          }}>6 projects</span>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ padding: "0 48px 80px" }}>
        <div ref={gridRef} style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(14px, 1.8vw, 28px)", maxWidth: 1200, margin: "0 auto",
          willChange: "transform",
        }}>
          {PROJECTS.map((p, i) => (
            <div key={i} style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(50px)",
              transition: `all 0.9s cubic-bezier(0.23,1,0.32,1) ${0.15 + i * 0.06}s`,
            }}>
              <MagneticCard project={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Info section ── */}
      <section style={{ padding: "80px 48px 100px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: acid, display: "block", marginBottom: 20,
            }}>Recognition</span>
            {["Cannes Lions Gold — 2024", "D&AD Yellow Pencil — 2024", "FWA Site of the Year — 2023", "ADC Annual Awards — 2023"].map((a) => (
              <p key={a} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, color: dim,
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}>{a}</p>
            ))}
          </div>
          <div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: acid, display: "block", marginBottom: 20,
            }}>Clients</span>
            {["Nike", "Spotify", "Porsche", "Apple", "Balenciaga", "Aesop"].map((c) => (
              <p key={c} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, color: dim,
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}>{c}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 48px 100px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "-0.04em",
          marginBottom: 28,
        }}>
          Let&apos;s work<span style={{ color: acid }}>.</span>
        </h2>
        <a href="#" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
          color: acid, padding: "14px 36px",
          border: `1px solid ${acid}40`, borderRadius: 100,
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${acid}12`; e.currentTarget.style.borderColor = `${acid}80`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${acid}40`; }}
        >
          ren@ishikawa.studio
        </a>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(255,255,255,0.03)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(232,230,227,0.12)", letterSpacing: "0.06em" }}>
          &copy; 2025 Ren Ishikawa
        </span>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(232,230,227,0.12)", letterSpacing: "0.06em", transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = acid)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,230,227,0.12)")}
        >
          MalamasDevs Design Inspo 3
        </Link>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
            margin: 0 auto !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
