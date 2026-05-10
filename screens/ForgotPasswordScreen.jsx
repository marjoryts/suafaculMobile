import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Input, PrimaryButton, TextLink, BackButton, Divider } from '../components/UI';

const OTP_LENGTH = 5;
const TIMER_SECONDS = 135; // 2:15

export default function ForgotPasswordScreen({ navigation, route }) {
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const inputs = useRef([]);
  const timerRef = useRef(null);

  // Recebe e-mail parcialmente mascarado via route.params
  const maskedEmail = route?.params?.email ?? 'g*******@gmail.com';

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setSecondsLeft(TIMER_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigation?.navigate('ResetPassword');
    }, 1500);
  };

  const allFilled = code.every((c) => c !== '');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header branco com logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo-purple.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card roxo */}
        <View style={styles.card}>
          <BackButton onPress={() => navigation?.goBack()} />

          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>Verifique seu e-mail para prosseguir</Text>

          <Text style={styles.instructions}>
            Digite os {OTP_LENGTH} códigos enviados no seu{'\n'}
            e-mail {maskedEmail} abaixo.
          </Text>

          {/* OTP inputs */}
          <View style={styles.otpRow}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                ]}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor={colors.orange}
              />
            ))}
          </View>

          {/* Timer */}
          <Text style={styles.timerText}>
            Código será expirado em{' '}
            <Text style={styles.timerHighlight}>{formatTime(secondsLeft)}</Text>
          </Text>

          {/* Reenviar */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Não conseguiu o código? </Text>
            <TouchableOpacity onPress={startTimer}>
              <Text style={styles.resendLink}>Reenviar código</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title="Verificar e-mail"
            onPress={handleVerify}
            loading={loading}
            color={colors.orange}
            style={[styles.verifyBtn, !allFilled && styles.verifyBtnDisabled]}
          />

          {/* Link para login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Já tem uma conta? </Text>
            <TextLink
              text="Entrar"
              onPress={() => navigation?.navigate('Login')}
              style={styles.loginLink}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  header: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  headerLogo: { width: 130, height: 50 },

  scrollContent: { flexGrow: 1 },

  // Card roxo cobre o restante da tela
  card: {
    backgroundColor: colors.purple,
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },

  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: spacing.sm,
  },
  instructions: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.white,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  // OTP
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  otpBox: {
    width: 52,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  otpBoxFilled: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderColor: colors.white,
  },

  // Timer
  timerText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  timerHighlight: {
    color: colors.orange,
    fontFamily: fonts.semiBold,
  },

  // Reenviar
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resendLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: fonts.regular,
  },
  resendLink: {
    fontSize: 13,
    color: colors.orange,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },

  verifyBtn: { marginTop: spacing.sm },
  verifyBtnDisabled: { opacity: 0.6 },

  // Link de login
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: fonts.regular,
  },
  loginLink: {
    color: colors.orange,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
