import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

interface Props {
  current: number;
  total: number;
}

export default function ReaderProgressBar({ current, total }: Props) {
  const progress = total > 0 ? (current + 1) / total : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={styles.text}>{current + 1} / {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  barBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    backgroundColor: Colors.pink400,
    borderRadius: 2,
  },
  text: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    minWidth: 44,
    textAlign: 'right',
  },
});
