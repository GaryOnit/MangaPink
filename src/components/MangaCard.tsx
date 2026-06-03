import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { Manga } from '../types/manga';
import { CoverAssets } from '../data/assetMap';
import { Colors } from '../theme/colors';

interface Props {
  manga: Manga;
  onPress: () => void;
  cardWidth?: number;
}

export default function MangaCard({ manga, onPress, cardWidth = 110 }: Props) {
  const cardHeight = Math.round(cardWidth * (4 / 3));
  const source = CoverAssets[manga.coverId];

  return (
    <Pressable onPress={onPress} style={[styles.container, { width: cardWidth }]}>
      <View style={[styles.coverWrap, { width: cardWidth, height: cardHeight }]}>
        <Image
          source={source}
          style={{ width: cardWidth, height: cardHeight, borderRadius: 8 }}
          contentFit="cover"
          transition={150}
          recyclingKey={manga.id}
        />
        {manga.status === 'completed' && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>完结</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{manga.title}</Text>
      <View style={styles.tagRow}>
        {manga.tags.slice(0, 2).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  coverWrap: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.pink100,
  },
  completedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.pink600,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 6,
    lineHeight: 16,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    backgroundColor: Colors.pink100,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: Colors.pink600,
    fontSize: 10,
  },
});
