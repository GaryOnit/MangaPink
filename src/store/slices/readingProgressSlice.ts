import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProgressEntry {
  mangaId: string;
  chapterId: string;
  page: number;
  updatedAt: number;
}

export interface ReadingProgressState {
  progress: Record<string, ProgressEntry>; // key: `${mangaId}_${chapterId}`
}

const initialState: ReadingProgressState = {
  progress: {},
};

const readingProgressSlice = createSlice({
  name: 'readingProgress',
  initialState,
  reducers: {
    saveProgress: (
      state,
      action: PayloadAction<{ mangaId: string; chapterId: string; page: number }>
    ) => {
      const { mangaId, chapterId, page } = action.payload;
      const key = `${mangaId}_${chapterId}`;
      state.progress[key] = {
        mangaId,
        chapterId,
        page,
        updatedAt: Date.now(),
      };
    },
    clearProgress: (state, action: PayloadAction<string>) => {
      const keysToDelete = Object.keys(state.progress).filter((k) =>
        k.startsWith(action.payload + '_')
      );
      keysToDelete.forEach((k) => {
        delete state.progress[k];
      });
    },
  },
});

export const { saveProgress, clearProgress } = readingProgressSlice.actions;
export default readingProgressSlice.reducer;
