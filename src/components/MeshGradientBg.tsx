import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Circle, Group, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function MeshGradientBg() {
  // 3 useSharedValue variables for X-axis movement
  const cx1 = useSharedValue(100);
  const cx2 = useSharedValue(200);
  const cx3 = useSharedValue(300);

  useEffect(() => {
    cx1.value = withRepeat(withTiming(300, { duration: 12000 }), -1, true);
    cx2.value = withRepeat(withTiming(100, { duration: 16000 }), -1, true);
    cx3.value = withRepeat(withTiming(250, { duration: 14000 }), -1, true);
  }, []);

  return (
    <Canvas style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F7F5F0' }]}>
      <Group>
        <BlurMask blur={120} style="normal" />
        <Circle cx={cx1} cy={200} r={200} color="rgba(45, 30, 61, 0.15)" />
        <Circle cx={cx2} cy={600} r={250} color="rgba(217, 119, 87, 0.10)" />
        <Circle cx={cx3} cy={400} r={150} color="rgba(45, 30, 61, 0.12)" />
      </Group>
    </Canvas>
  );
}
