import type { RootState } from '../index';
import type { HistoryEntry } from '../slices/historySlice';

export const selectHistoryEntries = (state: RootState): HistoryEntry[] =>
  state.history.entries;

export const selectHistoryMangaIds = (state: RootState): string[] =>
  state.history.entries.map((e) => e.mangaId);

export const selectRecentHistory = (state: RootState, limit = 20): HistoryEntry[] =>
  state.history.entries.slice(0, limit);
