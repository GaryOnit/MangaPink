import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../navigation/types';
import type { Chapter } from '../../../types/chapter';
import ChapterItem from '../../../components/ChapterItem';
import { useMangaData } from '../../../hooks/useMangaData';
import { useHistory } from '../../../hooks/useHistory';
import { useAppSelector } from '../../../store/hooks';
import { selectAllProgress } from '../../../store/selectors/readingProgressSelectors';
import { Colors } from '../../../theme/colors';

interface Props {
  mangaId: string;
  navigation: NativeStackNavigationProp<HomeStackParamList, 'MangaDetail'>;
}

export default function ChapterList({ mangaId, navigation }: Props) {
  const { getChaptersByMangaId } = useMangaData();
  const { addHistoryEntry } = useHistory();
  const allProgress = useAppSelector(selectAllProgress);
  const chapters = getChaptersByMangaId(mangaId);

  const handlePressChapter = (chapter: Chapter) => {
    addHistoryEntry(mangaId, chapter.id);
    const progressKey = `${mangaId}_${chapter.id}`;
    const initialPage = allProgress[progressKey]?.page ?? 0;
    navigation.push('Reader', { mangaId, chapterId: chapter.id, initialPage });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>全部话数（{chapters.length}话）</Text>
      {chapters.map((chapter) => {
        const progressKey = `${mangaId}_${chapter.id}`;
        const isRead = progressKey in allProgress;
        return (
          <ChapterItem
            key={chapter.id + mangaId}
            chapter={chapter}
            isRead={isRead}
            onPress={handlePressChapter}
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
