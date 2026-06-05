import { createMMKV, type MMKV } from 'react-native-mmkv';
import * as SecureStore from 'expo-secure-store';

const VAULT_KEY_NAME = 'rainbow_vault_enc_key';
const VAULT_ITEMS_KEY = 'vault_items';
const SAFETY_PLAN_KEY = 'safety_plan';

export interface VaultItem {
  id: string;
  type: 'note' | 'contact';
  title: string;
  body: string;
  createdAt: number;
}

export interface SafetyPlanData {
  escapeRoutes: string;
  documents: string;
  emergencyContacts: string;
  codeWord: string;
  safePlaces: string;
  finances: string;
  lastUpdated: number;
}

export type SafetyPlanSection = keyof Omit<SafetyPlanData, 'lastUpdated'>;

let storage: MMKV | null = null;
let initPromise: Promise<void> | null = null;

async function getEncryptionKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(VAULT_KEY_NAME);
  if (!key) {
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    key = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    await SecureStore.setItemAsync(VAULT_KEY_NAME, key);
  }
  return key;
}

async function initStorage(): Promise<void> {
  if (storage) return;
  const encryptionKey = await getEncryptionKey();
  storage = createMMKV({ id: 'rainbow-vault', encryptionKey });
}

function ensureInit(): MMKV {
  if (!storage) {
    throw new Error('Vault not initialized. Await initVault() before use.');
  }
  return storage;
}

export async function initVault(): Promise<void> {
  if (!initPromise) {
    initPromise = initStorage();
  }
  return initPromise;
}

export function getVaultItems(): VaultItem[] {
  try {
    const raw = ensureInit().getString(VAULT_ITEMS_KEY);
    return raw ? (JSON.parse(raw) as VaultItem[]) : [];
  } catch {
    return [];
  }
}

export function saveVaultItem(item: VaultItem): void {
  const items = getVaultItems();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.unshift(item);
  }
  ensureInit().set(VAULT_ITEMS_KEY, JSON.stringify(items));
}

export function deleteVaultItem(id: string): void {
  const items = getVaultItems().filter(i => i.id !== id);
  ensureInit().set(VAULT_ITEMS_KEY, JSON.stringify(items));
}

const EMPTY_PLAN: SafetyPlanData = {
  escapeRoutes: '',
  documents: '',
  emergencyContacts: '',
  codeWord: '',
  safePlaces: '',
  finances: '',
  lastUpdated: 0,
};

export function getSafetyPlan(): SafetyPlanData {
  try {
    const raw = ensureInit().getString(SAFETY_PLAN_KEY);
    return raw ? (JSON.parse(raw) as SafetyPlanData) : { ...EMPTY_PLAN };
  } catch {
    return { ...EMPTY_PLAN };
  }
}

export function saveSafetyPlanSection(section: SafetyPlanSection, value: string): void {
  const plan = getSafetyPlan();
  plan[section] = value;
  plan.lastUpdated = Date.now();
  ensureInit().set(SAFETY_PLAN_KEY, JSON.stringify(plan));
}

export function clearVault(): void {
  ensureInit().clearAll();
}

export function makeVaultItemId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
