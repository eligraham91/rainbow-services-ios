import React, { useState } from "react";
import {
  C, StatusBarSpacer, HRule, SectionLabel,
  Eyebrow, QuickExitPill, AppHeader, BottomNav,
  PrimaryButton, SecondaryButton, TextButton,
  PrivacyCheck, ConditionChip, NextStepPanel, ToolCard,
  CompassIcon, ToolsIcon, FindHelpIcon, LearnIcon, KeepFreeIcon,
  PhoneIcon, SignalIcon, ChecklistIcon, OpenHandIcon, ShieldIcon,
  HouseIcon, WalletIcon, PhoneLockIcon, TextBubbleIcon, PeopleIcon,
  AppIcon, MapBackground, MapPin,
} from "./app-components";

// ── Onboarding 1: Welcome ─────────────────────────────────────
function OnboardingWelcome({ onNext, onExit }) {
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setStep(1), 380);
    return () => clearTimeout(t);
  }, []);

  const vis = (atStep) => ({
    opacity: step >= atStep ? 1 : 0,
    transform: step >= atStep ? 'none' : 'translateY(12px)',
    transition: 'opacity 0.55s ease, transform 0.55s ease',
    pointerEvents: step >= atStep ? 'auto' : 'none',
  });

  const advance = () => setStep(s => Math.min(s + 1, 6));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', flexShrink: 0 }}>
        <QuickExitPill onExit={onExit} />
      </div>

      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column' }}>

        {/* Eyebrow — auto, step 1 */}
        <div style={{ ...vis(1), marginBottom: 16 }}>
          <Eyebrow text="01 / START HERE" />
        </div>

        {/* Headline — step 2 */}
        <div style={{ ...vis(2), marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
            fontSize: 30, lineHeight: 1.06, letterSpacing: '-0.025em',
            color: C.inkPrimary, margin: 0,
          }}>
            When you do not know<br />what to do,<br />start here.
          </h1>
        </div>

        {/* Body para 1 — step 3 */}
        <div style={{ ...vis(3), marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            lineHeight: 1.65, color: C.inkMuted, margin: 0,
          }}>
            Free, private tools for unsafe relationship situations — for people trying to understand what is happening, and for people helping someone else.
          </p>
        </div>

        {/* Body para 2 — step 4 */}
        <div style={{ ...vis(4), marginBottom: 16 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            lineHeight: 1.65, color: C.inkMuted, margin: 0,
          }}>
            No account required. Nothing is saved by default. You stay in control of what you share and when.
          </p>
        </div>

        {/* Body para 3 — step 5 */}
        <div style={vis(5)}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            lineHeight: 1.65, color: C.inkMuted, margin: 0,
          }}>
            Start here to find support, safety tools, and one clear next step — privately, on your terms.
          </p>
        </div>

        <div style={{ flex: 1 }} />

        {/* Bottom action: advance button or final CTA */}
        <div style={{ marginBottom: 18 }}>
          {step >= 6 ? (
            <div style={{ animation: 'fadeUp 0.4s ease both', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <PrimaryButton label="Begin privately" onClick={onNext} />
              <div style={{ textAlign: 'center' }}>
                <TextButton label="How this app protects privacy" onClick={() => {}} />
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex', justifyContent: 'center',
              opacity: step >= 1 ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}>
              <button
                onClick={advance}
                style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: 'linear-gradient(150deg, #7C1FA3 0%, #3A0068 55%, #0A0015 100%)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(74,20,140,0.38)',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10H15M15 10L10.5 5.5M15 10L10.5 14.5"
                    stroke="white" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '12px 24px 24px',
        borderTop: `1px solid ${C.ruleLineSoft}`,
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.inkMuted,
          textAlign: 'center', lineHeight: 1.55, margin: 0,
        }}>
          If you are in immediate danger, call 911. If your device is monitored, use a safer device when possible.
        </p>
      </div>
    </div>
  );
}

