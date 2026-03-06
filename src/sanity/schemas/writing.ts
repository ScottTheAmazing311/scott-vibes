import { defineType, defineField } from "sanity";

export const writingPiece = defineType({
  name: "writingPiece",
  title: "Writing Piece",
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
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Screenplay", value: "screenplay" },
          { title: "Short Story", value: "short-story" },
          { title: "Novel Excerpt", value: "novel" },
          { title: "Essay", value: "essay" },
          { title: "Poetry", value: "poetry" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt / Teaser",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Full Text",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type" },
  },
});
