import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Typography } from '@theme/typography';
import { useTheme } from '@theme/ThemeContext';

interface EditorialHeaderProps {
  title: string;
  subtitle?: string;
}

export function EditorialHeader({ title, subtitle }: EditorialHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Text adjustsFontSizeToFit numberOfLines={2} style={[Typography.h1, { color: theme.text }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[Typography.cardBody, styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
    width: '100%',
  },
  subtitle: {
    marginTop: 12,
  },
});
