// Legal Services Decision Tree — data
// Owned by Rainbow's legal director. Rainbow's legal team updates this as law changes.
// Last reviewed: 2026-02-14
// GATED: this data compiles but is not wired into any live screen.
// legal-prep route shows a "coming soon / pending review" state instead.

export const TREE_LAST_REVIEWED = '2026-02-14';

export interface TreeOption {
  id: string;
  label: string;
  routes?: string;
  tags?: string[];
}

export interface TreeNode {
  id: string;
  prompt: string;
  help: string;
  kind: 'single' | 'multi';
  options: TreeOption[];
}

export interface Remedy {
  id: string;
  title: string;
  lede: string;
  what: string;
  timeline: string;
  you: string;
  contest: string;
  outcomes: string;
  role: string;
  limits: string;
  tags: string[];
}

export const TREE_ROOT: TreeNode = {
  id: 'root',
  prompt: 'Are you in immediate danger right now?',
  help: 'Pick the option that best matches your situation. Your answers stay on this device and are not sent anywhere.',
  kind: 'single',
  options: [
    { id: 'danger_now', label: 'Yes — I need help now', routes: 'crisis' },
    { id: 'recent', label: 'No, but something happened recently', routes: 'situation_picker' },
    { id: 'ongoing', label: 'No, but something is ongoing', routes: 'situation_picker' },
    { id: 'unsure', label: "I'm not sure", routes: 'situation_picker' },
  ],
};

export const TREE_SITUATION: TreeNode = {
  id: 'situation_picker',
  prompt: "What's happening?",
  help: 'Select all that apply. Your selections are not saved and not visible to anyone.',
  kind: 'multi',
  options: [
    { id: 'physical', label: 'Physical violence', tags: ['dvro', 'criminal', 'cvc'] },
    { id: 'sexual', label: 'Sexual violence or coercion', tags: ['dvro', 'criminal', 'cvc'] },
    { id: 'threats', label: 'Threats, intimidation, or stalking', tags: ['dvro', 'criminal'] },
    { id: 'coercive', label: 'Controlling my money, my movements, or my access to people', tags: ['dvro', 'family'] },
    { id: 'children', label: 'Harming or threatening children', tags: ['dvro', 'family', 'criminal'] },
    { id: 'immigration', label: 'Harming or threatening me because of my immigration status', tags: ['dvro', 'immigration'] },
    { id: 'property', label: 'Damaging my property, my pets, or my belongings', tags: ['dvro', 'criminal'] },
    { id: 'contact', label: "Unwanted contact I can't stop (calls, texts, showing up)", tags: ['dvro', 'criminal'] },
    { id: 'surveillance', label: "Monitoring or surveillance I didn't agree to", tags: ['dvro', 'criminal'] },
    { id: 'other', label: "Something else — I'll describe it to an advocate", tags: ['intake'] },
  ],
};

