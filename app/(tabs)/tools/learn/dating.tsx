import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function DatingScreen() {
  return (
    <EditorialScreen
      eyebrow="Learn · Online and Dating Safety"
      title={"Meeting\nsomeone new."}
      sub="Most people you meet are fine. A few simple habits keep the rest from costing you."
      blocks={[
        {
          label: { idx: '01', txt: 'BEFORE YOU MEET' },
          list: [
            { h: 'Video chat first', b: 'A quick call confirms they are who they say they are.' },
            { h: 'Tell a friend the plan', b: 'Share who, where, and when, and a time you will check in.' },
            { h: 'Meet in public', b: 'A busy cafe or restaurant, never a home or a car, the first few times.' },
            { h: 'Bring your own way home', b: 'Your own car, ride, or fare, so you can leave when you want.' },
            { h: 'Share your live location', b: 'With a trusted friend for the evening, not with your date.' },
          ],
        },
        {
          label: { idx: '02', txt: 'WORTH NOTICING' },
          list: [
            { h: 'Moving very fast', b: 'Intense affection, talk of forever, or pressure to commit early.' },
            { h: 'Pushing your limits', b: 'Not taking no for an answer about plans, money, or touch.' },
            { h: 'Pulling you away', b: 'Subtle digs at your friends and family, or wanting all your time.' },
            { h: 'Checking up on you', b: 'Wanting passwords, location, or constant replies.' },
          ],
        },
        {
          label: { idx: '03', txt: 'DIGITAL SAFETY' },
          list: [
            { h: 'Hold back details', b: 'Keep your home, work, and routine private until trust is earned.' },
            { h: 'Reverse-image search', b: 'Check that their photos are really theirs.' },
            { h: 'Turn off photo location', b: 'Photos can carry the exact spot they were taken.' },
          ],
        },
      ]}
      footer="Trust your gut. If something feels wrong, you do not owe anyone an explanation for leaving."
    />
  );
}
