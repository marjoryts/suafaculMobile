import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
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
  ButtonText,
} from './courseStyles';

// ─── Coordenadas das faculdades ───────────────────────────────────────────────
const FACULDADE_LOCATIONS = {
  '1': {
    name: 'USP – Universidade de São Paulo',
    address: 'Av. Prof. Mello Moraes, 1235 – Butantã, São Paulo',
    latitude: -23.5629,
    longitude: -46.7244,
  },
  '2': {
    name: 'Fatec São Paulo',
    address: 'Praça Cel. Fernando Prestes, 74 – Bom Retiro, São Paulo',
    latitude: -23.5297,
    longitude: -46.6343,
  },
  '3': {
    name: 'Unicamp',
    address: 'Rua Sérgio Buarque de Holanda, 651 – Campinas, SP',
    latitude: -22.8184,
    longitude: -47.0686,
  },
  '4': {
    name: 'Unesp São Paulo',
    address: 'Rua Dr. Bento Teobaldo Ferraz, 271 – São Paulo',
    latitude: -23.5390,
    longitude: -46.6609,
  },
  '5': {
    name: 'Faculdade Piaget',
    address: 'Av. Prudente de Morais, 750 – Itapevi, SP',
    latitude: -23.5464,
    longitude: -46.9346,
  },
  '6': {
    name: 'Mackenzie',
    address: 'Rua da Consolação, 896 – Consolação, São Paulo',
    latitude: -23.5437,
    longitude: -46.6536,
  },
  '7': {
    name: 'PUC-SP',
    address: 'Rua Monte Alegre, 984 – Perdizes, São Paulo',
    latitude: -23.5325,
    longitude: -46.6699,
  },
  '8': {
    name: 'FGV São Paulo',
    address: 'Av. 9 de Julho, 2029 – Jardim Paulista, São Paulo',
    latitude: -23.5713,
    longitude: -46.6536,
  },
};

// ─── Dados extras por curso (duração, modalidade, onde encontrar) ─────────────
const COURSE_EXTRA = {
  '9': {
    duracao: ['4 anos', '5 anos'],
    modalidades: ['EAD', 'Presencial', 'Semi-Presencial'],
    instituicoes: ['USP', 'Mackenzie', 'UMC'],
  },
  '10': {
    duracao: ['6 anos'],
    modalidades: ['Presencial'],
    instituicoes: ['USP', 'PUC', 'Unicamp'],
  },
  '11': {
    duracao: ['5 anos'],
    modalidades: ['Presencial', 'EAD'],
    instituicoes: ['PUC', 'Mackenzie', 'FGV'],
  },
  '12': {
    duracao: ['4 anos'],
    modalidades: ['EAD', 'Presencial', 'Semi-Presencial'],
    instituicoes: ['FGV', 'Mackenzie', 'Fatec'],
  },
};

// ─── Ícone por modalidade ─────────────────────────────────────────────────────
const MODALITY_ICON = {
  'EAD': 'laptop-outline',
  'Presencial': 'school-outline',
  'Semi-Presencial': 'book-outline',
};

