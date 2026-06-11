import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function DefinitionsScreen() {
  return (
    <EditorialScreen
      eyebrow="Learn · The Definitions"
      title={"What the\nwords mean."}
      sub="Plain definitions, with no labels placed on you. Knowing the words can make your own experience easier to see."
      blocks={[
        {
          label: { idx: '01', txt: 'WHAT DV IS' },
          body: 'Domestic violence is a pattern of behavior used to gain or keep power and control over an intimate partner. It can be physical, but it does not have to be.',
        },
        {
          label: { idx: '02', txt: 'THE FORMS' },
          list: [
            { h: 'Physical', b: 'Any use of the body to control or frighten you.' },
            { h: 'Emotional and verbal', b: 'Insults, blame, threats, and constant criticism.' },
            { h: 'Financial', b: 'Controlling money, debt, or your ability to work.' },
            { h: 'Sexual', b: 'Any sexual contact you did not freely agree to.' },
            { h: 'Digital', b: 'Monitoring your phone, location, or accounts.' },
            { h: 'Coercive control', b: 'A pattern of rules and isolation that shrinks your world.' },
          ],
        },
        {
          label: { idx: '03', txt: 'CONSENT' },
          title: 'Consent is an ongoing yes',
          body: 'Consent is freely given and informed, and it can be withdrawn at any time, including inside a marriage. Pressure, threats, or being asleep or impaired means there is no consent.',
        },
      ]}
      readout={{
        eyebrow: 'IF ANY OF THIS FITS',
        line: 'Speaking with an advocate can help you make sense of it.',
        actions: [{ t: 'Find local help', go: '/(tabs)/resources' }, { t: 'Decode a pattern', go: '/(tabs)/tools/decipher' }],
      }}
      footer="This is general information, not a diagnosis. Only you can name your own experience."
    />
  );
}
