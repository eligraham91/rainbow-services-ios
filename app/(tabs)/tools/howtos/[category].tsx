import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';
import { HOWTO_CATEGORIES, type HowToEntry } from '@data/howtos';

function ChevronIcon({ color, open }: { color: string; open: boolean }) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
    >
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ExternalIcon({ color }: { color: string }) {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 3h6v6M10 14L21 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EntryCard({ entry, index }: { entry: HowToEntry; index: number }) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const [open, setOpen] = useState(false);

  function handleOpenLink() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    WebBrowser.openBrowserAsync(entry.officialUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      createTask: false,
    });
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(250).delay(index * 55 + 60)}
    >
      <GlassCard style={styles.entryCard}>
        <Pressable
          onPress={() => { Haptics.selectionAsync(); setOpen(o => !o); }}
          style={styles.entryHeader}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={`${entry.title} on ${entry.platform}. ${open ? 'Collapse' : 'Expand'} steps.`}
        >
          <View style={styles.entryHeaderText}>
            <Text style={[styles.entryPlatform, { color: theme.accent }]}>{entry.platform}</Text>
            <Text style={[styles.entryTitle, { color: theme.text }]}>{entry.title}</Text>
            <Text style={[styles.entrySummary, { color: theme.muted }]}>{entry.summary}</Text>
          </View>
          <ChevronIcon color={theme.faint} open={open} />
        </Pressable>

        {open && (
          <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(200)} style={styles.entryBody}>
            <View style={[styles.divider, { backgroundColor: theme.rule }]} />

            {entry.steps.map((step, si) => (
              <View key={si} style={styles.stepRow}>
                <Text style={[styles.stepNum, { color: theme.accent }]}>{si + 1}</Text>
                <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
              </View>
            ))}

            {entry.caveat ? (
              <View style={[
                styles.caveat,
                {
                  backgroundColor: theme.dark ? 'rgba(159,111,227,0.08)' : 'rgba(74,20,140,0.06)',
                  borderLeftColor: theme.accent,
                },
              ]}>
                <Text style={[styles.caveatText, { color: theme.muted }]}>{entry.caveat}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleOpenLink}
              style={styles.officialLink}
              accessibilityRole="link"
              accessibilityLabel={`Open official source for ${entry.title}`}
            >
              <Text style={[styles.officialLinkText, { color: theme.accent }]}>Official source</Text>
              <ExternalIcon color={theme.accent} />
            </Pressable>

            <Text style={[styles.verified, { color: theme.faint }]}>
              {'Verified ' + entry.lastVerified.replace('-', '/')}
            </Text>
          </Animated.View>
        )}
      </GlassCard>
    </Animated.View>
  );
}

export default function HowTosCategoryScreen() {
  const { theme } = useTheme();
  const { category } = useLocalSearchParams<{ category: string }>();
  const cat = HOWTO_CATEGORIES.find(c => c.id === category);

  if (!cat) return null;

  return (
    <ScreenScaffold
      eyebrow={`HOW-TOS · ${cat.label.toUpperCase()}`}
      title={cat.label + '.'}
      intro={cat.description}
      showBack
    >
      <View style={styles.list}>
        {cat.entries.map((entry, i) => (
          <EntryCard key={entry.id} entry={entry} index={i} />
        ))}
      </View>

      <Text style={[styles.footerNote, { color: theme.faint }]}>
        These steps may change as platforms update. Tap the official link in each entry to confirm the current flow.
      </Text>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, marginBottom: 20 },
  entryCard: { padding: 0, overflow: 'hidden' },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 10,
  },
  entryHeaderText: { flex: 1 },
  entryPlatform: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  entryTitle: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  entrySummary: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  entryBody: { paddingHorizontal: 16, paddingBottom: 16 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 14 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  stepNum: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 18,
    paddingTop: 1,
  },
  stepText: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, flex: 1 },
  caveat: {
    borderLeftWidth: 2,
    paddingLeft: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 12,
    marginTop: 4,
  },
  caveatText: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  officialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  officialLinkText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verified: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 9,
    letterSpacing: 1,
  },
  footerNote: {
    fontFamily: 'Inter',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
