import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Field Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/request", label: "Request Crew" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="interactable inline-block">
              <Image
                src="/brand/logo.png"
                alt="Fiber Guys"
                width={140}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted text-sm mt-2 max-w-xs">
              Production-focused fiber placement and precision splicing.
              Built for the heavy lift.
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
                href="mailto:info@fiberguys.com"
                className="interactable flex items-center gap-2 text-sm text-muted hover:text-orange transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@fiberguys.com
              </a>
              <a
                href="tel:+15551234567"
                className="interactable flex items-center gap-2 text-sm text-muted hover:text-orange transition-colors"
              >
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </a>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="w-4 h-4" />
                Denver, CO 80202
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="interactable text-muted hover:text-orange transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="interactable text-muted hover:text-orange transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted/50">
            &copy; {new Date().getFullYear()} Fiber Guys. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
