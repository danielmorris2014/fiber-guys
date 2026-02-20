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
    default: "Fiber Guys LLC | Nationwide Fiber Jetting & Splicing",
    template: "%s | Fiber Guys LLC",
  },
  description:
    "Fiber Guys LLC provides production-grade fiber optic jetting and precision fusion splicing crews to prime contractors nationwide. 12–864ct cable placement up to 25,000 ft/day. Sub-0.05dB average splice loss. OTDR-verified documentation and closeout-ready deliverables. Mobilize crews in 5–10 business days to all 50 states.",
  keywords: [
    "fiber optic jetting",
    "fiber splicing contractor",
    "fusion splicing crew",
    "fiber cable placement",
    "OSP fiber contractor",
    "fiber optic construction",
    "FTTH jetting",
    "conduit fiber placement",
    "OTDR testing",
    "fiber optic subcontractor",
    "nationwide fiber crew",
    "splice loss documentation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Fiber Guys LLC",
    title: "Fiber Guys LLC | Nationwide Fiber Jetting & Splicing",
    description:
      "Production-grade fiber optic jetting and precision fusion splicing for prime contractors. 12–864ct placement, sub-0.05dB splice loss, OTDR-verified documentation. Crews mobilize nationwide in 5–10 business days.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Fiber Guys LLC — Nationwide Fiber Jetting & Precision Splicing Crews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiber Guys LLC | Nationwide Fiber Jetting & Splicing",
    description:
      "Production-grade fiber jetting and fusion splicing crews for prime contractors. Up to 25K ft/day, sub-0.05dB splice loss. Nationwide mobilization in 5–10 days.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${BASE_URL}/#organization`,
                  name: "Fiber Guys LLC",
                  legalName: "Fiber Guys LLC",
                  url: BASE_URL,
                  email: "info@fiberguysllc.com",
                  description:
                    "Production-grade fiber optic jetting and precision fusion splicing crews serving prime contractors nationwide. Specializing in 12–864ct cable placement, core-alignment fusion splicing, and OTDR-verified closeout documentation.",
                  areaServed: {
                    "@type": "Country",
                    name: "United States",
                  },
                  serviceType: [
                    "Fiber Optic Cable Jetting",
                    "Fiber Optic Fusion Splicing",
                    "OTDR Testing & Documentation",
                    "Fiber Optic Emergency Restoration",
                  ],
                  knowsAbout: [
                    "Air-blown fiber placement",
                    "Core-alignment fusion splicing",
                    "Ribbon fiber splicing",
                    "OTDR trace documentation",
                    "Fiber characterization",
                    "OSP fiber construction",
                    "FTTH deployment",
                    "Conduit and microduct jetting",
                  ],
                },
                {
                  "@type": "LocalBusiness",
                  "@id": `${BASE_URL}/#localbusiness`,
                  name: "Fiber Guys LLC",
                  legalName: "Fiber Guys LLC",
                  url: BASE_URL,
                  email: "info@fiberguysllc.com",
                  image: `${BASE_URL}/opengraph-image`,
                  description:
                    "Nationwide fiber optic jetting and precision fusion splicing contractor headquartered in Granger, Texas. Production crews available for mobilization to all 50 states within 5–10 business days.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Granger",
                    addressRegion: "TX",
                    addressCountry: "US",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 30.7174,
                    longitude: -97.4431,
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "United States",
                  },
                  priceRange: "$$$$",
                  parentOrganization: {
                    "@id": `${BASE_URL}/#organization`,
                  },
                },
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
