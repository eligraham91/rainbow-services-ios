# Start Here — 2026 Feature Concepts

**Status:** Design document. Supersedes §9 of AUDIT-2026-06.md.
**Owner:** Product + engineering, Rainbow Services review required before any item ships.
**Last updated:** June 2026.

---

## The One Test

Every feature in this document is filtered through a single question:

> **What happens if the abuser picks up the phone?**

This is not a metaphor. In a large share of DV situations the abusive partner has physical access to the survivor's device, knows or can compel the passcode, monitors the carrier bill, reviews the app library, checks Screen Time reports, and controls the family Apple ID. The phone is not a private space. It is contested territory.

The Abuser Test breaks into five concrete sub-questions, and each feature below is scored against all five:

1. **Discovery.** Does the feature make the app easier to find? (App library, Settings, Spotlight, Siri suggestions, widgets, notification history, Screen Time, battery usage list.)
2. **Disclosure.** If the app is found and opened, what does the feature reveal about what the survivor has read, written, planned, or saved?
3. **Trace.** Does the feature leave evidence outside the app? (Network logs, carrier records, cloud backups, shared photo libraries, payment statements, paired devices.)
4. **Weaponization.** Can the abuser turn the feature against the survivor? (Fake entries, coerced unlocks, using saved data in custody or immigration proceedings.)
5. **Coercion.** Does the feature survive a forced unlock, where the survivor is made to open the app while the abuser watches?

A feature that fails any sub-question is redesigned until it passes or it is rejected. There is no "acceptable risk" tier. The second test, applied after the first, is the **Advocate Test**: does this help a survivor take an action a trained advocate would recognize as useful, or is it engagement theater?

---

## Part I — Recommended Features

### 1. Evidence Journal (encrypted incident record)

**What it is.** A timestamped, encrypted journal inside the vault. Each entry: auto-captured date and time, optional title, freeform notes, optional photo attachments. Exportable as a clean, unbranded, dated PDF through the same `expo-print` pipeline the safety plan already uses.

**Why it matters.** Documentation is the single most-requested capability in this app category. Protective orders, custody proceedings, U-visa applications, and housing protections all turn on a credible record of what happened and when. Survivors are routinely told by attorneys to "write everything down with dates." Almost none have a safe place to do it. A paper notebook can be found. A notes app syncs to a shared iCloud. This journal is local, encrypted, and behind the biometric gate that already exists.

**Advanced design decisions:**

