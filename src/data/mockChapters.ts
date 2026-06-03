import type { Chapter } from '../types/chapter';

export const mockChapters: Chapter[] = [
  // manga-001: 星空下的约定
  {
    id: 'ch-01',
    mangaId: 'manga-001',
    index: 1,
    title: '第1话：邂逅',
    pageCount: 3,
    assetKey: 'manga-001_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-001',
    index: 2,
    title: '第2话：约定',
    pageCount: 3,
    assetKey: 'manga-001_ch-02',
  },
  // manga-002: 魔法少女物语
  {
    id: 'ch-01',
    mangaId: 'manga-002',
    index: 1,
    title: '第1话：觉醒',
    pageCount: 3,
    assetKey: 'manga-002_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-002',
    index: 2,
    title: '第2话：战斗',
    pageCount: 3,
    assetKey: 'manga-002_ch-02',
  },
  // manga-003: 放学后的咖啡馆
  {
    id: 'ch-01',
    mangaId: 'manga-003',
    index: 1,
    title: '第1话：开始',
    pageCount: 3,
    assetKey: 'manga-003_ch-01',
  },
  {
    id: 'ch-02',
    mangaId: 'manga-003',
    index: 2,
    title: '第2话：营业中',
    pageCount: 3,
    assetKey: 'manga-003_ch-02',
  },
  // manga-004: 初恋季节
  {
    id: 'ch-01',
    mangaId: 'manga-004',
    index: 1,
    title: '第1话：春天',
    pageCount: 3,
    assetKey: 'manga-001_ch-01', // 复用已有资源
  },
  // manga-005: 王牌侦探
  {
    id: 'ch-01',
    mangaId: 'manga-005',
    index: 1,
    title: '第1话：案件',
    pageCount: 3,
    assetKey: 'manga-002_ch-01', // 复用已有资源
  },
];
