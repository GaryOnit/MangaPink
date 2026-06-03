import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import BannerCarousel from './components/BannerCarousel';
import MangaGrid from './components/MangaGrid';
import { useMangaData } from '../../hooks/useMangaData';
import { bannerMangas } from '../../data/mockMangas';
import { Colors } from '../../theme/colors';
import type { Manga } from '../../types/manga';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { mangas } = useMangaData();

  const handlePressManga = (manga: Manga) => {
    navigation.push('MangaDetail', { mangaId: manga.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 顶部标题栏 */}
        <View style={styles.header}>
          <Text style={styles.logo}>🌸 萌漫</Text>
          <Text style={styles.slogan}>你的二次元漫画世界</Text>
        </View>

        {/* Banner 轮播 */}
        <BannerCarousel mangas={bannerMangas} onPress={handlePressManga} />

        {/* 推荐漫画 */}
        <MangaGrid
          mangas={mangas}
          title="✨ 今日推荐"
          onPressManga={handlePressManga}
        />

        {/* 热门恋爱 */}
        <MangaGrid
          mangas={mangas.filter((m) => m.tags.includes('恋爱'))}
          title="💗 恋爱专区"
          onPressManga={handlePressManga}
        />
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.pink600,
  },
  slogan: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
