import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Typography } from '@theme/typography';

interface EditorialHeaderProps {
  title: string;
  subtitle?: string;
}

export function EditorialHeader({ title, subtitle }: EditorialHeaderProps) {
  return (
    <View style={styles.container}>
      <Text adjustsFontSizeToFit numberOfLines={2} style={Typography.h1}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[Typography.cardBody, styles.subtitle]}>{subtitle}</Text>
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
    color: 'rgba(26, 17, 36, 0.6)',
  },
});
