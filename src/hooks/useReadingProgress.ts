import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { saveProgress, clearProgress } from '../store/slices/readingProgressSlice';
import type { ProgressEntry } from '../store/slices/readingProgressSlice';
import { selectProgressByKey } from '../store/selectors/readingProgressSelectors';

/**
 * 写操作：保存/清除进度
 */
export function useReadingProgress() {
  const dispatch = useAppDispatch();

  const saveProgressEntry = useCallback(
    (mangaId: string, chapterId: string, page: number) => {
      dispatch(saveProgress({ mangaId, chapterId, page }));
    },
    [dispatch]
  );

  const clearMangaProgress = useCallback(
    (mangaId: string) => {
      dispatch(clearProgress(mangaId));
    },
    [dispatch]
  );

  return { saveProgressEntry, clearMangaProgress };
}

/**
 * 读操作：获取特定章节进度
 */
export function useChapterProgress(
  mangaId: string,
  chapterId: string
): ProgressEntry | undefined {
  return useAppSelector((state) => selectProgressByKey(state, mangaId, chapterId));
}
