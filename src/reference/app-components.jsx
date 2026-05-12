import React from "react";
// app-components.jsx — Start Here · Rainbow Services
// Shared components: colors, icons, layout primitives

const C = {
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
};

// ── Layout primitives ─────────────────────────────────────────
function StatusBarSpacer() {
  return React.createElement('div', { style: { height: 62, flexShrink: 0 } });
}

function HRule() {
  return React.createElement('div', { style: { height: 1, background: C.ruleLine, margin: '16px 0', flexShrink: 0 } });
}

function SectionLabel({ text }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500, fontSize: 10,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: C.inkMuted, marginBottom: 8, marginTop: 20,
    }}>{text}</div>
  );
}

// ── Core brand components ─────────────────────────────────────
function Eyebrow({ text, light = false }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500, fontSize: 10,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: light ? 'rgba(245,241,232,0.4)' : C.inkMuted,
      marginBottom: 14,
    }}>[ {text} ]</div>
  );
}

function QuickExitPill({ onExit }) {
  return (
    <button
      onClick={onExit}
      aria-label="Quick Exit to neutral website"
      style={{
        background: C.safetyRed, color: '#fff',
        border: 'none', borderRadius: 999,
        padding: '6px 12px',
        fontSize: 10, fontFamily: "'Inter Tight', sans-serif",
        fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(198,40,40,0.3)',
      }}
    >
      <span style={{ fontSize: 9 }}>✕</span> EXIT
    </button>
  );
}

function AppHeader({ onExit, showBack = false, onBack }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px 10px',
      borderBottom: `1px solid ${C.ruleLine}`,
      flexShrink: 0, background: C.creamBase,
    }}>
      {showBack ? (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', padding: '4px 0',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          color: C.purpleAnchor,
          fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 500,
        }}>← Back</button>
      ) : (
        <div>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
            fontSize: 13, letterSpacing: '-0.01em', color: C.inkPrimary,
          }}>RAINBOW SERVICES</div>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 8, fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: C.inkMuted, marginTop: 1,
          }}>START HERE · Private mode on</div>
        </div>
      )}
      <QuickExitPill onExit={onExit} />
    </div>
  );
}

function BottomNav({ activeTab, onTab }) {
  const tabs = [
    { id: 'start',    label: 'Start',     Icon: CompassIcon },
    { id: 'tools',    label: 'Tools',     Icon: ToolsIcon },
    { id: 'findhelp', label: 'Find Help', Icon: FindHelpIcon },
    { id: 'learn',    label: 'Learn',     Icon: LearnIcon },
    { id: 'keepfree', label: 'Keep Free', Icon: KeepFreeIcon },
  ];
  return (
    <div style={{
      display: 'flex',
      borderTop: `1px solid ${C.ruleLine}`,
      background: C.creamBase,
      flexShrink: 0,
      paddingBottom: 22,
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => onTab(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            padding: '9px 2px 5px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <Icon size={20} color={active ? C.purpleAnchor : C.inkMuted} />
            <span style={{
              fontSize: 9, fontFamily: "'Inter', sans-serif",
              fontWeight: active ? 600 : 400, letterSpacing: '0.04em',
              color: active ? C.purpleAnchor : C.inkMuted,
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Buttons ───────────────────────────────────────────────────
function PrimaryButton({ label, onClick, disabled = false }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: '100%', height: 52,
        background: disabled
          ? '#B0A8C0'
          : pressed
            ? 'linear-gradient(180deg, #7B1FA2 0%, #4A148C 100%)'
            : 'linear-gradient(180deg, #6A1B9A 0%, #4A148C 100%)',
        color: C.creamBase, border: 'none', borderRadius: 8,
        fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.12s',
        transform: pressed ? 'translateY(1px)' : 'none',
        boxShadow: disabled ? 'none' : '0 1px 0 rgba(255,255,255,0.12) inset, 0 2px 10px rgba(74,20,140,0.28)',
      }}
    >{label}</button>
  );
}

function SecondaryButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 48,
      background: 'transparent', color: C.inkPrimary,
      border: `1px solid ${C.ruleLine}`, borderRadius: 4,
      fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14,
      cursor: 'pointer',
    }}>{label}</button>
  );
}

function TextButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none',
      color: C.inkMuted, fontSize: 13,
      fontFamily: "'Inter', sans-serif", cursor: 'pointer',
      textDecoration: 'underline', textUnderlineOffset: 2,
      padding: '4px 0',
    }}>{label}</button>
  );
}

// ── Form components ───────────────────────────────────────────
function PrivacyCheck({ text, isLast = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: isLast ? 'none' : `1px solid ${C.ruleLineSoft}`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 2,
        background: C.purpleAnchor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4L4 7L10 1" stroke={C.creamBase} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13, color: C.inkPrimary, lineHeight: 1.4,
      }}>{text}</span>
    </div>
  );
}

