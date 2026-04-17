"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

const demos = [
  {
    num: "01",
    name: "Atelier Lumière",
    desc: "A minimal design studio. Warm cream palette, particle typography hero, elegant project list.",
    href: "/flow-typography",
    strip: styles.strip1,
  },
  {
    num: "02",
    name: "Vantage",
    desc: "A venture studio. Dark editorial, scroll-driven stacked case studies with bold metrics.",
    href: "/stacked-reveal",
    strip: styles.strip2,
  },
  {
    num: "03",
    name: "Ren Ishikawa",
    desc: "A creative director portfolio. Bold type, 3D magnetic gallery, experimental dark aesthetic.",
    href: "/magnetic-gallery",
    strip: styles.strip3,
  },
];

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s var(--ease-out-expo)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero} ref={heroRef}>
        <span className={styles.eyebrow}>Open Source</span>
        <h1 className={styles.title}>Design<br />Inspo</h1>
        <p className={styles.subtitle}>
          Full website templates for creative portfolios and studios. Fork, customize, ship. Built with Next.js and GSAP.
        </p>
      </header>

      <div className={styles.grid}>
        {demos.map((d) => (
          <Link key={d.num} href={d.href} className={styles.card}>
            <span className={styles.arrow}>&nearr;</span>
            <span className={styles.cardNumber}>{d.num}</span>
            <h2 className={styles.cardName}>{d.name}</h2>
            <p className={styles.cardDesc}>{d.desc}</p>
            <div className={`${styles.gradientStrip} ${d.strip}`} />
          </Link>
        ))}
      </div>

      <p className={styles.watermark}>MalamasDevs</p>
    </div>
  );
}
