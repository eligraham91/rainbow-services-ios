import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { GlassCard } from '@components/GlassCard';
import { EditorialHeader } from '@components/ui/EditorialHeader';

export default function PlanScreen() {
  return (
    <View style={styles.root}>
      <MeshGradientBg />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <EditorialHeader
            title="Safety Plan"
            subtitle="Build a plan that works for you"
          />
          <GlassCard style={styles.card}>
            <View style={styles.cardInner} />
          </GlassCard>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  card: { flex: 1, marginTop: 8 },
  cardInner: { padding: 18, minHeight: 120 },
});