export const TREE_REMEDIES: Record<string, Remedy> = {
  dvro: {
    id: 'dvro',
    title: 'A Domestic Violence Restraining Order',
    lede: 'A civil court order that legally requires the other person to stay away from you, stop contacting you, and — if ordered — leave a shared home.',
    what: 'A civil court order under the California Domestic Violence Prevention Act. A judge can order the other person to stay away from you, stop contacting you, leave a shared home, stay away from your workplace and your children\'s school, turn in firearms, and pay certain costs.',
    timeline: 'Temporary emergency orders are often available within hours. A longer-term order (up to five years, sometimes renewable permanently) is issued after a hearing, typically within three weeks of filing.',
    you: 'File the paperwork (Rainbow can help). Attend the hearing. Tell the judge what happened, plainly. You do not need a police report to get a restraining order.',
    contest: 'The other person is served with notice and can appear at the hearing to contest it. A Rainbow attorney can represent you at no cost.',
    outcomes: 'If granted: a legally enforceable order. Violations are a crime. If denied: you can refile if circumstances change.',
    role: 'Rainbow can help you understand whether you qualify, prepare the paperwork, go to court with you, and represent you in the hearing at no cost.',
    limits: 'A restraining order is a piece of paper. It does not guarantee safety. Orders work best as part of a broader safety plan, not in place of one.',
    tags: ['physical', 'sexual', 'threats', 'coercive', 'children', 'property', 'contact', 'surveillance', 'immigration'],
  },
  criminal: {
    id: 'criminal',
    title: 'A Criminal Report and Prosecution',
    lede: 'Separate from a restraining order. Filed with law enforcement. Pursued by the District Attorney, not by you.',
    what: 'A report to law enforcement that triggers a criminal investigation. Charges are brought by the District Attorney in the name of the People of California. You are a witness, not the person filing charges.',
    timeline: 'Immediate to days for arrest. Weeks to months for charging decisions. Months to over a year for a case to resolve.',
    you: 'Speak with officers. Give a statement. You may be asked to testify. You do not control whether charges are filed, dropped, or pled down.',
    contest: 'The defendant has a constitutional right to confront witnesses. If the case goes to trial, you will likely be asked to testify.',
    outcomes: 'Conviction, acquittal, plea agreement, diversion, or dismissal.',
    role: 'Rainbow can help you prepare for law enforcement interactions and accompany you through the criminal process as a victim advocate.',
    limits: 'Calling the police is not a neutral act. It can escalate. The DA controls the case, not you. We will talk you through this before you file.',
    tags: ['physical', 'sexual', 'threats', 'children', 'property', 'contact', 'surveillance'],
  },
  family: {
    id: 'family',
    title: 'Family Law Action — Custody, Visitation, Support',
    lede: 'A separate civil case that decides who the children live with, who makes decisions for them, and who pays what.',
    what: 'A case in family court — divorce, legal separation, paternity, or a standalone custody action — that results in orders about custody, visitation, and financial support.',
    timeline: 'Temporary orders within weeks. Final judgments from six months to two years.',
    you: 'File the petition. Serve the other party. Attend mediation. Exchange financial disclosures. Attend hearings.',
    contest: 'Most family law cases are contested on at least one issue.',
    outcomes: 'A court order governing custody, visitation, and support.',
    role: "Rainbow's legal team can advise, draft paperwork, and in some cases represent you in family court.",
    limits: 'Family court is slow and adversarial. A parent with a history of abuse can still be awarded visitation.',
    tags: ['coercive', 'children'],
  },
  immigration: {
    id: 'immigration',
    title: 'Immigration Relief for Survivors',
    lede: 'Federal law provides specific paths to legal status for survivors of domestic violence, sexual assault, and other crimes.',
    what: 'Several federal options may apply: a VAWA self-petition; a U visa (for victims of certain crimes who cooperate with law enforcement); a T visa (for trafficking survivors); and asylum.',
    timeline: 'VAWA self-petitions: one to three years for a decision. U visas: currently a multi-year backlog.',
    you: 'Gather documentation — identity, relationship, the abuse itself. An attorney is strongly recommended.',
    contest: 'USCIS may issue a Request for Evidence or deny the petition.',
    outcomes: 'If granted: lawful status, work authorization, and a path to permanent residence.',
    role: "Rainbow's legal team can screen you for the right option, prepare the petition, and represent you.",
    limits: 'Immigration cases are long. Federal policy changes. We will not tell you there are no risks — we will tell you what they are, and let you decide.',
    tags: ['immigration', 'coercive', 'physical', 'sexual', 'threats'],
  },
  cvc: {
    id: 'cvc',
    title: 'A Crime Victim Compensation Application',
    lede: 'A state program that can pay for expenses tied to the abuse — medical bills, therapy, relocation — whether or not criminal charges are filed.',
    what: 'The California Victim Compensation Board reimburses eligible expenses for survivors of crime, including domestic violence, sexual assault, and stalking.',
    timeline: 'Applications are typically decided within sixty to ninety days.',
    you: 'Complete the application. Provide documentation. Cooperate with reasonable requests for information.',
    contest: 'Applications can be denied for eligibility or documentation reasons. Denials can be appealed.',
    outcomes: 'If approved: direct reimbursement of covered expenses up to program limits.',
    role: 'Rainbow can help determine eligibility, complete the application, and navigate the process.',
    limits: 'The program has coverage caps. It will not pay for property damage or pain and suffering.',
    tags: ['physical', 'sexual', 'children', 'contact'],
  },
  intake: {
    id: 'intake',
    title: 'A Conversation With an Advocate',
    lede: "If none of the legal tools above quite fit, or you don't know yet — that's what the intake line is for.",
    what: "Not every situation maps neatly to a legal remedy. An intake call is a confidential conversation with a trained advocate who can help you name what is happening and identify options.",
    timeline: 'First conversation: same day during staffed hours, usually within minutes of calling.',
    you: 'Share as much or as little as you want. You decide what happens next.',
    contest: 'N/A.',
    outcomes: 'A clearer picture of your situation, and a next step you choose.',
    role: 'This is what Rainbow does. It is the front door of everything else.',
    limits: 'The intake line is not a substitute for emergency services. If you are in immediate danger, call 911.',
    tags: ['other'],
  },
};

export function routeRemedies(selectedIds: string[]): string[] {
  const set = new Set(selectedIds);
  const order = ['dvro', 'criminal', 'family', 'immigration', 'cvc', 'intake'];
  return order.filter((rid) => {
    const r = TREE_REMEDIES[rid];
    return r.tags.some((t) => set.has(t));
  });
}