// ─── Descrições ───────────────────────────────────────────────────────────────
const descriptions = {
  '9': {
    titulo: 'Engenharia de Software',
    aprendizado:
      'Formação voltada para o desenvolvimento de sistemas robustos e escaláveis. Você aprenderá a modelar requisitos, projetar arquiteturas, aplicar padrões de projeto, implementar testes automatizados, integrar sistemas e gerenciar o ciclo de vida do software. O curso também aborda metodologias ágeis, DevOps, segurança da informação e práticas de qualidade de software.',
    disciplinas:
      'Algoritmos; Estruturas de Dados; Programação Orientada a Objetos; Engenharia de Requisitos; Modelagem UML; Banco de Dados; Arquitetura de Software; Testes e Qualidade; Integração Contínua e DevOps; Segurança de Software; Gestão de Projetos de Software; UX e Engenharia de Usabilidade.',
  },
  '10': {
    titulo: 'Medicina',
    aprendizado:
      'Formação completa para atuação clínica e hospitalar, com ênfase em diagnóstico, tratamento e prevenção de doenças. O curso combina disciplinas básicas com treinamento prático em laboratórios, estágios em ambulatórios e hospitais.',
    disciplinas:
      'Anatomia; Fisiologia; Bioquímica; Farmacologia; Patologia; Microbiologia; Clínica Médica; Cirurgia; Pediatria; Ginecologia e Obstetrícia; Saúde Pública; Estágio Supervisionado.',
  },
  '11': {
    titulo: 'Direito',
    aprendizado:
      'Formação para atuação jurídica em diversas áreas: contenciosa, consultiva, pública e privada. O curso desenvolve capacidade de interpretação e aplicação das normas, argumentação jurídica, redação de peças processuais e negociação.',
    disciplinas:
      'Teoria Geral do Direito; Direito Constitucional; Direito Civil; Direito Penal; Direito Administrativo; Direito do Trabalho; Direito Tributário; Processo Civil; Processo Penal; Filosofia do Direito; Prática Jurídica.',
  },
  '12': {
    titulo: 'Administração',
    aprendizado:
      'Formação focada em gestão de organizações, planejamento estratégico, análise financeira e liderança. O curso prepara o aluno para identificar oportunidades de negócio, otimizar processos, gerir equipes e tomar decisões baseadas em dados.',
    disciplinas:
      'Introdução à Administração; Contabilidade; Finanças; Marketing; Gestão de Pessoas; Economia; Estatística Aplicada; Gestão de Operações; Planejamento Estratégico; Empreendedorismo; Estágio Supervisionado.',
  },
  '1': {
    titulo: 'USP',
    aprendizado:
      'A Universidade de São Paulo é referência nacional em ensino, pesquisa e extensão. Os cursos oferecem formação acadêmica sólida, com forte integração entre pesquisa e prática. Os alunos têm acesso a laboratórios avançados, bibliotecas extensas e programas de iniciação científica.',
    disciplinas:
      'Variedade ampla conforme o curso; ênfase em pesquisa, disciplinas optativas avançadas, projetos de extensão e atividades de iniciação científica.',
  },
  '2': {
    titulo: 'Fatec',
    aprendizado:
      'As Faculdades de Tecnologia (Fatec) são conhecidas pela formação prática e alinhada ao mercado. O foco está em competências técnicas, resolução de problemas reais e integração com empresas locais.',
    disciplinas:
      'Disciplinas técnicas e aplicadas; projetos integradores; estágios supervisionados; ênfase em tecnologia, inovação e empregabilidade.',
  },
  '3': {
    titulo: 'Unicamp',
    aprendizado:
      'A Unicamp está entre as melhores universidades da América Latina, reconhecida por sua produção científica e inovação. Oferece formação de excelência com laboratórios de ponta, pesquisa e parcerias internacionais.',
    disciplinas:
      'Grade curricular completa conforme o curso; forte componente de pesquisa; iniciação científica; projetos de inovação e extensão universitária.',
  },
  '4': {
    titulo: 'Unesp',
    aprendizado:
      'A Unesp possui campi em diversas cidades do estado de São Paulo, oferecendo ensino público de qualidade. É reconhecida pela diversidade de cursos e pelo compromisso com pesquisa e extensão comunitária.',
    disciplinas:
      'Disciplinas fundamentais e específicas por área; pesquisa científica; extensão universitária; estágios e projetos aplicados.',
  },
  '5': {
    titulo: 'Faculdade Piaget',
    aprendizado:
      'A Faculdade Piaget oferece formação com foco regional e aplicada, priorizando a empregabilidade e a conexão com o mercado local. Combina teoria e prática por meio de laboratórios, projetos integradores e parcerias com empresas da região.',
    disciplinas:
      'Currículo com disciplinas práticas e teóricas; projetos de extensão; estágios supervisionados; oficinas de empreendedorismo e desenvolvimento profissional.',
  },
  '6': {
    titulo: 'Mackenzie',
    aprendizado:
      'O Mackenzie combina tradição acadêmica com forte atuação no mercado. O aluno encontra formação que equilibra conteúdo teórico sólido e experiências práticas, laboratórios, projetos interdisciplinares e iniciação científica.',
    disciplinas:
      'Disciplinas fundamentais e avançadas conforme o curso; pesquisa aplicada, projetos de extensão, programas de empreendedorismo e incubadoras.',
  },
  '7': {
    titulo: 'PUC',
    aprendizado:
      'A PUC é reconhecida pela formação humanista e pela forte atuação em extensão universitária. O curso valoriza o pensamento crítico, a responsabilidade social e a interdisciplinaridade.',
    disciplinas:
      'Grade curricular com base teórica robusta, disciplinas optativas interdisciplinares, projetos de extensão; ênfase em formação crítica, ética profissional e atuação comunitária.',
  },
  '8': {
    titulo: 'FGV',
    aprendizado:
      'A Fundação Getulio Vargas é referência em administração, economia e direito, com forte orientação ao mercado e à formação executiva. Enfatiza análise quantitativa, estudos de caso e competências estratégicas.',
    disciplinas:
      'Disciplinas com forte componente quantitativo e analítico; estudos de caso empresariais; estratégia, finanças e governança; laboratórios de inovação e empreendedorismo.',
  },
};