// ── Onboarding 2: Privacy ─────────────────────────────────────
function OnboardingPrivacy({ onNext, onExit }) {
  const checks = [
    'No account required',
    'Clear local activity anytime',
    'Quick Exit always visible',
    'No sensitive inputs stored by default',
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', flexShrink: 0 }}>
        <QuickExitPill onExit={onExit} />
      </div>

      <div style={{ flex: 1, padding: '8px 28px', overflowY: 'auto' }}>
        <Eyebrow text="02 / PRIVACY" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 14px',
        }}>
          No account.<br />No saved answers<br />by default.
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6,
          color: C.inkMuted, margin: '0 0 22px',
        }}>
          You can use all tools without creating a profile. Sensitive answers are not saved unless you choose to save them.
        </p>

        <div style={{
          background: C.creamCard, border: `1px solid ${C.ruleLine}`,
          borderRadius: 4, padding: '0 16px', marginBottom: 16,
        }}>
          {checks.map((t, i) => <PrivacyCheck key={t} text={t} isLast={i === checks.length - 1} />)}
        </div>

        <div style={{
          background: C.creamCardSoft, border: `1px solid ${C.ruleLineSoft}`,
          borderRadius: 4, padding: '12px 14px', marginBottom: 24,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ color: C.inkMuted, fontSize: 13, flexShrink: 0 }}>⚠</span>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: C.inkMuted, margin: 0, lineHeight: 1.55,
          }}>
            Internet activity can be tracked. If your device or accounts may be monitored, consider using a safer device.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
          <PrimaryButton label="Continue" onClick={onNext} />
          <div style={{ textAlign: 'center' }}>
            <TextButton label="See safe-use tips" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Onboarding 3: Choose Mode ─────────────────────────────────
