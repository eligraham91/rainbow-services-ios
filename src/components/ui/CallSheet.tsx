import React, { useEffect } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/ThemeContext';

export interface CallContact {
  tag?: string;
  name: string;
  number: string;
  dial: string;
  note?: string;
  danger?: boolean;
}

interface CallSheetProps {
  contact: CallContact | null;
  onClose: () => void;
}

export function CallSheet({ contact, onClose }: CallSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (contact) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 180 });
      translateY.value = withTiming(400, { duration: 200 });
    }
  }, [contact]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!contact) return null;

  const callColor = contact.danger ? theme.danger : theme.accent;

  function handleCall() {
    Linking.openURL(`tel:${contact!.dial}`);
  }

  return (
    <Modal transparent animationType="none" visible={!!contact} onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, bgStyle]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: theme.surfaceSolid, paddingBottom: insets.bottom + 24 },
          sheetStyle,
        ]}
      >
        {contact.tag ? (
          <Text style={[styles.tag, { color: theme.muted }]}>{contact.tag}</Text>
        ) : null}
        <Text style={[styles.name, { color: theme.text }]}>{contact.name}</Text>
        <Text style={[styles.number, { color: theme.muted }]}>{contact.number}</Text>
        {contact.note ? (
          <Text style={[styles.note, { color: theme.muted }]}>{contact.note}</Text>
        ) : null}

        {/* Two-tap-to-call: first tap reveals confirm, second tap dials */}
        <CallButton onCall={handleCall} color={callColor} />

        <Pressable onPress={onClose} style={styles.cancel}>
          <Text style={[styles.cancelText, { color: theme.muted }]}>Cancel</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

function CallButton({ onCall, color }: { onCall: () => void; color: string }) {
  const [confirmed, setConfirmed] = React.useState(false);
  const { theme } = useTheme();

  if (confirmed) {
    return (
      <Pressable
        onPress={onCall}
        style={[styles.callBtn, { backgroundColor: color }]}
        accessibilityLabel="Confirm call"
        accessibilityRole="button"
      >
        <Text style={styles.callBtnText}>Tap to call</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => setConfirmed(true)}
      style={[styles.callBtn, { backgroundColor: theme.surface, borderWidth: 1.5, borderColor: color }]}
      accessibilityLabel="Call this number"
      accessibilityRole="button"
    >
      <Text style={[styles.callBtnText, { color }]}>Call</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropPressable: { flex: 1 },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  tag: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  name: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  number: {
    fontFamily: 'Inter',
    fontSize: 16,
    marginBottom: 8,
  },
  note: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  callBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  callBtnText: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontFamily: 'Inter',
    fontSize: 15,
  },
});
