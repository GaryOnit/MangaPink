import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { Manga } from '../../../types/manga';
import MangaCard from '../../../components/MangaCard';
import { Colors } from '../../../theme/colors';
import { MANGA_CARD } from '../../../utils/constants';

interface Props {
  mangas: Manga[];
  onPressManga: (manga: Manga) => void;
}

export default function CategoryGroup({ mangas, onPressManga }: Props) {
  if (mangas.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>该分类暂无漫画</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mangas}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <MangaCard
          manga={item}
          onPress={onPressManga}
          width={MANGA_CARD.WIDTH}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textDisabled,
    fontSize: 14,
  },
});
