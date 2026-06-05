import React, { useState, useEffect, useMemo } from 'react';
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
import {
  PhoneIcon,
  HouseIcon,
  ShieldIcon,
  PeopleIcon,
  FindHelpIcon,
  AlertIcon,
} from '@components/Icons';
import { Colors } from '@theme/colors';
import {
  fetchResources,
  getAllResources,
  type Resource,
  type ResourceType,
} from '@utils/resourceSearch';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

const TYPE_FILTERS: { id: ResourceType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hotline', label: 'Hotlines' },
  { id: 'shelter', label: 'Shelter' },
  { id: 'housing', label: 'Housing' },
  { id: 'legal', label: 'Legal' },
  { id: 'counseling', label: 'Counseling' },
];

function typeIcon(type: ResourceType) {
  switch (type) {
    case 'hotline': return PhoneIcon;
    case 'shelter': return HouseIcon;
    case 'housing': return HouseIcon;
    case 'legal': return ShieldIcon;
    case 'counseling': return PeopleIcon;
    default: return FindHelpIcon;
  }
}

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 60, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 240 }));
  }, [resource.id]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const Icon = typeIcon(resource.type);

  return (
    <Animated.View style={style}>
      <GlassCard style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <View style={styles.iconWrap}>
            <Icon size={18} color={Colors.purpleAnchor} />
          </View>
          <View style={styles.resourceMeta}>
            <Text style={styles.resourceName}>{resource.name}</Text>
            {resource.national ? (
              <Text style={styles.resourceBadge}>NATIONAL</Text>
            ) : (
              <Text style={styles.resourceLocation}>
                {resource.city}, {resource.state}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.resourceDesc}>{resource.description}</Text>
        {resource.address && (
          <Text style={styles.resourceAddress}>{resource.address}</Text>
        )}
        {resource.languages.length > 0 && (
          <Text style={styles.resourceLangs}>
            Languages: {resource.languages.join(', ')}
          </Text>
        )}
        <Pressable
          onPress={() => Linking.openURL(`tel:${resource.phone}`)}
          style={styles.callBtn}
          accessibilityRole="button"
          accessibilityLabel={`Call ${resource.name}`}
        >
          <Text style={styles.callBtnText}>{resource.phoneDisplay}</Text>
        </Pressable>
      </GlassCard>
    </Animated.View>
  );
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ResourceType | 'all'>('all');
  const [activeState, setActiveState] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Derive unique state codes from non-national resources, sorted alphabetically
  const stateFilters = useMemo(() => {
    const all = getAllResources();
    const states = Array.from(
      new Set(all.filter(r => !r.national).map(r => r.state))
    ).sort();
    if (states.length <= 1) return [];
    return [{ id: 'all', label: 'All states' }, ...states.map(s => ({ id: s, label: s }))];
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchResources({ type: activeFilter, state: activeState, query }).then(results => {
      setResources(results);
      setLoading(false);
    });
  }, [query, activeFilter, activeState]);

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
            title={`Programs\nand services.`}
            subtitle="Free, confidential help. No account required."
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

          {/* Search */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, city, or state..."
              placeholderTextColor={Colors.inkMuted}
              value={query}
              onChangeText={setQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Type filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {TYPE_FILTERS.map(f => (
              <Pressable
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={[
                  styles.filterChip,
                  activeFilter === f.id && styles.filterChipActive,
                ]}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === f.id && styles.filterChipTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* State filters — only shown when there are resources from multiple states */}
          {stateFilters.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              style={styles.stateFilterRow}
            >
              {stateFilters.map(f => (
                <Pressable
                  key={f.id}
                  onPress={() => setActiveState(f.id)}
                  style={[
                    styles.filterChip,
                    activeState === f.id && styles.filterChipActive,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeState === f.id && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <HRule style={styles.hRule} />

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : resources.length === 0 ? (
            <Text style={styles.emptyText}>
              No results. Try a different search or filter.
            </Text>
          ) : (
            <>
              <SectionLabel
                text={`${resources.length} ${resources.length === 1 ? 'RESOURCE' : 'RESOURCES'}`}
              />
              {resources.map((r, i) => (
                <ResourceCard key={r.id} resource={r} index={i} />
              ))}
            </>
          )}

          <HRule style={styles.hRule} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Know of a resource that should be listed here? Contact Rainbow Services at{' '}
              <Text
                style={styles.footerLink}
                onPress={() => Linking.openURL('tel:3105479343')}
              >
                310-547-9343
              </Text>
              .
            </Text>
          </View>
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
  dangerLink: {
    fontWeight: '700',
    color: Colors.safetyRed,
  },
  searchRow: {
    marginBottom: 12,
  },
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
  },
  filterRow: {
    gap: 8,
    paddingBottom: 4,
  },
  stateFilterRow: {
    marginTop: 8,
  },
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
  filterChipTextActive: {
    color: '#fff',
  },
  hRule: { marginVertical: 20 },
  loadingText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    lineHeight: 20,
  },
  resourceCard: {
    padding: 14,
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(74,20,140,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resourceMeta: {
    flex: 1,
    gap: 3,
  },
  resourceName: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: Colors.inkPrimary,
    lineHeight: 19,
  },
  resourceBadge: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 0.8,
    color: Colors.purpleAnchor,
    textTransform: 'uppercase',
  },
  resourceLocation: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.inkMuted,
  },
  resourceDesc: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    lineHeight: 19,
    marginBottom: 8,
  },
  resourceAddress: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  resourceLangs: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.inkMuted,
    marginBottom: 10,
  },
  callBtn: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    marginBottom: 8,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    lineHeight: 18,
  },
  footerLink: {
    color: Colors.purpleAnchor,
    fontWeight: '500',
  },
});
