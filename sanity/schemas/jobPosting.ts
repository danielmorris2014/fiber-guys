import { defineField, defineType } from "sanity";

export const jobPosting = defineType({
  name: "jobPosting",
  title: "Job Posting",
  type: "document",
  description:
    "Open positions shown on the Careers page. Each posting gets its own detail page at /careers/[slug]. Set Active to false to hide a posting without deleting it.",
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (rule) => rule.required(),
      description:
        'The position title shown on the card and detail page. Examples: "Fiber Jetting Operator", "Precision Splicer", "OSP Laborer / CDL Driver".',
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description:
        'Auto-generated from the title. This becomes the URL, e.g. /careers/fiber-jetting-operator. Click "Generate" after entering the title.',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        'Where this role is based. Examples: "Nationwide", "Austin, TX", "Southeast Region". Leave blank for fully remote/travel positions.',
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
      description: "The employment arrangement for this position.",
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Rich text description shown on the job detail page. Include responsibilities, day-to-day expectations, compensation range, and travel requirements.",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Key requirements listed as bullet points. One per item. Example: "3+ years OSP fiber construction experience".',
    }),
    defineField({
      name: "tags",
      title: "Skill Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Short skill badges shown on the job card. Examples: "CDL", "Fusion Splicing", "OTDR", "Travel Required". Keep each tag to 1-3 words.',
    }),
    defineField({
      name: "salaryMin",
      title: "Pay Range — Minimum",
      type: "number",
      description:
        'Minimum pay for this role. Leave blank to hide pay range on the listing. Example: 25 (for $25/hr) or 55000 (for $55,000/yr).',
    }),
    defineField({
      name: "salaryMax",
      title: "Pay Range — Maximum",
      type: "number",
      description:
        "Maximum pay for this role. If only minimum is set, the range shows as 'From $X'. If both are set, shows '$X – $Y'.",
    }),
    defineField({
      name: "salaryType",
      title: "Pay Type",
      type: "string",
      options: {
        list: [
          { title: "Hourly", value: "hourly" },
          { title: "Annual", value: "annual" },
          { title: "Per Diem", value: "per-diem" },
        ],
      },
      description:
        'How pay is structured. Determines the label shown (e.g. "/hr", "/yr", "/day").',
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description:
        "Only active postings are visible on the website. Set to false to hide a posting without deleting it — useful when a role is filled but may reopen.",
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
