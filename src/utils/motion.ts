import { useReducedMotion } from 'react-native-reanimated';

/**
 * Returns true when the OS "Reduce Motion" accessibility setting is on.
 * All Phase 2+ animated components gate their animations behind this value.
 * Trauma-informed design principle: never surprise a user with motion they
 * haven't opted into.
 */
export function useTraumaInformedMotion(): boolean {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ?? false;
}
