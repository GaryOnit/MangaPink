import { useRef, useCallback } from 'react';
import { Alert, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Chapter } from '../../../types/chapter';
import type { HomeStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Reader'>;

interface UseChapterNavigationParams {
  mangaId: string;
  chapterId: string;
  navigation: NavigationProp;
  chapters: Chapter[];
  pagesLength: number;
  screenWidth: number;
  currentPageRef: React.MutableRefObject<number>;
}

interface UseChapterNavigationReturn {
  handleSwipeAtBoundary: (direction: 'left' | 'right') => void;
  handleScrollBeginDrag: () => void;
  handleMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

/**
 * 章节切换导航 Hook
 * 封装边界检测 + Alert 弹窗 + 导航逻辑
 *
 * - handleScrollBeginDrag：记录拖动开始时的页码
 * - handleMomentumScrollEnd：判断是否触达边界，触达则调用 handleSwipeAtBoundary
 * - handleSwipeAtBoundary('left')：最后一页左滑 → 询问进入下一章节
 * - handleSwipeAtBoundary('right')：第一页右滑 → 询问返回上一章节
 */
export function useChapterNavigation({
  mangaId,
  chapterId,
  navigation,
  chapters,
  pagesLength,
  screenWidth,
  currentPageRef,
}: UseChapterNavigationParams): UseChapterNavigationReturn {
  // 防重入：记录弹窗是否已打开，避免快速滑动多次触发
  const isAlertOpenRef = useRef(false);
  // 记录开始拖动时的页码，用于判断边界滑动意图
  const dragStartPageRef = useRef(0);
  // 记录是否正在手势拖动中，防止非手势触发的滚动（如 initialScrollIndex）误触发边界逻辑
  const isDraggingRef = useRef(false);

  // 将依赖存入 ref，避免回调陈旧值问题
  const chaptersRef = useRef(chapters);
  const chapterIdRef = useRef(chapterId);
  const mangaIdRef = useRef(mangaId);
  const pagesLengthRef = useRef(pagesLength);

  // 同步最新值到 ref
  chaptersRef.current = chapters;
  chapterIdRef.current = chapterId;
  mangaIdRef.current = mangaId;
  pagesLengthRef.current = pagesLength;

  const handleSwipeAtBoundary = useCallback(
    (direction: 'left' | 'right') => {
      // 防重入检查
      if (isAlertOpenRef.current) return;

      const currentChapters = chaptersRef.current;
      const currentChapterId = chapterIdRef.current;
      const currentMangaId = mangaIdRef.current;

      const currentIndex = currentChapters.findIndex((c) => c.id === currentChapterId);
      if (currentIndex === -1) return;

      if (direction === 'left') {
        // 最后一页左滑 → 进入下一章节
        const nextChapter = currentChapters[currentIndex + 1];
        if (nextChapter) {
          isAlertOpenRef.current = true;
          Alert.alert(
            '章节切换',
            `是否进入下一章节：${nextChapter.title}？`,
            [
              {
                text: '取消',
                style: 'cancel',
                onPress: () => {
                  isAlertOpenRef.current = false;
                },
              },
              {
                text: '确认',
                onPress: () => {
                  isAlertOpenRef.current = false;
                  navigation.replace('Reader', {
                    mangaId: currentMangaId,
                    chapterId: nextChapter.id,
                    initialPage: 0,
                  });
                },
              },
            ],
            {
              onDismiss: () => {
                isAlertOpenRef.current = false;
              },
            }
          );
        } else {
          // 已是最后一章
          isAlertOpenRef.current = true;
          Alert.alert('提示', '已是最后一章', [
            {
              text: '知道了',
              onPress: () => {
                isAlertOpenRef.current = false;
              },
            },
          ]);
        }
      } else {
        // 第一页右滑 → 返回上一章节
        const prevChapter = currentChapters[currentIndex - 1];
        if (prevChapter) {
          isAlertOpenRef.current = true;
          Alert.alert(
            '章节切换',
            `是否返回上一章节：${prevChapter.title}？`,
            [
              {
                text: '取消',
                style: 'cancel',
                onPress: () => {
                  isAlertOpenRef.current = false;
                },
              },
              {
                text: '确认',
                onPress: () => {
                  isAlertOpenRef.current = false;
                  navigation.replace('Reader', {
                    mangaId: currentMangaId,
                    chapterId: prevChapter.id,
                    initialPage: 0,
                  });
                },
              },
            ],
            {
              onDismiss: () => {
                isAlertOpenRef.current = false;
              },
            }
          );
        } else {
          // 已是第一章
          isAlertOpenRef.current = true;
          Alert.alert('提示', '已是第一章', [
            {
              text: '知道了',
              onPress: () => {
                isAlertOpenRef.current = false;
              },
            },
          ]);
        }
      }
    },
    [navigation] // navigation 稳定引用，其余值通过 ref 读取
  );

  // 记录开始拖动时的页码，并标记手势拖动开始
  const handleScrollBeginDrag = useCallback(() => {
    dragStartPageRef.current = currentPageRef.current;
    isDraggingRef.current = true;
  }, [currentPageRef]);

  // 判断是否触达边界（仅处理手势拖动引起的滚动）
  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // 非手势拖动引起的滚动（如 initialScrollIndex）不处理
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const newPage = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
      const startPage = dragStartPageRef.current;

      // 若页码未发生变化，说明用户在边界处滑动但页面未翻动
      if (startPage === newPage) {
        if (newPage === 0) {
          handleSwipeAtBoundary('right'); // 第一页没翻动 → 右滑边界
        } else if (newPage === pagesLengthRef.current - 1) {
          handleSwipeAtBoundary('left'); // 最后一页没翻动 → 左滑边界
        }
      }
    },
    [handleSwipeAtBoundary, screenWidth]
  );

  return { handleSwipeAtBoundary, handleScrollBeginDrag, handleMomentumScrollEnd };
}
