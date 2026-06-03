import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { CoverAssets } from '../data/assetMap';

type CoverSize = 'sm' | 'md' | 'lg';

interface Props {
  mangaId: string;
  size?: CoverSize;
  borderRadius?: number;
}

const SIZE_MAP: Record<CoverSize, { width: number; height: number }> = {
  sm: { width: 60, height: 80 },
  md: { width: 100, height: 133 },
  lg: { width: 140, height: 187 },
};

export default function MangaCover({ mangaId, size = 'md', borderRadius = 8 }: Props) {
  const source = CoverAssets[mangaId];
  const { width, height } = SIZE_MAP[size];

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Image
        source={source}
        style={{ width, height, borderRadius }}
        contentFit="cover"
        transition={150}
        recyclingKey={mangaId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#FFD6E7',
  },
});
