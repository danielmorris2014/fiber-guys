import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Camera } from "lucide-react";
import type { Metadata } from "next";
import { existsSync } from "fs";
import { join } from "path";
import galleryData from "@/content/gallery.json";
import type { GalleryItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See our fiber jetting and splicing work. Clean trays, production runs, and field-ready documentation from projects across the US.",
};

function hasRealImages(): boolean {
  // Check if at least one gallery image actually exists
  try {
    const publicDir = join(process.cwd(), "public");
    return galleryData.some((item) =>
      existsSync(join(publicDir, item.src))
    );
  } catch {
    return false;
  }
}

export default function GalleryPage() {
  const items = galleryData as GalleryItem[];
  const imagesExist = hasRealImages();

  return (
    <main id="main-content" className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Our Work</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Built to show,{" "}
            <span className="text-muted">not just tell.</span>
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Every photo represents real production work — real conduit, real
            splices, real closeout packages.
          </p>
        </ScrollReveal>

        <div className="mt-12 lg:mt-16">
          {imagesExist ? (
            <GalleryClientWrapper items={items} />
          ) : (
            <GalleryComingSoon />
          )}
        </div>
      </section>
    </main>
  );
}

async function GalleryClientWrapper({ items }: { items: GalleryItem[] }) {
  const { GalleryClient } = await import("@/components/gallery/GalleryClient");
  const { CompareSection } = await import("@/components/gallery/CompareSection");

  return (
    <>
      <GalleryClient items={items} />
      <CompareSection />
    </>
  );
}

function GalleryComingSoon() {
  return (
    <ScrollReveal>
      <div className="border border-line rounded-2xl bg-bg-2 p-12 lg:p-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-orange-soft">
            <Camera className="w-10 h-10 text-orange" />
          </div>
        </div>
        <h2 className="font-heading text-h3 font-bold tracking-tight mb-4">
          Gallery coming soon.
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          We&apos;re compiling project photos from the field. Check back soon for
          real documentation of our jetting and splicing work.
        </p>
        <MagneticButton href="/request">
          Request a Crew
        </MagneticButton>
      </div>
    </ScrollReveal>
  );
}
