# Start Here — Experience & Engagement Concepts 2026

**Status:** Design document. Companion to FEATURES-2026.md (the safety layer).
**Scope:** Gradients, motion, interactivity, builders, customization, education, and session depth.
**Stack assumed:** Skia 2.2.12, Reanimated 4, gesture-handler, expo-haptics, expo-audio, the existing theme system and ScrollContext parallax.

---

## Design Intent: Calm Engagement

Most apps fight for attention. This app earns trust, and trust is built through craft. The goal of everything in this document is **depth of useful engagement**: a survivor who opens the app for thirty seconds and leaves with one true thing has had a better session than one who scrolled for ten minutes. So "engagement" here means three measurable things:

1. **Return value.** Every visit, the app has something new to give back (a tool deepens, a plan grows, content unlocks by relevance).
2. **Session depth.** Interactions invite the next interaction naturally, the way a good book invites the next page.
3. **Mastery.** The user gets visibly better at something (decoding patterns, regulating their body, knowing their rights) and the interface reflects that growth back to them.

What it never means: variable-reward loops, FOMO mechanics, or notification-driven recall. Those patterns are how controlling relationships work, and the app cannot use the abuser's toolkit. Every engagement mechanic below runs on **pull, not push**.

---

## Part I — The Living Gradient System

The mesh gradient is the app's soul. Today it responds to gyroscope tilt and scroll parallax. These concepts make it a living system that quietly mirrors the user's relationship with the app.

### 1.1 Time-of-Day Palettes

The mesh interpolates through four palette keyframes across the day, computed locally from the device clock (no location, no network):

- **Dawn (5–9am):** the purple blob warms toward rose, the amber gains a pale gold edge
- **Day (9am–5pm):** the current canonical palette
- **Dusk (5–9pm):** deeper purple, amber slides toward ember orange
- **Night (9pm–5am):** the warm-dark register even in light mode, blobs dimmer and slower

Implementation: a `useDerivedValue` lerp between palette stops keyed on minutes-since-midnight, fed into the existing RadialGradient colors. The transition is continuous, so a user in the app at 4:58pm watches nothing happen, but the 8am app and the 10pm app feel like different rooms. Cost: a few lines in MeshGradientBg. Effect: the app feels alive without a single animation being added.

### 1.2 The Gradient Remembers (state-reactive ambience)

The mesh subtly reflects app state:

- **After a somatic session completes**, the gradient's drift speed halves for the next two minutes. The whole app exhales with you.
- **On the Emergency screen**, the amber blob retreats off-canvas entirely and the field goes still. No animation competes with a crisis decision.
- **Inside the vault**, a third, small, deep-violet blob appears low on the canvas. Private space has its own light.
- **While the breathe sphere is held**, the entire background mesh synchronizes to the inhale/exhale timing. The room breathes with the user. This is one SharedValue piped from breathe.tsx into MeshGradientBg through the existing ScrollContext pattern (a second context: `AmbienceContext`).

### 1.3 Seasonal Drift

Twelve barely-perceptible palette biases, one per month, applied as a 4–6% hue rotation on the accent blob. February is not visibly different from March, but October is visibly different from April. Users who live with the app across seasons will feel it without being able to name it. Zero interaction cost, infinite "this app is cared for" signal.

### 1.4 Accent Color Picker (the first customization)

A curated row of six accent hues in the About screen (the current violet, a deep teal, an ember, a forest, a slate blue, a plum). Selection re-themes `theme.accent` and the mesh's primary blob across the whole app instantly. Stored in MMKV next to the theme flag.

Why curated and not a color wheel: every hue ships pre-checked for WCAG AA contrast in both themes, and the danger red stays reserved (a user must never be able to make safety messaging blend in). Customization is also quiet identity. The app becomes *theirs*, which deepens the sense that the data inside it is theirs too.

### 1.5 Gradient Weather (long-horizon idea)

