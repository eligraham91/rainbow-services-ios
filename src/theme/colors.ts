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

// Curated accent hues (EXPERIENCE-2026.md §1.4). Each ships pre-checked for
// WCAG AA contrast against both theme backgrounds. The danger red is never
// offered — safety messaging must never blend in.
export interface AccentChoice {
  id: string;
  label: string;
  light: { accent: string; accentHover: string };
  dark: { accent: string; accentHover: string };
  // Mesh blob tint, as 'r,g,b' for rgba() interpolation
  meshLight: string;
  meshDark: string;
}

export const ACCENT_CHOICES: AccentChoice[] = [
  {
    id: 'violet',
    label: 'Violet',
    light: { accent: '#4A148C', accentHover: '#6A1B9A' },
    dark: { accent: '#9F6FE3', accentHover: '#B48FFF' },
    meshLight: '90,55,170',
    meshDark: '140,90,220',
  },
  {
    id: 'teal',
    label: 'Deep teal',
    light: { accent: '#00585C', accentHover: '#00767B' },
    dark: { accent: '#5FC4C9', accentHover: '#82DCE0' },
    meshLight: '20,110,115',
    meshDark: '70,170,175',
  },
  {
    id: 'ember',
    label: 'Ember',
    light: { accent: '#8A3B12', accentHover: '#A84E1E' },
    dark: { accent: '#E59A6B', accentHover: '#F0B189' },
    meshLight: '170,85,40',
    meshDark: '210,140,90',
  },
  {
    id: 'forest',
    label: 'Forest',
    light: { accent: '#1F4D2E', accentHover: '#2D6B41' },
    dark: { accent: '#85C49A', accentHover: '#A1D6B2' },
    meshLight: '50,110,70',
    meshDark: '110,180,135',
  },
  {
    id: 'slate',
    label: 'Slate blue',
    light: { accent: '#2C4A6E', accentHover: '#3D6190' },
    dark: { accent: '#8FB4DC', accentHover: '#ABC8E8' },
    meshLight: '60,100,150',
    meshDark: '120,160,210',
  },
  {
    id: 'plum',
    label: 'Plum',
    light: { accent: '#6B1E4F', accentHover: '#8A2A68' },
    dark: { accent: '#D98BBB', accentHover: '#E5A8CD' },
    meshLight: '130,45,100',
    meshDark: '190,110,160',
  },
];

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
