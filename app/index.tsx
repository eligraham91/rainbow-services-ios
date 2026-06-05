import { View, Text, StyleSheet } from 'react-native';
import { C } from '@theme/colors';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Here</Text>
      <Text style={styles.sub}>Rainbow Services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.creamBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 32,
    color: C.inkPrimary,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'System',
    fontSize: 14,
    color: C.inkMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
