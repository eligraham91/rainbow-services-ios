import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { CallSheet, CallContact } from '@components/ui/CallSheet';
import { STATE_LAWS, NATIONAL_DV_HOTLINE } from '@data/stateLaws';
import { useTheme } from '@theme/ThemeContext';

export default function StateLawsScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [call, setCall] = useState<CallContact | null>(null);

  const results = STATE_LAWS.filter((s) =>
    s.state.toLowerCase().includes(query.toLowerCase())
  );

  const hotlineContact: CallContact = {
    tag: NATIONAL_DV_HOTLINE.tag,
    name: NATIONAL_DV_HOTLINE.name,
    number: NATIONAL_DV_HOTLINE.number,
    dial: NATIONAL_DV_HOTLINE.dial,
    note: NATIONAL_DV_HOTLINE.note,
  };

  return (
    <>
      <ScreenScaffold
        eyebrow="Learn · State Laws"
        title={"Your rights,\nby state."}
        intro="Every state offers a court order that can require an abuser to stay away. The names differ, the protection is real."
        showBack
        disclaimer="General information, not legal advice. Laws change, and the details depend on your situation. Confirm with a local advocate or attorney."
      >
        {/* Search */}
        <GlassCard style={styles.searchCard}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your state"
            placeholderTextColor={theme.faint}
            style={[styles.searchInput, { color: theme.text }]}
            accessibilityLabel="Search states"
            returnKeyType="search"
          />
        </GlassCard>

        {/* National hotline pinned */}
        <Pressable
          onPress={() => setCall(hotlineContact)}
          style={({ pressed }) => [styles.hotline, pressed && { opacity: 0.85 }]}
        >
          <View>
            <Text style={styles.hotlineTag}>[ HELP IN ANY STATE ]</Text>
            <Text style={styles.hotlineName}>National DV Hotline</Text>
          </View>
          <View style={[styles.hotlineBtn, { backgroundColor: theme.danger }]}>
            <Text style={styles.hotlineBtnText}>Call</Text>
          </View>
        </Pressable>

        {/* Results */}
        <Text style={[styles.resultsLabel, { color: theme.muted }]}>
          {results.length} {results.length === 1 ? 'STATE' : 'STATES'}
        </Text>

        <View style={styles.list}>
          {results.map((item) => (
            <GlassCard key={item.state} style={styles.stateCard}>
              <Text style={[styles.stateName, { color: theme.text }]}>{item.state}</Text>
              <Text style={[styles.orderName, { color: theme.accent }]}>{item.orderName}</Text>
              <Text style={[styles.stateNote, { color: theme.muted }]}>
                Filing is free and a police report is not required. A judge can order no contact, stay-away, and firearm surrender. A local advocate can help you prepare it.
              </Text>
            </GlassCard>
          ))}
          {results.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              That state is not in this list, but every U.S. state and territory has protective orders. Call the hotline above and they will connect you to legal help where you are.
            </Text>
          )}
        </View>
      </ScreenScaffold>

      <CallSheet contact={call} onClose={() => setCall(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  searchCard: { padding: 0, marginBottom: 12 },
  searchInput: { padding: 16, fontFamily: 'Inter', fontSize: 16 },
  hotline: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hotlineTag: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5, color: 'rgba(245,241,232,0.6)', marginBottom: 4 },
  hotlineName: { fontFamily: 'InterTight-ExtraBold', fontSize: 17, fontWeight: '800', color: '#F5F1E8' },
  hotlineBtn: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  hotlineBtnText: { fontFamily: 'Inter', fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  resultsLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5, marginBottom: 10 },
  list: { gap: 8 },
  stateCard: { padding: 18 },
  stateName: { fontFamily: 'InterTight-ExtraBold', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  orderName: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, letterSpacing: 0.5, marginBottom: 8 },
  stateNote: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  emptyText: { fontFamily: 'Inter', fontSize: 15, lineHeight: 23 },
});
