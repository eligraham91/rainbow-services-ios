import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CompassIcon, ToolsIcon, FindHelpIcon } from '@components/Icons';
import { Colors } from '@theme/colors';

const PRESS_SPRING = { mass: 1, stiffness: 220, damping: 16 } as const;
const RELEASE_SPRING = { mass: 1, stiffness: 300, damping: 24 } as const;

interface PillTab {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  action: () => void;
}

function PillButton({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, PRESS_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    runOnJS(onPress)();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.pillBtn}
    >
      <Animated.View style={[styles.pillBtnInner, animatedStyle]}>
        <Icon size={22} color="rgba(255,255,255,0.92)" />
        <Text style={styles.pillBtnLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function PanicExitButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.88, PRESS_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    runOnJS(onPress)();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel="Quick exit — leaves this app immediately"
      style={styles.exitBtn}
    >
      <Animated.View style={[styles.exitBtnInner, animatedStyle]}>
        <Text style={styles.exitBtnText}>✕</Text>
      </Animated.View>
    </Pressable>
  );
}

export function FloatingCommandPill() {
  const router = useRouter();

  const tabs: PillTab[] = [
    {
      id: 'start',
      label: 'Start',
      Icon: CompassIcon,
      action: () => router.push('/'),
    },
    {
      id: 'tools',
      label: 'Tools',
      Icon: ToolsIcon,
      action: () => router.push('/vault'),
    },
    {
      id: 'findhelp',
      label: 'Find Help',
      Icon: FindHelpIcon,
      action: () => router.push('/resources'),
    },
  ];

  const pillContent = (
    <View style={styles.pillRow}>
      {tabs.map((tab) => (
        <PillButton
          key={tab.id}
          label={tab.label}
          Icon={tab.Icon}
          onPress={tab.action}
        />
      ))}
      <PanicExitButton onPress={() => router.replace('/stealth')} />
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <BlurView
          intensity={90}
          tint="dark"
          style={styles.pill}
        >
          {pillContent}
        </BlurView>
      </View>
    );
  }

  // Android fallback — semi-opaque dark bg
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={[styles.pill, styles.pillAndroid]}>
        {pillContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  pill: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillAndroid: {
    backgroundColor: 'rgba(20, 10, 36, 0.88)',
  },
  pillRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  pillBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pillBtnInner: {
    alignItems: 'center',
    gap: 3,
  },
  pillBtnLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  exitBtn: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  exitBtnInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.safetyRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
});
