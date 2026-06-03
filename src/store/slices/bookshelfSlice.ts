import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookshelfItem {
  mangaId: string;
  addedAt: number;
  latestChapterId: string;
}

export interface BookshelfState {
  items: BookshelfItem[];
}

const initialState: BookshelfState = {
  items: [],
};

const bookshelfSlice = createSlice({
  name: 'bookshelf',
  initialState,
  reducers: {
    addToBookshelf: (state, action: PayloadAction<{ mangaId: string; latestChapterId: string }>) => {
      const exists = state.items.some((item) => item.mangaId === action.payload.mangaId);
      if (!exists) {
        state.items.push({
          mangaId: action.payload.mangaId,
          addedAt: Date.now(),
          latestChapterId: action.payload.latestChapterId,
        });
      }
    },
    removeFromBookshelf: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.mangaId !== action.payload);
    },
    updateLatestChapter: (
      state,
      action: PayloadAction<{ mangaId: string; chapterId: string }>
    ) => {
      const item = state.items.find((i) => i.mangaId === action.payload.mangaId);
      if (item) {
        item.latestChapterId = action.payload.chapterId;
      }
    },
  },
});

export const { addToBookshelf, removeFromBookshelf, updateLatestChapter } = bookshelfSlice.actions;
export default bookshelfSlice.reducer;
