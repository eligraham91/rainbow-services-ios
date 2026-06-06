import { useReducedMotion } from 'react-native-reanimated';

export function useTraumaInformedMotion(): { reduceMotion: boolean } {
  const prefersReducedMotion = useReducedMotion();
  return { reduceMotion: prefersReducedMotion ?? false };
}
