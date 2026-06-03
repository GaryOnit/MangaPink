import type { ImageSourcePropType } from 'react-native';

export interface Chapter {
  id: string;           // e.g. 'ch-01'
  mangaId: string;
  title: string;
  chapterNumber: number;
  assetKey: string;     // e.g. 'manga-001_ch-01' (用于 ChapterAssets 查表)
}

export interface PageMeta {
  source: ImageSourcePropType;
  width: number;
  height: number;
}
