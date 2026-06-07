import React, { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';
import { loadFakeCallConfig, saveFakeCallConfig } from '@utils/fakeCall';

const DELAYS = [
  { label: 'Now', seconds: 0 },
  { label: '10s', seconds: 10 },
  { label: '30s', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FakeCallSetupScreen() {
  const { theme } = useTheme();
  const [callerName, setCallerName] = useState('Mom');
  const [selectedDelay, setSelectedDelay] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const notifId = useRef<string | null>(null);

  useEffect(() => {
    const cfg = loadFakeCallConfig();
    setCallerName(cfg.callerName);
  }, []);

  async function requestNotifPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const trimmed = callerName.trim() || 'Mom';
    saveFakeCallConfig({ callerName: trimmed, callerLabel: 'mobile' });

    const delay = DELAYS[selectedDelay].seconds;

    if (delay === 0) {
      router.push({
        pathname: '/(tabs)/tools/fake-call/incoming',
        params: { callerName: trimmed },
      });
      return;
    }

    // Scheduled: navigate to a waiting state, then auto-push incoming
    if (notifEnabled && delay > 0) {
      const granted = await requestNotifPermission();
      if (granted) {
        notifId.current = await Notifications.scheduleNotificationAsync({
          content: {
            title: trimmed,
            body: 'Incoming call',
            data: { screen: 'fake-call-incoming', callerName: trimmed },
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delay },
        });
      }
    }

    router.push({
      pathname: '/(tabs)/tools/fake-call/waiting',
      params: { callerName: trimmed, delay: String(delay) },
    });
  }

  return (
    <ScreenScaffold
      eyebrow="TOOLS · SAFETY"
      title={'Fake\ncall.'}
      intro="Set a caller name and a timer. The screen will look like a real incoming call."
      showBack
    >
      {/* Caller name */}
      <Animated.View entering={FadeInDown.duration(280).delay(60)}>
        <GlassCard style={styles.card}>
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>CALLER NAME</Text>
          <TextInput
            value={callerName}
            onChangeText={setCallerName}
            style={[styles.input, { color: theme.text, borderBottomColor: theme.rule }]}
            placeholder="Mom"
            placeholderTextColor={theme.faint}
            maxLength={30}
            returnKeyType="done"
            autoCorrect={false}
          />
          <Text style={[styles.hint, { color: theme.faint }]}>
            This name appears on the call screen.
          </Text>
        </GlassCard>
      </Animated.View>

      {/* Delay picker */}
      <Animated.View entering={FadeInDown.duration(280).delay(120)}>
        <GlassCard style={styles.card}>
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>RING IN</Text>
          <View style={styles.delayRow}>
            {DELAYS.map((d, i) => (
              <Pressable
                key={d.label}
                onPress={() => { Haptics.selectionAsync(); setSelectedDelay(i); }}
                style={[
                  styles.delayChip,
                  {
                    backgroundColor: selectedDelay === i ? theme.accent : 'transparent',
                    borderColor: selectedDelay === i ? theme.accent : theme.rule,
                  },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedDelay === i }}
              >
                <Text style={[
                  styles.delayLabel,
                  { color: selectedDelay === i ? '#FFFFFF' : theme.muted },
                ]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      {/* Lock screen notification toggle (only relevant if delay > 0) */}
      {selectedDelay > 0 && (
        <Animated.View entering={FadeInDown.duration(260).delay(60)}>
          <GlassCard style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleText}>
                <Text style={[styles.fieldLabel, { color: theme.muted }]}>LOCK SCREEN ALERT</Text>
                <Text style={[styles.hint, { color: theme.faint }]}>
                  Sends a notification when the app is in background. Requires permission.
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: theme.rule, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </GlassCard>
        </Animated.View>
      )}

      {/* Start button */}
      <Animated.View entering={FadeInDown.duration(280).delay(180)}>
        <Pressable
          onPress={handleStart}
          style={[styles.startBtn, { backgroundColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel={`Start fake call from ${callerName} in ${DELAYS[selectedDelay].label}`}
        >
          <Text style={styles.startLabel}>
            {selectedDelay === 0 ? 'Ring now' : `Ring in ${DELAYS[selectedDelay].label}`}
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(260).delay(240)}>
        <Text style={[styles.footnote, { color: theme.faint }]}>
          The call screen carries no app name or branding. Tap decline or the back gesture to end the call.
        </Text>
      </Animated.View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, marginBottom: 10 },
  fieldLabel: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  input: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 6,
    marginBottom: 8,
  },
  hint: { fontFamily: 'Inter', fontSize: 12, lineHeight: 17 },
  delayRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  delayChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  delayLabel: { fontFamily: 'Inter', fontSize: 13, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleText: { flex: 1 },
  startBtn: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  startLabel: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footnote: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
