# Source Hierarchy — Rainbow Services

How to evaluate competing claims about org facts, statistics, and program details. Higher tiers override lower tiers. When tiers conflict, defer to the higher source or flag for human review.

---

## Tier hierarchy

| Tier | Source type | Examples | Trust level |
|---|---|---|---|
| 1 | Audited financial statements | FY25 audit (program efficiency, revenue split) | Authoritative |
| 2 | ETO system exports | FY24–25 program outcome data | Authoritative for program data |
| 3 | IRS filings | Form 990, EIN, tax status | Authoritative for legal/compliance |
| 4 | Board-approved documents | Strategic plan, board resolutions | Authoritative for policy |
| 5 | Org-authored communications | CLAUDE.md, knowledge-map.md, annual report | Approved for publication |
| 6 | Staff statements | CEO, program director statements | Use with context |
| 7 | Prior site copy | Previous versions of pages | Not authoritative — may be stale |

---

## The Anti-Theranos Rule

**Never fabricate, estimate, or extrapolate a statistic for publication.**

If a number is not in Tier 1–5 sources, do not publish it. Do not:
- Round a figure to make it "cleaner" (3,867 is not "nearly 4,000 survivors")
- Extrapolate from a partial year
- Infer a number from another number ("if 72.7% were referred out, that means...")
- Use a benchmark from a comparable org as if it applied to Rainbow

If you don't have a sourced figure, either omit the claim, use approved qualitative language, or flag for human verification.

---

## What to do when sources conflict

1. Identify which tier each source belongs to
2. Higher tier wins
3. If both are Tier 1–3, flag for human review — do not arbitrarily pick one
4. Document the conflict in `docs/qa-log.md`

Common conflicts to watch for:
- Org website copy (Tier 7) vs. ETO data (Tier 2) — ETO wins
- Prior Claude session outputs vs. knowledge-map.md — knowledge-map wins
- Staff statement vs. audited financials — audited financials win for financial figures

---

## Figures that require source citation in copy

These figures are significant enough that the citation should appear near the figure on transparency pages:

| Figure | Required citation |
|---|---|
| ~86¢ to programs | "Audited FY25" |
| ~84% government revenue | "FY25 Audited Financial Statements" |
| Bed requests / referred-out rate | "ETO Exports FY24–25" |
| Legal services ratio | "ETO Exports FY24–25" |

On non-transparency pages (program pages, donor pages), citation is not required inline but the figure must match Tier 1–2 sources.

---

## Figures that must NOT be cited without a source

These are common estimation patterns that have no source basis and must not appear:

- Cost per bed night (no fixed unit cost)
- Cost per legal service
- Cost to "keep the hotline running" for a day
- Return on investment from DV intervention
- Any dollar-amount-to-outcome translation

See `docs/donor-voice.md` — No fabricated unit-cost math.
