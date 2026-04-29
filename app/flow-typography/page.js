"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/*
 * Design Inspo 1 — "Atelier Lumiere"
 * A fictional design studio website.
 * Minimal, warm cream palette, elegant reveals, particle hero.
 */

/* ── Perlin Noise ── */
const PERM = new Uint8Array(512);
const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
(function(){const p=[];for(let i=0;i<256;i++)p[i]=i;for(let i=255;i>0;i--){const j=(Math.random()*(i+1))|0;[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++)PERM[i]=p[i&255];})();
function fade(t){return t*t*t*(t*(t*6-15)+10);}
function lerp(a,b,t){return a+t*(b-a);}
function dot2(g,x,y){return g[0]*x+g[1]*y;}
function perlin2(x,y){const xi=Math.floor(x)&255,yi=Math.floor(y)&255;const xf=x-Math.floor(x),yf=y-Math.floor(y);const u=fade(xf),v=fade(yf);const aa=PERM[PERM[xi]+yi],ab=PERM[PERM[xi]+yi+1];const ba=PERM[PERM[xi+1]+yi],bb=PERM[PERM[xi+1]+yi+1];return lerp(lerp(dot2(GRAD[aa&7],xf,yf),dot2(GRAD[ba&7],xf-1,yf),u),lerp(dot2(GRAD[ab&7],xf,yf-1),dot2(GRAD[bb&7],xf-1,yf-1),u),v);}
function curlNoise(x,y,t){const e=0.01;return{x:(perlin2(x,y+e+t)-perlin2(x,y-e+t))/(2*e),y:-(perlin2(x+e,y+t)-perlin2(x-e,y+t))/(2*e)};}

const TRAIL_LEN = 10;

/* ── Fictional work data ── */
const WORK = [
  { num: "01", name: "Ora Skincare", tag: "Brand Identity", year: "2025", color: "#c9956b" },
  { num: "02", name: "Voltera Energy", tag: "Web Experience", year: "2025", color: "#7da87d" },
  { num: "03", name: "Maison Kenji", tag: "E-Commerce", year: "2024", color: "#b89472" },
  { num: "04", name: "Luma Architects", tag: "Digital Platform", year: "2024", color: "#8a9bb5" },
  { num: "05", name: "Nomi Health", tag: "Product Design", year: "2023", color: "#a688b0" },
  { num: "06", name: "Campo Wines", tag: "Art Direction", year: "2023", color: "#c4a35a" },
];

const PROCESS = [
  { num: "01", title: "Discover", desc: "Research, interviews, and audits to understand context and opportunity." },
  { num: "02", title: "Define", desc: "Strategy, positioning, and a clear creative brief to align on vision." },
  { num: "03", title: "Design", desc: "Iterative design from concept to polished, pixel-perfect deliverables." },
  { num: "04", title: "Deliver", desc: "Development, launch, and ongoing refinement as the work meets the world." },
];

const PRINCIPLES = [
  { title: "Restraint over excess", desc: "Every element earns its place. Nothing decorative, everything intentional." },
  { title: "Craft in the details", desc: "The difference between good and great lives in the margins, the curves, the timing." },
  { title: "Time well spent", desc: "Fewer clients, deeper partnerships. We measure success by lasting impact, not volume." },
];

const TAGLINES = [
  "We design with restraint.",
  "Every detail is intentional.",
  "Craft over convention.",
];

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

function WorkRow({ w, i }) {
  const [hovered, setHovered] = useState(false);
  const [rowRef, visible] = useReveal(0.1);

  return (
    <a
      ref={rowRef}
      href="#"
      style={{
        display: "grid", gridTemplateColumns: "32px 1fr auto", alignItems: "center",
        gap: 28, padding: "24px 0", borderTop: "1px solid rgba(26,26,26,0.06)",
        textDecoration: "none", color: "#1a1a1a", position: "relative",
        transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        paddingLeft: hovered ? 16 : 0,
        background: hovered ? `${w.color}08` : "transparent",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: hovered ? w.color : "rgba(26,26,26,0.2)", letterSpacing: "0.06em",
        transition: "color 0.4s ease",
      }}>{w.num}</span>
      <div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: "clamp(20px, 3vw, 32px)", letterSpacing: "-0.02em",
          display: "block",
        }}>{w.name}</span>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(26,26,26,0.35)",
          maxHeight: hovered ? 40 : 0, opacity: hovered ? 1 : 0, overflow: "hidden",
          transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)", display: "block", marginTop: hovered ? 6 : 0,
        }}>{w.tag} — A deep collaboration focused on elevating every touchpoint.</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(26,26,26,0.35)",
        }}>{w.tag}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(26,26,26,0.2)",
        }}>({w.year})</span>
        <span style={{
          fontSize: 18, color: hovered ? w.color : "rgba(26,26,26,0.15)",
          transition: "all 0.4s ease",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          display: "inline-block",
        }}>&rarr;</span>
      </div>
    </a>
  );
}

