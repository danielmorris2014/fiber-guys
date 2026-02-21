import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/sanity.queries";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Field Work" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/request", label: "Request Crew" },
];

const DEFAULT_TAGLINE =
  "Production-focused fiber placement and precision splicing. Built for the heavy lift.";
const DEFAULT_EMAIL = "info@fiberguysllc.com";

export async function Footer() {
  const settings = await getSiteSettings();

  const tagline = settings?.footerTagline ?? DEFAULT_TAGLINE;
  const email = settings?.contactEmail ?? DEFAULT_EMAIL;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="interactable inline-block">
              <Image
                src="/brand/logo.png"
                alt="Fiber Guys LLC logo — nationwide fiber optic construction"
                width={140}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted text-sm mt-2 max-w-xs">
              {tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted/50 mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="interactable text-xs font-mono text-muted uppercase tracking-widest hover:text-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted/50 mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${email}`}
                className="interactable flex items-center gap-2 text-sm text-muted hover:text-orange transition-colors"
              >
                <Mail className="w-4 h-4" />
                {email}
              </a>
              <p className="text-sm text-muted/60">
                Crews available for deployment nationwide
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted/50">
            &copy; {new Date().getFullYear()} Fiber Guys LLC. All rights reserved.
          </p>
          <Link
            href="/studio"
            className="interactable text-[10px] font-mono uppercase tracking-widest text-muted/30 hover:text-muted/60 transition-colors"
          >
            Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
