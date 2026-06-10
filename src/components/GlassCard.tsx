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
import { useTheme } from '@theme/ThemeContext';

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
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const { theme } = useTheme();

  const borderOpacityValue = useDerivedValue(() => {
    if (reducedMotion) return 0.15;
    const target = isActive?.value ? 0.3 : 0.1;
    return withTiming(target, { duration: 200 });
  });

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255, 255, 255, ${borderOpacityValue.value})`,
  }));

  if (Platform.OS === 'android') {
    const androidBg = theme.dark ? 'rgba(55,51,31,0.9)' : 'rgba(237,228,206,0.9)';
    return (
      <Animated.View style={[styles.card, { backgroundColor: androidBg }, animatedBorderStyle, style]}>
        {children}
      </Animated.View>
    );
  }

  const cardBg = theme.dark ? 'rgba(55,51,31,0.35)' : 'rgba(245,241,232,0.25)';

  return (
    <AnimatedView style={[styles.card, { backgroundColor: cardBg }, animatedBorderStyle, style]}>
      <BlurView
        intensity={intensity}
        tint={theme.dark ? 'dark' : 'light'}
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
  },
  content: {
    // Sits above the BlurView (which is absolute-filled)
    position: 'relative',
    zIndex: 1,
  },
});
