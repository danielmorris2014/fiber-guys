'use client';

import React, { useRef, useState } from 'react';
import { Globe, MapPin, Network, Sun, ArrowRight, Crosshair, FileText, ShieldCheck, Siren } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import testimonials from '@/content/testimonials.json';
import faqData from '@/content/faq.json';
import type { Testimonial, FAQItem } from '@/lib/types';

/**
 * INTERNAL COMPONENTS
 */

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: "power3.out"
      });
      
      const btnChildren = btn.children;
      if (btnChildren) {
        gsap.to(btnChildren, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.5,
          ease: "power3.out"
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
      const btnChildren = btn.children;
      if (btnChildren) {
        gsap.to(btnChildren, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
      }
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: btnRef });

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
      <style dangerouslySetInnerHTML={{__html: `
        .spotlight-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.06), transparent 40%);
          z-index: 1;
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .spotlight-card:hover::before { opacity: 1; }
        .spotlight-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(37, 99, 235, 0.1), transparent 40%);
          z-index: 1;
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .spotlight-card:hover::after { opacity: 1; }
      `}} />
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
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in intro
    gsap.from(".hero-fade", { 
      y: 20, 
      opacity: 0, 
      stagger: 0.1, 
      duration: 1, 
      ease: "power2.out",
      delay: 0.5
    });

    // Hero Parallax
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

    // Horizontal Scroll (The Protocol) — uses CSS sticky, NO GSAP pin
    if (horizontalSectionRef.current) {
      gsap.to(".process-track", {
        x: () => -(4 * window.innerWidth), // 5 panels, move 4 screens left
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

    // Gallery Parallax
    gsap.utils.toArray('.hover-scale').forEach((img: any) => {
      gsap.to(img, {
        scale: 1.2,
        scrollTrigger: { 
          trigger: img.parentElement, 
          start: "top bottom", 
          end: "bottom top", 
          scrub: true 
        }
      });
    });

    // Testimonials Stagger
    ScrollTrigger.batch(".testimonial-card", {
      onEnter: batch => {
        gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out"
        });
      },
      start: "top 85%",
      once: true
    });

    // FAQ Section Fade In
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

    // Footer Reveal
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

    // Scramble Numbers on Scroll
    ScrollTrigger.batch(".scramble-number", {
      onEnter: batch => {
        batch.forEach((el) => {
          const targetStr = el.getAttribute('data-target');
          if (!targetStr) return;
          const target = parseFloat(targetStr);
          const suffix = (el as HTMLElement).innerText.replace(/[0-9.]/g, '');
          let obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power4.out",
            onUpdate: function() {
              const formattedVal = targetStr.includes('.') ? obj.val.toFixed(2) : Math.floor(obj.val);
              el.innerHTML = formattedVal + `<span class="text-3xl align-top text-blue-600">${suffix}</span>`;
            }
          });
        });
      },
      start: "top 85%"
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
            ref={(el) => { if (el) el.playbackRate = 2; }}
          >
            <source src="/video/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto z-10 relative">
          <div className="flex flex-col items-start w-full gap-0">
            <h1 className="font-display text-[12vw] leading-[0.8] font-bold uppercase tracking-tighter text-white">
              Production
            </h1>
            <div className="flex items-center gap-4 md:gap-8 w-full">
              <h1 className="font-display text-[12vw] leading-[0.8] font-bold uppercase tracking-tighter text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
                Over
              </h1>
              <div className="h-[2px] bg-blue-600 flex-grow shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
            </div>
            <h1 className="font-display text-[12vw] leading-[0.8] font-bold uppercase tracking-tighter text-white text-right self-end">
               Promises
            </h1>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-8">
            <div className="font-mono text-sm md:text-base text-gray-400 max-w-md hero-fade space-y-4">
               <div>
                  <span className="text-blue-600">///</span> Elite fiber jetting and precision splicing. <br />
                  We place lines. We fuse glass. We close out tickets.
               </div>
               
               <button className="group flex items-center gap-3 px-0 py-2 hover:opacity-80 transition-opacity font-mono text-xs uppercase tracking-widest text-white interactable">
                  <div className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                     <FileText className="w-4 h-4" />
                  </div>
                  <span className="border-b border-transparent group-hover:border-blue-600 transition-colors">Download Capabilities Deck [PDF]</span>
               </button>
            </div>
            <div className="hidden md:block hero-fade">
              <div className="animate-spin-slow">
                <Crosshair className="w-12 h-12 text-blue-600 animate-[spin_10s_linear_infinite]" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference hero-fade">
            <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600 animate-[scroll_2s_infinite]"></div>
            </div>
        </div>
      </header>

      <main>
        {/* Statistics */}
        <section className="py-24 border-b border-white/10 bg-[#050505] relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { val: 15, suffix: '+', label: 'Million Feet Placed' },
                { val: 10, suffix: 'K+', label: 'Splices Completed' },
                { val: 99, suffix: '%', label: 'First-Pass Rate' },
                { val: 0.03, suffix: 'dB', label: 'Avg. Splice Loss', isFloat: true }
              ].map((stat, i) => (
                <SpotlightCard key={i} className="border-l border-white/20 pl-6 group p-4 rounded-sm">
                  <h3 className={`font-display text-5xl md:text-7xl font-bold text-white mb-2 group-hover:text-blue-600 transition-colors duration-300 scramble-number`} data-target={stat.val}>
                    0<span className="text-3xl align-top text-blue-600">{stat.suffix}</span>
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{stat.label}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="pt-16 pb-12 border-b border-white/10 overflow-hidden relative z-10 bg-[#050505]">
          <div className="container mx-auto px-6 mb-8">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-gray-500">
              Relied on by top telecom contractors
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-20 pointer-events-none"></div>
          <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2].map((iter) => (
              <div key={iter} className="flex gap-16 md:gap-32 items-center mx-8">
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <Globe className="w-8 h-8 text-white" />
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">AT&T Broadband</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">Fastwyre</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">Comcast</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">Meta</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <MapPin className="w-8 h-8 text-white" />
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">Open County</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <Network className="w-8 h-8 text-white" />
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">CAT5</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                    <Sun className="w-8 h-8 text-white" />
                    <span className="font-display font-bold text-3xl md:text-4xl text-white uppercase">Sunrise Telecom</span>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="min-h-screen relative flex flex-col md:flex-row border-b border-white/10 overflow-hidden">
            <SpotlightCard className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 relative group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-110 opacity-40 group-hover:opacity-60" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <div className="font-mono text-blue-600 text-sm">[01]</div>
                    <div>
                        <h2 className="font-display text-6xl md:text-8xl font-bold uppercase mb-6 leading-none">Fiber<br/>Jetting</h2>
                        <p className="font-sans text-gray-300 max-w-sm mb-8 text-lg">High-speed air placement. We own the rigs. We hit the deadlines. 20,000+ feet daily output capability.</p>
                        <ul className="font-mono text-sm text-gray-400 space-y-2">
                            {['Mandrel & PSI Proofing', 'Metro, Long-Haul & Microduct', 'Crash-Test Verified Setup'].map(item => (
                                <li key={item} className="flex items-center"><span className="w-2 h-2 bg-blue-600 mr-2"></span>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SpotlightCard>

            <SpotlightCard className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-110 opacity-40 group-hover:opacity-60" 
                     style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2670&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <div className="font-mono text-blue-600 text-sm">[02]</div>
                    <div>
                        <h2 className="font-display text-6xl md:text-8xl font-bold uppercase mb-6 leading-none">Precision<br/>Splicing</h2>
                        <p className="font-sans text-gray-300 max-w-sm mb-8 text-lg">Test-verified, closeout-ready documentation. Organized splice trays, labeled closures. Sub-0.03dB loss average.</p>
                        <ul className="font-mono text-sm text-gray-400 space-y-2">
                             {['Mass Fusion (Ribbon) & Single', 'Bidirectional OTDR & OLTS', 'Native .SOR & PDF Closeouts'].map(item => (
                                <li key={item} className="flex items-center"><span className="w-2 h-2 bg-blue-600 mr-2"></span>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SpotlightCard>
        </section>

        {/* Process (Horizontal Scroll) — CSS sticky + GSAP scrub, no pin */}
        <section id="process" ref={horizontalSectionRef} className="relative bg-blue-600" style={{ height: '300vh' }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <div className="absolute top-12 left-12 z-20">
                    <h3 className="font-display text-4xl uppercase font-bold text-white">The Protocol</h3>
                    <p className="font-mono text-sm mt-2 opacity-80 text-white">Methodology // Execution</p>
                </div>
                <div className="process-track flex flex-row flex-nowrap h-full items-center" style={{ width: '500vw' }}>
                    {[
                        { step: '01', title: 'Scope & Verify', desc: 'We analyze prints and walk the route. We verify conduit continuity and identify choke points before mobilization.' },
                        { step: '02', title: 'Mobilize', desc: 'Heavy equipment and experienced crews deployed to site. Compressor pressures calibrated to conduit specs.' },
                        { step: '03', title: 'Execute', desc: 'High-speed jetting and precision fusion splicing. We manage Figure-8ing for long hauls to protect minimum bend radius.' },
                        { step: '04', title: 'Certify', desc: 'Tier 1 and Tier 2 testing. We validate loss budgets with Power Meters and characterize events with OTDRs.' },
                        { step: '05', title: 'Closeout', desc: 'Clean, organized documentation delivered immediately. .SOR files, geo-tagged photos, and light levels.' }
                    ].map((p, i) => (
                        <div key={i} className="w-screen flex-shrink-0 px-12 flex flex-col justify-center h-full border-r border-white/20 last:border-r-0 text-white">
                            <span className="font-display text-[20vh] md:text-[30vh] opacity-20 font-bold mb-4 text-black leading-none">{p.step}</span>
                            <h4 className="font-display text-5xl md:text-7xl font-bold uppercase mb-6">{p.title}</h4>
                            <p className="font-sans text-xl md:text-2xl max-w-xl leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Gallery */}
        <section id="work" className="bg-[#050505] py-32 relative">
            <div className="container mx-auto px-6 mb-24">
                <h2 className="font-display text-6xl md:text-8xl font-bold uppercase text-center mb-4">Field Report</h2>
                <div className="flex justify-center">
                    <span className="font-mono text-blue-600 uppercase tracking-widest">[Live Site Documentation]</span>
                </div>
            </div>

            <div className="flex flex-col gap-32 px-4 md:px-0">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 group interactable">
                    <div className="w-full md:w-2/3 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop" alt="Cable Jetting" className="w-full h-[60vh] object-cover hover-scale" />
                        <div className="absolute bottom-0 left-0 bg-blue-600 text-white p-4 font-mono text-xs font-bold">
                            // MUNICIPAL BUILD
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <h3 className="font-display text-4xl font-bold mb-4 uppercase">Metro Ring <br/>Jetting</h3>
                        <p className="font-sans text-gray-400 mb-6">35,000ft urban conduit placement. Zero downtime. Mandrel proofed and pressure tested prior to placement.</p>
                        <div className="h-[1px] w-full bg-white/20 mb-4"></div>
                        <ul className="font-mono text-xs text-gray-500 flex gap-4">
                            <li>288ct Micro-Jetting</li>
                            <li>Urban Density</li>
                        </ul>
                    </div>
                </div>

                <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12 group interactable">
                    <div className="w-full md:w-2/3 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                        <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2670&auto=format&fit=crop" alt="Splice Tray" className="w-full h-[60vh] object-cover hover-scale" />
                         <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-4 font-mono text-xs font-bold">
                            // ISP EXPANSION
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 text-right">
                        <h3 className="font-display text-4xl font-bold mb-4 uppercase">Headend <br/>Termination</h3>
                        <p className="font-sans text-gray-400 mb-6">High-density fusion splicing. 1440 terminations. Bidirectional testing confirms 0.02dB avg loss.</p>
                        <div className="h-[1px] w-full bg-white/20 mb-4"></div>
                        <ul className="font-mono text-xs text-gray-500 flex gap-4 justify-end">
                            <li>Data Center</li>
                            <li>864ct Mass Fusion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-[#0a0a0a] relative">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="font-mono text-blue-600 text-sm uppercase tracking-[0.2em]">[Client Testimonials]</span>
              <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mt-4 text-white">Straight From<br/>The Field</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(testimonials as Testimonial[]).map((t, i) => (
                <SpotlightCard key={t.id} className="testimonial-card border border-white/10 p-8 md:p-10 rounded-sm">
                  <div className="relative z-10">
                    <span className="font-display text-[80px] md:text-[100px] leading-none text-blue-600/10 absolute -top-4 -left-2 select-none">&ldquo;</span>
                    <p className="font-sans text-gray-300 text-lg leading-relaxed mb-8 relative z-10 pt-8">
                      {t.quote}
                    </p>
                    <div className="h-[1px] bg-white/10 mb-6"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading text-white font-bold uppercase text-sm">{t.name}</p>
                        <p className="font-mono text-xs text-gray-500 mt-1">{t.title} — {t.company}</p>
                      </div>
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-wider hidden md:block">{t.metric}</span>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section py-32 bg-[#050505] relative">
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

        {/* Contact */}
        <section id="contact" className="min-h-screen bg-blue-600 text-[#050505] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #050505 25%, #050505 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }}></div>
            
            <div className="container mx-auto px-6 relative z-10 w-full max-w-4xl">
                <div id="contact-card" className="bg-[#050505] text-white p-8 md:p-16 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600"></div>

                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-2">Send Prints.</h2>
                    <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-8 text-transparent" style={{ WebkitTextStroke: '1px #2563EB' }}>Get a Schedule.</h2>
                    
                    <p className="font-sans text-gray-400 mb-12 text-lg">We don't need a sales pitch. We need your scope. Fill out the manifest below and we will mobilize.</p>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="font-mono text-xs uppercase text-gray-500 mb-2 block">Project Lead</label>
                                <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-blue-600 focus:outline-none transition-colors text-lg interactable" />
                            </div>
                            <div className="relative group">
                                <label className="font-mono text-xs uppercase text-gray-500 mb-2 block">Comms</label>
                                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-blue-600 focus:outline-none transition-colors text-lg interactable" />
                            </div>
                        </div>

                        <div className="relative group py-2">
                             <label className="font-mono text-xs uppercase text-gray-500 mb-4 block">Deployment Priority</label>
                             <div className="flex flex-col md:flex-row gap-4">
                                 <label className="flex items-center gap-3 cursor-pointer group/radio">
                                     <input type="radio" name="priority" className="peer sr-only" defaultChecked />
                                     <div className="w-5 h-5 border border-gray-600 rounded-full peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors relative flex items-center justify-center">
                                         <div className="w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100"></div>
                                     </div>
                                     <span className="font-sans text-gray-300 group-hover/radio:text-white transition-colors">Standard Mobilization</span>
                                 </label>
                                 <label className="flex items-center gap-3 cursor-pointer group/radio">
                                     <input type="radio" name="priority" className="peer sr-only" />
                                     <div className="w-5 h-5 border border-gray-600 rounded-full peer-checked:bg-red-500 peer-checked:border-red-500 transition-colors relative flex items-center justify-center">
                                         <div className="w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100"></div>
                                     </div>
                                     <span className="font-sans text-gray-300 group-hover/radio:text-white transition-colors flex items-center gap-2">
                                         Emergency Restoration (24/7) <Siren className="w-4 h-4 text-red-500 animate-pulse" />
                                     </span>
                                 </label>
                             </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="font-mono text-xs uppercase text-gray-500 mb-2 block">Service Type</label>
                                <select className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-blue-600 focus:outline-none transition-colors text-lg appearance-none rounded-none interactable text-gray-400">
                                    <option>Jetting Only</option>
                                    <option>Splicing Only</option>
                                    <option>Full Turnkey</option>
                                </select>
                            </div>
                            <div className="relative group">
                                <label className="font-mono text-xs uppercase text-gray-500 mb-2 block">Est. Footage / Count</label>
                                <input type="text" placeholder="e.g. 50k ft or 288ct" className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-blue-600 focus:outline-none transition-colors text-lg interactable" />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="font-mono text-xs uppercase text-gray-500 mb-2 block">Conduit / Cable Specs</label>
                            <textarea rows={2} placeholder="e.g. 1.25in SDR11 HDPE, Ribbon Cable, Loose Tube..." className="w-full bg-transparent border-b border-gray-700 py-3 focus:border-blue-600 focus:outline-none transition-colors text-lg interactable resize-none"></textarea>
                        </div>

                        <MagneticButton className="w-full bg-white text-black font-display font-bold uppercase text-2xl py-6 mt-8 hover:bg-blue-600 hover:text-white transition-all duration-300 interactable flex items-center justify-between px-8 group">
                            <span className="relative z-10">Initialize Request</span>
                            <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                        </MagneticButton>
                    </form>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-[#050505] text-gray-500 py-12 border-t border-white/10">
          <div className="container mx-auto px-6">
                 {/* Compliance Strip */}
                 <div className="flex flex-wrap gap-6 mb-12 border-b border-white/5 pb-8">
                     <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-blue-600" />
                         <span className="font-mono text-xs uppercase tracking-wider text-gray-400">OSHA 30 Certified Crews</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-blue-600" />
                         <span className="font-mono text-xs uppercase tracking-wider text-gray-400">Fully Bonded & Insured</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-blue-600" />
                         <span className="font-mono text-xs uppercase tracking-wider text-gray-400">DOT Compliant Fleet</span>
                     </div>
                     <div className="flex items-center gap-3 ml-auto">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-mono text-xs uppercase tracking-wider text-white">Status: Nationwide Deployment Active</span>
                     </div>
                 </div>

                <div className="flex flex-col md:flex-row justify-between items-end">
                    <div>
                        <h4 className="font-display text-2xl text-white uppercase font-bold mb-4">Fiber Guys</h4>
                        <p className="font-mono text-xs max-w-xs">Infrastructure construction. <br/>Built for the heavy lift.</p>
                    </div>
                    <div className="flex gap-6 mt-8 md:mt-0 font-mono text-xs uppercase">
                        <a href="#" className="hover:text-white transition-colors interactable">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors interactable">Email</a>
                        <span className="text-blue-600">© 2024 Fiber Guys</span>
                    </div>
                </div>
            </div>
        </footer>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />
    </div>
  );
}
