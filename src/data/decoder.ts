export interface Segment {
  t: string;
  chipId?: string;
}

export interface Bubble {
  from: 'them' | 'you';
  segments: Segment[];
}

export interface Chip {
  id: string;
  label: string;
  body: string;
}

export interface SaferResponse {
  tone: string;
  text: string;
}

export interface DecoderExample {
  id: string;
  label: string;
  preview?: string;
  meta: string;
  soundsLike: { bubbles: Bubble[] };
  functionsAs: { title: string; summary: string; chips: Chip[] };
  saferResponses: SaferResponse[];
  notes: string;
}

export const DECODER_EXAMPLES: DecoderExample[] = [
  {
    id: 'monitoring-urgency',
    label: 'Monitoring + urgency',
    preview: '"Where are you rn? Send pic. Reply now."',
    meta: 'Partner · 7:42 PM',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'where are you rn? ' }, { t: 'send pic', chipId: 'photo' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'you still at work?' }] },
        { from: 'them', segments: [{ t: 'just ' }, { t: 'share your location', chipId: 'location' }, { t: ' so i stop worrying' }] },
        { from: 'them', segments: [{ t: "why aren't you ", chipId: 'urgency' }, { t: 'answering', chipId: 'urgency' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'this is ridiculous. ' }, { t: 'reply now', chipId: 'reply-now' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Monitoring + urgency',
      summary: 'Frames tracking as concern. Treats silence as defiance.',
      chips: [
        { id: 'photo', label: 'Asks for proof', body: 'Photo requests verify location and availability. Framed as casual, functions as surveillance.' },
        { id: 'location', label: 'Location sharing', body: "Continuous location access is surveillance, not safety, especially when it's one-way and non-negotiable." },
        { id: 'urgency', label: 'Escalates if ignored', body: 'A short delay becomes a problem. The message is: your time is not yours.' },
        { id: 'reply-now', label: 'Frames silence as disrespect', body: 'Not replying within minutes is reframed as rude, cold, or suspicious.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "I'm busy right now. I'll get back to you later tonight." },
      { tone: 'Delay + boundary', text: "I can't text back in real time when I'm at work. Let's talk when I'm home." },
      { tone: 'Safety-first', text: "I'm not going to share my location. If that's a problem for you, we need to talk in person." },
      { tone: 'For a friend', text: "Hey, she's with me tonight and her phone is on silent. She'll reach out tomorrow." },
    ],
    notes: 'Not every check-in is abusive. The pattern, volume, urgency, punishment for silence, is what matters.',
  },
  {
    id: 'guilt-isolation',
    label: 'Guilt + isolation',
    preview: '"Fine. Go have fun without me. I\'ll be alone."',
    meta: 'Partner · Friday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: "so you're really going out tonight" }] },
        { from: 'them', segments: [{ t: 'fine. ' }, { t: 'go have fun without me', chipId: 'sulk' }, { t: '.' }] },
        { from: 'them', segments: [{ t: "i'll just " }, { t: 'be here alone', chipId: 'pity' }, { t: ' again.' }] },
        { from: 'them', segments: [{ t: 'i guess your ' }, { t: 'friends matter more than me', chipId: 'wedge' }, { t: '.' }] },
        { from: 'them', segments: [{ t: "don't worry about it. i don't want to " }, { t: 'ruin your night', chipId: 'ruin' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Guilt + isolation',
      summary: 'Plans become a choice between you and them. Friends become a problem to manage.',
      chips: [
        { id: 'sulk', label: 'Punishes through withdrawal', body: "Sulking substitutes for a direct ask. Any outcome that isn't staying home is framed as selfish." },
        { id: 'pity', label: 'Casts self as victim', body: "The subtext: if something bad happens to me tonight, it's because you left." },
        { id: 'wedge', label: 'Drives a wedge from friends', body: "Over time, this splits you from people who would notice what's happening." },
        { id: 'ruin', label: 'Weaponized martyrdom', body: '"Don\'t worry about me" is a setup. You\'re meant to worry, and cancel.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "I'm going out tonight. I'll see you when I get back." },
      { tone: 'Delay + boundary', text: "I hear you're upset. We can talk about it tomorrow, I'm not canceling my plans." },
      { tone: 'Safety-first', text: "I'm not able to be responsible for how you feel when I see friends. I'm going." },
      { tone: 'For a friend', text: "You've been looking forward to tonight. You're not ruining anything." },
    ],
    notes: 'Feeling sad about a partner going out is normal. Making it your job to fix is the tell.',
  },
  {
    id: 'financial-pressure',
    label: 'Financial pressure',
    preview: '"Why did you spend $40 at Target? Send me the receipt."',
    meta: 'Partner · Tuesday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'saw a ' }, { t: '$40 charge at target', chipId: 'audit' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'what was that for.' }] },
        { from: 'them', segments: [{ t: 'send me the ' }, { t: 'receipt', chipId: 'receipt' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'we talked about ' }, { t: 'checking with me', chipId: 'permission' }, { t: ' on anything over $25.' }] },
        { from: 'them', segments: [{ t: "i'm the one earning here. " }, { t: 'i deserve to know', chipId: 'leverage' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Financial pressure',
      summary: 'Shared money becomes a permission system. Spending becomes a performance review.',
      chips: [
        { id: 'audit', label: 'Line-item surveillance', body: 'Pulling a specific small charge signals: I watch every one of these.' },
        { id: 'receipt', label: 'Demands proof for proof', body: "A receipt for a $40 expense isn't bookkeeping. It's a loyalty test." },
        { id: 'permission', label: 'Permission for routine spend', body: 'Adults coordinate big purchases. Approval for groceries is control.' },
        { id: 'leverage', label: 'Income as leverage', body: 'Framing income as ownership is how financial abuse is rationalized.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "It was household stuff. I'm not going to itemize every purchase." },
      { tone: 'Delay + boundary', text: "We can sit down and look at the budget this weekend. I'm not doing it over text." },
      { tone: 'Safety-first', text: "I need my own account. Let's talk about how we separate day-to-day spending." },
      { tone: 'For a friend', text: 'Do you have access to your own money right now? I can help you look at options.' },
    ],
    notes: 'Budgets are normal. Spending having to be justified, line by line, to one person, is not.',
  },
  {
    id: 'reputation-threats',
    label: 'Reputation threats',
    preview: '"Everyone is going to know what you really are."',
    meta: 'Partner · Sunday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'keep pushing me. see what happens.' }] },
        { from: 'them', segments: [{ t: 'your ' }, { t: 'mom is going to hear about this', chipId: 'family' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'i still have those ' }, { t: 'pictures', chipId: 'material' }, { t: '.' }] },
        { from: 'them', segments: [{ t: "i'll tell work " }, { t: 'exactly what kind of person', chipId: 'livelihood' }, { t: ' you are.' }] },
        { from: 'them', segments: [{ t: 'everyone is going to ' }, { t: 'know the truth', chipId: 'narrative' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Reputation threats',
      summary: 'Threats move from the relationship to your life outside of it, family, work, image.',
      chips: [
        { id: 'family', label: 'Weaponizes family', body: "A threat to involve family isn't about family. It's about isolating you from support." },
        { id: 'material', label: 'Image-based coercion', body: 'Intimate images used as leverage is a crime in California (Penal Code 647(j)(4)).' },
        { id: 'livelihood', label: 'Threatens your job', body: 'Contacting an employer to damage a reputation is retaliation, not honesty.' },
        { id: 'narrative', label: 'Controls the story', body: '"The truth" here means their version, delivered to people before you can.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "I'm not responding to threats. Please stop contacting me this way." },
      { tone: 'Delay + boundary', text: "I'm saving this message. We're not talking again without a third party present." },
      { tone: 'Safety-first', text: "This is a threat and I'm treating it that way. I'm contacting a hotline for next steps." },
      { tone: 'For a friend', text: "Screenshot everything. Don't delete. Rainbow Services hotline: 310-547-9343." },
    ],
    notes: 'Threats to expose, shame, or tell someone are a pattern of abuse, even without physical violence.',
  },
  {
    id: 'jealousy-gaslighting',
    label: 'Jealousy + gaslighting',
    preview: '"Who is he. And don\'t lie this time."',
    meta: 'Partner · Thursday',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: 'saw you ' }, { t: 'laughing with that guy', chipId: 'watching' }, { t: ' at the coffee place.' }] },
        { from: 'them', segments: [{ t: 'who is he.' }] },
        { from: 'them', segments: [{ t: 'and ' }, { t: "don't lie this time", chipId: 'preemptive' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'i know what i saw. ' }, { t: 'you do this every time', chipId: 'reality' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'if you had ' }, { t: "nothing to hide you'd just tell me", chipId: 'flip' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Jealousy + gaslighting',
      summary: 'Surveillance reframed as love. Your memory reframed as a lie.',
      chips: [
        { id: 'watching', label: "Reports they've been watching", body: 'The detail is the point, noticing specific interactions signals ongoing observation.' },
        { id: 'preemptive', label: 'Preemptive accusation', body: '"Don\'t lie this time" assumes guilt before a question is answered.' },
        { id: 'reality', label: 'Overwrites your version', body: '"I know what I saw" substitutes their interpretation for your experience.' },
        { id: 'flip', label: 'Flips privacy into evidence', body: "Any boundary becomes proof of hiding something. There's no correct answer." },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "I'm not going to defend a conversation I had in public with a stranger." },
      { tone: 'Delay + boundary', text: "I'm not getting into this over text. If you want to talk calmly, we can tomorrow." },
      { tone: 'Safety-first', text: "I'm not answering interrogations. I'm going to stay with a friend tonight." },
      { tone: 'For a friend', text: "This isn't jealousy being cute. Do you feel safe going home tonight?" },
    ],
    notes: 'Occasional insecurity is human. Being cross-examined for a public interaction is a pattern.',
  },
  {
    id: 'love-bomb-pressure',
    label: 'Love-bombing + pressure',
    preview: '"No one will ever love you like I do. Prove it."',
    meta: 'Partner · 2:14 AM',
    soundsLike: {
      bubbles: [
        { from: 'them', segments: [{ t: "i've never felt like this about anyone." }] },
        { from: 'them', segments: [{ t: 'no one is ever going to ' }, { t: 'love you like i do', chipId: 'exclusive' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'we should ' }, { t: "move in. let's do it this month", chipId: 'fastforward' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'if you really loved me ' }, { t: "you wouldn't hesitate", chipId: 'test' }, { t: '.' }] },
        { from: 'them', segments: [{ t: 'answer me. ' }, { t: "i can't sleep until you do", chipId: 'nowcost' }, { t: '.' }] },
      ],
    },
    functionsAs: {
      title: 'Love-bombing + pressure',
      summary: 'Intensity compressed into a timeline. Affection tied to an answer by morning.',
      chips: [
        { id: 'exclusive', label: 'Positions self as only option', body: 'The idea that no one else could love you is both flattery and a fence.' },
        { id: 'fastforward', label: 'Accelerates commitment', body: 'Moving in, marriage, a baby, moving cities, fast-tracking limits your exit options.' },
        { id: 'test', label: 'Love as compliance test', body: "Hesitation becomes proof you don't love them. The only passing grade is yes." },
        { id: 'nowcost', label: 'Emotional cost of silence', body: '"I can\'t sleep until you do" makes you responsible for their regulation.' },
      ],
    },
    saferResponses: [
      { tone: 'Neutral boundary', text: "I need to think about this. We don't need to decide tonight." },
      { tone: 'Delay + boundary', text: "Big decisions don't happen at 2am. Let's talk in person this weekend." },
      { tone: 'Safety-first', text: "I'm not ready. Pushing me to move faster is going to move me away, not closer." },
      { tone: 'For a friend', text: "The speed itself is the thing to notice. You're allowed to take months to decide." },
    ],
    notes: 'Genuine affection can handle a pause. Pressure that escalates when you pause is the signal.',
  },
];
