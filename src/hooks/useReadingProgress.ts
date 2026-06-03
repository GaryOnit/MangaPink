import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProgress, clearProgress } from '../store/slices/readingProgressSlice';
import { selectProgressByMangaId } from '../store/selectors/readingProgressSelectors';

export function useReadingProgress(mangaId: string) {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => selectProgressByMangaId(state, mangaId));

  const saveProgress = useCallback(
    (chapterId: string, pageIndex: number, totalPages: number) => {
      dispatch(updateProgress({ mangaId, chapterId, pageIndex, totalPages }));
    },
    [dispatch, mangaId]
  );

  const clearMangaProgress = useCallback(() => {
    dispatch(clearProgress(mangaId));
  }, [dispatch, mangaId]);

  return { progress, saveProgress, clearMangaProgress };
}
