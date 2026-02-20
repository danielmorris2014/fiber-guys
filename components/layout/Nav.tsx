"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Field Work" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

// Hamburger icon — three lines morphing to X
function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-5 flex flex-col justify-between">
      <motion.span
        className="block h-[1.5px] w-full bg-white origin-left"
        animate={open ? { rotate: 45, y: -1, width: "105%" } : { rotate: 0, y: 0, width: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="block h-[1.5px] w-4 bg-white"
        animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        className="block h-[1.5px] w-full bg-white origin-left"
        animate={open ? { rotate: -45, y: 1, width: "105%" } : { rotate: 0, y: 0, width: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
            alt="Fiber Guys LLC logo — fiber optic jetting and splicing contractor"
            width={140}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.filter(l => l.href !== "/").map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="interactable relative px-4 py-2 group"
              >
                <span
                  className={cn(
                    "relative z-10 text-[11px] font-mono tracking-[0.15em] uppercase transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-white/50 group-hover:text-white"
                  )}
                >
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.06] rounded-sm border border-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
            <span className="absolute inset-0 border border-white/20 group-hover:border-orange/60 group-hover:shadow-[inset_0_0_20px_rgba(37,99,235,0.1)] transition-all duration-500" />
            <span className="absolute inset-0 bg-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-orange group-hover:bg-white transition-colors duration-300" />
            <span className="relative z-10 transition-colors duration-300 text-white">
              {ctaHover ? "SUBMIT SCOPE" : "REQUEST CREW"}
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden relative z-50 interactable p-2 -mr-2"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <MenuIcon open={mobileOpen} />
        </button>

        {/* ================================================================
            Mobile fullscreen menu
            ================================================================ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 lg:hidden overflow-hidden"
            >
              {/* Background */}
              <motion.div
                className="absolute inset-0 bg-[#030303]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              {/* Accent line — left edge */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-600"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Content container */}
              <div className="relative z-10 h-full flex flex-col px-8 pt-24 pb-8">
                {/* Nav links */}
                <div className="flex-1 flex flex-col justify-center -mt-8">
                  {navLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          delay: 0.08 + i * 0.06,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="border-b border-white/[0.04]"
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          className="interactable flex items-center justify-between py-5 group"
                        >
                          <div className="flex items-baseline gap-4">
                            <span
                              className={cn(
                                "font-mono text-[10px] tracking-[0.2em] tabular-nums",
                                isActive ? "text-blue-500" : "text-white/15"
                              )}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={cn(
                                "font-heading text-[2rem] font-bold tracking-tight leading-none transition-colors duration-200",
                                isActive
                                  ? "text-white"
                                  : "text-white/60 group-hover:text-white"
                              )}
                            >
                              {link.label}
                            </span>
                          </div>

                          {/* Active dot */}
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active"
                              className="w-2 h-2 rounded-full bg-blue-500"
                            />
                          )}

                          {/* Arrow on hover / non-active */}
                          {!isActive && (
                            <span className="text-white/10 group-hover:text-white/30 transition-colors text-sm font-mono">
                              &rarr;
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom section — CTA + contact */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* CTA Button */}
                  <Link
                    href="/request"
                    onClick={closeMobile}
                    className="interactable flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-500 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-white/80" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white">
                      Request a Crew
                    </span>
                  </Link>

                  {/* Contact info */}
                  <div className="flex items-center justify-between pt-2">
                    <a
                      href="mailto:info@fiberguysllc.com"
                      className="font-mono text-[10px] text-white/25 hover:text-white/50 transition-colors tracking-wider"
                    >
                      info@fiberguysllc.com
                    </a>
                    <span className="font-mono text-[10px] text-white/10 tracking-wider">
                      Granger, TX
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
