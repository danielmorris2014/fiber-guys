import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Fiber Guys CMS")
    .items([
      // ── Site Settings — singleton (pinned, not a list) ──
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),

      S.divider(),

      // ── Homepage Content ──
      S.listItem()
        .title("Homepage Content")
        .id("homepage-content")
        .child(
          S.list()
            .title("Homepage Content")
            .items([
              S.documentTypeListItem("testimonial").title("Testimonials"),
              S.documentTypeListItem("faqItem").title("FAQ"),
            ])
        ),

      // ── Services & Projects ──
      S.listItem()
        .title("Services & Projects")
        .id("services-projects")
        .child(
          S.list()
            .title("Services & Projects")
            .items([
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("caseStudy").title("Case Studies"),
            ])
        ),

      // ── Careers ──
      S.documentTypeListItem("jobPosting").title("Careers"),

      S.divider(),

      // ── Media & Files ──
      S.listItem()
        .title("Media & Files")
        .id("media-files")
        .child(
          S.list()
            .title("Media & Files")
            .items([
              S.documentTypeListItem("galleryImage").title("Gallery Images"),
              S.documentTypeListItem("libraryDocument").title("Document Library"),
            ])
        ),
    ]);