function OnboardingMode({ onContinue, onExit }) {
  const [selected, setSelected] = useState(null);
  const modes = [
    { id: 'help-now', title: 'I need help now', desc: 'Find immediate support, hotline options, and safety steps.', Icon: PhoneIcon, urgent: true, gradient: 'linear-gradient(145deg, #E53935 0%, #B71C1C 100%)' },
    { id: 'understand', title: 'I am trying to understand', desc: 'Check patterns of control, messages, money, and fear.', Icon: SignalIcon, gradient: 'linear-gradient(145deg, #7B1FA2 0%, #4A148C 100%)' },
    { id: 'plan', title: 'I am making a plan', desc: 'Prepare around documents, money, children, pets, and transportation.', Icon: ChecklistIcon, gradient: 'linear-gradient(145deg, #1E88E5 0%, #1565C0 100%)' },
    { id: 'helping', title: 'I am helping someone else', desc: 'Learn what to say, what not to say, and how to share support safely.', Icon: OpenHandIcon, gradient: 'linear-gradient(145deg, #43A047 0%, #2E7D32 100%)' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px', flexShrink: 0 }}>
        <QuickExitPill onExit={onExit} />
      </div>

      <div style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
        <div style={{ padding: '0 8px' }}>
          <Eyebrow text="03 / CHOOSE A MODE" />
          <h2 style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
            fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: C.inkPrimary, margin: '0 0 20px',
          }}>What brings you here?</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {modes.map(({ id, title, desc, Icon, urgent, gradient }) => {
            const active = selected === id;
            return (
              <button key={id} onClick={() => setSelected(id)} style={{
                width: '100%', background: active ? 'rgba(74,20,140,0.06)' : C.creamCard,
                border: `1px solid ${active ? C.purpleAnchor : C.ruleLine}`,
                borderRadius: 10, padding: '14px 16px',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                transition: 'all 0.12s', position: 'relative',
                boxShadow: active ? '0 0 0 3px rgba(74,20,140,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                {urgent && <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 6, height: 6, borderRadius: '50%', background: C.safetyRed,
                }} />}
                <AppIcon Icon={Icon} gradient={gradient} size={36} />
                <div>
                  <div style={{
                    fontFamily: "'Inter Tight', sans-serif", fontWeight: 700,
                    fontSize: 15, color: active ? C.purpleAnchor : C.inkPrimary,
                    marginBottom: 4, lineHeight: 1.2,
                  }}>{title}</div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12,
                    color: C.inkMuted, lineHeight: 1.4,
                  }}>{desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div style={{ marginBottom: 12, animation: 'fadeUp 0.18s ease' }}>
            <PrimaryButton label="Build my next step" onClick={() => onContinue(selected)} />
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <TextButton label="Skip for now" onClick={() => onContinue(null)} />
        </div>
      </div>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────
function HomeScreen({ onNavigate, onTab, onExit, activeTab }) {
  const cards = [
    { id: 'help-now', title: 'I need help now', desc: 'Immediate support, hotline, and safety steps.', Icon: PhoneIcon, urgent: true,  gradient: 'linear-gradient(145deg, #E53935 0%, #B71C1C 100%)' },
    { id: 'understand', title: 'I am trying to understand', desc: 'Check patterns of control and fear.', Icon: SignalIcon,  gradient: 'linear-gradient(145deg, #7B1FA2 0%, #4A148C 100%)' },
    { id: 'plan', title: 'I am making a plan', desc: 'Documents, money, children, pets, transport.', Icon: ChecklistIcon, gradient: 'linear-gradient(145deg, #1E88E5 0%, #1565C0 100%)' },
    { id: 'helping', title: 'I am helping someone else', desc: 'What to say and how to help safely.', Icon: OpenHandIcon, gradient: 'linear-gradient(145deg, #43A047 0%, #2E7D32 100%)' },
  ];
  const quickTools = ['Pattern Decoder', 'Text Decoder', 'Phone Safety', 'Safe Packing', 'Friend Scripts'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
        <Eyebrow text="START HERE" />
        <h1 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.025em',
          color: C.inkPrimary, margin: '0 0 8px',
        }}>What is happening?</h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: C.inkMuted, margin: '0 0 20px', lineHeight: 1.5,
        }}>Choose what feels closest. You do not need the perfect words.</p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, marginBottom: 24,
        }}>
          {cards.map(({ id, title, desc, Icon, urgent, gradient }) => (
            <button key={id} onClick={() => onNavigate('situation')} style={{
              background: C.creamCard, border: `1px solid ${C.ruleLine}`,
              borderRadius: 10, padding: '14px 12px',
              textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 10,
              position: 'relative', transition: 'border-color 0.12s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              {urgent && <div style={{
                position: 'absolute', top: 10, right: 10,
                width: 6, height: 6, borderRadius: '50%', background: C.safetyRed,
              }} />}
              <AppIcon Icon={Icon} gradient={gradient} size={36} />
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontWeight: 700,
                fontSize: 13, color: C.inkPrimary, lineHeight: 1.25,
              }}>{title}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 11,
                color: C.inkMuted, lineHeight: 1.35,
              }}>{desc}</div>
            </button>
          ))}
        </div>

        <HRule />
        <SectionLabel text="Popular tools" />
        <div style={{
          background: C.creamCard, border: `1px solid ${C.ruleLine}`,
          borderRadius: 4, overflow: 'hidden', marginBottom: 20,
        }}>
          {quickTools.map((tool, i) => (
            <button key={tool} onClick={() => onTab('tools')} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: i < quickTools.length - 1 ? `1px solid ${C.ruleLineSoft}` : 'none',
              width: '100%', textAlign: 'left',
            }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.inkPrimary }}>
                {tool}
              </span>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke={C.ruleLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <div style={{
          background: C.inkPrimary, borderRadius: 4, padding: '16px',
          marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontWeight: 800,
              fontSize: 13, color: C.creamBase, marginBottom: 4,
            }}>Free tools stay free when people give.</div>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11,
              color: 'rgba(245,241,232,0.55)',
            }}>Support Rainbow Services</div>
          </div>
          <button onClick={() => onTab('keepfree')} style={{
            background: C.purpleAnchor, color: C.creamBase,
            border: 'none', borderRadius: 4, padding: '8px 14px',
            fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600,
            cursor: 'pointer', flexShrink: 0,
          }}>Support</button>
        </div>
        <div style={{ height: 8 }} />
      </div>

      <BottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  );
}

