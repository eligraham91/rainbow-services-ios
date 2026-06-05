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
- **Expo SDK 54** / React Native 0.81.5 / React 19.1.0
- Expo Router v6 (file-based routing under `app/`)
- react-native-reanimated 4.1.7 — all animations (UI thread only, no legacy Animated)
- react-native-worklets — worklets runtime required by reanimated 4 (babel plugin: `react-native-worklets/plugin`)
- @shopify/react-native-skia 2.2.12 — background mesh and skeleton shimmer (dev/prod builds only)
- expo-blur — glassmorphic cards (native UIVisualEffectView on iOS)
- expo-haptics — tactile button feedback
- expo-sensors — gyroscope for mesh gradient (via reanimated useAnimatedSensor)
- TypeScript 5.8, strict mode

## Key commands
```bash
npm run start:tunnel      # Local dev with tunnel (Expo Go)
npm run build:preview     # EAS preview build (internal distribution)
npm run build:production  # EAS production build (App Store)
EXPO_TOKEN=<token> npx eas-cli update --branch main --message "..." --non-interactive
npx tsc --noEmit          # Type check
npx expo export --platform ios --output-dir dist-check  # Bundle smoke test
```

## Required environment secrets
| Secret name | Where needed | Used for |
|-------------|-------------|----------|
| `EXPO_TOKEN` | Claude Code session + GitHub Actions | EAS CLI (eas update, eas build) |
| `STRIPE_SECRET_KEY` | Claude Code session | Donation processing (Phase 4+) |
| `STRIPE_PUBLISHABLE_KEY` | Claude Code session | Client-side Stripe (Phase 4+) |
| `SANITY_API_READ_TOKEN` | Claude Code session | CMS content (future) |

## ⚠️ One manual step required — GitHub Actions secret
The CI auto-publish workflow (`.github/workflows/eas-update.yml`) needs `EXPO_TOKEN` added as a GitHub repository secret. Claude cannot add GitHub secrets programmatically.

**To add it (30 seconds):**
1. Go to https://github.com/eligraham91/rainbow-services-ios/settings/secrets/actions
2. Click **New repository secret**
3. Name: `EXPO_TOKEN`, Value: your Expo token
4. Click **Add secret**

After this, every push to `main` auto-publishes to Expo Go with no manual steps.

## Skia / Expo Go split
Skia is NOT bundled in standard Expo Go. Two components lazy-load with a safety guard:
- `MeshGradientBg.tsx` → falls back to static cream bg in Expo Go
- `SkeletonShimmer.tsx` → falls back to reanimated opacity pulse in Expo Go

**In Expo Go:** GlassCard, SpringButton, all screens, opacity shimmer all work.
**In dev/production build:** Full Skia gyro mesh + sweep shimmer.

## Runtime version
Uses `"policy": "sdkVersion"` → `exposdk:54.0.0`. Matches Expo Go 54.0.2.
**Never change to `"appVersion"` — it breaks Expo Go compatibility.**

## Branch strategy
- `main` — stable, auto-publishes to Expo CDN via GitHub Actions on push
- `claude/exciting-tesla-UR4HS` — current active development branch (Phase 2+)
- PRs from feature branches → `main` trigger the publish workflow

## Phase roadmap
- [x] **Phase 1** — Expo SDK 54, Router v6, EAS config, tunnel
- [x] **Phase 2** — Motion engine: MeshGradientBg (Skia+gyro), GlassCard (expo-blur), SpringButton (haptics), SkeletonShimmer
- [ ] **Phase 3** — Screen architecture: shared-element routing, gesture-driven navigation, bottom sheets, Swiss-grid typography
- [ ] **Phase 4** — Survivor safety: offline MMKV vault, biometric document vault, shake-to-exit panic mode, app icon camouflage

## Design system
Colors are in `src/theme/colors.ts`:
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
app/               Expo Router v6 screens (_layout.tsx, index.tsx, ...)
assets/            PNG assets (1x1 placeholders — replace before App Store)
src/
  components/      MeshGradientBg, GlassCard, SpringButton, SkeletonShimmer, Icons
  screens/         Full screen components (Phase 3+)
  theme/           colors.ts
  utils/           motion.ts (useTraumaInformedMotion)
metro.config.js    Metro config extending expo/metro-config
eas.json           EAS build profiles (development, preview, production)
app.json           Expo config (owner, slug, projectId, runtimeVersion)
babel.config.js    module-resolver aliases + react-native-worklets/plugin
```

## Assets needed before App Store submission
Replace 1×1 PNG placeholders in `assets/` with real brand assets:
- `icon.png` — 1024×1024, no transparency
- `splash.png` — 1284×2778 recommended
- `adaptive-icon.png` — 1024×1024 (Android)
- `favicon.png` — 48×48 (web)
