import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function DeEscalationScreen() {
  return (
    <EditorialScreen
      eyebrow="Plan · De-escalation"
      title={"In the\nmoment."}
      sub="When tension is rising, these strategies may reduce immediate risk. They are not a substitute for a safety plan."
      blocks={[
        {
          label: { idx: '01', txt: 'LOWER THE HEAT' },
          list: [
            { h: 'Stay calm if you can', b: 'A calm voice and slow movements can slow an escalating situation.' },
            { h: 'Do not argue back', b: 'Winning an argument is not the goal. Staying safe is.' },
            { h: 'Agree to disagree', b: 'Phrases like "you may be right" or "let me think about that" can buy time.' },
            { h: 'Avoid certain rooms', b: 'Bathrooms, kitchens, and garages are more dangerous. Try to stay near an exit.' },
          ],
        },
        {
          label: { idx: '02', txt: 'BUY TIME' },
          list: [
            { h: 'Introduce a distraction', b: 'A phone call, a child needing attention, or an errand that needs doing.' },
            { h: 'Name an excuse to leave', b: '"I need to go to the store. I\'ll be back in an hour." Keep it matter-of-fact.' },
            { h: 'Signal a friend', b: 'A pre-arranged word or emoji that tells a friend to call you with an "emergency."' },
          ],
        },
        {
          label: { idx: '03', txt: 'IF IT ESCALATES' },
          list: [
            { h: 'Your safety first', b: 'If you can get out safely, do. Property can be replaced.' },
            { h: 'Call 911 if it is urgent', b: 'Tell the dispatcher your address and what is happening.' },
            { h: 'Leave a signal', b: 'If you call a friend, stay on the line or leave the phone on so they can hear.' },
          ],
        },
        {
          label: { idx: '04', txt: 'AFTER' },
          body: 'A de-escalation is not a resolution. If this is a pattern, the next incident is usually more severe. This is the time to make a plan, while things are calm.',
        },
      ]}
      readout={{
        eyebrow: 'MAKE A PLAN FOR NEXT TIME',
        line: 'A safety plan maps what to do, where to go, and who to call before the next incident.',
        actions: [{ t: 'Build a safety plan', go: '/(tabs)/tools/plan/safety-plan' }],
      }}
      footer="These strategies may reduce immediate risk but cannot guarantee safety. If you are in danger, call 911."
    />
  );
}
