import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ViewToken,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ReaderImage from './components/ReaderImage';
import ReaderHeader from './components/ReaderHeader';
import ReaderProgressBar from './components/ReaderProgressBar';
import { useMangaData } from '../../hooks/useMangaData';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { useBookshelf } from '../../hooks/useBookshelf';
import { SCREEN } from '../../utils/constants';
import type { PageMeta } from '../../types/chapter';

type Props = NativeStackScreenProps<HomeStackParamList, 'Reader'>;

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };
const SAVE_THROTTLE = 3;

function getPageDisplayHeight(page: PageMeta): number {
  return Math.round((SCREEN.WIDTH / page.width) * page.height);
}

export default function ReaderScreen({ navigation, route }: Props) {
  const { mangaId, chapterId, initialPage = 0 } = route.params;
  const { getPagesByChapter, getChaptersByMangaId, getMangaById } = useMangaData();
  const { saveProgressEntry } = useReadingProgress();
  const { updateLastRead } = useBookshelf();

  const chapters = getChaptersByMangaId(mangaId);
  const chapter = chapters.find((c) => c.id === chapterId);
  const pages = getPagesByChapter(chapter?.assetKey ?? '');
  const manga = getMangaById(mangaId);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [headerVisible, setHeaderVisible] = useState(true);
  const currentPageRef = useRef(initialPage);
  const lastSavedPageRef = useRef(initialPage);

  const pageOffsets = useMemo(() => {
    const offsets: number[] = [];
    let offset = 0;
    for (const page of pages) {
      offsets.push(offset);
      offset += getPageDisplayHeight(page);
    }
    return offsets;
  }, [pages]);

  useEffect(() => {
    return () => {
      if (pages.length > 0) {
        const page = currentPageRef.current;
        saveProgressEntry(mangaId, chapterId, page);
        updateLastRead(mangaId, chapterId, page);
      }
    };
  }, [mangaId, chapterId, saveProgressEntry, updateLastRead, pages.length]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;
      const minIndex = Math.min(...viewableItems.map((v) => v.index ?? 0));
      currentPageRef.current = minIndex;
      setCurrentPage(minIndex);
      if (Math.abs(minIndex - lastSavedPageRef.current) >= SAVE_THROTTLE) {
        saveProgressEntry(mangaId, chapterId, minIndex);
        lastSavedPageRef.current = minIndex;
      }
    },
    [saveProgressEntry, mangaId, chapterId]
  );

  const viewabilityConfigRef = useRef(VIEWABILITY_CONFIG);
  const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
  useEffect(() => {
    onViewableItemsChangedRef.current = onViewableItemsChanged;
  }, [onViewableItemsChanged]);

  const getItemLayout = useCallback(
    (_: ArrayLike<PageMeta> | null | undefined, index: number) => ({
      length: pages[index] ? getPageDisplayHeight(pages[index]) : 0,
      offset: pageOffsets[index] ?? 0,
      index,
    }),
    [pages, pageOffsets]
  );

  const renderItem = useCallback(
    ({ item }: { item: PageMeta }) => (
      <ReaderImage source={item.source} width={item.width} height={item.height} />
    ),
    []
  );

  if (pages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无图片资源</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Pressable style={styles.readerArea} onPress={() => setHeaderVisible((v) => !v)}>
        <FlatList
          data={pages}
          keyExtractor={(_, index) => `page-${index}`}
          renderItem={renderItem}
          windowSize={5}
          maxToRenderPerBatch={3}
          initialNumToRender={3}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChangedRef.current}
          viewabilityConfig={viewabilityConfigRef.current}
          initialScrollIndex={initialPage > 0 ? initialPage : undefined}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </Pressable>
      {headerVisible && (
        <ReaderHeader
          mangaTitle={manga?.title ?? ''}
          chapterTitle={chapter?.title ?? ''}
          currentPage={currentPage}
          totalPages={pages.length}
          onBack={() => navigation.goBack()}
        />
      )}
      {headerVisible && (
        <SafeAreaView edges={['bottom']} style={styles.footer} pointerEvents="none">
          <ReaderProgressBar current={currentPage} total={pages.length} />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  readerArea: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});
