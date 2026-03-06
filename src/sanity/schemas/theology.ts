import { defineType, defineField } from "sanity";

export const theologyEntry = defineType({
  name: "theologyEntry",
  title: "Theology Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Church Lesson", value: "lesson" },
          { title: "Video Essay", value: "video-essay" },
          { title: "Audio", value: "audio" },
          { title: "Written", value: "written" },
        ],
      },
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "audioUrl",
      title: "Audio URL (Google Drive or direct link)",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
  ],
  orderings: [
    { title: "Date", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "type" },
  },
});
