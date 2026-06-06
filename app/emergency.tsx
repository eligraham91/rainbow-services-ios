import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
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
import { Colors } from '@theme/colors';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

interface TriageOption {
  id: string;
  label: string;
  step: string;
  title: string;
  body: string;
  cta?: { label: string; tel: string };
}

const TRIAGE_OPTIONS: TriageOption[] = [
  {
    id: 'shelter',
    label: 'I need a safe place tonight',
    step: '1',
    title: 'Call a crisis hotline',
    body: 'A crisis advocate can help you find shelter availability near you right now. The National DV Hotline is available 24/7 and can connect you with local shelters.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
  {
    id: 'talk',
    label: 'I need someone to talk to',
    step: '2',
    title: 'You can call or text',
    body: 'The National DV Hotline connects you with trained advocates. You do not need to be in immediate danger to call. Text START to 88788 if you cannot talk out loud.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
  {
    id: 'legal',
    label: 'I need legal help',
    step: '3',
    title: 'Free legal support is available',
    body: 'Many DV programs have attorneys and advocates who help with restraining orders, custody, immigration relief, and more. Call the National Hotline to be connected with legal services in your area.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
  {
    id: 'children',
    label: 'I have children with me',
    step: '4',
    title: 'Children are welcome',
    body: 'DV shelters serve families. You can bring your children. Advocates can also help you with school enrollment, childcare, and custody documentation.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
  {
    id: 'pet',
    label: 'I have a pet',
    step: '5',
    title: 'Pet-friendly options exist',
    body: 'Many shelters now accept pets, and others have partnerships with pet boarding programs so you do not have to choose. Ask when you call.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
  {
    id: 'other',
    label: 'Something else',
    step: '6',
    title: 'Advocates are trained for this',
    body: 'Whatever is happening, crisis advocates have heard it before and will not judge your situation. You do not need to explain yourself to call.',
    cta: { label: 'Call 1-800-799-7233', tel: '18007997233' },
  },
];

function AnimatedCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);
  React.useEffect(() => {
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
  const [selectedTriage, setSelectedTriage] = useState<string | null>(null);

  const selected = TRIAGE_OPTIONS.find(o => o.id === selectedTriage);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Safety aside */}
          <View style={styles.safetyAside}>
            <AlertIcon size={18} color={Colors.safetyRed} />
            <Text style={styles.safetyAsideText}>
              If you are in immediate danger, call 911.
            </Text>
          </View>

          <Pressable
            onPress={() => Linking.openURL('tel:911')}
            style={({ pressed }) => [styles.call911Btn, pressed && styles.call911BtnPressed]}
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
                <View style={styles.iconWrap}>
                  <PhoneIcon size={20} color={Colors.purpleAnchor} />
                </View>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceTitle}>National DV Hotline</Text>
                  <Text style={styles.resourceBody2}>
                    Free, confidential, 24/7. English and Spanish plus 200+ languages with interpretation.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => Linking.openURL('tel:18007997233')}
                style={styles.callBtn}
                accessibilityRole="button"
              >
                <Text style={styles.callBtnText}>Call 1-800-799-7233</Text>
              </Pressable>
              <View style={styles.altContact}>
                <Text style={styles.altContactText}>
                  Text only: text START to 88788
                </Text>
                <Text style={styles.altContactText}>
                  Chat: thehotline.org
                </Text>
              </View>
            </GlassCard>
          </AnimatedCard>

          {/* Local crisis line */}
          <AnimatedCard index={1}>
            <GlassCard style={styles.card}>
              <View style={styles.resourceRow}>
                <View style={styles.iconWrap}>
                  <PhoneIcon size={20} color={Colors.inkMuted} />
                </View>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceTitle}>
                    Local Line (Los Angeles/San Pedro)
                  </Text>
                  <Text style={styles.resourceBody2}>
                    Rainbow Services 24/7 crisis line. English and Spanish.
                    Other languages available.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => Linking.openURL('tel:3105479343')}
                style={[styles.callBtn, styles.callBtnSecondary]}
                accessibilityRole="button"
              >
                <Text style={[styles.callBtnText, styles.callBtnTextSecondary]}>
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
                  <Text style={styles.triageBody}>{selected.body}</Text>
                  {selected.cta && (
                    <Pressable
                      onPress={() =>
                        Linking.openURL(`tel:${selected.cta!.tel}`)
                      }
                      style={styles.triageCta}
                      accessibilityRole="button"
                    >
                      <Text style={styles.triagedCtaText}>{selected.cta.label}</Text>
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
                <View style={styles.iconWrap}>
                  <ShieldIcon size={20} color={Colors.purpleAnchor} />
                </View>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceTitle}>
                    Programs and shelters near you
                  </Text>
                  <Text style={styles.resourceBody2}>
                    Search our resource directory for DV shelters, legal aid, counseling, and housing support.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push('/resources')}
                style={[styles.callBtn, styles.callBtnSecondary]}
                accessibilityRole="button"
              >
                <Text style={[styles.callBtnText, styles.callBtnTextSecondary]}>
                  Browse Resources
                </Text>
              </Pressable>
            </GlassCard>
          </AnimatedCard>
        </ScrollView>
      </SafeAreaView>
      <QuickExitButton />
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
    gap: 0,
  },
  safetyAside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.safetyRed,
    paddingLeft: 14,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: 'rgba(198,40,40,0.04)',
    borderRadius: 4,
  },
  safetyAsideText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.inkPrimary,
    flex: 1,
    lineHeight: 20,
  },
  call911Btn: {
    backgroundColor: Colors.safetyRed,
    borderRadius: 8,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.safetyRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  call911BtnPressed: {
    backgroundColor: '#A31E1E',
  },
  call911Text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  hRule: {
    marginVertical: 20,
  },
  card: {
    marginBottom: 12,
    padding: 16,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(74,20,140,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceBody: {
    flex: 1,
  },
  resourceTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    color: Colors.inkPrimary,
    marginBottom: 3,
    lineHeight: 20,
  },
  resourceBody2: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    lineHeight: 17,
  },
  callBtn: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.ruleLine,
  },
  callBtnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
  },
  callBtnTextSecondary: {
    color: Colors.inkPrimary,
  },
  altContact: {
    marginTop: 10,
    gap: 3,
  },
  altContactText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
  },
  chipGrid: {
    gap: 8,
    marginBottom: 4,
  },
  triageResult: {
    marginTop: 12,
  },
  triageBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
    lineHeight: 19,
    marginBottom: 12,
  },
  triageCta: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triagedCtaText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 13,
  },
});
