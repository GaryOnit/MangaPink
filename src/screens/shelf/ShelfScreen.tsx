import React from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShelfStackParamList } from '../../navigation/types';
import ShelfItem from './components/ShelfItem';
import EmptyState from '../../components/EmptyState';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useAppSelector } from '../../store/hooks';
import { selectAllProgress } from '../../store/selectors/readingProgressSelectors';
import { useMangaData } from '../../hooks/useMangaData';
import { Colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ShelfStackParamList, 'Shelf'>;

export default function ShelfScreen({ navigation }: Props) {
  const { items } = useBookshelf();
  const { getMangaById } = useMangaData();
  const allProgress = useAppSelector(selectAllProgress);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 我的书架</Text>
        <Text style={styles.headerCount}>{items.length} 部</Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="书架还是空的"
          subtitle="去首页发现喜欢的漫画，点击收藏加入书架吧~"
          icon={<Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.mangaId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const manga = getMangaById(item.mangaId);
            if (!manga) return null;
            return (
              <ShelfItem
                manga={manga}
                addedAt={item.addedAt}
                progress={allProgress[item.mangaId]}
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
