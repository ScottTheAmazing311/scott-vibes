import { defineType, defineField } from "sanity";

export const potpourriItem = defineType({
  name: "potpourriItem",
  title: "Potpourri Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Recipe", value: "recipe" },
          { title: "Thought", value: "thought" },
          { title: "Favorite Thing", value: "favorite" },
          { title: "Link", value: "link" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "url",
      title: "External Link",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
  orderings: [
    { title: "Published", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
