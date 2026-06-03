import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export default function TagBadge({ label, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  inactive: {
    backgroundColor: Colors.pink100,
  },
  active: {
    backgroundColor: Colors.pink400,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
  inactiveText: {
    color: Colors.pink600,
  },
  activeText: {
    color: '#FFFFFF',
  },
});
