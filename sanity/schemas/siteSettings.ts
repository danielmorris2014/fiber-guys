import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      description: "Subtitle text under the hero animation",
    }),
    defineField({
      name: "ctaHeading1",
      title: "CTA Heading Line 1",
      type: "string",
      initialValue: "Send Prints.",
    }),
    defineField({
      name: "ctaHeading2",
      title: "CTA Heading Line 2",
      type: "string",
      initialValue: "Get a Schedule.",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverageDescription",
      title: "Coverage Description",
      type: "text",
      rows: 2,
      description: "Text shown on the coverage map section",
    }),
    defineField({
      name: "activeStates",
      title: "Active States",
      type: "array",
      of: [{ type: "string" }],
      description: "States where crews are currently operating",
    }),
    defineField({
      name: "pastStates",
      title: "Past States",
      type: "array",
      of: [{ type: "string" }],
      description: "States where crews have previously worked",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
