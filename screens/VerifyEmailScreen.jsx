// screens/VerifyEmailScreen.jsx
import React, { useState, useRef } from 'react';
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

export default function VerifyEmailScreen({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const email = route?.params?.email ?? 'g*******@gmail.com';

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1); // apenas 1 dígito
    setCode(newCode);
    if (text && index < 4) {
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
      // navigation?.navigate('Home');
    }, 1500);
  };

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
        <View style={styles.body}>
          <BackButton onPress={() => navigation?.goBack()} />

          <Text style={styles.title}>Insira seu e-mail para receber{'\n'}o código de verificação</Text>

          {/* Caixa de e-mail com borda roxa */}
          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>E-mail</Text>
            <View style={styles.emailInputRow}>
              <TextInput
                style={styles.emailInput}
                placeholder="Insira o e-mail"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.emailActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation?.goBack()}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendBtn} onPress={handleVerify}>
                <Text style={styles.sendText}>Enviar</Text>
              </TouchableOpacity>
            </View>
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

  scrollContent: { flexGrow: 1, padding: spacing.lg },

  body: { flex: 1, gap: spacing.lg },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    lineHeight: 26,
    marginTop: spacing.md,
  },

  // Caixa com borda roxa
  emailBox: {
    borderWidth: 1.5,
    borderColor: colors.purple,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  emailLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  emailInputRow: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  emailInput: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  emailActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  sendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    backgroundColor: colors.orange,
  },
  sendText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});
