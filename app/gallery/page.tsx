import { GalleryClient } from "@/components/gallery/GalleryClient";
import { CompareSection } from "@/components/gallery/CompareSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import galleryData from "@/content/gallery.json";
import type { GalleryItem } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See our fiber jetting and splicing work. Clean trays, production runs, and field-ready documentation from projects across the US.",
};

export default function GalleryPage() {
  const items = galleryData as GalleryItem[];

  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Our Work</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Built to show,{" "}
            <span className="text-muted">not just tell.</span>
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Every photo represents real production work — real conduit, real
            splices, real closeout packages. No stock images.
          </p>
        </ScrollReveal>

        <div className="mt-12 lg:mt-16">
          <GalleryClient items={items} />
        </div>

        <CompareSection />
      </section>
    </main>
  );
}
