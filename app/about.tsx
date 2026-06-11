import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Switch,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuickExitButton } from '@components/QuickExitButton';
import { GlassCard } from '@components/GlassCard';
import { HRule } from '@components/Primitives';
import { CallSheet, type CallContact } from '@components/ui/CallSheet';
import { useTheme, type QuietMode } from '@theme/ThemeContext';
import { ACCENT_CHOICES } from '@theme/colors';
import { tick } from '@utils/haptics';

const QUIET_OPTIONS: { id: QuietMode; label: string; desc: string }[] = [
  { id: 'full', label: 'Full', desc: 'All motion and touch feedback.' },
  { id: 'soft', label: 'Soft', desc: 'Gentle motion, touch feedback on.' },
  { id: 'still', label: 'Still', desc: 'No motion. Touch feedback off, except safety warnings.' },
];

const RS_HOTLINE: CallContact = {
  tag: 'CRISIS HOTLINE · 24/7',
  name: 'Rainbow Services',
  number: '310-547-9343',
  dial: '3105479343',
  note: 'Free, confidential, 24/7. English and Spanish. Call and say your language for other language support.',
};

export default function AboutScreen() {
  const { theme, override, setOverride, accentId, setAccentId, quiet, setQuiet } = useTheme();
  const [call, setCall] = useState<CallContact | null>(null);
  const darkEnabled = override === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.wordmark, { color: theme.text }]}>Start Here</Text>
          <Text style={[styles.tagline, { color: theme.muted }]}>
            A national domestic violence support tool.
          </Text>

          <HRule style={styles.hRule} />

          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>BUILT BY</Text>
            <Text style={[styles.attrValue, { color: theme.text }]}>Rainbow Services</Text>
            <Text style={[styles.attrBody, { color: theme.text }]}>
              Rainbow Services is a domestic violence shelter and advocacy organization in San Pedro, Los Angeles, CA. Founded 1983. 43+ years serving survivors.
            </Text>
            <Text
              style={[styles.attrLink, { color: theme.accent }]}
              onPress={() => Linking.openURL('https://www.rainbowservicesdv.org')}
            >
              rainbowservicesdv.org
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>CRISIS HOTLINE</Text>
            <Text
              style={[styles.attrPhone, { color: theme.accent }]}
              onPress={() => setCall(RS_HOTLINE)}
            >
              310-547-9343
            </Text>
            <Text style={[styles.attrBody, { color: theme.text }]}>
              Free, confidential, 24/7. English and Spanish. Call and say your language for other language support.
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>MAILING ADDRESS</Text>
            <Text style={[styles.attrBody, { color: theme.text }]}>
              453 West 7th Street{'\n'}San Pedro, CA 90731
            </Text>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>EIN</Text>
            <Text style={[styles.attrMono, { color: theme.text }]}>95-3855705</Text>
          </GlassCard>

          <HRule style={styles.hRule} />

          {/* Dark mode toggle */}
          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>APPEARANCE</Text>
            <View style={styles.toggleRow}>
              <View style={styles.toggleText}>
                <Text style={[styles.toggleLabel, { color: theme.text }]}>Discreet dark mode</Text>
                <Text style={[styles.toggleDesc, { color: theme.muted }]}>
                  Warm dark theme. Use this to reduce screen visibility in public.
                </Text>
              </View>
              <Switch
                value={darkEnabled}
                onValueChange={v => setOverride(v ? 'dark' : 'system')}
                trackColor={{ false: theme.rule, true: theme.accent }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Toggle discreet dark mode"
              />
            </View>
          </GlassCard>

          {/* Quiet Mode dial */}
          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>QUIET MODE</Text>
            <Text style={[styles.toggleDesc, { color: theme.muted, marginBottom: 12 }]}>
              Choose how much the app moves and responds to touch.
            </Text>
            <View style={styles.quietRow}>
              {QUIET_OPTIONS.map(opt => {
                const selected = quiet === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => {
                      setQuiet(opt.id);
                      if (opt.id !== 'still') tick();
                    }}
                    style={[
                      styles.quietPill,
                      { borderColor: theme.rule },
                      selected && { backgroundColor: theme.accent, borderColor: theme.accent },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${opt.label}. ${opt.desc}`}
                  >
                    <Text
                      style={[
                        styles.quietPillLabel,
                        { color: selected ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={[styles.toggleDesc, { color: theme.muted, marginTop: 10 }]}>
              {QUIET_OPTIONS.find(o => o.id === quiet)?.desc}
            </Text>
          </GlassCard>

          {/* Accent color picker */}
          <GlassCard style={styles.card}>
            <Text style={[styles.attrLabel, { color: theme.muted }]}>ACCENT COLOR</Text>
            <Text style={[styles.toggleDesc, { color: theme.muted, marginBottom: 12 }]}>
              Pick the color the app uses for links and highlights. Safety messaging always stays red.
            </Text>
            <View style={styles.swatchRow}>
              {ACCENT_CHOICES.map(choice => {
                const swatch = theme.dark ? choice.dark.accent : choice.light.accent;
                const selected = choice.id === accentId;
                return (
                  <Pressable
                    key={choice.id}
                    onPress={() => {
                      tick();
                      setAccentId(choice.id);
                    }}
                    style={[
                      styles.swatch,
                      { backgroundColor: swatch },
                      selected && { borderColor: theme.text, borderWidth: 2.5 },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${choice.label} accent color`}
                  />
                );
              })}
            </View>
          </GlassCard>

          <HRule style={styles.hRule} />

          <Text style={[styles.privacy, { color: theme.muted }]}>
            This app collects no personal information. All safety plan data and notes are stored only on your device, encrypted with device-level security. No account is required.
          </Text>
        </ScrollView>
      </SafeAreaView>
      <QuickExitButton />
      <CallSheet contact={call} onClose={() => setCall(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
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
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  tagline: {
    fontFamily: 'Inter',
    fontSize: 14,
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
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 9,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  attrValue: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  attrBody: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  attrLink: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  attrPhone: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.5,
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  attrMono: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: { flex: 1 },
  toggleLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 3,
  },
  toggleDesc: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 17,
  },
  quietRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quietPill: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 9,
    alignItems: 'center',
  },
  quietPillLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
  },
  privacy: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
