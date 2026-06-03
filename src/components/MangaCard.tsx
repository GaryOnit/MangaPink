import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { Manga } from '../types/manga';
import { CoverAssets } from '../data/assetMap';
import { Colors } from '../theme/colors';

interface Props {
  manga: Manga;
  onPress: (manga: Manga) => void;
  width?: number;
}

export default function MangaCard({ manga, onPress, width = 160 }: Props) {
  const cardHeight = Math.round(width * 1.4);
  const source = CoverAssets[manga.coverId];

  return (
    <Pressable onPress={() => onPress(manga)} style={[styles.container, { width }]}>
      <View style={[styles.coverWrap, { width, height: cardHeight }]}>
        <Image
          source={source}
          style={{ width, height: cardHeight, borderRadius: 12 }}
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
      <Text style={styles.title} numberOfLines={1}>{manga.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{manga.author}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.rating}>{manga.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 6,
    shadowColor: Colors.pink200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  author: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 2,
  },
  star: {
    fontSize: 11,
  },
  rating: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
