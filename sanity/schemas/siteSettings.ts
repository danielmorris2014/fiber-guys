import { defineField, defineType } from "sanity";
import { US_STATES_OPTIONS } from "./constants";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact Info", default: true },
    { name: "homepage", title: "Homepage" },
    { name: "coverage", title: "Coverage Map" },
    { name: "careers", title: "Careers Page" },
    { name: "announcements", title: "Announcements" },
    { name: "thankyou", title: "Thank You Page" },
  ],
  fields: [
    // ═══════════════════════════════════════════
    //  CONTACT INFO
    // ═══════════════════════════════════════════
    defineField({
      name: "contactEmail",
      title: "General Email",
      type: "string",
      group: "contact",
      initialValue: "info@fiberguysllc.com",
      description:
        'The primary contact email shown in the Nav, Footer, and Contact page. Default: "info@fiberguysllc.com".',
    }),
    defineField({
      name: "careersEmail",
      title: "Careers Email",
      type: "string",
      group: "contact",
      initialValue: "careers@fiberguysllc.com",
      description:
        'Email for job applications (shown on the Careers page). Default: "careers@fiberguysllc.com".',
    }),
    defineField({
      name: "companyLocation",
      title: "Company Location",
      type: "string",
      group: "contact",
      initialValue: "Granger, TX",
      description:
        'Short location shown in the mobile Nav and structured data. Default: "Granger, TX".',
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "text",
      rows: 2,
      group: "contact",
      initialValue:
        "Production-focused fiber placement and precision splicing. Built for the heavy lift.",
      description:
        "The short description under the logo in the footer.",
    }),

    // ═══════════════════════════════════════════
    //  HOMEPAGE
    // ═══════════════════════════════════════════
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      group: "homepage",
      description:
        "The subtitle text under the main hero heading. Keep it short — one or two lines.",
    }),
    defineField({
      name: "ctaHeading1",
      title: "CTA Heading — Line 1",
      type: "string",
      group: "homepage",
      initialValue: "Send Prints.",
      description:
        'First line of the bottom CTA block. Default: "Send Prints."',
    }),
    defineField({
      name: "ctaHeading2",
      title: "CTA Heading — Line 2",
      type: "string",
      group: "homepage",
      initialValue: "Get a Schedule.",
      description:
        'Second line of the CTA heading. Default: "Get a Schedule."',
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Description",
      type: "text",
      rows: 3,
      group: "homepage",
      description:
        "Supporting paragraph under the CTA heading.",
    }),

    // ── Homepage Stats ──
    defineField({
      name: "stats",
      title: "Homepage Stats",
      type: "array",
      group: "homepage",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: 'The number/stat displayed. Examples: "15M+", "99%", ".03dB".' }),
            defineField({ name: "label", title: "Label", type: "string", description: 'Short label below the stat. Examples: "Feet Placed", "First-Pass Rate".' }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      description:
        "The 4 credential stats shown in the proof strip on the homepage (e.g. 15M+ Feet Placed). Leave empty to use defaults.",
    }),

    // ── Process Steps ──
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      group: "homepage",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Step Title", type: "string", description: 'Short title, e.g. "Scope & Verify", "Mobilize".' }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3, description: "One or two sentences explaining this step." }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
      description:
        'The 5-step process shown on the homepage ("The Protocol" section). Steps are auto-numbered 01–05. Leave empty to use defaults.',
    }),

    // ── Hiring Strip ──
    defineField({
      name: "hiringStripActive",
      title: "Hiring Strip Active",
      type: "boolean",
      group: "homepage",
      initialValue: false,
      description:
        "Toggle ON to show the hiring banner on the homepage. Toggle OFF when not actively hiring.",
    }),
    defineField({
      name: "hiringStripText",
      title: "Hiring Strip Text",
      type: "string",
      group: "homepage",
      description:
        'Message in the hiring strip. Example: "Now Hiring — Jetting Operators & Precision Splicers".',
    }),

    // ═══════════════════════════════════════════
    //  COVERAGE MAP
    // ═══════════════════════════════════════════
    defineField({
      name: "coverageDescription",
      title: "Coverage Description",
      type: "text",
      rows: 2,
      group: "coverage",
      description:
        "Paragraph above the US map on the Contact page and homepage.",
    }),
    defineField({
      name: "activeStates",
      title: "Active Deployment States",
      type: "array",
      group: "coverage",
      of: [{ type: "string", options: { list: US_STATES_OPTIONS } }],
      description:
        "States where crews are CURRENTLY deployed (bright blue on the map).",
    }),
    defineField({
      name: "pastStates",
      title: "Previous Deployment States",
      type: "array",
      group: "coverage",
      of: [{ type: "string", options: { list: US_STATES_OPTIONS } }],
      description:
        "States where crews have PREVIOUSLY worked (lighter shade on the map).",
    }),

    // ═══════════════════════════════════════════
    //  CAREERS PAGE
    // ═══════════════════════════════════════════
    defineField({
      name: "careersBenefits",
      title: "Benefits",
      type: "array",
      group: "careers",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Health / Medical", value: "health" },
                  { title: "Dollar / Pay", value: "dollar" },
                  { title: "Truck / Equipment", value: "equipment" },
                  { title: "Plane / Travel", value: "travel" },
                  { title: "Growth / Trending Up", value: "growth" },
                  { title: "Training / Graduation", value: "training" },
                  { title: "Shield / Safety", value: "safety" },
                  { title: "Wrench / Tools", value: "tools" },
                  { title: "Clock / Time", value: "time" },
                  { title: "Home / Housing", value: "housing" },
                  { title: "Users / Team", value: "team" },
                  { title: "Zap / Energy", value: "zap" },
                  { title: "Award / Recognition", value: "award" },
                  { title: "Badge / Certification", value: "badge" },
                ],
              },
              description: "Choose an icon for this benefit.",
            }),
            defineField({ name: "title", title: "Title", type: "string", description: 'Benefit name. Examples: "Health Insurance", "Per Diem".' }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2, description: "One or two sentences about this benefit." }),
          ],
          preview: {
            select: { title: "title", subtitle: "description", icon: "icon" },
            prepare({ title, subtitle, icon }) {
              return { title: `[${icon || "—"}] ${title || "Untitled"}`, subtitle };
            },
          },
        },
      ],
      description:
        "Benefits shown on the Careers page. Leave empty to use defaults (health, per diem, equipment, travel pay).",
    }),
    defineField({
      name: "careersFAQ",
      title: "Careers FAQ",
      type: "array",
      group: "careers",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        },
      ],
      description:
        "Frequently asked questions shown on the Careers page. Leave empty to use defaults.",
    }),
    defineField({
      name: "referralActive",
      title: "Referral Program Active",
      type: "boolean",
      group: "careers",
      initialValue: false,
      description:
        "Toggle ON to show the referral program section on the Careers page.",
    }),
    defineField({
      name: "referralBonusAmount",
      title: "Referral Bonus Amount",
      type: "string",
      group: "careers",
      initialValue: "$500",
      description:
        'The bonus amount displayed in the referral section. Example: "$500".',
    }),
    defineField({
      name: "referralDescription",
      title: "Referral Description",
      type: "text",
      rows: 3,
      group: "careers",
      description:
        "Paragraph explaining how the referral program works.",
    }),

    // ═══════════════════════════════════════════
    //  ANNOUNCEMENTS
    // ═══════════════════════════════════════════
    defineField({
      name: "announcementActive",
      title: "Banner Active",
      type: "boolean",
      group: "announcements",
      initialValue: false,
      description: "Toggle ON to show the announcement banner site-wide.",
    }),
    defineField({
      name: "announcementText",
      title: "Banner Text",
      type: "string",
      group: "announcements",
      description:
        'Blue banner at the top of every page. Example: "Now hiring splicers — apply on our Careers page."',
    }),

    // ═══════════════════════════════════════════
    //  THANK YOU PAGE
    // ═══════════════════════════════════════════
    defineField({
      name: "thankYouHeading",
      title: "Heading",
      type: "string",
      group: "thankyou",
      initialValue: "Request received.",
      description: "Main heading on the thank-you page after form submission.",
    }),
    defineField({
      name: "thankYouMessage",
      title: "Message",
      type: "text",
      rows: 3,
      group: "thankyou",
      initialValue:
        "We've got your project details and will review them shortly. Expect to hear from us within one business day with crew availability and next steps.",
      description: "Body text shown under the heading.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
