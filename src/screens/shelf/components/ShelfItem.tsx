import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Manga } from '../../../types/manga';
import type { ReadingProgress } from '../../../store/slices/readingProgressSlice';
import MangaCover from '../../../components/MangaCover';
import { Colors } from '../../../theme/colors';
import { formatRelativeTime, formatReadingProgress } from '../../../utils/formatters';

interface Props {
  manga: Manga;
  addedAt: number;
  progress?: ReadingProgress;
  onPress: () => void;
}

export default function ShelfItem({ manga, addedAt, progress, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <MangaCover mangaId={manga.coverId} size="sm" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{manga.title}</Text>
        <Text style={styles.author}>{manga.author}</Text>
        {progress ? (
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(
                      ((progress.pageIndex + 1) / progress.totalPages) * 100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {formatReadingProgress(progress.pageIndex, progress.totalPages)}
            </Text>
          </View>
        ) : (
          <Text style={styles.unread}>未开始阅读</Text>
        )}
        <Text style={styles.addedAt}>收藏于 {formatRelativeTime(addedAt)}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.pink200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  author: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.pink100,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.pink400,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: Colors.pink600,
    fontWeight: '600',
    minWidth: 30,
  },
  unread: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginBottom: 4,
  },
  addedAt: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
  arrow: {
    fontSize: 22,
    color: Colors.pink300,
    marginLeft: 8,
  },
});
