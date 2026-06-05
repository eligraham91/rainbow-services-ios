# Start Here — iOS Design & Engineering Philosophy

This file is the architectural constitution for the Start Here app. Read it before building any screen, component, or interaction. It is not a spec — it is a set of values that determines *how* everything gets built. When you receive a terse prompt like "build the safety plan screen," everything in this file is implicitly in scope.

---

## Scope — Read This First

"Start Here" is a **national** domestic violence support tool. It is built and maintained by Rainbow Services, but it is not a Rainbow Services intake app and not an advertisement for Rainbow Services programs.

**What the app is:** Education about DV, a personal safety planning tool, a national resource/shelter locator, and crisis triage — for survivors and supporters anywhere in the US.

**What the app is not:** A referral funnel for Rainbow Services programs. A donation surface. An org profile page.

**Rainbow Services in the app:** RS appears in one place only — a subtle "Built by Rainbow Services" attribution on an About screen. In the resource locator, RS is listed as a single entry covering the Los Angeles/San Pedro area, with the same card treatment as every other listed resource. No featured placement, no badge, no special prominence.

When building any screen, the subject is the **survivor's need**, not the organization's offerings. Copy is written for a survivor in Memphis, in Minneapolis, in Miami — not specifically for someone in San Pedro.

---

## Who This Is For

Survivors of domestic violence — and the people who want to help them. Often in crisis. Often on borrowed time, on a shared device, in a space that is not safe. The app may be opened and closed in five seconds. Every interaction must be purposeful, calm, and never surprising. The UI is not a product — it is a lifeline dressed as a product.

This shapes everything: the physics of transitions, the weight of buttons, the silence of the background, the instant response to panic inputs.

---

## Pillar 1 — Trauma-Informed Digital Physics

The app behaves like a physical object, not a website.

**Predictability is safety.** Every animation follows the same physical model: damped harmonic oscillator. High stiffness, moderate damping. Motion that overshoots slightly, then settles. Never linear. Never cubic-bezier approximations of physics. Actual spring physics via `withSpring`.

**No surprises.** Transitions are directional and spatial. Push right to go deeper, swipe back to retreat, dismiss downward. The user always knows where they came from and how to get back. Exception: the Quick Exit route (`/stealth`) uses `router.replace()` — intentionally non-reversible.

**Somatic feedback loop.** Every tap that commits an action fires a haptic. Not decoration — confirmation that the system received the input. Use `ImpactFeedbackStyle.Medium` for primary actions, `Light` for secondary. Haptics fire even when `useReducedMotion` is true because haptics are not motion.

**Motion always respects iOS Reduce Motion.** Every animated component imports `useTraumaInformedMotion()` from `@utils/motion` and falls back to instant opacity transitions or static states. No exceptions.

---

## Pillar 2 — 2026 Engineering Mandates

These are non-negotiable technical constraints. They apply to every component, every screen, every animation.

### Animation layer
- **Only react-native-reanimated 4 worklets.** Never `Animated` from `react-native`. Never `setTimeout` + `setState` for visual transitions. All animation runs on the UI thread via worklet functions. JS-thread drops are not acceptable.
- Spring configuration: `{ stiffness: 180–320, damping: 16–24, mass: 1 }`. Mass-based springs only — no duration-based easing for interactive elements.
- Stagger sequences: `withDelay(index * 60–100ms, withSpring(...))`. Never `setTimeout` chains.
- Shared values are the state for animation. Use `useDerivedValue` for computed values. Use `useAnimatedStyle` to bind to native props.

### Rendering layer
- **Skia (`@shopify/react-native-skia`)** is reserved for: `MeshGradientBg.tsx` and `SkeletonShimmer.tsx`. It is not a general-purpose rendering tool. Do not use Skia for cards, buttons, text, or layout.
- **expo-blur (`BlurView`)** is used for all glassmorphic surfaces (cards, pills, overlays). It maps to native `UIVisualEffectView` on iOS — zero JS overhead, GPU-composited. Never simulate blur with Skia.
- Do not animate `BlurView`'s `intensity` prop — it triggers layout recalculation. Animate a containing `Animated.View`'s `opacity` instead.

### Architecture
- **Expo Router v6** file-based routing. Every screen lives in `app/`. Deep links are free. No manual `NavigationContainer` wiring.
- **`router.replace()`** for all panic exits (Quick Exit button, any screen that must not be back-swiped to). Never `router.push()` for safety-critical navigation.
- Screen background is always `transparent` in `Stack.screenOptions`. The `MeshGradientBg` renders in `app/index.tsx` and persists visually across transitions via the content background.
- `GestureHandlerRootView` wraps everything in `_layout.tsx`. Required for swipe gestures.
- `SafeAreaProvider` + `SafeAreaView edges={['top']}` on every screen. Never hardcode top padding.

### TypeScript
- Strict mode always. No `any`. No `// @ts-ignore`. Props interfaces before component functions.
- Expo Router typed routes: `router.push('/some-screen' as const)`. Use the `href` param pattern on `SpringButton`.

