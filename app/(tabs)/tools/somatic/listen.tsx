import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BackPill } from '@components/BackPill';
import { useTheme } from '@theme/ThemeContext';

let useAudioPlayer: ((source: unknown) => { volume: number; playing: boolean; play(): void; pause(): void }) | null = null;
try {
  const ea = require('expo-audio');
  useAudioPlayer = ea.useAudioPlayer;
} catch {
  // not available in this build
}

const WAVE_H = 200;
const MIDLINE = 100;

export default function ListenScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  const player = useAudioPlayer ? useAudioPlayer(null) : null;

  const waveHeight = useSharedValue(MIDLINE);

  const wavePath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, MIDLINE);
    p.quadTo(width / 2, waveHeight.value, width, MIDLINE);
    return p;
  });

  useAnimatedReaction(
    () => waveHeight.value,
    (h) => {
      const vol = Math.max(0, Math.min(1, (WAVE_H - h) / WAVE_H));
      runOnJS(setVolume)(vol);
    }
  );

  React.useEffect(() => {
    if (!player) return;
    player.volume = volume;
  }, [volume, player]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      waveHeight.value = Math.max(10, Math.min(190, e.y));
    })
    .onEnd(() => {
      'worklet';
      waveHeight.value = withSpring(MIDLINE);
    });

  function togglePlay() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!player) {
      setPlaying(!playing);
      return;
    }
    if (playing) { player.pause(); setPlaying(false); }
    else { player.play(); setPlaying(true); }
  }

  const volPercent = Math.round(volume * 100);

  return (
    <View style={styles.root}>
      <View style={[styles.backRow, { paddingTop: insets.top + 8 }]}>
        <BackPill />
      </View>

      <View style={styles.body}>
        <Text style={[styles.eyebrow, { color: theme.muted }]}>
          {'[ DRAG TO SHAPE THE TONE ]'}
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>{'Ambient\nsound.'}</Text>

        <GestureDetector gesture={pan}>
          <Canvas style={[styles.canvas, { width }]}>
            <Path
              path={wavePath}
              color={theme.accent}
              style="stroke"
              strokeWidth={2.5}
              strokeCap="round"
            />
          </Canvas>
        </GestureDetector>

        <View style={styles.volRow}>
          <Text style={[styles.volLabel, { color: theme.muted }]}>VOLUME</Text>
          <Text style={[styles.volPct, { color: theme.accent }]}>{volPercent}%</Text>
        </View>

        <Pressable
          onPress={togglePlay}
          style={[styles.playBtn, { borderColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Pause' : 'Play ambient sound'}
        >
          <Text style={[styles.playLabel, { color: theme.accent }]}>
            {playing ? 'Pause' : 'Play'}
          </Text>
        </Pressable>

        {!player && (
          <Text style={[styles.note, { color: theme.faint }]}>
            Audio file not yet bundled.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backRow: { paddingHorizontal: 20 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    gap: 24,
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 46,
  },
  canvas: { height: WAVE_H },
  volRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volLabel: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  volPct: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 14,
    letterSpacing: 1,
  },
  playBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  playLabel: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 18,
    fontWeight: '800',
  },
  note: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
