import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReadingProgress {
  mangaId: string;
  chapterId: string;
  pageIndex: number;
  totalPages: number;
  updatedAt: number;
}

export interface ReadingProgressState {
  progressMap: Record<string, ReadingProgress>;
}

const initialState: ReadingProgressState = {
  progressMap: {},
};

const readingProgressSlice = createSlice({
  name: 'readingProgress',
  initialState,
  reducers: {
    updateProgress: (
      state,
      action: PayloadAction<{
        mangaId: string;
        chapterId: string;
        pageIndex: number;
        totalPages: number;
      }>
    ) => {
      const { mangaId, chapterId, pageIndex, totalPages } = action.payload;
      state.progressMap[mangaId] = {
        mangaId,
        chapterId,
        pageIndex,
        totalPages,
        updatedAt: Date.now(),
      };
    },
    clearProgress: (state, action: PayloadAction<string>) => {
      delete state.progressMap[action.payload];
    },
  },
});

export const { updateProgress, clearProgress } = readingProgressSlice.actions;
export default readingProgressSlice.reducer;
