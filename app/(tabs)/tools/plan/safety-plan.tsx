import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useScrollOffset } from '@components/ScrollContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { GlassCard } from '@components/GlassCard';
import { BackPill } from '@components/BackPill';
import { QuickExitButton } from '@components/QuickExitButton';
import { PrivacyCheck } from '@components/Primitives';
import { DocumentIcon, ChecklistIcon } from '@components/Icons';
import { Colors } from '@theme/colors';
import {
  initVault,
  getSafetyPlan,
  saveSafetyPlanSection,
  type SafetyPlanData,
  type SafetyPlanSection,
} from '@utils/vault';
import { createMMKV } from 'react-native-mmkv';

const flags = createMMKV({ id: 'sh-flags' });

const ENTRY_SPRING = { mass: 1, stiffness: 200, damping: 22 } as const;

function buildSafetyPlanHtml(plan: SafetyPlanData): string {
  const sections = [
    { label: 'Safe escape routes', value: plan.escapeRoutes },
    { label: 'Documents to grab', value: plan.documents },
    { label: 'Emergency contacts', value: plan.emergencyContacts },
    { label: 'Code word', value: plan.codeWord },
    { label: 'Safe places to go', value: plan.safePlaces },
    { label: 'Finances', value: plan.finances },
  ];
  const rows = sections
    .map(
      s => `<div class="section">
        <div class="label">${s.label}</div>
        <div class="value">${s.value.trim() || '<em>Not filled in</em>'}</div>
      </div>`
    )
    .join('');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, sans-serif; margin: 48px; color: #1A1A1A; max-width: 600px; }
  h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.5px; }
  .sub { font-size: 13px; color: #4A4A4A; margin-bottom: 36px; }
  .section { margin-bottom: 28px; border-bottom: 1px solid #EDEDED; padding-bottom: 20px; }
  .section:last-child { border-bottom: none; }
  .label { font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: #4A4A4A; margin-bottom: 8px; }
  .value { font-size: 14px; line-height: 1.7; white-space: pre-wrap; }
  .footer { margin-top: 48px; font-size: 11px; color: #9A9A9A; border-top: 1px solid #EDEDED; padding-top: 14px; }
</style>
</head>
<body>
<h1>Safety Plan</h1>
<div class="sub">For personal use only.</div>
${rows}
<div class="footer">Store this document somewhere safe and accessible only to you.</div>
</body>
</html>`;
}

interface PlanStep {
  section: SafetyPlanSection;
  label: string;
  eyebrow: string;
  prompt: string;
  placeholder: string;
}

const STEPS: PlanStep[] = [
  {
    section: 'escapeRoutes',
    label: 'Safe escape routes',
    eyebrow: 'STEP 1 OF 6',
    prompt: 'What are two ways out of your home?',
    placeholder: 'Front door, back window, neighbor entrance...',
  },
  {
    section: 'documents',
    label: 'Documents to grab',
    eyebrow: 'STEP 2 OF 6',
    prompt: 'Which documents would you take?',
    placeholder: 'ID, passport, birth certificates, medication, phone charger, insurance cards...',
  },
  {
    section: 'emergencyContacts',
    label: 'Emergency contacts',
    eyebrow: 'STEP 3 OF 6',
    prompt: 'Who can you call? Include someone outside your immediate area.',
    placeholder: 'Name and phone number for each person...',
  },
  {
    section: 'codeWord',
    label: 'Code word',
    eyebrow: 'STEP 4 OF 6',
    prompt: 'Choose a word you can say to a trusted person that means "I need help now."',
    placeholder: 'Something ordinary that will not raise suspicion...',
  },
  {
    section: 'safePlaces',
    label: 'Safe places to go',
    eyebrow: 'STEP 5 OF 6',
    prompt: 'Where could you go? Include a 24/7 option like a hospital or police station.',
    placeholder: 'Friend, shelter, library, hospital, family member outside area...',
  },
  {
    section: 'finances',
    label: 'Finances',
    eyebrow: 'STEP 6 OF 6',
    prompt: 'Where is emergency cash or a card you could access quickly?',
    placeholder: 'Hidden cash, separate account, trusted person who can help...',
  },
];

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = current / total;
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withSpring(progress, { stiffness: 140, damping: 18 });
  }, [progress]);
  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%` as unknown as number,
  }));
  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, barStyle]} />
    </View>
  );
}

