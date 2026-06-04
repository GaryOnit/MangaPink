import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ViewToken,
  StatusBar,
  Dimensions,
  ScrollView,
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
import type { PageMeta } from '../../types/chapter';

type Props = NativeStackScreenProps<HomeStackParamList, 'Reader'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
    ({ item }: { item: PageMeta }) => {
      const displayHeight = Math.round((SCREEN_WIDTH / item.width) * item.height);
      return (
        // Pressable 外层处理点击切换 UI，不干扰 FlatList 水平滑动手势
        // android_ripple={null} 避免 Android 上出现涟漪效果影响阅读体验
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
            {displayHeight < SCREEN_HEIGHT && (
              <View style={{ height: SCREEN_HEIGHT - displayHeight }} />
            )}
          </ScrollView>
        </Pressable>
      );
    },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pageWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  pageScrollView: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  pageScrollContent: {
    flexGrow: 1,
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
