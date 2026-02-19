'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import faqData from '@/content/faq.json';
import type { FAQItem } from '@/lib/types';
import Link from 'next/link';
import { USCoverageMap } from '@/components/ui/USCoverageMap';

/**
 * INTERNAL COMPONENTS
 */

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick, href }: { children: React.ReactNode, className?: string, onClick?: () => void, href?: string }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useGSAP(() => {
    const el = btnRef.current || linkRef.current;
    if (!el) return;

    const handleMouseMove = (e: Event) => {
      const me = e as globalThis.MouseEvent;
      const rect = el.getBoundingClientRect();
      const x = me.clientX - (rect.left + rect.width / 2);
      const y = me.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: btnRef });

  if (href) {
    return (
      <Link ref={linkRef} href={href} className={`interactable ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={btnRef} className={`interactable ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Spotlight Card Component
const SpotlightCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden spotlight-card interactable ${className}`}
    >
      {children}
    </div>
  );
};

// FAQ Accordion Component
const FAQAccordion = ({ items }: { items: FAQItem[] }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="border-b border-white/10">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="interactable w-full flex items-center justify-between py-6 text-left group"
            aria-expanded={openId === item.id}
          >
            <span className="font-heading text-xl md:text-2xl font-bold text-white group-hover:text-blue-600 transition-colors pr-8">
              {item.question}
            </span>
            <motion.span
              animate={{ rotate: openId === item.id ? 45 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-blue-600 text-2xl font-light flex-shrink-0 w-8 h-8 flex items-center justify-center"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <p className="text-gray-400 leading-relaxed pb-6 max-w-2xl">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

/**
 * MAIN HOME COMPONENT
 */
const heroWords = [
  { word: 'Jet.', desc: 'Air-blown fiber placement through conduit systems.' },
  { word: 'Splice.', desc: 'Precision fusion splicing with organized closeout.' },
  { word: 'Deliver.', desc: 'On schedule. On spec. Ready for handoff.' },
];

interface SiteContent {
  coverage?: { description?: string };
  hero?: { subtitle?: string };
  cta?: { heading1?: string; heading2?: string; description?: string };
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch("/api/content/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setSiteContent(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const durations = [1500, 1500, 2000, 3000];
    const timeout = setTimeout(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, durations[phase]);
    return () => clearTimeout(timeout);
  }, [phase]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-fade", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out",
      delay: 0.5
    });

    gsap.to("#hero-bg", {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 100,
      scale: 1.1,
      opacity: 0.2
    });

    if (horizontalSectionRef.current) {
      gsap.to(".process-track", {
        x: () => -(4 * window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }

    gsap.from(".faq-section", {
      scrollTrigger: {
        trigger: ".faq-section",
        start: "top 80%",
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from("#contact-card", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top 70%"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#e0e0e0] font-sans selection:bg-blue-600 selection:text-white antialiased">

      {/* Hero Section */}
      <header id="hero" className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            id="hero-bg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-30 scale-110"
            ref={(el) => { if (el) el.playbackRate = 1.3; }}
          >
            <source src="/video/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto z-10 relative min-h-[55vh]">
          <AnimatePresence mode="wait">
            {phase < 3 ? (
              <motion.div
                key="words-stack"
                className="min-h-[55vh] flex flex-col justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-display text-[6vw] md:text-[4vw] leading-none font-bold uppercase tracking-tighter text-white/50">
                  We
                </span>

                <div className="flex flex-col mt-2">
                  {heroWords.map((item, i) => (
                    i <= phase && (
                      <motion.span
                        key={item.word}
                        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`font-display text-[12vw] md:text-[8vw] leading-[0.9] font-bold uppercase tracking-tighter transition-colors duration-500 ${i === phase ? 'text-white' : 'text-white/30'}`}
                      >
                        {item.word}
                      </motion.span>
                    )
                  ))}
                </div>

                <div className="h-[2px] bg-blue-600 w-full mt-4 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="relative h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={heroWords[phase].desc}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="font-mono text-sm md:text-base text-gray-400 absolute"
                      >
                        <span className="text-blue-600">///</span> {heroWords[phase].desc}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/40">
                      0{phase + 1} <span className="text-white/20">/</span> 03
                    </span>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-[2px] transition-all duration-500 ${i <= phase ? 'bg-blue-600 w-8' : 'bg-white/20 w-6'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <p className="font-mono text-sm text-gray-500 max-w-sm">
                    {siteContent?.hero?.subtitle || "Production-grade fiber construction. Jetting and splicing crews for telecom contractors nationwide."}
                  </p>
                  <Link href="/request" className="group flex items-center gap-3 px-0 py-2 hover:opacity-80 transition-opacity font-mono text-xs uppercase tracking-widest text-white interactable">
                    <div className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="border-b border-transparent group-hover:border-blue-600 transition-colors">Request a Crew</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="min-h-[55vh] flex flex-col items-center justify-center py-8"
              >
                <span className="font-display text-[6vw] md:text-[4vw] leading-none font-bold uppercase tracking-tighter text-white/50 mb-4">
                  We Are
                </span>
                <motion.img
                  src="/brand/logo.png"
                  alt="Fiber Guys"
                  initial={{ scale: 0.7, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="h-[20vw] md:h-[14vw] w-auto max-h-[200px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference hero-fade">
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600 animate-[scroll_2s_infinite]"></div>
            </div>
        </div>
      </header>

      <main>
        {/* Capabilities Strip — verifiable specs, not aggregate claims */}
        <section className="py-24 border-b border-white/10 bg-[#050505] relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: 'Fiber Counts', value: '12–864', unit: 'ct' },
                { label: 'Daily Output', value: 'Up to 25K', unit: 'ft/day/crew' },
                { label: 'Splice Target', value: '≤0.03', unit: 'dB' },
                { label: 'Mobilization', value: '5–10', unit: 'days' },
              ].map((stat, i) => (
                <SpotlightCard key={i} className="border-l border-white/20 pl-6 group p-4 rounded-sm">
                  <p className="font-display text-3xl md:text-5xl font-bold text-white mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.value}<span className="text-lg md:text-xl text-blue-600 ml-1">{stat.unit}</span>
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{stat.label}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* Services Split — with gradient placeholders instead of stock photos */}
        <section id="services" className="min-h-screen relative flex flex-col md:flex-row border-b border-white/10 overflow-hidden">
            <SpotlightCard className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#050505] to-[#0a0a0a] transition-all duration-700 group-hover:from-blue-600/30"></div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <div className="font-mono text-blue-600 text-sm">[01]</div>
                    <div>
                        <h2 className="font-display text-6xl md:text-8xl font-bold uppercase mb-6 leading-none">Fiber<br/>Jetting</h2>
                        <p className="font-sans text-gray-300 max-w-sm mb-8 text-lg">Air-blown fiber placement through conduit systems. Production-scale output with real-time tension monitoring.</p>
                        <ul className="font-mono text-sm text-gray-400 space-y-2">
                            {['Mandrel & Pressure Verification', 'Metro, Long-Haul & Microduct', '12–864 Fiber Count Range'].map(item => (
                                <li key={item} className="flex items-center"><span className="w-2 h-2 bg-blue-600 mr-2"></span>{item}</li>
                            ))}
                        </ul>
                        <Link href="/services#jetting" className="inline-flex items-center gap-2 mt-8 font-mono text-xs uppercase tracking-widest text-blue-600 hover:text-white transition-colors interactable">
                          Learn More <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </SpotlightCard>

            <SpotlightCard className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative group">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/20 via-[#050505] to-[#0a0a0a] transition-all duration-700 group-hover:from-blue-600/30"></div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <div className="font-mono text-blue-600 text-sm">[02]</div>
                    <div>
                        <h2 className="font-display text-6xl md:text-8xl font-bold uppercase mb-6 leading-none">Precision<br/>Splicing</h2>
                        <p className="font-sans text-gray-300 max-w-sm mb-8 text-lg">Core-alignment fusion splicing. Organized trays, labeled closures, and documentation ready for handoff.</p>
                        <ul className="font-mono text-sm text-gray-400 space-y-2">
                             {['Mass Fusion (Ribbon) & Single', '≤0.03dB Splice Loss Standard', 'Organized Trays & Labeled Closures'].map(item => (
                                <li key={item} className="flex items-center"><span className="w-2 h-2 bg-blue-600 mr-2"></span>{item}</li>
                            ))}
                        </ul>
                        <Link href="/services#splicing" className="inline-flex items-center gap-2 mt-8 font-mono text-xs uppercase tracking-widest text-blue-600 hover:text-white transition-colors interactable">
                          Learn More <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </SpotlightCard>
        </section>

        {/* Process (Horizontal Scroll) */}
        <section id="process" ref={horizontalSectionRef} className="relative bg-blue-600" style={{ height: '300vh' }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <div className="absolute top-12 left-12 z-20">
                    <h2 className="font-display text-4xl uppercase font-bold text-white">The Protocol</h2>
                    <p className="font-mono text-sm mt-2 opacity-80 text-white">Methodology // Execution</p>
                </div>
                <div className="process-track flex flex-row flex-nowrap h-full items-center" style={{ width: '500vw' }}>
                    {[
                        { step: '01', title: 'Scope & Verify', desc: 'We review the project scope, verify conduit specs, and confirm we can deliver. Once everything checks out, we move to mobilization.' },
                        { step: '02', title: 'Mobilize', desc: 'Equipment and experienced crews deployed to site. Compressor pressures calibrated to conduit specifications.' },
                        { step: '03', title: 'Execute', desc: 'Production fiber placement or precision fusion splicing. Tension monitoring, bend radius compliance, and real-time quality checks.' },
                        { step: '04', title: 'Document', desc: 'OTDR testing, splice loss verification, tray photography, and labeled enclosures. Every strand accounted for.' },
                        { step: '05', title: 'Handoff', desc: 'Clean site, organized closures, and a documentation package ready for client review or closeout submission.' }
                    ].map((p, i) => (
                        <div key={i} className="w-screen flex-shrink-0 px-12 flex flex-col justify-center h-full border-r border-white/20 last:border-r-0 text-white">
                            <span className="font-display text-[20vh] md:text-[30vh] opacity-20 font-bold mb-4 text-black leading-none">{p.step}</span>
                            <h3 className="font-display text-5xl md:text-7xl font-bold uppercase mb-6">{p.title}</h3>
                            <p className="font-sans text-xl md:text-2xl max-w-xl leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* What You Get — Deliverables Preview */}
        <section className="py-32 bg-[#050505] relative">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="font-mono text-blue-600 text-sm uppercase tracking-[0.2em]">[Deliverables]</span>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mt-4 text-white">What You<br/>Get</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl">Every project includes a complete documentation package. No loose ends.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'OTDR Test Results', desc: 'End-to-end fiber characterization with splice loss data for every strand. Organized by cable and ready for review.', tag: 'Testing' },
                { title: 'Organized Closures', desc: 'Clean tray routing, color-coded labeling, sealed entry ports, and strain relief. Ready for the next crew or the end client.', tag: 'Build Quality' },
                { title: 'Closeout Package', desc: 'As-built records, geo-tagged photos, splice maps, and test data compiled into a handoff-ready documentation set.', tag: 'Documentation' },
              ].map((item, i) => (
                <SpotlightCard key={i} className="border border-white/10 p-8 rounded-sm">
                  <div className="relative z-10">
                    <span className="font-mono text-xs text-blue-600 uppercase tracking-widest">{item.tag}</span>
                    <h3 className="font-heading text-xl font-bold text-white mt-3 mb-4">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Map */}
        <section className="py-32 bg-[#0a0a0a] relative border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="mb-12">
              <span className="font-mono text-blue-600 text-sm uppercase tracking-[0.2em]">[Coverage]</span>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mt-4 text-white">Where We<br/>Work</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl">{siteContent?.coverage?.description || "Currently operating in Missouri, Georgia, Tennessee, Alabama, and Florida. Available for mobilization nationwide."}</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <USCoverageMap />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section py-32 bg-[#050505] relative border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="font-mono text-blue-600 text-sm uppercase tracking-[0.2em]">[FAQ]</span>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mt-4 text-white">Common<br/>Questions</h2>
            </div>
            <div className="max-w-3xl">
              <FAQAccordion items={faqData as FAQItem[]} />
            </div>
          </div>
        </section>

        {/* CTA Block — links to /request, no inline form */}
        <section id="contact" className="min-h-[70vh] bg-blue-600 text-[#050505] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #050505 25%, #050505 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>

            <div className="container mx-auto px-6 relative z-10 w-full max-w-4xl">
                <div id="contact-card" className="bg-[#050505] text-white p-8 md:p-16 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600"></div>

                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-2">{siteContent?.cta?.heading1 || "Send Prints."}</h2>
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 text-transparent" style={{ WebkitTextStroke: '1px #2563EB' }}>{siteContent?.cta?.heading2 || "Get a Schedule."}</h2>

                    <p className="font-sans text-gray-400 mb-12 text-lg max-w-xl">
                      {siteContent?.cta?.description || "Tell us what needs to be placed or spliced. We review your scope and respond with crew availability and a production timeline."}
                    </p>

                    <MagneticButton href="/request" className="inline-flex items-center gap-4 bg-white text-black font-display font-bold uppercase text-xl md:text-2xl py-5 px-8 hover:bg-blue-600 hover:text-white transition-all duration-300 group">
                      <span>Request a Crew</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </MagneticButton>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