function StepView({
  step,
  value,
  onChange,
  onNext,
  onSkip,
}: {
  step: PlanStep;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 240 });
    translateY.value = withSpring(0, ENTRY_SPRING);
  }, [step.section]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.stepContainer, style]}>
      <Text style={styles.eyebrow}>{step.eyebrow}</Text>
      <Text style={styles.stepLabel}>{step.label}</Text>
      <Text style={styles.stepPrompt}>{step.prompt}</Text>
      <GlassCard style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder={step.placeholder}
          placeholderTextColor={Colors.inkMuted}
          value={value}
          onChangeText={onChange}
          autoFocus
          textAlignVertical="top"
        />
      </GlassCard>
      <Pressable onPress={onNext} style={styles.nextBtn} accessibilityRole="button">
        <Text style={styles.nextBtnText}>Save and Continue</Text>
      </Pressable>
      <Pressable onPress={onSkip} style={styles.skipBtn} accessibilityRole="button">
        <Text style={styles.skipBtnText}>Skip for now</Text>
      </Pressable>
    </Animated.View>
  );
}

function IntroView({ onBegin }: { onBegin: () => void }) {
  return (
    <View style={styles.introContainer}>
      <View style={styles.iconWrap}>
        <DocumentIcon size={40} color={Colors.purpleAnchor} />
      </View>
      <Text style={styles.bigTitle}>{'Build your\nsafety plan.'}</Text>
      <Text style={styles.sub}>
        A safety plan is a practical, personalized guide to help you stay safer.
      </Text>
      <GlassCard style={styles.privacyCard}>
        <PrivacyCheck text="Stored only on this device. No account, no cloud." />
        <PrivacyCheck text="Encrypted with device-level security." />
        <PrivacyCheck text="Hidden when you use Quick Exit." isLast />
      </GlassCard>
      <Pressable onPress={onBegin} style={styles.beginBtn} accessibilityRole="button">
        <Text style={styles.beginBtnText}>Begin</Text>
      </Pressable>
    </View>
  );
}

function CompleteView({
  plan,
  onViewVault,
}: {
  plan: SafetyPlanData;
  onViewVault: () => void;
}) {
  const filledCount = STEPS.filter(s => plan[s.section].trim().length > 0).length;
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const html = buildSafetyPlanHtml(plan);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
        dialogTitle: 'Save or send your safety plan',
      });
    } catch {
      Alert.alert('Could not export', 'Unable to create the PDF. Try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.introContainer}>
      <View style={styles.iconWrap}>
        <ChecklistIcon size={40} color={Colors.purpleAnchor} />
      </View>
      <Text style={styles.bigTitle}>{'Your plan\nis saved.'}</Text>
      <Text style={styles.sub}>
        {filledCount} of 6 sections completed. You can update it any time.
      </Text>
      <GlassCard style={styles.summaryCard}>
        {STEPS.map(s => {
          const filled = plan[s.section].trim().length > 0;
          return (
            <View key={s.section} style={styles.summaryRow}>
              <Text style={[styles.summaryDot, filled && styles.summaryDotFilled]}>
                {filled ? '●' : '○'}
              </Text>
              <Text style={[styles.summaryLabel, !filled && styles.summaryLabelEmpty]}>
                {s.label}
              </Text>
            </View>
          );
        })}
      </GlassCard>
      <Pressable onPress={onViewVault} style={styles.beginBtn} accessibilityRole="button">
        <Text style={styles.beginBtnText}>View in Vault</Text>
      </Pressable>
      <Pressable
        onPress={handleExport}
        style={styles.exportBtn}
        disabled={exporting}
        accessibilityRole="button"
        accessibilityLabel="Export safety plan as PDF"
      >
        <DocumentIcon size={15} color={exporting ? Colors.inkMuted : Colors.purpleAnchor} />
        <Text style={[styles.exportBtnText, exporting && styles.exportBtnTextDisabled]}>
          {exporting ? 'Preparing PDF...' : 'Export as PDF'}
        </Text>
      </Pressable>
    </View>
  );
}

