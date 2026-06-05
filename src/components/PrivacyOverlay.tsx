import React, { useState, useEffect } from 'react';
import { AppState, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@theme/colors';

export function PrivacyOverlay() {
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
    <View style={styles.overlay}>
      <Text style={styles.wordmark}>Start Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.creamBase,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.inkMuted,
    letterSpacing: -0.5,
  },
});
