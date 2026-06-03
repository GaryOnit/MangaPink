import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Chapter } from '../types/chapter';
import { Colors } from '../theme/colors';

interface Props {
  chapter: Chapter;
  onPress: (chapter: Chapter) => void;
  isRead?: boolean;
}

export default function ChapterItem({ chapter, onPress, isRead = false }: Props) {
  return (
    <Pressable onPress={() => onPress(chapter)} style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.dot, isRead ? styles.dotRead : styles.dotUnread]} />
        <Text style={[styles.title, isRead && styles.titleRead]}>{chapter.title}</Text>
      </View>
      <View style={[styles.readBtn, isRead && styles.readBtnRead]}>
        <Text style={[styles.readBtnText, isRead && styles.readBtnTextRead]}>
          {isRead ? '已读' : '阅读'}
        </Text>
      </View>
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
  readBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: Colors.pink400,
  },
  readBtnRead: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  readBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  readBtnTextRead: {
    color: Colors.textDisabled,
  },
});
