import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const HISTORY_MAX = 50;

export interface HistoryEntry {
  mangaId: string;
  chapterId: string;
  readAt: number;
}

export interface HistoryState {
  entries: HistoryEntry[]; // 最近 50 条，LIFO
}

const initialState: HistoryState = {
  entries: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (
      state,
      action: PayloadAction<{ mangaId: string; chapterId: string }>
    ) => {
      const { mangaId, chapterId } = action.payload;
      // 移除已存在的同漫画+章节记录
      state.entries = state.entries.filter(
        (e) => !(e.mangaId === mangaId && e.chapterId === chapterId)
      );
      // 插入最新记录到头部
      state.entries.unshift({ mangaId, chapterId, readAt: Date.now() });
      // 限制最大条数
      if (state.entries.length > HISTORY_MAX) {
        state.entries = state.entries.slice(0, HISTORY_MAX);
      }
    },
    clearHistory: (state) => {
      state.entries = [];
    },
  },
});

export const { addToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
