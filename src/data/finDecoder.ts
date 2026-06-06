import { DecoderExample } from './decoder';

export const FIN_DECODER_EXAMPLES: DecoderExample[] = [
  {
    id: 'allowance',
    label: 'The allowance',
    meta: 'Partner · Monday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'i put your ' }, { t: 'money for the week', chipId: 'allow' }, { t: ' on the table.' }] },
        { from: 'them', segments: [{ t: 'should be plenty if you ' }, { t: "don't waste it", chipId: 'shame' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'and i need ' }, { t: 'the change and receipts', chipId: 'account' }, { t: ' back.' }] },
        { from: 'them', segments: [{ t: "you don't need your own card. " }, { t: 'i handle the money', chipId: 'gatekeep' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'The allowance',
      summary: 'Money is handed out in portions, on conditions, with receipts owed back. Access becomes a privilege, not a right.',
      chips: [
        { id: 'allow', label: 'Rations your access', body: 'An allowance keeps you dependent and short. You can never build a cushion to leave with.' },
        { id: 'shame', label: 'Frames need as waste', body: 'Spending on yourself is recast as careless, so you ask for less and apologize for more.' },
        { id: 'account', label: 'Demands accounting', body: 'Returning change and receipts is not budgeting. It is proof that you are being watched.' },
        { id: 'gatekeep', label: 'Sole control of money', body: 'One person holding all access, accounts, and cards is a core tactic of financial abuse.' },
      ],
    },
    saferResponses: [
      { tone: 'Name it to yourself', text: 'An allowance with receipts owed back is control, not a budget. I am allowed my own money.' },
      { tone: 'Quiet first step', text: 'I am going to open a small account in my own name that only I can see.' },
      { tone: 'For a friend', text: 'Do you have any money that is only yours right now? We can look at safe ways to start.' },
    ],
    notes: 'Couples share money in many ways. The tell is access: can you reach money on your own, without asking, without proving why.',
  },
  {
    id: 'work-sabotage',
    label: 'Sabotaging work',
    meta: 'Partner · 8:12 AM',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'why do you even need that job' }] },
        { from: 'them', segments: [{ t: "i'll " }, { t: "drive you, so you can't take the car", chipId: 'mobility' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'i might just ' }, { t: 'show up at your work', chipId: 'jobthreat' }, { t: ' today.' }] },
        { from: 'them', segments: [{ t: 'a real partner would ' }, { t: 'stay home with me', chipId: 'isolate' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Sabotaging work',
      summary: 'Your income is a threat to their control, so the job itself gets attacked, quietly or out loud.',
      chips: [
        { id: 'mobility', label: 'Controls how you move', body: 'Taking the car, the keys, or the bus fare makes getting to work depend on them.' },
        { id: 'jobthreat', label: 'Threatens your job', body: 'Showing up, calling repeatedly, or causing scenes at work is designed to get you fired.' },
        { id: 'isolate', label: 'Work reframed as betrayal', body: 'A job is income, coworkers, and an exit. Framing it as disloyal is how all three get cut off.' },
      ],
    },
    saferResponses: [
      { tone: 'Name it to yourself', text: 'My job is my income and my way out. Keeping it is a safety decision, not a selfish one.' },
      { tone: 'Quiet first step', text: 'I will tell one trusted person at work what is happening, so they can help if he shows up.' },
      { tone: 'For a friend', text: 'Losing a job traps people. Can I help with a ride or backup so you can keep going in?' },
    ],
    notes: 'Survivors who keep an income keep options. Anything that targets your ability to work is worth taking seriously.',
  },
  {
    id: 'coerced-debt',
    label: 'Debt in your name',
    meta: 'Partner · Saturday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'i need you to ' }, { t: 'open a card in your name', chipId: 'open' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'mine is maxed. ' }, { t: 'yours has better credit', chipId: 'usecredit' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'just ' }, { t: 'sign the loan', chipId: 'sign' }, { t: ". it's for us." }] },
        { from: 'them', segments: [{ t: 'if you loved me you ' }, { t: "wouldn't make this a thing", chipId: 'pressure' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Coerced debt',
      summary: 'Debt is run up in your name, by pressure or behind your back. You are left owing money you never controlled.',
      chips: [
        { id: 'open', label: 'Debt in your name', body: 'Cards and loans in your name make you legally liable, even if they spend every dollar.' },
        { id: 'usecredit', label: 'Mines your credit', body: 'Your good credit becomes a resource to drain, then wrecked when the bills go unpaid.' },
        { id: 'sign', label: 'Pressure to sign', body: 'Signing under pressure is coerced debt. It can wreck your credit for years after you leave.' },
        { id: 'pressure', label: 'Love as collateral', body: 'Tying the loan to whether you love them turns a financial trap into a loyalty test.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: 'I am not going to open credit or sign a loan in my name. That is not money I control.' },
      { tone: 'Quiet first step', text: 'I will pull my own credit report to see what is open in my name right now.' },
      { tone: 'For a friend', text: 'Coerced debt is a real thing with real remedies. A hotline advocate can point you to help.' },
    ],
    notes: 'You are not powerless over debt taken in your name through coercion or fraud. Document what you can, and ask an advocate about options.',
  },
  {
    id: 'hidden-money',
    label: 'Hiding the money',
    meta: 'Partner · Wednesday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'the accounts are ' }, { t: "complicated, don't worry about it", chipId: 'opaque' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'i moved things around. ' }, { t: "it's handled", chipId: 'control' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'you ' }, { t: "wouldn't understand the statements", chipId: 'belittle' }, { t: ' anyway.' }] },
        { from: 'them', segments: [{ t: "we don't have money for that. " }, { t: 'trust me', chipId: 'trust' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Hiding the money',
      summary: 'You are kept in the dark about what you actually have, so you cannot plan, save, or leave on solid ground.',
      chips: [
        { id: 'opaque', label: 'Keeps you in the dark', body: '"Don\'t worry about it" blocks you from knowing what exists, which is information you have a right to.' },
        { id: 'control', label: 'Moves assets alone', body: 'Shifting money and accounts without you is how shared assets quietly become theirs.' },
        { id: 'belittle', label: 'Belittles your competence', body: 'Telling you that you would not understand keeps you from asking the next question.' },
        { id: 'trust', label: 'Demands blind trust', body: '"Trust me" replaces the statements, receipts, and access that real partners can both see.' },
      ],
    },
    saferResponses: [
      { tone: 'Name it to yourself', text: 'I have a right to know what we have and what is in my name. Not knowing is not an accident.' },
      { tone: 'Quiet first step', text: 'I will quietly gather copies of statements, tax returns, and account numbers and keep them safe.' },
      { tone: 'For a friend', text: 'Knowing the full financial picture is part of safety planning. An advocate can help you map it.' },
    ],
    notes: 'In a healthy partnership both people can see the money. Being blocked from that picture is itself a warning sign.',
  },
];
