import React, { useState } from 'react';
import { StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from './assets/AvatarPhoto.png';
import { useThemeContext } from './context/ThemeContext';

import {
  PurpleBackground, TopSection, HeaderRow, BackButton, EditProfileText,
  ProfileImage, UserName, BottomSection, SettingsTitle, MenuItem,
  IconWrapper, MenuText, MenuStatus
} from './profileStyles';

export default function ProfileScreen({ navigation }) {
  const theme = useThemeContext();
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <PurpleBackground edges={['top']} topBg={theme.topBg}>
      <StatusBar barStyle="light-content" backgroundColor={theme.topBg} />

      <TopSection>
        <HeaderRow>
          <BackButton onPress={() => navigation?.goBack()} backBtnBg={theme.backBtnBg}>
            <Ionicons name="chevron-back" size={24} color={theme.backBtnColor} />
          </BackButton>
          <EditProfileText>Editar Perfil</EditProfileText>
        </HeaderRow>

        <ProfileImage source={FotoPerfil} resizeMode="cover" />
        <UserName>Júlio César</UserName>
      </TopSection>

      <BottomSection bg={theme.bg}>
        <SettingsTitle titleColor={theme.titleColor}>Configurações</SettingsTitle>

        {/* Modo Noturno */}
        <MenuItem disabled>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="moon" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Modo Noturno</MenuText>
          <Switch
            trackColor={{ false: '#D9D9D9', true: theme.switchTrackOn }}
            thumbColor="#FFFFFF"
            onValueChange={theme.toggleDarkMode}
            value={theme.isDarkMode}
          />
        </MenuItem>

        {/* Notificações */}
        <MenuItem onPress={() => setNotifEnabled(prev => !prev)}>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="notifications" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Notificações</MenuText>
          <MenuStatus statusColor={notifEnabled ? '#5A189A' : theme.textMuted}>
            {notifEnabled ? 'Ativado' : 'Desativado'}
          </MenuStatus>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </MenuItem>

        {/* Favoritos → Main */}
        <MenuItem onPress={() => navigation.navigate('MainScreen')}>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="heart" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Favoritos</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </MenuItem>

        {/* Conta */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="person" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Conta</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </MenuItem>

        {/* Ajuda */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="help-circle" size={28} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Ajuda</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </MenuItem>

        {/* Sair */}
        <MenuItem>
          <IconWrapper bgColor="#FF9100">
            <Ionicons name="log-out-outline" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textPrimary}>Sair</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </MenuItem>

      </BottomSection>
    </PurpleBackground>
  );
}
