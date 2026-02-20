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

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

/* (configuration check is now inside getSanityClient) */

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
