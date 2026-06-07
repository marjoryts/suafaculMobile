import React from 'react';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import photoEngenhariaSoftware from './assets/photoEngenhariaSoftware.png';
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

export default function CourseScreen({ navigation }) {
  const theme = useThemeContext();

  return (
    <SafeContainer style={{ backgroundColor: theme.bg }}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <HeaderRow>
        <BackButton onPress={() => navigation?.goBack()} style={{ backgroundColor: theme.backBtnBg }}>
          <Ionicons name="chevron-back" size={24} color={theme.backBtnColor} />
        </BackButton>
        <ScreenTitle style={{ color: theme.textPrimary }}>Engenharia de Software</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>

        <ImageContainer>
          <CourseImage source={photoEngenhariaSoftware} resizeMode="cover" />
        </ImageContainer>

        <SectionTitle style={{ color: theme.textPrimary }}>O que você vai aprender?</SectionTitle>
        <DescriptionText style={{ color: theme.textSecondary }}>
          Projetar, desenvolver, testar e manter sistemas de software de alta qualidade,
          indo além da programação para focar no ciclo de vida completo do produto
        </DescriptionText>

        <SectionTitle style={{ color: theme.textPrimary }}>Disciplinas</SectionTitle>
        <DescriptionText style={{ color: theme.textSecondary }}>
          Algoritmos, Estrutura de Dados, Programação Orientada a Objetos,
          Banco de Dados, Engenharia de Requisitos, Testes, Arquitetura de
          Software e Gestão de Projetos
        </DescriptionText>

      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton onPress={() => navigation.navigate('VocationalIntro')}>
          <ButtonText>Faça o Teste Vocacional!</ButtonText>
        </PrimaryButton>
      </ButtonWrapper>

    </SafeContainer>
  );
}
