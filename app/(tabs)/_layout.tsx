import React from 'react';
import { Tabs } from 'expo-router';
import { GlassTabBar } from '@components/GlassTabBar';

// Quick Exit lives inside GlassTabBar (rightmost button).
// This keeps it always visible without a separate overlay.
// /stealth is outside (tabs) — no chrome.

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="resources" />
      <Tabs.Screen name="tools" />
      <Tabs.Screen name="vault" />
    </Tabs>
  );
}
