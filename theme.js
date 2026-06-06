import { useColorScheme } from 'react-native';

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const lightColors = {
  purple: '#5A189A',
  purpleDark: '#401A65',
  purpleLight: '#7C3AED',
  orange: '#FFA833',
  orangeDark: '#FF9100',

  background: '#F2F2F2',
  surface: '#FFFFFF',        // cards, inputs
  surfaceAlt: '#F8F7FF',     // fundos alternativos

  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',

  textPrimary: '#1F1535',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  white: '#FFFFFF',
  error: '#EF4444',
  cardBg: '#FFFFFF',
};

const darkColors = {
  purple: '#9D4EDD',
  purpleDark: '#C77DFF',
  purpleLight: '#BF93EA',
  orange: '#FFA833',
  orangeDark: '#FF9100',

  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2A2A2A',

  inputBg: '#2A2A2A',
  inputBorder: '#3A3A3A',

  textPrimary: '#F2F2F2',
  textSecondary: '#A0A0A0',
  textMuted: '#6B6B6B',

  white: '#FFFFFF',
  error: '#FF6B6B',
  cardBg: '#1E1E1E',
};


export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
export const colors = lightColors;