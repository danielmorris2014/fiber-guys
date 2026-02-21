import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  description:
    "Frequently asked questions displayed on the homepage. Each item shows as an expandable accordion.",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
      description: "The question as a customer would ask it. Keep it conversational.",
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (rule) => rule.required(),
      description:
        "A clear, concise answer. Two to four sentences is ideal. Avoid jargon where possible.",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description:
        "Controls display order on the homepage. Lower numbers appear first. Leave at 0 and they will display in the order created.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "question", order: "order" },
    prepare({ title, order }) {
      return { title, subtitle: `Order: ${order ?? 0}` };
    },
  },
});
