// Phase 3 palette — deep editorial plum + warm stone
export const Colors = {
  purpleAnchor:  '#2D1E3D',
  creamBase:     '#F7F5F0',
  textDark:      '#1A1124',
  textLight:     '#FFFFFF',
  borderGlass:   'rgba(255, 255, 255, 0.15)',
  borderDark:    'rgba(26, 17, 36, 0.1)',
  bgGlassDark:   'rgba(45, 30, 61, 0.05)',
} as const;

export type AppColors = typeof Colors;

// Phase 1/2 tokens — kept intact for existing components
export const C = {
  creamBase:     '#F5F1E8',
  creamCard:     '#EDE4CE',
  creamCardSoft: '#F4EDDB',
  inkPrimary:    '#1A1A1A',
  inkMuted:      '#4A4A4A',
  inkCard:       '#141414',
  purpleAnchor:  '#4A148C',
  purpleHover:   '#6A1B9A',
  safetyRed:     '#C62828',
  ruleLine:      '#C4B99E',
  ruleLineSoft:  '#D8CFB5',
} as const;