export default function PlanScreen() {
  const router = useRouter();
  const scrollY = useScrollOffset();
  const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });
  const [stage, setStage] = useState<'loading' | 'intro' | 'steps' | 'done'>('loading');
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SafetyPlanData>({
    escapeRoutes: '',
    documents: '',
    emergencyContacts: '',
    codeWord: '',
    safePlaces: '',
    finances: '',
    lastUpdated: 0,
  });
  const [vaultReady, setVaultReady] = useState(false);

  useEffect(() => {
    initVault()
      .then(() => {
        setVaultReady(true);
        const existing = getSafetyPlan();
        const hasAny = STEPS.some(s => existing[s.section].trim().length > 0);
        setAnswers(existing);
        setStage(hasAny ? 'steps' : 'intro');
      })
      .catch(() => {
        setStage('intro');
      });
  }, []);

  const currentStep = STEPS[stepIndex];

  const handleNext = () => {
    const value = answers[currentStep.section].trim();
    if (vaultReady && value.length > 0) {
      saveSafetyPlanSection(currentStep.section, value);
    }
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      try { flags.set('sh_plan_saved', true); } catch {}
      setStage('done');
    }
  };

  const handleSkip = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      try { flags.set('sh_plan_saved', true); } catch {}
      setStage('done');
    }
  };

  if (stage === 'loading') {
    return <View style={[styles.root, styles.center]} />;
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
          <BackPill />
        </View>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {stage === 'intro' && (
            <IntroView onBegin={() => { setStepIndex(0); setStage('steps'); }} />
          )}
          {stage === 'steps' && currentStep && (
            <>
              <ProgressBar current={stepIndex + 1} total={STEPS.length} />
              <StepView
                step={currentStep}
                value={answers[currentStep.section]}
                onChange={v => setAnswers(prev => ({ ...prev, [currentStep.section]: v }))}
                onNext={handleNext}
                onSkip={handleSkip}
              />
            </>
          )}
          {stage === 'done' && (
            <CompleteView
              plan={answers}
              onViewVault={() => router.push('/(tabs)/vault')}
            />
          )}
        </Animated.ScrollView>
      </SafeAreaView>
      <QuickExitButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 130,
    flexGrow: 1,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.ruleLine,
    borderRadius: 2,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 2,
  },
  stepContainer: { flex: 1 },
  eyebrow: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: Colors.inkMuted,
    marginBottom: 8,
  },
  stepLabel: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 28,
    color: Colors.inkPrimary,
    letterSpacing: -1,
    lineHeight: 34,
    marginBottom: 8,
  },
  stepPrompt: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkMuted,
    lineHeight: 21,
    marginBottom: 20,
  },
  inputCard: {
    padding: 14,
    marginBottom: 16,
  },
  textInput: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkPrimary,
    lineHeight: 22,
    minHeight: 120,
  },
  nextBtn: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.purpleAnchor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  nextBtnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
  },
  skipBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkMuted,
    textDecorationLine: 'underline',
  },
  introContainer: { flex: 1, paddingTop: 20 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(74,20,140,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bigTitle: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 36,
    color: Colors.inkPrimary,
    letterSpacing: -1.5,
    lineHeight: 42,
    marginBottom: 10,
  },
  sub: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: Colors.inkMuted,
    lineHeight: 21,
    marginBottom: 24,
  },
  privacyCard: {
    padding: 14,
    marginBottom: 24,
  },
  beginBtn: {
    backgroundColor: Colors.purpleAnchor,
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.purpleAnchor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  beginBtnText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
  },
  summaryCard: {
    padding: 14,
    marginBottom: 24,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 3,
  },
  summaryDot: {
    fontSize: 12,
    color: Colors.ruleLine,
    width: 14,
  },
  summaryDotFilled: { color: Colors.purpleAnchor },
  summaryLabel: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.inkPrimary,
  },
  summaryLabelEmpty: { color: Colors.inkMuted },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.purpleAnchor,
  },
  exportBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: Colors.purpleAnchor,
  },
  exportBtnTextDisabled: {
    color: Colors.inkMuted,
  },
});
