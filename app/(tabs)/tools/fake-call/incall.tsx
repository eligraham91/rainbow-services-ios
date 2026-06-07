import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function PhoneEndIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: '135deg' }] }}>
      <Path
        d="M6.6 10.8A15.6 15.6 0 0013.2 17.4l2.2-2.2a1 1 0 011-.24 11.6 11.6 0 003.58.58 1 1 0 011 1V19a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.58 3.58a1 1 0 01-.24 1L6.6 10.8z"
        fill="#FFFFFF"
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

export default function FakeCallInCallScreen() {
  const insets = useSafeAreaInsets();
  const { callerName } = useLocalSearchParams<{ callerName: string }>();
  const name = callerName?.trim() || 'Mom';

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleEnd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
    router.back(); // pop both incoming and incall
  }

  return (
    <View style={styles.root}>
      {/* Top: caller + timer */}
      <View style={[styles.topSection, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.callerName}>{name}</Text>
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
        <Monogram name={name} size={80} />
      </View>

      {/* Action grid (muted/speaker/keypad stubs — visual only) */}
      <View style={styles.actionGrid}>
        {[
          { label: 'mute' },
          { label: 'keypad' },
          { label: 'speaker' },
          { label: 'add call' },
          { label: 'FaceTime' },
          { label: 'contacts' },
        ].map(btn => (
          <View key={btn.label} style={styles.gridBtn}>
            <View style={styles.gridBtnCircle} />
            <Text style={styles.gridBtnLabel}>{btn.label}</Text>
          </View>
        ))}
      </View>

      {/* End call */}
      <View style={[styles.endRow, { paddingBottom: insets.bottom + 40 }]}>
        <Pressable
          onPress={handleEnd}
          style={styles.endBtn}
          accessibilityRole="button"
          accessibilityLabel="End call"
        >
          <PhoneEndIcon />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  callerName: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  timer: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1,
    marginBottom: 28,
  },
  monogram: {
    backgroundColor: '#636366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: 'InterTight-ExtraBold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 32,
    gap: 0,
    rowGap: 24,
    justifyContent: 'space-between',
  },
  gridBtn: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
  },
  gridBtnCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  gridBtnLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  endRow: {
    alignItems: 'center',
  },
  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