### Dependencies
- **Never install a new native module without checking Expo SDK 54 compatibility first.** Incompatible native modules break Expo Go without clear error messages.
- `react-native-worklets` is pinned to `~0.5.1` — this matches the version bundled in Expo Go 54. Do not upgrade.
- Run `npx expo install` for all new Expo ecosystem packages — it resolves the correct compatible version automatically.

---

## Pillar 3 — Somatic Aesthetic

Visual design follows a single organizing principle: **negative space is content.** The interface breathes. Information is surfaced only when needed. Nothing competes for attention.

### Typography system
- **Inter Tight 700–900** — page-level headings only. Big, tight, left-aligned. Letter spacing –1.5px or tighter at large sizes.
- **Inter 400–500** — body text, descriptions, supporting copy. Never use Inter for headings.
- **JetBrains Mono** — eyebrows (small uppercase labels above headings), statistics, codes, mono UI text. Letter spacing 0.15–0.18em.
- Type scale follows `clamp()` in web — in RN, use a base of `fontSize: 38–48` for H1 and scale proportionally. Never arbitrary sizes.
- Headings break across lines intentionally. Multi-line H1s are not wrapping failures — they are design decisions.

### Layout grid
- 24px horizontal margins. Always. Consistent on every screen.
- Content sections separated by 32–48px gaps. No dividers unless structurally necessary (prefer space).
- Cards: `borderRadius: 16–20`. Subtle elevation via `shadowColor`, `shadowOffset`, `shadowOpacity: 0.06–0.10`. No hard edges.
- The floating pill nav sits 32px above the bottom safe area. Content scrolls under it — pad scrollView `paddingBottom: 120–130`.

### Color philosophy
- The palette is locked. Canonical tokens are in `src/theme/colors.ts`.
- `creamBase (#F5F1E8)` — background. Warm, not clinical. Not white.
- `purpleAnchor (#4A148C)` — primary CTAs, interactive states. Used deliberately, not decoratively.
- `safetyRed (#C62828)` — Quick Exit button and DV safety messaging **only**. If red appears anywhere else in the UI, it is a bug.
- `inkPrimary (#1A1A1A)` — headings and primary text.
- `inkMuted (#4A4A4A)` — captions, secondary text, disabled states.
- Glass overlays: `rgba(245, 241, 232, 0.25)` for cream-tinted glass, `rgba(255, 255, 255, 0.15)` for bright-edge borders.
- Never introduce new colors. Never approximate brand colors from memory. Read `src/theme/colors.ts`.

### Motion aesthetic
- Entry: elements enter from below (+40–60px translateY) with simultaneous opacity 0→1, staggered by 60–80ms per element.
- Exit: reverse, compressed timing.
- Press feedback: scale to 0.93–0.96, spring back. The compression must be *felt* — stiffness 220–300.
- Background mesh gradient shifts subtly with device gyroscope (±40px center displacement). Imperceptible at rest, perceptible in motion. Calm, not dizzying.
- All motion reads as physical weight. Heavy elements (full-screen cards) move slower and overshoot more. Light elements (pills, labels) snap faster.

---

## Pillar 4 — Zero-Trust Spatial Architecture

The user's device may be monitored. Every architectural decision treats this as a baseline assumption.

**Local-first, nothing remote.** User state (answers to safety assessments, saved resources, documents) lives on-device in encrypted MMKV storage. No server receives personally identifying information. No analytics tied to user identity.

**AppState masking.** When the app moves to background (`AppState === 'background'`), sensitive screens (anything beyond the home screen) show a neutral overlay. The iOS task switcher must not reveal screen contents. Implement via `AppState` listener + absolute-positioned `View` with `backgroundColor: Colors.creamBase`.

**Panic exit is always one tap.** The Quick Exit affordance is persistent on any screen a survivor might be using. It navigates via `router.replace('/stealth')` — no back history. The stealth screen is indistinguishable from a weather app at a glance.

**No deep links to sensitive screens.** Expo Router universal links are disabled for Phase 3–4 screens. A shared link should never open directly to a safety plan or document vault.

**No logging in production.** `console.log` is development-only. No analytics events for user-generated content.

---

## Pillar 5 — Premium Interaction Paradigms

When in doubt about how an interaction should feel, these are the reference implementations. Study the interaction model, not the visual design.

| App | What to steal |
|-----|---------------|
| **Things 3** | Checkbox interactions — the satisfaction of completion as physical event. Checklists should feel tactile. |
| **Clear (by Reeder)** | Gestural hierarchy — pull-to-add, swipe-to-complete, depth conveyed through translucency rather than z-index. |
| **Linear** | Floating command UI — the command palette that appears from nowhere and dismisses cleanly. No permanent chrome. |
| **Amie** | Pill navigation — minimal, floating, thumb-reachable. Nav that doesn't take space until summoned. |
| **Airbnb** | Bottom sheet choreography — maps + sheets in harmony. Sheet drag state drives map zoom. Shared-element hero transitions between list and detail. |
| **Chronicle** | Shared-element transitions — an element from a card becomes the hero of the next screen. The card *is* the screen. No perception of navigation. |
| **Apple Fitness** | Ring/progress animations — arcs drawn with satisfying physics, completions with burst haptics. |
| **Craft** | Editorial whitespace — documents that feel like paper. The canvas breathes. Text is the star. |

