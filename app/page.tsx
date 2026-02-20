// JSON files are fallback only — primary source is Sanity CMS
import { getFAQItems, getSiteSettings, getTestimonials } from "@/lib/sanity.queries";
import faqFallback from "@/content/faq.json";
import testimonialsFallback from "@/content/testimonials.json";
import siteContentFallback from "@/content/site-content.json";
import mapFallback from "@/content/map.json";
import type { FAQItem } from "@/lib/types";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 3600;

export default async function Home() {
  const [sanityFaq, siteSettings, sanityTestimonials] = await Promise.all([
    getFAQItems(),
    getSiteSettings(),
    getTestimonials(),
  ]);

  // FAQ: use Sanity if available, otherwise JSON fallback
  const faqItems: FAQItem[] =
    sanityFaq.length > 0
      ? sanityFaq.map((item, i) => ({
          id: `faq-${i}`,
          question: item.question,
          answer: item.answer,
        }))
      : (faqFallback as FAQItem[]);

  // Site settings: merge Sanity values with JSON fallback defaults
  const heroSubtitle =
    siteSettings?.heroSubtitle ?? siteContentFallback.hero?.subtitle ?? null;
  const ctaHeading1 =
    siteSettings?.ctaHeading1 ?? siteContentFallback.cta?.heading1 ?? null;
  const ctaHeading2 =
    siteSettings?.ctaHeading2 ?? siteContentFallback.cta?.heading2 ?? null;
  const ctaDescription =
    siteSettings?.ctaDescription ?? siteContentFallback.cta?.description ?? null;
  const coverageDescription =
    siteSettings?.coverageDescription ?? siteContentFallback.coverage?.description ?? null;

  // Map data: Sanity or JSON fallback
  const activeStates = siteSettings?.activeStates ?? mapFallback.activeStates;
  const pastStates = siteSettings?.pastStates ?? mapFallback.pastStates;

  // Testimonials: Sanity or JSON fallback
  const testimonials =
    sanityTestimonials.length > 0
      ? sanityTestimonials
      : testimonialsFallback.map((t) => ({
          quote: t.quote,
          name: t.name,
          jobTitle: t.title,
          company: t.company,
          metric: t.metric,
        }));

  return (
    <HomeClient
      faqItems={faqItems}
      heroSubtitle={heroSubtitle}
      ctaHeading1={ctaHeading1}
      ctaHeading2={ctaHeading2}
      ctaDescription={ctaDescription}
      coverageDescription={coverageDescription}
      activeStates={activeStates}
      pastStates={pastStates}
      testimonials={testimonials}
    />
  );
}
