import type { RootState } from '../index';

export const selectProgressByMangaId = (state: RootState, mangaId: string) =>
  state.readingProgress.progressMap[mangaId];

export const selectAllProgress = (state: RootState) => state.readingProgress.progressMap;
