import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
  Pressable,
  Linking,
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
import * as Clipboard from 'expo-clipboard';
import { useScrollOffset } from '@components/ScrollContext';

import { GlassCard } from '@components/GlassCard';

import { EditorialHeader } from '@components/ui/EditorialHeader';
import { SectionLabel, HRule } from '@components/Primitives';
import { AlertIcon, PhoneIcon, BookmarkIcon, CopyIcon, TrashIcon } from '@components/Icons';
import { CallSheet, type CallContact } from '@components/ui/CallSheet';
import { useTheme } from '@theme/ThemeContext';
import { fetchShelters, type ShelterMapProgram } from '@utils/resourceSearch';
import { SERVICE_FILTERS } from '@utils/shelterTypes';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

const NATIONAL_HOTLINE = {
  phone: '18007997233',
  phoneDisplay: '1-800-799-7233',
  note: 'Free, confidential, 24/7. Text START to 88788.',
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/** Plain-text copy format per architecture spec — no app name in header */
function buildCopyText(programs: ShelterMapProgram[]): string {
  return programs
    .map(p => {
      const name = toTitleCase(p.name);
      const addr = p.hasListedAddress && p.address
        ? `${p.address}, ${p.city}, ${p.state}${p.zip ? ' ' + p.zip : ''}`
        : `${p.city}, ${p.state}`;
      const phone = p.hotline ?? p.phone;
      const lines = [name, addr];
      if (phone) lines.push(phone);
      lines.push('[Call to verify availability and safe intake process before visiting]');
      return lines.join('\n');
    })
    .join('\n\n');
}

function ShelterCard({
  program,
  index,
  saved,
  onToggleSave,
  onCall,
}: {
  program: ShelterMapProgram;
  index: number;
  saved: boolean;
  onToggleSave: (p: ShelterMapProgram) => void;
  onCall: (contact: CallContact) => void;
}) {
  const { theme } = useTheme();
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 40, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(index * 40, withTiming(1, { duration: 220 }));
  }, [program.id]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const accentTint = theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.06)';
  const displayName = toTitleCase(program.name);
  const callPhone = program.hotline ?? program.phone;
  const callPhoneDisplay = program.hotline
    ? `Hotline: ${program.hotline}`
    : program.phone ?? null;
  const addressLine = program.hasListedAddress && program.address
    ? `${program.address}, ${program.city}, ${program.state}${program.zip ? ' ' + program.zip : ''}`
    : `${program.city}, ${program.state}`;

  return (
    <Animated.View style={animStyle}>
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            {program.isBroadAreaRecord && (
              <View style={[styles.broadBadge, { backgroundColor: accentTint }]}>
                <Text style={[styles.broadBadgeText, { color: theme.accent }]}>STATEWIDE</Text>
              </View>
            )}
            <Text style={[styles.cardName, { color: theme.text }]}>{displayName}</Text>
            <View style={styles.cardMetaRow}>
              <Text style={[styles.cardLocation, { color: theme.muted }]}>{addressLine}</Text>
              {program._distMiles != null && (
                <Text style={[styles.distBadge, { color: theme.accent, backgroundColor: accentTint }]}>
                  {program._distMiles} mi
                </Text>
              )}
            </View>
          </View>
          <Pressable
            onPress={() => onToggleSave(program)}
            style={styles.saveBtn}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved list' : 'Save to list'}
          >
            <BookmarkIcon size={18} color={saved ? theme.accent : theme.muted} filled={saved} />
          </Pressable>
        </View>

        {program.services.length > 0 && (
          <View style={styles.serviceRow}>
            {program.services.slice(0, 4).map(s => (
              <View key={s} style={[styles.serviceChip, { backgroundColor: accentTint }]}>
                <Text style={[styles.serviceChipText, { color: theme.accent }]}>
                  {SERVICE_FILTERS.find(f => f.id === s)?.label ?? s}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.callNote, { color: theme.muted }]}>Call to verify availability and intake process before visiting.</Text>

        {callPhone ? (
          <Pressable
            onPress={() =>
              onCall({
                tag: program.hotline ? 'PROGRAM HOTLINE' : 'PROGRAM LINE',
                name: displayName,
                number: callPhone,
                dial: callPhone.replace(/\D/g, ''),
                note: 'Call to verify availability and intake process before visiting.',
              })
            }
            style={[styles.callBtn, { backgroundColor: theme.accent }]}
            accessibilityRole="button"
            accessibilityLabel={`Call ${displayName}`}
          >
            <PhoneIcon size={14} color="#fff" />
            <Text style={styles.callBtnText}>{callPhoneDisplay}</Text>
          </Pressable>
        ) : program.website ? (
          <Pressable
            onPress={() => Linking.openURL(program.website!)}
            style={[styles.webBtn, { borderColor: theme.accent }]}
            accessibilityRole="link"
          >
            <Text style={[styles.webBtnText, { color: theme.accent }]}>Visit website</Text>
          </Pressable>
        ) : null}
      </GlassCard>
    </Animated.View>
  );
}

function SafeListModal({
  visible,
  saved,
  onRemove,
  onClose,
}: {
  visible: boolean;
  saved: ShelterMapProgram[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const accentTint = theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.06)';

  const handleCopy = async () => {
    if (saved.length === 0) return;
    await Clipboard.setStringAsync(buildCopyText(saved));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <SafeAreaView style={[styles.modalSheet, { backgroundColor: theme.surface }]} edges={['bottom']}>
          <View style={[styles.modalHandle, { backgroundColor: theme.rule }]} />

          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Saved programs</Text>
            <Pressable onPress={onClose} style={styles.modalCloseBtn} accessibilityRole="button">
              <Text style={[styles.modalCloseTxt, { color: theme.accent }]}>Done</Text>
            </Pressable>
          </View>

          {saved.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={[styles.modalEmptyText, { color: theme.muted }]}>
                Tap the bookmark on any program to save it here. Saved programs are cleared when you leave this screen.
              </Text>
            </View>
          ) : (
            <>
              <Pressable
                onPress={handleCopy}
                style={[styles.copyBtn, { backgroundColor: accentTint }]}
                accessibilityRole="button"
              >
                <CopyIcon size={15} color={copied ? theme.muted : theme.accent} />
                <Text style={[styles.copyBtnText, { color: copied ? theme.muted : theme.accent }]}>
                  {copied ? 'Copied to clipboard' : 'Copy all to clipboard'}
                </Text>
              </Pressable>
              <Text style={[styles.copyNote, { color: theme.muted }]}>
                Plain text. Safe to paste into a message or notes app.
              </Text>

              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                {saved.map(p => (
                  <View key={p.id} style={[styles.savedRow, { borderBottomColor: theme.rule }]}>
                    <View style={styles.savedRowLeft}>
                      <Text style={[styles.savedName, { color: theme.text }]}>{toTitleCase(p.name)}</Text>
                      <Text style={[styles.savedLocation, { color: theme.muted }]}>
                        {p.city}, {p.state}
                        {p._distMiles != null ? ` · ${p._distMiles} mi` : ''}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        Alert.alert('Remove?', toTitleCase(p.name), [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Remove', style: 'destructive', onPress: () => onRemove(p.id) },
                        ])
                      }
                      style={styles.savedRemoveBtn}
                      accessibilityLabel="Remove from saved list"
                    >
                      <TrashIcon size={15} color={theme.muted} />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function ResourcesScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [records, setRecords] = useState<ShelterMapProgram[]>([]);
  const [statusLabel, setStatusLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedPrograms, setSavedPrograms] = useState<ShelterMapProgram[]>([]);
  const [showSafeList, setShowSafeList] = useState(false);
  const [call, setCall] = useState<CallContact | null>(null);

  const scrollY = useScrollOffset();
  const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });

  const accentTint = theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.05)';
  const dangerTint = theme.dark ? 'rgba(229,115,115,0.08)' : 'rgba(198,40,40,0.04)';

  const runSearch = useCallback((q: string, svcs: string[]) => {
    setLoading(true);
    fetchShelters({ query: q, services: svcs }).then(res => {
      setRecords(res.records);
      setStatusLabel(res.statusLabel);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    runSearch(query, activeServices);
  }, [query, activeServices]);

  const toggleService = (id: string) => {
    setActiveServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSave = (program: ShelterMapProgram) => {
    setSavedPrograms(prev => {
      const exists = prev.some(p => p.id === program.id);
      return exists ? prev.filter(p => p.id !== program.id) : [...prev, program];
    });
  };

  const removeSaved = (id: string) => {
    setSavedPrograms(prev => prev.filter(p => p.id !== id));
  };

  const savedIds = new Set(savedPrograms.map(p => p.id));

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <EditorialHeader
            title={`Find\nhelp near\nyou.`}
            subtitle="3,681 programs across all 50 states."
          />

          {/* Immediate danger */}
          <View style={[styles.dangerBanner, { borderLeftColor: theme.danger, backgroundColor: dangerTint }]}>
            <AlertIcon size={16} color={theme.danger} />
            <Text style={[styles.dangerText, { color: theme.text }]}>
              In immediate danger?{' '}
              <Text style={[styles.dangerLink, { color: theme.danger }]} onPress={() => Linking.openURL('tel:911')}>
                CALL 911 NOW
              </Text>
            </Text>
          </View>

          {/* National DV Hotline — always pinned */}
          <GlassCard style={[styles.hotlineCard, { borderLeftColor: theme.accent }]}>
            <Text style={[styles.hotlineLabel, { color: theme.muted }]}>NATIONAL HOTLINE · 24/7 · FREE</Text>
            <Pressable
              onPress={() =>
                setCall({
                  tag: 'NATIONAL HOTLINE · 24/7 · FREE',
                  name: 'National DV Hotline',
                  number: NATIONAL_HOTLINE.phoneDisplay,
                  dial: NATIONAL_HOTLINE.phone,
                  note: NATIONAL_HOTLINE.note,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Call National Domestic Violence Hotline"
            >
              <Text style={[styles.hotlineNumber, { color: theme.accent }]}>{NATIONAL_HOTLINE.phoneDisplay}</Text>
            </Pressable>
            <Text style={[styles.hotlineNote, { color: theme.muted }]}>{NATIONAL_HOTLINE.note}</Text>
          </GlassCard>

          <HRule style={styles.hRule} />

          {/* Search */}
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.rule, color: theme.text }]}
            placeholder="ZIP code, city, or state..."
            placeholderTextColor={theme.faint}
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {/* Service filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            style={styles.filterScroll}
          >
            {SERVICE_FILTERS.map(f => {
              const active = activeServices.includes(f.id);
              return (
                <Pressable
                  key={f.id}
                  onPress={() => toggleService(f.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active ? theme.accent : theme.surface,
                      borderColor: active ? theme.accent : theme.rule,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.filterChipText, { color: active ? '#fff' : theme.muted }]}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <HRule style={styles.hRule} />

          {loading ? (
            <Text style={[styles.statusText, { color: theme.muted }]}>Searching...</Text>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <SectionLabel text={statusLabel.toUpperCase()} />
                <Pressable
                  onPress={() => setShowSafeList(true)}
                  style={[
                    styles.savedPill,
                    {
                      borderColor: savedPrograms.length > 0 ? theme.accent : theme.rule,
                      backgroundColor: savedPrograms.length > 0 ? accentTint : theme.surface,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Saved programs: ${savedPrograms.length}`}
                >
                  <BookmarkIcon
                    size={13}
                    color={savedPrograms.length > 0 ? theme.accent : theme.muted}
                    filled={savedPrograms.length > 0}
                  />
                  <Text style={[styles.savedPillText, { color: savedPrograms.length > 0 ? theme.accent : theme.muted }]}>
                    {savedPrograms.length > 0 ? `Saved (${savedPrograms.length})` : 'Saved'}
                  </Text>
                </Pressable>
              </View>

              {records.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Try a ZIP code (e.g. 90731), city and state (e.g. Los Angeles, CA), or state name.
                </Text>
              ) : (
                records.map((r, i) => (
                  <ShelterCard
                    key={r.id}
                    program={r}
                    index={i}
                    saved={savedIds.has(r.id)}
                    onToggleSave={toggleSave}
                    onCall={setCall}
                  />
                ))
              )}
            </>
          )}

          <HRule style={styles.hRule} />

          <Text style={[styles.dataNote, { color: theme.muted }]}>
            Listed addresses are public records from FVPSA federal grants and state coalition directories. Confidential shelter locations are never shown. Call to verify availability and intake process before visiting.
          </Text>
        </Animated.ScrollView>
      </SafeAreaView>

      <SafeListModal
        visible={showSafeList}
        saved={savedPrograms}
        onRemove={removeSaved}
        onClose={() => setShowSafeList(false)}
      />

      <CallSheet contact={call} onClose={() => setCall(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 130 },

  dangerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  dangerText: { fontFamily: 'Inter', fontSize: 13, flex: 1, lineHeight: 19 },
  dangerLink: { fontWeight: '700' },

  hotlineCard: { padding: 16, marginBottom: 0, borderLeftWidth: 3 },
  hotlineLabel: { fontFamily: 'Inter', fontWeight: '600', fontSize: 9, letterSpacing: 1.3, marginBottom: 6 },
  hotlineNumber: { fontFamily: 'Inter', fontWeight: '800', fontSize: 26, letterSpacing: -1, marginBottom: 4, textDecorationLine: 'underline' },
  hotlineNote: { fontFamily: 'Inter', fontSize: 12, lineHeight: 18 },

  hRule: { marginVertical: 20 },

  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'Inter',
    fontSize: 14,
    height: 44,
    marginBottom: 12,
  },

  filterScroll: { marginBottom: 0 },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 999,
  },
  filterChipText: { fontFamily: 'Inter', fontWeight: '500', fontSize: 12 },

  statusText: { fontFamily: 'Inter', fontSize: 13 },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  savedPillText: { fontFamily: 'Inter', fontWeight: '500', fontSize: 11 },

  emptyText: { fontFamily: 'Inter', fontSize: 13, lineHeight: 21 },

  card: { padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  cardHeaderLeft: { flex: 1 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardName: { fontFamily: 'Inter', fontWeight: '600', fontSize: 14, lineHeight: 19, marginBottom: 3 },
  cardLocation: { fontFamily: 'Inter', fontSize: 12 },
  distBadge: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveBtn: { padding: 4 },
  broadBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
  },
  broadBadgeText: { fontFamily: 'Inter', fontWeight: '600', fontSize: 9, letterSpacing: 0.8 },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  serviceChip: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  serviceChipText: { fontFamily: 'Inter', fontSize: 10, fontWeight: '500', letterSpacing: 0.2 },
  callNote: { fontFamily: 'Inter', fontSize: 11, lineHeight: 16, marginBottom: 10, fontStyle: 'italic' },
  callBtn: {
    borderRadius: 6,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnText: { color: '#fff', fontFamily: 'Inter', fontWeight: '600', fontSize: 13 },
  webBtn: { borderWidth: 1, borderRadius: 6, height: 40, alignItems: 'center', justifyContent: 'center' },
  webBtnText: { fontFamily: 'Inter', fontWeight: '500', fontSize: 13 },

  dataNote: { fontFamily: 'Inter', fontSize: 11, lineHeight: 18, textAlign: 'center', paddingHorizontal: 8, marginBottom: 8 },

  // Safe List modal
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 8,
    maxHeight: '75%',
  },
  modalHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontFamily: 'Inter', fontWeight: '700', fontSize: 18 },
  modalCloseBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  modalCloseTxt: { fontFamily: 'Inter', fontWeight: '500', fontSize: 14 },
  modalEmpty: { paddingVertical: 24, alignItems: 'center' },
  modalEmptyText: { fontFamily: 'Inter', fontSize: 13, lineHeight: 20, textAlign: 'center' },

  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 6,
  },
  copyBtnText: { fontFamily: 'Inter', fontWeight: '600', fontSize: 14 },
  copyNote: { fontFamily: 'Inter', fontSize: 11, marginBottom: 16 },

  modalList: { flex: 1 },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  savedRowLeft: { flex: 1 },
  savedName: { fontFamily: 'Inter', fontWeight: '600', fontSize: 13, lineHeight: 18 },
  savedLocation: { fontFamily: 'Inter', fontSize: 11, marginTop: 2 },
  savedRemoveBtn: { padding: 6 },
});
