import React, { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { CallSheet, type CallContact } from '@components/ui/CallSheet';
import { useTheme } from '@theme/ThemeContext';

const RS_HOTLINE: CallContact = {
  tag: 'LOCAL CRISIS LINE · 24/7',
  name: 'Rainbow Services',
  number: '310-547-9343',
  dial: '3105479343',
  note: 'Free and confidential. Ask about legal services. English and Spanish, other languages available.',
};

const NATIONAL_HOTLINE: CallContact = {
  tag: '24/7 CRISIS LINE',
  name: 'National DV Hotline',
  number: '1-800-799-7233',
  dial: '18007997233',
  note: 'Free, confidential, 24/7. They can connect you to free legal help in your state.',
};

export default function LegalPrepScreen() {
  const { theme } = useTheme();
  const [call, setCall] = useState<CallContact | null>(null);

  return (
    <>
      <ScreenScaffold
        eyebrow="Plan · Legal Options"
        title={"Legal help\nis coming."}
        intro="We are building a guided legal options tool with Rainbow's legal team. It will cover restraining orders, immigration relief, family court, and more."
        showBack
      >
        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>In the meantime</Text>
          <Text style={[styles.cardBody, { color: theme.muted }]}>
            Rainbow Services' legal clinic can help you understand your options at no cost. Call or text the hotline and ask about legal services.
          </Text>
          <Pressable
            onPress={() => setCall(RS_HOTLINE)}
            style={[styles.callBtn, { backgroundColor: theme.danger }]}
            accessibilityRole="button"
            accessibilityLabel="Call Rainbow Services hotline"
          >
            <Text style={styles.callBtnText}>310-547-9343</Text>
          </Pressable>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>National DV Hotline</Text>
          <Text style={[styles.cardBody, { color: theme.muted }]}>
            Available 24/7. They can connect you to free legal help in your state.
          </Text>
          <Pressable
            onPress={() => setCall(NATIONAL_HOTLINE)}
            style={[styles.callBtn, { borderWidth: 1.5, borderColor: theme.accent }]}
            accessibilityRole="button"
            accessibilityLabel="Call National DV Hotline"
          >
            <Text style={[styles.callBtnText, { color: theme.accent }]}>1-800-799-7233</Text>
          </Pressable>
        </GlassCard>
      </ScreenScaffold>

      <CallSheet contact={call} onClose={() => setCall(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, marginBottom: 12 },
  cardTitle: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  cardBody: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, marginBottom: 16 },
  callBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  callBtnText: { fontFamily: 'InterTight-ExtraBold', fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
});
