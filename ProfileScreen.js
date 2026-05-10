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

  return (
    <PurpleBackground edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#5A189A" />
      
      <TopSection>
        <HeaderRow>
          <BackButton onPress={() => navigation?.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#401A65" />
          </BackButton>
          <EditProfileText>Editar Perfil</EditProfileText>
        </HeaderRow>
        
        <ProfileImage source={FotoPerfil} resizeMode="cover" />
        <UserName>Júlio César</UserName>
      </TopSection>

      <BottomSection>
        <SettingsTitle>Configurações</SettingsTitle>

        <MenuItem disabled>
          <IconWrapper>
            <Ionicons name="moon" size={24} color="white" />
          </IconWrapper>
          <MenuText>Modo Noturno</MenuText>
          <Switch
            trackColor={{ false: '#D9D9D9', true: '#5A189A' }}
            thumbColor={'#FFFFFF'}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            value={isDarkMode}
          />
        </MenuItem>

        <MenuItem>
          <IconWrapper>
            <Ionicons name="notifications" size={24} color="white" />
          </IconWrapper>
          <MenuText>Notificações</MenuText>
          <MenuStatus>Ativado</MenuStatus>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A3D" />
        </MenuItem>

        <MenuItem>
          <IconWrapper>
            <Ionicons name="heart" size={24} color="white" />
          </IconWrapper>
          <MenuText>Favoritos</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A3D" />
        </MenuItem>

        <MenuItem>
          <IconWrapper>
            <Ionicons name="person" size={24} color="white" />
          </IconWrapper>
          <MenuText>Conta</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A3D" />
        </MenuItem>

        <MenuItem>
          <IconWrapper>
            <Ionicons name="help-circle" size={28} color="white" />
          </IconWrapper>
          <MenuText>Ajuda</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A3D" />
        </MenuItem>

        <MenuItem>
          <IconWrapper bgColor="#FF9100">
            <Ionicons name="log-out-outline" size={24} color="white" />
          </IconWrapper>
          <MenuText>Sair</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#1A1A1A3D" />
        </MenuItem>

      </BottomSection>
    </PurpleBackground>
  );
}