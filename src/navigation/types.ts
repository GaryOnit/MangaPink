import type { NavigatorScreenParams } from '@react-navigation/native';

// ─── Stack ParamList ──────────────────────────────────────────────────────────

export type HomeStackParamList = {
  Home: undefined;
  MangaDetail: { mangaId: string };
  Reader: { mangaId: string; chapterId: string; initialPage?: number };
};

export type ShelfStackParamList = {
  Shelf: undefined;
  MangaDetail: { mangaId: string };
  Reader: { mangaId: string; chapterId: string; initialPage?: number };
};

export type CategoryStackParamList = {
  Category: undefined;
  MangaDetail: { mangaId: string };
  Reader: { mangaId: string; chapterId: string; initialPage?: number };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// ─── Bottom Tab ParamList ─────────────────────────────────────────────────────

export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ShelfTab: NavigatorScreenParams<ShelfStackParamList>;
  CategoryTab: NavigatorScreenParams<CategoryStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root ParamList ───────────────────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
};
