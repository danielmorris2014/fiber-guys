import { getSanityClient } from "./sanity.client";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface SanityJobPosting {
  _id: string;
  title: string;
  slug: string;
  location: string | null;
  type: string;
  description: unknown[]; // Portable Text blocks
  requirements: string[];
  tags: string[];
  active: boolean;
}

export interface SanityGalleryImage {
  _id: string;
  title: string;
  category: string;
  altText: string;
  description: string | null;
  location: string | null;
  order: number | null;
  imageUrl: string;
  lqip: string | null; // low-quality image placeholder
}

export interface SanityFAQItem {
  question: string;
  answer: string;
}

export interface SanitySiteSettings {
  heroSubtitle: string | null;
  ctaHeading1: string | null;
  ctaHeading2: string | null;
  ctaDescription: string | null;
  coverageDescription: string | null;
  activeStates: string[] | null;
  pastStates: string[] | null;
}

export interface SanityTestimonial {
  quote: string;
  name: string;
  jobTitle: string | null;
  company: string | null;
  metric: string | null;
}

export interface SanityService {
  _id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  icon: string | null;
  capabilities: { label: string; value: string }[] | null;
  deliverables: string[] | null;
  order: number | null;
}

/* ─────────────────────────────────────────────
   Job Postings
   ───────────────────────────────────────────── */

const JOBS_QUERY = `*[_type == "jobPosting" && active == true] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  location,
  type,
  description,
  requirements,
  tags,
  active
}`;

export async function getActiveJobs(): Promise<SanityJobPosting[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityJobPosting[]>(JOBS_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch jobs:", err);
    return [];
  }
}

const JOB_BY_SLUG_QUERY = `*[_type == "jobPosting" && slug.current == $slug && active == true][0] {
  _id,
  title,
  "slug": slug.current,
  location,
  type,
  description,
  requirements,
  tags,
  active
}`;

export async function getJobBySlug(slug: string): Promise<SanityJobPosting | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<SanityJobPosting | null>(JOB_BY_SLUG_QUERY, { slug });
  } catch (err) {
    console.warn("[Sanity] Failed to fetch job by slug:", err);
    return null;
  }
}

const ALL_JOB_SLUGS_QUERY = `*[_type == "jobPosting" && active == true] { "slug": slug.current }`;

export async function getAllJobSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    const results = await client.fetch<{ slug: string }[]>(ALL_JOB_SLUGS_QUERY);
    return results.map((r) => r.slug).filter(Boolean);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch job slugs:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Gallery Images
   ───────────────────────────────────────────── */

const GALLERY_QUERY = `*[_type == "galleryImage"] | order(order asc, _createdAt desc) {
  _id,
  title,
  category,
  altText,
  description,
  location,
  order,
  "imageUrl": image.asset->url,
  "lqip": image.asset->metadata.lqip
}`;

export async function getGalleryImages(): Promise<SanityGalleryImage[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityGalleryImage[]>(GALLERY_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch gallery images:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   FAQ Items
   ───────────────────────────────────────────── */

const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) { question, answer }`;

export async function getFAQItems(): Promise<SanityFAQItem[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityFAQItem[]>(FAQ_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch FAQ items:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Site Settings (singleton)
   ───────────────────────────────────────────── */

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  heroSubtitle,
  ctaHeading1,
  ctaHeading2,
  ctaDescription,
  coverageDescription,
  activeStates,
  pastStates
}`;

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<SanitySiteSettings | null>(SITE_SETTINGS_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch site settings:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────
   Testimonials
   ───────────────────────────────────────────── */

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(order asc) {
  quote,
  name,
  jobTitle,
  company,
  metric
}`;

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch testimonials:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Services
   ───────────────────────────────────────────── */

const SERVICES_QUERY = `*[_type == "service"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  tagline,
  description,
  features,
  icon,
  capabilities,
  deliverables,
  order
}`;

export async function getServices(): Promise<SanityService[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityService[]>(SERVICES_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch services:", err);
    return [];
  }
}

const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  tagline,
  description,
  features,
  icon,
  capabilities,
  deliverables,
  order
}`;

export async function getServiceBySlug(slug: string): Promise<SanityService | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<SanityService | null>(SERVICE_BY_SLUG_QUERY, { slug });
  } catch (err) {
    console.warn("[Sanity] Failed to fetch service by slug:", err);
    return null;
  }
}
