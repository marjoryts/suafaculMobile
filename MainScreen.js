import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Image, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from './assets/AvatarPhoto.png';
import { useThemeContext } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { useFavorites } from './context/FavoritesContext';
import { catalogApi } from './src/api/services';
import { errorMessage } from './src/api/client';
import { paraItem } from './src/mappers';
import { LoadingView, ErrorView } from './components/StateViews';

import {
  SafeContainer, ScrollWrapper, Header, Avatar, WelcomeText,
  SearchBar, Input, SectionTitle, CardContainer, BackgroundImage,
  CardTitle, TabBar, TabItem, TabText
} from './styles';

// Os dados (faculdades, cursos, vestibulares) vêm da API Flask (/api/v1/home e /api/v1/busca).
const VAZIO = { publicas: [], privadas: [], cursos: [], vestibulares: [] };

function organizarHome(d) {
  return {
    publicas: (d.faculdades_publicas || []).map(paraItem),
    privadas: (d.faculdades_privadas || []).map(paraItem),
    cursos: (d.cursos || []).map(paraItem),
    vestibulares: (d.vestibulares || []).map(paraItem),
  };
}

function organizarBusca(d) {
  const fac = d.faculdades || [];
  return {
    publicas: fac.filter((f) => f.tipo_instituicao === 'Pública').map(paraItem),
    privadas: fac.filter((f) => f.tipo_instituicao !== 'Pública').map(paraItem),
    cursos: (d.cursos || []).map(paraItem),
    vestibulares: (d.vestibulares || []).map(paraItem),
  };
}