The organizing idea: **the interface recedes, the content advances.** Chrome exists to serve content, not to announce itself.

---

## Pillar 6 — Flat Hub Architecture

There are no tab bars. No hamburger menus. No bottom navigation bars with icons.

**The FloatingCommandPill is the nav.** It lives 32px above the safe area on every screen. It has 3–4 actions max. It dismisses or contextually transforms per screen. It is always accessible by the user's right thumb.

**Hub-and-spoke routing.** The home screen (`/`) is the hub. Screens are spokes. Users navigate hub → spoke → hub. Deep nesting (spoke → spoke → spoke) is a signal that the IA needs to be flattened.

**Progressive disclosure.** Show the one most important action. Reveal secondary actions through gesture or scroll. Never show everything at once. The user's cognitive load is already high — the interface does not add to it.

**Screen templates over one-offs.** Every screen in the app is one of three types:
1. **Focus screen** — single CTA, minimal text, full-height background. Used for decision points.
2. **List screen** — scrollable content, card grid, skeleton loading state. Used for resources, options.
3. **Detail screen** — rich content, back gesture, no bottom pill (or pill transformed to context-specific action).

All three share the same layout grid, typography system, and background layer.

---

## Pillar 7 — Brand Voice in UI Strings

> **Scope reminder:** Copy is written for a national audience. When referencing hotlines or resources, always lead with the **National DV Hotline (1-800-799-7233)** as the primary resource. The Rainbow Services local line (310-547-9343) appears as a secondary, geography-labeled option. Program names (Rainbow House, Villa Paloma, Legal Clinic) appear only in the resource locator and About screen — not as the subject of general educational or crisis copy.

UI copy follows the same constraints as website copy. Full rules in `docs/voice-rules.md` and `docs/terminology.md`. Non-negotiables for every string written in the app:

- No em dashes (`—`). Use a period or parentheses.
- No semicolons in body copy.
- No AI-tells: "delve," "myriad," "leverage," "comprehensive," "robust."
- No rescue language: "we save survivors," "help victims."
- Use "survivor," not "victim" (except in legal-context labels).
- Use "Rainbow House" (emergency shelter) or "Villa Paloma" (transitional housing) — never "the shelter."
- The hotline number `310-547-9343` is always a `tel:` link and appears prominently on any crisis-adjacent screen.
- Shelter addresses are never published — anywhere, in any string, comment, or metadata. Only mailing address: 453 West 7th Street, San Pedro, CA 90731.
- Confidentiality claims on advocate/legal screens must include the mandatory-reporting exception.
- Statistics must match `docs/knowledge-map.md` exactly. If a figure is not in that file, do not publish it.

---

## Standing Orders for Autonomous Build Requests

When you receive a prompt like "build the [screen name] screen," the following are always true:

1. **Check `CLAUDE.md` first** for tech stack, commands, and current phase status.
2. **Read `src/theme/colors.ts`** — do not approximate brand colors from memory.
3. **Respect `useTraumaInformedMotion()`** — every animated component gates on this.
4. **GlassCard = expo-blur. Mesh = Skia. Everything else = Reanimated.** Never cross these.
5. **No new navigation patterns** — use FloatingCommandPill + Expo Router. Do not introduce tab bars.
6. **Content never above status bar, never below home indicator** — `SafeAreaView` edges everywhere.
7. **Panic exit on every non-home screen** — FloatingCommandPill's exit action uses `router.replace('/stealth')`.
8. **TypeScript strict** — no `any`, no suppression pragmas.
9. **Commit in steps** — one logical unit per commit. Never `git add -A`.
10. **Push to `claude/exciting-tesla-UR4HS`** unless instructed otherwise.

When the prompt does not specify visual details, default to the most premium, physically grounded, spatially minimal version. The baseline is a Linear or Craft-quality native iOS experience. Everything below that is a regression.

---

## What "Premium" Means in 2026

Premium is not decoration. It is the precise alignment of physics, whitespace, type, and feedback such that the interface feels *inevitable* — like it could not have been built any other way.

Signs of premium native iOS in 2026:
- Transitions feel like choreography, not page loads
- Tapping a button has texture (haptic + spring compression happen simultaneously)
- Scrolling content slows and breathes near boundaries
- Empty states are designed, not ignored
- Loading states use skeleton content at actual content dimensions, not generic spinners
- Typography hierarchy is so clear that the user never reads a label to understand what it does
- The app can be operated one-handed, with the right thumb, without looking directly at the nav
- Nothing appears that the user didn't invite

Signs of *not* premium (never build these):
- `borderWidth: 1, borderColor: '#ccc'` as a card boundary
- `Animated.timing()` with a cubic-bezier for interactive elements
- Tab bar with 5 icons
- Generic React Native `Button` component
- Hardcoded `paddingTop: 44` instead of safe area
- Colors pulled from memory instead of the token file
- Spinner `<ActivityIndicator>` where a skeleton shimmer belongs
- `console.log` left in production code
