import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { Manga } from '../../../types/manga';
import MangaCard from '../../../components/MangaCard';
import { Colors } from '../../../theme/colors';
import { MANGA_CARD } from '../../../utils/constants';

interface Props {
  mangas: Manga[];
  title: string;
  onPressManga: (manga: Manga) => void;
}

export default function MangaGrid({ mangas, title, onPressManga }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={mangas}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MangaCard
            manga={item}
            onPress={() => onPressManga(item)}
            cardWidth={MANGA_CARD.WIDTH}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
