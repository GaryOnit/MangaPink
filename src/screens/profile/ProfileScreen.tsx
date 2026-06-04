import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHistory } from '../../hooks/useHistory';
import { useMangaData } from '../../hooks/useMangaData';
import { Colors } from '../../theme/colors';
import { formatRelativeTime } from '../../utils/formatters';
import MangaCover from '../../components/MangaCover';

export default function ProfileScreen() {
  const { historyList, clearAll } = useHistory();
  const { getMangaById } = useMangaData();

  const handleClearHistory = () => {
    Alert.alert('清空历史', '确定要清空所有浏览历史吗？', [
      { text: '取消', style: 'cancel' },
      { text: '清空', style: 'destructive', onPress: clearAll },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 我的</Text>
      </View>

      {/* 用户卡片（原型阶段：游客模式） */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🌸</Text>
        </View>
        <View>
          <Text style={styles.userName}>漫画爱好者</Text>
          <Text style={styles.userDesc}>游客模式 · 数据本地保存</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 最近浏览 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近浏览</Text>
            {historyList.length > 0 && (
              <Pressable onPress={handleClearHistory}>
                <Text style={styles.clearBtn}>清空</Text>
              </Pressable>
            )}
          </View>

          {historyList.length === 0 ? (
            <Text style={styles.emptyHint}>暂无浏览记录</Text>
          ) : (
            (() => {
              // 按 mangaId 去重，每个作品只保留最新一条记录
              const seen = new Set<string>();
              const deduped = historyList.filter((entry) => {
                if (seen.has(entry.mangaId)) return false;
                seen.add(entry.mangaId);
                return true;
              });
              return deduped.slice(0, 10).map((entry) => {
                const manga = getMangaById(entry.mangaId);
                if (!manga) return null;
                return (
                  <View key={entry.mangaId} style={styles.historyItem}>
                    <MangaCover mangaId={manga.coverId} size="sm" />
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTitle}>{manga.title}</Text>
                      <Text style={styles.historyTime}>{formatRelativeTime(entry.readAt)}</Text>
                    </View>
                  </View>
                );
              });
            })()
          )}
        </View>

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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.pink200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.pink100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clearBtn: {
    fontSize: 13,
    color: Colors.pink400,
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingVertical: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  historyTime: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 2,
  },
  spacer: {
    height: 32,
  },
});