// ─── URL do mapa estático ─────────────────────────────────────────────────────
function buildStaticMapUrl(lat, lng) {
  return (
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${lat},${lng}` +
    `&zoom=15` +
    `&size=600x280` +
    `&markers=${lat},${lng},red-pushpin`
  );
}

// ─── Componente: mapa estático clicável (faculdades) ─────────────────────────
function FaculdadeMap({ locationData, theme }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { latitude, longitude, name, address } = locationData;
  const mapUrl = buildStaticMapUrl(latitude, longitude);

  const openMaps = () => {
    const googleUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const iosUrl = `maps://?q=${encodeURIComponent(name)}&ll=${latitude},${longitude}`;
    const androidUrl = `geo:${latitude},${longitude}?q=${encodeURIComponent(name)}`;
    const nativeUrl = Platform.OS === 'ios' ? iosUrl : androidUrl;

    Linking.canOpenURL(nativeUrl)
      .then((ok) => (ok ? Linking.openURL(nativeUrl) : Linking.openURL(googleUrl)))
      .catch(() => Linking.openURL(googleUrl));
  };

  return (
    <View style={styles.mapSection}>
      <Text style={[styles.mapSectionTitle, { color: theme.textPrimary }]}>
        Ver endereço
      </Text>

      <TouchableOpacity style={styles.addressRow} onPress={openMaps} activeOpacity={0.7}>
        <Ionicons name="location" size={16} color="#5A189A" />
        <Text style={[styles.addressText, { color: theme.textSecondary }]}>
          {address}
        </Text>
        <Ionicons name="open-outline" size={14} color="#5A189A" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.mapWrapper,
          { backgroundColor: theme.isDarkMode ? '#2a2a2a' : '#dde8f0' },
        ]}
        onPress={openMaps}
        activeOpacity={0.92}
      >
        {loading && !error && (
          <View style={styles.mapLoader}>
            <ActivityIndicator size="small" color="#5A189A" />
            <Text style={styles.mapLoaderText}>Carregando mapa…</Text>
          </View>
        )}

        {!error && (
          <Image
            source={{ uri: mapUrl }}
            style={[styles.mapImage, loading && styles.hidden]}
            resizeMode="cover"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        )}

        {error && (
          <View style={styles.mapError}>
            <Ionicons name="map-outline" size={42} color="#5A189A" />
            <Text style={styles.mapErrorTitle}>{name}</Text>
            <Text style={styles.mapErrorSub}>Toque para abrir no Maps</Text>
          </View>
        )}

        {!loading && (
          <View style={styles.openMapsChip}>
            <Ionicons name="navigate" size={13} color="#fff" />
            <Text style={styles.openMapsText}>Abrir no Maps</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Componente: chip de tag ──────────────────────────────────────────────────
function Chip({ text, theme, accent }) {
  return (
    <View style={[styles.chip, { backgroundColor: accent ? '#FF9100' : theme.backBtnBg }]}>
      <Text style={[styles.chipText, { color: accent ? '#fff' : theme.textPrimary }]}>
        {text}
      </Text>
    </View>
  );
}

// ─── Componente: linha de info com ícone ──────────────────────────────────────
function InfoRow({ icon, label, children, theme }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconWrap, { backgroundColor: theme.iconBg }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
        <View style={styles.infoChips}>{children}</View>
      </View>
    </View>
  );
}

// ─── Componente: bloco de infos extras do curso ───────────────────────────────
function CourseExtraBlock({ extra, theme }) {
  if (!extra) return null;

  const hasDuracao = extra.duracao?.length > 0;
  const hasModalidades = extra.modalidades?.length > 0;
  const hasInstituicoes = extra.instituicoes?.length > 0;

  return (
    <View style={[styles.extraCard, { backgroundColor: theme.surface || '#fff' }]}>
      {hasDuracao && (
        <InfoRow icon="time-outline" label="Duração" theme={theme}>
          {extra.duracao.map((d) => (
            <Chip key={d} text={d} theme={theme} accent />
          ))}
        </InfoRow>
      )}

      {hasDuracao && hasModalidades && (
        <View style={[styles.divider, { backgroundColor: theme.searchBorder }]} />
      )}

      {hasModalidades && (
        <InfoRow icon="layers-outline" label="Modalidade" theme={theme}>
          {extra.modalidades.map((m) => (
            <View key={m} style={styles.modalityItem}>
              <Ionicons
                name={MODALITY_ICON[m] || 'checkmark-circle-outline'}
                size={13}
                color={theme.textSecondary}
              />
              <Chip text={m} theme={theme} />
            </View>
          ))}
        </InfoRow>
      )}

      {hasModalidades && hasInstituicoes && (
        <View style={[styles.divider, { backgroundColor: theme.searchBorder }]} />
      )}

      {hasInstituicoes && (
        <InfoRow icon="business-outline" label="Disponível em" theme={theme}>
          {extra.instituicoes.map((inst) => (
            <Chip key={inst} text={inst} theme={theme} />
          ))}
        </InfoRow>
      )}
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function CourseScreen({ route, navigation }) {
  const theme = useThemeContext();
  const { item, type } = route.params || {};

  const info = descriptions[item?.id] || {
    titulo: item?.nome || 'Detalhes',
    aprendizado: 'Informações gerais sobre o curso ou instituição.',
    disciplinas: 'Consulte a grade curricular específica da instituição.',
  };

  const locationData =
    type === 'faculdade' ? FACULDADE_LOCATIONS[item?.id] : null;

  const courseExtra =
    type === 'curso' ? COURSE_EXTRA[item?.id] || null : null;

  return (
    <SafeContainer style={{ backgroundColor: theme.bg }}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <HeaderRow>
        <BackButton
          onPress={() => navigation?.goBack()}
          style={{ backgroundColor: theme.backBtnBg }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.backBtnColor} />
        </BackButton>
        <ScreenTitle style={{ color: theme.textPrimary }}>{info.titulo}</ScreenTitle>
      </HeaderRow>

      <ContentScroll showsVerticalScrollIndicator={false}>

        <ImageContainer>
          <CourseImage source={item?.imagem} resizeMode="cover" />
        </ImageContainer>

        {type === 'curso' ? (
          <>
            {/* Bloco de duração / modalidade / onde — exclusivo de cursos */}
            <CourseExtraBlock extra={courseExtra} theme={theme} />

            <SectionTitle style={{ color: theme.textPrimary }}>
              O que você vai aprender?
            </SectionTitle>
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

            {/* Mapa — exclusivo de faculdades */}
            {locationData && (
              <FaculdadeMap locationData={locationData} theme={theme} />
            )}
          </>
        )}

      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton
          onPress={() => {
            if (type === 'curso') {
              navigation.navigate('VocationalIntro');
            } else {
              navigation.navigate('MainScreen');
            }
          }}
        >
          <ButtonText>
            {type === 'curso' ? 'Faça o Teste Vocacional!' : 'Ver cursos'}
          </ButtonText>
        </PrimaryButton>
      </ButtonWrapper>
    </SafeContainer>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Bloco de infos extras (cursos) ──────────────────────────────────────────
  extraCard: {
    marginHorizontal: 25,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoTextWrap: {
    flex: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  modalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 4,
    opacity: 0.5,
  },

  // ── Mapa (faculdades) ────────────────────────────────────────────────────────
  mapSection: {
    paddingHorizontal: 25,
    marginBottom: 30,
    marginTop: 8,
  },
  mapSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 14,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  mapWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
  },
  mapLoader: {
    position: 'absolute',
    alignItems: 'center',
    gap: 8,
  },
  mapLoaderText: {
    color: '#5A189A',
    fontSize: 13,
  },
  mapError: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  mapErrorTitle: {
    color: '#5A189A',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  mapErrorSub: {
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
  },
  openMapsChip: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A189A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#5A189A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  openMapsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});