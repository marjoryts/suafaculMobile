
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Input, PrimaryButton, TextLink, BackButton, Divider } from '../components/UI';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation?.navigate('VerifyEmail');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header roxo escuro com logo branca maior ── */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo-white.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>

            <BackButton onPress={() => navigation?.goBack()} />

            <Text style={styles.title}>Bem-vindo(a)!</Text>

            <Input
              label="Nome de usuário ou E-mail"
              placeholder="Insira o nome ou e-mail"
              value={username}
              onChangeText={setUsername}
            />

            <Input
              label="E-mail"
              placeholder="Insira seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="Confirme sua senha"
              placeholder="Insira sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <PrimaryButton
              title="→ Cadastrar"
              onPress={handleRegister}
              loading={loading}
              color={colors.orange}
              style={styles.registerBtn}
            />

            <View style={styles.orRow}>
              <Text style={styles.orText}>ou</Text>
              <TextLink
                text="Registrar com uma conta"
                onPress={() => navigation?.navigate('Login')}
                style={styles.registerLink}
              />
            </View>

            <View style={styles.socialRow}>
              <SocialIcon label="E-mail" emoji="✉️" onPress={() => {}} />
              <SocialIcon label="Google" emoji="🌐" onPress={() => {}} />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialIcon({ label, emoji, onPress }) {
  return (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.socialEmoji}>{emoji}</Text>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.purpleDark },
  flex: { flex: 1 },

  // Header roxo com logo branca maior — igual ao LoginScreen
  header: {
    backgroundColor: colors.purpleDark,
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerLogo: {
    width: 140,
    height: 110,
  },

  scrollContent: { flexGrow: 1 },

  // Card branco com borderRadius maior — igual ao LoginScreen
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },

  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  registerBtn: {
    marginTop: spacing.sm,
  },

  orRow: {
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 4,
  },
  orText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  registerLink: {
    color: colors.purple,
    fontSize: 13,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  socialBtn: { alignItems: 'center', gap: 4 },
  socialEmoji: { fontSize: 28 },
  socialLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});