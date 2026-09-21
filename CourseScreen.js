import React, { useState, useEffect, useCallback } from 'react';
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
import { catalogApi } from './src/api/services';
import { rotuloModalidade } from './src/mappers';
import { LoadingView, ErrorView } from './components/StateViews';

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

// ─── Ícone por modalidade ─────────────────────────────────────────────────────
const MODALITY_ICON = {
  'EAD': 'laptop-outline',
  'Presencial': 'school-outline',
  'Semi-Presencial': 'book-outline',
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
  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detalhes vêm da API (/faculdades/<id> ou /cursos/<id>), não mais de tabelas fixas no app.
  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = type === 'curso' ? await catalogApi.curso(item.id) : await catalogApi.faculdade(item.id);
      setDetalhe(d);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [item?.id, type]);

  useEffect(() => { carregar(); }, [carregar]);

  const info = {
    titulo: detalhe?.nome_curto || detalhe?.nome || item?.nome || 'Detalhes',
    aprendizado: detalhe?.descricao || 'Informações gerais sobre o curso ou instituição.',
    disciplinas:
      (type === 'curso' ? detalhe?.disciplinas : detalhe?.diferenciais) ||
      (type === 'curso'
        ? 'Consulte a grade curricular específica da instituição.'
        : 'Consulte a instituição para conhecer seus diferenciais.'),
  };

  const locationData =
    type === 'faculdade' && detalhe?.latitude != null && detalhe?.longitude != null
      ? {
          name: detalhe.nome,
          address: detalhe.endereco || [detalhe.cidade, detalhe.uf].filter(Boolean).join(' – '),
          latitude: detalhe.latitude,
          longitude: detalhe.longitude,
        }
      : null;

  const courseExtra =
    type === 'curso' && detalhe
      ? {
          duracao: detalhe.duracoes || [],
          modalidades: (detalhe.modalidades || []).map(rotuloModalidade),
          instituicoes: (detalhe.instituicoes || []).map((i) => i.nome_curto || i.nome),
        }
      : null;

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
          {item?.imagem ? <CourseImage source={item.imagem} resizeMode="cover" /> : null}
        </ImageContainer>

        {loading ? <LoadingView message="Carregando detalhes..." /> : null}
        {!loading && error ? <ErrorView error={error} onRetry={carregar} /> : null}

        {!loading && !error && (type === 'curso' ? (
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
        ))}

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