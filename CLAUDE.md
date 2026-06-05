# Rainbow Services — Start Here iOS App

## What this is
"Start Here" is a trauma-informed domestic violence support app for Rainbow Services (rainbowservicesdv.org). It guides survivors through understanding their situation, finding safety resources, and taking one clear next step — privately, with no account required.

## Org context
- **Rainbow Services** — DV shelter and advocacy org, San Pedro (Los Angeles), CA. Founded 1983.
- **CEO:** Laura Lull
- **24/7 crisis hotline:** 310-547-9343 (always a `tel:` link; always prominent on survivor-facing screens)
- **Main office:** 310-548-5450
- **Mailing address:** 453 West 7th Street, San Pedro, CA 90731
- **Shelter locations are never published** (VAWA §12291(b)(2) + CA Penal Code)
- **EIN:** 95-3855705
- Services are free, confidential, available in English and Spanish, for all genders, with children and pets.
- Language support: English, Spanish; Korean, Mandarin, Armenian, Tagalog via interpretation. Approved phrasing: "Call 310-547-9343 and say your language."

## Canonical figures (FY2024–25) — use exact values, no rounding
| Figure | Value |
|--------|-------|
| Individuals served | 3,867 |
| Bed nights | 18,005 |
| Emergency shelter beds (Rainbow House) | 38 |
| Transitional housing beds (Villa Paloma) | 40 |
| Total bed capacity | 78 |
| Hotline calls | 3,195 |
| Legal clients | 261 |
| Substantive legal services | 2,562 |
| Services per legal client | 9.8 |
| Cents to programs | ~86¢ (Audited FY25) — **84¢ is deprecated, do not use** |
| Government revenue share | ~84% |
| Private giving share | ~14% |
| Years in operation | 43+ |

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
- react-native-worklets ~0.5.x — worklets runtime required by reanimated 4 (babel plugin: `react-native-worklets/plugin`)
- @shopify/react-native-skia 2.2.12 — background mesh and skeleton shimmer
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

## Skia / Expo Go
Skia IS bundled in Expo Go 54 at version 2.2.12 — Skia components load in Expo Go. The try/require guards in MeshGradientBg.tsx and SkeletonShimmer.tsx are kept for safety but will succeed on Expo Go 54.

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
- [x] **Phase 3** — Swiss-grid dashboard, floating pill nav, kinetic routing, scaffold screens
- [ ] **Phase 4** — Survivor safety: offline MMKV vault, biometric document vault, shake-to-exit panic mode, app icon camouflage
- [ ] **Phase 5** — Full screen content: emergency locator, safety plan builder, legal options tree, resource finder

## Design system
Canonical tokens in `src/theme/colors.ts` (C export) and `src/styles/colors_and_type.css`:
- `creamBase` `#F5F1E8` — background
- `creamCard` `#EDE4CE` — raised surfaces
- `inkPrimary` `#1A1A1A` — headings, body
- `inkMuted` `#4A4A4A` — captions, secondary
- `purpleAnchor` `#4A148C` — brand purple, CTAs
- `safetyRed` `#C62828` — **DV safety messaging only. Not for generic danger UI.**
- `ruleLine` `#C4B99E` — dividers, card edges

Fonts: Inter Tight (display/headings, weight 700–900) + Inter (body) + JetBrains Mono (eyebrows, labels, stats).

## Brand voice (non-negotiable — applies to all copy in the app)
Full rules in `docs/brand-voice.md`, `docs/voice-rules.md`, `docs/terminology.md`.

**Tone:** Spare. Direct. Earned. Survivor agency is the frame. Not rescue narrative.

**Hard bans (no exceptions):**
- Em dashes (`—`) in body copy — use period or parentheses
- Semicolons in body sentences — use a period
- "keep the lights on" — use "sustain the response" or "fund the work"
- "rescue," "save," "help victims" — use "survivors," "serve," "support," "stand with"
- AI-tell words: "delve," "myriad," "holistic," "leverage," "utilize," "robust"
- "at-risk" for individuals — use "survivors" or "people experiencing DV"
- "victims" as primary label (non-legal contexts) — use "survivors"

**Approved program names:**
- Emergency shelter: **Rainbow House** (not "the shelter")
- Transitional housing: **Villa Paloma** (not "transitional shelter")
- **Community Housing**, **Children & Families**, **Legal Clinic** (human label; URL slug stays `/programs/legal-advocacy`)

**Numbers:** Spell out one–nine in body copy; use numerals for 10+. Stats always use numerals. Hotline: `310-547-9343` (hyphens). Oxford comma always.

## Survivor-facing safety rules
Full rules in `docs/survivor-facing-rules.md`.
- **Shelter addresses never published.** Only mailing address: 453 West 7th Street, San Pedro, CA 90731.
- **Quick Exit wording:** "takes you to a neutral page (a weather search) and clears the page from your back button where the browser allows." Do not over-claim history deletion.
- **Hotline calls ≠ people.** Never write "3,195 people called." Write "3,195 hotline calls answered."
- **Mandatory-reporting caveat** required on any screen claiming confidentiality.
- **Immediate danger:** use `CALL 911 NOW` (not "YES: CALL 911").
- Composite/anonymized quotes must be labeled: `[ COMPOSITE QUOTES · IDENTIFYING DETAILS REMOVED ]`

## File structure
```
app/               Expo Router v6 screens
  _layout.tsx      GestureHandlerRootView + StatusBar + Stack (fade_from_bottom)
  index.tsx        Dashboard: EditorialHeader + ActionGrid + FloatingCommandPill
  emergency.tsx    "I need help now" scaffold
  plan.tsx         "I am making a plan" scaffold
  vault.tsx        Secure vault scaffold
  stealth.tsx      Panic exit (black screen, "Weather", router.replace)
assets/            PNG assets (1x1 placeholders — replace before App Store)
docs/              Brand knowledge pack (voice, terminology, canonical figures)
src/
  components/      Phase 2 motion components + ui/ (Phase 3)
    ui/            EditorialHeader, ActionGrid, FloatingCommandPill
  styles/          colors_and_type.css (canonical CSS tokens, reference only)
  theme/           colors.ts (C + Colors exports), typography.ts
  utils/           motion.ts (useTraumaInformedMotion)
metro.config.js    Metro config
eas.json           EAS build profiles
app.json           Expo config
babel.config.js    module-resolver aliases + react-native-worklets/plugin
```

## Assets needed before App Store submission
Replace 1×1 PNG placeholders in `assets/` with real brand assets:
- `icon.png` — 1024×1024, no transparency
- `splash.png` — 1284×2778 recommended
- `adaptive-icon.png` — 1024×1024 (Android)
- `favicon.png` — 48×48 (web)
