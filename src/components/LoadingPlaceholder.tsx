import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  count?: number;
}

function PlaceholderCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cover} />
      <View style={styles.titleLine} />
      <View style={styles.tagLine} />
    </View>
  );
}

export default function LoadingPlaceholder({ count = 6 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceholderCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 100,
  },
  cover: {
    width: 100,
    height: 133,
    borderRadius: 8,
    backgroundColor: Colors.pink100,
  },
  titleLine: {
    width: 80,
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.pink100,
    marginTop: 8,
  },
  tagLine: {
    width: 50,
    height: 10,
    borderRadius: 4,
    backgroundColor: Colors.pink50,
    marginTop: 6,
  },
});
