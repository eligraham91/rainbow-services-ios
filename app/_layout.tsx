import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

function ShakeWatcher() {
  useShakeToExit();
  return null;
}

function AppShell() {
  const { theme, meshRgb } = useTheme();
  const scrollY = useScrollOffset();

  // Cinematic launch mask animations (Nike-style scale-and-reveal)
  const maskScale = useSharedValue(1);
  const maskOpacity = useSharedValue(1);

  useEffect(() => {
    maskScale.value = withSequence(
      withTiming(0.9, { duration: 300 }),
      withTiming(20, { duration: 800 })
    );
    maskOpacity.value = withDelay(400, withTiming(0, { duration: 600 }));
  }, []);

  const maskStyle = useAnimatedStyle(() => ({
    opacity: maskOpacity.value,
    transform: [{ scale: maskScale.value }],
  }));

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      if (data?.screen === 'fake-call-incoming') {
        router.replace({
          pathname: '/(tabs)/tools/fake-call/incoming',
          params: { callerName: String(data.callerName ?? 'Unknown') },
        });
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <MeshGradientBg />
      <ShakeWatcher />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
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

      {/* Cinematic "Scale & Reveal" Launch Mask */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: '#1A1124',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          },
          maskStyle,
        ]}
      >
        <Svg width={120} height={120} viewBox="0 0 100 100" fill="none">
          <Path
            d="M50 15 L80 30 V60 C80 75 68 85 50 90 C32 85 20 75 20 60 V30 L50 15 Z"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M38 48 C42 42, 58 42, 62 48 C66 54, 50 68, 50 68 C50 68, 34 54, 38 48 Z"
            fill="#FFFFFF"
          />
        </Svg>
      </Animated.View>
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
