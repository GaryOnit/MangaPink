import type { RootState } from '../index';

export const selectBookshelfItems = (state: RootState) => state.bookshelf.items;

export const selectBookshelfMangaIds = (state: RootState) =>
  state.bookshelf.items.map((item) => item.mangaId);

export const selectIsInBookshelf = (state: RootState, mangaId: string) =>
  state.bookshelf.items.some((item) => item.mangaId === mangaId);
