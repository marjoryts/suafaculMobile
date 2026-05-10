import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
 

export default function WelcomeScreen({ navigation }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnsAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.stagger(180, [
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(textAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(btnsAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);
 
  const logoStyle = {
    opacity: logoAnim,
    transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
  };
 
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ── Área central: logo + tagline ── */}
        <View style={styles.center}>
          <Animated.View style={logoStyle}>
            {/* Use <Image> com seu asset real em vez deste placeholder SVG */}
            <Image
              source={require('../assets/logo-purple.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>
 
          <Animated.View style={{ opacity: textAnim }}>
            <Text style={styles.tagline}>Seu futuro em um só lugar</Text>
          </Animated.View>
        </View>
 
        {/* ── Botões de ação ── */}
        <Animated.View style={[styles.btnRow, { opacity: btnsAnim }]}>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation?.navigate('Login')}
            activeOpacity={0.75}
          >
            <Text style={styles.btnOutlineText}>Entrar</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.btnFilled}
            onPress={() => navigation?.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnFilledText}>Inscrever-se</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  logoImage: {
    width: 180,
    height: 160,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    letterSpacing: 0.3,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
 
  // Botões
  btnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  // "Entrar" — sem fundo, sem borda, só texto
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  // "Inscrever-se" — fundo roxo
  btnFilled: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.purple,
    alignItems: 'center',
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnFilledText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
});