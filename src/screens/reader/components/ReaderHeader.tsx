import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../theme/colors';

interface Props {
  mangaTitle: string;
  chapterTitle: string;
  currentPage: number;
  totalPages: number;
  onBack: () => void;
}

export default function ReaderHeader({
  mangaTitle,
  chapterTitle,
  currentPage,
  totalPages,
  onBack,
}: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.header} pointerEvents="box-none">
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← 返回</Text>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.mangaTitle} numberOfLines={1}>{mangaTitle}</Text>
        <Text style={styles.chapterTitle}>{chapterTitle}</Text>
      </View>
      <Text style={styles.pageInfo}>{currentPage + 1}/{totalPages}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  backBtn: {
    paddingRight: 12,
    minWidth: 60,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  mangaTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chapterTitle: {
    color: Colors.pink300,
    fontSize: 11,
    marginTop: 2,
  },
  pageInfo: {
    color: Colors.pink200,
    fontSize: 12,
    minWidth: 60,
    textAlign: 'right',
  },
});
