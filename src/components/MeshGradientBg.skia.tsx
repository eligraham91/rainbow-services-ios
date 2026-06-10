import React, { useMemo } from 'react';
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Canvas, Fill, RadialGradient } from '@shopify/react-native-skia';
import {
  SensorType,
  useAnimatedSensor,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';

interface Props {
  style?: StyleProp<ViewStyle>;
  dark?: boolean;
  scrollY?: SharedValue<number>;
  // Accent blob tint as 'r,g,b' (from useTheme().meshRgb)
  meshRgb?: string;
}

// Time-of-day palette keyframes (EXPERIENCE-2026.md §1.1). Computed locally
// from the device clock — no location, no network. Values lerp cyclically
// between anchors so the 8am app and the 10pm app feel like different rooms.
interface MoodKeyframe {
  at: number; // minutes since midnight
  accentShift: [number, number, number]; // added to the accent blob rgb
  amberShift: [number, number, number]; // added to the amber/warm blob rgb
  alpha: number; // blob opacity multiplier
  drift: number; // gyro tilt multiplier (night is slower)
}

const MOOD_KEYFRAMES: MoodKeyframe[] = [
  // Night (anchor 1am): dimmer and slower
  { at: 60, accentShift: [0, 0, 0], amberShift: [0, 0, 0], alpha: 0.65, drift: 0.5 },
  // Dawn (anchor 7am): accent warms toward rose, amber gains a pale gold edge
  { at: 420, accentShift: [45, -5, -15], amberShift: [15, 25, 30], alpha: 1, drift: 1 },
  // Day (anchor 1pm): the canonical palette
  { at: 780, accentShift: [0, 0, 0], amberShift: [0, 0, 0], alpha: 1, drift: 1 },
  // Dusk (anchor 7pm): deeper accent, amber slides toward ember
  { at: 1140, accentShift: [-20, -12, 15], amberShift: [-10, -30, -20], alpha: 1, drift: 1 },
];

const DAY_MINUTES = 24 * 60;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function timeMood(now: Date) {
  const m = now.getHours() * 60 + now.getMinutes();
  const frames = MOOD_KEYFRAMES;
  // Find the surrounding pair cyclically
  let prev = frames[frames.length - 1];
  let next = frames[0];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const g = frames[(i + 1) % frames.length];
    const span = (g.at - f.at + DAY_MINUTES) % DAY_MINUTES;
    const into = (m - f.at + DAY_MINUTES) % DAY_MINUTES;
    if (into < span) {
      prev = f;
      next = g;
      break;
    }
  }
  const span = (next.at - prev.at + DAY_MINUTES) % DAY_MINUTES;
  const into = (m - prev.at + DAY_MINUTES) % DAY_MINUTES;
  const t = span === 0 ? 0 : into / span;
  return {
    accentShift: prev.accentShift.map((v, i) => lerp(v, next.accentShift[i], t)),
    amberShift: prev.amberShift.map((v, i) => lerp(v, next.amberShift[i], t)),
    alpha: lerp(prev.alpha, next.alpha, t),
    drift: lerp(prev.drift, next.drift, t),
  };
}

function clamp255(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function shifted(rgb: string, shift: number[]): string {
  const parts = rgb.split(',').map(Number);
  return parts.map((v, i) => clamp255(v + (shift[i] ?? 0))).join(',');
}

export function SkiaMeshLayerImpl({ style, dark = false, scrollY, meshRgb }: Props) {
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  // Computed once per mount. A session rarely crosses a palette boundary
  // visibly, and the next open lands on the new mood.
  const mood = useMemo(() => timeMood(new Date()), []);

  const tiltScale = reducedMotion ? 0 : mood.drift;

  // Purple primary blob — upper-left, prominent
  const primaryCenter = useDerivedValue(() => {
    const tiltX = rotation.sensor.value.roll * 30 * tiltScale;
    const tiltY = rotation.sensor.value.pitch * 30 * tiltScale;
    const scrollShift = scrollY ? scrollY.value * 0.35 : 0;
    return { x: 80 + tiltX, y: 220 + tiltY - scrollShift };
  });

  // Amber/peach blob — lower-right, slower parallax
  const amberCenter = useDerivedValue(() => {
    const tiltX = rotation.sensor.value.roll * 20 * tiltScale;
    const tiltY = rotation.sensor.value.pitch * 15 * tiltScale;
    const scrollShift = scrollY ? scrollY.value * 0.15 : 0;
    return { x: 360 + tiltX, y: 680 - tiltY - scrollShift };
  });

  // Soft warm secondary — lower-center, very slow parallax
  const warmCenter = useDerivedValue(() => {
    const scrollShift = scrollY ? scrollY.value * 0.08 : 0;
    return { x: 280, y: 780 - scrollShift };
  });

  const bgColor = dark ? '#2A2618' : '#F5F1E8';

  const { purpleColors, amberColors, warmColors } = useMemo(() => {
    const accentBase = meshRgb ?? (dark ? '140,90,220' : '90,55,170');
    const amberBase = dark ? '190,130,55' : '210,145,65';
    const warmBase = dark ? '160,110,50' : '230,185,120';

    const accent = shifted(accentBase, mood.accentShift);
    const amber = shifted(amberBase, mood.amberShift);
    const warm = shifted(warmBase, mood.amberShift);

    const a = mood.alpha;
    return {
      purpleColors: [`rgba(${accent},${(0.3 * a).toFixed(3)})`, 'rgba(0,0,0,0)'] as [string, string],
      amberColors: [
        `rgba(${amber},${((dark ? 0.22 : 0.26) * a).toFixed(3)})`,
        'rgba(0,0,0,0)',
      ] as [string, string],
      warmColors: [
        `rgba(${warm},${((dark ? 0.14 : 0.18) * a).toFixed(3)})`,
        'rgba(0,0,0,0)',
      ] as [string, string],
    };
  }, [dark, meshRgb, mood]);

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={bgColor} />

      {/* Accent blob — upper left, large radius */}
      <Fill>
        <RadialGradient
          c={primaryCenter}
          r={480}
          colors={purpleColors}
        />
      </Fill>

      {/* Amber blob — lower right */}
      <Fill>
        <RadialGradient
          c={amberCenter}
          r={360}
          colors={amberColors}
        />
      </Fill>

      {/* Warm peach bloom — lower center */}
      <Fill>
        <RadialGradient
          c={warmCenter}
          r={300}
          colors={warmColors}
        />
      </Fill>
    </Canvas>
  );
}
