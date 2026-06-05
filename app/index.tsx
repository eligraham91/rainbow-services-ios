import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { GlassCard } from '@components/GlassCard';
import { SpringButton } from '@components/SpringButton';
import { SkeletonResourceList } from '@components/SkeletonShimmer';
import { C } from '@theme/colors';

export default function Index() {
  return (
    <View style={styles.root}>
      {/* Full-screen gyro-driven gradient background */}
      <MeshGradientBg />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Eyebrow */}
          <Text style={styles.eyebrow}>[ START HERE ]</Text>

          {/* Headline */}
          <Text style={styles.headline}>
            When you do not know{'\n'}what to do,{'\n'}start here.
          </Text>

          {/* Glass card demo */}
          <GlassCard style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Safe. Private. Free.</Text>
              <Text style={styles.cardBody}>
                No account required. Nothing saved by default.{'\n'}
                You stay in control.
              </Text>
            </View>
          </GlassCard>

          {/* Skeleton loader preview */}
          <Text style={styles.sectionLabel}>Loading resources…</Text>
          <SkeletonResourceList rows={3} />

          {/* Spring CTA */}
          <View style={styles.cta}>
            <SpringButton
              label="Begin privately"
              variant="primary"
              onPress={() => {}}
              accessibilityLabel="Begin using Start Here privately"
            />
            <SpringButton
              label="How this app protects privacy"
              variant="secondary"
              onPress={() => {}}
              style={styles.secondaryBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.creamBase,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  eyebrow: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: C.inkMuted,
    marginBottom: 14,
  },
  headline: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: C.inkPrimary,
    marginBottom: 24,
  },
  card: {
    marginBottom: 28,
    padding: 0,
  },
  cardInner: {
    padding: 18,
  },
  cardTitle: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 16,
    color: C.inkPrimary,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 19,
    color: C.inkMuted,
  },
  sectionLabel: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 0.12,
    textTransform: 'uppercase',
    color: C.inkMuted,
    marginBottom: 10,
  },
  cta: {
    marginTop: 'auto',
    paddingBottom: 12,
    gap: 10,
  },
  secondaryBtn: {
    width: '100%',
  },
});
