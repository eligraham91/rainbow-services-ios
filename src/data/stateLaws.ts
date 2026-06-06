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
  { state: 'California', orderName: 'Domestic Violence Restraining Order (DVRO)' },
  { state: 'New York', orderName: 'Order of Protection' },
  { state: 'Texas', orderName: 'Protective Order' },
  { state: 'Florida', orderName: 'Injunction for Protection Against Domestic Violence' },
  { state: 'Illinois', orderName: 'Order of Protection' },
  { state: 'Pennsylvania', orderName: 'Protection From Abuse (PFA) Order' },
  { state: 'Ohio', orderName: 'Civil Protection Order (CPO)' },
  { state: 'Georgia', orderName: 'Family Violence Protective Order' },
  { state: 'North Carolina', orderName: 'Domestic Violence Protective Order (50B)' },
  { state: 'Michigan', orderName: 'Personal Protection Order (PPO)' },
  { state: 'Washington', orderName: 'Domestic Violence Protection Order' },
  { state: 'Arizona', orderName: 'Order of Protection' },
  { state: 'Massachusetts', orderName: 'Abuse Prevention Order (209A)' },
  { state: 'Colorado', orderName: 'Civil Protection Order' },
  { state: 'New Jersey', orderName: 'Restraining Order (under the PDVA)' },
  { state: 'Virginia', orderName: 'Protective Order' },
];

export const NATIONAL_DV_HOTLINE: HotlineFallback = {
  tag: 'NATIONAL DV HOTLINE',
  name: 'National Domestic Violence Hotline',
  number: '1-800-799-7233',
  dial: '18007997233',
  note: 'They can connect you to legal help in your state.',
};
