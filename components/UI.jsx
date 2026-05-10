// components/UI.jsx — Componentes reutilizáveis
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export function PrimaryButton({ title, onPress, loading = false, style, textStyle, color }) {
  const bg = color || colors.orange;
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, { backgroundColor: bg }, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.primaryBtnText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── OutlineButton ────────────────────────────────────────────────────────────
export function OutlineButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.outlineBtn, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.outlineBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ─── TextLink ─────────────────────────────────────────────────────────────────
export function TextLink({ text, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.textLink, style]}>{text}</Text>
    </TouchableOpacity>
  );
}

// ─── SocialButton ─────────────────────────────────────────────────────────────
export function SocialButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.socialIcon}>{icon}</Text>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── BackButton ───────────────────────────────────────────────────────────────
export function BackButton({ onPress, dark = false }) {
  return (
    <TouchableOpacity
      style={[styles.backBtn, dark && styles.backBtnDark]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.backIcon, dark && { color: colors.purple }]}>‹</Text>
    </TouchableOpacity>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      {label && <Text style={styles.dividerLabel}>{label}</Text>}
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Input
  inputWrapper: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  inputFocused: {
    borderColor: colors.purple,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  // PrimaryButton
  primaryBtn: {
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: fonts.semiBold,
    letterSpacing: 0.3,
  },

  // OutlineButton
  outlineBtn: {
    borderRadius: radius.full,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.textMuted,
  },
  outlineBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.medium,
  },

  // TextLink
  textLink: {
    color: colors.purple,
    fontSize: 13,
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },

  // SocialButton
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
  },
  socialIcon: { fontSize: 20 },
  socialLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },

  // BackButton
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  backBtnDark: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  backIcon: {
    fontSize: 26,
    color: colors.textPrimary,
    lineHeight: 30,
    marginTop: -2,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
});
