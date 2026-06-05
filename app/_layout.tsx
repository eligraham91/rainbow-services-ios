import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@theme/colors';
import { useShakeToExit } from '@hooks/useShakeToExit';
import { PrivacyOverlay } from '@components/PrivacyOverlay';

// Null-render component so the hook lifecycle ties to the root tree
function ShakeWatcher() {
  useShakeToExit();
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={[styles.root, { backgroundColor: Colors.creamBase }]}>
          <StatusBar style="dark" />
          <ShakeWatcher />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade_from_bottom',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <PrivacyOverlay />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
