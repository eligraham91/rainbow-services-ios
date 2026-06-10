import React, { useState, useEffect } from 'react';
import { AppState, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';

export function PrivacyOverlay() {
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      // Render synchronously (no animation delay) going to background —
      // iOS screenshots the app before AppState fires, so we need this
      // to be as fast as possible.
      setHidden(state === 'background' || state === 'inactive');
    });
    return () => sub.remove();
  }, []);

  if (!hidden) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <Text style={[styles.wordmark, { color: theme.muted }]}>Start Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
