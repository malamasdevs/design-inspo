import { Space_Grotesk, Syne, Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Design Inspo — MalamasDevs",
  description:
    "Open source website templates for creative portfolios and studios. Built with Next.js and GSAP.",
  metadataBase: new URL("https://malamasdevs.com"),
  openGraph: {
    title: "Design Inspo — MalamasDevs",
    description:
      "Open source website templates for creative portfolios and studios. Built with Next.js and GSAP.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
