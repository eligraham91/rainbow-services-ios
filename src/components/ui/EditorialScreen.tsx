import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from './ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';

export interface EditorialListItem {
  h: string;
  b: string;
}

export interface EditorialBlock {
  label?: { idx: string; txt: string };
  title?: string;
  body?: string;
  list?: EditorialListItem[];
}

export interface EditorialReadout {
  eyebrow: string;
  line: string;
  actions?: Array<{ t: string; go: string }>;
}

interface EditorialScreenProps {
  eyebrow: string;
  title: string;
  sub: string;
  blocks: EditorialBlock[];
  readout?: EditorialReadout;
  footer?: string;
}

export function EditorialScreen({ eyebrow, title, sub, blocks, readout, footer }: EditorialScreenProps) {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();

  return (
    <ScreenScaffold
      eyebrow={eyebrow}
      title={title}
      intro={sub}
      showBack
      disclaimer={footer}
    >
      {blocks.map((block, bi) => {
        const entering = reduceMotion ? undefined : FadeInDown.duration(300).delay(bi * 80 + 100);
        return (
          <Animated.View key={bi} entering={entering} style={styles.block}>
            {block.label ? (
              <View style={styles.blockLabel}>
                <Text style={[styles.blockIdx, { color: theme.accent }]}>{block.label.idx}</Text>
                <Text style={[styles.blockTxt, { color: theme.muted }]}>{block.label.txt}</Text>
              </View>
            ) : null}
            {block.title ? (
              <Text style={[styles.blockTitle, { color: theme.text }]}>{block.title}</Text>
            ) : null}
            {block.body ? (
              <GlassCard style={styles.bodyCard}>
                <Text style={[styles.bodyText, { color: theme.text }]}>{block.body}</Text>
              </GlassCard>
            ) : null}
            {block.list ? (
              <View style={styles.list}>
                {block.list.map((item, li) => (
                  <GlassCard key={li} style={styles.listItem}>
                    <Text style={[styles.listHead, { color: theme.text }]}>{item.h}</Text>
                    <Text style={[styles.listBody, { color: theme.muted }]}>{item.b}</Text>
                  </GlassCard>
                ))}
              </View>
            ) : null}
          </Animated.View>
        );
      })}

      {readout ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(blocks.length * 80 + 200)}
          style={[styles.readout, { backgroundColor: theme.dark ? '#37331F' : '#1A1A1A' }]}
        >
          <Text style={[styles.readoutEyebrow, { color: 'rgba(245,241,232,0.6)' }]}>{readout.eyebrow}</Text>
          <Text style={[styles.readoutLine, { color: '#F5F1E8' }]}>{readout.line}</Text>
          {readout.actions?.map((action, ai) => (
            <Pressable
              key={ai}
              onPress={() => router.push(action.go as never)}
              style={[styles.readoutAction, { borderColor: 'rgba(245,241,232,0.25)' }]}
            >
              <Text style={styles.readoutActionText}>{action.t}</Text>
            </Pressable>
          ))}
        </Animated.View>
      ) : null}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 28 },
  blockLabel: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  blockIdx: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, letterSpacing: 1 },
  blockTxt: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, letterSpacing: 1.5 },
  blockTitle: { fontFamily: 'InterTight-ExtraBold', fontSize: 20, fontWeight: '800', marginBottom: 10 },
  bodyCard: { padding: 18 },
  bodyText: { fontFamily: 'Inter', fontSize: 15, lineHeight: 23 },
  list: { gap: 8 },
  listItem: { padding: 16 },
  listHead: { fontFamily: 'InterTight-ExtraBold', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  listBody: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21 },
  readout: { borderRadius: 16, padding: 22, marginTop: 8 },
  readoutEyebrow: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5, marginBottom: 10 },
  readoutLine: { fontFamily: 'Inter', fontSize: 16, lineHeight: 24, marginBottom: 14 },
  readoutAction: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
    alignItems: 'center',
  },
  readoutActionText: { fontFamily: 'Inter', fontSize: 15, fontWeight: '600', color: '#F5F1E8' },
});
