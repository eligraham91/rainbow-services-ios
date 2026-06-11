import React from 'react';
import { EditorialScreen } from '@components/ui/EditorialScreen';

export default function ShelterExpectationsScreen() {
  return (
    <EditorialScreen
      eyebrow="Plan · What Shelter Is Like"
      title={"What to\nexpect."}
      sub="Emergency shelter can feel unfamiliar. Knowing what to expect can make the decision easier."
      blocks={[
        {
          label: { idx: '01', txt: 'WHAT IT IS' },
          body: 'Emergency shelter is confidential, short-term housing for survivors and their children. Shelter addresses are never published. Staff will not confirm whether you are there.',
        },
        {
          label: { idx: '02', txt: 'WHAT TO BRING' },
          list: [
            { h: 'ID and documents', b: "Passport, driver's license, birth certificates, Social Security cards for you and your children." },
            { h: 'Medications', b: 'A supply of any prescription medications, including for children.' },
            { h: 'Phone and charger', b: 'Your phone is yours to keep.' },
            { h: 'Small comfort items', b: 'For you or your children — a stuffed animal, a book, familiar snacks.' },
            { h: 'Nothing you cannot carry', b: 'Most shelters can help you retrieve belongings safely later.' },
          ],
        },
        {
          label: { idx: '03', txt: 'WHAT TO EXPECT' },
          list: [
            { h: 'A confidential intake', b: 'Staff will ask you some questions to understand your situation and connect you to services.' },
            { h: 'A shared space', b: 'You will likely have a private room, but common areas like kitchens are shared.' },
            { h: 'Rules', b: 'Shelters have house rules around curfews, guests, and phone use. These exist for everyone\'s safety.' },
            { h: 'Children are welcome', b: 'Most shelters accommodate children. Let staff know if you are bringing kids.' },
            { h: 'Pets', b: 'Pet-friendly shelters exist. Call ahead or ask a hotline for options near you.' },
          ],
        },
        {
          label: { idx: '04', txt: 'HOW TO GET IN' },
          body: 'Call the National DV Hotline (1-800-799-7233) or a local hotline. They will identify open beds in your area. You do not need an appointment. You do not need a police report.',
        },
      ]}
      readout={{
        eyebrow: 'READY TO LOOK',
        line: 'Find shelters and services near you.',
        actions: [{ t: 'Find local help', go: '/(tabs)/resources' }],
      }}
      footer="Shelter policies and availability vary. A hotline can give you the most current information."
    />
  );
}
