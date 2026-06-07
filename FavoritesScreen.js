import React from 'react';
import { View, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './context/ThemeContext';

import {
  SafeContainer,
  HeaderRow,
  BackButton,
  ScreenTitle,
  ContentScroll,
  ImageContainer,
  CourseImage,
  SectionTitle,
  DescriptionText,
  ButtonWrapper,
  PrimaryButton,
  ButtonText
} from './courseStyles';

export default function FavoritesScreen({ route, navigation }) {
  const theme = useThemeContext();
  const favorites = route.params?.favorites || [];

  // agrupa por tipo
  const faculdades = favorites.filter(f => f.tipo === 'faculdade');
  const cursos = favorites.filter(f => f.tipo === 'curso');
  const vestibulares = favorites.filter(f => f.tipo === 'vestibular');

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        if (item.tipo === 'vestibular') {
          navigation.navigate('VestibularScreen', { item });
        } else {
          navigation.navigate('CourseScreen', { item, type: item.tipo === 'curso' ? 'curso' : 'faculdade' });
        }
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        justifyContent: 'space-between'
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF9100',
          justifyContent: 'center', alignItems: 'center', marginRight: 12
        }}>
          <Ionicons name={item.tipo === 'curso' ? 'school' : item.tipo === 'faculdade' ? 'business' : 'book'} size={20} color="white" />
        </View>
        <View>
          <Text style={{ fontSize: 16, color: theme.textPrimary }}>{item.nome}</Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>{item.tipo}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => {
        // remover: atualiza a lista retornando para MainScreen (simples: volta com sinal)
        navigation.navigate('MainScreen', { removeFavoriteId: item.id });
      }}>
        <Ionicons name="trash-outline" size={22} color={theme.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeContainer style={{ backgroundColor: theme.bg }}>
      <HeaderRow>
        <BackButton onPress={() => navigation.goBack()} style={{ backgroundColor: theme.backBtnBg }}>
          <Ionicons name="chevron-back" size={24} color={theme.backBtnColor} />
        </BackButton>
        <ScreenTitle style={{ color: theme.textPrimary }}>Favoritos</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>
        <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Favoritas</SectionTitle>
        {faculdades.length === 0 ? <DescriptionText style={{ color: theme.textSecondary }}>Nenhuma faculdade favoritada.</DescriptionText> : faculdades.map(renderItem)}

        <SectionTitle style={{ color: theme.textPrimary, marginTop: 20 }}>Cursos Favoritos</SectionTitle>
        {cursos.length === 0 ? <DescriptionText style={{ color: theme.textSecondary }}>Nenhum curso favoritado.</DescriptionText> : cursos.map(renderItem)}

        <SectionTitle style={{ color: theme.textPrimary, marginTop: 20 }}>Vestibulares Favoritos</SectionTitle>
        {vestibulares.length === 0 ? <DescriptionText style={{ color: theme.textSecondary }}>Nenhum vestibular favoritado.</DescriptionText> : vestibulares.map(renderItem)}
      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton onPress={() => navigation.navigate('MainScreen')}>
          <ButtonText>Voltar</ButtonText>
        </PrimaryButton>
      </ButtonWrapper>
    </SafeContainer>
  );
}
