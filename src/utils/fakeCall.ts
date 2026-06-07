import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'fake-call' });

export interface FakeCallConfig {
  callerName: string;
  callerLabel: string; // e.g. "mobile"
}

const KEY = 'config';
const DEFAULT: FakeCallConfig = { callerName: 'Mom', callerLabel: 'mobile' };

export function loadFakeCallConfig(): FakeCallConfig {
  const raw = storage.getString(KEY);
  if (!raw) return DEFAULT;
  try { return JSON.parse(raw) as FakeCallConfig; }
  catch { return DEFAULT; }
}

export function saveFakeCallConfig(config: FakeCallConfig): void {
  storage.set(KEY, JSON.stringify(config));
}
