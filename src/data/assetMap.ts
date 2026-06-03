import type { ImageSourcePropType } from 'react-native';
import type { PageMeta } from '../types/chapter';

// ─── 封面图 ─────────────────────────────────────────────────────────────────
export const CoverAssets: Record<string, ImageSourcePropType> = {
  'manga-001': require('../../assets/covers/manga-001.png'),
  'manga-002': require('../../assets/covers/manga-002.png'),
  'manga-003': require('../../assets/covers/manga-003.png'),
  'manga-004': require('../../assets/covers/manga-004.png'),
  'manga-005': require('../../assets/covers/manga-005.png'),
};

// ─── 章节图片映射（key = `${mangaId}_${chapterId}`）──────────────────────────
export const ChapterAssets: Record<string, PageMeta[]> = {
  'manga-001_ch-01': [
    { source: require('../../assets/chapters/manga-001/ch-01/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-001/ch-01/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-001/ch-01/page-003.png'), width: 360, height: 640 },
  ],
  'manga-001_ch-02': [
    { source: require('../../assets/chapters/manga-001/ch-02/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-001/ch-02/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-001/ch-02/page-003.png'), width: 360, height: 640 },
  ],
  'manga-002_ch-01': [
    { source: require('../../assets/chapters/manga-002/ch-01/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-002/ch-01/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-002/ch-01/page-003.png'), width: 360, height: 640 },
  ],
  'manga-002_ch-02': [
    { source: require('../../assets/chapters/manga-002/ch-02/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-002/ch-02/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-002/ch-02/page-003.png'), width: 360, height: 640 },
  ],
  'manga-003_ch-01': [
    { source: require('../../assets/chapters/manga-003/ch-01/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-003/ch-01/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-003/ch-01/page-003.png'), width: 360, height: 640 },
  ],
  'manga-003_ch-02': [
    { source: require('../../assets/chapters/manga-003/ch-02/page-001.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-003/ch-02/page-002.png'), width: 360, height: 640 },
    { source: require('../../assets/chapters/manga-003/ch-02/page-003.png'), width: 360, height: 640 },
  ],
};
