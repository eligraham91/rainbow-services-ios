import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function TalkToFriendScreen() {
  return (
    <EditorialScreen
      eyebrow="Learn · Talk to a Friend"
      title={"What to say\nwhen they tell you."}
      sub="If someone you care about opens up about what is happening at home, how you respond matters more than you might think."
      blocks={[
        {
          label: { idx: '01', txt: 'WHAT HELPS' },
          list: [
            { h: 'Believe them', b: 'Most people do not report abuse. Being believed is rare and meaningful.' },
            { h: 'Let them lead', b: "You don't know the full risk picture. Don't push them toward action they aren't ready for." },
            { h: 'Stay connected', b: 'Isolation is part of the pattern. Staying in their life is protective.' },
            { h: 'Name the hotline', b: 'Share the National DV Hotline (1-800-799-7233) without pressure to call it.' },
            { h: 'Ask before advising', b: "Are you looking for help, or do you need to talk? That question opens more than advice does." },
          ],
        },
        {
          label: { idx: '02', txt: 'WHAT DOES NOT HELP' },
          list: [
            { h: '"Why don\'t you just leave?"', b: 'Leaving is the most dangerous time. This question blames rather than supports.' },
            { h: 'Ultimatums', b: "Threatening to cut them off if they don't leave puts the relationship at risk and may isolate them further." },
            { h: 'Confronting the abuser', b: 'This can escalate danger. It is not your role and it may make things worse.' },
            { h: 'Keeping their secret from everyone', b: 'You can help without disclosing. But you do not have to absorb all of this alone either.' },
          ],
        },
        {
          label: { idx: '03', txt: 'TAKING CARE OF YOURSELF' },
          body: "Supporting someone in an abusive situation is hard. You will feel helpless, frustrated, and scared for them. That is normal. You cannot make their choices for them. You can stay present, keep the door open, and reach out when you need support too.",
        },
      ]}
      footer="You do not need to be an expert. Presence and belief are the most important things you can offer."
    />
  );
}