The stealth screen already impersonates a weather app. Close the loop: let the mesh itself optionally take on "weather" moods the user picks (still, drifting, rolling, rain-quiet). Each mood is a parameter set (blob count, drift speed, blur radius, palette spread) over the same Skia field. This becomes the foundation for the soundscape mixer in Part V, where audio and gradient moods pair.

---

## Part II — Motion Language

The app has spring entrances and a morphing tab pill. These concepts complete the motion vocabulary.

### 2.1 Shared-Element Card Transitions

When a tools card is tapped, the card itself should become the next screen's header: the GlassCard lifts (scale 1.0 → 1.03, shadow deepens), the other cards fade and drift 12px away from it, and the destination screen's title appears to inherit the card's label position. Reanimated's shared transition tag API plus the existing `ios_from_right` stack animation gets 90% of this effect. The remaining 10% (label morph) is a crossfade choreographed on the nav timing. Every hub→leaf navigation in the app then teaches the same physical metaphor: you went *into* the thing you touched.

### 2.2 The Haptic Grammar

Haptics are currently per-button. Define a grammar and apply it everywhere, so the hand learns the app the way the eye does:

| Pattern | Meaning | Used by |
|---|---|---|
| Light tick | "noted" | chips, toggles, checklist items |
| Medium tap | "moving" | navigation, cards |
| Heavy thunk | "committed" | save, send, plan completion |
| Warning buzz | "leaving" | Quick Exit only (already shipped) |
| Soft double-pulse | "breathe" | somatic timing cues |
| Rising triplet | "complete" | wizard finish, section done |

The rising triplet ("complete") is three Light impacts at 0ms/90ms/200ms. It becomes the app's signature: the safety plan finishing, a learning path section closing, an exit-bag checklist hitting 100%. Users will feel accomplishment before they read it.

### 2.3 Scroll-Driven Editorial Storytelling

EditorialScreen blocks currently fade in once. Upgrade to scroll-progress choreography using the existing ScrollContext SharedValue:

- Numbered block indices count up as they enter the viewport (01 ticks from 00)
- The vertical rule connecting blocks draws itself downward in sync with scroll position (a Skia line with an animated end point)
- The red callout block's left border sweeps in from zero height when 30% visible
- Pull-past-bottom reveals the readout card with a spring overshoot

All UI-thread, all interruptible, all gated behind reduceMotion (where blocks simply render complete). This turns the densest educational screens into something that feels authored, like scrolling a well-made longform article.

### 2.4 Breathing Idle States

Any screen at rest for 20+ seconds gains an almost-subliminal idle motion: the primary CTA's shadow radius oscillates ±2px on an 8-second sine. It reads as the interface quietly waiting, not demanding. Skia shimmer is reserved for loading. This is presence.

### 2.5 Completion Moments (celebration without confetti)

When a survivor finishes their safety plan, the moment deserves weight. Not confetti (wrong register, and particles on screen are visible across a room). Instead: the screen's content fades, the mesh gradient blooms once (blobs swell 15% and settle over 1.8s), the rising-triplet haptic fires, and a single line appears in display type: "Your plan is ready. It stays with you." Quiet pride. The same bloom pattern, smaller, marks every section completion across the app.

---

## Part III — Interactive Features

The decoder and somatic tools prove the model: interaction teaches better than text. These extend it.

### 3.1 The Cycle Wheel (interactive cycle of abuse)

Replace the static cycle editorial with a draggable Skia wheel. Four arc segments (tension, incident, reconciliation, calm) rendered as a ring. The user rotates the wheel with their thumb, and as each phase passes the top, its description card animates in with phase-matched palette (tension: amber building; incident: the red register, used correctly; reconciliation: false-dawn rose; calm: the standard palette). Dragging through two full revolutions is the lesson: it goes around again. The wheel resists slightly more each lap (spring stiffness increases), a somatic metaphor for how the cycle tightens. No text could teach that.

### 3.2 Tension Line (drag-to-explore timeline)