function ConditionChip({ text, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 14px',
      background: selected ? 'rgba(74,20,140,0.07)' : C.creamCard,
      border: `1px solid ${selected ? C.purpleAnchor : C.ruleLine}`,
      borderRadius: 4, cursor: 'pointer', textAlign: 'left', width: '100%',
      fontFamily: "'Inter', sans-serif",
      fontSize: 13, color: selected ? C.purpleAnchor : C.inkPrimary,
      fontWeight: selected ? 500 : 400, lineHeight: 1.4,
      transition: 'all 0.1s',
    }}>{text}</button>
  );
}

function NextStepPanel({ number, title, children, accent = false }) {
  return (
    <div style={{
      background: accent ? 'rgba(74,20,140,0.04)' : C.creamCard,
      border: `1px solid ${accent ? 'rgba(74,20,140,0.18)' : C.ruleLine}`,
      borderRadius: 4, padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 2,
          background: C.purpleAnchor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontFamily: "'Inter Tight', sans-serif",
          fontSize: 11, fontWeight: 800, color: C.creamBase,
        }}>{number}</div>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 700, fontSize: 14, color: C.inkPrimary,
          lineHeight: 1.3, paddingTop: 3,
        }}>{title}</div>
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13, color: C.inkMuted, lineHeight: 1.55,
        paddingLeft: 32,
      }}>{children}</div>
    </div>
  );
}

