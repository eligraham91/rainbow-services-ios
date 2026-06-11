# Donor Voice — Rainbow Services

Rules for all donor-appeal copy: DonateLightbox, /donate hero, DonationForm, LpTemplate, and any page whose primary purpose is to solicit a gift.

---

## The context-bound funding rule (§11)

Government-funding percentages and "fills the gap" framing are **prohibited in donor-appeal contexts**.

**Why:** Framing a gift as "filling the 16% gap government can't cover" implies donors are compensating for government failure, instrumentalizes them as gap-fillers, and creates donor fatigue ("only 16% matters"). It is also potentially misleading as a pitch because the 16% doesn't map cleanly to specific discrete services.

**Transparency surfaces are different.** These pages may use funding percentages:
- `/impact/the-gap` (explaining the structural role of private giving)
- `/theory-of-change` (revenue breakdown chart)
- `/financial-disclosures` (audited financials)
- Program pages' FUNDING sections (informational, not appeals)

**Donor-appeal surfaces require the approved framing below.**

---

## Locked donor-appeal copy

These three elements form the approved voice for the primary donor-appeal surfaces. Do not rewrite without explicit author sign-off.

| Surface | Element | Approved copy |
|---|---|---|
| DonateLightbox | H2 | "Help Rainbow stay ready." |
| DonateLightbox | Body | "Monthly support strengthens the shelter, legal services, housing navigation, and follow-through survivors rely on after violence." |
| /donate hero | Headline | "Keep safety within reach." |
| /donate hero | Subhead | "Your gift supports crisis response, shelter, legal services, housing navigation, and steady follow-through for survivors rebuilding after violence." |
| DonationForm / DonateWidget | Impact label (all amounts) | "→ Strengthens Rainbow's flexible response fund" |
| DonationForm | Annual commitment line | "Monthly gift. Annual commitment: $X." |
| LpTemplate hero | Headline | "3,867 Individuals Served. Your Gift Funds the Next One." |

---

## Prohibited in donor-appeal contexts

| Prohibited | Reason |
|---|---|
| "84% government-funded. Private gifts fill the rest." | §11 rule |
| "The 16% that keeps the lights on" | §11 rule + "keep the lights on" ban |
| "Government contracts cover X. You cover Y." | §11 rule |
| "Your $50 funds one bed night" | Fabricated unit-cost math (see below) |
| "Your $100 pays for a full day of shelter" | Fabricated unit-cost math |
| Any per-dollar or per-amount outcome claim | Fabricated unit-cost math |

---

## No fabricated unit-cost math

**Rule:** Never publish a claim that maps a specific dollar amount to a specific service unit (e.g., "$50 = one bed night," "$25 = one hour of legal help").

**Why:** These figures are accounting artifacts, not operational realities. No single $50 donation funds a discrete bed night — costs are pooled, overhead is allocated, and the actual cost per bed night depends on occupancy, staff ratios, and grant offsets that change year to year. Publishing fabricated unit-cost figures is a form of financial misrepresentation even if well-intentioned.

**Approved alternative:** "Strengthens Rainbow's flexible response fund" or describe the program in aggregate.

---

## The DonationForm impact calculator

The `[ YOUR IMPACT ]` tile in DonationForm and DonateWidget must:
- Show the entered amount
- Return the same message for all amounts: `→ Strengthens Rainbow's flexible response fund`
- For monthly cadence: show `Monthly gift. Annual commitment: $X.` (no year-of-safety framing)

Do not add per-tier descriptions ("at $100 you fund X," "at $250 you sustain Y"). This is the unit-cost math rule applied to the form.

---

## LP pages

All six LP pages (`/lp/give-p1` through `/lp/give-v3`) share `src/layouts/LpTemplate.astro`. Changes to that file propagate to all six. Do not edit individual LP pages unless the change is genuinely page-specific.

The LP hero headline is locked: **"3,867 Individuals Served. Your Gift Funds the Next One."**

"Individuals" not "Survivors" — see `docs/terminology.md`.

---

## Trust-strip approved labels

The chrome / trust strip on DonationForm, DonateLightbox, and LP pages must use:

`🔒 SECURE · AUDITED FY25 · EIN 95-3855705`

Not: `84¢ TO PROGRAMS` (deprecated figure)
Not: `84% TO PROGRAMS` (deprecated figure)
