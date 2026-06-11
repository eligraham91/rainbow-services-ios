import React from 'react';
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
  meshRgb?: string; // reserved for future accent tinting; ignored here
}

export function SkiaMeshLayerImpl({ style, dark = false, scrollY }: Props) {
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  // --- blob centers (UI-thread, gyro + scroll parallax) ---

  const primaryCenter = useDerivedValue(() => {
    'worklet';
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 30;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 30;
    const scrollShift = scrollY ? scrollY.value * 0.35 : 0;
    return { x: 100 + tiltX, y: 240 + tiltY - scrollShift };
  });

  const amberCenter = useDerivedValue(() => {
    'worklet';
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 20;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 15;
    const scrollShift = scrollY ? scrollY.value * 0.15 : 0;
    return { x: 340 + tiltX, y: 660 - tiltY - scrollShift };
  });

  const warmCenter = useDerivedValue(() => {
    'worklet';
    const scrollShift = scrollY ? scrollY.value * 0.08 : 0;
    return { x: 200, y: 760 - scrollShift };
  });

  // --- colors (static per theme, strong enough to be clearly visible) ---

  const bgColor = dark ? '#2A2618' : '#F5F1E8';

  // Light: rich purple blob, warm amber, soft gold
  // Dark: brighter purple (dark bg needs higher alpha to show), ember amber
  const purpleColors: [string, string] = dark
    ? ['rgba(160,100,240,0.45)', 'rgba(0,0,0,0)']
    : ['rgba(90,40,180,0.38)', 'rgba(0,0,0,0)'];

  const amberColors: [string, string] = dark
    ? ['rgba(200,140,60,0.38)', 'rgba(0,0,0,0)']
    : ['rgba(215,145,55,0.40)', 'rgba(0,0,0,0)'];

  const warmColors: [string, string] = dark
    ? ['rgba(170,120,55,0.28)', 'rgba(0,0,0,0)']
    : ['rgba(240,195,120,0.32)', 'rgba(0,0,0,0)'];

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={bgColor} />

      {/* Purple accent blob — upper area */}
      <Fill>
        <RadialGradient c={primaryCenter} r={520} colors={purpleColors} />
      </Fill>

      {/* Amber blob — lower right */}
      <Fill>
        <RadialGradient c={amberCenter} r={400} colors={amberColors} />
      </Fill>

      {/* Warm gold bloom — lower center */}
      <Fill>
        <RadialGradient c={warmCenter} r={340} colors={warmColors} />
      </Fill>
    </Canvas>
  );
}