A horizontal Skia line graph of escalation across a relationship timeline, with a scrubber. As the user drags, milestone annotations surface ("first time he checked your phone," "first apology gift") drawn from a curated composite scenario. The y-axis is never labeled with numbers. The shape itself, slowly rising with sawtooth dips after each "reconciliation," is the entire argument. Scrubbing is the engagement: users explore at their own pace and can sit with any point.

### 3.3 Decoder: Build-a-Reply

The decoder currently offers "borrow a response" copy. Extend it into an interactive composer: the user assembles a reply from three slots (acknowledge / boundary / exit line), each slot offering 3–4 reviewed fragments as draggable pills. The assembled reply previews in an iMessage-style bubble in real time. Tapping "copy" fires the committed haptic. This converts a reading exercise into a rehearsal, and rehearsal is what survivors actually need before a hard conversation. All fragments are pre-reviewed content, no free-text generation.

### 3.4 The Weight (financial decoder companion)

An interactive Skia visualization for the financial module: each financial control behavior the user taps (allowance, hidden accounts, debt in your name, sabotaged job) adds a rendered weight to a hanging beam that visibly sinks. Removing one (tapping a resource: "a separate account," "credit freeze," "advocate help") visibly lifts it. The physics are honest: one resource does not rebalance four weights. Interaction time on this screen *is* comprehension time.

### 3.5 Grounding, Expanded (somatic suite v2)

- **5-4-3-2-1 guided mode for ground.tsx:** the particle field gains an optional structured layer. Prompts surface one at a time ("find 5 things you can see") and the user taps anywhere to log each one, spawning a settled warm particle per tap. The classic grounding exercise becomes spatial and tactile.
- **Pressure hold:** a new somatic tool. The user presses and holds anywhere with one or two thumbs, and a slow ring grows around each touch point with a deep, slow haptic pulse (the "breathe" double-pulse at 6-second intervals). Bilateral pressure and slow rhythm are established regulation techniques. Screen stays mostly dark. Usable in a pocket-glance situation.
- **Humming bar:** with audio, a sustained low tone whose pitch the user bends by dragging vertically (the listen.tsx wave, but generative tone instead of a loop). Humming and vocal toning regulate the vagus nerve. The interface invites matching the tone aloud.

### 3.6 "What Would You Say?" Scenario Cards

A swipeable card deck (gesture-handler pan, spring snap) for the supporter track. Each card poses a moment ("Your friend says: he only gets like that when he drinks"). The user flips the card (3D rotateY) to reveal the response that helps and a response that backfires, with one line of why. Ten cards per deck, three decks (friend, parent, coworker). The flip interaction creates a micro-commitment: you guess before you see. Guessing is where learning happens.

---

## Part IV — Builders

Builders are the deepest engagement surface the app has: users return to things they are constructing. The safety plan wizard proves it. These multiply it.

### 4.1 Exit Bag Builder (visual packing)

