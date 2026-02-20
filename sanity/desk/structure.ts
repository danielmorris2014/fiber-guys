import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings — singleton (pinned, not a list)
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

      // Standard document lists
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("faqItem").title("FAQ"),
      S.documentTypeListItem("testimonial").title("Testimonials"),

      S.divider(),

      S.documentTypeListItem("jobPosting").title("Job Postings"),
      S.documentTypeListItem("galleryImage").title("Gallery Images"),
    ]);
