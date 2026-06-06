import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  InterTight_700Bold,
  InterTight_800ExtraBold,
  InterTight_900Black,
} from '@expo-google-fonts/inter-tight';
import { useShakeToExit } from '@hooks/useShakeToExit';
import { PrivacyOverlay } from '@components/PrivacyOverlay';
import { MeshGradientBg } from '@components/MeshGradientBg';
import { ThemeProvider, useTheme } from '@theme/ThemeContext';
import { ScrollOffsetProvider, useScrollOffset } from '@components/ScrollContext';

function ShakeWatcher() {
  useShakeToExit();
  return null;
}

function AppShell() {
  const { theme } = useTheme();
  const scrollY = useScrollOffset();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <MeshGradientBg dark={theme.dark} scrollY={scrollY} />
      <ShakeWatcher />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="emergency" options={{ presentation: 'modal' }} />
        <Stack.Screen name="support" options={{ presentation: 'modal' }} />
        <Stack.Screen name="about" options={{ presentation: 'modal' }} />
        <Stack.Screen name="stealth" options={{ headerShown: false, animation: 'none' }} />
      </Stack>
      <PrivacyOverlay />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
    Inter_400Regular,
    Inter: Inter_400Regular,
    Inter_600SemiBold,
    InterTight_700Bold,
    InterTight_800ExtraBold,
    'InterTight-ExtraBold': InterTight_800ExtraBold,
    InterTight_900Black,
  });

  void fontsLoaded;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ScrollOffsetProvider>
            <AppShell />
          </ScrollOffsetProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
