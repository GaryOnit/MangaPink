import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookshelfEntry {
  mangaId: string;
  addedAt: number;
  lastReadChapterId?: string;
  lastReadPage?: number;
}

export interface BookshelfState {
  entries: Record<string, BookshelfEntry>;
}

const initialState: BookshelfState = {
  entries: {},
};

const bookshelfSlice = createSlice({
  name: 'bookshelf',
  initialState,
  reducers: {
    addToBookshelf: (state, action: PayloadAction<string>) => {
      const mangaId = action.payload;
      if (!state.entries[mangaId]) {
        state.entries[mangaId] = {
          mangaId,
          addedAt: Date.now(),
        };
      }
    },
    removeFromBookshelf: (state, action: PayloadAction<string>) => {
      delete state.entries[action.payload];
    },
    updateLastRead: (
      state,
      action: PayloadAction<{ mangaId: string; chapterId: string; page: number }>
    ) => {
      const { mangaId, chapterId, page } = action.payload;
      if (state.entries[mangaId]) {
        state.entries[mangaId].lastReadChapterId = chapterId;
        state.entries[mangaId].lastReadPage = page;
      }
    },
  },
});

export const { addToBookshelf, removeFromBookshelf, updateLastRead } = bookshelfSlice.actions;
export default bookshelfSlice.reducer;
