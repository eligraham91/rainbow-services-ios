import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, PanResponder } from 'react-native';
import { ScreenScaffold } from '@components/ui/ScreenScaffold';
import { GlassCard } from '@components/GlassCard';
import { useTheme } from '@theme/ThemeContext';

// expo-audio is bundled but requires a real audio file.
// The listen screen renders a complete UI; audio plays when an asset is provided.
let useAudioPlayer: ((source: unknown) => { volume: number; playing: boolean; play(): void; pause(): void }) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ea = require('expo-audio');
  useAudioPlayer = ea.useAudioPlayer;
} catch {
  // not available in this build
}

export default function ListenScreen() {
  const { theme } = useTheme();
  const [volume, setVolume] = useState(0.6);
  const [playing, setPlaying] = useState(false);
  const dragStartY = useRef(0);
  const dragStartVol = useRef(volume);

  // Audio integration — wired when listen-loop.m4a is present
  const player = useAudioPlayer ? useAudioPlayer(null) : null;

  useEffect(() => {
    if (!player) return;
    player.volume = volume;
  }, [volume, player]);

  function togglePlay() {
    if (!player) {
      setPlaying(!playing);
      return;
    }
    if (playing) { player.pause(); setPlaying(false); }
    else { player.play(); setPlaying(true); }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      dragStartY.current = e.nativeEvent.pageY;
      dragStartVol.current = volume;
    },
    onPanResponderMove: (e) => {
      const dy = dragStartY.current - e.nativeEvent.pageY;
      const newVol = Math.max(0, Math.min(1, dragStartVol.current + dy / 200));
      setVolume(newVol);
    },
  });

  const volPercent = Math.round(volume * 100);

  return (
    <ScreenScaffold
      eyebrow="Listen"
      title={"Ambient\nsound."}
      intro="A steady background tone to anchor your attention. Drag up or down to adjust volume."
      showBack
    >
      <GlassCard style={styles.player}>
        {/* Wave visualization placeholder */}
        <View style={styles.waveArea}>
          {Array.from({ length: 24 }).map((_, i) => {
            const h = playing ? 8 + Math.sin(i * 0.8) * 24 * volume + 8 : 4;
            return (
              <View
                key={i}
                style={[styles.wavebar, {
                  height: h,
                  backgroundColor: theme.accent,
                  opacity: playing ? 0.6 + (i % 3) * 0.1 : 0.2,
                }]}
              />
            );
          })}
        </View>

        {/* Volume drag control */}
        <View
          style={styles.volArea}
          {...panResponder.panHandlers}
          accessible
          accessibilityLabel={`Volume ${volPercent} percent. Drag up to increase, down to decrease.`}
        >
          <Text style={[styles.volLabel, { color: theme.muted }]}>VOLUME</Text>
          <View style={[styles.volBar, { backgroundColor: theme.rule }]}>
            <View style={[styles.volFill, { width: `${volPercent}%` as '60%', backgroundColor: theme.accent }]} />
          </View>
          <Text style={[styles.volPct, { color: theme.muted }]}>{volPercent}%</Text>
        </View>

        {/* Play/pause button */}
        <View style={styles.controls}>
          <Pressable
            onPress={togglePlay}
            style={[styles.playBtn, { borderColor: theme.accent, borderWidth: 1.5 }]}
            accessibilityRole="button"
            accessibilityLabel={playing ? 'Pause' : 'Play ambient sound'}
          >
            <Text style={[styles.playLabel, { color: theme.accent }]}>
              {playing ? 'Pause' : 'Play'}
            </Text>
          </Pressable>
        </View>
      </GlassCard>

      {!player && (
        <Text style={[styles.note, { color: theme.faint }]}>
          Audio file not yet bundled. Contact Rainbow Services to add the ambient loop.
        </Text>
      )}
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  player: { padding: 24, marginBottom: 16 },
  waveArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, gap: 3, marginBottom: 24 },
  wavebar: { width: 4, borderRadius: 2, minHeight: 4 },
  volArea: { marginBottom: 20 },
  volLabel: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5, marginBottom: 8 },
  volBar: { height: 6, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  volFill: { height: '100%', borderRadius: 3 },
  volPct: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, letterSpacing: 1, textAlign: 'right' },
  controls: { alignItems: 'center' },
  playBtn: { paddingVertical: 14, paddingHorizontal: 40, borderWidth: 1.5 },
  playLabel: { fontFamily: 'InterTight-ExtraBold', fontSize: 18, fontWeight: '800' },
  note: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
