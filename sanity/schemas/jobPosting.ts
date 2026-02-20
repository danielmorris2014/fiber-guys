import { defineField, defineType } from "sanity";

export const jobPosting = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Nationwide, Austin TX, Remote",
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Contract", value: "contract" },
          { title: "Per Diem", value: "per-diem" },
          { title: "Seasonal", value: "seasonal" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full job description in rich text",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      description: "List of requirements (one per line)",
    }),
    defineField({
      name: "tags",
      title: "Tags / Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Skill tags displayed on the card",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Only active postings appear on the site",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      active: "active",
    },
    prepare({ title, location, active }) {
      return {
        title,
        subtitle: `${location || "No location"} ${active ? "" : " [INACTIVE]"}`,
      };
    },
  },
});
