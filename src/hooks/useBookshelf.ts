import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToBookshelf,
  removeFromBookshelf,
  updateLatestChapter,
} from '../store/slices/bookshelfSlice';
import {
  selectBookshelfItems,
  selectBookshelfMangaIds,
} from '../store/selectors/bookshelfSelectors';

export function useBookshelf() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBookshelfItems);
  const mangaIds = useAppSelector(selectBookshelfMangaIds);

  const isInBookshelf = useCallback(
    (mangaId: string) => mangaIds.includes(mangaId),
    [mangaIds]
  );

  const addToShelf = useCallback(
    (mangaId: string, latestChapterId: string) =>
      dispatch(addToBookshelf({ mangaId, latestChapterId })),
    [dispatch]
  );

  const removeFromShelf = useCallback(
    (mangaId: string) => dispatch(removeFromBookshelf(mangaId)),
    [dispatch]
  );

  const updateLatest = useCallback(
    (mangaId: string, chapterId: string) =>
      dispatch(updateLatestChapter({ mangaId, chapterId })),
    [dispatch]
  );

  return { items, isInBookshelf, addToShelf, removeFromShelf, updateLatest };
}
