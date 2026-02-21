import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  description:
    "Photos displayed on the Field Work (Gallery) page. Images are shown in a masonry grid and can be filtered by category. Upload high-quality photos — they will be optimized automatically.",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      description:
        "Upload a high-resolution photo. Use the hotspot tool to set the focal point for cropping on different screen sizes.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      description:
        'A short descriptive title shown on hover. Include the work type and location. Example: "288ct Ribbon Splice — Atlanta, GA".',
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Jetting", value: "jetting" },
          { title: "Splicing", value: "splicing" },
          { title: "Setup", value: "setup" },
          { title: "Closeout", value: "closeout" },
          { title: "Equipment", value: "equipment" },
          { title: "Crew", value: "crew" },
        ],
      },
      validation: (rule) => rule.required(),
      description:
        "Used for the filter tabs on the gallery page. Pick the category that best describes this photo.",
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      type: "string",
      description:
        "Describe what's in the photo for screen readers and SEO. Be specific — e.g. \"Technician operating a fiber jetting machine on a conduit run in rural Georgia\".",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Optional one-line description shown in the lightbox overlay when a visitor clicks on the photo.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Where this photo was taken. Format: "City, ST" (e.g. "Austin, TX").',
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description:
        "Controls display order in the gallery. Lower numbers appear first. Leave blank to sort by upload date.",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});
