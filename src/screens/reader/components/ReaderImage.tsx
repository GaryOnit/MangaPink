import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { PageMeta } from '../../../types/chapter';

interface Props {
  pageMeta: PageMeta;
  width: number;
  pageHeight: number;
  recyclingKey: string;
}

export default function ReaderImage({ pageMeta, width, pageHeight, recyclingKey }: Props) {
  return (
    <Image
      source={pageMeta.source}
      style={[styles.image, { width, height: pageHeight }]}
      contentFit="fill"
      transition={150}
      recyclingKey={recyclingKey}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#1a1a1a',
  },
});
