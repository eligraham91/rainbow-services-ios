import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { EditorialHeader } from '@components/ui/EditorialHeader';
import { ActionGrid } from '@components/ui/ActionGrid';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { Colors } from '@theme/colors';

export default function Index() {
  return (
    <View style={styles.root}>
      {/* Full-bleed gyro-driven gradient */}
      <MeshGradientBg />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EditorialHeader
            title={`When you\ndon't know\nwhat to do.`}
            subtitle="Private. Free. No account required."
          />
          <ActionGrid />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Pill lives outside the scroll container so it stays fixed */}
      <FloatingCommandPill />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.creamBase,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 130,
  },
});
