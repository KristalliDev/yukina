import { getCollection } from "astro:content";
import { IdToSlug } from "./hash";

/**
 * Represents an note item with a title, slug, date, and optional tags.
 */
export interface Notes {
  title: string;
  id: string;
  date: Date;
  tags?: string[];
}

/**
 * Represents a tag used to categorize content.
 */
export interface Tag {
  name: string;
  slug: string;
  notes: Notes[];
}

/**
 * Represents a category of content.
 */
export interface Category {
  name: string;
  slug: string;
  notes: Notes[];
}

/**
 * Retrieves and sorts blog notes by their published date.
 *
 * This function fetches all blog notes from the "notes" collection, filters out drafts if in production mode,
 * and sorts them in descending order by their published date. It also adds `nextSlug`, `nextTitle`, `prevSlug`,
 * and `prevTitle` properties to each note for navigation purposes.
 *
 * @returns A promise that resolves to an array of sorted blog notes with navigation properties.
 */
export async function GetSortednotes() {
  const allBlognotes = await getCollection("notes", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const sorted = allBlognotes.sort((a, b) => {
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });

  for (let i = 1; i < sorted.length; i++) {
    (sorted[i].data as any).nextSlug = (sorted[i - 1] as any).slug;
    (sorted[i].data as any).nextTitle = sorted[i - 1].data.title;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    (sorted[i].data as any).prevSlug = (sorted[i + 1] as any).slug;
    (sorted[i].data as any).prevTitle = sorted[i + 1].data.title;
  }

  return sorted;
}

/**
 * Retrieves and organizes blog note notes.
 *
 * This function fetches all blog notes from the "notes" collection, filters them based on the environment
 * (excluding drafts in production), and organizes them into a map of notes grouped by year.
 * Each note entry contains the note's title, slug, publication date, and tags.
 * The notes are sorted in descending order by year and by date within each year.
 *
 * @returns A promise that resolves to a map of notes grouped by year.
 */
export async function GetNotes() {
  const allBlognotes = await getCollection("notes", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const notes = new Map<number, Notes[]>();

  for (const note of allBlognotes) {
    const date = new Date(note.data.published);
    const year = date.getFullYear();
    if (!notes.has(year)) {
      notes.set(year, []);
    }
    notes.get(year)!.push({
      title: note.data.title,
      id: `/notes/${IdToSlug(note.id)}`,
      date: date,
      tags: note.data.tags,
    });
  }

  const sortedNotes = new Map(
    [...notes.entries()].sort((a, b) => b[0] - a[0]),
  );
  sortedNotes.forEach((value) => {
    value.sort((a, b) => (a.date > b.date ? -1 : 1));
  });

  return sortedNotes;
}

/**
 * Retrieves all tags from blog notes.
 *
 * This function fetches all blog notes from the "notes" collection and extracts tags from each note.
 * It then organizes the tags into a map where each tag is associated with its metadata and the notes that have that tag.
 *
 * @returns A promise that resolves to a map of tags. Each key is a tag slug, and the value is an object containing the tag's name, slug, and associated notes.
 */
export async function GetTags() {
  const allBlognotes = await getCollection("notes", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const tags = new Map<string, Tag>();
  allBlognotes.forEach((note) => {
    note.data.tags?.forEach((tag: string) => {
      const tagSlug = IdToSlug(tag);
      if (!tags.has(tagSlug)) {
        tags.set(tagSlug, {
          name: tag,
          slug: `/tags/${tagSlug}`,
          notes: [],
        });
      }
      tags.get(tagSlug)!.notes.push({
        title: note.data.title,
        id: `/notes/${IdToSlug(note.id)}`,
        date: new Date(note.data.published),
        tags: note.data.tags,
      });
    });
  });

  return tags;
}

/**
 * Retrieves all blog note categories and their associated notes.
 *
 * This function fetches all blog notes from the "notes" collection and filters them based on the environment.
 * In production, it excludes drafts. It then organizes the notes into categories and returns a map of categories.
 *
 * @returns A promise that resolves to a map of categories, where each category contains its name, slug, and associated notes.
 */
export async function GetCategories() {
  const allBlognotes = await getCollection("notes", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const categories = new Map<string, Category>();

  allBlognotes.forEach((note) => {
    if (!note.data.category) return;
    const categorySlug = IdToSlug(note.data.category);

    if (!categories.has(categorySlug)) {
      categories.set(categorySlug, {
        name: note.data.category,
        slug: `/categories/${categorySlug}`,
        notes: [],
      });
    }
    categories.get(categorySlug)!.notes.push({
      title: note.data.title,
      id: `/notes/${IdToSlug(note.id)}`,
      date: new Date(note.data.published),
      tags: note.data.tags,
    });
  });

  return categories;
}
