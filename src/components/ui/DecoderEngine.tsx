import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { ScreenScaffold } from './ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import type { DecoderExample, Chip } from '@data/decoder';

interface DecoderEngineProps {
  eyebrow: string;
  title: string;
  examples: DecoderExample[];
}

export function DecoderEngine({ eyebrow, title, examples }: DecoderEngineProps) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(0);
  const [activeChip, setActiveChip] = useState<Chip | null>(null);
  const [showResponses, setShowResponses] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const example = examples[selected];

  async function handleCopy(text: string) {
    await Clipboard.setStringAsync(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <ScreenScaffold
      eyebrow={eyebrow}
      title={title}
      intro="Tap the highlighted phrases to understand the pattern."
      disclaimer="Patterns worth noticing. Speaking with an advocate can help you make sense of what you are seeing."
    >
      {/* Example selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectorScroll}
        contentContainerStyle={styles.selectorContent}
      >
        {examples.map((ex, i) => (
          <Pressable
            key={ex.id}
            onPress={() => { setSelected(i); setActiveChip(null); setShowResponses(false); }}
            style={[
              styles.selectorPill,
              {
                backgroundColor: selected === i ? theme.accent : theme.surface,
                borderColor: selected === i ? theme.accent : theme.rule,
              },
            ]}
          >
            <Text style={[styles.selectorLabel, { color: selected === i ? '#FFFFFF' : theme.muted }]}>
              {ex.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Message thread */}
      <GlassCard style={styles.thread}>
        <Text style={[styles.meta, { color: theme.muted }]}>{example.meta}</Text>
        {example.soundsLike.bubbles.map((bubble, bi) => (
          <View key={bi} style={[styles.bubbleRow, bubble.from === 'them' ? styles.bubbleLeft : styles.bubbleRight]}>
            <View style={[
              styles.bubble,
              bubble.from === 'them'
                ? { backgroundColor: theme.dark ? '#3D3A28' : '#E8E0CC' }
                : { backgroundColor: theme.accent },
            ]}>
              {bubble.segments.map((seg, si) => {
                const chip = seg.chipId ? example.functionsAs.chips.find((c) => c.id === seg.chipId) : null;
                const isActive = chip && activeChip?.id === chip.id;

                if (chip) {
                  const words = seg.t.trim().split(/\s+/).filter(Boolean);
                  return words.map((word, wi) => (
                    <Pressable
                      key={`${si}-${wi}`}
                      onPress={() => setActiveChip(isActive ? null : chip)}
                      accessibilityRole="button"
                      accessibilityLabel={wi === 0 ? `Highlighted phrase: ${seg.t.trim()}. Tap to decode.` : undefined}
                      accessibilityElementsHidden={wi > 0}
                      style={[
                        styles.pill,
                        isActive
                          ? [styles.pillActive, { backgroundColor: theme.dark ? 'rgba(159,111,227,0.35)' : 'rgba(74,20,140,0.18)' }]
                          : { backgroundColor: 'rgba(45,30,61,0.10)' },
                      ]}
                    >
                      <Text style={[styles.pillText, { color: bubble.from === 'them' ? theme.text : '#FFFFFF' }]}>
                        {word}
                      </Text>
                    </Pressable>
                  ));
                }

                return (
                  <Text
                    key={si}
                    style={[
                      styles.bubbleText,
                      { color: bubble.from === 'them' ? theme.text : '#FFFFFF' },
                    ]}
                  >
                    {seg.t}
                  </Text>
                );
              })}
            </View>
          </View>
        ))}
      </GlassCard>

      {/* Active chip detail */}
      {activeChip && (
        <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(180)}>
          <GlassCard style={[styles.chipDetail, { borderLeftColor: theme.accent }]}>
            <Text style={[styles.chipLabel, { color: theme.accent }]}>{activeChip.label}</Text>
            <Text style={[styles.chipBody, { color: theme.text }]}>{activeChip.body}</Text>
          </GlassCard>
        </Animated.View>
      )}

      {/* Functions as summary */}
      <GlassCard style={styles.summary}>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>{example.functionsAs.title}</Text>
        <Text style={[styles.summaryText, { color: theme.muted }]}>{example.functionsAs.summary}</Text>
        <Text style={[styles.summaryNote, { color: theme.faint }]}>{example.notes}</Text>
      </GlassCard>

      {/* Safer responses */}
      <Pressable
        onPress={() => setShowResponses(!showResponses)}
        style={[styles.responsesToggle, { borderColor: theme.rule }]}
      >
        <Text style={[styles.responsesToggleText, { color: theme.accent }]}>
          {showResponses ? 'Hide responses' : 'Borrow a response'}
        </Text>
      </Pressable>

      {showResponses && (
        <Animated.View entering={FadeInDown.duration(250)}>
          {example.saferResponses.map((r, i) => (
            <Pressable
              key={i}
              onPress={() => handleCopy(r.text)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <GlassCard style={styles.responseCard}>
                <Text style={[styles.responseTone, { color: theme.accent }]}>{r.tone}</Text>
                <Text style={[styles.responseText, { color: theme.text }]}>{r.text}</Text>
                <Text style={[styles.copyHint, { color: theme.faint }]}>
                  {copied === r.text ? 'Copied' : 'Tap to copy'}
                </Text>
              </GlassCard>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  selectorScroll: { marginBottom: 16, marginHorizontal: -22 },
  selectorContent: { paddingHorizontal: 22, gap: 8 },
  selectorPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  selectorLabel: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600' },
  thread: { padding: 16, marginBottom: 12 },
  meta: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1, marginBottom: 12 },
  bubbleRow: { marginBottom: 8 },
  bubbleLeft: { alignItems: 'flex-start' },
  bubbleRight: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bubbleText: { fontFamily: 'Inter', fontSize: 14, lineHeight: 20 },
  pill: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginVertical: 2,
  },
  pillActive: {},
  pillText: { fontFamily: 'Inter', fontSize: 14, lineHeight: 20 },
  chipDetail: {
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  chipLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  chipBody: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21 },
  summary: { padding: 18, marginBottom: 12 },
  summaryTitle: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  summaryText: { fontFamily: 'Inter', fontSize: 15, lineHeight: 22, marginBottom: 10 },
  summaryNote: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  responsesToggle: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  responsesToggleText: { fontFamily: 'Inter', fontSize: 15, fontWeight: '600' },
  responseCard: { padding: 16, marginBottom: 8 },
  responseTone: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 },
  responseText: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, marginBottom: 8 },
  copyHint: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1 },
});
