import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function CompassIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.75" />
      <Path d="M14.5 9.5L12.8 13.2L9.5 14.5L11.2 10.8L14.5 9.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="1" fill={color} />
    </Svg>
  );
}

export function ToolsIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5.5" width="18" height="2.5" rx="1" fill={color} />
      <Rect x="3" y="11" width="13" height="2.5" rx="1" fill={color} />
      <Rect x="3" y="16.5" width="8" height="2.5" rx="1" fill={color} />
    </Svg>
  );
}

export function FindHelpIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="10" r="5.5" stroke={color} strokeWidth="1.75" />
      <Path d="M19 19L15.2 15.2" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M11 7.5V12.5M8.5 10H13.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function LearnIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="3" width="14" height="18" rx="1.5" stroke={color} strokeWidth="1.75" />
      <Path d="M8.5 8H15.5M8.5 12H13M8.5 16H11" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function KeepFreeIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20C12 20 4 14.5 4 9.5C4 7 6 5 8.5 5C10.2 5 11.5 5.9 12 7C12.5 5.9 13.8 5 15.5 5C18 5 20 7 20 9.5C20 14.5 12 20 12 20Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  );
}

export function PhoneIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6.5 4H9.5L11 8.5L9 10C10 12 12 14 14 15L15.5 13L20 14.5V17.5C20 18.9 18.6 20 17.2 19.7C10.3 18.6 5.4 13.7 4.3 6.8C4 5.4 5.1 4 6.5 4Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  );
}

export function SignalIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="1.5" fill={color} />
      <Path d="M8 12C8 9.8 9.8 8 12 8M16 12C16 14.2 14.2 16 12 16" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M5 12C5 7.6 8.1 4 12 4M19 12C19 16.4 15.9 20 12 20" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function ChecklistIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="3" width="14" height="18" rx="1.5" stroke={color} strokeWidth="1.75" />
      <Path d="M9 9.5L11 11.5L15 7.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 14.5H15M9 18H12" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function OpenHandIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 12V7.5a1.5 1.5 0 013 0V12" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M11 10.5V6a1.5 1.5 0 013 0v5.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M14 10.5V8a1.5 1.5 0 013 0v4" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M8 12V9.5a1.5 1.5 0 00-3 0V14c0 3.3 2.7 6 6 6h1c2.2 0 4-1.8 4-4V12" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L4 7V13C4 17.4 7.4 21.5 12 22C16.6 21.5 20 17.4 20 13V7L12 3Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HouseIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12L12 4L21 12V20H15V15H9V20H3V12Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  );
}

export function WalletIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.75" />
      <Path d="M15.5 13.5C15.5 14.3 16.2 15 17 15H20V12H17C16.2 12 15.5 12.7 15.5 13.5Z" stroke={color} strokeWidth="1.75" />
      <Path d="M2 10H22" stroke={color} strokeWidth="1.75" />
    </Svg>
  );
}

export function PhoneLockIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.75" />
      <Rect x="9.5" y="13.5" width="5" height="4.5" rx="1" stroke={color} strokeWidth="1.5" />
      <Path d="M10.5 13.5V12C10.5 11.2 11.2 10.5 12 10.5C12.8 10.5 13.5 11.2 13.5 12V13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TextBubbleIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 15C20 16.1 19.1 17 18 17H7L3 21V5C3 3.9 3.9 3 5 3H18C19.1 3 20 3.9 20 5V15Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
      <Path d="M8 9H16M8 13H13" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function PeopleIcon({ size = 24, color = '#1A1A1A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.75" />
      <Path d="M2.5 21C2.5 17.4 5.4 15 9 15C12.6 15 15.5 17.4 15.5 21" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Circle cx="17.5" cy="7.5" r="2.5" stroke={color} strokeWidth="1.5" />
      <Path d="M17.5 13C19.7 13 21.5 14.4 21.5 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 12, color = '#C4B99E' }: IconProps) {
  return (
    <Svg width={size} height={size * 1.7} viewBox="0 0 7 12" fill="none">
      <Path d="M1 1L6 6L1 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
