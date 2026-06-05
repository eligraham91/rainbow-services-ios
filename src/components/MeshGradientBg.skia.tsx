import React from 'react';
import { StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Canvas, Fill, RadialGradient, vec } from '@shopify/react-native-skia';
import {
  SensorType,
  useAnimatedSensor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

interface Props {
  style?: StyleProp<ViewStyle>;
}

/**
 * The actual Skia implementation — only imported when the native Skia module
 * is available (i.e. EAS dev build or production build, not plain Expo Go).
 */
export function SkiaMeshLayerImpl({ style }: Props) {
  const reducedMotion = useTraumaInformedMotion();
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  const primaryCenter = useDerivedValue(() => {
    if (reducedMotion) return vec(200, 300);
    return vec(
      200 + rotation.sensor.value.roll * 40,
      300 + rotation.sensor.value.pitch * 40
    );
  });

  const secondaryCenter = useDerivedValue(() => {
    if (reducedMotion) return vec(340, 520);
    return vec(
      340 + rotation.sensor.value.roll * 40,
      520 - rotation.sensor.value.pitch * 20
    );
  });

  return (
    <Canvas style={[StyleSheet.absoluteFill, style]}>
      <Fill color={C.creamBase} />
      <Fill>
        <RadialGradient
          c={primaryCenter}
          r={420}
          colors={['rgba(74,20,140,0.12)', 'rgba(74,20,140,0.0)']}
        />
      </Fill>
      <Fill>
        <RadialGradient
          c={secondaryCenter}
          r={260}
          colors={['rgba(245,241,232,0.6)', 'rgba(245,241,232,0.0)']}
        />
      </Fill>
    </Canvas>
  );
}
