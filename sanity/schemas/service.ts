import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  description:
    "Service offerings (Jetting, Splicing) displayed on the Services page and individual service detail pages. Edit existing services or add new ones.",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Capabilities & Deliverables" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Service Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
      description: 'The name of the service, e.g. "Fiber Jetting" or "Fiber Splicing".',
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description:
        'Auto-generated from the title. This becomes the URL path, e.g. /services/fiber-jetting. Click "Generate" to create it.',
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "content",
      description:
        "A one-line summary shown under the service title. Keep it punchy and benefit-focused.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "The main body text for the service page. Explain what the service is, how it works, and why it matters to the client.",
    }),
    defineField({
      name: "features",
      title: "Feature Bullets",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description:
        "Key capabilities listed as bullet points on the service page. One capability per item. Example: \"Core-alignment fusion splicing with ≤0.03dB splice loss standard\".",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities Grid",
      type: "array",
      group: "details",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'The metric name, e.g. "Daily Output"',
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'The metric value, e.g. "15,000–25,000 ft"',
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      description:
        "Displayed as a label → value grid on the service page. Use for quantifiable stats like daily output, fiber counts, etc.",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description:
        'Items included with every project — documentation, test results, etc. One deliverable per item. Example: "OTDR trace documentation for every strand spliced".',
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      group: "media",
      options: {
        list: [
          { title: "Cable (for Jetting)", value: "cable" },
          { title: "Zap (for Splicing)", value: "zap" },
        ],
      },
      description: "Icon shown on the services overview page next to this service.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Optional hero image for the service detail page. Use a high-quality field photo that represents this service.",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      group: "content",
      initialValue: 0,
      description: "Controls display order. Lower numbers appear first. Jetting = 1, Splicing = 2, etc.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline" },
  },
});
