import type { RootState } from '../index';

export const selectHistoryRecords = (state: RootState) => state.history.records;

export const selectHistoryMangaIds = (state: RootState) =>
  state.history.records.map((r) => r.mangaId);
