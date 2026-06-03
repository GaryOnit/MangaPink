import type { RootState } from '../index';
import type { ProgressEntry } from '../slices/readingProgressSlice';

export const selectAllProgress = (state: RootState): Record<string, ProgressEntry> =>
  state.readingProgress.progress;

export const selectProgressByKey = (
  state: RootState,
  mangaId: string,
  chapterId: string
): ProgressEntry | undefined => state.readingProgress.progress[`${mangaId}_${chapterId}`];

export const selectLatestProgressForManga = (
  state: RootState,
  mangaId: string
): ProgressEntry | undefined => {
  const allProgress = state.readingProgress.progress;
  const entries = Object.values(allProgress).filter((e) => e.mangaId === mangaId);
  if (entries.length === 0) return undefined;
  return entries.reduce((latest, curr) =>
    curr.updatedAt > latest.updatedAt ? curr : latest
  );
};
