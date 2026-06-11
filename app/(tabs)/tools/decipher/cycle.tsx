import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function CycleScreen() {
  return (
    <EditorialScreen
      eyebrow="Decipher · The Cycle"
      title={"Why it\nkeeps going."}
      sub="Many abusive relationships follow a recognizable pattern. Naming it can help you see where you are — and that the calm does not mean it is over."
      blocks={[
        {
          label: { idx: '01', txt: 'TENSION BUILDING' },
          body: 'Stress accumulates. Small incidents increase. You may find yourself walking on eggshells, trying to manage the mood, avoid triggers, or keep everything calm. The feeling that something is coming.',
        },
        {
          label: { idx: '02', txt: 'THE INCIDENT' },
          body: 'An explosion: physical, sexual, emotional, or verbal. It may be triggered by something small or by nothing at all. The incident releases the built-up tension.',
        },
        {
          label: { idx: '03', txt: 'RECONCILIATION' },
          body: 'Apologies, gifts, affection, promises. The person you fell for comes back. They may minimize what happened, blame stress, or blame you. This phase can be intense and confusing.',
        },
        {
          label: { idx: '04', txt: 'THE CALM' },
          body: 'A period of relative peace. Things seem normal. It can feel like evidence that it was not that bad, or that things have changed. The cycle then repeats, often escalating over time.',
        },
        {
          label: { idx: '05', txt: 'WHY IT MATTERS' },
          body: 'The reconciliation phase is not proof that the relationship is healthy. It is part of the cycle. Leaving during the calm can be hard — that is by design. Many survivors leave and return multiple times. That is not failure.',
        },
      ]}
      readout={{
        eyebrow: 'RECOGNIZING THE PATTERN',
        line: 'Speaking with an advocate can help you name where you are and plan what comes next.',
        actions: [{ t: 'Find local help', go: '/(tabs)/resources' }],
      }}
      footer="The cycle of violence model is a general framework, not every relationship follows it exactly."
    />
  );
}