// ── Situation Builder ─────────────────────────────────────────
function SituationBuilder({ onBack, onContinue, onExit }) {
  const [selected, setSelected] = useState([]);
  const conditions = [
    { id: 'safe-tonight', text: 'I may need somewhere safe tonight', high: true },
    { id: 'not-ready', text: 'I am not ready to leave' },
    { id: 'monitored', text: 'My phone or accounts may be monitored', high: true },
    { id: 'money', text: 'Money is being controlled' },
    { id: 'children', text: 'Children are involved' },
    { id: 'pet', text: 'A pet is involved' },
    { id: 'legal', text: 'I need help with court or a restraining order' },
    { id: 'no-call', text: 'I cannot safely make a phone call', high: true },
    { id: 'someone-else', text: 'I am worried about someone else' },
    { id: 'not-sure', text: 'I do not know if this is abuse' },
  ];
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const hasHighRisk = selected.some(id => conditions.find(c => c.id === id)?.high);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} showBack onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="SITUATION BUILDER" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 8px',
        }}>Select anything that applies right now.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: C.inkMuted, margin: '0 0 20px', lineHeight: 1.5,
        }}>You can choose more than one. Skip anything that does not fit.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conditions.map(({ id, text, high }) => (
            <div key={id} style={{ position: 'relative' }}>
              {high && (
                <div style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 5, height: 5, borderRadius: '50%', background: C.safetyRed, zIndex: 1,
                  pointerEvents: 'none',
                }} />
              )}
              <ConditionChip text={text} selected={selected.includes(id)} onClick={() => toggle(id)} />
            </div>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>

      <div style={{
        padding: '12px 20px 20px',
        borderTop: `1px solid ${selected.length > 0 ? C.ruleLine : 'transparent'}`,
        background: C.creamBase, flexShrink: 0,
        transition: 'border-color 0.15s',
      }}>
        {selected.length > 0 ? (
          <PrimaryButton
            label={`Build my next step · ${selected.length} selected`}
            onClick={() => onContinue(selected, hasHighRisk)}
          />
        ) : (
          <div style={{
            height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.inkMuted,
            }}>Select at least one to continue</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Safety Check Interstitial ─────────────────────────────────
function SafetyCheck({ onBack, onContinue, onExit }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.inkCard }}>
      <StatusBarSpacer />
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 20px', flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          color: 'rgba(245,241,232,0.45)',
          fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 500,
        }}>← Back</button>
        <QuickExitPill onExit={onExit} />
      </div>

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        <Eyebrow text="BEFORE YOU CONTINUE" light />

        <div style={{
          width: 48, height: 48, borderRadius: 8,
          background: 'rgba(245,241,232,0.07)',
          border: '1px solid rgba(245,241,232,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <ShieldIcon size={24} color="rgba(245,241,232,0.65)" />
        </div>

        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.creamBase, margin: '0 0 14px',
        }}>Before you continue</h2>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.65,
          color: 'rgba(245,241,232,0.6)', margin: '0 0 28px',
        }}>
          It looks like your situation may include some urgent elements. If someone monitors this device, consider using a safer phone or browser first. You can exit anytime.
        </p>

        <div style={{
          background: 'rgba(245,241,232,0.05)',
          border: '1px solid rgba(245,241,232,0.09)',
          borderRadius: 4, padding: '14px 16px', marginBottom: 28,
        }}>
          {[
            'The EXIT button closes the app immediately',
            'Your answers are not saved to this device',
            'Hotline: 310-547-9343 · National: 1-800-799-7233',
          ].map((note, i, arr) => (
            <div key={note} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              paddingBottom: i < arr.length - 1 ? 10 : 0,
              marginBottom: i < arr.length - 1 ? 10 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid rgba(245,241,232,0.06)' : 'none',
            }}>
              <span style={{ color: 'rgba(245,241,232,0.25)', fontSize: 12, flexShrink: 0 }}>→</span>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13,
                color: 'rgba(245,241,232,0.5)', lineHeight: 1.45,
              }}>{note}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onContinue} style={{
            height: 52, background: C.creamBase, color: C.inkPrimary,
            border: 'none', borderRadius: 4,
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
            cursor: 'pointer',
          }}>Continue</button>
          <button onClick={() => {}} style={{
            height: 48, background: 'transparent',
            color: 'rgba(245,241,232,0.45)',
            border: '1px solid rgba(245,241,232,0.14)',
            borderRadius: 4,
            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14,
            cursor: 'pointer',
          }}>Open safe-use tips</button>
        </div>
      </div>
    </div>
  );
}

