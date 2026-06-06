import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@theme/ThemeContext';

interface SwipeToCallProps {
  dial: string;
  label: string;
}

const TRACK_W = 300;
const PUCK_SIZE = 52;
const PADDING = 8;
const MAX_X = TRACK_W - PUCK_SIZE - PADDING * 2;
const TRIGGER_X = MAX_X * 0.82;
const HAPTIC_STEP = 40;

function PhoneIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.6 10.8A15.6 15.6 0 0013.2 17.4l2.2-2.2a1 1 0 011-.24 11.6 11.6 0 003.58.58 1 1 0 011 1V19a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.58 3.58a1 1 0 01-.24 1L6.6 10.8z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SwipeToCall({ dial, label }: SwipeToCallProps) {
  const { theme } = useTheme();

  const x = useSharedValue(0);
  const triggered = useSharedValue(false);
  const lastHapticX = useSharedValue(0);

  const puckStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  function fireLight() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  function fireHeavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
  function callNow() {
    Linking.openURL(`tel:${dial}`);
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      triggered.value = false;
      lastHapticX.value = 0;
    })
    .onUpdate((e) => {
      'worklet';
      if (triggered.value) return;
      const clamped = Math.max(0, Math.min(MAX_X, e.translationX));
      x.value = clamped;
      if (Math.abs(clamped - lastHapticX.value) >= HAPTIC_STEP) {
        lastHapticX.value = clamped;
        runOnJS(fireLight)();
      }
      if (clamped >= TRIGGER_X) {
        triggered.value = true;
        x.value = withSpring(MAX_X, { damping: 14, stiffness: 240 });
        runOnJS(fireHeavy)();
        runOnJS(callNow)();
      }
    })
    .onEnd(() => {
      'worklet';
      if (!triggered.value) {
        x.value = withSpring(0, { damping: 18, stiffness: 200 });
        lastHapticX.value = 0;
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={styles.trackWrap}
        accessibilityRole="button"
        accessibilityLabel={`Swipe to call ${label}`}
      >
        <BlurView
          intensity={65}
          tint={theme.dark ? 'dark' : 'light'}
          style={[
            StyleSheet.absoluteFillObject,
            styles.blur,
            { borderColor: theme.rule },
          ]}
        />
        <Text style={[styles.trackLabel, { color: theme.muted }]} numberOfLines={1}>
          {label}
        </Text>
        <Animated.View style={[styles.puck, { backgroundColor: theme.accent }, puckStyle]}>
          <PhoneIcon color="#FFFFFF" />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  trackWrap: {
    width: TRACK_W,
    height: PUCK_SIZE + PADDING * 2,
    borderRadius: (PUCK_SIZE + PADDING * 2) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    borderRadius: (PUCK_SIZE + PADDING * 2) / 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  trackLabel: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  puck: {
    position: 'absolute',
    left: PADDING,
    width: PUCK_SIZE,
    height: PUCK_SIZE,
    borderRadius: PUCK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
