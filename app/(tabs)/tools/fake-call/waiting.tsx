import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeContext';

export default function FakeCallWaitingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { callerName, delay } = useLocalSearchParams<{ callerName: string; delay: string }>();
  const seconds = parseInt(delay ?? '10', 10);
  const remaining = useRef(seconds);
  const [display, setDisplay] = React.useState(seconds);

  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.6, { duration: 900, easing: Easing.out(Easing.quad) }),
      -1, true
    );

    const tick = setInterval(() => {
      remaining.current -= 1;
      setDisplay(remaining.current);
      if (remaining.current <= 0) {
        clearInterval(tick);
        router.replace({
          pathname: '/(tabs)/tools/fake-call/incoming',
          params: { callerName: callerName ?? 'Mom' },
        });
      }
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  function handleCancel() {
    router.back();
  }

  return (
    <View style={[styles.root, { backgroundColor: '#000000' }]}>
      <View style={[styles.body, { paddingTop: insets.top + 20 }]}>
        <Animated.View style={[styles.pulse, pulseStyle]} />
        <Text style={styles.countdownNum}>{display}</Text>
        <Text style={styles.countdownLabel}>seconds until call</Text>
        <Text style={styles.callerPreview}>{callerName ?? 'Mom'}</Text>
        <Text style={styles.callerSub}>mobile</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable
          onPress={handleCancel}
          style={styles.cancelBtn}
          accessibilityRole="button"
          accessibilityLabel="Cancel fake call"
        >
          <Text style={styles.cancelLabel}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  countdownNum: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 80,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 88,
  },
  countdownLabel: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 11,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 32,
  },
  callerPreview: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  callerSub: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  footer: { alignItems: 'center' },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  cancelLabel: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
