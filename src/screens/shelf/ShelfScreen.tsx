import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShelfStackParamList } from '../../navigation/types';
import ShelfItem from './components/ShelfItem';
import EmptyState from '../../components/EmptyState';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useAppSelector } from '../../store/hooks';
import { selectAllProgress } from '../../store/selectors/readingProgressSelectors';
import { useMangaData } from '../../hooks/useMangaData';
import { Colors } from '../../theme/colors';
import type { BookshelfEntry } from '../../store/slices/bookshelfSlice';
import type { ProgressEntry } from '../../store/slices/readingProgressSlice';

type Props = NativeStackScreenProps<ShelfStackParamList, 'Shelf'>;

/** 从全量进度记录中找出指定漫画的最新进度 */
function findLatestProgress(
  allProgress: Record<string, ProgressEntry>,
  mangaId: string
): ProgressEntry | undefined {
  const entries = Object.values(allProgress).filter((e) => e.mangaId === mangaId);
  if (entries.length === 0) return undefined;
  return entries.reduce((latest, curr) =>
    curr.updatedAt > latest.updatedAt ? curr : latest
  );
}

export default function ShelfScreen({ navigation }: Props) {
  const { bookshelfList } = useBookshelf();
  const { getMangaById } = useMangaData();
  const allProgress = useAppSelector(selectAllProgress);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 我的书架</Text>
        <Text style={styles.headerCount}>{bookshelfList.length} 部</Text>
      </View>

      {bookshelfList.length === 0 ? (
        <EmptyState
          icon="📭"
          title="书架空空如也 📚"
          description="去首页发现喜欢的漫画，点击收藏加入书架吧~"
        />
      ) : (
        <FlatList<BookshelfEntry>
          data={bookshelfList}
          keyExtractor={(item) => item.mangaId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const manga = getMangaById(item.mangaId);
            if (!manga) return null;
            const latestProgress = findLatestProgress(allProgress, item.mangaId);
            return (
              <ShelfItem
                manga={manga}
                addedAt={item.addedAt}
                progress={latestProgress}
                navigation={navigation}
                onPress={() => navigation.push('MangaDetail', { mangaId: manga.id })}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingVertical: 8,
  },
});