// ── Next Step Map ─────────────────────────────────────────────
function NextStepMap({ onBack, onTab, onExit }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} showBack onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="YOUR MAP" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 6px',
        }}>Your next step map</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13,
          color: C.inkMuted, margin: '0 0 20px', lineHeight: 1.5,
        }}>Based on what you selected, these may be useful starting points.</p>

        <NextStepPanel number="1" title="Start here" accent>
          If you may need somewhere safe tonight, contact a hotline from a safer device when possible. Rainbow Services: <strong style={{ color: C.inkPrimary, fontWeight: 600 }}>310-547-9343</strong>, 24 hours, se habla español.
        </NextStepPanel>

        <NextStepPanel number="2" title="Avoid doing too quickly">
          Avoid announcing a plan to leave if that could increase danger. You do not need to do everything today. One safer step is enough to start.
        </NextStepPanel>

        <NextStepPanel number="3" title="Prepare quietly">
          Consider preparing documents, medications, keys, and important contacts. If children or pets are involved, include them in your planning. Transportation options matter.
        </NextStepPanel>

        <NextStepPanel number="4" title="Tools that fit">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {['Phone Safety Check', 'Financial Abuse Decoder', 'Quiet Safety Plan'].map(t => (
              <span key={t} style={{
                background: C.creamBase, border: `1px solid ${C.ruleLine}`,
                borderRadius: 2, padding: '4px 9px',
                fontSize: 11, fontFamily: "'Inter', sans-serif", color: C.inkMuted,
              }}>{t}</span>
            ))}
          </div>
        </NextStepPanel>

        <NextStepPanel number="5" title="Support options">
          <div>
            Rainbow Services: <strong style={{ color: C.inkPrimary, fontWeight: 600 }}>310-547-9343</strong><br />
            National DV Hotline: <strong style={{ color: C.inkPrimary, fontWeight: 600 }}>1-800-799-7233</strong><br />
            Crisis text: Text <strong style={{ color: C.inkPrimary, fontWeight: 600 }}>START to 88788</strong>
          </div>
        </NextStepPanel>

        <HRule />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <PrimaryButton label="Find support options" onClick={() => onTab('findhelp')} />
          <button onClick={() => {}} style={{
            width: '100%', height: 48,
            background: 'transparent', color: C.inkPrimary,
            border: `1px solid ${C.ruleLine}`, borderRadius: 4,
            fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14, cursor: 'pointer',
          }}>Share safely</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <TextButton label="Save privately" onClick={() => {}} />
            <span style={{ color: C.ruleLineSoft }}>·</span>
            <TextButton label="Start a new map" onClick={onBack} />
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

