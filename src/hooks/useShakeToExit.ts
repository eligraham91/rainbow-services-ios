import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const SHAKE_THRESHOLD = 2.5;
const SHAKE_WINDOW_MS = 1500;
const REQUIRED_SHAKES = 3;

export function useShakeToExit(): void {
  const router = useRouter();
  const shakeTimes = useRef<number[]>([]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > SHAKE_THRESHOLD) {
        const now = Date.now();
        shakeTimes.current.push(now);
        // Keep only events within the window
        shakeTimes.current = shakeTimes.current.filter(
          t => now - t < SHAKE_WINDOW_MS
        );
        if (shakeTimes.current.length >= REQUIRED_SHAKES) {
          shakeTimes.current = [];
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          router.replace('/stealth');
        }
      }
    });

    return () => subscription.remove();
  }, [router]);
}
