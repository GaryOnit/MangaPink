import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoryStackParamList } from '../../navigation/types';
import CategoryGroup from './components/CategoryGroup';
import { useMangaData } from '../../hooks/useMangaData';
import { MANGA_TAGS } from '../../data/mockMangas';
import { Colors } from '../../theme/colors';
import type { Manga } from '../../types/manga';

type Props = NativeStackScreenProps<CategoryStackParamList, 'Category'>;

export default function CategoryScreen({ navigation }: Props) {
  const [activeTag, setActiveTag] = useState('全部');
  const { getMangasByTag } = useMangaData();

  const filteredMangas = getMangasByTag(activeTag);

  const handlePressManga = (manga: Manga) => {
    navigation.push('MangaDetail', { mangaId: manga.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏷️ 分类</Text>
      </View>

      {/* 分类标签 Tab */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagScroll}
        contentContainerStyle={styles.tagContent}
      >
        {MANGA_TAGS.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => setActiveTag(tag)}
            style={[styles.tagBtn, activeTag === tag && styles.tagBtnActive]}
          >
            <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>
              {tag}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 漫画网格 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CategoryGroup mangas={filteredMangas} onPressManga={handlePressManga} />
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tagScroll: {
    maxHeight: 44,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tagContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  tagBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: Colors.pink50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagBtnActive: {
    backgroundColor: Colors.pink400,
    borderColor: Colors.pink400,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  spacer: {
    height: 20,
  },
});
