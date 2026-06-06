// Canonical brand tokens (mirrors src/styles/colors_and_type.css)
export const Colors = {
  purpleAnchor:  '#4A148C',
  purpleHover:   '#6A1B9A',
  creamBase:     '#F5F1E8',
  creamCard:     '#EDE4CE',
  inkPrimary:    '#1A1A1A',
  inkMuted:      '#4A4A4A',
  safetyRed:     '#C62828',
  ruleLine:      '#C4B99E',
  borderGlass:   'rgba(255, 255, 255, 0.15)',
  borderDark:    'rgba(26, 17, 36, 0.1)',
  bgGlassDark:   'rgba(74, 20, 140, 0.05)',
} as const;

export type AppColors = typeof Colors;

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

export interface Theme {
  dark: boolean;
  background: string;
  surface: string;
  surfaceSolid: string;
  text: string;
  muted: string;
  faint: string;
  rule: string;
  accent: string;
  accentHover: string;
  danger: string;
}

export const LightTheme: Theme = {
  dark: false,
  background:   '#F5F1E8',
  surface:      '#EDE4CE',
  surfaceSolid: '#E8DEC7',
  text:         '#1A1A1A',
  muted:        '#4A4A4A',
  faint:        '#8A8070',
  rule:         '#C4B99E',
  accent:       '#4A148C',
  accentHover:  '#6A1B9A',
  danger:       '#C62828',
};

export const DarkTheme: Theme = {
  dark: true,
  background:   '#2A2618',
  surface:      '#37331F',
  surfaceSolid: '#3A3522',
  text:         '#F3EEDD',
  muted:        '#B6AE96',
  faint:        '#7E765F',
  rule:         '#4A442F',
  accent:       '#9F6FE3',
  accentHover:  '#B48FFF',
  danger:       '#E57373',
};
