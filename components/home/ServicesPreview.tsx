"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const services = [
  {
    id: "01",
    title: "FIBER JETTING",
    desc: "High-output placement built for long runs and consistent results. 20,000+ ft daily average.",
    specs: [
      "High-Pressure Hydraulic Systems",
      "Real-Time PSI Monitoring",
      "Multi-Conduit Placement",
      "Documentation & Redlines",
    ],
    href: "/services#jetting",
    image: "/images/gallery/jetting-01.jpg",
  },
  {
    id: "02",
    title: "FIBER SPLICING",
    desc: "Clean trays, clear labeling, and documentation that's ready for closeout. Sub-0.03dB loss guarantee.",
    specs: [
      "Core Alignment Fusion",
      "Ribbon & Single Fiber",
      "OTDR / CD / PMD Testing",
      "Full Closeout Packages",
    ],
    href: "/services#splicing",
    image: "/images/gallery/splicing-01.jpg",
  },
];

function ServicePanel({
  service,
  index,
  reduced,
}: {
  service: (typeof services)[0];
  index: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0 }}
      animate={isInView ? { opacity: 1 } : reduced ? {} : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={service.href}
        className="interactable group relative block h-[600px] lg:h-screen overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12">
          {/* ID label */}
          <span className="font-mono text-xs text-orange tracking-[0.2em] mb-4">
            [{service.id}]
          </span>

          {/* Title */}
          <h3 className="font-heading text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tighter mb-4 text-white">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-muted text-base lg:text-lg font-light mb-8 max-w-md">
            {service.desc}
          </p>

          {/* Specs list */}
          <ul className="space-y-2.5 border-t border-white/10 pt-6">
            {service.specs.map((spec) => (
              <li
                key={spec}
                className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-white/70"
              >
                <span className="w-1.5 h-1.5 bg-orange flex-shrink-0" />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.div>
  );
}

export function ServicesPreview() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {services.map((service, i) => (
          <ServicePanel
            key={service.id}
            service={service}
            index={i}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}
