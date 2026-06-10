import * as Haptics from 'expo-haptics';

// The haptic grammar (EXPERIENCE-2026.md §2.3). One vocabulary, applied
// everywhere, so the hand learns the app the way the eye does.
//
// | Pattern        | Meaning     | Used by                              |
// |----------------|-------------|--------------------------------------|
// | tick           | "noted"     | chips, toggles, checklist items      |
// | tap            | "moving"    | navigation, cards                    |
// | thunk          | "committed" | save, send, plan completion          |
// | warn           | "leaving"   | Quick Exit only                      |
// | breathePulse   | "breathe"   | somatic timing cues                  |
// | complete       | "complete"  | wizard finish, section done          |

export function tick() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function tap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function thunk() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
}

export function warn() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}

// Soft double-pulse for somatic timing cues.
export function breathePulse() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  setTimeout(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, 140);
}

// Rising triplet — the app's completion signature. Three Light impacts
// at 0ms / 90ms / 200ms.
export function complete() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  setTimeout(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, 90);
  setTimeout(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, 200);
}
