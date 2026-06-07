import React from 'react';
import { Stack } from 'expo-router';

export default function ToolsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="somatic/index" />
      <Stack.Screen name="somatic/breathe" />
      <Stack.Screen name="somatic/listen" />
      <Stack.Screen name="somatic/ground" />
      <Stack.Screen name="decipher/index" />
      <Stack.Screen name="decipher/text-thread" />
      <Stack.Screen name="decipher/financial" />
      <Stack.Screen name="decipher/coercion" />
      <Stack.Screen name="decipher/cycle" />
      <Stack.Screen name="plan/index" />
      <Stack.Screen name="plan/safety-plan" />
      <Stack.Screen name="plan/legal-prep" />
      <Stack.Screen name="plan/shelter-expectations" />
      <Stack.Screen name="plan/de-escalation" />
      <Stack.Screen name="learn/index" />
      <Stack.Screen name="learn/definitions" />
      <Stack.Screen name="learn/state-laws" />
      <Stack.Screen name="learn/dating" />
      <Stack.Screen name="learn/talk-to-friend" />
      <Stack.Screen name="fake-call/index" />
      <Stack.Screen name="fake-call/waiting" options={{ gestureEnabled: false }} />
      <Stack.Screen name="fake-call/incoming" options={{ gestureEnabled: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="fake-call/incall" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
