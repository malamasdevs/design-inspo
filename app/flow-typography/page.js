"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/*
 * Design Inspo 1 — "Atelier Lumière"
 * A fictional design studio website inspired by aino.agency.
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

const TRAIL_LEN = 8;

/* ── Fictional work data ── */
const WORK = [
  { num: "01", name: "Ōra Skincare", tag: "Brand Identity", year: "2025" },
  { num: "02", name: "Voltera Energy", tag: "Web Experience", year: "2024" },
  { num: "03", name: "Maison Kenji", tag: "E-Commerce", year: "2024" },
  { num: "04", name: "Luma Architects", tag: "Digital Platform", year: "2023" },
];

export default function DesignInspo1() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

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
    const lines = ["Atelier", "Lumière"];
    const lh = fs * 1.08;
    const sy = h * 0.38 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => oc.fillText(l, w / 2, sy + i * lh));

    const img = oc.getImageData(0, 0, canvas.width, canvas.height);
    const px = img.data;
    const gap = 3;
    const particles = [];
    for (let y = 0; y < canvas.height; y += gap * dpr) {
      for (let x = 0; x < canvas.width; x += gap * dpr) {
        if (px[(y * canvas.width + x) * 4] > 128) {
          const pxv = x / dpr, pyv = y / dpr;
          particles.push({
            x: pxv, y: pyv, originX: pxv, originY: pyv,
            vx: 0, vy: 0, size: 1 + Math.random() * 1.8,
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
      const heroH = window.innerHeight * 0.75;
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

      // Cream-tinted clear for warm trail fade
      ctx.fillStyle = "rgba(245, 240, 232, 0.14)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const active = mouseRef.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (active) {
          const curl = curlNoise(p.x * 0.003, p.y * 0.003, t);
          p.vx += curl.x * 1.6; p.vy += curl.y * 1.6;
          const dx = p.x - mx, dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            const f = (140 - dist) / 140;
            p.vx += (dx / dist) * f * 2.2 + (-dy / dist) * f * 1;
            p.vy += (dy / dist) * f * 2.2 + (dx / dist) * f * 1;
          }
          p.vx *= 0.91; p.vy *= 0.91;
        } else {
          p.vx += (p.originX - p.x) * 0.065;
          p.vy += (p.originY - p.y) * 0.065;
          p.vx *= 0.82; p.vy *= 0.82;
          const mdx = p.x - mx, mdy = p.y - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 50 && md > 0) { const f = (50 - md) / 50; p.vx += (mdx / md) * f * 1.5; p.vy += (mdy / md) * f * 1.5; }
        }
        p.x += p.vx; p.y += p.vy;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        const odx = p.x - p.originX, ody = p.y - p.originY;
        const disp = Math.min(1, Math.sqrt(odx * odx + ody * ody) / 180);
        // Warm palette: shifts from amber to copper when displaced
        const hue = lerp(p.hue, 15, disp);
        const sat = lerp(30, 65, disp);
        const light = lerp(p.lightness, 55, disp);
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const r = p.size * (1 + Math.min(1.3, spd * 0.35) * disp);

        if (p.trail.length > 2 && disp > 0.1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j].x, p.trail[j].y);
          ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${disp * 0.25})`;
          ctx.lineWidth = r * 0.5; ctx.lineCap = "round"; ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        // Dark particles on light canvas
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${25 + disp * 15}%, ${0.8 - disp * 0.1})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }
    // Initial fill with cream
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

  return (
    <div style={{ background: cream, color: charcoal, minHeight: "100vh" }}>
      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "28px 48px", background: "rgba(245,240,232,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(26,26,26,0.06)",
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.23,1,0.32,1) 0.1s",
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
          Atelier Lumière
        </span>
        <div style={{ display: "flex", gap: 36 }}>
          {["Work", "Studio", "Journal", "Contact"].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
              color: dim, textDecoration: "none", transition: "color 0.3s",
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
            }}>Atelier<br />Lumière</h1>
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
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "rgba(26,26,26,0.2)", letterSpacing: "0.08em",
          }}>
            Scroll to explore
          </span>
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
            color: "rgba(26,26,26,0.25)", letterSpacing: "0.06em",
          }}>2023 — 2025</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {WORK.map((w, i) => (
            <a key={w.num} href="#" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "28px 0", borderTop: "1px solid rgba(26,26,26,0.06)",
              textDecoration: "none", color: charcoal,
              transition: "padding-left 0.5s cubic-bezier(0.23,1,0.32,1)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "16px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em", minWidth: 28,
                }}>{w.num}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: "clamp(20px, 3vw, 32px)", letterSpacing: "-0.02em",
                }}>{w.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 14, color: dim,
                }}>{w.tag}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  color: "rgba(26,26,26,0.2)",
                }}>({w.year})</span>
                <span style={{ fontSize: 18, color: "rgba(26,26,26,0.2)", transition: "color 0.3s" }}>&rarr;</span>
              </div>
            </a>
          ))}
          <div style={{ borderTop: "1px solid rgba(26,26,26,0.06)" }} />
        </div>
      </section>

      {/* ── About ── */}
      <section style={{ padding: "80px 48px 100px", background: charcoal, color: cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
            display: "block", marginBottom: 32,
          }}>About the studio</span>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: "clamp(24px, 4vw, 44px)", lineHeight: 1.35,
            letterSpacing: "-0.01em", marginBottom: 40,
          }}>
            We believe design is restraint. Every element earns its place. Every interaction respects the user&apos;s time. We work with a small number of clients each year — deeply, not broadly.
          </p>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            {[
              { n: "12", l: "Projects yearly" },
              { n: "6", l: "Team members" },
              { n: "8", l: "Years running" },
            ].map((s) => (
              <div key={s.l}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, display: "block" }}>{s.n}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(245,240,232,0.4)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section style={{
        padding: "100px 48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: "0.12em", textTransform: "uppercase", color: copper,
          marginBottom: 24,
        }}>New project?</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-0.02em",
          marginBottom: 32, maxWidth: "16ch",
        }}>
          Let&apos;s make something beautiful.
        </h2>
        <a href="#" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
          color: charcoal, padding: "14px 36px", border: `1px solid rgba(26,26,26,0.15)`,
          borderRadius: 100, transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = charcoal; e.currentTarget.style.color = cream; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = charcoal; }}
        >
          hello@atelierlumiere.com
        </a>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 48px", borderTop: "1px solid rgba(26,26,26,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em" }}>
          &copy; 2025 Atelier Lumière
        </span>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "rgba(26,26,26,0.2)", letterSpacing: "0.06em",
          transition: "color 0.3s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = copper)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,26,26,0.2)")}
        >
          MalamasDevs Design Inspo 1
        </Link>
      </footer>
    </div>
  );
}
