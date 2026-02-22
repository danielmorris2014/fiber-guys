import { createClient, type SanityClient } from "next-sanity";

let _client: SanityClient | null = null;

/**
 * Returns the Sanity client, or null if NEXT_PUBLIC_SANITY_PROJECT_ID
 * is not set. This avoids crashing at module-eval time when Sanity
 * hasn't been configured yet.
 *
 * useCdn is always false — this ensures fresh data after CMS edits.
 * For a low-traffic site the API overhead is negligible.
 */
export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  if (!_client) {
    _client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: false,
    });
  }

  return _client;
}
