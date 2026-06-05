import React from 'react';
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
import { useRouter } from 'expo-router';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { GlassCard } from '@components/GlassCard';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { EditorialHeader } from '@components/ui/EditorialHeader';
import {
  SectionLabel,
  HRule,
  NextStepPanel,
} from '@components/Primitives';
import { PhoneIcon, FindHelpIcon } from '@components/Icons';
import { Colors } from '@theme/colors';

const ENTRY_SPRING = { mass: 1, stiffness: 180, damping: 20 } as const;

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

export default function SupportScreen() {
  const router = useRouter();

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
            title={`Helping someone\nyou care about.`}
            subtitle="What you say, and how you say it, matters."
          />

          <AnimatedCard index={0}>
            <SectionLabel text="WHAT HELPS" />
            <GlassCard style={styles.card}>
              <NextStepPanel number="1" title="Believe them">
                <Text style={styles.panelBody}>
                  Say it plainly: "I believe you. This is not your fault." Do not minimize, question, or ask why they stayed. Just listen.
                </Text>
              </NextStepPanel>
              <NextStepPanel number="2" title="Let them lead">
                <Text style={styles.panelBody}>
                  Ask what they need rather than telling them what to do. Their safety depends on decisions they control. Pressure to leave can put them in more danger, not less.
                </Text>
              </NextStepPanel>
              <NextStepPanel number="3" title="Stay connected">
                <Text style={styles.panelBody}>
                  Isolation is a control tactic. Checking in regularly, even with a simple text, matters. Do not disappear because the situation is complicated.
                </Text>
              </NextStepPanel>
              <NextStepPanel number="4" title="Share resources gently">
                <Text style={styles.panelBody}>
                  You can mention this app, the National DV Hotline, or local programs. Let them decide when they are ready to use them.
                </Text>
              </NextStepPanel>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={1}>
            <SectionLabel text="WHAT DOES NOT HELP" />
            <GlassCard style={styles.card}>
              <View style={styles.warningItem}>
                <Text style={styles.warningLabel}>Ultimatums</Text>
                <Text style={styles.warningBody}>
                  "Leave or I cannot support you" forces a choice that is not yours to force. Leaving is the most dangerous period. They know their situation better than you do.
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.warningItem}>
                <Text style={styles.warningLabel}>Confronting the abusive person</Text>
                <Text style={styles.warningBody}>
                  This almost always escalates risk for the person you are trying to help. It can also alert the abuser that they are being watched.
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.warningItem}>
                <Text style={styles.warningLabel}>Sharing their story without consent</Text>
                <Text style={styles.warningBody}>
                  Even with good intentions, sharing details with mutual friends, family, or on social media can destroy trust and create new dangers.
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.warningItem}>
                <Text style={styles.warningLabel}>Setting a timeline for leaving</Text>
                <Text style={styles.warningBody}>
                  "You need to leave by Friday" is not support. Safety planning takes time. The process belongs to them.
                </Text>
              </View>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={2}>
            <SectionLabel text="TAKING CARE OF YOURSELF" />
            <GlassCard style={styles.card}>
              <Text style={styles.bodyText}>
                Supporting someone in an abusive relationship is emotionally exhausting. Secondary trauma is real. You are allowed to have limits, take breaks, and seek support for yourself.
              </Text>
              <Text style={[styles.bodyText, styles.bodyTextSpaced]}>
                You cannot force someone to leave. Your role is to stay present and make sure they know support exists when they are ready.
              </Text>
            </GlassCard>
          </AnimatedCard>

          <HRule style={styles.hRule} />

          <AnimatedCard index={3}>
            <SectionLabel text="RESOURCES" />
            <GlassCard style={[styles.card, styles.resourceCard]}>
              <View style={styles.resourceRow}>
                <View style={styles.iconWrap}>
                  <PhoneIcon size={18} color={Colors.purpleAnchor} />
                </View>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceTitle}>National DV Hotline</Text>
                  <Text style={styles.resourceDesc}>
                    Advocates speak with supporters, family, and friends. You do not need to be a survivor to call.
                  </Text>
                  <Text
                    style={styles.callLink}
                    onPress={() => Linking.openURL('tel:18007997233')}
                  >
                    1-800-799-7233
                  </Text>
                </View>
              </View>
            </GlassCard>
            <GlassCard style={[styles.card, styles.resourceCard]}>
              <View style={styles.resourceRow}>
                <View style={styles.iconWrap}>
                  <FindHelpIcon size={18} color={Colors.purpleAnchor} />
                </View>
                <View style={styles.resourceBody}>
                  <Text style={styles.resourceTitle}>Find local programs</Text>
                  <Text style={styles.resourceDesc}>
                    Browse shelters, legal aid, counseling, and housing programs by location.
                  </Text>
                  <Text
                    style={styles.callLink}
                    onPress={() => router.push('/resources')}
                  >
                    Browse Resources
                  </Text>
                </View>
              </View>
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
  hRule: {
    marginVertical: 20,
  },
  panelBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
    lineHeight: 20,
  },
  warningItem: {
    paddingVertical: 12,
  },
  warningLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: Colors.inkPrimary,
    marginBottom: 4,
  },
  warningBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ruleLine,
    opacity: 0.5,
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
  resourceCard: {
    padding: 14,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
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
    fontSize: 14,
    color: Colors.inkPrimary,
    marginBottom: 3,
  },
  resourceDesc: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    lineHeight: 18,
    marginBottom: 6,
  },
  callLink: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 13,
    color: Colors.purpleAnchor,
    textDecorationLine: 'underline',
  },
});
