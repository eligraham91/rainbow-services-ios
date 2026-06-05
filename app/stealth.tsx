import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Panic exit screen — looks like a generic weather app, cannot be navigated back from.
export default function StealthScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Text style={styles.text}>Weather</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
});
