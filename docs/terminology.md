# Terminology — Rainbow Services

Approved terms, forbidden terms, and rationale. When in doubt, use the "Approved" column.

---

## Program names and labels

| Context | Forbidden | Approved | Rationale |
|---|---|---|---|
| URL slug | `/programs/legal-services`, `/legal-clinic` | `/programs/legal-advocacy` | Slug must not change (SEO, inbound links) |
| Human-facing label | "Legal Advocacy" as H1/nav | "Legal Clinic" | Human label changed; slug unchanged |
| Shelter | "the shelter," "a shelter" | "Rainbow House" (emergency) or "Villa Paloma" (transitional) | Be specific |
| Housing program | "DV Housing," "permanent housing program" | "Community Housing" or "DV Housing First" | Official program name |
| Children's program | "child services," "kids program" | "Children & Families" | Official program name |
| Case management | "case workers," "social workers" | "case managers," "advocates" | Title accuracy |
| Legal staff | "lawyers," "legal staff" | "attorneys, paralegals, and a victim advocate" | Specific; matches staffing |

---

## Service counts and denominators

| Context | Forbidden | Approved | Rationale |
|---|---|---|---|
| Hotline | "hotline contacts," "people who called" | "hotline calls" | Calls are the unit; callers may call multiple times |
| Shelter count | "families," "survivors" | "individuals" or "adults and children" | Avoids conflation with household count |
| Legal | "legal cases" | "legal clients" (for people) / "substantive legal services" (for activity) | Different denominators |
| Beds | "capacity," "units" | "beds" | Site-standard term |

---

## Financial and funding language

| Context | Forbidden | Approved | Rationale |
|---|---|---|---|
| Program efficiency | "84¢ to programs" | "~86¢ to programs (Audited FY25)" | Financial audit updated |
| Revenue split | "government funded," "publicly funded" | "government contracts (~84%)" or "~84% government revenue" | "Funded" implies dependency; "revenue" is accurate |
| Private giving | "the 16%," "gap funding," "fills the gap" | "private giving (~14%)," "unrestricted gifts" | Positive framing; accurate |
| Donor appeal | "your dollar goes to…" + specific cost | "Strengthens Rainbow's flexible response fund" | No fabricated unit-cost math |
| Government share | "mostly government funded" | "~84% government revenue" | Quantify; don't summarize vaguely |
| Program efficiency label | "84¢ to programs" anywhere | "~86¢ to programs · Audited FY25" | Old figure; must include qualifier |

---

## Survivor and population language

| Context | Forbidden | Approved | Rationale |
|---|---|---|---|
| Primary label | "victim," "battered woman," "abused woman" | "survivor" (in most non-legal contexts) | Survivor-centered; gender-inclusive |
| Legal context | "victim" as universal label | "victim" or "survivor" depending on legal proceeding context | "Victim" has legal meaning; use where legally accurate |
| Gender | "women and children" as default | "survivors of all genders" | Rainbow serves all genders |
| Population | "at-risk women," "vulnerable populations" | "survivors," "people experiencing domestic violence" | Non-stigmatizing |
| Children | "kids," "youths" | "children" | Consistent with program naming |

---

## Confidentiality and legal labels

| Context | Forbidden | Approved | Rationale |
|---|---|---|---|
| Shelter location | "confidential address," "hidden location" | "VAWA-confidential location" | Cite the legal basis |
| Communications | "protected" (vague) | "confidential under California Evidence Code §1037.1" | Specific legal basis |
| Legal clinic comms | "confidential" (vague) | "attorney-client privilege under California Evidence Code §954" | Specific legal basis |
| VAWA reference | "VAWA-protected" (for communications) | "VAWA §12291(b)(2)" | Distinguish location confidentiality from communications |

---

## Program count

Current count is **seven programs**. If adding or removing a program, update:
1. `src/pages/index.astro` — PROGRAMS array
2. `src/pages/programs/index.astro` — count reference
3. `src/components/Nav.tsx` if applicable
4. SEO descriptions on relevant pages
