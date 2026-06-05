import React from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { Canvas, Fill, RadialGradient, vec } from '@shopify/react-native-skia';
import {
  SensorType,
  useAnimatedSensor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTraumaInformedMotion } from '@utils/motion';
import { C } from '@theme/colors';

interface MeshGradientBgProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * Full-bleed animated background. Two overlapping radial gradients subtly
 * shift position based on device tilt (±40px max), giving a calm 3D depth
 * effect. Snap-freezes to center positions when Reduce Motion is on.
 *
 * Renders entirely on the UI thread via Reanimated + Skia; zero JS-thread
 * overhead.
 */
export function MeshGradientBg({ style }: MeshGradientBgProps) {
  const reducedMotion = useTraumaInformedMotion();

  // useAnimatedSensor drives updates on the UI thread — no expo-sensors
  // event subscription needed for this component.
  const rotation = useAnimatedSensor(SensorType.ROTATION);

  // Primary gradient center — shifts gently with pitch (forward/back tilt)
  const primaryCenter = useDerivedValue(() => {
    if (reducedMotion) return vec(200, 300);
    const y = 300 + rotation.sensor.value.pitch * 40;
    const x = 200 + rotation.sensor.value.roll * 20;
    return vec(x, y);
  });

  // Secondary gradient center — shifts with roll (left/right tilt), offset
  const secondaryCenter = useDerivedValue(() => {
    if (reducedMotion) return vec(340, 520);
    const x = 340 + rotation.sensor.value.roll * 40;
    const y = 520 - rotation.sensor.value.pitch * 20;
    return vec(x, y);
  });

  return (
    <View style={[styles.container, style]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Base cream fill */}
        <Fill color={C.creamBase} />

        {/* Primary — large soft purple bloom, shifted by tilt */}
        <Fill>
          <RadialGradient
            c={primaryCenter}
            r={420}
            colors={['rgba(74,20,140,0.12)', 'rgba(74,20,140,0.0)']}
          />
        </Fill>

        {/* Secondary — smaller warm highlight, offset position */}
        <Fill>
          <RadialGradient
            c={secondaryCenter}
            r={260}
            colors={['rgba(245,241,232,0.6)', 'rgba(245,241,232,0.0)']}
          />
        </Fill>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.creamBase,
  },
});
