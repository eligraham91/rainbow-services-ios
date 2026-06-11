import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function CoercionScreen() {
  return (
    <EditorialScreen
      eyebrow="Decipher · Coercive Control"
      title={"Not just\nphysical."}
      sub="Coercive control is a pattern of behavior used to take away someone's liberty and independence. It can be invisible, and it is illegal in many places."
      blocks={[
        {
          label: { idx: '01', txt: 'WHAT IT LOOKS LIKE' },
          list: [
            { h: 'Isolation', b: 'Cutting you off from friends, family, or support networks, bit by bit.' },
            { h: 'Monitoring', b: 'Tracking your location, calls, messages, and movements without consent.' },
            { h: 'Micromanagement', b: 'Rules about what you wear, who you speak to, where you go, and when.' },
            { h: 'Financial control', b: 'Controlling access to money so you cannot leave or plan independently.' },
            { h: 'Threats', b: 'Using fear of exposure, harm, or consequences to keep you compliant.' },
          ],
        },
        {
          label: { idx: '02', txt: 'WHY IT IS HARD TO NAME' },
          body: 'Coercive control rarely announces itself. It builds through small rules that each seem reasonable in isolation. By the time the pattern is visible, it can be hard to remember life before it.',
        },
        {
          label: { idx: '03', txt: 'THE TELL' },
          body: 'Ask: do I make decisions freely? Can I spend money, see people, or leave when I want to, without consequences? If the answer is no on most days, that pattern is worth talking to someone about.',
        },
      ]}
      readout={{
        eyebrow: 'IF ANY OF THIS FITS',
        line: 'An advocate can help you see the pattern and make a plan.',
        actions: [{ t: 'Find local help', go: '/(tabs)/resources' }, { t: 'Build a safety plan', go: '/(tabs)/tools/plan/safety-plan' }],
      }}
      footer="General information, not legal advice. Laws on coercive control vary by jurisdiction."
    />
  );
}
