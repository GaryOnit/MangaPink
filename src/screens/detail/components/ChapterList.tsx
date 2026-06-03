import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Chapter } from '../../../types/chapter';
import type { ReadingProgress } from '../../../store/slices/readingProgressSlice';
import ChapterItem from '../../../components/ChapterItem';
import { Colors } from '../../../theme/colors';

interface Props {
  chapters: Chapter[];
  progress?: ReadingProgress;
  onPressChapter: (chapter: Chapter) => void;
}

export default function ChapterList({ chapters, progress, onPressChapter }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>全部话数（{chapters.length}话）</Text>
      {chapters.map((chapter) => {
        const isRead =
          progress !== undefined &&
          progress.chapterId === chapter.id &&
          progress.pageIndex >= chapter.pageCount - 1;
        return (
          <ChapterItem
            key={chapter.id + chapter.mangaId}
            chapter={chapter}
            isRead={isRead}
            onPress={() => onPressChapter(chapter)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.pink50,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
