"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Squeeze } from "hamburger-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "SERVICES" },
  { href: "/gallery", label: "FIELD WORK" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Track scroll position for backdrop effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg/60 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="interactable relative z-50">
          <Image
            src="/brand/logo.png"
            alt="Fiber Guys"
            width={140}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="interactable relative px-4 py-2 group"
              >
                <span
                  className={cn(
                    "relative z-10 text-[11px] font-mono tracking-[0.15em] transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/50 group-hover:text-white"
                  )}
                >
                  {link.label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.06] rounded-sm border border-white/[0.08]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/request"
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            className="interactable relative inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono tracking-[0.15em] overflow-hidden group"
          >
            {/* Border that glows on hover */}
            <span className="absolute inset-0 border border-white/20 group-hover:border-orange/60 group-hover:shadow-[inset_0_0_20px_rgba(37,99,235,0.1)] transition-all duration-500" />
            {/* Fill sweep */}
            <span className="absolute inset-0 bg-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            {/* Dot indicator */}
            <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-orange group-hover:bg-white transition-colors duration-300" />
            <span
              className={cn(
                "relative z-10 transition-colors duration-300 text-white",
                "group-hover:text-white"
              )}
            >
              {ctaHover ? "SUBMIT SCOPE" : "REQUEST CREW"}
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden relative z-50 interactable">
          <Squeeze
            toggled={mobileOpen}
            toggle={setMobileOpen}
            size={20}
            color="#FFFFFF"
            duration={0.4}
            label="Toggle menu"
          />
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-bg/95 backdrop-blur-2xl z-40 lg:hidden flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-start gap-6 relative z-10 w-full px-10">
                {[{ href: "/", label: "HOME" }, ...navLinks].map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + i * 0.08,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="interactable flex items-center gap-4 py-3 group"
                      >
                        <span
                          className={cn(
                            "font-mono text-xs tracking-widest transition-colors",
                            isActive ? "text-orange" : "text-white/20"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-heading text-4xl font-bold tracking-tighter transition-colors",
                            isActive ? "text-orange" : "text-white group-hover:text-white/80"
                          )}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 w-full border-t border-white/10 pt-8"
                >
                  <Link
                    href="/request"
                    onClick={() => setMobileOpen(false)}
                    className="interactable block w-full py-4 bg-orange text-white text-center font-mono text-sm font-bold uppercase tracking-widest hover:bg-orange-hard transition-colors"
                  >
                    Request Crew
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
