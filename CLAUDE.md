# Rainbow Services — Start Here iOS App

## What this is
"Start Here" is a trauma-informed domestic violence support app for Rainbow Services (rainbowservicesdv.org). It guides survivors through understanding their situation, finding safety resources, and taking one clear next step — privately, with no account required.

## Expo / EAS project
| Field | Value |
|-------|-------|
| Owner | `eligraham91` |
| Slug | `rainbow-ios` |
| Project ID | `bc49c954-3b0b-4ee4-b0b8-eb37eed61b4a` |
| Bundle ID (iOS) | `org.rainbowservicesdv.starthere` |
| EAS Dashboard | https://expo.dev/accounts/eligraham91/projects/rainbow-ios |

## Tech stack
- Expo SDK 53 / React Native 0.76.9
- Expo Router v4 (file-based routing under `app/`)
- react-native-reanimated 3.16 — all animations (UI thread only, no legacy Animated)
- @shopify/react-native-skia 1.5 — background mesh and skeleton shimmer (dev/prod builds only)
- expo-blur — glassmorphic cards (native UIVisualEffectView on iOS)
- expo-haptics — tactile button feedback
- expo-sensors — gyroscope for mesh gradient (via reanimated useAnimatedSensor)
- TypeScript 5.8, strict mode

## Key commands
```bash
npm run start:tunnel      # Local dev with tunnel (Expo Go)
npm run build:preview     # EAS preview build (internal distribution)
npm run build:production  # EAS production build (App Store)
eas update --branch main  # Publish JS bundle to Expo CDN (Expo Go compatible)
npx tsc --noEmit          # Type check
npx expo export --platform ios --output-dir dist-check  # Bundle smoke test
```

## Required environment secrets
| Secret name | Used for |
|-------------|----------|
| `EXPO_TOKEN` | EAS CLI authentication (eas update, eas build) |
| `STRIPE_SECRET_KEY` | Donation processing (Phase 4+) |
| `STRIPE_PUBLISHABLE_KEY` | Client-side Stripe (Phase 4+) |
| `SANITY_API_READ_TOKEN` | CMS content (future) |

## Skia / Expo Go split
Skia (react-native-skia) is NOT bundled in standard Expo Go. Two components use a safe lazy-load guard:
- `MeshGradientBg.tsx` — loads `MeshGradientBg.skia.tsx` only if Skia is available; falls back to static cream bg
- `SkeletonShimmer.tsx` — loads `SkeletonShimmer.skia.tsx` only if Skia is available; falls back to reanimated opacity pulse

**In Expo Go:** GlassCard, SpringButton, all screens work. Gyro background and Skia shimmer show static fallbacks.
**In dev/production build:** Full Skia experience.

## Runtime version
Uses `"policy": "sdkVersion"` → `exposdk:53.0.0`. This is required for Expo Go compatibility. Changing to `"appVersion"` will break Expo Go updates.

## Branch strategy
- `main` — stable, auto-publishes to Expo CDN via GitHub Actions on every push
- `claude/exciting-tesla-UR4HS` — current active development branch (Phase 2+)
- PRs from feature branches → `main` trigger the publish workflow

## Phase roadmap
- [x] **Phase 1** — Expo 53, Router v4, EAS config, tunnel
- [x] **Phase 2** — Motion engine: MeshGradientBg, GlassCard, SpringButton, SkeletonShimmer
- [ ] **Phase 3** — Screen architecture: shared-element routing, gesture-driven navigation, bottom sheets, Swiss-grid typography
- [ ] **Phase 4** — Survivor safety: offline MMKV vault, biometric document vault, shake-to-exit panic mode, app icon camouflage

## Design system
Colors are in `src/theme/colors.ts`. Key values:
- `creamBase` `#F5F1E8` — background
- `inkPrimary` `#1A1A1A` — headings
- `inkMuted` `#4A4A4A` — body text
- `purpleAnchor` `#4A148C` — brand purple, CTAs
- `safetyRed` `#C62828` — Quick Exit button ONLY

## Safety principles (trauma-informed)
- Quick Exit button always visible — tapping navigates away instantly
- `useTraumaInformedMotion()` gates all animations — respects iOS Reduce Motion setting
- No account required, nothing saved by default
- No personal information collected for preview/onboarding

## File structure
```
app/               Expo Router screens (_layout.tsx, index.tsx, ...)
assets/            PNG assets (placeholder — replace with real brand assets before App Store)
src/
  components/      Shared UI components (Icons, GlassCard, SpringButton, etc.)
  screens/         Full screen components imported by app/ routes
  theme/           colors.ts
  utils/           motion.ts (useTraumaInformedMotion)
eas.json           EAS build profiles (development, preview, production)
app.json           Expo config
babel.config.js    Babel with module-resolver aliases (@components, @screens, @theme, @utils)
```

## Assets needed before App Store submission
Replace placeholder 1×1 PNGs in `assets/` with real brand assets:
- `icon.png` — 1024×1024, no transparency
- `splash.png` — 1284×2778 recommended
- `adaptive-icon.png` — 1024×1024 (Android)
- `favicon.png` — 48×48 (web)
