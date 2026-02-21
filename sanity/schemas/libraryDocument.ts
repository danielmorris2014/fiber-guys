import { defineField, defineType } from "sanity";

export const libraryDocument = defineType({
  name: "libraryDocument",
  title: "Document",
  type: "document",
  description:
    "Compliance and qualification documents (COI, W-9, safety manual, certs) that office staff can share with clients and GCs. The /documents page is unlisted — only people with the direct link can access it.",
  fields: [
    defineField({
      name: "title",
      title: "Document Title",
      type: "string",
      validation: (rule) => rule.required(),
      description:
        'A clear title for the document. Examples: "Certificate of Insurance — 2025", "Company W-9", "OSHA 30 Certification".',
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Insurance / COI", value: "insurance" },
          { title: "Safety Manual", value: "safety" },
          { title: "W-9", value: "w9" },
          { title: "Certifications", value: "certifications" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
      description:
        "Which category this document belongs to. Documents are grouped by category on the /documents page.",
    }),
    defineField({
      name: "file",
      title: "PDF File",
      type: "file",
      options: {
        accept: ".pdf",
      },
      validation: (rule) => rule.required(),
      description:
        "Upload the PDF. When a visitor clicks this document on the site, it will download directly.",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description:
        "When this document was last revised or renewed. Displayed on the site so clients know they have the current version.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
