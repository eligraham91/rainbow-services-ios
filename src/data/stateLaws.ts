export interface StateLaw {
  state: string;
  orderName: string;
}

export interface HotlineFallback {
  tag: string;
  name: string;
  number: string;
  dial: string;
  note: string;
}

export const STATE_LAWS: StateLaw[] = [
  { state: 'Alabama', orderName: 'Protection Order' },
  { state: 'Alaska', orderName: 'Domestic Violence Protective Order' },
  { state: 'Arizona', orderName: 'Order of Protection' },
  { state: 'Arkansas', orderName: 'Order of Protection' },
  { state: 'California', orderName: 'Domestic Violence Restraining Order (DVRO)' },
  { state: 'Colorado', orderName: 'Civil Protection Order' },
  { state: 'Connecticut', orderName: 'Restraining Order (CGS 46b-15)' },
  { state: 'Delaware', orderName: 'Protection From Abuse Order (PFA)' },
  { state: 'District of Columbia', orderName: 'Civil Protection Order (CPO)' },
  { state: 'Florida', orderName: 'Injunction for Protection Against Domestic Violence' },
  { state: 'Georgia', orderName: 'Family Violence Protective Order' },
  { state: 'Hawaii', orderName: 'Order for Protection' },
  { state: 'Idaho', orderName: 'Protection Order' },
  { state: 'Illinois', orderName: 'Order of Protection' },
  { state: 'Indiana', orderName: 'Protective Order' },
  { state: 'Iowa', orderName: 'Protective Order' },
  { state: 'Kansas', orderName: 'Protection from Abuse Order' },
  { state: 'Kentucky', orderName: 'Domestic Violence Order (DVO)' },
  { state: 'Louisiana', orderName: 'Protective Order' },
  { state: 'Maine', orderName: 'Protection from Abuse Order (PFA)' },
  { state: 'Maryland', orderName: 'Protective Order' },
  { state: 'Massachusetts', orderName: 'Abuse Prevention Order (209A)' },
  { state: 'Michigan', orderName: 'Personal Protection Order (PPO)' },
  { state: 'Minnesota', orderName: 'Order for Protection (OFP)' },
  { state: 'Mississippi', orderName: 'Domestic Violence Protection Order' },
  { state: 'Missouri', orderName: 'Order of Protection' },
  { state: 'Montana', orderName: 'Order of Protection' },
  { state: 'Nebraska', orderName: 'Protection Order' },
  { state: 'Nevada', orderName: 'Extended Protection Order' },
  { state: 'New Hampshire', orderName: 'Protective Order (RSA 173-B)' },
  { state: 'New Jersey', orderName: 'Restraining Order (under the PDVA)' },
  { state: 'New Mexico', orderName: 'Order of Protection' },
  { state: 'New York', orderName: 'Order of Protection' },
  { state: 'North Carolina', orderName: 'Domestic Violence Protective Order (Chapter 50B)' },
  { state: 'North Dakota', orderName: 'Domestic Violence Protective Order' },
  { state: 'Ohio', orderName: 'Civil Protection Order (CPO)' },
  { state: 'Oklahoma', orderName: 'Protective Order (Protection from Domestic Abuse Act)' },
  { state: 'Oregon', orderName: 'Family Abuse Prevention Act Restraining Order (FAPA)' },
  { state: 'Pennsylvania', orderName: 'Protection From Abuse Order (PFA)' },
  { state: 'Rhode Island', orderName: 'Domestic Violence Protection Order' },
  { state: 'South Carolina', orderName: 'Order of Protection (under SCDVRA)' },
  { state: 'South Dakota', orderName: 'Protection Order' },
  { state: 'Tennessee', orderName: 'Order of Protection' },
  { state: 'Texas', orderName: 'Protective Order' },
  { state: 'Utah', orderName: 'Protective Order' },
  { state: 'Vermont', orderName: 'Relief from Abuse Order (RFA)' },
  { state: 'Virginia', orderName: 'Protective Order' },
  { state: 'Washington', orderName: 'Domestic Violence Protection Order' },
  { state: 'West Virginia', orderName: 'Domestic Violence Protective Order' },
  { state: 'Wisconsin', orderName: 'Domestic Abuse Restraining Order' },
  { state: 'Wyoming', orderName: 'Order of Protection' },
];

export const NATIONAL_DV_HOTLINE: HotlineFallback = {
  tag: 'NATIONAL DV HOTLINE',
  name: 'National Domestic Violence Hotline',
  number: '1-800-799-7233',
  dial: '18007997233',
  note: 'They can connect you to legal help in your state.',
};
