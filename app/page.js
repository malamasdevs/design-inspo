"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const demos = [
  {
    num: "01",
    name: "Atelier Lumiere",
    desc: "A minimal design studio. Warm cream palette, particle typography hero with curl-noise flow field, elegant project list.",
    href: "/flow-typography",
    strip: styles.strip1,
  },
  {
    num: "02",
    name: "Vantage",
    desc: "A venture studio. Dark editorial layout with scroll-driven stacked case studies, bold metrics, and animated counters.",
    href: "/stacked-reveal",
    strip: styles.strip2,
  },
  {
    num: "03",
    name: "Ren Ishikawa",
    desc: "A creative director portfolio. Bold type, 3D magnetic gallery with cursor-reactive lighting, experimental dark aesthetic.",
    href: "/magnetic-gallery",
    strip: styles.strip3,
  },
];

export default function Home() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 1s ease, transform 1s var(--ease-out-expo)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      card.style.opacity = "0";
      card.style.transform = "translateY(40px)";
      setTimeout(() => {
        card.style.transition = `opacity 0.8s ease ${0.1 + i * 0.12}s, transform 0.8s var(--ease-out-expo) ${0.1 + i * 0.12}s`;
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 300);
    });
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero} ref={heroRef}>
        <span className={styles.eyebrow}>Open Source</span>
        <h1 className={styles.title}>Design<br />Inspo</h1>
        <p className={styles.subtitle}>
          Three complete website templates for creative studios and portfolios. Fork, customize, ship. Built with Next.js and GSAP.
        </p>
      </header>

      <div className={styles.grid}>
        {demos.map((d, i) => (
          <Link
            key={d.num}
            href={d.href}
            className={styles.card}
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <span className={styles.arrow}>&nearr;</span>
            <span className={styles.cardNumber}>{d.num}</span>
            <h2 className={styles.cardName}>{d.name}</h2>
            <p className={styles.cardDesc}>{d.desc}</p>
            <div className={`${styles.gradientStrip} ${d.strip}`} />
          </Link>
        ))}
      </div>

      <span className={styles.stackLabel}>Next.js + GSAP + Canvas 2D</span>
      <p className={styles.watermark}>MalamasDevs</p>

      <div className={styles.footer}>
        <span>MIT License</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
