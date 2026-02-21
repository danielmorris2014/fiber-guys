import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  description:
    "Client testimonials displayed on the homepage. Each one shows as a quote card with an optional performance metric badge.",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (rule) => rule.required(),
      description:
        "The client's testimonial in their own words. Two to three sentences works best.",
    }),
    defineField({
      name: "name",
      title: "Person's Name",
      type: "string",
      validation: (rule) => rule.required(),
      description: "Full name of the person giving the testimonial.",
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      description: 'Their role, e.g. "Project Manager", "OSP Director".',
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      description: "The company or contractor they work for.",
    }),
    defineField({
      name: "metric",
      title: "Performance Metric",
      type: "string",
      description:
        'A short stat that appears as a highlighted badge on the card. Examples: "40K ft in 3 days", "288ct splice in 48hrs", "Zero rework". Leave blank if not applicable.',
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first on the homepage.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "company" },
  },
});
