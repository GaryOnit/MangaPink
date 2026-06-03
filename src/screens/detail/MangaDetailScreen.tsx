import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ChapterList from './components/ChapterList';
import MangaCover from '../../components/MangaCover';
import TagBadge from '../../components/TagBadge';
import { useMangaData } from '../../hooks/useMangaData';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useHistory } from '../../hooks/useHistory';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { Colors } from '../../theme/colors';
import type { Chapter } from '../../types/chapter';

type Props = NativeStackScreenProps<HomeStackParamList, 'MangaDetail'>;

export default function MangaDetailScreen({ navigation, route }: Props) {
  const { mangaId } = route.params;
  const { getMangaById, getChaptersByMangaId } = useMangaData();
  const { isInBookshelf, addToShelf, removeFromShelf } = useBookshelf();
  const { recordVisit } = useHistory();
  const { progress } = useReadingProgress(mangaId);

  const manga = getMangaById(mangaId);
  const chapters = getChaptersByMangaId(mangaId);
  const inShelf = isInBookshelf(mangaId);

  useEffect(() => {
    if (mangaId) {
      recordVisit(mangaId);
    }
  }, [mangaId, recordVisit]);

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
      addToShelf(mangaId, chapters[chapters.length - 1]?.id ?? '');
    }
  };

  const handlePressChapter = (chapter: Chapter) => {
    const initialPage =
      progress?.chapterId === chapter.id ? progress.pageIndex : 0;
    navigation.push('Reader', { mangaId, chapterId: chapter.id, initialPage });
  };

  const handleContinueReading = () => {
    if (progress) {
      navigation.push('Reader', {
        mangaId,
        chapterId: progress.chapterId,
        initialPage: progress.pageIndex,
      });
    } else if (chapters.length > 0) {
      navigation.push('Reader', { mangaId, chapterId: chapters[0].id, initialPage: 0 });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 封面区 */}
        <View style={styles.heroSection}>
          <View style={styles.coverShadow}>
            <MangaCover mangaId={manga.coverId} size="lg" borderRadius={12} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{manga.title}</Text>
            <Text style={styles.author}>作者：{manga.author}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {manga.rating}</Text>
              <View style={[styles.statusBadge, manga.status === 'completed' ? styles.completedBadge : styles.ongoingBadge]}>
                <Text style={styles.statusText}>{manga.status === 'completed' ? '完结' : '连载中'}</Text>
              </View>
            </View>
            <Text style={styles.latestChapter}>{manga.latestChapter} · {manga.totalChapters}话</Text>
          </View>
        </View>

        {/* 标签 */}
        <View style={styles.tagsRow}>
          {manga.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} variant="filled" />
          ))}
        </View>

        {/* 简介 */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>简介</Text>
          <Text style={styles.desc}>{manga.description}</Text>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionRow}>
          <Pressable onPress={handleContinueReading} style={styles.readBtn}>
            <Text style={styles.readBtnText}>
              {progress ? '继续阅读' : '开始阅读'}
            </Text>
          </Pressable>
          <Pressable onPress={handleToggleShelf} style={[styles.shelfBtn, inShelf && styles.shelfBtnActive]}>
            <Text style={[styles.shelfBtnText, inShelf && styles.shelfBtnTextActive]}>
              {inShelf ? '✓ 已追漫' : '+ 追漫'}
            </Text>
          </Pressable>
        </View>

        {/* 话数列表 */}
        <ChapterList
          chapters={chapters}
          progress={progress}
          onPressChapter={handlePressChapter}
        />

        <View style={{ height: 24 }} />
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
  heroSection: {
    flexDirection: 'row',
    backgroundColor: Colors.pink50,
    padding: 20,
    gap: 16,
  },
  coverShadow: {
    shadowColor: Colors.pink400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  author: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  completedBadge: {
    backgroundColor: Colors.pink600,
  },
  ongoingBadge: {
    backgroundColor: Colors.pink400,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  latestChapter: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  descSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    marginTop: 8,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    marginTop: 8,
  },
  readBtn: {
    flex: 2,
    backgroundColor: Colors.pink400,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  readBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  shelfBtn: {
    flex: 1,
    backgroundColor: Colors.pink50,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.pink300,
  },
  shelfBtnActive: {
    backgroundColor: Colors.pink100,
    borderColor: Colors.pink400,
  },
  shelfBtnText: {
    color: Colors.pink400,
    fontSize: 14,
    fontWeight: '600',
  },
  shelfBtnTextActive: {
    color: Colors.pink600,
  },
});
