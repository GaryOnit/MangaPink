import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  StyleSheet,
  ViewToken,
  ViewabilityConfig,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ReaderImage from './components/ReaderImage';
import ReaderProgressBar from './components/ReaderProgressBar';
import { useMangaData } from '../../hooks/useMangaData';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { READER_PAGE, SCREEN } from '../../utils/constants';
import { Colors } from '../../theme/colors';
import type { PageMeta } from '../../types/chapter';

type Props = NativeStackScreenProps<HomeStackParamList, 'Reader'>;

// FlatList 性能调优参数
const WINDOW_SIZE = 5;
const MAX_TO_RENDER = 3;
const INITIAL_NUM = 3;
const UPDATE_CELLS_BATCH = 50;

const viewabilityConfig: ViewabilityConfig = {
  viewAreaCoveragePercentThreshold: 50,
  minimumViewTime: 300,
};

export default function ReaderScreen({ navigation, route }: Props) {
  const { mangaId, chapterId, initialPage = 0 } = route.params;
  const { getPagesByChapter, getChaptersByMangaId, getMangaById } = useMangaData();
  const { saveProgress } = useReadingProgress(mangaId);

  const chapters = getChaptersByMangaId(mangaId);
  const chapter = chapters.find((c) => c.id === chapterId);
  const pages = getPagesByChapter(chapter?.assetKey ?? '');
  const manga = getMangaById(mangaId);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [headerVisible, setHeaderVisible] = useState(true);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const lastVisible = viewableItems[viewableItems.length - 1];
        const pageIndex = lastVisible.index ?? 0;
        setCurrentPage(pageIndex);
        // 实时保存进度
        saveProgress(chapterId, pageIndex, pages.length);
      }
    },
    [saveProgress, chapterId, pages.length]
  );

  const viewabilityConfigRef = useRef<ViewabilityConfig>(viewabilityConfig);
  const onViewableItemsChangedRef = useRef(onViewableItemsChanged);

  const getItemLayout = useCallback(
    (_: ArrayLike<PageMeta> | null | undefined, index: number) => ({
      length: READER_PAGE.HEIGHT,
      offset: READER_PAGE.HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PageMeta; index: number }) => (
      <ReaderImage
        pageMeta={item}
        width={SCREEN.WIDTH}
        pageHeight={READER_PAGE.HEIGHT}
        recyclingKey={`${mangaId}-${chapterId}-${index}`}
      />
    ),
    [mangaId, chapterId]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* 顶部 Header */}
      {headerVisible && (
        <SafeAreaView edges={['top']} style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 返回</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.mangaTitle} numberOfLines={1}>{manga?.title}</Text>
            <Text style={styles.chapterTitle}>{chapter?.title}</Text>
          </View>
          <View style={styles.headerRight} />
        </SafeAreaView>
      )}

      {/* 阅读器主体 */}
      <Pressable style={styles.readerArea} onPress={() => setHeaderVisible((v) => !v)}>
        <FlatList
          data={pages}
          keyExtractor={(_, index) => `page-${index}`}
          renderItem={renderItem}
          // 性能调优
          windowSize={WINDOW_SIZE}
          maxToRenderPerBatch={MAX_TO_RENDER}
          initialNumToRender={INITIAL_NUM}
          updateCellsBatchingPeriod={UPDATE_CELLS_BATCH}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          // 进度追踪
          onViewableItemsChanged={onViewableItemsChangedRef.current}
          viewabilityConfig={viewabilityConfigRef.current}
          // 初始位置
          initialScrollIndex={initialPage}
          // 其他
          showsVerticalScrollIndicator={false}
          bounces={false}
          decelerationRate="normal"
        />
      </Pressable>

      {/* 底部进度条 */}
      {headerVisible && (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
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
  header: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    paddingRight: 12,
    minWidth: 60,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  mangaTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chapterTitle: {
    color: Colors.pink300,
    fontSize: 11,
    marginTop: 2,
  },
  headerRight: {
    minWidth: 60,
  },
  readerArea: {
    flex: 1,
  },
  footer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
