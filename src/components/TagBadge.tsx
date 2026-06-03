import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  tag: string;
  variant?: 'outline' | 'filled';
}

export default function TagBadge({ tag, variant = 'filled' }: Props) {
  return (
    <View style={[styles.base, variant === 'outline' ? styles.outline : styles.filled]}>
      <Text style={[styles.text, variant === 'outline' ? styles.outlineText : styles.filledText]}>
        {tag}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  filled: {
    backgroundColor: Colors.pink100,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.pink400,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
  filledText: {
    color: Colors.pink600,
  },
  outlineText: {
    color: Colors.pink400,
  },
});
