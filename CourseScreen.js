import React from 'react';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import photoEngenhariaSoftware from './assets/photoEngenhariaSoftware.png';

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
  return (
    <SafeContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FA" />
      
      <HeaderRow>
        <BackButton onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#401A65" />
        </BackButton>
        <ScreenTitle>Engenharia de Software</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>
        
        <ImageContainer>
          <CourseImage source={photoEngenhariaSoftware} resizeMode="cover" />
        </ImageContainer>

        <SectionTitle>O que você vai aprender?</SectionTitle>
        <DescriptionText>
          Projetar, desenvolver, testar e manter sistemas de software de alta qualidade, 
          indo além da programação para focar no ciclo de vida completo do produto
        </DescriptionText>

        <SectionTitle>Disciplinas</SectionTitle>
        <DescriptionText>
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