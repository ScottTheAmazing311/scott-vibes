import { defineType, defineField } from "sanity";

/** Wish lists sent from the Kid Zone Santa mail service. */
export const santaLetter = defineType({
  name: "santaLetter",
  title: "Santa Letter",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "kid", title: "From", type: "string" }),
    defineField({
      name: "wishes",
      title: "Wishes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Wish", type: "string" },
            { name: "stars", title: "How much (1-3)", type: "number" },
          ],
        },
      ],
    }),
    defineField({ name: "note", title: "Note to Santa", type: "text", rows: 3 }),
    defineField({ name: "year", title: "Year", type: "number" }),
  ],
  preview: {
    select: { title: "kid", subtitle: "year" },
    prepare: ({ title, subtitle }) => ({ title: `Letter from ${title}`, subtitle: String(subtitle) }),
  },
});
