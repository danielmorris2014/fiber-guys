import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FieldGallery } from "@/components/gallery/FieldGallery";
import { getGalleryImages } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Field execution proof — precision splicing, production jetting, and audit-ready closeout documentation from Fiber Guys projects nationwide.",
};

export default async function GalleryPage() {
  const sanityImages = await getGalleryImages();

  /* Map Sanity images to the shape FieldGallery expects */
  const cmsImages =
    sanityImages.length > 0
      ? sanityImages.map((img) => ({
          id: img._id,
          title: img.title,
          category: img.category,
          location: img.location ?? "",
          description: img.description ?? "",
          tag: img.title,
          imageUrl: img.imageUrl,
          lqip: img.lqip ?? undefined,
          altText: img.altText ?? undefined,
        }))
      : undefined; // undefined → use hardcoded fallback

  return (
    <main id="main-content" className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange mb-4">
            [Field Work]
          </p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            Field Execution
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Proof of production. Clean setups, organized trays, and the iron
            that gets it done.
          </p>
        </ScrollReveal>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
        <FieldGallery cmsImages={cmsImages} />
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
          <ScrollReveal>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              See it in person.
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
              Send us your prints and we&apos;ll show you what our crews can
              do on your project.
            </p>
            <div className="mt-8">
              <MagneticButton href="/request" size="large">
                Request a Crew
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
