import React, { useState } from 'react';
import { StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from './assets/AvatarPhoto.png';

import {
  PurpleBackground, TopSection, HeaderRow, BackButton, EditProfileText,
  ProfileImage, UserName, BottomSection, SettingsTitle, MenuItem,
  IconWrapper, MenuText, MenuStatus
} from './profileStyles';

export default function ProfileScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    bg: isDarkMode ? '#121212' : '#F4F7FA',
    topBg: isDarkMode ? '#2A1050' : '#5A189A',
    titleColor: isDarkMode ? '#C77DFF' : '#401A65',
    textColor: isDarkMode ? '#F2F2F2' : '#401A65',
    statusColor: isDarkMode ? '#A0A0A0' : '#1A1A1A3D',
    chevronColor: isDarkMode ? '#555555' : '#1A1A1A3D',
    iconBg: isDarkMode ? '#7C3AED' : '#5A189A',
    backBtnBg: isDarkMode ? '#3A2060' : '#EAEAEA',
    backBtnColor: isDarkMode ? '#C77DFF' : '#401A65',
    switchTrackOn: isDarkMode ? '#9D4EDD' : '#5A189A',
  };

  return (
    <PurpleBackground edges={['top']} topBg={theme.topBg}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.topBg}
      />

      <TopSection>
        <HeaderRow>
          <BackButton
            onPress={() => navigation?.goBack()}
            backBtnBg={theme.backBtnBg}
          >
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
          <MenuText textColor={theme.textColor}>Modo Noturno</MenuText>
          <Switch
            trackColor={{ false: '#D9D9D9', true: theme.switchTrackOn }}
            thumbColor="#FFFFFF"
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            value={isDarkMode}
          />
        </MenuItem>

        {/* Notificações */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="notifications" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textColor}>Notificações</MenuText>
          <MenuStatus statusColor={theme.statusColor}>Ativado</MenuStatus>
          <Ionicons name="chevron-forward" size={20} color={theme.chevronColor} />
        </MenuItem>

        {/* Favoritos */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="heart" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textColor}>Favoritos</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.chevronColor} />
        </MenuItem>

        {/* Conta */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="person" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textColor}>Conta</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.chevronColor} />
        </MenuItem>

        {/* Ajuda */}
        <MenuItem>
          <IconWrapper bgColor={theme.iconBg}>
            <Ionicons name="help-circle" size={28} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textColor}>Ajuda</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.chevronColor} />
        </MenuItem>

        {/* Sair */}
        <MenuItem>
          <IconWrapper bgColor="#FF9100">
            <Ionicons name="log-out-outline" size={24} color="white" />
          </IconWrapper>
          <MenuText textColor={theme.textColor}>Sair</MenuText>
          <Ionicons name="chevron-forward" size={20} color={theme.chevronColor} />
        </MenuItem>

      </BottomSection>
    </PurpleBackground>
  );
}
