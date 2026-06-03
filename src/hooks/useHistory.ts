import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addHistory, clearHistory } from '../store/slices/historySlice';
import { selectHistoryRecords } from '../store/selectors/historySelectors';

export function useHistory() {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectHistoryRecords);

  const recordVisit = useCallback(
    (mangaId: string) => dispatch(addHistory(mangaId)),
    [dispatch]
  );

  const clearAll = useCallback(() => dispatch(clearHistory()), [dispatch]);

  return { records, recordVisit, clearAll };
}
