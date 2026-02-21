// JSON files are fallback only — primary source is Sanity CMS
import { getFAQItems, getSiteSettings, getTestimonials, getMapProjects } from "@/lib/sanity.queries";
import faqFallback from "@/content/faq.json";
import testimonialsFallback from "@/content/testimonials.json";
import siteContentFallback from "@/content/site-content.json";
import mapFallback from "@/content/map.json";
import type { FAQItem } from "@/lib/types";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 3600;

export default async function Home() {
  const [sanityFaq, siteSettings, sanityTestimonials, mapProjects] = await Promise.all([
    getFAQItems(),
    getSiteSettings(),
    getTestimonials(),
    getMapProjects(),
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

  // Map data: only use JSON fallback when Sanity is not configured (siteSettings is null).
  // When Sanity IS configured, respect whatever the CMS has — even empty arrays.
  const activeStates = siteSettings
    ? (siteSettings.activeStates ?? [])
    : mapFallback.activeStates;
  const pastStates = siteSettings
    ? (siteSettings.pastStates ?? [])
    : mapFallback.pastStates;

  // Hiring strip
  const hiringStripActive = siteSettings?.hiringStripActive ?? false;
  const hiringStripText = siteSettings?.hiringStripText ?? null;

  // Stats & Process (null = use component defaults)
  const stats = siteSettings?.stats ?? null;
  const processSteps = siteSettings?.processSteps ?? null;

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
      hiringStripActive={hiringStripActive}
      hiringStripText={hiringStripText}
      mapProjects={mapProjects}
      stats={stats}
      processSteps={processSteps}
    />
  );
}
