import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '@components/GlassCard';
import { TrashIcon } from '@components/Icons';
import { Colors } from '@theme/colors';
import type { VaultItem } from '@utils/vault';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

export function VaultEntry({
  item,
  index,
  onDelete,
}: {
  item: VaultItem;
  index: number;
  onDelete: (id: string) => void;
}) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 60, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 240 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Animated.View style={animStyle}>
      <GlassCard style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <View style={styles.noteHeaderLeft}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteDate}>{date}</Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert('Remove this note?', item.title, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => onDelete(item.id),
                },
              ])
            }
            accessibilityLabel="Delete note"
            style={styles.deleteBtn}
          >
            <TrashIcon size={16} color={Colors.inkMuted} />
          </Pressable>
        </View>
        {item.body.trim().length > 0 && (
          <Text style={styles.noteBody} numberOfLines={3}>
            {item.body}
          </Text>
        )}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  noteCard: { padding: 14, marginBottom: 10 },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  noteHeaderLeft: { flex: 1, gap: 2 },
  noteTitle: { fontFamily: 'Inter', fontWeight: '600', fontSize: 14, color: Colors.inkPrimary },
  noteDate: { fontFamily: 'Inter', fontSize: 10, color: Colors.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' },
  noteBody: { fontFamily: 'Inter', fontSize: 13, color: Colors.inkMuted, lineHeight: 19 },
  deleteBtn: { padding: 4, marginLeft: 8 },
});
