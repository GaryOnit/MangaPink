import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToHistory, clearHistory } from '../store/slices/historySlice';
import type { HistoryEntry } from '../store/slices/historySlice';
import { selectHistoryEntries } from '../store/selectors/historySelectors';

export function useHistory() {
  const dispatch = useAppDispatch();
  const historyList: HistoryEntry[] = useAppSelector(selectHistoryEntries);

  const addHistoryEntry = useCallback(
    (mangaId: string, chapterId: string) =>
      dispatch(addToHistory({ mangaId, chapterId })),
    [dispatch]
  );

  const clearAll = useCallback(() => dispatch(clearHistory()), [dispatch]);

  return { historyList, addHistoryEntry, clearAll };
}
