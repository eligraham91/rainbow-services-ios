import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

interface SpringButtonProps {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  accessibilityLabel?: string;
  hitSlop?: Insets;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_HIT_SLOP: Insets = { top: 8, bottom: 8, left: 8, right: 8 };

// Spring configs
const PRESS_SPRING = { stiffness: 300, damping: 20 } as const;
const RELEASE_SPRING = { stiffness: 400, damping: 30 } as const;

/**
 * Hardware-accelerated tactile button.
 * - Presses in with a high-tension spring (0.94 scale) on the UI thread.
 * - Fires expo-haptics on press (Medium for secondary, Heavy for primary).
 * - Fully accessible: role=button, hitSlop, reducedMotion-aware.
 * - When Reduce Motion is on, skips scale animation but keeps haptics
 *   (haptics aid, not harm).
 */
export function SpringButton({
  onPress,
  label,
  children,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  hitSlop = DEFAULT_HIT_SLOP,
  style,
}: SpringButtonProps) {
  const reducedMotion = useTraumaInformedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      if (!reducedMotion) {
        scale.value = withSpring(0.94, PRESS_SPRING);
      }
      const feedbackStyle =
        variant === 'primary'
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Medium;
      Haptics.impactAsync(feedbackStyle);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
  };

  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={hitSlop}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={style}
    >
      <Animated.View
        style={[
          styles.base,
          isPrimary ? styles.primary : styles.secondary,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        {children ?? (
          <Text
            style={[
              styles.label,
              isPrimary ? styles.labelPrimary : styles.labelSecondary,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: C.purpleAnchor,
    shadowColor: C.purpleAnchor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 6,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.ruleLine,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 15,
  },
  labelPrimary: {
    color: C.creamBase,
  },
  labelSecondary: {
    color: C.inkPrimary,
  },
  labelDisabled: {
    color: C.inkMuted,
  },
});
