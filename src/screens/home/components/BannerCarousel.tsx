import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import type { Manga } from '../../../types/manga';
import { CoverAssets } from '../../../data/assetMap';
import { Colors } from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

interface Props {
  mangas: Manga[];
  onPress: (manga: Manga) => void;
}

export default function BannerCarousel({ mangas, onPress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Manga>>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mangas}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress(item)} style={styles.bannerItem}>
            <Image
              source={CoverAssets[item.coverId]}
              style={styles.bannerImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.overlay}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSub}>{item.latestChapter} · {item.author}</Text>
            </View>
          </Pressable>
        )}
      />
      {/* 指示点 */}
      <View style={styles.dots}>
        {mangas.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT + 24,
    marginBottom: 8,
  },
  bannerItem: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(45,27,46,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.pink400,
    width: 16,
  },
  dotInactive: {
    backgroundColor: Colors.pink200,
  },
});