The document checklist, upgraded to a visual builder. A rendered bag (flat illustration, theme-tinted) on the left, item shelf on the right. The user drags items in (ID card, meds, charger, cash, kids' bear), and each lands in the bag with a settle animation and a Light tick. The bag's fill state persists in the vault. Items can carry a note ("passport is in the blue folder, top closet shelf"). The builder is checklist data underneath, but the spatial metaphor makes the abstract plan feel physically real, and the fill progress (7 of 12 packed) is a return-visit hook that serves safety rather than vanity.

### 4.2 Support Network Mapper

A radial canvas with "you" at center. The user adds people as orbiting nodes at the distance they choose (drag to place: inner ring is "call at 3am," outer is "knows nothing yet"). Each node holds a name (or initials only), what they can give (a couch, a ride, money, just listening), and an optional code word agreed with that person. Encrypted in the vault. The act of placing people spatially forces the clarifying question every advocate asks: who is actually in your corner, and for what? Many survivors discover their inner ring is larger than they felt it was. That discovery is the feature.

### 4.3 Code Word Studio

A small builder for the code systems survivors already improvise: pick a contact, compose the innocent phrase, define what it means, and define what the receiver should do (call me / come get me / call 911 to my address). Generates a single share-card (image, no app branding) the survivor can show the trusted person once, in person. Pairs directly with the check-in timer from FEATURES-2026.

### 4.4 Personal Glossary

Every term the user taps across the learn and decipher screens ("DARVO," "coercive control," "love bombing") can be saved to a personal glossary with one tap on a bookmark pill. The glossary lives under Learn, ordered by when they saved it. It becomes a self-portrait of their learning path, and re-reading it is the single most natural return visit the app can offer. Stored locally, included in the vault wipe path.

### 4.5 Strength Inventory

A guided builder of five prompts ("a time you protected someone," "a skill nobody taught you," "what you have already survived") whose answers compose into a single rendered card in display type. Survivor agency is the brand frame, and this is the frame made into a mirror. Optionally saved to the vault. Advocates use exactly this exercise in session work, so review with Rainbow's team will refine the prompts.

### 4.6 Routine Builder (somatic sequences)

Users chain somatic tools into a named sequence ("before pickup": breathe 2 min → pressure hold 1 min → one affirmation card) and run it as a guided flow with auto-advance and the haptic grammar marking transitions. Sequences are the somatic suite's retention engine: a tool you configured is a tool you return to. Three preset sequences ship for users who never build their own.

---

## Part V — Customization

### 5.1 Soundscape Mixer

Listen.tsx graduates from one loop to a three-channel mixer: rain, low tone, brown noise (three bundled CC0 loops). Three vertical Skia waves, each draggable for that channel's volume, mixed live through expo-audio. The user's mix persists. The waves' amplitudes render the mix visually, so the screen is its own state. This single screen is the app's strongest "time well spent" surface: ambient sessions naturally run long, and they should.

### 5.2 Home, Arranged

Long-press a card on the tools hub to enter a wiggle-free reorder mode (drag handles, spring reflow, no iOS wiggle clone). Users sort tools by what they actually use. Order persists in MMKV. The somatic user puts breathe first. The planner puts the vault first. The app's front page becomes a reflection of where each survivor is in their journey, which the next section uses.

### 5.3 Text Comfort Settings

Beyond system Dynamic Type: a reading-density toggle (comfortable / compact) and an optional dyslexia-friendlier rendering mode (increased letter spacing and line height on body text, since the Inter family supports it well). Education content is the heart of the app, and reading comfort is engagement infrastructure.

### 5.4 Grounding Script Editor

The 5-4-3-2-1 prompts, the breathe guide line, and the affirmation deck each accept user-written alternatives. A survivor whose grounding phrase is their grandmother's saying should see their grandmother's saying. Custom strings live in MMKV, render through the same components, and are included in the wipe path.

### 5.5 The Quiet Mode Dial

One setting with three positions that tunes the whole sensory system at once: **Full** (all motion, haptics, ambience), **Soft** (entrances on, idle motion off, haptics on), **Still** (the reduceMotion experience by choice, haptics off except safety warnings). Reduce Motion users land in Still automatically. Everyone else gets to choose how loud the app feels, which is itself a trauma-informed act: control over stimulus is regulation.

---

## Part VI — Educational Resources as an Engagement System

### 6.1 Learning Paths

The learn/decipher content reorganized into three named paths, each 5–7 screens with a visible progress rule (a thin line that fills, no percentages, no badges):

- **Seeing it** — definitions → cycle wheel → tension line → decoder
- **Naming it** — coercion → financial → DARVO deep-dive → glossary review
- **Acting on it** — rights by state → safety plan → exit bag → network mapper

Paths resume where the user left off ("Continue: Seeing it, part 3" appears as a quiet card on the tools hub). Resume-where-you-left-off is the most powerful honest retention mechanic in software, and it requires storing only one integer per path.

### 6.2 Myth Cards

A flip-card deck of the most damaging myths ("if it were really bad, she'd leave" / "abuse means hitting" / "he's different with everyone else, so it can't be true"). Front: the myth, in quotation marks, in the muted register. Flip: the truth, in display type, with one line of evidence. The deck ends with "which of these did you grow up hearing?" as a reflection prompt, never a quiz. Shareable as clean unbranded cards for the supporter audience.

### 6.3 The Depth Layer (progressive disclosure on every editorial screen)

Every EditorialScreen block gains an optional "go deeper" affordance: a subtle expand control revealing 2–3 more paragraphs, research context, or a worked example. Casual readers get the spare surface. Engaged readers get depth without leaving the screen. Session depth grows precisely for the users seeking it, which is the only kind of time-increase this app should ever engineer.

### 6.4 State Law Deep Dives

The 51-entry dataset grows a second level per state: who can file, typical duration, whether pets can be included, filing fee status, emergency vs. final order distinction. Five fields, structured data, rendered in the existing card. The state screen becomes a destination users return to before each legal step rather than a one-glance lookup. (Content requires legal review per the standing gate.)

### 6.5 "One Thing" Daily Surface

A single rotating card on the home screen: one decoder phrase, one myth, one right, or one grounding technique per day, selected from already-reviewed content by a local date-seeded index (no server, no push, no streak counter). If the user opens the app, today's thing is there. If they don't, nothing chases them. Over a year, a daily visitor encounters 365 pieces of the catalog in digestible single units. This is the engagement flywheel built entirely on pull.

---

## Part VII — Engagement Mechanics: What We Use and What We Refuse

Honest accounting, because "use time increaser" has a dark and a light reading.

**We use:**
- Resume state everywhere (paths, wizard, builders, soundscape mix)
- Visible, quiet progress (fill lines, bag fill, network map growth)
- Builders that accrete value across visits
- Daily-rotating content that rewards opening without punishing absence
- Customization as ownership (accent, order, scripts, mixes)
- Mastery feedback (the haptic grammar's "complete" triplet, completion blooms)
- Long-session-friendly ambient surfaces (soundscapes, somatic suite) where longer genuinely is better

**We refuse:**
- Streaks, daily-login rewards, or any mechanic that makes absence a loss
- Push-based recall of any kind (covered in FEATURES-2026 anti-features)
- Variable rewards, mystery boxes, spin wheels
- Social comparison or sharing metrics
- Time-on-screen as a KPI. The north-star metric is *completed actions* (plans finished, calls placed, paths completed, bags packed), measured by nothing, because we ship no analytics. We design for the metric we cannot see, which keeps us honest.

A survivor's time is contested. An app that wastes it on engagement theater is taking something from someone who has little to spare. An app that makes an hour of learning feel like twenty minutes is giving something back. Every mechanic above is sorted by that line.

---

## Part VIII — Build Order

| Wave | Items | Rationale |
|---|---|---|
| 1 | Time-of-day palettes, haptic grammar, accent picker, quiet mode dial | System-level, everything after inherits them |
| 2 | Scroll-driven editorial, completion moments, depth layer | Upgrades every existing content screen at once |
| 3 | One Thing card, learning paths + resume, personal glossary | The pull-based engagement core |
| 4 | Cycle wheel, build-a-reply, myth cards, scenario decks | Interactive education flagships |
| 5 | Exit bag builder, network mapper, code word studio | Vault-coupled builders (sequenced after FEATURES-2026 decoy work) |
| 6 | Soundscape mixer, somatic v2, routine builder | Audio asset clearance gates this wave |
| 7 | Shared-element transitions, gradient weather, seasonal drift | Polish horizon |

All content-bearing items (myth cards, scenario decks, strength prompts, state deep dives) enter Rainbow content review at wave start, not wave end. Spanish localization applies to every string introduced here, so all copy ships through the i18n layer from wave 1 onward, even before translation exists.

---

*The safety document (FEATURES-2026.md) decides what the app must never do. This one decides what it feels like when it does everything else. Both are the product.*
