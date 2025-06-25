import { getCollection } from "astro:content";

export async function getSortedNotes() {
  const allNotes = await getCollection("notes", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const sorted = allNotes.sort((a, b) => {
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });
  return sorted;
}
