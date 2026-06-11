import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@components/GlassCard';
import { SwipeToCall } from '@components/ui/SwipeToCall';
import { PressableScale } from '@components/ui/PressableScale';
import { useTheme } from '@theme/ThemeContext';
import { useTraumaInformedMotion } from '@utils/motion';
import { useScrollOffset } from '@components/ScrollContext';
import { todaysThing } from '@data/oneThing';
import { HouseIcon, PhoneIcon, ToolsIcon } from '@components/Icons';

function OneThingCard() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const thing = React.useMemo(() => todaysThing(), []);

  const entering = reduceMotion 
    ? undefined 
    : FadeInDown.delay(950).springify().mass(1.2).damping(16).stiffness(180);

  return (
    <Animated.View entering={entering}>
      <PressableScale
        onPress={() => {
          if (thing.route) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(thing.route as never);
          }
        }}
        scaleTo={0.98}
      >
        <GlassCard style={styles.oneThing}>
          <Text style={[styles.oneThingEyebrow, { color: theme.accent }]}>
            [ ONE THING TODAY · {thing.eyebrow} ]
          </Text>
          <Text style={[styles.oneThingText, { color: theme.text }]}>{thing.text}</Text>
        </GlassCard>
      </PressableScale>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { reduceMotion } = useTraumaInformedMotion();
  const insets = useSafeAreaInsets();
  const scrollY = useScrollOffset();
  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  return (
    <Animated.ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {/* Eyebrow */}
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(280)}
        style={styles.eyebrowRow}
      >
        <Text style={[styles.eyebrow, { color: theme.muted }]}>[ 00 / START HERE ]</Text>
        <View style={[styles.eyebrowRule, { backgroundColor: theme.rule }]} />
      </Animated.View>

      {/* Headline */}
      <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(50)}>
        <Text style={[styles.headline, { color: theme.text }]}>You are{'\n'}safe here.</Text>
        <Text style={[styles.subhead, { color: theme.muted }]}>
          Private tools to understand abuse, plan for safety, and find help. No account is needed.
        </Text>
      </Animated.View>

      {/* Triage Grid Container */}
      <View style={styles.doors}>
        
        {/* Card 1: Find Safe Harbor (Shelter Map) */}
        <Animated.View 
          entering={reduceMotion ? undefined : FadeInDown.delay(500).springify().mass(1.2).damping(16).stiffness(180)}
        >
          <PressableScale
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/resources');
            }}
            scaleTo={0.975}
          >
            <GlassCard style={styles.door}>
              <View style={styles.doorHeader}>
                <View style={styles.iconWrapper}>
                  <HouseIcon size={24} color={theme.accent} />
                </View>
                <View style={styles.doorText}>
                  <Text style={[styles.doorNum, { color: theme.faint }]}>[ 01 / SHELTER MAP ]</Text>
                  <Text style={[styles.doorTitle, { color: theme.text }]}>Find Safe Harbor</Text>
                  <Text style={[styles.doorDesc, { color: theme.muted }]}>
                    Locate emergency housing and confidential shelters near you.
                  </Text>
                </View>
                <Text style={[styles.doorArrow, { color: theme.accent }]}>→</Text>
              </View>
            </GlassCard>
          </PressableScale>
        </Animated.View>

        {/* Card 2: Call 24/7 Advocates (Hotline Slider) */}
        <Animated.View 
          entering={reduceMotion ? undefined : FadeInDown.delay(650).springify().mass(1.2).damping(16).stiffness(180)}
        >
          <GlassCard style={[styles.door, styles.hotlineCard]}>
            <View style={styles.doorAccent} />
            <View style={styles.doorHeader}>
              <View style={styles.iconWrapper}>
                <PhoneIcon size={24} color={theme.danger} />
              </View>
              <View style={styles.doorText}>
                <Text style={[styles.doorNum, { color: theme.danger }]}>[ 02 / HOTLINE ]</Text>
                <Text style={[styles.doorTitle, { color: theme.text }]}>Call 24/7 Advocates</Text>
                <Text style={[styles.doorDesc, { color: theme.muted }]}>
                  Get immediate, confidential support and safety planning.
                </Text>
              </View>
            </View>
            <View style={styles.swipeContainer}>
              <SwipeToCall dial="3105479343" label="Slide to call · 310-547-9343" />
            </View>
            <Text style={[styles.dangerwarn, { color: theme.danger }]}>
              CALL 911 NOW if in immediate danger.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Card 3: Access Tools & Planning (Tools Gateway) */}
        <Animated.View 
          entering={reduceMotion ? undefined : FadeInDown.delay(800).springify().mass(1.2).damping(16).stiffness(180)}
        >
          <PressableScale
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/tools');
            }}
            scaleTo={0.975}
          >
            <GlassCard style={styles.door}>
              <View style={styles.doorHeader}>
                <View style={styles.iconWrapper}>
                  <ToolsIcon size={24} color={theme.accent} />
                </View>
                <View style={styles.doorText}>
                  <Text style={[styles.doorNum, { color: theme.faint }]}>[ 03 / TOOLS ]</Text>
                  <Text style={[styles.doorTitle, { color: theme.text }]}>Access Tools & Planning</Text>
                  <Text style={[styles.doorDesc, { color: theme.muted }]}>
                    Use safety planners, text thread decoders, and grounding guides.
                  </Text>
                </View>
                <Text style={[styles.doorArrow, { color: theme.accent }]}>→</Text>
              </View>
            </GlassCard>
          </PressableScale>
        </Animated.View>

      </View>

      {/* One Thing — daily rotating card */}
      <OneThingCard />

      {/* About link */}
      <Animated.View 
        entering={reduceMotion ? undefined : FadeInDown.delay(1100).springify().mass(1.2).damping(16).stiffness(180)}
      >
        <Pressable
          onPress={() => router.push('/about')}
          style={styles.aboutLink}
          accessibilityRole="link"
        >
          <Text style={[styles.aboutText, { color: theme.faint }]}>About this app</Text>
        </Pressable>
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  eyebrow: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.5 },
  eyebrowRule: { flex: 1, height: StyleSheet.hairlineWidth },
  headline: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 12,
  },
  subhead: {
    fontFamily: 'Inter',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
    maxWidth: 340,
  },
  doors: { gap: 12, marginBottom: 20 },
  door: {
    padding: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  hotlineCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  doorAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  doorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconWrapper: {
    marginTop: 4,
    width: 32,
    alignItems: 'center',
  },
  doorText: {
    flex: 1,
  },
  doorNum: { fontFamily: 'JetBrainsMono-Regular', fontSize: 10, letterSpacing: 1.2, marginBottom: 6 },
  doorTitle: {
    fontFamily: 'InterTight-ExtraBold',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  doorDesc: { fontFamily: 'Inter', fontSize: 13, lineHeight: 19 },
  doorArrow: { fontFamily: 'Inter', fontSize: 20, paddingRight: 6, marginTop: 4 },
  swipeContainer: {
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dangerwarn: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 11,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  oneThing: { padding: 18, marginBottom: 20, backgroundColor: 'transparent' },
  oneThingEyebrow: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  oneThingText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
  },
  aboutLink: { alignSelf: 'center', paddingVertical: 10 },
  aboutText: { fontFamily: 'Inter', fontSize: 12, textDecorationLine: 'underline' },
});
