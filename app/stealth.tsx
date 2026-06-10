import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Panic exit screen — looks like a generic weather app, cannot be
// navigated back from. Long-press anywhere (800ms) returns to the app.
export default function StealthScreen() {
  return (
    <Pressable
      style={styles.root}
      onLongPress={() => router.replace('/')}
      delayLongPress={800}
      accessibilityLabel="Weather"
    >
      <StatusBar style="light" />
      <View style={styles.body}>
        <Text style={styles.condition}>Partly Cloudy</Text>
        <Text style={styles.temp}>68°</Text>
        <View style={styles.range}>
          <Text style={styles.rangeText}>H:72°</Text>
          <Text style={styles.rangeText}>L:58°</Text>
        </View>
      </View>
      <Text style={styles.hint}>hold to return</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
  },
  condition: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  temp: {
    color: '#fff',
    fontSize: 96,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 104,
  },
  range: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 2,
  },
  rangeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '400',
  },
  hint: {
    position: 'absolute',
    bottom: 48,
    color: 'rgba(255,255,255,0.18)',
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
