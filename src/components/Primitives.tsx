import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// ── Layout ────────────────────────────────────────────────────

export function HRule({ style }: { style?: ViewStyle }) {
  const { theme } = useTheme();
  return <View style={[styles.hRule, { backgroundColor: theme.rule }, style]} />;
}

export function SectionLabel({ text }: { text: string }) {
  const { theme } = useTheme();
  return <Text style={[styles.sectionLabel, { color: theme.muted }]}>{text}</Text>;
}

// ── Form ──────────────────────────────────────────────────────

export function PrivacyCheck({ text, isLast = false }: { text: string; isLast?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.privacyCheck, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.rule }]}>
      <View style={[styles.privacyCheckBox, { backgroundColor: theme.accent }]}>
        <Text style={styles.privacyCheckmark}>✓</Text>
      </View>
      <Text style={[styles.privacyCheckText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

export function ConditionChip({
  text,
  selected,
  onPress,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const selectedBg = theme.dark ? 'rgba(159,111,227,0.14)' : 'rgba(74,20,140,0.07)';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.conditionChip,
        {
          backgroundColor: selected ? selectedBg : theme.surface,
          borderColor: selected ? theme.accent : theme.rule,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.conditionChipText,
          { color: selected ? theme.accent : theme.text },
          selected && styles.conditionChipTextSelected,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

export function NextStepPanel({
  number,
  title,
  accent = false,
  children,
}: {
  number: string;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const accentBg = theme.dark ? 'rgba(159,111,227,0.08)' : 'rgba(74,20,140,0.04)';
  const accentBorder = theme.dark ? 'rgba(159,111,227,0.3)' : 'rgba(74,20,140,0.18)';
  return (
    <View
      style={[
        styles.nextStepPanel,
        {
          backgroundColor: accent ? accentBg : theme.surface,
          borderColor: accent ? accentBorder : theme.rule,
        },
      ]}
    >
      <View style={styles.nextStepHeader}>
        <View style={[styles.nextStepBadge, { backgroundColor: theme.accent }]}>
          <Text style={styles.nextStepBadgeText}>{number}</Text>
        </View>
        <Text style={[styles.nextStepTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.nextStepBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  hRule: {
    height: 1,
    marginVertical: 16,
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
  },
  privacyCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  privacyCheckBox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCheckmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  privacyCheckText: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  conditionChip: {
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 4,
  },
  conditionChipText: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
  },
  conditionChipTextSelected: {
    fontWeight: '500',
  },
  nextStepPanel: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  nextStepHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nextStepBadge: {
    width: 22,
    height: 22,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepBadgeText: {
    fontFamily: 'InterTight',
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  nextStepTitle: {
    fontFamily: 'InterTight',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    paddingTop: 3,
    flex: 1,
  },
  nextStepBody: {
    paddingLeft: 32,
  },
});
