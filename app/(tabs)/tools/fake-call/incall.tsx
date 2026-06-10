import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

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

// Grid glyphs — match the iOS call screen at a glance.
function MicOffIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Rect x={9} y={3} width={6} height={11} rx={3} stroke={color} strokeWidth={1.8} />
      <Path d="M5 11a7 7 0 0014 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12 18v3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M4 4l16 16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function KeypadIcon({ color }: { color: string }) {
  const dots: [number, number][] = [
    [7, 5], [12, 5], [17, 5],
    [7, 10], [12, 10], [17, 10],
    [7, 15], [12, 15], [17, 15],
    [12, 20],
  ];
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      {dots.map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r={1.7} fill={color} />
      ))}
    </Svg>
  );
}
function SpeakerIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M11 5L6 9H3v6h3l5 4V5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M15.5 8.5a5 5 0 010 7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M18.5 6a9 9 0 010 12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function AddCallIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={4} stroke={color} strokeWidth={1.8} />
      <Path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 8v6M16 11h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function VideoIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={6} width={13} height={12} rx={2.5} stroke={color} strokeWidth={1.8} />
      <Path d="M15 10.5l7-3.5v10l-7-3.5" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}
function ContactIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.8} />
      <Path d="M4 21c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
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

function GridButton({
  label,
  Icon,
  toggleable = false,
}: {
  label: string;
  Icon: (props: { color: string }) => React.ReactElement;
  toggleable?: boolean;
}) {
  const [active, setActive] = useState(false);

  function handlePress() {
    if (!toggleable) return;
    Haptics.selectionAsync();
    setActive(a => !a);
  }

  return (
    <Pressable onPress={handlePress} style={styles.gridBtn} accessibilityLabel={label}>
      <View style={[styles.gridBtnCircle, active && styles.gridBtnCircleActive]}>
        <Icon color={active ? '#1C1C1E' : '#FFFFFF'} />
      </View>
      <Text style={styles.gridBtnLabel}>{label}</Text>
    </Pressable>
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

      {/* Action grid — mute and speaker toggle like the real call screen */}
      <View style={styles.actionGrid}>
        <GridButton label="mute" Icon={MicOffIcon} toggleable />
        <GridButton label="keypad" Icon={KeypadIcon} />
        <GridButton label="speaker" Icon={SpeakerIcon} toggleable />
        <GridButton label="add call" Icon={AddCallIcon} />
        <GridButton label="FaceTime" Icon={VideoIcon} />
        <GridButton label="contacts" Icon={ContactIcon} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBtnCircleActive: {
    backgroundColor: '#FFFFFF',
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
