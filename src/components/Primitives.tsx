import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import {
  CompassIcon, ToolsIcon, FindHelpIcon, LearnIcon, KeepFreeIcon,
} from './Icons';

export type Tab = 'start' | 'tools' | 'findhelp' | 'learn' | 'keepfree';

// ── Layout ────────────────────────────────────────────────────

export function StatusBarSpacer() {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.top + 8 }} />;
}

export function HRule({ style }: { style?: ViewStyle }) {
  return <View style={[styles.hRule, style]} />;
}

export function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

// ── Brand ─────────────────────────────────────────────────────

export function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <Text style={[styles.eyebrow, light && styles.eyebrowLight]}>
      [ {text} ]
    </Text>
  );
}

export function QuickExitPill({ onExit }: { onExit: () => void }) {
  return (
    <Pressable
      onPress={onExit}
      accessibilityLabel="Quick Exit to neutral website"
      style={({ pressed }) => [styles.exitPill, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.exitPillText}>✕ EXIT</Text>
    </Pressable>
  );
}

export function AppHeader({
  onExit,
  showBack = false,
  onBack,
}: {
  onExit: () => void;
  showBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <View style={styles.appHeader}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
      ) : (
        <View>
          <Text style={styles.headerBrand}>RAINBOW SERVICES</Text>
          <Text style={styles.headerSub}>START HERE · Private mode on</Text>
        </View>
      )}
      <QuickExitPill onExit={onExit} />
    </View>
  );
}

export function BottomNav({
  activeTab,
  onTab,
}: {
  activeTab: Tab;
  onTab: (tab: Tab) => void;
}) {
  const insets = useSafeAreaInsets();
  const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
    { id: 'start',    label: 'Start',     Icon: CompassIcon },
    { id: 'tools',    label: 'Tools',     Icon: ToolsIcon },
    { id: 'findhelp', label: 'Find Help', Icon: FindHelpIcon },
    { id: 'learn',    label: 'Learn',     Icon: LearnIcon },
    { id: 'keepfree', label: 'Keep Free', Icon: KeepFreeIcon },
  ];

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <Pressable key={id} onPress={() => onTab(id)} style={styles.tabItem}>
            <Icon size={20} color={active ? C.purpleAnchor : C.inkMuted} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Buttons ───────────────────────────────────────────────────

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        pressed && styles.primaryBtnPressed,
        disabled && styles.primaryBtnDisabled,
      ]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.secondaryBtn}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.textBtn}>{label}</Text>
    </Pressable>
  );
}

// ── Form ──────────────────────────────────────────────────────

