import { defineField, defineType } from "sanity";
import { US_STATES_OPTIONS } from "./constants";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  description:
    "Completed project showcases with performance metrics. Each case study gets its own page at /case-studies/[slug]. Focus on measurable results — footage placed, splices completed, timeline.",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "metrics", title: "Performance Metrics" },
    { name: "content", title: "Write-Up & Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
      description:
        'A descriptive project name. Example: "864ct Metro Ring Build — Kansas City" or "FTTH Distribution — Rural Georgia".',
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description:
        'Auto-generated from the title. Click "Generate" after entering the title.',
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      group: "overview",
      options: {
        list: US_STATES_OPTIONS,
        layout: "dropdown",
      },
      description:
        "The US state where this project was completed. Used to link projects to the interactive coverage map — when someone clicks a state, they see projects from that state.",
    }),
    defineField({
      name: "location",
      title: "Location (City)",
      type: "string",
      group: "overview",
      description: 'City or region name for display. Example: "Kansas City", "Rural Southeast Georgia".',
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
      group: "overview",
      description: "When the project was completed. Used for sorting (newest first) and display.",
    }),
    defineField({
      name: "clientType",
      title: "Client Type",
      type: "string",
      group: "overview",
      description:
        'The type of client (not the client name). Examples: "Tier 1 ISP", "Municipal Utility", "General Contractor", "ILEC".',
    }),

    // ── Metrics ──
    defineField({
      name: "totalFootage",
      title: "Total Footage",
      type: "number",
      group: "metrics",
      description:
        "Total feet of fiber placed or spliced on this project. Enter the number only (no commas) — it will be formatted automatically on the site.",
    }),
    defineField({
      name: "spliceCount",
      title: "Splice Count",
      type: "number",
      group: "metrics",
      description:
        "Total number of individual splices completed. Enter the number only.",
    }),
    defineField({
      name: "duration",
      title: "Duration / Timeline",
      type: "string",
      group: "metrics",
      description:
        'How long the project took. Use a short format like "14 days", "3 weeks", or "6 months".',
    }),

    // ── Content ──
    defineField({
      name: "description",
      title: "Project Write-Up",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      description:
        "Full project description in rich text. Cover the scope, challenges, approach, and outcome. This is displayed on the case study detail page.",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      description:
        "A single representative photo from the project. Used as the card image on the index page and the hero image on the detail page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "featuredImage",
    },
  },
});
