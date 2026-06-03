import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToBookshelf as addToBookshelfAction,
  removeFromBookshelf as removeFromBookshelfAction,
  updateLastRead as updateLastReadAction,
} from '../store/slices/bookshelfSlice';
import type { BookshelfEntry } from '../store/slices/bookshelfSlice';
import {
  selectBookshelfEntries,
  selectBookshelfList,
} from '../store/selectors/bookshelfSelectors';

export function useBookshelf() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectBookshelfEntries);
  const bookshelfList: BookshelfEntry[] = useAppSelector(selectBookshelfList);

  const isInBookshelf = useCallback(
    (mangaId: string): boolean => !!entries[mangaId],
    [entries]
  );

  const addToShelf = useCallback(
    (mangaId: string) => dispatch(addToBookshelfAction(mangaId)),
    [dispatch]
  );

  const removeFromShelf = useCallback(
    (mangaId: string) => dispatch(removeFromBookshelfAction(mangaId)),
    [dispatch]
  );

  const updateLastRead = useCallback(
    (mangaId: string, chapterId: string, page: number) =>
      dispatch(updateLastReadAction({ mangaId, chapterId, page })),
    [dispatch]
  );

  return { bookshelfList, isInBookshelf, addToShelf, removeFromShelf, updateLastRead };
}
