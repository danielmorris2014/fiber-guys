import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      description: "e.g. 288ct Ribbon Splice — Atlanta, GA",
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
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      type: "string",
      description: "Descriptive alt text for SEO and accessibility",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Short description for hover overlay",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Austin, TX",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
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
