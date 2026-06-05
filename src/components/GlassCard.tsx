import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  /**
   * Optional shared value controlling active state. When true the border
   * brightens from 0.1 → 0.3 opacity, mimicking visionOS material depth.
   */
  isActive?: SharedValue<boolean>;
  /** BlurView intensity (0–100). Default 18. */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * visionOS-style glass card. On iOS: expo-blur BlurView with an animated
 * border that reacts to active state. On Android: semi-transparent View
 * fallback (BlurView has limited Android support).
 */
export function GlassCard({
  children,
  isActive,
  intensity = 18,
  style,
}: GlassCardProps) {
  const reducedMotion = useTraumaInformedMotion();

  const borderOpacityValue = useDerivedValue(() => {
    if (reducedMotion) return 0.15;
    const target = isActive?.value ? 0.3 : 0.1;
    return withTiming(target, { duration: 200 });
  });

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255, 255, 255, ${borderOpacityValue.value})`,
  }));

  if (Platform.OS === 'android') {
    return (
      <Animated.View style={[styles.card, styles.androidFallback, animatedBorderStyle, style]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <AnimatedView style={[styles.card, animatedBorderStyle, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'rgba(245, 241, 232, 0.25)',
  },
  androidFallback: {
    backgroundColor: `${C.creamCard}E6`, // ~90% opacity cream card
  },
  content: {
    // Sits above the BlurView (which is absolute-filled)
    position: 'relative',
    zIndex: 1,
  },
});
