import React, { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@theme/ThemeContext';
import { BackPill } from '@components/BackPill';
import { QuickExitButton } from '@components/QuickExitButton';
import { useTraumaInformedMotion } from '@utils/motion';

interface ScreenScaffoldProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  intro?: string;
  showBack?: boolean;
  chrome?: boolean;   // mount QuickExitButton (default true)
  scroll?: boolean;   // wrap in ScrollView (default true)
  disclaimer?: string;
}

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

  const entering = reduceMotion ? undefined : FadeInDown.duration(320).delay(80);

  const header = (eyebrow || title || intro || showBack) ? (
    <Animated.View entering={entering} style={styles.header}>
      {showBack && <BackPill />}
      {eyebrow ? (
        <Text style={[styles.eyebrow, { color: theme.accent }]}>{eyebrow.toUpperCase()}</Text>
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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {header}
      {children}
      {footer}
      {/* spacer for Quick Exit button */}
      {chrome && <View style={{ height: 96 }} />}
    </View>
  );

  return (
    <View style={styles.flex}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : content}
      {chrome && <QuickExitButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  root: { paddingHorizontal: 22, paddingBottom: 32 },
  header: { marginBottom: 24 },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  intro: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimer: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    lineHeight: 16,
    marginTop: 32,
  },
});
