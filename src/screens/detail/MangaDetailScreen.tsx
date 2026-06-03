import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ChapterList from './components/ChapterList';
import MangaInfoSection from './components/MangaInfoSection';
import { useMangaData } from '../../hooks/useMangaData';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useHistory } from '../../hooks/useHistory';
import { useAppSelector } from '../../store/hooks';
import { selectLatestProgressForManga } from '../../store/selectors/readingProgressSelectors';
import { Colors } from '../../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'MangaDetail'>;

export default function MangaDetailScreen({ navigation, route }: Props) {
  const { mangaId } = route.params;
  const { getMangaById, getChaptersByMangaId } = useMangaData();
  const { isInBookshelf, addToShelf, removeFromShelf } = useBookshelf();
  const { addHistoryEntry } = useHistory();
  const progress = useAppSelector((state) => selectLatestProgressForManga(state, mangaId));

  const manga = getMangaById(mangaId);
  const chapters = getChaptersByMangaId(mangaId);
  const inShelf = isInBookshelf(mangaId);

  if (!manga) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>漫画不存在</Text>
      </View>
    );
  }

  const handleToggleShelf = () => {
    if (inShelf) {
      Alert.alert('移出书架', `确定要将《${manga.title}》移出书架吗？`, [
        { text: '取消', style: 'cancel' },
        { text: '确定', style: 'destructive', onPress: () => removeFromShelf(mangaId) },
      ]);
    } else {
      addToShelf(mangaId);
    }
  };

  const handleStartReading = () => {
    if (progress) {
      addHistoryEntry(mangaId, progress.chapterId);
      navigation.push('Reader', {
        mangaId,
        chapterId: progress.chapterId,
        initialPage: progress.page,
      });
    } else if (chapters.length > 0) {
      addHistoryEntry(mangaId, chapters[0].id);
      navigation.push('Reader', { mangaId, chapterId: chapters[0].id, initialPage: 0 });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MangaInfoSection
          manga={manga}
          inShelf={inShelf}
          hasProgress={progress !== undefined}
          onToggleShelf={handleToggleShelf}
          onStartReading={handleStartReading}
        />
        <ChapterList mangaId={mangaId} navigation={navigation} />
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  spacer: {
    height: 24,
  },
});
