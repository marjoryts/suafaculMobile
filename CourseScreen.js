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

  // Descrições ampliadas e personalizadas por id (cursos e faculdades)
  const descriptions = {
    // Cursos
    '9': {
      titulo: 'Engenharia de Software',
      aprendizado:
        'Formação voltada para o desenvolvimento de sistemas robustos e escaláveis. Você aprenderá a modelar requisitos, projetar arquiteturas, aplicar padrões de projeto, implementar testes automatizados, integrar sistemas e gerenciar o ciclo de vida do software. O curso também aborda metodologias ágeis, DevOps, segurança da informação e práticas de qualidade de software, preparando o aluno para atuar em equipes multidisciplinares e em diferentes etapas do produto — desde a concepção até a manutenção.',
      disciplinas:
        'Algoritmos; Estruturas de Dados; Programação Orientada a Objetos; Engenharia de Requisitos; Modelagem UML; Banco de Dados; Arquitetura de Software; Testes e Qualidade; Integração Contínua e DevOps; Segurança de Software; Gestão de Projetos de Software; UX e Engenharia de Usabilidade.'
    },
    '10': {
      titulo: 'Medicina',
      aprendizado:
        'Formação completa para atuação clínica e hospitalar, com ênfase em diagnóstico, tratamento e prevenção de doenças. O curso combina disciplinas básicas (anatomia, fisiologia, bioquímica) com treinamento prático em laboratórios, estágios em ambulatórios e hospitais, e atividades de atenção primária. O aluno desenvolve competências em comunicação com pacientes, tomada de decisão clínica, ética médica e pesquisa científica, além de vivências em diferentes especialidades ao longo da graduação.',
      disciplinas:
        'Anatomia; Fisiologia; Bioquímica; Farmacologia; Patologia; Microbiologia; Clínica Médica; Cirurgia; Pediatria; Ginecologia e Obstetrícia; Saúde Pública; Estágio Supervisionado; Práticas de Urgência e Emergência; Metodologia Científica.'
    },
    '11': {
      titulo: 'Direito',
      aprendizado:
        'Formação para atuação jurídica em diversas áreas: contenciosa, consultiva, pública e privada. O curso desenvolve capacidade de interpretação e aplicação das normas, argumentação jurídica, redação de peças processuais, negociação e mediação. Há forte ênfase em ética profissional, direitos fundamentais e prática forense, com oportunidades de estágios em escritórios, tribunais e órgãos públicos, além de atividades de extensão e clínicas jurídicas.',
      disciplinas:
        'Teoria Geral do Direito; Direito Constitucional; Direito Civil; Direito Penal; Direito Administrativo; Direito do Trabalho; Direito Tributário; Processo Civil; Processo Penal; Filosofia do Direito; Prática Jurídica; Estágio Supervisionado; Clínica Jurídica.'
    },
    '12': {
      titulo: 'Administração',
      aprendizado:
        'Formação focada em gestão de organizações, planejamento estratégico, análise financeira e liderança. O curso prepara o aluno para identificar oportunidades de negócio, otimizar processos, gerir equipes e tomar decisões baseadas em dados. Inclui estudos de mercado, finanças corporativas, marketing, recursos humanos e empreendedorismo, com projetos práticos, estudos de caso e contato com o ambiente empresarial.',
      disciplinas:
        'Introdução à Administração; Contabilidade; Finanças; Marketing; Gestão de Pessoas; Economia; Estatística Aplicada; Gestão de Operações; Planejamento Estratégico; Empreendedorismo; Gestão de Projetos; Análise de Dados para Negócios; Estágio Supervisionado.'
    },

    // Faculdades públicas (descrições ampliadas)
    '1': {
      titulo: 'USP',
      aprendizado:
        'A Universidade de São Paulo é referência nacional em ensino, pesquisa e extensão. Os cursos oferecem formação acadêmica sólida, com forte integração entre pesquisa e prática. Os alunos têm acesso a laboratórios avançados, bibliotecas extensas e programas de iniciação científica. A USP também promove intercâmbios internacionais e parcerias com centros de pesquisa, ampliando oportunidades de carreira acadêmica e profissional.',
      disciplinas:
        'Variedade ampla conforme o curso; ênfase em pesquisa, disciplinas optativas avançadas, projetos de extensão e atividades de iniciação científica. Estrutura curricular com foco em aprofundamento teórico e aplicação prática.'
    },
    '2': {
      titulo: 'Fatec',
      aprendizado:
        'As Faculdades de Tecnologia (Fatec) são conhecidas pela formação prática e alinhada ao mercado. O foco está em competências técnicas, resolução de problemas reais e integração com empresas locais. Os cursos costumam priorizar laboratórios, projetos aplicados e estágios, preparando profissionais prontos para demandas imediatas do setor produtivo.',
      disciplinas:
        'Disciplinas técnicas e aplicadas; projetos integradores; estágios supervisionados; ênfase em tecnologia, inovação e empregabilidade. Currículos orientados para demandas do mercado regional e nacional.'
    },

    // Faculdades privadas — descrições ampliadas e personalizadas
    '5': {
      titulo: 'Faculdade Piaget',
      aprendizado:
        'A Faculdade Piaget oferece formação com foco regional e aplicada, priorizando a empregabilidade e a conexão com o mercado local. O curso combina teoria e prática por meio de laboratórios, projetos integradores e parcerias com empresas da região. Os alunos têm oportunidades de estágios desde os primeiros semestres e acompanhamento de carreira, com ênfase em habilidades técnicas e comportamentais demandadas por empregadores locais.',
      disciplinas:
        'Currículo com disciplinas práticas e teóricas; projetos de extensão; estágios supervisionados; disciplinas optativas voltadas para o mercado regional; oficinas de empreendedorismo e desenvolvimento profissional. Programas de apoio ao estudante e parcerias com empresas locais para inserção profissional.'
    },
    '6': {
      titulo: 'Mackenzie',
      aprendizado:
        'O Mackenzie combina tradição acadêmica com forte atuação no mercado. O aluno encontra uma formação que equilibra conteúdo teórico sólido e experiências práticas, como laboratórios, projetos interdisciplinares e programas de iniciação científica. A instituição possui uma rede de ex-alunos ativa e parcerias com empresas, facilitando estágios e oportunidades profissionais.',
      disciplinas:
        'Disciplinas fundamentais e avançadas conforme o curso; ênfase em pesquisa aplicada, projetos de extensão, programas de empreendedorismo e incubadoras; atividades extracurriculares que fortalecem networking e desenvolvimento de carreira.'
    },
    '7': {
      titulo: 'PUC',
      aprendizado:
        'A PUC é reconhecida pela formação humanista e pela forte atuação em extensão universitária. O curso valoriza o pensamento crítico, a responsabilidade social e a interdisciplinaridade. Os alunos participam de projetos sociais, pesquisas e atividades culturais, além de estágios que complementam a formação acadêmica com experiência prática e engajamento comunitário.',
      disciplinas:
        'Grade curricular com base teórica robusta, disciplinas optativas que incentivam interdisciplinaridade, projetos de extensão e laboratórios; ênfase em formação crítica, ética profissional e atuação comunitária.'
    },
    '8': {
      titulo: 'FGV',
      aprendizado:
        'A Fundação Getulio Vargas é referência em áreas como administração, economia e direito, com forte orientação ao mercado e à formação executiva. O curso enfatiza análise quantitativa, estudos de caso e desenvolvimento de competências estratégicas. Os alunos têm acesso a programas de desenvolvimento profissional, parcerias corporativas e oportunidades de pesquisa aplicada.',
      disciplinas:
        'Disciplinas com forte componente quantitativo e analítico; estudos de caso empresariais; disciplinas de estratégia, finanças e governança; programas de estágio e desenvolvimento executivo; laboratórios de inovação e empreendedorismo.'
    },

    // fallback
    default: {
      titulo: item?.nome || 'Detalhes',
      aprendizado:
        'Informações gerais sobre o curso ou instituição. Aqui você encontrará um resumo do que se aprende, as competências desenvolvidas e como o curso se conecta ao mercado de trabalho.',
      disciplinas:
        'Lista de disciplinas e conteúdos relacionados; verifique a grade curricular específica da instituição para detalhes completos.'
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