export default function DesignInspo1() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [entered, setEntered] = useState(false);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [taglineFade, setTaglineFade] = useState(true);

  const [processRef, processVisible] = useReveal(0.2);
  const [aboutRef, aboutVisible] = useReveal(0.15);
  const [principlesRef, principlesVisible] = useReveal(0.15);
  const [ctaRef, ctaVisible] = useReveal(0.2);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineFade(false);
      setTimeout(() => {
        setTaglineIdx((i) => (i + 1) % TAGLINES.length);
        setTaglineFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const initParticles = useCallback((canvas) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const off = document.createElement("canvas");
    off.width = canvas.width; off.height = canvas.height;
    const oc = off.getContext("2d");
    oc.scale(dpr, dpr);

    const fs = Math.min(w * 0.11, 140);
    oc.fillStyle = "#fff";
    oc.font = `800 ${fs}px Syne, sans-serif`;
    oc.textAlign = "center";
    oc.textBaseline = "middle";
    const lines = ["Atelier", "Lumiere"];
    const lh = fs * 1.08;
    const sy = h * 0.38 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => oc.fillText(l, w / 2, sy + i * lh));

    const img = oc.getImageData(0, 0, canvas.width, canvas.height);
    const px = img.data;
    const gap = 2.5;
    const particles = [];
    for (let y = 0; y < canvas.height; y += gap * dpr) {
      for (let x = 0; x < canvas.width; x += gap * dpr) {
        if (px[(y * canvas.width + x) * 4] > 128) {
          const pxv = x / dpr, pyv = y / dpr;
          particles.push({
            x: pxv, y: pyv, originX: pxv, originY: pyv,
            vx: 0, vy: 0, size: 0.8 + Math.random() * 1.4,
            hue: 35 + Math.random() * 20,
            lightness: 75 + Math.random() * 20,
            trail: [], phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
    setIsMobile(mobile);
    if (mobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const heroH = window.innerHeight * 0.78;
      canvas.width = window.innerWidth * dpr;
      canvas.height = heroH * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = heroH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(canvas);
    }

    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e) {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      mouseRef.current.active = e.clientY < r.bottom && e.clientY > r.top;
    }
    function onMouseLeave() { mouseRef.current.active = false; mouseRef.current.x = -9999; }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function animate() {
      const w = canvas.width / dpr, h = canvas.height / dpr;
      timeRef.current += 0.003;
      const t = timeRef.current;

      ctx.fillStyle = "rgba(245, 240, 232, 0.12)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const active = mouseRef.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient drift even when mouse isn't active
        const ambient = curlNoise(p.originX * 0.001, p.originY * 0.001, t * 0.5);

        if (active) {
          const curl = curlNoise(p.x * 0.003, p.y * 0.003, t);
          p.vx += curl.x * 1.8; p.vy += curl.y * 1.8;
          const dx = p.x - mx, dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 1) {
            const f = (160 - dist) / 160;
            const ff = f * f;
            p.vx += (dx / dist) * ff * 3 + (-dy / dist) * ff * 1.2;
            p.vy += (dy / dist) * ff * 3 + (dx / dist) * ff * 1.2;
          }
          p.vx *= 0.90; p.vy *= 0.90;
        } else {
          // Spring return with slight overshoot
          const sx = p.originX - p.x + ambient.x * 0.3;
          const sy = p.originY - p.y + ambient.y * 0.3;
          p.vx += sx * 0.055;
          p.vy += sy * 0.055;
          p.vx *= 0.85; p.vy *= 0.85;
          const mdx = p.x - mx, mdy = p.y - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 50 && md > 0) { const f = (50 - md) / 50; p.vx += (mdx / md) * f * 1.5; p.vy += (mdy / md) * f * 1.5; }
        }
        p.x += p.vx; p.y += p.vy;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        const odx = p.x - p.originX, ody = p.y - p.originY;
        const disp = Math.min(1, Math.sqrt(odx * odx + ody * ody) / 200);
        const hue = lerp(p.hue, 15, disp);
        const sat = lerp(30, 70, disp);
        const light = lerp(p.lightness, 50, disp);
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const r = p.size * (1 + Math.min(1.5, spd * 0.4) * disp);

        // Smooth quadratic trail
        if (p.trail.length > 2 && disp > 0.08) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length - 1; j++) {
            const cx = (p.trail[j].x + p.trail[j + 1].x) / 2;
            const cy = (p.trail[j].y + p.trail[j + 1].y) / 2;
            ctx.quadraticCurveTo(p.trail[j].x, p.trail[j].y, cx, cy);
          }
          ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${disp * 0.2})`;
          ctx.lineWidth = r * 0.6; ctx.lineCap = "round"; ctx.stroke();
        }

        // Glow for displaced particles
        if (disp > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${disp * 0.03})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${22 + disp * 18}%, ${0.85 - disp * 0.1})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }
    ctx.fillStyle = "rgba(245, 240, 232, 1)";
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initParticles, isMobile]);

  const cream = "#f5f0e8";
  const charcoal = "#1a1a1a";
  const copper = "#b8845a";
  const dim = "rgba(26,26,26,0.35)";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={{ background: cream, color: charcoal, minHeight: "100vh" }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 48px", background: "rgba(245,240,232,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(26,26,26,0.04)",
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: charcoal,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontSize: 11, fontWeight: 700, color: cream,
            letterSpacing: "-0.02em",
          }}>AL</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>
            Atelier Lumiere
          </span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Work", "Process", "Studio", "Contact"].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
              color: dim, textDecoration: "none", transition: "color 0.3s",
              position: "relative",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = charcoal)}
              onMouseLeave={(e) => (e.currentTarget.style.color = dim)}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero with particle canvas ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {!isMobile && <canvas ref={canvasRef} style={{ display: "block", width: "100%", background: cream }} />}
        {isMobile && (
          <div style={{
            height: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", padding: "100px 24px 0",
          }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(48px, 14vw, 100px)", lineHeight: 1.0,
              letterSpacing: "-0.04em", textAlign: "center",
            }}>Atelier<br />Lumiere</h1>
          </div>
        )}

        {/* Subtitle below canvas */}
        <div style={{
          padding: "40px 48px 60px", display: "flex",
          justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24,
          opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "all 1s cubic-bezier(0.23,1,0.32,1) 0.4s",
        }}>
          <div style={{ maxWidth: 440 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
              display: "block", marginBottom: 14,
            }}>Design Studio — Paris & Athens</span>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.7, color: dim,
            }}>
              We design brands, digital products, and experiences for companies that value craft over convention.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15,
              color: "rgba(26,26,26,0.3)", minHeight: 24,
              opacity: taglineFade ? 1 : 0,
              transform: taglineFade ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.4s ease",
            }}>{TAGLINES[taglineIdx]}</p>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: "rgba(26,26,26,0.15)", letterSpacing: "0.08em",
              display: "block", marginTop: 8,
            }}>
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "rgba(26,26,26,0.06)", margin: "0 48px" }} />

      {/* ── Selected Work ── */}
      <section style={{ padding: "80px 48px 100px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 60, flexWrap: "wrap", gap: 16,
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.02em",
          }}>Selected Work</h2>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em",
          }}>2023 — 2025</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {WORK.map((w, i) => <WorkRow key={w.num} w={w} i={i} />)}
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)" }} />
        </div>
      </section>

      {/* ── Process ── */}
      <section ref={processRef} style={{
        padding: "80px 48px 100px", borderTop: "1px solid rgba(26,26,26,0.06)",
        borderBottom: "1px solid rgba(26,26,26,0.06)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
          display: "block", marginBottom: 48,
        }}>Our Process</span>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40,
        }}>
          {PROCESS.map((s, i) => (
            <div key={s.num} style={{
              opacity: processVisible ? 1 : 0,
              transform: processVisible ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s`,
              borderLeft: "1px solid rgba(26,26,26,0.08)", paddingLeft: 24,
            }}>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36,
                color: "rgba(26,26,26,0.06)", display: "block", lineHeight: 1, marginBottom: 16,
              }}>{s.num}</span>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20,
                letterSpacing: "-0.02em", marginBottom: 10,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7, color: dim,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section ref={aboutRef} style={{
        padding: "100px 48px 100px", background: charcoal, color: cream,
        opacity: aboutVisible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
            display: "block", marginBottom: 32,
          }}>About the studio</span>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: "italic",
            fontSize: "clamp(24px, 4vw, 48px)", lineHeight: 1.3,
            letterSpacing: "-0.01em", marginBottom: 20,
          }}>
            &ldquo;Design is restraint.&rdquo;
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.8, color: "rgba(245,240,232,0.5)", marginBottom: 48, maxWidth: 680,
          }}>
            Every element earns its place. Every interaction respects the user&apos;s time.
            We work with a small number of clients each year — deeply, not broadly.
            From Athens to Paris, we bring Mediterranean warmth to digital craft.
          </p>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 60 }}>
            {[
              { n: "12", l: "Projects yearly" },
              { n: "6", l: "Team members" },
              { n: "8", l: "Years running" },
            ].map((s, i) => (
              <div key={s.l} style={{
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? "translateY(0)" : "translateY(16px)",
                transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${0.2 + i * 0.1}s`,
              }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40, display: "block" }}>{s.n}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(245,240,232,0.35)" }}>{s.l}</span>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div ref={principlesRef} style={{ borderTop: "1px solid rgba(245,240,232,0.06)", paddingTop: 48 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
              display: "block", marginBottom: 32,
            }}>Principles</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
              {PRINCIPLES.map((p, i) => (
                <div key={p.title} style={{
                  opacity: principlesVisible ? 1 : 0,
                  transform: principlesVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 0.12}s`,
                }}>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18,
                    letterSpacing: "-0.02em", marginBottom: 10,
                  }}>{p.title}</h3>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7,
                    color: "rgba(245,240,232,0.4)",
                  }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section ref={ctaRef} style={{
        padding: "100px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.8s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
          marginBottom: 24,
        }}>New project?</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.02em",
          marginBottom: 36, maxWidth: "16ch",
        }}>
          Let&apos;s make something beautiful.
        </h2>
        <a href="#" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 500,
          color: charcoal, padding: "16px 40px", border: `1px solid rgba(26,26,26,0.12)`,
          borderRadius: 100, transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          display: "inline-block",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = charcoal; e.currentTarget.style.color = cream; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = charcoal; }}
        >
          hello@atelierlumiere.com
        </a>
        <div style={{ display: "flex", gap: 32, marginTop: 32 }}>
          {["Instagram", "Behance", "LinkedIn"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(26,26,26,0.25)",
              textDecoration: "none", transition: "color 0.3s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = charcoal)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,26,26,0.25)")}
            >{s}</a>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(26,26,26,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em" }}>
          &copy; 2025 Atelier Lumiere
        </span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button onClick={scrollToTop} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em",
            background: "none", border: "none", cursor: "pointer",
            transition: "color 0.3s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = copper)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,26,26,0.2)")}
          >
            Back to top &uarr;
          </button>
          <Link href="/" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em",
            transition: "color 0.3s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = copper)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,26,26,0.2)")}
          >
            MalamasDevs Design Inspo
          </Link>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
