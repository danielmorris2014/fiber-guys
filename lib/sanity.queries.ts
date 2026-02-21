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
  // Contact
  contactEmail: string | null;
  careersEmail: string | null;
  companyLocation: string | null;
  footerTagline: string | null;
  // Homepage
  heroSubtitle: string | null;
  ctaHeading1: string | null;
  ctaHeading2: string | null;
  ctaDescription: string | null;
  stats: { value: string; label: string }[] | null;
  processSteps: { title: string; description: string }[] | null;
  hiringStripActive: boolean | null;
  hiringStripText: string | null;
  // Coverage
  coverageDescription: string | null;
  activeStates: string[] | null;
  pastStates: string[] | null;
  // Announcements
  announcementText: string | null;
  announcementActive: boolean | null;
  // Thank You
  thankYouHeading: string | null;
  thankYouMessage: string | null;
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

export interface SanityCaseStudy {
  _id: string;
  title: string;
  slug: string;
  state: string | null;
  location: string | null;
  completionDate: string | null;
  totalFootage: number | null;
  spliceCount: number | null;
  duration: string | null;
  clientType: string | null;
  description: unknown[] | null; // Portable Text blocks
  featuredImageUrl: string | null;
  featuredImageLqip: string | null;
}

/** Lightweight case study data for the interactive coverage map */
export interface MapProject {
  title: string;
  slug: string;
  state: string;
  location: string | null;
  totalFootage: number | null;
  spliceCount: number | null;
}

export interface SanityLibraryDocument {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
  lastUpdated: string | null;
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
  contactEmail,
  careersEmail,
  companyLocation,
  footerTagline,
  heroSubtitle,
  ctaHeading1,
  ctaHeading2,
  ctaDescription,
  stats,
  processSteps,
  hiringStripActive,
  hiringStripText,
  coverageDescription,
  activeStates,
  pastStates,
  announcementText,
  announcementActive,
  thankYouHeading,
  thankYouMessage
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

/* ─────────────────────────────────────────────
   Case Studies
   ───────────────────────────────────────────── */

const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(completionDate desc) {
  _id,
  title,
  "slug": slug.current,
  state,
  location,
  completionDate,
  totalFootage,
  spliceCount,
  duration,
  clientType,
  description,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageLqip": featuredImage.asset->metadata.lqip
}`;

export async function getCaseStudies(): Promise<SanityCaseStudy[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityCaseStudy[]>(CASE_STUDIES_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch case studies:", err);
    return [];
  }
}

const CASE_STUDY_BY_SLUG_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  state,
  location,
  completionDate,
  totalFootage,
  spliceCount,
  duration,
  clientType,
  description,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageLqip": featuredImage.asset->metadata.lqip
}`;

export async function getCaseStudyBySlug(slug: string): Promise<SanityCaseStudy | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<SanityCaseStudy | null>(CASE_STUDY_BY_SLUG_QUERY, { slug });
  } catch (err) {
    console.warn("[Sanity] Failed to fetch case study by slug:", err);
    return null;
  }
}

const ALL_CASE_STUDY_SLUGS_QUERY = `*[_type == "caseStudy"] { "slug": slug.current }`;

export async function getAllCaseStudySlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    const results = await client.fetch<{ slug: string }[]>(ALL_CASE_STUDY_SLUGS_QUERY);
    return results.map((r) => r.slug).filter(Boolean);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch case study slugs:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Map Projects (lightweight for coverage map)
   ───────────────────────────────────────────── */

const MAP_PROJECTS_QUERY = `*[_type == "caseStudy" && defined(state)] | order(completionDate desc) {
  title,
  "slug": slug.current,
  state,
  location,
  totalFootage,
  spliceCount
}`;

export async function getMapProjects(): Promise<MapProject[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<MapProject[]>(MAP_PROJECTS_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch map projects:", err);
    return [];
  }
}

/* ─────────────────────────────────────────────
   Document Library
   ───────────────────────────────────────────── */

const DOCUMENTS_QUERY = `*[_type == "libraryDocument"] | order(category asc, title asc) {
  _id,
  title,
  category,
  "fileUrl": file.asset->url,
  lastUpdated
}`;

export async function getDocuments(): Promise<SanityLibraryDocument[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<SanityLibraryDocument[]>(DOCUMENTS_QUERY);
  } catch (err) {
    console.warn("[Sanity] Failed to fetch documents:", err);
    return [];
  }
}