export function PrivacyCheck({ text, isLast = false }: { text: string; isLast?: boolean }) {
  return (
    <View style={[styles.privacyCheck, !isLast && styles.privacyCheckBorder]}>
      <View style={styles.privacyCheckBox}>
        <Text style={styles.privacyCheckmark}>✓</Text>
      </View>
      <Text style={styles.privacyCheckText}>{text}</Text>
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
  return (
    <Pressable
      onPress={onPress}
      style={[styles.conditionChip, selected && styles.conditionChipSelected]}
    >
      <Text style={[styles.conditionChipText, selected && styles.conditionChipTextSelected]}>
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
  return (
    <View style={[styles.nextStepPanel, accent && styles.nextStepPanelAccent]}>
      <View style={styles.nextStepHeader}>
        <View style={styles.nextStepBadge}>
          <Text style={styles.nextStepBadgeText}>{number}</Text>
        </View>
        <Text style={styles.nextStepTitle}>{title}</Text>
      </View>
      <View style={styles.nextStepBody}>{children}</View>
    </View>
  );
}

export function ToolCard({
  title,
  description,
  Icon,
  onPress,
}: {
  title: string;
  description: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.toolCard}>
      <View style={styles.toolCardIcon}>
        <Icon size={17} color={C.inkPrimary} />
      </View>
      <View style={styles.toolCardBody}>
        <Text style={styles.toolCardTitle}>{title}</Text>
        <Text style={styles.toolCardDesc}>{description}</Text>
      </View>
      <Text style={styles.toolCardChevron}>›</Text>
    </Pressable>
  );
}

export function AppIconBadge({
  Icon,
  gradient,
  size = 36,
}: {
  Icon: React.ComponentType<{ size: number; color: string }>;
  gradient: string;
  size?: number;
}) {
  const bg = gradient.includes('#E53935') ? '#E53935'
    : gradient.includes('#7B1FA2') ? '#7B1FA2'
    : gradient.includes('#1E88E5') ? '#1E88E5'
    : '#43A047';
  return (
    <View style={[styles.appIconBadge, { width: size, height: size, borderRadius: Math.round(size * 0.22), backgroundColor: bg }]}>
      <Icon size={Math.round(size * 0.52)} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  hRule: {
    height: 1,
    backgroundColor: C.ruleLine,
    marginVertical: 16,
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: C.inkMuted,
    marginBottom: 8,
    marginTop: 20,
  },
  eyebrow: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: C.inkMuted,
    marginBottom: 14,
  },
  eyebrowLight: {
    color: 'rgba(245,241,232,0.4)',
  },
  exitPill: {
    backgroundColor: C.safetyRed,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: C.safetyRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  exitPillText: {
    color: '#fff',
    fontFamily: 'InterTight',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.ruleLine,
    backgroundColor: C.creamBase,
  },
  headerBrand: {
    fontFamily: 'InterTight',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: -0.13,
    color: C.inkPrimary,
  },
  headerSub: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1.28,
    textTransform: 'uppercase',
    color: C.inkMuted,
    marginTop: 1,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backBtnText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: C.purpleAnchor,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.ruleLine,
    backgroundColor: C.creamBase,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingTop: 9,
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: '400',
    letterSpacing: 0.36,
    color: C.inkMuted,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: C.purpleAnchor,
  },
  primaryBtn: {
    height: 52,
    backgroundColor: C.purpleAnchor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.purpleAnchor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnPressed: {
    backgroundColor: '#3A0068',
  },
  primaryBtnDisabled: {
    backgroundColor: '#B0A8C0',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: C.creamBase,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryBtn: {
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.ruleLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: C.inkPrimary,
  },
  textBtn: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: C.inkMuted,
    textDecorationLine: 'underline',
    paddingVertical: 4,
  },
  privacyCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  privacyCheckBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.ruleLineSoft,
  },
  privacyCheckBox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: C.purpleAnchor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCheckmark: {
    color: C.creamBase,
    fontSize: 12,
    fontWeight: '700',
  },
  privacyCheckText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: C.inkPrimary,
    lineHeight: 18,
    flex: 1,
  },
  conditionChip: {
    padding: 12,
    paddingHorizontal: 14,
    backgroundColor: C.creamCard,
    borderWidth: 1,
    borderColor: C.ruleLine,
    borderRadius: 4,
  },
  conditionChipSelected: {
    backgroundColor: 'rgba(74,20,140,0.07)',
    borderColor: C.purpleAnchor,
  },
  conditionChipText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: C.inkPrimary,
    lineHeight: 18,
  },
  conditionChipTextSelected: {
    color: C.purpleAnchor,
    fontWeight: '500',
  },
  nextStepPanel: {
    backgroundColor: C.creamCard,
    borderWidth: 1,
    borderColor: C.ruleLine,
    borderRadius: 4,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  nextStepPanelAccent: {
    backgroundColor: 'rgba(74,20,140,0.04)',
    borderColor: 'rgba(74,20,140,0.18)',
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
    backgroundColor: C.purpleAnchor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepBadgeText: {
    fontFamily: 'InterTight',
    fontSize: 11,
    fontWeight: '800',
    color: C.creamBase,
  },
  nextStepTitle: {
    fontFamily: 'InterTight',
    fontWeight: '700',
    fontSize: 14,
    color: C.inkPrimary,
    lineHeight: 18,
    paddingTop: 3,
    flex: 1,
  },
  nextStepBody: {
    paddingLeft: 32,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    paddingHorizontal: 16,
    backgroundColor: C.creamCard,
    borderWidth: 1,
    borderColor: C.ruleLine,
    borderRadius: 4,
    marginBottom: 8,
  },
  toolCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: C.creamCardSoft,
    borderWidth: 1,
    borderColor: C.ruleLineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolCardBody: {
    flex: 1,
  },
  toolCardTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: C.inkPrimary,
    marginBottom: 2,
  },
  toolCardDesc: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: C.inkMuted,
    lineHeight: 15,
  },
  toolCardChevron: {
    fontSize: 18,
    color: C.ruleLine,
  },
  appIconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
});
