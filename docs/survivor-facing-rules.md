# Survivor-Facing Rules — Rainbow Services

Rules for all pages a survivor in crisis might read: get-help, emergency-shelter, privacy-policy, contact, legal tools, accessibility.

---

## Shelter address — never published

Rainbow House and Villa Paloma addresses are **never published on the site, in metadata, in schema, or in comments**.

- Only mailing address published: **453 West 7th Street, San Pedro, CA 90731**
- Legal basis: California Penal Code (location confidentiality) + VAWA §12291(b)(2)
- This applies to JavaScript, JSON-LD schema, sitemap, alt text — everywhere

If asked to add a shelter address anywhere, refuse and cite this rule.

---

## Quick Exit — approved wording

The Quick Exit button description must use this exact phrasing (or the approved equivalent on file):

> "takes you to a neutral page (a weather search) and clears the page from your back button where the browser allows."

Not:
- "immediately navigates to a weather search page and overwrites the browser back-button history" (old)
- "erases your history" (over-claim; browser behavior varies)
- "removes all trace of your visit" (over-claim)

The button navigates to a neutral weather search URL and pushes history entries to prevent easy back-navigation. It does not delete stored cookies, cached pages, or ISP logs. Do not imply more protection than it provides.

---

## Calls ≠ people

**Hotline calls and unique individuals are different denominators.**

- FY24–25: 3,195 hotline calls ≠ 3,195 people
- A single person may call multiple times
- Never write "3,195 people called" or "3,195 survivors reached via hotline"
- Correct: "3,195 hotline calls answered"

This rule extends to any service-unit count that may include repeat contacts (support groups, case management check-ins, etc.).

---

## Composite quote labeling

Any quote on the site that is composite, anonymized, or otherwise modified from verbatim must carry:

`[ COMPOSITE QUOTES · IDENTIFYING DETAILS REMOVED ]`

- Not "ANONYMIZED TO PROTECT SAFETY" — implies only safety-driven changes
- Not "NAMES CHANGED" — implies only names were altered
- The label must appear in every section that uses composite quotes, not just once at the top

---

## Mandatory reporting caveat

Pages referencing advocate-client privilege or confidentiality must include a mandatory-reporting exception. Standard wording:

> "Mandatory reporting obligations under California law (child abuse, elder abuse, imminent threats of harm) are exceptions your attorney [or advocate] will explain clearly at the start of your first conversation."

Do not omit this. Publishing confidentiality claims without the mandatory-reporting exception could mislead a survivor about what their advocate must disclose.

---

## "CALL 911 NOW" — not "YES: CALL 911"

The immediate-danger callout on get-help and crisis-adjacent pages must use:

`CALL 911 NOW`

Not "YES: CALL 911" (suggests a yes/no decision frame for a life-safety moment).

---

## Legal advice caveat

Pages that describe legal options (Legal Clinic, LegalOptionsTree, court-day walkthrough) must not imply that the content constitutes legal advice for the reader's specific situation.

Do not add explicit "this is not legal advice" disclaimers unless a page currently has one — that is a legal/policy call above Claude's scope. But do not write copy that implies:
- A specific outcome will result from a specific legal step
- The reader "should" take a specific legal action
- A restraining order "will" or "won't" protect them in a specific scenario

Use hedging language: "may apply," "can request," "the court considers," "depends on your situation."

---

## Immigration copy

Immigration-related legal content is especially sensitive. Rules:
1. Never speculate about current policy, enforcement posture, or timeline
2. Always direct to Rainbow's Legal Team to discuss current options (policy changes frequently)
3. Note historical context ("Rainbow's Legal team has historically supported survivors with immigration relief since 2008") without implying current service scope
4. Do not add specific visa categories or eligibility criteria without explicit review

---

## Safety note component

Crisis-adjacent pages should have a red left-border `aside` near the top with the hotline. Standard pattern:

```html
<aside style="border-left: 4px solid var(--safety-red); padding: 16px 20px; background: rgba(198,40,40,0.04); margin-bottom: 32px;">
  <strong>If you are in immediate danger, call 911.</strong>
  For confidential support, call our 24/7 hotline: 
  <a href="tel:3105479343" style="color: var(--safety-red);">310-547-9343</a>
</aside>
```

Pages that require this: get-help, legal-options, court-day, any page describing legal proceedings.
