import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from '../assets/AvatarPhoto.png';
import { useThemeContext } from '../context/ThemeContext';

const CATEGORIES = [
  { rank: 1, label: 'Ciência e Tecnologia', score: 8, max: 10, bg: '#F0DCF7', bar: '#BF93EA', circle: '#E8C8F5' },
  { rank: 2, label: 'Raciocínio Lógico',    score: 6, max: 10, bg: '#BDEEF4', bar: '#7FC4EB', circle: '#A8DFF0' },
  { rank: 3, label: 'Biologia',              score: 4, max: 10, bg: '#D7E689', bar: '#7BC142', circle: '#C5D96E' },
  { rank: 4, label: 'Humanas',               score: 2, max: 10, bg: '#F5C0D2', bar: '#C24B74', circle: '#EFA0BB' },
];

function ResultCard({ item, index }) {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: item.score / item.max,
      duration: 700,
      delay: index * 150,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: item.bg }]}>
      <View style={[styles.rankCircle, { backgroundColor: item.circle }]}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{item.label}</Text>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: item.bar,
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.scoreText}>{item.score}/{item.max}</Text>
      </View>
    </View>
  );
}

export default function VocationalResultScreen({ navigation, route }) {
  const theme = useThemeContext();
  const bannerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bannerAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Botão voltar ── */}
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={[styles.backBtn, { borderColor: theme.backBtnColor, backgroundColor: theme.backBtnBg }]}
        >
          <Ionicons name="chevron-back" size={22} color={theme.backBtnColor} />
        </TouchableOpacity>

        {/* ── Header com avatar ── */}
        <View style={styles.header}>
          <Image source={FotoPerfil} style={styles.avatar} />
          <View>
            <Text style={[styles.helloName, { color: theme.textPrimary }]}>Olá Júlio,</Text>
            <Text style={[styles.helloSub, { color: theme.textSecondary }]}>Que bom te ver de novo!</Text>
          </View>
        </View>

        {/* ── Banner ── */}
        <Animated.View
          style={[
            styles.banner,
            { backgroundColor: theme.iconBg },
            {
              opacity: bannerAnim,
              transform: [{ scale: bannerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
            },
          ]}
        >
          <Text style={styles.bannerEmoji}>🏆</Text>
          <Text style={styles.bannerText}>Você finalizou{'\n'}o Teste Vocacional</Text>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: theme.titleColor }]}>Resultados recentes</Text>

        <View style={styles.cards}>
          {CATEGORIES.map((item, i) => (
            <ResultCard key={item.rank} item={item} index={i} />
          ))}
        </View>

      </ScrollView>

      {/* ── Botão fixo ── */}
      <View style={[styles.footer, { backgroundColor: theme.bg }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: theme.iconBg }]}
          onPress={() => navigation?.navigate('MainScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>Ver cursos recomendados</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#BF93EA',
  },
  helloName: {
    fontSize: 17,
    fontWeight: '700',
  },
  helloSub: {
    fontSize: 13,
    marginTop: 2,
  },
  banner: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bannerEmoji: { fontSize: 36 },
  bannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cards: { gap: 12 },
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rankCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B282D',
  },
  cardContent: { flex: 1, gap: 6 },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B282D',
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 11,
    color: '#632E97',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  ctaBtn: {
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});