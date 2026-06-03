import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Manga } from '../../../types/manga';
import MangaCover from '../../../components/MangaCover';
import TagBadge from '../../../components/TagBadge';
import { Colors } from '../../../theme/colors';

interface Props {
  manga: Manga;
  inShelf: boolean;
  hasProgress: boolean;
  onToggleShelf: () => void;
  onStartReading: () => void;
}

export default function MangaInfoSection({
  manga,
  inShelf,
  hasProgress,
  onToggleShelf,
  onStartReading,
}: Props) {
  return (
    <>
      {/* 封面 + 基本信息 */}
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
          <TagBadge key={tag} label={tag} />
        ))}
      </View>

      {/* 简介 */}
      <View style={styles.descSection}>
        <Text style={styles.descTitle}>简介</Text>
        <Text style={styles.desc}>{manga.description}</Text>
      </View>

      {/* 操作按钮：有进度时显示「继续阅读」，否则仅显示「追漫」 */}
      <View style={styles.actionRow}>
        {hasProgress && (
          <Pressable onPress={onStartReading} style={styles.readBtn}>
            <Text style={styles.readBtnText}>继续阅读</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onToggleShelf}
          style={[styles.shelfBtn, inShelf && styles.shelfBtnActive]}
        >
          <Text style={[styles.shelfBtnText, inShelf && styles.shelfBtnTextActive]}>
            {inShelf ? '✓ 已追漫' : '+ 追漫'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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