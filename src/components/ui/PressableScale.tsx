import React from 'react';
import { Pressable, type StyleProp, type ViewStyle, type AccessibilityRole } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';

interface PressableScaleProps {
  children: React.ReactNode;
  onPress: () => void;
  /** Scale while pressed. Default 0.97. */
  scaleTo?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
}

const PRESS_SPRING = { damping: 18, stiffness: 320 } as const;

/**
 * Pressable with spring-animated compress on the UI thread.
 * Replaces the instant `pressed && { scale: 0.97 }` style snap with
 * a physical-feeling press. Respects Reduce Motion (falls back to
 * a quick opacity dim).
 */
export function PressableScale({
  children,
  onPress,
  scaleTo = 0.97,
  disabled = false,
  style,
  accessibilityRole = 'button',
  accessibilityLabel,
}: PressableScaleProps) {
  const { reduceMotion } = useTraumaInformedMotion();
  const scale = useSharedValue(1);
  const dim = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: dim.value,
  }));

  function handlePressIn() {
    if (reduceMotion) {
      dim.value = withTiming(0.82, { duration: 80 });
    } else {
      scale.value = withSpring(scaleTo, PRESS_SPRING);
      dim.value = withTiming(0.92, { duration: 100 });
    }
  }

  function handlePressOut() {
    scale.value = withSpring(1, PRESS_SPRING);
    dim.value = withTiming(1, { duration: 160 });
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}
