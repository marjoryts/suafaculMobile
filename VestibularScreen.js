// VestibularScreen.js
import React from 'react';
import { StatusBar } from 'react-native';
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

export default function VestibularScreen({ route, navigation }) {
  const theme = useThemeContext();
  const { item } = route.params || {};

  const vestibularInfo = {
    'ENEM': {
      titulo: 'ENEM',
      descricao: 'Exame Nacional do Ensino Médio que avalia competências e habilidades para acesso ao ensino superior e programas como Sisu e ProUni.',
      comoEstudar: 'Revisar conteúdos do ensino médio, praticar provas anteriores, treinar redação e fazer simulados cronometrados.',
      datas: 'Aplicado anualmente; normalmente em novembro. Ver edital oficial para datas exatas.'
    },
    'FUVEST': {
      titulo: 'FUVEST',
      descricao: 'Vestibular da USP, com provas objetivas e discursivas, conhecido pela alta concorrência e foco em interpretação e conteúdo.',
      comoEstudar: 'Foco em leitura crítica, resolução de questões e revisão aprofundada das disciplinas do ensino médio.',
      datas: 'Etapas geralmente entre dezembro e janeiro; consulte o calendário oficial da FUVEST.'
    },
    'Vestibular Unicamp': {
      titulo: 'Vestibular Unicamp',
      descricao: 'Processo seletivo da Unicamp com provas específicas e avaliação por áreas do conhecimento.',
      comoEstudar: 'Resolver provas anteriores da Unicamp, reforçar raciocínio lógico e conteúdos específicos por área.',
      datas: 'Datas variam por ano; consulte o site da Unicamp para o cronograma.'
    },
    'Vestibular Unesp': {
      titulo: 'Vestibular Unesp',
      descricao: 'Seleção da UNESP com provas objetivas e discursivas, cobrando conteúdo do ensino médio.',
      comoEstudar: 'Prática de questões, revisão de conteúdos e simulados; atenção às disciplinas exigidas pelo curso.',
      datas: 'Ver edital anual da UNESP para prazos e datas.'
    },
    default: {
      titulo: item?.nome || 'Vestibular',
      descricao: 'Informações gerais sobre o vestibular.',
      comoEstudar: 'Estude com provas anteriores, cronograma de revisão e prática de redação.',
      datas: 'Consulte o edital oficial.'
    }
  };

  const info = vestibularInfo[item?.nome] || vestibularInfo.default;

  return (
    <SafeContainer style={{ backgroundColor: theme.bg }}>
      <StatusBar barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      <HeaderRow>
        <BackButton onPress={() => navigation?.goBack()} style={{ backgroundColor: theme.backBtnBg }}>
          <Ionicons name="chevron-back" size={24} color={theme.backBtnColor} />
        </BackButton>
        <ScreenTitle style={{ color: theme.textPrimary }}>{info.titulo}</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>
        <ImageContainer>
          <CourseImage source={item.imagem} resizeMode="cover" />
        </ImageContainer>

        <SectionTitle style={{ color: theme.textPrimary }}>Descrição do vestibular</SectionTitle>
        <DescriptionText style={{ color: theme.textSecondary }}>
          {info.descricao}
        </DescriptionText>

        <SectionTitle style={{ color: theme.textPrimary }}>Como estudar</SectionTitle>
        <DescriptionText style={{ color: theme.textSecondary }}>
          {info.comoEstudar}
        </DescriptionText>

        <SectionTitle style={{ color: theme.textPrimary }}>Datas importantes</SectionTitle>
        <DescriptionText style={{ color: theme.textSecondary }}>
          {info.datas}
        </DescriptionText>
      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton onPress={() => navigation.navigate('Vestibulares')}>
          <ButtonText>Ver Datas</ButtonText>
        </PrimaryButton>
      </ButtonWrapper>
    </SafeContainer>
  );
}
