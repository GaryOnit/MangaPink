import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Chapter } from '../types/chapter';
import { Colors } from '../theme/colors';

interface Props {
  chapter: Chapter;
  isRead: boolean;
  onPress: () => void;
}

export default function ChapterItem({ chapter, isRead, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.dot, isRead ? styles.dotRead : styles.dotUnread]} />
        <Text style={[styles.title, isRead && styles.titleRead]}>{chapter.title}</Text>
      </View>
      <Text style={styles.pages}>{chapter.pageCount}页</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  dotUnread: {
    backgroundColor: Colors.pink400,
  },
  dotRead: {
    backgroundColor: Colors.textDisabled,
  },
  title: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  titleRead: {
    color: Colors.textDisabled,
  },
  pages: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
