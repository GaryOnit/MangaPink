import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ShelfStackParamList } from '../../../navigation/types';
import type { Manga } from '../../../types/manga';
import type { ProgressEntry } from '../../../store/slices/readingProgressSlice';
import MangaCover from '../../../components/MangaCover';
import { Colors } from '../../../theme/colors';
import { formatRelativeTime } from '../../../utils/formatters';

interface Props {
  manga: Manga;
  addedAt: number;
  progress?: ProgressEntry;
  navigation: NativeStackNavigationProp<ShelfStackParamList, 'Shelf'>;
  onPress: () => void;
}

export default function ShelfItem({ manga, addedAt, progress, navigation, onPress }: Props) {
  const handleContinueReading = () => {
    if (progress) {
      navigation.push('Reader', {
        mangaId: manga.id,
        chapterId: progress.chapterId,
        initialPage: progress.page,
      });
    } else {
      navigation.push('MangaDetail', { mangaId: manga.id });
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <MangaCover mangaId={manga.coverId} size="sm" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{manga.title}</Text>
        <Text style={styles.author}>{manga.author}</Text>
        {progress ? (
          <Text style={styles.progressText}>
            {progress.chapterId} · 第{progress.page + 1}页
          </Text>
        ) : (
          <Text style={styles.unread}>未开始阅读</Text>
        )}
        <Text style={styles.addedAt}>收藏于 {formatRelativeTime(addedAt)}</Text>
      </View>
      <Pressable onPress={handleContinueReading} style={styles.readBtn}>
        <Text style={styles.readBtnText}>
          {progress ? '继续阅读' : '开始阅读'}
        </Text>
      </Pressable>
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
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.pink600,
    fontWeight: '600',
    marginBottom: 3,
  },
  unread: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginBottom: 3,
  },
  addedAt: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
  readBtn: {
    backgroundColor: Colors.pink400,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  readBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
