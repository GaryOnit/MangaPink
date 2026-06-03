import { useCallback } from 'react';
import { mockMangas } from '../data/mockMangas';
import { mockChapters } from '../data/mockChapters';
import { ChapterAssets } from '../data/assetMap';
import type { Manga } from '../types/manga';
import type { Chapter, PageMeta } from '../types/chapter';

export function useMangaData() {
  const getMangaById = useCallback((id: string): Manga | undefined => {
    return mockMangas.find((m) => m.id === id);
  }, []);

  const getMangasByTag = useCallback((tag: string): Manga[] => {
    if (tag === '全部') return mockMangas;
    return mockMangas.filter((m) => m.tags.includes(tag));
  }, []);

  const getChaptersByMangaId = useCallback((mangaId: string): Chapter[] => {
    return mockChapters
      .filter((c) => c.mangaId === mangaId)
      .sort((a, b) => a.index - b.index);
  }, []);

  const getPagesByChapter = useCallback((assetKey: string): PageMeta[] => {
    return ChapterAssets[assetKey] ?? [];
  }, []);

  return {
    mangas: mockMangas,
    getMangaById,
    getMangasByTag,
    getChaptersByMangaId,
    getPagesByChapter,
  };
}
