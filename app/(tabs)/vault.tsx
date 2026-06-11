import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
  Pressable,
  AppState,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useScrollOffset } from '@components/ScrollContext';

import { GlassCard } from '@components/GlassCard';

import { SectionLabel, HRule } from '@components/Primitives';
import { LockIcon } from '@components/Icons';
import { VaultEntry } from '@components/VaultEntry';
import {
  initVault,
  getVaultItems,
  saveVaultItem,
  deleteVaultItem,
  getSafetyPlan,
  clearVault,
  makeVaultItemId,
  type VaultItem,
  type SafetyPlanData,
} from '@utils/vault';
import {
  authenticateAsync,
  isBiometricAvailable,
} from '@utils/biometric';
import { createMMKV } from 'react-native-mmkv';
import { useTheme } from '@theme/ThemeContext';

const flags = createMMKV({ id: 'sh-flags' });

type AuthState = 'loading' | 'locked' | 'unlocked' | 'unavailable';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

const PLAN_SECTIONS: { key: keyof Omit<SafetyPlanData, 'lastUpdated'>; label: string }[] = [
  { key: 'escapeRoutes', label: 'Safe escape routes' },
  { key: 'documents', label: 'Documents to grab' },
  { key: 'emergencyContacts', label: 'Emergency contacts' },
  { key: 'codeWord', label: 'Code word' },
  { key: 'safePlaces', label: 'Safe places' },
  { key: 'finances', label: 'Finances' },
];

