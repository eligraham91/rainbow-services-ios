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
}

export function SkiaMeshLayerImpl({ style, dark = false, scrollY }: Props) {
  const { reduceMotion: reducedMotion } = useTraumaInformedMotion();
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  // Purple primary blob — upper area, drifts up fastest on scroll
  const primaryCenter = useDerivedValue(() => {
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 40;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 40;
    const scrollShift = scrollY ? scrollY.value * 0.35 : 0;
    return { x: 160 + tiltX, y: 280 + tiltY - scrollShift };
  });

  // Cream/warm secondary blob — mid-lower, slower parallax
  const secondaryCenter = useDerivedValue(() => {
    const tiltX = reducedMotion ? 0 : rotation.sensor.value.roll * 30;
    const tiltY = reducedMotion ? 0 : rotation.sensor.value.pitch * 20;
    const scrollShift = scrollY ? scrollY.value * 0.18 : 0;
    return { x: 310 + tiltX, y: 560 - tiltY - scrollShift };
  });

  // Amber/peach accent blob — appears as content reveals it on scroll
  const amberCenter = useDerivedValue(() => {
    const scrollShift = scrollY ? scrollY.value * 0.08 : 0;
    return { x: 340, y: 680 - scrollShift };
  });

  const bgColor = dark ? '#2A2618' : '#F5F1E8';
  const purpleColor = dark
    ? 'rgba(159,111,227,0.14)'
    : 'rgba(74,20,140,0.12)';
  const warmColor = dark
    ? 'rgba(58,53,34,0.6)'
    : 'rgba(245,241,232,0.55)';
  const amberColor = dark
    ? 'rgba(180,130,60,0.11)'
    : 'rgba(210,160,90,0.10)';

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={bgColor} />
      <Fill>
        <RadialGradient
          c={primaryCenter}
          r={420}
          colors={[purpleColor, 'rgba(0,0,0,0)']}
        />
      </Fill>
      <Fill>
        <RadialGradient
          c={secondaryCenter}
          r={260}
          colors={[warmColor, 'rgba(0,0,0,0)']}
        />
      </Fill>
      <Fill>
        <RadialGradient
          c={amberCenter}
          r={280}
          colors={[amberColor, 'rgba(0,0,0,0)']}
        />
      </Fill>
    </Canvas>
  );
}
