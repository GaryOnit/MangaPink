import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  ViewToken,
  StatusBar,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ReaderImage from './components/ReaderImage';
import ReaderHeader from './components/ReaderHeader';
import ReaderProgressBar from './components/ReaderProgressBar';
import { readerStyles as styles, SCREEN_WIDTH } from './components/readerStyles';
import { useMangaData } from '../../hooks/useMangaData';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useChapterNavigation } from './hooks/useChapterNavigation';
import type { PageMeta } from '../../types/chapter';

type Props = NativeStackScreenProps<HomeStackParamList, 'Reader'>;

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };
const SAVE_THROTTLE = 3;

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

  // 将最新的 dispatch 相关数据存入 ref，供 onViewableRef 读取
  const saveProgressRef = useRef(saveProgressEntry);
  const mangaIdRef = useRef(mangaId);
  const chapterIdRef = useRef(chapterId);
  const pagesLengthRef = useRef(pages.length);

  useEffect(() => {
    saveProgressRef.current = saveProgressEntry;
    mangaIdRef.current = mangaId;
    chapterIdRef.current = chapterId;
    pagesLengthRef.current = pages.length;
  }, [saveProgressEntry, mangaId, chapterId, pages.length]);

  // onViewableItemsChanged 必须用 useRef 包裹，保证 FlatList 拿到的引用永远稳定
  const onViewableRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length === 0) return;
    const minIndex = Math.min(...viewableItems.map((v) => v.index ?? 0));
    currentPageRef.current = minIndex;
    setCurrentPage(minIndex);
    if (Math.abs(minIndex - lastSavedPageRef.current) >= SAVE_THROTTLE) {
      saveProgressRef.current(mangaIdRef.current, chapterIdRef.current, minIndex);
      lastSavedPageRef.current = minIndex;
    }
  });

  const viewabilityConfigRef = useRef(VIEWABILITY_CONFIG);

  // 章节切换导航：边界检测 + Alert + navigation.replace
  const { handleScrollBeginDrag, handleMomentumScrollEnd } = useChapterNavigation({
    mangaId,
    chapterId,
    navigation,
    chapters,
    pagesLength: pages.length,
    screenWidth: SCREEN_WIDTH,
    currentPageRef,
  });

  useEffect(() => {
    return () => {
      if (pagesLengthRef.current > 0) {
        const page = currentPageRef.current;
        saveProgressRef.current(mangaIdRef.current, chapterIdRef.current, page);
        updateLastRead(mangaIdRef.current, chapterIdRef.current, page);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLastRead]);

  const getItemLayout = useCallback(
    (_: ArrayLike<PageMeta> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  const handleToggleHeader = useCallback(() => {
    setHeaderVisible((v) => !v);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PageMeta }) => (
      <Pressable
        style={styles.pageWrapper}
        onPress={handleToggleHeader}
        android_ripple={null}
      >
        <ScrollView
          style={styles.pageScrollView}
          contentContainerStyle={styles.pageScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ReaderImage source={item.source} width={item.width} height={item.height} />
        </ScrollView>
      </Pressable>
    ),
    [handleToggleHeader]
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
      <FlatList
        data={pages}
        keyExtractor={(_, index) => `page-${index}`}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        windowSize={3}
        maxToRenderPerBatch={2}
        initialNumToRender={2}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
        initialScrollIndex={initialPage > 0 ? initialPage : undefined}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={
          handleMomentumScrollEnd as (e: NativeSyntheticEvent<NativeScrollEvent>) => void
        }
      />
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
