import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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
import {
  SectionLabel,
  HRule,
  ConditionChip,
} from '@components/Primitives';
import {
  ShieldIcon,
  TextBubbleIcon,
  WalletIcon,
  PhoneLockIcon,
} from '@components/Icons';
import { Colors } from '@theme/colors';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

interface AbuseType {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  examples: string;
}

const ABUSE_TYPES: AbuseType[] = [
  {
    id: 'physical',
    label: 'Physical',
    Icon: ShieldIcon,
    examples:
      'Hitting, pushing, blocking exits, physical restraint, destroying property, preventing medical care.',
  },
  {
    id: 'emotional',
    label: 'Emotional',
    Icon: TextBubbleIcon,
    examples:
      'Constant criticism, humiliation, isolation from friends and family, threats, controlling who you see or where you go.',
  },
  {
    id: 'financial',
    label: 'Financial',
    Icon: WalletIcon,
    examples:
      'Controlling access to money, preventing work or education, taking wages, ruining credit, making you account for every purchase.',
  },
  {
    id: 'digital',
    label: 'Digital',
    Icon: PhoneLockIcon,
    examples:
      'Monitoring accounts or messages, tracking location without consent, controlling devices, using technology to intimidate or harass.',
  },
];

const REFLECTION_QUESTIONS = [
  'Do you feel afraid to disagree with or disappoint your partner?',
  'Does your partner control where you go or who you see?',
  'Has your partner threatened you, your children, or your pets?',
  'Does your partner control money or prevent you from working?',
  'Does your partner monitor your phone or know your location at all times?',
  'Do you feel like you are "walking on eggshells" to avoid upsetting your partner?',
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

export default function UnderstandScreen() {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const anyChecked = checkedItems.size > 0;

  return (
    <View style={styles.root}>
      <MeshGradientBg />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EditorialHeader
            title={`Understanding\nwhat happened.`}
            subtitle="Information, not a diagnosis of your situation."
          />

          <AnimatedCard index={0}>
            <SectionLabel text="WHAT IS DOMESTIC VIOLENCE?" />
            <GlassCard style={styles.card}>
              <Text style={styles.bodyText}>
                Domestic violence is a pattern of behavior used to gain or maintain power and control over an intimate partner or family member. It can happen to anyone, of any gender, in any type of relationship.
              </Text>
              <Text style={[styles.bodyText, styles.bodyTextSpaced]}>
                It is not caused by anger, stress, or substance use. Those things do not cause abuse. Abuse is a choice.
              </Text>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={1}>
            <SectionLabel text="TYPES OF ABUSE" />
            <View style={styles.abuseGrid}>
              {ABUSE_TYPES.map((type, i) => (
                <Animated.View
                  key={type.id}
                  style={useAnimatedStyle(() => ({
                    transform: [
                      {
                        translateY: withDelay(
                          80 + i * 70,
                          withSpring(0, ENTRY_SPRING)
                        ),
                      },
                    ],
                    opacity: withDelay(
                      80 + i * 70,
                      withTiming(1, { duration: 260 })
                    ),
                  }))}
                >
                  <GlassCard style={styles.abuseCard}>
                    <View style={styles.abuseCardHeader}>
                      <View style={styles.iconWrap}>
                        <type.Icon size={18} color={Colors.purpleAnchor} />
                      </View>
                      <Text style={styles.abuseLabel}>{type.label}</Text>
                    </View>
                    <Text style={styles.abuseExamples}>{type.examples}</Text>
                  </GlassCard>
                </Animated.View>
              ))}
            </View>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={2}>
            <SectionLabel text="PATTERNS OF CONTROL" />
            <GlassCard style={styles.card}>
              <Text style={styles.bodyText}>
                Abusive relationships often follow recognizable patterns. Common tactics include isolation from support networks, minimizing or denying abusive behavior, using children or finances as leverage, and alternating between threatening behavior and affection.
              </Text>
              <Text style={[styles.bodyText, styles.bodyTextSpaced]}>
                These patterns were documented by advocates at the Duluth Domestic Abuse Intervention Project and are widely recognized in DV advocacy.
              </Text>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={3}>
            <SectionLabel text="SOME THINGS TO REFLECT ON" />
            <Text style={styles.reflectionNote}>
              These are general questions. They are not a diagnosis of your relationship.
            </Text>
            <View style={styles.chipGrid}>
              {REFLECTION_QUESTIONS.map((q, i) => (
                <ConditionChip
                  key={i}
                  text={q}
                  selected={checkedItems.has(i)}
                  onPress={() => toggleItem(i)}
                />
              ))}
            </View>
          </AnimatedCard>

          {anyChecked && (
            <AnimatedCard index={4}>
              <GlassCard style={[styles.card, styles.advocateCard]}>
                <Text style={styles.advocateTitle}>
                  Speaking with an advocate can help.
                </Text>
                <Text style={styles.advocateBody}>
                  You do not need to have it figured out. Advocates are trained to listen without judgment and help you understand your options.
                </Text>
                <View
                  style={styles.callRow}
                >
                  <Text
                    style={styles.callLink}
                    onPress={() => Linking.openURL('tel:18007997233')}
                  >
                    Call 1-800-799-7233
                  </Text>
                  <Text style={styles.callMuted}> (free, 24/7)</Text>
                </View>
              </GlassCard>
            </AnimatedCard>
          )}

          <HRule style={styles.hRule} />

          <AnimatedCard index={5}>
            <SectionLabel text="READY TO TAKE A STEP?" />
            <GlassCard style={styles.card}>
              <Text style={styles.bodyText}>
                Understanding what is happening is a step. There is no timeline for what comes next. When you are ready, a safety plan can help you think through your options.
              </Text>
            </GlassCard>
          </AnimatedCard>
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
  card: {
    padding: 16,
    marginBottom: 12,
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkPrimary,
    lineHeight: 22,
  },
  bodyTextSpaced: {
    marginTop: 12,
  },
  hRule: {
    marginVertical: 20,
  },
  abuseGrid: {
    gap: 10,
  },
  abuseCard: {
    padding: 14,
  },
  abuseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  abuseLabel: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 15,
    color: Colors.inkPrimary,
  },
  abuseExamples: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    lineHeight: 20,
  },
  reflectionNote: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    marginBottom: 12,
    lineHeight: 18,
  },
  chipGrid: {
    gap: 8,
  },
  advocateCard: {
    padding: 18,
    marginTop: 12,
    backgroundColor: 'rgba(74,20,140,0.04)',
  },
  advocateTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 15,
    color: Colors.inkPrimary,
    marginBottom: 8,
    lineHeight: 21,
  },
  advocateBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callLink: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: Colors.purpleAnchor,
    textDecorationLine: 'underline',
  },
  callMuted: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
  },
});
