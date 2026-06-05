// Canonical brand tokens (mirrors src/styles/colors_and_type.css)
export const Colors = {
  purpleAnchor:  '#4A148C',   // --purple-anchor
  purpleHover:   '#6A1B9A',   // --purple-hover
  creamBase:     '#F5F1E8',   // --cream-base
  creamCard:     '#EDE4CE',   // --cream-card
  inkPrimary:    '#1A1A1A',   // --ink-primary
  inkMuted:      '#4A4A4A',   // --ink-muted
  safetyRed:     '#C62828',   // --safety-red (DV safety messaging only)
  ruleLine:      '#C4B99E',   // --rule-line
  // Glass overlay helpers
  borderGlass:   'rgba(255, 255, 255, 0.15)',
  borderDark:    'rgba(26, 17, 36, 0.1)',
  bgGlassDark:   'rgba(74, 20, 140, 0.05)',
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
