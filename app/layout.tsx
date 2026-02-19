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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fiberguysllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Fiber Guys | Nationwide Fiber Jetting & Splicing",
    template: "%s | Fiber Guys",
  },
  description:
    "Production-grade fiber jetting and precision splicing crews for prime contractors. Up to 25K ft/day per crew. ≤0.03dB splice loss standard. Mobilize in 5–10 business days to all 50 states.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Fiber Guys LLC",
    title: "Fiber Guys | Nationwide Fiber Jetting & Splicing",
    description:
      "Production-grade fiber jetting and precision splicing crews for prime contractors. Up to 25K ft/day per crew. ≤0.03dB splice loss standard. Mobilize in 5–10 business days to all 50 states.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiber Guys | Nationwide Fiber Jetting & Splicing",
    description:
      "Production-grade fiber jetting and precision splicing crews. Up to 25K ft/day per crew. ≤0.03dB splice loss. Nationwide mobilization in 5–10 days.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
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
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://fiberguysllc.com",
              email: "info@fiberguysllc.com",
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
