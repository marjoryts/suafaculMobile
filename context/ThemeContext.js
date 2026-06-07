import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const theme = {
    isDarkMode,
    toggleDarkMode,

    // Backgrounds
    bg: isDarkMode ? '#121212' : '#F4F7FA',
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    topBg: isDarkMode ? '#2A1050' : '#5A189A',

    // Textos
    textPrimary: isDarkMode ? '#F2F2F2' : '#401A65',
    textSecondary: isDarkMode ? '#A0A0A0' : '#757575',
    textMuted: isDarkMode ? '#555555' : '#1A1A1A3D',

    // Componentes
    titleColor: isDarkMode ? '#C77DFF' : '#401A65',
    iconBg: isDarkMode ? '#7C3AED' : '#5A189A',
    backBtnBg: isDarkMode ? '#3A2060' : '#EAEAEA',
    backBtnColor: isDarkMode ? '#C77DFF' : '#401A65',
    switchTrackOn: isDarkMode ? '#9D4EDD' : '#5A189A',
    searchBg: isDarkMode ? '#2A2A2A' : '#EAEAEA',
    searchBorder: isDarkMode ? '#3A3A3A' : '#E0E0E0',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    inputColor: isDarkMode ? '#F2F2F2' : '#401A65',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