// ── Tools Tab ─────────────────────────────────────────────────
function ToolsTab({ onExit, activeTab, onTab }) {
  const tools = [
    { id: 'pattern', title: 'Pattern Decoder', desc: 'Identify patterns of coercive control and isolation.', Icon: SignalIcon },
    { id: 'text', title: 'Text Thread Decoder', desc: 'Understand concerning messages and what they may indicate.', Icon: TextBubbleIcon },
    { id: 'financial', title: 'Financial Abuse Decoder', desc: 'Recognize money control, sabotage, and coerced debt.', Icon: WalletIcon },
    { id: 'phone', title: 'Phone Safety Check', desc: 'Check for monitoring risks, location sharing, and safer options.', Icon: PhoneLockIcon },
    { id: 'safety-plan', title: 'Quiet Safety Plan', desc: 'Private checklist for documents, transport, and steps.', Icon: ChecklistIcon },
    { id: 'friend', title: 'Friend Mode', desc: 'Scripts and guidance for helping someone safely.', Icon: OpenHandIcon },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="TOOLS" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 20px',
        }}>Safety tools</h2>
        {tools.map(({ id, title, desc, Icon }) => (
          <ToolCard key={id} title={title} description={desc} Icon={Icon} onClick={() => {}} />
        ))}
        <div style={{ height: 8 }} />
      </div>
      <BottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  );
}

