import type { Metadata } from "next";
import { Oswald, Inter, Space_Mono } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LayoutTransition } from "@/components/layout/LayoutTransition";
import { SignalLineTransition } from "@/components/layout/SignalLineTransition";
import { Providers } from "@/components/providers/Providers";
import { Preloader } from "@/components/ui/Preloader";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fiber Guys — Fiber Jetting & Splicing Crews",
    template: "%s | Fiber Guys",
  },
  description:
    "Production-focused fiber jetting and precision splicing crews. Clean documentation, field-ready teams, closeout-ready results.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fiber Guys",
    title: "Fiber Guys — Fiber Jetting & Splicing Crews",
    description:
      "Production-focused fiber jetting and precision splicing crews. Clean documentation, field-ready teams, closeout-ready results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Fiber Guys",
              description:
                "Production-focused fiber jetting and precision splicing crews.",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://fiberguys.com",
              email: "info@fiberguys.com",
              areaServed: "US",
              serviceType: [
                "Fiber Optic Cable Jetting",
                "Fiber Optic Splicing",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${oswald.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-orange focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-mono"
          >
            Skip to content
          </a>
          <Preloader />
          <GrainOverlay />
          <CustomCursor />
          <SignalLineTransition />
          <SmoothScroll>
            <Nav />
            <LayoutTransition>
              {children}
            </LayoutTransition>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
