import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, Image,
  Pressable, ScrollView, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  interpolate,
} from 'react-native-reanimated';
import { getStreak, getTodaySession, getUserProfile } from '../../lib/db';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { THERAPISTS, Therapist } from '../../data/therapists';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good Morning', emoji: '🌴' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '🌴' };
  if (h >= 17 && h < 21) return { text: 'Good Evening', emoji: '🌴' };
  return { text: 'Good Night', emoji: '🌙' };
}

function formatSessionTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

/* ─── ANIMATED CARD WRAPPER ────────────────────────────────────────────── */
function AnimatedCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(4);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 300 }) }],
    shadowOpacity: withTiming(interpolate(elevation.value, [4, 10], [0.25, 0.5]), {
      duration: 150,
    }),
    elevation: elevation.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = 0.975; elevation.value = 10; }}
      onPressOut={() => { scale.value = 1; elevation.value = 4; }}
      onPress={onPress}
      style={[styles.card, animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

/* ─── THERAPIST MINI CARD ──────────────────────────────────────────────── */
function TherapistMiniCard({ therapist }: { therapist: Therapist }) {
  return (
    <View style={styles.therapistMini}>
      <View style={styles.therapistMiniHeader}>
        <View style={styles.therapistAvatar}>
          <Ionicons name="person" size={20} color={COLORS.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.therapistName} numberOfLines={1}>{therapist.name}</Text>
          <Text style={styles.therapistTitle} numberOfLines={1}>{therapist.title}</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        {therapist.specialties.slice(0, 2).map((s) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
        {therapist.specialties.length > 2 && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>+{therapist.specialties.length - 2}</Text>
          </View>
        )}
      </View>

      <View style={styles.therapistMetaRow}>
        <Ionicons name="time-outline" size={11} color={COLORS.textMuted} />
        <Text style={styles.therapistMetaText} numberOfLines={1}>{therapist.availability}</Text>
      </View>
      <View style={styles.therapistMetaRow}>
        <Ionicons name="cash-outline" size={11} color={COLORS.textMuted} />
        <Text style={styles.therapistMetaText} numberOfLines={1}>{therapist.priceRange}</Text>
      </View>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => Linking.openURL(therapist.bookingUrl)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={13} color="#fff" />
        <Text style={styles.bookBtnText}>Book Session</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─── HOME TAB ─────────────────────────────────────────────────────────── */
export default function HomeTab() {
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [sessionTime, setSessionTime] = useState('21:00');
  const greeting = getGreeting();

  useEffect(() => {
    async function load() {
      const s = await getStreak();
      setStreak(s?.current_streak ?? 0);
      setLongest(s?.longest_streak ?? 0);
      const today = await getTodaySession();
      setTodayDone(!!today);
      const profile = await getUserProfile();
      if (profile?.session_time) setSessionTime(profile.session_time);
    }
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.jpeg')} style={styles.logo} resizeMode="cover" />
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.appName}>MindProtocol</Text>
          <Text style={styles.appTagline}>Your daily reset</Text>
        </View>
      </View>

      {/* ── CARD 1: GREETING ──────────────────────────────────────────── */}
      <AnimatedCard style={styles.greetingCard}>
        <View style={styles.greetingRow}>
          <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
          <View>
            <Text style={styles.greetingText}>{greeting.text}</Text>
          </View>
        </View>
        <Text style={styles.greetingQuote}>
          Every small reflection rewires your brain for a better tomorrow.
        </Text>
      </AnimatedCard>

      {/* ── CARD 2: TODAY'S SESSION ────────────────────────────────────── */}
      <AnimatedCard style={styles.sessionCard} onPress={() => router.push('/(tabs)/session')}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>Today's Session</Text>
          <View style={[styles.statusDot, todayDone && styles.statusDotDone]} />
        </View>

        <Text style={styles.sessionStatus}>
          {todayDone
            ? "You've completed today's session"
            : "You haven't completed today's session yet"}
        </Text>

        <View style={styles.sessionInfoRow}>
          <View style={styles.infoPill}>
            <Ionicons name="time-outline" size={14} color={COLORS.accent} />
            <Text style={styles.infoPillText}>{formatSessionTime(sessionTime)}</Text>
          </View>
          <View style={styles.infoPill}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
            <Text style={styles.infoPillText}>Daily</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => router.push('/(tabs)/session')}
          activeOpacity={0.85}
        >
          <Ionicons name={todayDone ? 'refresh-outline' : 'play-outline'} size={20} color="#fff" />
          <Text style={styles.startBtnText}>
            {todayDone ? 'Start another session' : "Start today's session"}
          </Text>
        </TouchableOpacity>
      </AnimatedCard>

      {/* ── CARD 3: DAILY STREAK ──────────────────────────────────────── */}
      <AnimatedCard style={styles.streakCard}>
        <View style={styles.streakContent}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakFire}>🔥</Text>
            <View>
              <Text style={styles.streakLabel}>Daily Streak</Text>
              <View style={styles.streakCountRow}>
                <Text style={styles.streakCount}>{streak}</Text>
                <Text style={styles.streakUnit}>days</Text>
              </View>
            </View>
          </View>

          <View style={styles.streakDivider} />

          <View style={styles.streakRight}>
            <Ionicons name="trophy-outline" size={22} color={COLORS.accent} />
            <Text style={styles.bestLabel}>Best</Text>
            <Text style={styles.bestCount}>{longest}</Text>
          </View>
        </View>

        {streak === 0 && (
          <Text style={styles.streakEmptyHint}>
            Complete a session to start building your streak
          </Text>
        )}
      </AnimatedCard>

      {/* ── CARD 4: THERAPIST CONSULTATION ────────────────────────────── */}
      <View style={styles.therapistSection}>
        <View style={styles.therapistHeader}>
          <View style={styles.therapistIconCircle}>
            <Ionicons name="person-add-outline" size={20} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.therapistSectionTitle}>Talk to a Therapist</Text>
            <Text style={styles.therapistSectionSub}>
              Professional support when you need it
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.therapistScroll}
          snapToInterval={232}
          decelerationRate="fast"
        >
          {THERAPISTS.map((t) => (
            <TherapistMiniCard key={t.id} therapist={t} />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push('/crisis')}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View all therapists</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

/* ─── STYLES ───────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 100,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: 12,
  },
  logoContainer: {
    width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
    backgroundColor: COLORS.bgCard,
  },
  logo: { width: 44, height: 44 },
  headerRight: { flex: 1 },
  appName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  appTagline: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },

  /* Animated Card base */
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },

  /* ── Greeting Card ──────────────────────────── */
  greetingCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  greetingEmoji: { fontSize: 30 },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  greetingQuote: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 19,
  },

  /* ── Session Card ───────────────────────────── */
  sessionCard: {
    borderColor: COLORS.borderAccent,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.textMuted,
  },
  statusDotDone: {
    backgroundColor: COLORS.success,
  },
  sessionStatus: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  sessionInfoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  startBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  /* ── Streak Card ────────────────────────────── */
  streakCard: {
    borderColor: COLORS.border,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakFire: { fontSize: 32 },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  streakCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  streakCount: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  streakUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  streakRight: {
    alignItems: 'center',
    gap: 2,
  },
  bestLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bestCount: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.accent,
  },
  streakEmptyHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 10,
    fontStyle: 'italic',
  },

  /* ── Therapist Section ──────────────────────── */
  therapistSection: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    overflow: 'hidden',
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  therapistIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  therapistSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  therapistSectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  therapistScroll: {
    paddingRight: SPACING.md,
    gap: 10,
  },
  therapistMini: {
    width: 220,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  therapistMiniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  therapistAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.accentGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  therapistName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  therapistTitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  therapistMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  therapistMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bookBtn: {
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
});