// ── Find Help Tab ─────────────────────────────────────────────
function FindHelpTab({ onExit, activeTab, onTab }) {
  const [zip, setZip] = useState('90731');
  const [searchedZip, setSearchedZip] = useState('90731');
  const resources = [
    { title: 'Rainbow Services', sub: 'Harbor / South Bay · San Pedro', detail: '310-547-9343 · 24 hrs · se habla español', type: 'LOCAL DV PROGRAM', Icon: HouseIcon, primary: true, pin: true },
    { title: 'National DV Hotline', sub: 'National 24/7 crisis line', detail: '1-800-799-7233 · Text START to 88788', type: 'NATIONAL HOTLINE', Icon: PhoneIcon },
    { title: 'Crisis Text Line', sub: 'Text-based support, 24/7', detail: 'Text HOME to 741741', type: 'CRISIS SUPPORT', Icon: TextBubbleIcon },
    { title: 'Legal Advocacy', sub: 'Restraining orders · court prep', detail: 'Through Rainbow Services', type: 'LEGAL SERVICES', Icon: ShieldIcon, pin: true },
    { title: 'Immigration Support', sub: 'VAWA and U-Visa · confidential', detail: 'Ask at intake', type: 'IMMIGRATION', Icon: PeopleIcon, pin: true },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="FIND HELP" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 16px',
        }}>Support options</h2>

        {/* ZIP search bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: C.creamCard, border: `1px solid ${C.ruleLine}`,
            borderRadius: 10, padding: '0 12px', gap: 8, height: 44,
          }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke={C.inkMuted} strokeWidth="1.5"/>
              <path d="M12 12L9.5 9.5" stroke={C.inkMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text" placeholder="ZIP code or city"
              value={zip} onChange={e => setZip(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearchedZip(zip)}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                color: C.inkPrimary, outline: 'none',
              }}
            />
          </div>
          <button onClick={() => setSearchedZip(zip)} style={{
            height: 44, padding: '0 16px',
            background: 'linear-gradient(180deg, #6A1B9A 0%, #4A148C 100%)',
            color: C.creamBase, border: 'none', borderRadius: 10,
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(74,20,140,0.25)',
          }}>Search</button>
        </div>

        {/* Map mock */}
        <div style={{
          height: 160, position: 'relative',
          borderRadius: 10, overflow: 'hidden',
          border: `1px solid ${C.ruleLine}`, marginBottom: 12,
        }}>
          <MapBackground />
          <MapPin x={31} y={52} primary />
          <MapPin x={38} y={36} />
          <MapPin x={45} y={62} />

          {/* +/− zoom controls */}
          <div style={{
            position: 'absolute', right: 10, top: 10,
            borderRadius: 6, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
          }}>
            {['+', '−'].map((btn, i) => (
              <div key={btn} style={{
                width: 28, height: 28, background: 'rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, color: '#444', cursor: 'pointer', fontWeight: 300,
                borderBottom: i === 0 ? '1px solid #eee' : 'none',
              }}>{btn}</div>
            ))}
          </div>

          {/* Location badge */}
          <div style={{
            position: 'absolute', left: 10, top: 10,
            background: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '4px 9px',
            fontSize: 11, fontFamily: "'Inter', sans-serif",
            color: C.inkPrimary, fontWeight: 500,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
              <path d="M4.5 0C2 0 0 2 0 4.5C0 7.5 4.5 11 4.5 11C4.5 11 9 7.5 9 4.5C9 2 7 0 4.5 0Z" fill={C.purpleAnchor}/>
            </svg>
            Near {searchedZip}
          </div>

          {/* Scale bar */}
          <div style={{
            position: 'absolute', left: 10, bottom: 8,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <div style={{ width: 28, height: 1.5, background: 'rgba(0,0,0,0.3)' }}/>
            <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)', fontFamily: "'Inter', sans-serif" }}>0.5 mi</span>
          </div>
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12,
          color: C.inkMuted, margin: '0 0 14px',
        }}>
          {resources.filter(r => r.pin).length} local results near {searchedZip} · Confidential addresses are never listed.
        </p>

        {resources.map(({ title, sub, detail, type, Icon, primary }) => (
          <button key={title} style={{
            width: '100%',
            background: primary ? C.inkPrimary : C.creamCard,
            border: `1px solid ${primary ? C.inkPrimary : C.ruleLine}`,
            borderRadius: 10, padding: '14px 16px',
            textAlign: 'left', cursor: 'pointer', marginBottom: 10,
            display: 'flex', gap: 12, alignItems: 'flex-start',
            boxShadow: primary ? '0 2px 10px rgba(26,26,26,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: primary ? 'rgba(245,241,232,0.09)' : C.creamCardSoft,
              border: `1px solid ${primary ? 'rgba(245,241,232,0.13)' : C.ruleLineSoft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color={primary ? C.creamBase : C.inkPrimary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
                fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: primary ? 'rgba(245,241,232,0.4)' : C.inkMuted, marginBottom: 4,
              }}>{type}</div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontWeight: 700,
                fontSize: 15, color: primary ? C.creamBase : C.inkPrimary, marginBottom: 2,
              }}>{title}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12,
                color: primary ? 'rgba(245,241,232,0.55)' : C.inkMuted, marginBottom: 4,
              }}>{sub}</div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 13, fontWeight: 600,
                color: primary ? C.creamBase : C.purpleAnchor,
              }}>{detail}</div>
            </div>
          </button>
        ))}
        <div style={{ height: 8 }} />
      </div>
      <BottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  );
}

// ── Learn Tab ─────────────────────────────────────────────────
function LearnTab({ onExit, activeTab, onTab }) {
  const articles = [
    { title: 'Understanding coercive control', tag: 'PATTERNS', read: '4 min' },
    { title: 'Financial abuse: what it looks like', tag: 'FINANCIAL', read: '3 min' },
    { title: 'When leaving increases risk', tag: 'SAFETY', read: '5 min' },
    { title: 'Digital safety and device monitoring', tag: 'DIGITAL', read: '3 min' },
    { title: 'What a safety plan actually covers', tag: 'PLANNING', read: '4 min' },
    { title: 'How to support someone who is not ready to leave', tag: 'FRIEND MODE', read: '4 min' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="LEARN" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.inkPrimary, margin: '0 0 20px',
        }}>Field guides</h2>
        <div style={{
          background: C.creamCard, border: `1px solid ${C.ruleLine}`,
          borderRadius: 4, overflow: 'hidden', marginBottom: 24,
        }}>
          {articles.map((a, i) => (
            <button key={a.title} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '14px 16px', background: 'none', border: 'none',
              borderBottom: i < articles.length - 1 ? `1px solid ${C.ruleLineSoft}` : 'none',
              cursor: 'pointer', textAlign: 'left', width: '100%', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: C.purpleAnchor, marginBottom: 4,
                }}>{a.tag}</div>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  fontSize: 14, color: C.inkPrimary, lineHeight: 1.35,
                }}>{a.title}</div>
              </div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 11,
                color: C.inkMuted, flexShrink: 0, paddingTop: 2,
              }}>{a.read}</div>
            </button>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
      <BottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  );
}

// ── Keep Free Tab ─────────────────────────────────────────────
function KeepFreeTab({ onExit, activeTab, onTab }) {
  const [period, setPeriod] = useState('monthly');
  const [amount, setAmount] = useState(25);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.creamBase }}>
      <StatusBarSpacer />
      <AppHeader onExit={onExit} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        <Eyebrow text="KEEP FREE" />
        <h2 style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
          fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.025em',
          color: C.inkPrimary, margin: '0 0 12px',
        }}>Keep this tool free.</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6,
          color: C.inkMuted, margin: '0 0 24px',
        }}>
          Start Here is free because donors fund it. No premium tier. No data sold. No advertising.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[
            { n: '1,500+', l: 'survivors served' },
            { n: '24 hrs', l: 'hotline, every day' },
            { n: 'Free', l: 'always, by design' },
          ].map(({ n, l }) => (
            <div key={n} style={{
              background: C.creamCard, border: `1px solid ${C.ruleLine}`,
              borderRadius: 4, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontWeight: 900,
                fontSize: 18, color: C.inkPrimary, letterSpacing: '-0.02em', marginBottom: 3,
              }}>{n}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.inkMuted, lineHeight: 1.3,
              }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', background: C.creamCard,
          border: `1px solid ${C.ruleLine}`, borderRadius: 4,
          padding: 3, marginBottom: 14,
        }}>
          {['monthly', 'one-time'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex: 1, height: 36,
              background: period === p ? C.inkPrimary : 'transparent',
              border: 'none', borderRadius: 2, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontWeight: period === p ? 600 : 400, fontSize: 13,
              color: period === p ? C.creamBase : C.inkMuted,
            }}>{p === 'monthly' ? 'Monthly' : 'One-time'}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[10, 25, 50, 100].map(a => (
            <button key={a} onClick={() => setAmount(a)} style={{
              height: 44,
              background: amount === a ? C.purpleAnchor : C.creamCard,
              border: `1px solid ${amount === a ? C.purpleAnchor : C.ruleLine}`,
              borderRadius: 4, cursor: 'pointer',
              fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 15,
              color: amount === a ? C.creamBase : C.inkPrimary,
            }}>${a}</button>
          ))}
        </div>

        <button style={{
          width: '100%', height: 52, background: C.purpleAnchor,
          color: C.creamBase, border: 'none', borderRadius: 4,
          fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
          cursor: 'pointer', marginBottom: 12,
        }}>
          Give ${amount}{period === 'monthly' ? ' / month' : ' once'}
        </button>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.inkMuted,
          textAlign: 'center', margin: '0 0 20px', lineHeight: 1.55,
        }}>
          Rainbow Services, Ltd. · EIN 95-3855705 · 501(c)(3) · Tax-deductible
        </p>
        <div style={{ height: 8 }} />
      </div>
      <BottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  );
}

export {
  OnboardingWelcome, OnboardingPrivacy, OnboardingMode,
  HomeScreen, SituationBuilder, SafetyCheck, NextStepMap,
  ToolsTab, FindHelpTab, LearnTab, KeepFreeTab,
};