function ToolCard({ title, description, Icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 16px',
      background: C.creamCard, border: `1px solid ${C.ruleLine}`,
      borderRadius: 4, cursor: 'pointer', textAlign: 'left',
      width: '100%', marginBottom: 8,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 4,
        background: C.creamCardSoft, border: `1px solid ${C.ruleLineSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={17} color={C.inkPrimary} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600, fontSize: 14, color: C.inkPrimary, marginBottom: 2,
        }}>{title}</div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11, color: C.inkMuted, lineHeight: 1.3,
        }}>{description}</div>
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke={C.ruleLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ── Icons (thin rounded stroke, 1.75px, ink) ─────────────────
function CompassIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.75"/>
      <path d="M14.5 9.5L12.8 13.2L9.5 14.5L11.2 10.8L14.5 9.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1" fill={color}/>
    </svg>
  );
}
function ToolsIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5.5" width="18" height="2.5" rx="1" fill={color}/>
      <rect x="3" y="11" width="13" height="2.5" rx="1" fill={color}/>
      <rect x="3" y="16.5" width="8" height="2.5" rx="1" fill={color}/>
    </svg>
  );
}
function FindHelpIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="10" r="5.5" stroke={color} strokeWidth="1.75"/>
      <path d="M19 19L15.2 15.2" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M11 7.5V12.5M8.5 10H13.5" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function LearnIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="1.5" stroke={color} strokeWidth="1.75"/>
      <path d="M8.5 8H15.5M8.5 12H13M8.5 16H11" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function KeepFreeIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 20C12 20 4 14.5 4 9.5C4 7 6 5 8.5 5C10.2 5 11.5 5.9 12 7C12.5 5.9 13.8 5 15.5 5C18 5 20 7 20 9.5C20 14.5 12 20 12 20Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round"/>
    </svg>
  );
}
function PhoneIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6.5 4H9.5L11 8.5L9 10C10 12 12 14 14 15L15.5 13L20 14.5V17.5C20 18.9 18.6 20 17.2 19.7C10.3 18.6 5.4 13.7 4.3 6.8C4 5.4 5.1 4 6.5 4Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round"/>
    </svg>
  );
}
function SignalIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="1.5" fill={color}/>
      <path d="M8 12C8 9.8 9.8 8 12 8M16 12C16 14.2 14.2 16 12 16" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M5 12C5 7.6 8.1 4 12 4M19 12C19 16.4 15.9 20 12 20" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function ChecklistIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="1.5" stroke={color} strokeWidth="1.75"/>
      <path d="M9 9.5L11 11.5L15 7.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14.5H15M9 18H12" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function OpenHandIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 12V7.5a1.5 1.5 0 013 0V12" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M11 10.5V6a1.5 1.5 0 013 0v5.5" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M14 10.5V8a1.5 1.5 0 013 0v4" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M8 12V9.5a1.5 1.5 0 00-3 0V14c0 3.3 2.7 6 6 6h1c2.2 0 4-1.8 4-4V12" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ShieldIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L4 7V13C4 17.4 7.4 21.5 12 22C16.6 21.5 20 17.4 20 13V7L12 3Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function HouseIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 4L21 12V20H15V15H9V20H3V12Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round"/>
    </svg>
  );
}
function WalletIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.75"/>
      <path d="M15.5 13.5C15.5 14.3 16.2 15 17 15H20V12H17C16.2 12 15.5 12.7 15.5 13.5Z" stroke={color} strokeWidth="1.75"/>
      <path d="M2 10H22" stroke={color} strokeWidth="1.75"/>
    </svg>
  );
}
function PhoneLockIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.75"/>
      <rect x="9.5" y="13.5" width="5" height="4.5" rx="1" stroke={color} strokeWidth="1.5"/>
      <path d="M10.5 13.5V12C10.5 11.2 11.2 10.5 12 10.5C12.8 10.5 13.5 11.2 13.5 12V13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function TextBubbleIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 15C20 16.1 19.1 17 18 17H7L3 21V5C3 3.9 3.9 3 5 3H18C19.1 3 20 3.9 20 5V15Z" stroke={color} strokeWidth="1.75" strokeLinejoin="round"/>
      <path d="M8 9H16M8 13H13" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}
function PeopleIcon({ size = 24, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.75"/>
      <path d="M2.5 21C2.5 17.4 5.4 15 9 15C12.6 15 15.5 17.4 15.5 21" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="17.5" cy="7.5" r="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M17.5 13C19.7 13 21.5 14.4 21.5 17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── iOS-style gradient app icon ───────────────────────────────
function AppIcon({ Icon, gradient, size = 36 }) {
  const r = Math.round(size * 0.22);
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.07)',
      flexShrink: 0,
    }}>
      <Icon size={Math.round(size * 0.52)} color="#fff" />
    </div>
  );
}

// ── Map components (Find Help) ────────────────────────────────
function MapBackground() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 353 160"
      style={{ position: 'absolute', inset: 0 }}
      preserveAspectRatio="xMidYMid slice">
      <rect width="353" height="160" fill="#ECE7D6"/>
      {/* horizontal streets */}
      <rect x="0" y="52" width="353" height="8" fill="#F2EDE0"/>
      <rect x="0" y="96" width="353" height="8" fill="#F2EDE0"/>
      <rect x="0" y="136" width="353" height="8" fill="#F2EDE0"/>
      {/* vertical streets */}
      <rect x="68" y="0" width="8" height="160" fill="#F2EDE0"/>
      <rect x="143" y="0" width="8" height="160" fill="#F2EDE0"/>
      <rect x="208" y="0" width="8" height="160" fill="#F2EDE0"/>
      <rect x="278" y="0" width="8" height="160" fill="#F2EDE0"/>
      {/* building blocks */}
      <rect x="1" y="1" width="65" height="49" fill="#E0DACA" rx="1"/>
      <rect x="78" y="1" width="63" height="49" fill="#E0DACA" rx="1"/>
      <rect x="1" y="62" width="65" height="32" fill="#E0DACA" rx="1"/>
      <rect x="78" y="62" width="63" height="32" fill="#E0DACA" rx="1"/>
      <rect x="1" y="106" width="65" height="28" fill="#E0DACA" rx="1"/>
      <rect x="78" y="106" width="63" height="28" fill="#E0DACA" rx="1"/>
      <rect x="153" y="1" width="53" height="49" fill="#E0DACA" rx="1"/>
      {/* park */}
      <rect x="153" y="62" width="53" height="32" fill="#C8DCA8" rx="2"/>
      <rect x="153" y="106" width="53" height="28" fill="#E0DACA" rx="1"/>
      <rect x="218" y="1" width="58" height="49" fill="#E0DACA" rx="1"/>
      <rect x="218" y="62" width="58" height="32" fill="#E0DACA" rx="1"/>
      <rect x="218" y="106" width="58" height="28" fill="#E0DACA" rx="1"/>
      <rect x="288" y="1" width="64" height="49" fill="#E0DACA" rx="1"/>
      <rect x="288" y="62" width="64" height="32" fill="#E0DACA" rx="1"/>
      <rect x="288" y="106" width="64" height="28" fill="#E0DACA" rx="1"/>
    </svg>
  );
}

function MapPin({ x, y, primary = false }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -100%)',
      zIndex: 2, pointerEvents: 'none',
    }}>
      <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
        <path d="M9 0C4 0 0 4 0 9C0 15.5 9 24 9 24C9 24 18 15.5 18 9C18 4 14 0 9 0Z"
          fill={primary ? '#C62828' : '#4A148C'}/>
        <circle cx="9" cy="9" r="3.5" fill="white" opacity="0.88"/>
      </svg>
    </div>
  );
}

export {
  C, StatusBarSpacer, HRule, SectionLabel,
  Eyebrow, QuickExitPill, AppHeader, BottomNav,
  PrimaryButton, SecondaryButton, TextButton,
  PrivacyCheck, ConditionChip, NextStepPanel, ToolCard,
  AppIcon, MapBackground, MapPin,
  CompassIcon, ToolsIcon, FindHelpIcon, LearnIcon, KeepFreeIcon,
  PhoneIcon, SignalIcon, ChecklistIcon, OpenHandIcon, ShieldIcon,
  HouseIcon, WalletIcon, PhoneLockIcon, TextBubbleIcon, PeopleIcon,
};
