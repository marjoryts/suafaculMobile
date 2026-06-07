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

export default function CourseScreen({ route, navigation }) {
  const theme = useThemeContext();
  const { item, type } = route.params || {};

  // Base de descrições por item.id ou por tipo/nome
  const descriptions = {
    // Cursos
    '9': {
      titulo: 'Engenharia de Software',
      aprendizado: 'Projetar, desenvolver, testar e manter sistemas de software de alta qualidade, indo além da programação para focar no ciclo de vida completo do produto.',
      disciplinas: 'Algoritmos, Estrutura de Dados, Programação Orientada a Objetos, Banco de Dados, Engenharia de Requisitos, Testes, Arquitetura de Software e Gestão de Projetos'
    },
    '10': {
      titulo: 'Medicina',
      aprendizado: 'Diagnosticar, tratar e prevenir doenças, com foco em cuidado integral ao paciente e práticas clínicas baseadas em evidências.',
      disciplinas: 'Anatomia, Fisiologia, Bioquímica, Clínica Médica, Cirurgia, Pediatria, Ginecologia e Saúde Pública'
    },
    '11': {
      titulo: 'Direito',
      aprendizado: 'Interpretar e aplicar normas jurídicas, atuar em processos judiciais e consultoria, com ênfase em argumentação e ética profissional.',
      disciplinas: 'Direito Civil, Penal, Constitucional, Administrativo, Trabalhista e Processo Civil'
    },
    '12': {
      titulo: 'Administração',
      aprendizado: 'Gerenciar organizações, planejar estratégias, liderar equipes e tomar decisões com base em análise financeira e de mercado.',
      disciplinas: 'Marketing, Finanças, Recursos Humanos, Contabilidade, Gestão de Projetos e Estratégia Empresarial'
    },
    // Faculdades (exemplos)
    '1': {
      titulo: 'USP',
      aprendizado: 'Universidade pública de referência em ensino e pesquisa, com forte tradição acadêmica e infraestrutura de ponta.',
      disciplinas: 'Diversos cursos de graduação e pós-graduação; destaque em pesquisa e extensão universitária.'
    },
    '2': {
      titulo: 'Fatec',
      aprendizado: 'Instituição focada em tecnologia e formação prática, com cursos aplicados ao mercado de trabalho.',
      disciplinas: 'Cursos técnicos e superiores com ênfase em tecnologia e inovação.'
    },
    // fallback
    default: {
      titulo: item?.nome || 'Detalhes',
      aprendizado: 'Informações sobre o curso ou instituição.',
      disciplinas: 'Disciplinas e conteúdos relacionados.'
    }
  };

  const info = descriptions[item?.id] || descriptions.default;

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
        <ScreenTitle style={{ color: theme.textPrimary }}>{info.titulo}</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>

        <ImageContainer>
          <CourseImage source={item.imagem} resizeMode="cover" />
        </ImageContainer>

        {type === 'curso' ? (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>O que você vai aprender?</SectionTitle>
            <DescriptionText style={{ color: theme.textSecondary }}>
              {info.aprendizado}
            </DescriptionText>

            <SectionTitle style={{ color: theme.textPrimary }}>Disciplinas</SectionTitle>
            <DescriptionText style={{ color: theme.textSecondary }}>
              {info.disciplinas}
            </DescriptionText>
          </>
        ) : (
          // faculdade
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Sobre a instituição</SectionTitle>
            <DescriptionText style={{ color: theme.textSecondary }}>
              {info.aprendizado}
            </DescriptionText>

            <SectionTitle style={{ color: theme.textPrimary }}>Diferenciais</SectionTitle>
            <DescriptionText style={{ color: theme.textSecondary }}>
              {info.disciplinas}
            </DescriptionText>
          </>
        )}

      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton onPress={() => {
          // exemplo: cursos levam ao teste vocacional, faculdades podem abrir lista de cursos
          if (type === 'curso') {
            navigation.navigate('VocationalIntro');
          } else {
            navigation.navigate('MainScreen');
          }
        }}>
          <ButtonText>{type === 'curso' ? 'Faça o Teste Vocacional!' : 'Ver cursos'}</ButtonText>
        </PrimaryButton>
      </ButtonWrapper>

    </SafeContainer>
  );
}
