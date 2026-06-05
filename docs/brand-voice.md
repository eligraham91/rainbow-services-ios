# Rainbow Services — Site Brand Voice

## Core rules

- No em dashes in prose. Use commas, periods, or restructure.
- No semicolons in prose. Short declarative sentences instead.
- No AI-tell words: "delve," "myriad," "holistic," "leverage," "utilize," "robust" (except in direct legal/compliance context).
- No internal hedge comments in source: no `{/* pending review */}`, no `TODO` on shipped content.
- No placeholders in shipped code. Best-deduced confident copy, or nothing.

## Tone

Spare. Direct. Earned. Every sentence should be able to stand alone. No throat-clearing.

Active constructions. Present tense where possible. Avoid passive except in legal/policy text.

Not institutional. Not nonprofit-clichéd. Not rescue-narrative. Survivor agency is the frame.

## Harbor Anchor positioning

**Permitted and preferred.** "Harbor Anchor" is Rainbow's regional positioning frame.

The concept: Rainbow is a high-intensity, locally embedded DV organization. Distinct from county-wide providers who operate at scale with lower per-client depth. Rainbow's model prioritizes sustained advocate relationships, deep program integration, and place-rooted continuity across Los Angeles County.

**Expressed on the page as:**

- "Rooted in San Pedro since 1983"
- "High-intensity domestic violence response... anchored in San Pedro"
- "Depth over reach, by design"
- "Not a referral network. A high-intensity, place-rooted team."
- "The same advocates serving Los Angeles County, 43 years without interruption"
- "The same anchor since 1983"

**Geographic rule:** Always use "Los Angeles County" (never "South Bay") for service-area references. "San Pedro" is permitted as the specific location anchor (headquarters, founding). The schema validator enforces this for Sanity-controlled fields. Hardcoded copy must follow the same rule.

**Never as:** "Harbor Anchor" as literal consumer-facing copy. The frame is internal positioning; the expressions above are the on-page language.

**Placement:** Sub-hero sections, About/Mission blocks, Donate why-give context, Programs Hub. Not in hero headlines (those are reserved for survivor-facing crisis copy).

## Sovereign language

Campaign frame: "Safety is the Floor, Let's Build the Ceiling." Sovereignty over rescue. Center survivor agency.

Avoid: "rescue," "save," "help victims," "needy families." Use: "survivors," "serve," "support," "stand with."

## Donor copy — canonical frame

**Canonical: "Continuity is the product. Your gift extends it."**

Approved framing for donor hero / appeal / acknowledgment copy:

- Donor "extends a capacity," does not "buy an outcome"
- Government grants fund the core; private dollars fund continuity
- Continuity = the bridge between grant cycles, staff continuity, relationship continuity across years of survivor rebuilding
- Evergreen anchors: "operational for 43 years," "the same advocates," "the hotline that takes calls at 2 a.m." — never time-decay anchors like "this year" / "unpredictable seasons" / "right now"

**Forbidden patterns** (Laura overrule 2026-04-28, sustained 2026-05-11):

- "16% keeps the lights on" / "Your dollar keeps the lights on"
- "fill the gap" / "fill the rest"
- "unpredictable seasons" / "uncertain times"
- "keeps the doors open" / "keeps us going"
- Any framing where private dollars "save" Rainbow or "rescue" core ops
- Charity-Navigator-style "X% to programs" as hero (move stat to supporting block, never lead)

**Canonical replacement copy on file:**

Hero / lead:
> Continuity is the product. Your gift extends it.

Supporting paragraph:
> Government grants fund the core. Private dollars fund continuity: the bridge between grant cycles, the staff who answer in a survivor's own language, the relationship that lasts past the program. 84% government-funded. Audited annually.

Emotional close (for body copy on /donate or LP variants):
> Rainbow's hotline takes calls at 2 a.m. from people who have nowhere else to turn. Your gift is what keeps the phone line answering when those calls come in. What you're funding is not a story. It's the continuity of an answer.

**Why the overrule sticks:** "Lights on" inverts the actual funding model (government funds core ops, including literal lights) and uses generic nonprofit cliché Rainbow's voice rejects. The continuity frame is operationally accurate AND emotionally specific.

**Source authority:** This rule supersedes any conflicting language in past donor copy. Cite this section when reviewing PRs that touch donor-facing surfaces (`DonateLightbox.tsx`, `DonationForm.tsx`, `/donate`, `/lp/give-*`, `LpTemplate.astro` LP_DEFAULT_CONTENT).
