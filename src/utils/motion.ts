import { useReducedMotion } from 'react-native-reanimated';
import { useTheme, type QuietMode } from '@theme/ThemeContext';

// System Reduce Motion always wins. The Quiet Mode dial's Still position is
// the same experience chosen in-app (EXPERIENCE-2026.md §5.5).
export function useTraumaInformedMotion(): { reduceMotion: boolean; quiet: QuietMode } {
  const prefersReducedMotion = useReducedMotion();
  const { quiet } = useTheme();
  return {
    reduceMotion: (prefersReducedMotion ?? false) || quiet === 'still',
    quiet,
  };
}
