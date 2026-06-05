import type { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -1.5,
    color: '#1A1124',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  cardBody: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
};
