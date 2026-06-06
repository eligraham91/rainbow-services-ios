import React from 'react';
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Canvas, Fill, RadialGradient, Circle } from '@shopify/react-native-skia';
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
}

export function SkiaMeshLayerImpl({ style, dark = false, scrollY }: Props) {
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  // Purple primary blob — upper-left, prominent
  const primaryCenter = useDerivedValue(() => {
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 30;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 30;
    const scrollShift = scrollY ? scrollY.value * 0.35 : 0;
    return { x: 80 + tiltX, y: 220 + tiltY - scrollShift };
  });

  // Amber/peach blob — lower-right, slower parallax
  const amberCenter = useDerivedValue(() => {
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 20;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 15;
    const scrollShift = scrollY ? scrollY.value * 0.15 : 0;
    return { x: 360 + tiltX, y: 680 - tiltY - scrollShift };
  });

  // Soft warm secondary — lower-center, very slow parallax
  const warmCenter = useDerivedValue(() => {
    const scrollShift = scrollY ? scrollY.value * 0.08 : 0;
    return { x: 280, y: 780 - scrollShift };
  });

  const bgColor = dark ? '#2A2618' : '#F5F1E8';

  // Light mode: vivid purple and warm amber matching the design handoff
  // Dark mode: slightly softer but still prominent
  const purpleColors: [string, string] = dark
    ? ['rgba(140,90,220,0.30)', 'rgba(0,0,0,0)']
    : ['rgba(90,55,170,0.30)', 'rgba(0,0,0,0)'];

  const amberColors: [string, string] = dark
    ? ['rgba(190,130,55,0.22)', 'rgba(0,0,0,0)']
    : ['rgba(210,145,65,0.26)', 'rgba(0,0,0,0)'];

  const warmColors: [string, string] = dark
    ? ['rgba(160,110,50,0.14)', 'rgba(0,0,0,0)']
    : ['rgba(230,185,120,0.18)', 'rgba(0,0,0,0)'];

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={bgColor} />

      {/* Purple blob — upper left, large radius */}
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
