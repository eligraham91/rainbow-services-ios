import React, { ReactNode, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeContext';
import { BackPill } from '@components/BackPill';
import { useTraumaInformedMotion } from '@utils/motion';
import { useScrollOffset } from '@components/ScrollContext';


interface ScreenScaffoldProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  intro?: string;
  showBack?: boolean;
  chrome?: boolean;
  scroll?: boolean;
  disclaimer?: string;
}

// Eyebrow with horizontal rule: [ LABEL ] ─────────
function EyebrowRule({ label, color, ruleColor }: { label: string; color: string; ruleColor: string }) {
  return (
    <View style={eb.row}>
      <Text style={[eb.text, { color }]}>[ {label} ]</Text>
      <View style={[eb.rule, { backgroundColor: ruleColor }]} />
    </View>
  );
}

const eb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  text: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
});

export function ScreenScaffold({
  children,
  eyebrow,
  title,
  intro,
  showBack = false,
  chrome = true,
  scroll = true,
  disclaimer,
}: ScreenScaffoldProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { reduceMotion } = useTraumaInformedMotion();
  const scrollY = useScrollOffset();

  const headerEntering = reduceMotion ? undefined : FadeInDown.duration(300).delay(60);

  // Reset scroll position when this screen unmounts so gradient returns to default
  useEffect(() => {
    return () => {
      scrollY.value = 0;
    };
  }, [scrollY]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const header = (eyebrow || title || intro || showBack) ? (
    <Animated.View entering={headerEntering} style={styles.header}>
      {showBack && (
        <View style={styles.backRow}>
          <BackPill />
        </View>
      )}
      {eyebrow ? (
        <EyebrowRule label={eyebrow} color={theme.muted} ruleColor={theme.rule} />
      ) : null}
      {title ? (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      ) : null}
      {intro ? (
        <Text style={[styles.intro, { color: theme.muted }]}>{intro}</Text>
      ) : null}
    </Animated.View>
  ) : null;

  const footer = disclaimer ? (
    <Text style={[styles.disclaimer, { color: theme.faint }]}>{disclaimer.toUpperCase()}</Text>
  ) : null;

  const content = (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {header}
      {children}
      {footer}
      <View style={{ height: 24 }} />
    </View>
  );

  return (
    <View style={styles.flex}>
      {scroll ? (
        <Animated.ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {content}
        </Animated.ScrollView>
      ) : content}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  root: { paddingHorizontal: 20, paddingBottom: 16 },
  header: { marginBottom: 20 },
  backRow: { marginBottom: 16 },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
    letterSpacing: -1,
    marginBottom: 10,
  },
  intro: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimer: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 9,
    letterSpacing: 1.2,
    lineHeight: 15,
    marginTop: 28,
  },
});
