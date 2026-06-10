import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { QuickExitButton } from '@components/QuickExitButton';
import { GlassCard } from '@components/GlassCard';
import {
  SectionLabel,
  HRule,
  ConditionChip,
  NextStepPanel,
} from '@components/Primitives';
import { PhoneIcon, ShieldIcon, AlertIcon } from '@components/Icons';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';
import { CallSheet, type CallContact } from '@components/ui/CallSheet';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

const NATIONAL_HOTLINE: CallContact = {
  tag: '24/7 CRISIS LINE',
  name: 'National DV Hotline',
  number: '1-800-799-7233',
  dial: '18007997233',
  note: 'Free, confidential, 24/7. English and Spanish plus 200+ languages. Text START to 88788 if you cannot speak.',
};

const RS_HOTLINE: CallContact = {
  tag: 'LOCAL CRISIS LINE',
  name: 'Rainbow Services',
  number: '310-547-9343',
  dial: '3105479343',
  note: '24/7. English and Spanish. Call and say your language for other language support.',
};

interface TriageOption {
  id: string;
  label: string;
  step: string;
  title: string;
  body: string;
  cta?: { label: string; contact: CallContact };
}

const TRIAGE_OPTIONS: TriageOption[] = [
  {
    id: 'shelter',
    label: 'I need a safe place tonight',
    step: '1',
    title: 'Call a crisis hotline',
    body: 'A crisis advocate can help you find shelter availability near you right now. The National DV Hotline is available 24/7 and can connect you with local shelters.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
  {
    id: 'talk',
    label: 'I need someone to talk to',
    step: '2',
    title: 'You can call or text',
    body: 'The National DV Hotline connects you with trained advocates. You do not need to be in immediate danger to call. Text START to 88788 if you cannot talk out loud.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
  {
    id: 'legal',
    label: 'I need legal help',
    step: '3',
    title: 'Free legal support is available',
    body: 'Many DV programs have attorneys and advocates who help with restraining orders, custody, immigration relief, and more. Call the National Hotline to be connected with legal services in your area.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
  {
    id: 'children',
    label: 'I have children with me',
    step: '4',
    title: 'Children are welcome',
    body: 'DV shelters serve families. You can bring your children. Advocates can also help you with school enrollment, childcare, and custody documentation.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
  {
    id: 'pet',
    label: 'I have a pet',
    step: '5',
    title: 'Pet-friendly options exist',
    body: 'Many shelters now accept pets, and others have partnerships with pet boarding programs so you do not have to choose. Ask when you call.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
  {
    id: 'other',
    label: 'Something else',
    step: '6',
    title: 'Advocates are trained for this',
    body: 'Whatever is happening, crisis advocates have heard it before and will not judge your situation. You do not need to explain yourself to call.',
    cta: { label: 'Call 1-800-799-7233', contact: NATIONAL_HOTLINE },
  },
];

function AnimatedCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { reduceMotion } = useTraumaInformedMotion();
  const translateY = useSharedValue(reduceMotion ? 0 : 40);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  React.useEffect(() => {
    if (reduceMotion) return;
    translateY.value = withDelay(index * 80, withSpring(0, ENTRY_SPRING));
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 280 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function EmergencyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedTriage, setSelectedTriage] = useState<string | null>(null);
  const [activeContact, setActiveContact] = useState<CallContact | null>(null);

  const selected = TRIAGE_OPTIONS.find(o => o.id === selectedTriage);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Safety aside */}
          <View style={[styles.safetyAside, { borderLeftColor: theme.danger, backgroundColor: theme.dark ? 'rgba(229,115,115,0.08)' : 'rgba(198,40,40,0.04)' }]}>
            <AlertIcon size={18} color={theme.danger} />
            <Text style={[styles.safetyAsideText, { color: theme.text }]}>
              If you are in immediate danger, call 911.
            </Text>
          </View>

          <Pressable
            onPress={() => setActiveContact({ name: '911', number: '911', dial: '911', tag: 'EMERGENCY', danger: true })}
            style={({ pressed }) => [
              styles.call911Btn,
              { backgroundColor: theme.danger, shadowColor: theme.danger },
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Call 911 now"
          >
            <Text style={styles.call911Text}>CALL 911 NOW</Text>
          </Pressable>

          <HRule style={styles.hRule} />

          {/* National hotline */}
          <AnimatedCard index={0}>
            <SectionLabel text="24/7 CRISIS LINE" />
            <GlassCard style={styles.card}>
              <View style={styles.resourceRow}>
                <View style={[styles.iconWrap, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.07)' }]}>
                  <PhoneIcon size={20} color={theme.accent} />
                </View>
                <View style={styles.resourceBodyCol}>
                  <Text style={[styles.resourceTitle, { color: theme.text }]}>National DV Hotline</Text>
                  <Text style={[styles.resourceBody2, { color: theme.muted }]}>
                    Free, confidential, 24/7. English and Spanish plus 200+ languages with interpretation.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setActiveContact(NATIONAL_HOTLINE)}
                style={[styles.callBtn, { backgroundColor: theme.accent }]}
                accessibilityRole="button"
              >
                <Text style={styles.callBtnTextWhite}>Call 1-800-799-7233</Text>
              </Pressable>
              <View style={styles.altContact}>
                <Text style={[styles.altContactText, { color: theme.muted }]}>
                  Text only: text START to 88788
                </Text>
                <Text style={[styles.altContactText, { color: theme.muted }]}>
                  Chat: thehotline.org
                </Text>
              </View>
            </GlassCard>
          </AnimatedCard>

          <Text style={[styles.caveat, { color: theme.faint }]}>
            Calls and texts to hotlines are confidential. Mandatory reporting laws may require advocates to report certain situations.
          </Text>

          {/* Local crisis line */}
          <AnimatedCard index={1}>
            <GlassCard style={styles.card}>
              <View style={styles.resourceRow}>
                <View style={[styles.iconWrap, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.07)' }]}>
                  <PhoneIcon size={20} color={theme.muted} />
                </View>
                <View style={styles.resourceBodyCol}>
                  <Text style={[styles.resourceTitle, { color: theme.text }]}>
                    Local Line (Los Angeles/San Pedro)
                  </Text>
                  <Text style={[styles.resourceBody2, { color: theme.muted }]}>
                    Rainbow Services 24/7 crisis line. English and Spanish.
                    Other languages available.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setActiveContact(RS_HOTLINE)}
                style={[styles.callBtn, styles.callBtnOutline, { borderColor: theme.rule }]}
                accessibilityRole="button"
              >
                <Text style={[styles.callBtnText, { color: theme.text }]}>
                  Call 310-547-9343
                </Text>
              </Pressable>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          {/* Triage */}
          <AnimatedCard index={2}>
            <SectionLabel text="WHAT KIND OF HELP DO YOU NEED?" />
            <View style={styles.chipGrid}>
              {TRIAGE_OPTIONS.map(opt => (
                <ConditionChip
                  key={opt.id}
                  text={opt.label}
                  selected={selectedTriage === opt.id}
                  onPress={() =>
                    setSelectedTriage(prev => (prev === opt.id ? null : opt.id))
                  }
                />
              ))}
            </View>
          </AnimatedCard>

          {selected && (
            <AnimatedCard index={3}>
              <View style={styles.triageResult}>
                <NextStepPanel number={selected.step} title={selected.title} accent>
                  <Text style={[styles.triageBody, { color: theme.text }]}>{selected.body}</Text>
                  {selected.cta && (
                    <Pressable
                      onPress={() => setActiveContact(selected.cta!.contact)}
                      style={[styles.triageCta, { backgroundColor: theme.accent }]}
                      accessibilityRole="button"
                    >
                      <Text style={styles.callBtnTextWhite}>{selected.cta.label}</Text>
                    </Pressable>
                  )}
                </NextStepPanel>
              </View>
            </AnimatedCard>
          )}

          <HRule style={styles.hRule} />

          {/* Find shelters */}
          <AnimatedCard index={4}>
            <SectionLabel text="FIND LOCAL RESOURCES" />
            <GlassCard style={styles.card}>
              <View style={styles.resourceRow}>
                <View style={[styles.iconWrap, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.12)' : 'rgba(74,20,140,0.07)' }]}>
                  <ShieldIcon size={20} color={theme.accent} />
                </View>
                <View style={styles.resourceBodyCol}>
                  <Text style={[styles.resourceTitle, { color: theme.text }]}>
                    Programs and shelters near you
                  </Text>
                  <Text style={[styles.resourceBody2, { color: theme.muted }]}>
                    Search our resource directory for DV shelters, legal aid, counseling, and housing support.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push('/(tabs)/resources')}
                style={[styles.callBtn, styles.callBtnOutline, { borderColor: theme.rule }]}
                accessibilityRole="button"
              >
                <Text style={[styles.callBtnText, { color: theme.text }]}>
                  Browse Resources
                </Text>
              </Pressable>
            </GlassCard>
          </AnimatedCard>
        </ScrollView>
      </SafeAreaView>

      <QuickExitButton />
      <CallSheet contact={activeContact} onClose={() => setActiveContact(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 130,
    gap: 0,
  },
  safetyAside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 3,
    paddingLeft: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  safetyAsideText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  call911Btn: {
    borderRadius: 8,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  call911Text: {
    color: '#fff',
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  hRule: { marginVertical: 20 },
  card: { marginBottom: 12, padding: 16 },
  resourceRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceBodyCol: { flex: 1 },
  resourceTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 3,
    lineHeight: 20,
  },
  resourceBody2: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 17,
  },
  callBtn: {
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  callBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
  },
  callBtnTextWhite: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
  },
  altContact: { marginTop: 10, gap: 3 },
  altContactText: { fontFamily: 'Inter', fontSize: 12 },
  caveat: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.3,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  chipGrid: { gap: 8, marginBottom: 4 },
  triageResult: { marginTop: 12 },
  triageBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  triageCta: {
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