export default function MainScreen({ navigation }) {
  const theme = useThemeContext();
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const [data, setData] = useState(VAZIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Carrega a home; com texto na busca, consulta /busca (com debounce de 300 ms).
  useEffect(() => {
    let cancelado = false;
    const q = query.trim();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = q.length >= 2 ? organizarBusca(await catalogApi.busca(q)) : organizarHome(await catalogApi.home());
        if (cancelado) return;
        setData(r);
        setError(null);
      } catch (e) {
        if (!cancelado) setError(e);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }, q ? 300 : 0);
    return () => { cancelado = true; clearTimeout(t); };
  }, [query, reloadKey]);

  const filteredPublicas = data.publicas;
  const filteredPrivadas = data.privadas;
  const filteredCursos = data.cursos;
  const filteredVestibulares = data.vestibulares;
  const anyResults = filteredPublicas.length + filteredPrivadas.length + filteredCursos.length + filteredVestibulares.length > 0;

  /* Favoritar / desfavoritar (salvo no servidor) */
  const toggleFavorite = async (item) => {
    try {
      await toggle(item);
    } catch (e) {
      Alert.alert('Não foi possível atualizar seus favoritos', errorMessage(e));
    }
  };

  /* Render card genérico (usado em faculdades e cursos) */
  const renderCurso = ({ item }) => (
    <CardContainer
      onPress={() => {
        if (item.tipo === 'curso') {
          navigation && navigation.navigate('CourseScreen', { item, type: 'curso' });
        } else {
          navigation && navigation.navigate('CourseScreen', { item, type: 'faculdade' });
        }
      }}
      style={{ backgroundColor: theme.cardBg, padding: 0, borderRadius: 20, overflow: 'hidden' }}
    >
      <BackgroundImage source={item.imagem || undefined} resizeMode="cover" imageStyle={{ borderRadius: 20 }} opacity={0.9} style={item.imagem ? undefined : { backgroundColor: '#401A65' }}>
        {item.nome ? <CardTitle>{item.nome}</CardTitle> : null}

        {/* Heart icon: toggle favorite */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation && e.stopPropagation(); // evita disparar o onPress do card
            toggleFavorite(item);
          }}
          style={{ position: 'absolute', bottom: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorited(item) ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorited(item) ? '#FF4D6D' : '#401A65'}
          />
        </TouchableOpacity>
      </BackgroundImage>
    </CardContainer>
  );

  /* Render vestibular (mantém heart toggle) */
  const renderVestibularItem = ({ item }) => (
    <CardContainer
      onPress={() => navigation.navigate('VestibularScreen', { item })}
      style={{ backgroundColor: theme.cardBg, padding: 0, borderRadius: 20, overflow: 'hidden' }}
    >
      {item.imagem ? (
        <Image
          source={item.imagem}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
          }}
        />
      ) : (
        <View style={{ width: '100%', height: '100%', borderRadius: 20, backgroundColor: '#401A65', justifyContent: 'center', padding: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{item.nome}</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation && e.stopPropagation();
          toggleFavorite(item);
        }}
        style={{ position: 'absolute', bottom: 10, right: 10 }}
      >
        <Ionicons name={isFavorited(item) ? 'heart' : 'heart-outline'} size={24} color={isFavorited(item) ? '#FF4D6D' : '#401A65'} />
      </TouchableOpacity>
    </CardContainer>
  );

  return (
    <SafeContainer style={{ backgroundColor: theme.bg }}>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        <Header style={{ backgroundColor: theme.bg }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Avatar source={FotoPerfil} />
          </TouchableOpacity>
          <WelcomeText style={{ color: theme.textPrimary }}>
            Olá, <WelcomeText style={{ fontWeight: 'bold', color: theme.textPrimary }}>{(user?.nome_usuario || 'visitante') + '!'}</WelcomeText>
          </WelcomeText>

          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="heart" size={22} color="#FF4D6D" />
          </TouchableOpacity>
        </Header>

        {/* SearchBar funcional */}
        <SearchBar style={{ backgroundColor: theme.searchBg, borderColor: theme.searchBorder }}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Pesquise faculdades, cursos...."
            placeholderTextColor={theme.textSecondary}
            style={{ color: theme.inputColor }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={20} color="orange" />
          )}
        </SearchBar>

        {/* Sugestões rápidas */}
        <FlatList
          data={['USP', 'UNICAMP', 'UNIPIAGET']}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setQuery(item)} style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9100',
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
              marginRight: 10, gap: 6
            }}>
              <Ionicons name="heart-outline" size={16} color="white" />
              <WelcomeText style={{ color: 'white', fontSize: 14, marginLeft: 0, fontWeight: '600' }}>
                {item}
              </WelcomeText>
            </TouchableOpacity>
          )}
        />

        {/* Seções filtradas */}
        {!error && filteredPublicas.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Públicas</SectionTitle>
            <FlatList
              data={filteredPublicas} renderItem={renderCurso} keyExtractor={item => `${item.tipo}:${item.id}`}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {!error && filteredPrivadas.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Privadas</SectionTitle>
            <FlatList
              data={filteredPrivadas} renderItem={renderCurso} keyExtractor={item => `${item.tipo}:${item.id}`}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {!error && filteredCursos.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Cursos</SectionTitle>
            <FlatList
              data={filteredCursos} renderItem={renderCurso} keyExtractor={item => `${item.tipo}:${item.id}`}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {!error && filteredVestibulares.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Vestibulares</SectionTitle>
            <FlatList
              data={filteredVestibulares} keyExtractor={item => `${item.tipo}:${item.id}`} horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
              renderItem={renderVestibularItem}
            />
          </>
        )}

        {loading && !anyResults && !error && <LoadingView message="Carregando..." />}
        {error && <ErrorView error={error} onRetry={() => setReloadKey((k) => k + 1)} />}

        {!loading && !error && !anyResults && (
          <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
              Nenhum resultado encontrado para "<Text style={{ color: theme.textPrimary }}>{query}</Text>".
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>
              Tente outra palavra-chave ou verifique a ortografia.
            </Text>
          </View>
        )}

      </ScrollWrapper>

      <TabBar>
        <TabItem><Ionicons name="search" size={24} color="white" /><TabText>Explorar</TabText></TabItem>
        <TabItem onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="bookmark-outline" size={24} color="white" /><TabText>Salvos</TabText>
        </TabItem>
        <TabItem onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="white" />
          <TabText>Perfil</TabText>
        </TabItem>
      </TabBar>
    </SafeContainer>
  );
}
