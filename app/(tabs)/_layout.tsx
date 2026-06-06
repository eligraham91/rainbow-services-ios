import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { GlassTabBar } from '@components/GlassTabBar';
import { QuickExitButton } from '@components/QuickExitButton';

// Single Quick Exit overlay covers all tab roots + nested tools stacks.
// Root modals (emergency/support/about) render it via ScreenScaffold.
// /stealth is outside (tabs) and has no chrome.

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }} pointerEvents="box-none">
      <Tabs
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="resources" />
        <Tabs.Screen name="tools" />
        <Tabs.Screen name="vault" />
      </Tabs>

      {/* Persistent Quick Exit — floats above all tab content */}
      <View
        style={{ position: 'absolute', inset: 0 }}
        pointerEvents="box-none"
      >
        <QuickExitButton />
      </View>
    </View>
  );
}
