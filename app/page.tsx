import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Process } from "@/components/home/Process";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CTABlock } from "@/components/home/CTABlock";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProofStrip />
      <ClientMarquee />
      <ServicesPreview />
      <Process />
      <GalleryTeaser />
      <Testimonials />
      <FAQ />
      <CTABlock />
    </main>
  );
}
