import type { ImageSourcePropType } from 'react-native';

export interface Chapter {
  id: string;
  mangaId: string;
  index: number;
  title: string;
  pageCount: number;
  assetKey: string;
}

export interface PageMeta {
  source: ImageSourcePropType;
  width: number;
  height: number;
}
