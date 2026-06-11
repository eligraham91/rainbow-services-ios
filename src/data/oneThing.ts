// "One Thing" daily surface (EXPERIENCE-2026.md §6.5). One rotating card on
// the home screen, selected by a local date-seeded index. No server, no push,
// no streak counter. If the user opens the app, today's thing is there. If
// they don't, nothing chases them.
//
// All entries restate content that already exists in the app (decoder chips,
// editorial screens, grounding tools, state law screen). Flagged for Rainbow
// content review with the rest of the survivor-facing copy.

export interface OneThing {
  kind: 'pattern' | 'myth' | 'right' | 'grounding';
  eyebrow: string;
  text: string;
  // Optional deep link into the relevant tool
  route?: string;
}

export const ONE_THINGS: OneThing[] = [
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Photo requests that verify where you are function as surveillance, even when framed as casual.',
    route: '/(tabs)/tools/decipher/text-thread',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Continuous one-way location sharing is monitoring, not safety, especially when it is non-negotiable.',
    route: '/(tabs)/tools/decipher/text-thread',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'When a short delay in replying becomes a problem, the message is that your time is not yours.',
    route: '/(tabs)/tools/decipher/text-thread',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Sulking when you make plans is a way of making your independence cost something.',
    route: '/(tabs)/tools/decipher/text-thread',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'An allowance you have to ask for, from money you earned, is financial control.',
    route: '/(tabs)/tools/decipher/financial',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Debt opened in your name without your full agreement follows you. It is also a documented pattern of abuse.',
    route: '/(tabs)/tools/decipher/financial',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'Abuse does not mean hitting. Coercive control, isolation, and financial control are abuse before anything physical happens.',
    route: '/(tabs)/tools/learn/definitions',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'Being different in public proves nothing. Many abusive people are warm and charming with everyone else.',
    route: '/(tabs)/tools/learn/definitions',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'Leaving is not a single decision. On average it takes several attempts, and each one builds on the last.',
    route: '/(tabs)/tools/learn/definitions',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'The calm period after an incident is part of the cycle, not the end of it.',
    route: '/(tabs)/tools/decipher/cycle',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'Every state has a civil protective order process. You do not need a lawyer or a police report to start one.',
    route: '/(tabs)/tools/learn/state-laws',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'Hotline advocates can talk through your options with no commitment. Calling is not filing a report.',
    route: '/emergency',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'A safety plan is not a commitment to leave. It is a set of options that exist before you need them.',
    route: '/(tabs)/tools/plan/safety-plan',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'Many shelters take children and pets. Asking what a shelter is like costs nothing.',
    route: '/(tabs)/tools/plan/shelter-expectations',
  },
  {
    kind: 'grounding',
    eyebrow: 'A 60-SECOND RESET',
    text: 'Four counts in, hold for seven, eight counts out. Two rounds is enough to shift your nervous system.',
    route: '/(tabs)/tools/somatic/breathe',
  },
  {
    kind: 'grounding',
    eyebrow: 'A 60-SECOND RESET',
    text: 'Name five things you can see, four you can touch, three you can hear. Your attention comes back to the room.',
    route: '/(tabs)/tools/somatic/ground',
  },
  {
    kind: 'grounding',
    eyebrow: 'A 60-SECOND RESET',
    text: 'Steady ambient sound gives a racing mind one thing to hold. Sixty seconds of listening counts.',
    route: '/(tabs)/tools/somatic/listen',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Apology gifts that arrive on schedule after each incident are part of the pattern, not a break from it.',
    route: '/(tabs)/tools/decipher/cycle',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'Alcohol does not cause abuse. Many people drink without controlling anyone. It lowers the cost, not the cause.',
    route: '/(tabs)/tools/learn/definitions',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'You can ask a trusted person to agree on a code word. One phrase, one agreed action, arranged once in person.',
    route: '/(tabs)/tools/plan/safety-plan',
  },
  {
    kind: 'pattern',
    eyebrow: 'A PATTERN WORTH NOTICING',
    text: 'Keeping you from work, or making you too exhausted to keep a job, makes leaving harder. That is its function.',
    route: '/(tabs)/tools/decipher/financial',
  },
  {
    kind: 'grounding',
    eyebrow: 'A 60-SECOND RESET',
    text: 'Press your feet into the floor and notice the pressure. Weight is information your body trusts.',
    route: '/(tabs)/tools/somatic/ground',
  },
  {
    kind: 'right',
    eyebrow: 'SOMETHING YOU CAN DO',
    text: 'Notes you keep in the vault stay on this device, encrypted. Writing things down builds a record only you can see.',
    route: '/(tabs)/vault',
  },
  {
    kind: 'myth',
    eyebrow: 'A MYTH WORTH RETIRING',
    text: 'Asking why someone stays is the wrong question. Staying is often the safest available option at the time.',
    route: '/(tabs)/tools/learn/talk-to-friend',
  },
];

// Deterministic date-seeded pick. Same item all day, new item tomorrow,
// computed locally with no clock drift across midnight sessions.
export function todaysThing(date: Date = new Date()): OneThing {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  return ONE_THINGS[seed % ONE_THINGS.length];
}
