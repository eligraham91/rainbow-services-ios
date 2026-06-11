import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Vibration,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle } from 'react-native-svg';

// Bundled ringtone — add assets/audio/ringtone.m4a before ship
let RINGTONE: number | null = null;
try { RINGTONE = require('@/../assets/audio/ringtone.m4a'); } catch { /* asset not bundled yet */ }

const PUCK_SIZE = 72;

function PhoneIcon({ color, rotate }: { color: string; rotate?: boolean }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" style={rotate ? { transform: [{ rotate: '135deg' }] } : undefined}>
      <Path
        d="M6.6 10.8A15.6 15.6 0 0013.2 17.4l2.2-2.2a1 1 0 011-.24 11.6 11.6 0 003.58.58 1 1 0 011 1V19a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.58 3.58a1 1 0 01-.24 1L6.6 10.8z"
        fill={color}
      />
    </Svg>
  );
}

function Monogram({ name, size }: { name: string; size: number }) {
  const initials = name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <View style={[styles.monogram, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.monogramText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

function RingWave({ delay }: { delay: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(2.2, { duration: 1600, easing: Easing.out(Easing.quad) })
      ),
      -1, false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: delay }),
        withTiming(0, { duration: 1600, easing: Easing.out(Easing.quad) })
      ),
      -1, false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ringWave,
        { width: 100, height: 100, borderRadius: 50 },
        style,
      ]}
    />
  );
}

export default function FakeCallIncomingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { callerName } = useLocalSearchParams<{ callerName: string }>();
  const name = callerName?.trim() || 'Mom';

  // Track spans the screen minus section padding (32×2) and inner
  // track padding (6×2); puck travels the remainder.
  const maxSlide = width - 64 - 12 - PUCK_SIZE;
  const acceptAt = maxSlide * 0.85;

  const player = useAudioPlayer(RINGTONE ?? null);
  const slideX = useSharedValue(0);
  const accepted = useRef(false);

  useEffect(() => {
    // Silent-mode override: autoplay on mount
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    if (RINGTONE && player) {
      player.loop = true;
      player.play();
    }

    // Vibration: 500ms on, 1000ms off, repeat
    Vibration.vibrate([500, 1000], true);

    return () => {
      Vibration.cancel();
      if (player) player.pause();
    };
  }, []);

  function stopRing() {
    Vibration.cancel();
    if (player) player.pause();
  }

  function handleDecline() {
    stopRing();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  }

  function handleAccept() {
    if (accepted.current) return;
    accepted.current = true;
    stopRing();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace({
      pathname: '/(tabs)/tools/fake-call/incall',
      params: { callerName: name },
    });
  }

  const puckStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  // Hint fades out as the puck approaches it, like the native slider
  const hintStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, slideX.value / (maxSlide * 0.5)),
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      const clamped = Math.max(0, Math.min(maxSlide, e.translationX));
      slideX.value = clamped;
    })
    .onEnd(() => {
      'worklet';
      if (slideX.value >= acceptAt) {
        slideX.value = withTiming(maxSlide, { duration: 80 });
        runOnJS(handleAccept)();
      } else {
        slideX.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  return (
    <View style={styles.root} accessibilityViewIsModal>
      {/* Top section: caller info */}
      <View style={[styles.topSection, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.callType}>FaceTime Audio</Text>
        <Text style={styles.callerName}>{name}</Text>
        <Text style={styles.callerSub}>mobile</Text>

        {/* Monogram with ring waves */}
        <View style={styles.avatarWrap}>
          <RingWave delay={0} />
          <RingWave delay={533} />
          <RingWave delay={1066} />
          <Monogram name={name} size={100} />
        </View>
      </View>

      {/* Bottom section: decline / accept */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 40 }]}>
        {/* Slide to answer */}
        <View style={styles.slideTrackWrap}>
          <View style={styles.slideTrack}>
            <Animated.Text style={[styles.slideHint, hintStyle]}>slide to answer</Animated.Text>
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[styles.slidePuck, styles.acceptPuck, puckStyle]}
                accessibilityRole="button"
                accessibilityLabel="Slide to answer"
              >
                <PhoneIcon color="#FFFFFF" />
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        {/* Decline button */}
        <Pressable
          onPress={handleDecline}
          style={[styles.actionBtn, styles.declineBtn]}
          accessibilityRole="button"
          accessibilityLabel="Decline"
        >
          <PhoneIcon color="#FFFFFF" rotate />
          <Text style={styles.actionLabel}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1C1C1E', // iOS dark call background
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  callType: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: 4,
  },
  callerName: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  callerSub: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 36,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    position: 'absolute',
    backgroundColor: '#636366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ringWave: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  bottomSection: {
    alignItems: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  slideTrackWrap: { width: '100%' },
  slideTrack: {
    height: PUCK_SIZE + 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: (PUCK_SIZE + 12) / 2,
    justifyContent: 'center',
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  slideHint: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  slidePuck: {
    position: 'absolute',
    left: 6,
    width: PUCK_SIZE,
    height: PUCK_SIZE,
    borderRadius: PUCK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptPuck: { backgroundColor: '#34C759' },
  actionBtn: {
    width: PUCK_SIZE,
    height: PUCK_SIZE,
    borderRadius: PUCK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  declineBtn: { backgroundColor: '#FF3B30' },
  actionLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: -22,
  },
});
