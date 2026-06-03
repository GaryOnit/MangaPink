import type { RootState } from '../index';
import type { BookshelfEntry } from '../slices/bookshelfSlice';

export const selectBookshelfEntries = (state: RootState): Record<string, BookshelfEntry> =>
  state.bookshelf.entries;

export const selectBookshelfList = (state: RootState): BookshelfEntry[] =>
  Object.values(state.bookshelf.entries);

export const selectBookshelfMangaIds = (state: RootState): string[] =>
  Object.keys(state.bookshelf.entries);

export const selectIsInBookshelf = (state: RootState, mangaId: string): boolean =>
  mangaId in state.bookshelf.entries;

export const selectBookshelfEntry = (
  state: RootState,
  mangaId: string
): BookshelfEntry | undefined => state.bookshelf.entries[mangaId];
