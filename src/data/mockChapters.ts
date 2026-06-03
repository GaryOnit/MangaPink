import type { Chapter } from '../types/chapter';

export const mockChapters: Chapter[] = [
  // manga-001: 星空下的约定
  {
    id: 'ch-01',
    mangaId: 'manga-001',
    chapterNumber: 1,
    title: '第1话：邂逅',
    assetKey: 'manga-001_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-001',
    chapterNumber: 2,
    title: '第2话：约定',
    assetKey: 'manga-001_ch-02',
  },
  // manga-002: 魔法少女物语
  {
    id: 'ch-01',
    mangaId: 'manga-002',
    chapterNumber: 1,
    title: '第1话：觉醒',
    assetKey: 'manga-002_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-002',
    chapterNumber: 2,
    title: '第2话：战斗',
    assetKey: 'manga-002_ch-02',
  },
  // manga-003: 放学后的咖啡馆
  {
    id: 'ch-01',
    mangaId: 'manga-003',
    chapterNumber: 1,
    title: '第1话：开始',
    assetKey: 'manga-003_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-003',
    chapterNumber: 2,
    title: '第2话：营业中',
    assetKey: 'manga-003_ch-02',
  },
  // manga-004: 初恋季节（复用 manga-001 图片资源）
  {
    id: 'ch-01',
    mangaId: 'manga-004',
    chapterNumber: 1,
    title: '第1话：春天',
    assetKey: 'manga-001_ch-01',
  },
  // manga-005: 王牌侦探（复用 manga-001 图片资源）
  {
    id: 'ch-01',
    mangaId: 'manga-005',
    chapterNumber: 1,
    title: '第1话：案件',
    assetKey: 'manga-005_ch-01',
  },
];

export function getChaptersByMangaId(mangaId: string): Chapter[] {
  return mockChapters
    .filter((c) => c.mangaId === mangaId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}
