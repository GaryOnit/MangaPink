import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HISTORY_MAX_RECORDS } from '../../utils/constants';

export interface HistoryRecord {
  mangaId: string;
  visitedAt: number;
}

export interface HistoryState {
  records: HistoryRecord[];
}

const initialState: HistoryState = {
  records: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<string>) => {
      const mangaId = action.payload;
      // 移除已存在的记录（避免重复）
      state.records = state.records.filter((r) => r.mangaId !== mangaId);
      // 插入最新记录到头部
      state.records.unshift({ mangaId, visitedAt: Date.now() });
      // 限制最大条数
      if (state.records.length > HISTORY_MAX_RECORDS) {
        state.records = state.records.slice(0, HISTORY_MAX_RECORDS);
      }
    },
    clearHistory: (state) => {
      state.records = [];
    },
  },
});

export const { addHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