- **No taxonomy in the entry form.** No "type of abuse" dropdown, no severity slider with labels. Categories become cross-examination material ("You marked this one 'minor.' Why?"). The survivor describes the incident in their own words. The export preserves their words exactly.
- **Tamper-evident sequencing.** Each entry carries a monotonic sequence number and a hash chain (each entry's stored record includes a hash of the previous entry). This costs almost nothing to implement on top of MMKV and lets an attorney argue the record was kept contemporaneously and not fabricated in one sitting. This is the difference between "notes" and "evidence" in many courtrooms.
- **Photo attachments are EXIF-stripped on import** and stored as encrypted files in the app documents directory, with MMKV holding only the index. GPS coordinates, device model, and original capture metadata are removed. The visible timestamp can optionally be burned into the image. Capture happens through `expo-camera` directly (no Photos permission, no copy in the shared library) or through the limited photo picker.
- **Export carries a standard header**, in the survivor's voice, not the app's: "These are my personal notes, recorded on the dates shown." No app name, no Rainbow Services branding, no logo. Consistent with the safety plan PDF policy.
- **Opens at the most recent entry, never auto-scrolls to a flagged date.** A shoulder-surfer learns nothing from the landing state.

**Abuser Test:** Lives entirely behind the vault biometric gate and inside the decoy architecture (below), so discovery and disclosure inherit the vault's protections. No network trace. Weaponization risk is the journal being read after a coerced unlock, which the decoy vault addresses. Coercion: under a forced unlock with the decoy PIN, the journal does not exist.

**Effort:** Medium. Reuses vault crypto, biometric machine, PDF pipeline, VaultEntry UI patterns.

---

### 2. Decoy Vault PIN (duress mode)

**What it is.** A second unlock path. The real credential opens the real vault. The decoy credential opens a vault that is pixel-identical but empty, or seeded with a few innocuous notes ("grocery list," "gift ideas"). There is no banner, no different layout, no tell.

**Why it matters.** The most likely failure mode for the vault is not cryptanalysis. It is "unlock it or else." FaceID can be defeated by pointing the phone at the survivor's face. A passcode can be demanded. The decoy gives the survivor a true thing to comply with. They did unlock it. There was nothing there.

**Advanced design decisions:**

- **Two isolated MMKV instances** with separate encryption keys, both stored in the Keychain. The decoy is not a filtered view of the real vault. It is a separate store. A bug cannot leak real entries into the decoy because no code path reads both stores in the same session.
- **The decoy must be boring, not empty.** A perfectly empty vault on a phone where the app has clearly been used is itself suspicious. On decoy setup, offer to seed two or three plausible starter notes the user picks from templates and can edit. The user controls the cover story.
- **Setup happens once, inside the real vault, with plain-language framing:** "If someone forces you to open this, a second passcode shows them an empty version. Choose a passcode you can give up calmly." Never call it "decoy" in shipped UI labels visible during normal use. The settings row reads "Backup passcode."
- **Biometric routes to the real vault only.** The decoy is passcode-only by design. Under coercion, the survivor says "FaceID has been glitchy" and types the decoy PIN. This is rehearsable, which matters. Survivors should be able to practice the duress flow safely, so include a one-time walkthrough.
- **No counter, no lockout messaging that differs between the two PINs.** Identical timing, identical animations. Any behavioral difference is a fingerprint.

**Abuser Test:** This feature exists *because of* sub-question 5. It is the only item in this document whose entire purpose is surviving the forced-unlock scenario.

**Effort:** Low to medium. MMKV multi-instance support already exists, the auth state machine already exists.

---

### 3. Disguised App Icons and Identity

**What it is.** User-selectable alternate icons and display name. The app can present as a weather utility (matching the existing stealth screen), a notes app, a calculator, a recipes app, or a calendar. Selection lives in the About screen next to the dark mode toggle.

**Why it matters.** The app library is the first place a controlling partner looks. The Quick Exit and stealth screen protect an in-the-moment glance at an open screen. The disguised icon protects the at-rest state: the phone sitting on the counter, scrolled through while the survivor showers.

**Advanced design decisions:**

- **Icon and name change together.** iOS alternate icons (`setAlternateIconName`) swap the icon but the display name requires the disguise to be chosen at build time per icon variant, so each disguise ships as a coherent identity (icon + name pairing defined in the build config). A weather icon labeled "Start Here" is worse than no disguise.
- **Suppress the system confirmation gracefully.** iOS shows an alert when the icon changes. Time the change behind an explicit user action with copy that explains the alert will appear, so it never fires unexpectedly while someone else is holding the phone.
- **Pair each disguise with a matching stealth screen.** If the icon says "Weather," Quick Exit lands on the existing weather stealth screen. If the icon says "Notes," stealth renders a plausible notes list. The icon, the app switcher snapshot (already masked by PrivacyOverlay), and the panic screen must tell one consistent story. An icon that says Calculator opening to a weather page is a tell.
- **Honest limits, stated once at selection:** "This changes how the app looks on your home screen. Someone searching Settings or your full app list can still find it. It hides the app from a glance, not from a search." We never over-claim. Over-claiming is how apps in this category get survivors hurt.
- **Spotlight and Siri suggestions indexing disabled** regardless of disguise (see anti-features). The disguised name should also be the name Spotlight would surface, but the correct posture is to not be surfaced at all.

**Abuser Test:** Directly improves sub-question 1 (discovery) for the casual-inspection threat model, which is the most common one. Honest about not defeating forensic inspection.

**Effort:** Low. Expo config plugin for alternate icons, one new stealth variant per disguise.

---

### 4. Check-In Timer (dead-simple, never auto-sends)

**What it is.** The survivor sets a window before a risky interval: "I'm driving him to the airport. If I haven't checked in by 10pm, remind me to send word to my sister." At the deadline, a local notification fires with a deliberately neutral title ("Reminder"). Tapping it opens a screen with a pre-composed message and the trusted contact, and one button that opens the native Messages composer with everything filled in. Opening the app before the deadline cancels the timer silently. An implicit check-in.

**Why it matters.** The hours survivors identify as most dangerous are predictable to them: a confrontation they cannot avoid, a custody handoff, telling the partner they are leaving. The timer turns "someone will notice if I go quiet" from a hope into a plan, while keeping the survivor in control of every send.

**Advanced design decisions:**

- **The app never sends anything automatically.** This is the load-bearing constraint. Auto-send requires a server (trace), creates a message the survivor did not choose to send in the moment (agency violation), and can fire falsely in a way that escalates danger ("Why did your sister just get a weird text about me?"). The app's role ends at composing and prompting. The survivor's thumb does the sending, through Messages, where it looks like any other text.
- **Notification content is neutral on the lock screen.** Title "Reminder," no body preview, no app-identifying content beyond the (disguised) app name and icon. Notification previews on iOS show the app icon, which is another reason the disguised identity matters: the pieces compound.
- **Second-chance nudge, then silence.** If the first notification is not acted on, one follow-up fires 20 minutes later. Then nothing. A phone buzzing repeatedly in a tense room is a hazard, not a safety feature.
- **The pre-composed message is written by the survivor in their own register**, with a starter template: "Hey, running late, call me when you can." Many survivors already maintain code phrases with a trusted person. The feature holds the phrase, the contact, and the deadline. Nothing else.
- **Timer state lives in MMKV with a neutral key name and is cleared on completion.** No history of past check-ins is kept by default. A log of "times I was scared" is disclosure risk with no advocate-test benefit.

**Abuser Test:** No trace (everything local, message goes through normal SMS only when the survivor sends it). Disclosure limited to one pending timer, behind the app's normal protections, cleared after use. Cannot be weaponized into a false alarm because nothing fires without the survivor's action.

**Effort:** Medium. expo-notifications is already integrated for the fake call. The composer handoff is a `sms:` URL with body.

---

### 5. On-Device Apple Intelligence Pattern Decoding

**What it is.** The DecoderEngine today teaches with six curated example threads. This feature adds a private analysis mode: the survivor pastes a real conversation, and Apple's on-device foundation model (iOS 26+) classifies passages against the decoder's existing, content-reviewed chip taxonomy (monitoring, isolation, DARVO, financial control, threat-as-concern). Matches render in the same pill UI already shipped. Nothing leaves the device.

**Why it matters.** The hardest cognitive step for many survivors is connecting the general pattern to *their* messages. "That example sounds bad, but mine is different, he's just protective." Seeing their own words tagged with the same patterns they just learned collapses that distance. This is the decoder's pedagogy completed.

**Advanced design decisions:**

- **On-device only, enforced architecturally, not by policy.** The feature gates on the Apple Intelligence availability check and uses the on-device model exclusively. There is no cloud fallback, no "Private Cloud Compute" path, no degraded server mode for older devices. On iOS below 26, the entry point does not render. A survivor's actual abuse transcript must never become a network payload, even an encrypted one, because the network event itself is a trace on a monitored router or carrier account.
- **The model is a classifier, not an author.** The system prompt embedded in the app constrains output to the existing chip IDs with confidence scores. A filter layer maps model output to known chips and discards anything that does not map. The model never generates free text shown to the survivor. This keeps every word a survivor reads inside Rainbow's content review, kills hallucination risk, and means the brand-voice rules still hold even in AI-assisted output.
- **Conservative threshold, honest framing.** Low-confidence matches are dropped, not hedged. The results header reads "patterns worth noticing," the same framing as the curated examples, never "your partner is abusive." The tool names behaviors, not people, and never produces a verdict. A diagnosis from an app is both clinically wrong and a weapon in the abuser's hands ("the app told her I'm an abuser, see how poisoned she is").
- **Ephemeral by default.** Pasted text is held in memory, analyzed, and discarded when the screen unmounts. Nothing is written to MMKV unless the survivor explicitly taps "save this analysis to my vault," which routes through the normal vault (and therefore the decoy architecture). Paste-and-analyze must leave zero residue for sub-question 2.
- **First-use disclosure, one sentence:** "This analysis happens on your phone. The text is not sent anywhere." Then never again. Repeated privacy banners train users to stop reading.

**Abuser Test:** No network trace. No stored residue by default. Disclosure surface is one screen that closes clean. The chip output is educational language already reviewed for the curated decoder, so even a shoulder-surfed session reveals a learning tool, not an accusation log.

**Effort:** High, and gated on a native iOS 26 dev build. Ships behind the same availability pattern as GlassSurface.

---

## Part II — Further Concepts Worth Building

These pass the Abuser Test and earn a place on the roadmap behind the five above.

### 6. Document Grab List with Camera Capture

The "documents to grab" step of the safety plan, upgraded from a text field to a checklist (ID, passports, birth certificates, Social Security cards, immigration papers, insurance, prescriptions, lease, vehicle title, pet records) where each item offers "photograph a copy now." Photos go through the same EXIF-strip-and-encrypt pipeline as the evidence journal. A survivor who leaves with nothing still leaves with images of every document that takes months to replace. This converts the plan from a list of intentions into a packed bag.

### 7. Protective Order Companion

After the state-laws screen tells a survivor their state's order exists, this tool holds the order's life cycle: case number, hearing date, expiration, what the order covers, which agencies have been served. Hearing and expiration reminders fire as neutral local notifications ("Appointment"). The companion states plainly that an order must be served to be enforceable and that violations are a 911 call, not an app interaction. Lives in the vault.

### 8. One-Party Consent Audio Memos

Encrypted voice notes for survivors documenting verbal abuse, gated behind a per-state recording-consent disclosure driven by the existing `stateLaws.ts` data (extended with a consent field). In two-party-consent states the tool leads with the legal caveat before the record button ever renders. Recordings are encrypted files indexed in the vault, never in the system Voice Memos app, never in the media library.

### 9. Situation-Specific Safety Plans

Short EditorialScreen modules layered onto the general plan: safety while pregnant, when children are involved, when a firearm is in the home, when immigration status is contested, for LGBTQ+ survivors (where outing is itself a control tactic), for survivors with disabilities, for elders. Each is a content task, not an engineering task, and each requires Rainbow advocate review. The firearm module matters most: firearm presence is the strongest single lethality multiplier in the research, and the module should say so in plain language with a hotline prompt.

### 10. Danger Assessment (Campbell instrument, adapted)

The validated 20-item Danger Assessment, presented as a private calibration tool. No numeric score is ever displayed. Answers map to the validated interpretation bands, rendered as plain-language statements with an immediate hotline path. Responses are ephemeral, never written to storage, by design rather than by option: a saved lethality self-assessment is discovery material in the wrong hands and a weapon in custody court. The screen exists to produce a phone call, not a record.

### 11. Walk Timer

A full-screen stopwatch with no app chrome and no branding. For many survivors the only unsupervised interval in a day is "going for a walk." The timer gives that interval structure and an unremarkable cover if the screen is seen. Quick Exit stays available. This is the cheapest feature in this document and one of the most honest about how small the margins of a controlled life can be.

### 12. Apple Watch Quick Exit

A one-button watchOS app (face shows a cloud icon, reads as a weather complication) that triggers the paired phone's Quick Exit sequence over WatchConnectivity. Reaching for a phone mid-confrontation is conspicuous. Touching a watch face is not. The watch app contains nothing else: no vault, no content, no name.

### 13. Action Button Binding (iPhone 15 Pro+)

An App Intent, named neutrally ("Open Weather Check") and marked non-discoverable so Spotlight and Siri suggestions never surface it, that the survivor can bind to the hardware Action Button. One silent press from a pocket either opens the app directly to the stealth screen (pre-arming the cover story) or triggers Quick Exit if the app is already open. Hardware-speed panic response with zero visual footprint.

### 14. App Clip at Points of Contact

A sub-10MB App Clip exposing only the Emergency screen and resource search, invoked by QR codes placed at DV court self-help centers, hospital social work offices, OB/GYN clinics, and victim services units. App Clips leave no App Library entry and expire from the device after 30 days. A survivor can scan, find a shelter, call, and have nothing to explain later. Distribution through Rainbow's existing LA County court and healthcare relationships.

### 15. First-Run Orientation (one screen, ten seconds)

Not a feature for the abuser test. A feature for the features. One skippable screen on first launch: the red × exits instantly, shaking the phone exits, everything saved is locked behind Face ID, nothing requires an account or leaves the device. Today the shake exit and decoy behaviors are discoverable only by accident. Safety features have to be known to be used, and this is the only moment the app can be sure it has the survivor's attention safely.

---

## Part III — Anti-Features (explicitly rejected)

Each item below was considered and rejected. They are documented so the next person to propose them inherits the reasoning, not just the verdict.

### Widgets and Live Activities — REJECTED

A home screen widget, lock screen widget, Live Activity, or Dynamic Island presence is a persistent, glanceable advertisement of the app's existence, visible to anyone in the same room as a charging phone. StandBy mode makes this worse: a bedside iPhone becomes a billboard. The check-in timer was specifically designed *not* to use a Live Activity for exactly this reason, even though a countdown is the canonical Live Activity use case. The app ships zero WidgetKit extensions and zero ActivityKit registrations, and the build is audited for accidentally generated ones before App Store submission. Fails: discovery.

### Siri, Spotlight, and Voice Exposure — REJECTED

"Hey Siri, open Start Here" is the app announcing itself out loud in a home where its existence is dangerous. Siri suggestions resurface recently used apps on the lock screen and in search, which means iOS itself can disclose the app at exactly the wrong moment. The app opts out of Spotlight indexing and Siri suggestions, donates no intents except the deliberately non-discoverable Action Button intent, and registers no voice shortcuts. The disguised icon is undone the moment the phone speaks the real name. Fails: discovery, disclosure.

### Cloud Sync and iCloud Backup — REJECTED

Cross-device sync is a feature in consumer software and a disclosure vector here. Family-shared Apple IDs, the most common configuration in the households this app serves, mean iCloud is often the abuser's filing cabinet. Vault data, plan data, journal entries, and theme flags are excluded from iCloud and local backups via the file-protection and backup-exclusion flags, verified at startup. There is no account system, so there is nothing to sync, which is the point: data that does not exist on a server cannot be subpoenaed, breached, or browsed from the family iPad. Fails: trace, disclosure.

### Re-Engagement Pushes — REJECTED

"We miss you," streak reminders, "complete your safety plan!" notifications are standard growth tooling and indefensible here. Every unsolicited notification is a roll of the dice on whose hand is holding the phone when it lands. Worse, re-engagement pressure inverts the agency frame: the survivor decides when this app is useful, and an app that nags is performing the same behavior the decoder teaches survivors to name. The only notifications this app ever schedules are ones the survivor explicitly set in the same session (fake call, check-in timer, order-expiration reminder), every one with a neutral title. There is no marketing notification path in the codebase, and there never will be. Fails: discovery, weaponization, and the advocate test.

### In-App Donations — REJECTED

A donation flow inside the app creates a payment record (card statement, bank line item, App Store receipt) on financial accounts the abuser frequently controls or monitors. Financial surveillance is itself a documented abuse pattern, and the app's own financial decoder teaches exactly this. An app that teaches survivors to spot statement-monitoring while writing "RAINBOW SERVICES DV" onto their statement has failed its own curriculum. Donations belong on rainbowservicesdv.org, reached from a supporter's own device. Additionally: no paywall, no premium tier, ever. A survivor under financial control cannot buy features, so features for sale are features denied to the people the app exists for. Fails: trace, weaponization.

### Also rejected, with the same one-line treatment they deserve

- **Analytics and crash reporting.** Every telemetry packet is a network trace and a privacy-label confession. The app collects nothing.
- **HealthKit integration.** Health data is iCloud-synced, readable by other permitted apps, and subpoenable. Injury documentation goes in the encrypted journal.
- **Social or peer-support features.** A community surface is a hunting ground. Human connection is the hotline's job, done by trained people.
- **Auto-dial or auto-send anything.** The app composes. The survivor sends. No exceptions.
- **Location permission.** Still never. The resource search runs on bundled ZIP centroids precisely so the app never has to ask.

---

## Part IV — Sequencing

| Order | Feature | Why this order |
|---|---|---|
| 1 | First-run orientation | Makes existing safety features discoverable. Days of work. |
| 2 | Decoy vault PIN | Closes the forced-unlock hole before the journal raises the stakes of vault contents. |
| 3 | Disguised icons + matched stealth variants | Low effort, compounds with everything else. |
| 4 | Evidence journal | The flagship. Ships only after 2 and 3 protect what it stores. |
| 5 | Document grab list + capture | Reuses journal's photo pipeline immediately. |
| 6 | Check-in timer | Reuses notification work, depends on disguised identity for neutral lock-screen presentation. |
| 7 | Walk timer, Action Button intent | Small, independent. |
| 8 | Protective order companion, audio memos, situation plans | Content-review-bound. Start Rainbow review early. |
| 9 | Danger assessment | Highest content-review bar of all. Advocate sign-off is the schedule. |
| 10 | Apple Intelligence decoding, Watch app, App Clip | Native-build-gated and entitlement-gated. iOS 26 dev build track. |

The dependency logic matters more than the dates: **protection before contents** (decoy before journal), **identity before notifications** (disguise before timer), **review before assessment** (advocates before any instrument).

Spanish localization is not in this table because it is not a feature. It is the other half of the audience, it outranks everything here, and it proceeds in parallel on its own track.

---

*Every concept above was scored against discovery, disclosure, trace, weaponization, and coercion before it earned a place in this document. Nothing here requires a server, an account, or a single byte leaving the device. That is not a constraint we work around. It is the product.*
