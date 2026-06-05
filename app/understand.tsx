import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { Colors } from '@theme/colors';

export default function UnderstandScreen() {
  return (
    <View style={styles.root}>
      <MeshGradientBg />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FloatingCommandPill />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.creamBase },
  safe: { flex: 1 },
});
