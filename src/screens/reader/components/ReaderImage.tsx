import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  source: ImageSourcePropType;
  width: number;
  height: number;
}

export default function ReaderImage({ source, width, height }: Props) {
  // 按屏幕宽度等比缩放图片高度
  const displayHeight = Math.round((SCREEN_WIDTH / width) * height);

  return (
    <Image
      source={source}
      style={[styles.image, { width: SCREEN_WIDTH, height: displayHeight }]}
      contentFit="fill"
      transition={150}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#1a1a1a',
  },
});
