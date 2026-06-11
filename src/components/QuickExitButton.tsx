import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function QuickExitButton() {
  const insets = useSafeAreaInsets();

  async function handleExit() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.dismissAll();
    router.replace('/stealth');
  }

  return (
    <View
      style={[styles.container, { bottom: insets.bottom + 24 }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handleExit}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
        accessibilityLabel="Quick exit — leaves the app"
        accessibilityRole="button"
        hitSlop={16}
      >
        <View style={styles.inner}>
          {/* × glyph */}
          <View style={[styles.arm, styles.armLeft]} />
          <View style={[styles.arm, styles.armRight]} />
        </View>
      </Pressable>
    </View>
  );
}

const BTN = 48;
const ARM = 18;
const THICK = 2.5;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 22,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  btn: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
  inner: {
    width: ARM,
    height: ARM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arm: {
    position: 'absolute',
    width: ARM,
    height: THICK,
    backgroundColor: '#FFFFFF',
    borderRadius: THICK / 2,
  },
  armLeft: {
    transform: [{ rotate: '45deg' }],
  },
  armRight: {
    transform: [{ rotate: '-45deg' }],
  },
});
