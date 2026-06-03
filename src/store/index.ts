import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookshelfReducer from './slices/bookshelfSlice';
import readingProgressReducer from './slices/readingProgressSlice';
import historyReducer from './slices/historySlice';

const bookshelfPersistConfig = {
  key: 'bookshelf',
  version: 1,
  storage: AsyncStorage,
};

const readingProgressPersistConfig = {
  key: 'readingProgress',
  version: 1,
  storage: AsyncStorage,
};

const historyPersistConfig = {
  key: 'history',
  version: 1,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  bookshelf: persistReducer(bookshelfPersistConfig, bookshelfReducer),
  readingProgress: persistReducer(readingProgressPersistConfig, readingProgressReducer),
  history: persistReducer(historyPersistConfig, historyReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