function AnimatedItem({ index, children }: { index: number; children: React.ReactNode }) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  useEffect(() => {
    translateY.value = withDelay(index * 60, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 240 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

function PlanSummary({ plan, onEdit }: { plan: SafetyPlanData; onEdit: () => void }) {
  const { theme } = useTheme();
  const filled = PLAN_SECTIONS.filter(s => plan[s.key].trim().length > 0);

  return (
    <>
      {filled.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.muted }]}>No safety plan saved yet.</Text>
      ) : (
        <View style={styles.planRows}>
          {PLAN_SECTIONS.map(s => {
            const has = plan[s.key].trim().length > 0;
            return (
              <View key={s.key} style={styles.planRow}>
                <Text style={[styles.planDot, { color: has ? theme.accent : theme.rule }]}>
                  {has ? '●' : '○'}
                </Text>
                <Text style={[styles.planLabel, { color: has ? theme.text : theme.muted }]}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      <Pressable onPress={onEdit} style={[styles.editPlanBtn, { borderColor: theme.rule }]} accessibilityRole="button">
        <Text style={[styles.editPlanBtnText, { color: theme.text }]}>
          {filled.length > 0 ? 'Edit Safety Plan' : 'Build Safety Plan'}
        </Text>
      </Pressable>
    </>
  );
}

function AddNoteModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, body: string) => void;
}) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), body.trim());
    setTitle('');
    setBody('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Add note</Text>
          <TextInput
            style={[styles.modalInput, { color: theme.text, borderColor: theme.rule, backgroundColor: theme.background }]}
            placeholder="Title"
            placeholderTextColor={theme.faint}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={[styles.modalInput, styles.modalBodyInput, { color: theme.text, borderColor: theme.rule, backgroundColor: theme.background }]}
            placeholder="Note (optional)"
            placeholderTextColor={theme.faint}
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />
          <Pressable
            onPress={handleSave}
            style={[styles.modalBtn, { backgroundColor: title.trim() ? theme.accent : theme.rule }]}
            disabled={!title.trim()}
            accessibilityRole="button"
          >
            <Text style={styles.modalBtnText}>Save</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.modalCancel} accessibilityRole="button">
            <Text style={[styles.modalCancelText, { color: theme.muted }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function VaultScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [notes, setNotes] = useState<VaultItem[]>([]);
  const [plan, setPlan] = useState<SafetyPlanData | null>(null);
  const [planSaved, setPlanSaved] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  const scrollY = useScrollOffset();
  const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });

  const loadData = useCallback(() => {
    try {
      setNotes(getVaultItems());
      setPlan(getSafetyPlan());
      setPlanSaved(flags.getBoolean('sh_plan_saved') ?? false);
    } catch {
      // vault unavailable
    }
  }, []);

  const tryAuth = useCallback(async () => {
    try {
      await initVault();
      const available = await isBiometricAvailable();
      if (!available) {
        loadData();
        setAuthState('unavailable');
        return;
      }
      const result = await authenticateAsync();
      if (result.success) {
        loadData();
        setAuthState('unlocked');
      } else {
        setAuthState('locked');
      }
    } catch {
      setAuthState('unavailable');
    }
  }, [loadData]);

  useEffect(() => {
    tryAuth();
  }, [tryAuth]);

  // Re-lock when app goes to background
  useEffect(() => {
    if (authState !== 'unlocked') return;
    const sub = AppState.addEventListener('change', state => {
      if (state === 'background' || state === 'inactive') {
        setAuthState('locked');
      }
    });
    return () => sub.remove();
  }, [authState]);

  const handleAddNote = (title: string, body: string) => {
    const item: VaultItem = {
      id: makeVaultItemId(),
      type: 'note',
      title,
      body,
      createdAt: Date.now(),
    };
    try {
      saveVaultItem(item);
    } catch {
      // vault unavailable
    }
    setNotes(prev => [item, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    try {
      deleteVaultItem(id);
    } catch {
      // vault unavailable
    }
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert(
      'Remove all saved data from this device?',
      'This permanently removes your safety plan and all notes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Everything',
          style: 'destructive',
          onPress: () => {
            try { clearVault(); } catch { /* vault unavailable */ }
            router.replace('/');
          },
        },
      ]
    );
  };

  if (authState === 'loading') {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: theme.background }]} />
    );
  }

  if (authState === 'locked') {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SafeAreaView style={[styles.safe, styles.center]} edges={['top']}>
          <LockIcon size={48} color={theme.accent} />
          <Text style={[styles.lockTitle, { color: theme.text }]}>{'Your private\nnotes.'}</Text>
          <Text style={[styles.lockSub, { color: theme.muted }]}>Protected by Face ID or Touch ID.</Text>
          <Pressable onPress={tryAuth} style={[styles.unlockBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]} accessibilityRole="button">
            <Text style={styles.unlockBtnText}>Unlock</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.backLink} accessibilityRole="button">
            <Text style={[styles.backLinkText, { color: theme.muted }]}>Go back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Text style={[styles.headerTitle, { color: theme.text }]}>Private{'\n'}notes.</Text>
          <Text style={[styles.headerSub, { color: theme.muted }]}>Only visible on this device.</Text>

          {planSaved && (
            <AnimatedItem index={-1}>
              <GlassCard style={[styles.card, styles.planBanner]}>
                <Text style={[styles.planBannerText, { color: theme.accent }]}>
                  Your safety plan is saved here.
                </Text>
              </GlassCard>
            </AnimatedItem>
          )}

          <AnimatedItem index={0}>
            <SectionLabel text="SAFETY PLAN" />
            <GlassCard style={styles.card}>
              {plan && <PlanSummary plan={plan} onEdit={() => router.push('/plan')} />}
            </GlassCard>
          </AnimatedItem>

          <HRule style={styles.hRule} />

          <AnimatedItem index={1}>
            <SectionLabel text="NOTES" />
          </AnimatedItem>

          {notes.length === 0 && (
            <AnimatedItem index={2}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>No notes yet.</Text>
            </AnimatedItem>
          )}

          {notes.map((note, i) => (
            <VaultEntry
              key={note.id}
              item={note}
              index={i + 2}
              onDelete={handleDeleteNote}
            />
          ))}

          <AnimatedItem index={notes.length + 2}>
            <Pressable
              onPress={() => setShowAddNote(true)}
              style={[styles.addNoteBtn, { borderColor: theme.accent }]}
              accessibilityRole="button"
            >
              <Text style={[styles.addNoteBtnText, { color: theme.accent }]}>+ Add Note</Text>
            </Pressable>
          </AnimatedItem>

          <HRule style={styles.hRule} />

          <AnimatedItem index={notes.length + 3}>
            <Pressable onPress={handleClearAll} style={styles.clearBtn} accessibilityRole="button">
              <Text style={[styles.clearBtnText, { color: theme.muted }]}>Remove all saved data from this device</Text>
            </Pressable>
          </AnimatedItem>
        </Animated.ScrollView>
      </SafeAreaView>

      <AddNoteModal
        visible={showAddNote}
        onClose={() => setShowAddNote(false)}
        onSave={handleAddNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 130 },
  center: { alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Inter', fontWeight: '800', fontSize: 38, letterSpacing: -1.5, lineHeight: 44 },
  headerSub: { fontFamily: 'Inter', fontSize: 14, marginTop: 4, marginBottom: 24 },
  card: { padding: 16, marginBottom: 12 },
  planBanner: { marginBottom: 16 },
  planBannerText: { fontFamily: 'InterTight-ExtraBold', fontSize: 15, fontWeight: '800' },
  hRule: { marginVertical: 20 },
  lockTitle: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 34,
    letterSpacing: -1.3,
    lineHeight: 40,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  lockSub: { fontFamily: 'Inter', fontSize: 14, textAlign: 'center', marginBottom: 32, paddingHorizontal: 32 },
  unlockBtn: {
    borderRadius: 8,
    paddingHorizontal: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  unlockBtnText: { color: '#fff', fontFamily: 'Inter', fontWeight: '600', fontSize: 16 },
  backLink: { marginTop: 16, padding: 8 },
  backLinkText: { fontFamily: 'Inter', fontSize: 13, textDecorationLine: 'underline' },
  planRows: { gap: 8, marginBottom: 14 },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  planDot: { fontSize: 12, width: 14 },
  planLabel: { fontFamily: 'Inter', fontSize: 13 },
  editPlanBtn: { borderWidth: 1, borderRadius: 6, height: 40, alignItems: 'center', justifyContent: 'center' },
  editPlanBtnText: { fontFamily: 'Inter', fontWeight: '500', fontSize: 13 },
  emptyText: { fontFamily: 'Inter', fontSize: 13, marginBottom: 12 },
  addNoteBtn: { borderWidth: 1, borderRadius: 6, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  addNoteBtnText: { fontFamily: 'Inter', fontWeight: '600', fontSize: 14 },
  clearBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { fontFamily: 'Inter', fontSize: 12, textDecorationLine: 'underline' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontFamily: 'Inter', fontWeight: '700', fontSize: 20, marginBottom: 16 },
  modalInput: { fontFamily: 'Inter', fontSize: 14, borderWidth: 1, borderRadius: 6, padding: 12, marginBottom: 12 },
  modalBodyInput: { minHeight: 80, textAlignVertical: 'top' },
  modalBtn: { borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  modalBtnText: { color: '#fff', fontFamily: 'Inter', fontWeight: '600', fontSize: 15 },
  modalCancel: { height: 44, alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontFamily: 'Inter', fontSize: 14 },
});
