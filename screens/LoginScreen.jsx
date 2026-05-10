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
 
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MainScreen');
    }, 1500);
  };
 
  return (
    <SafeAreaView style={styles.safe}>
 
      {/* ── Header branco com logo roxa ── */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo-purple.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>
 
      {/* ── Card laranja ── */}
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
 
            <Text style={styles.title}>Bem-vindo(a) de volta!</Text>
 
            <Input
              label="Nome do usuário ou E-mail"
              placeholder="Insira o nome ou e-mail"
              value={username}
              onChangeText={setUsername}
            />
 
            <Input
              label="Senha"
              placeholder="Insira sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
 
            <PrimaryButton
              title="→ Entrar"
              onPress={handleLogin}
              loading={loading}
              color={colors.purple}
              style={styles.loginBtn}
            />
 
            <View style={styles.forgotRow}>
              <TextLink
                text="Esqueceu a senha?"
                onPress={() => navigation?.navigate('ForgotPassword')}
                style={styles.forgotLink}
              />
            </View>
 
            <Divider label="Entrar com" />
 
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
  safe: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
 
  // Header branco com logo roxa (igual ao Figma)
  header: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerLogo: {
    width: 140,
    height: 110,
  },
 
  scrollContent: {
    flexGrow: 1,
  },
 
  // Card laranja com borderRadius maior
  card: {
    backgroundColor: colors.orange,
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
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
 
  loginBtn: {
    marginTop: spacing.xs,
  },
 
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotLink: {
    color: colors.purpleDark,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
 
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  socialBtn: {
    alignItems: 'center',
    gap: 4,
  },
  socialEmoji: { fontSize: 28 },
  socialLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.white,
  },
});