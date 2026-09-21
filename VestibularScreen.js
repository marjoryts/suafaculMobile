// VestibularScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './context/ThemeContext';
import { catalogApi } from './src/api/services';
import { formatarData, textoDias } from './src/mappers';
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
  ButtonText
} from './courseStyles';

export default function VestibularScreen({ route, navigation }) {
  const theme = useThemeContext();
  const { item } = route.params || {};
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setV(await catalogApi.vestibular(item.id));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [item?.id]);

  useEffect(() => { carregar(); }, [carregar]);

  // Datas: calculadas pelo servidor (dias restantes / status), não mais texto fixo.
  const partesDatas = [];
  if (v?.data_prova) partesDatas.push(`Prova: ${formatarData(v.data_prova)} (${textoDias(v)}).`);
  else partesDatas.push('Data da prova ainda a definir.');
  if (v?.periodo_inscricao) partesDatas.push(`Inscrições: ${v.periodo_inscricao}.`);
  if (v?.link_edital) partesDatas.push(`Edital: ${v.link_edital}`);

  const info = {
    titulo: v?.nome || item?.nome || 'Vestibular',
    descricao: v?.descricao || 'Informações gerais sobre o vestibular.',
    comoEstudar: v?.como_estudar || 'Estude com provas anteriores, cronograma de revisão e prática de redação.',
    datas: partesDatas.join('\n'),
  };

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
        {item?.imagem ? (
          <ImageContainer>
            <CourseImage source={item.imagem} resizeMode="cover" />
          </ImageContainer>
        ) : null}

        {loading ? <LoadingView message="Carregando detalhes..." /> : null}
        {!loading && error ? <ErrorView error={error} onRetry={carregar} /> : null}
        {!loading && !error ? (
          <>

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
          </>
        ) : null}
      </ContentScroll>

      <ButtonWrapper>
        <PrimaryButton onPress={() => navigation.navigate('Vestibulares')}>
          <ButtonText>Ver Datas</ButtonText>
        </PrimaryButton>
      </ButtonWrapper>
    </SafeContainer>
  );
}
