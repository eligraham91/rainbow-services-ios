import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { EditorialHeader } from '@components/ui/EditorialHeader';
import { ActionGrid } from '@components/ui/ActionGrid';
import { FloatingCommandPill } from '@components/ui/FloatingCommandPill';
import { Colors } from '@theme/colors';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.root}>
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
          <Pressable
            onPress={() => router.push('/about')}
            style={styles.aboutLink}
            accessibilityRole="link"
            accessibilityLabel="About this app"
          >
            <Text style={styles.aboutLinkText}>About this app</Text>
          </Pressable>
        </Animated.ScrollView>
      </SafeAreaView>

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
  aboutLink: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  aboutLinkText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.inkMuted,
    textDecorationLine: 'underline',
  },
});
