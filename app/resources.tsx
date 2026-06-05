import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { GlassCard } from '@components/GlassCard';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { EditorialHeader } from '@components/ui/EditorialHeader';
import { SectionLabel, HRule } from '@components/Primitives';
import { AlertIcon, PhoneIcon } from '@components/Icons';
import { Colors } from '@theme/colors';
import { fetchShelters, type ShelterMapProgram } from '@utils/resourceSearch';
import { SERVICE_FILTERS } from '@utils/shelterTypes';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

// National DV Hotline — always pinned, never data-driven
const NATIONAL_HOTLINE = {
  name: 'National Domestic Violence Hotline',
  phone: '18007997233',
  phoneDisplay: '1-800-799-7233',
  note: 'Free, confidential, 24/7. Text START to 88788.',
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function ShelterCard({ program, index }: { program: ShelterMapProgram; index: number }) {
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

  const displayName = toTitleCase(program.name);
  const callPhone = program.hotline ?? program.phone;
  const callPhoneDisplay = program.hotline
    ? `Hotline: ${program.hotline}`
    : program.phone ?? null;

  // Address display respects precision tiers
  const addressLine = program.hasListedAddress && program.address
    ? `${program.address}, ${program.city}, ${program.state}${program.zip ? ' ' + program.zip : ''}`
    : `${program.city}, ${program.state}`;

  const isBroad = program.isBroadAreaRecord;

  return (
    <Animated.View style={animStyle}>
      <GlassCard style={styles.card}>
        {isBroad && (
          <View style={styles.broadBadge}>
            <Text style={styles.broadBadgeText}>STATEWIDE</Text>
          </View>
        )}

        <Text style={styles.cardName}>{displayName}</Text>
        <Text style={styles.cardLocation}>{addressLine}</Text>

        {program.services.length > 0 && (
          <View style={styles.serviceRow}>
            {program.services.slice(0, 4).map(s => (
              <View key={s} style={styles.serviceChip}>
                <Text style={styles.serviceChipText}>
                  {SERVICE_FILTERS.find(f => f.id === s)?.label ?? s}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.callNote}>Call to verify availability and intake process before visiting.</Text>

        {callPhone ? (
          <Pressable
            onPress={() => Linking.openURL(`tel:${callPhone.replace(/\D/g, '')}`)}
            style={styles.callBtn}
            accessibilityRole="button"
            accessibilityLabel={`Call ${displayName}`}
          >
            <PhoneIcon size={14} color="#fff" />
            <Text style={styles.callBtnText}>{callPhoneDisplay}</Text>
          </Pressable>
        ) : program.website ? (
          <Pressable
            onPress={() => Linking.openURL(program.website!)}
            style={styles.webBtn}
            accessibilityRole="link"
          >
            <Text style={styles.webBtnText}>Visit website</Text>
          </Pressable>
        ) : null}
      </GlassCard>
    </Animated.View>
  );
}

export default function ResourcesScreen() {
  const [query, setQuery] = useState('');
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [records, setRecords] = useState<ShelterMapProgram[]>([]);
  const [statusLabel, setStatusLabel] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.root}>
      <MeshGradientBg />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <EditorialHeader
            title={`Find\nhelp near\nyou.`}
            subtitle="3,681 programs across all 50 states."
          />

          {/* Immediate danger banner */}
          <View style={styles.dangerBanner}>
            <AlertIcon size={16} color={Colors.safetyRed} />
            <Text style={styles.dangerText}>
              In immediate danger?{' '}
              <Text
                style={styles.dangerLink}
                onPress={() => Linking.openURL('tel:911')}
              >
                CALL 911 NOW
              </Text>
            </Text>
          </View>

          {/* National DV Hotline — always pinned */}
          <GlassCard style={styles.hotlineCard}>
            <Text style={styles.hotlineLabel}>NATIONAL HOTLINE · 24/7 · FREE</Text>
            <Pressable
              onPress={() => Linking.openURL(`tel:${NATIONAL_HOTLINE.phone}`)}
              accessibilityRole="button"
              accessibilityLabel="Call National Domestic Violence Hotline"
            >
              <Text style={styles.hotlineNumber}>{NATIONAL_HOTLINE.phoneDisplay}</Text>
            </Pressable>
            <Text style={styles.hotlineNote}>{NATIONAL_HOTLINE.note}</Text>
          </GlassCard>

          <HRule style={styles.hRule} />

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="ZIP code, city, or state..."
            placeholderTextColor={Colors.inkMuted}
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
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <HRule style={styles.hRule} />

          {loading ? (
            <Text style={styles.statusText}>Searching...</Text>
          ) : (
            <>
              <SectionLabel text={statusLabel.toUpperCase()} />
              {records.length === 0 ? (
                <Text style={styles.emptyText}>
                  Try searching by ZIP code (e.g. 90731), city and state (e.g. Los Angeles, CA), or state name.
                </Text>
              ) : (
                records.map((r, i) => (
                  <ShelterCard key={r.id} program={r} index={i} />
                ))
              )}
            </>
          )}

          <HRule style={styles.hRule} />

          <Text style={styles.dataNote}>
            Listed addresses are public records from FVPSA federal grants and state coalition directories. Confidential shelter locations are never shown. Call to verify availability and intake process before visiting.
          </Text>
        </ScrollView>
      </SafeAreaView>
      <FloatingCommandPill />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamBase },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 130,
  },
  dangerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.safetyRed,
    paddingLeft: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: 'rgba(198,40,40,0.04)',
    borderRadius: 4,
  },
  dangerText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
    flex: 1,
    lineHeight: 19,
  },
  dangerLink: { fontWeight: '700', color: Colors.safetyRed },
  hotlineCard: {
    padding: 16,
    marginBottom: 0,
    borderLeftWidth: 3,
    borderLeftColor: Colors.purpleAnchor,
  },
  hotlineLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 1.3,
    color: Colors.inkMuted,
    marginBottom: 6,
  },
  hotlineNumber: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 26,
    color: Colors.purpleAnchor,
    letterSpacing: -1,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  hotlineNote: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    lineHeight: 18,
  },
  hRule: { marginVertical: 20 },
  searchInput: {
    backgroundColor: Colors.creamCard,
    borderWidth: 1,
    borderColor: Colors.ruleLine,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkPrimary,
    height: 44,
    marginBottom: 12,
  },
  filterScroll: { marginBottom: 0 },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.creamCard,
    borderWidth: 1,
    borderColor: Colors.ruleLine,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: Colors.purpleAnchor,
    borderColor: Colors.purpleAnchor,
  },
  filterChipText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    color: Colors.inkMuted,
  },
  filterChipTextActive: { color: '#fff' },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    lineHeight: 21,
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  broadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74,20,140,0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 8,
  },
  broadBadgeText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 0.8,
    color: Colors.purpleAnchor,
  },
  cardName: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: Colors.inkPrimary,
    lineHeight: 19,
    marginBottom: 3,
  },
  cardLocation: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  serviceChip: {
    backgroundColor: 'rgba(74,20,140,0.06)',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  serviceChipText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    color: Colors.purpleAnchor,
    letterSpacing: 0.2,
  },
  callNote: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.inkMuted,
    lineHeight: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  callBtn: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 6,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 13,
  },
  webBtn: {
    borderWidth: 1,
    borderColor: Colors.purpleAnchor,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webBtnText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 13,
    color: Colors.purpleAnchor,
  },
  dataNote: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.inkMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
});
