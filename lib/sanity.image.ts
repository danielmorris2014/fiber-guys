import imageUrlBuilder from "@sanity/image-url";
import { getSanityClient } from "./sanity.client";

export function urlFor(source: { asset: { _ref: string } }) {
  const client = getSanityClient();
  if (!client) return null;
  return imageUrlBuilder(client).image(source);
}
