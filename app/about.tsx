import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { GlassCard } from '@components/GlassCard';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { HRule } from '@components/Primitives';
import { Colors } from '@theme/colors';

export default function AboutScreen() {
  return (
    <View style={styles.root}>
      <MeshGradientBg />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.wordmark}>Start Here</Text>
          <Text style={styles.tagline}>
            A national domestic violence support tool.
          </Text>

          <HRule style={styles.hRule} />

          <GlassCard style={styles.card}>
            <Text style={styles.attrLabel}>BUILT BY</Text>
            <Text style={styles.attrValue}>Rainbow Services</Text>
            <Text style={styles.attrBody}>
              Rainbow Services is a domestic violence shelter and advocacy organization in San Pedro, Los Angeles, CA. Founded 1983. 43+ years serving survivors.
            </Text>
            <Text
              style={styles.attrLink}
              onPress={() => Linking.openURL('https://www.rainbowservicesdv.org')}
            >
              rainbowservicesdv.org
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.attrLabel}>CRISIS HOTLINE</Text>
            <Text
              style={styles.attrPhone}
              onPress={() => Linking.openURL('tel:3105479343')}
            >
              310-547-9343
            </Text>
            <Text style={styles.attrBody}>
              Free, confidential, 24/7. English and Spanish. Call and say your language for other language support.
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.attrLabel}>MAILING ADDRESS</Text>
            <Text style={styles.attrBody}>
              453 West 7th Street{'\n'}San Pedro, CA 90731
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.attrLabel}>EIN</Text>
            <Text style={styles.attrMono}>95-3855705</Text>
          </GlassCard>

          <HRule style={styles.hRule} />

          <Text style={styles.privacy}>
            This app collects no personal information. All safety plan data and notes are stored only on your device, encrypted with device-level security. No account is required.
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
    paddingTop: 32,
    paddingBottom: 130,
  },
  wordmark: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 36,
    color: Colors.inkPrimary,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  tagline: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkMuted,
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 20,
  },
  hRule: { marginVertical: 20 },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  attrLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: Colors.inkMuted,
    marginBottom: 6,
  },
  attrValue: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    color: Colors.inkPrimary,
    marginBottom: 6,
  },
  attrBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
    lineHeight: 20,
    marginBottom: 6,
  },
  attrLink: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 13,
    color: Colors.purpleAnchor,
    textDecorationLine: 'underline',
  },
  attrPhone: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 20,
    color: Colors.purpleAnchor,
    letterSpacing: -0.5,
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  attrMono: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: Colors.inkPrimary,
    letterSpacing: 0.5,
  },
  privacy: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
