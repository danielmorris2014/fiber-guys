import type { MetadataRoute } from "next";

const BASE_URL = "https://fiberguys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/gallery",
    "/request",
    "/about",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/request" ? 0.9 : 0.8,
  }));
}
