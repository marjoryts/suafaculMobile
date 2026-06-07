import React, { useState, useMemo } from 'react';
import { FlatList, Image, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from './assets/AvatarPhoto.png';
import { useThemeContext } from './context/ThemeContext';

import photoUsp from './assets/photoUsp.png';
import photoFatec from './assets/photoFatec.png';
import photoPiaget from './assets/photoPiaget.png';
import photoMackenzie from './assets/photoMackenzie.png';
import photoUnicamp from './assets/photoUnicamp.png.webp';
import photoUnesp from './assets/photoUnesp.png.jpg';
import photoPUC from './assets/photoPUC.png.jpg';
import photoFGV from './assets/photoFGV.png.png';

import photoEngenhariaSoftware from './assets/photoEngenhariaSoftware.png';
import photoMedicina from './assets/photoMedicina.png';
import photoDireito from './assets/photoDireito.png.jpg';
import photoAdministracao from './assets/photoAdministracao.png.jpg';

import photoEnem from './assets/photoEnem.png';
import photoFuvest from './assets/photoFuvest.png';
import photoVestibularUnicamp from './assets/photoVestibularUnicamp.png.jpg';
import photoVestibularUnesp from './assets/photoVestibularUnesp.jpg';

import {
  SafeContainer, ScrollWrapper, Header, Avatar, WelcomeText,
  SearchBar, Input, SectionTitle, CardContainer, BackgroundImage,
  CardTitle, TabBar, TabItem, TabText
} from './styles';

/* Dados */
const PUBLICAS = [
  { id: '1', nome: "USP",     imagem: photoUsp, tipo: 'faculdade' },
  { id: '2', nome: "Fatec",   imagem: photoFatec, tipo: 'faculdade' },
  { id: '3', nome: "Unicamp", imagem: photoUnicamp, tipo: 'faculdade' },
  { id: '4', nome: "Unesp",   imagem: photoUnesp, tipo: 'faculdade' },
];

const PRIVADAS = [
  { id: '5', nome: "Piaget",    imagem: photoPiaget, tipo: 'faculdade' },
  { id: '6', nome: "Mackenzie", imagem: photoMackenzie, tipo: 'faculdade' },
  { id: '7', nome: "PUC",       imagem: photoPUC, tipo: 'faculdade' },
  { id: '8', nome: "FGV",       imagem: photoFGV, tipo: 'faculdade' },
];

const CURSOS = [
  { id: '9',  nome: "Engenharia de\nSoftware", imagem: photoEngenhariaSoftware, tipo: 'curso' },
  { id: '10', nome: "Medicina",                imagem: photoMedicina, tipo: 'curso' },
  { id: '11', nome: "Direito",                 imagem: photoDireito, tipo: 'curso' },
  { id: '12', nome: "Administração",           imagem: photoAdministracao, tipo: 'curso' },
];

const VESTIBULARES = [
  { id: '13', nome: 'ENEM', imagem: photoEnem, tipo: 'vestibular' },
  { id: '14', nome: 'FUVEST', imagem: photoFuvest, tipo: 'vestibular' },
  { id: '15', nome: 'Vestibular Unicamp', imagem: photoVestibularUnicamp, tipo: 'vestibular' },
  { id: '16', nome: 'Vestibular Unesp', imagem: photoVestibularUnesp, tipo: 'vestibular' },
];

/* util */
function normalizeText(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function MainScreen({ navigation }) {
  const theme = useThemeContext();
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]); // array de items favoritados (objetos)

  const matchesQuery = (item, q) => {
    if (!q) return true;
    const normalizedQ = normalizeText(q);
    const fieldsToSearch = [item.nome];
    return fieldsToSearch.some(f => normalizeText(f).includes(normalizedQ));
  };

  const filteredPublicas = useMemo(() => PUBLICAS.filter(item => matchesQuery(item, query)), [query]);
  const filteredPrivadas = useMemo(() => PRIVADAS.filter(item => matchesQuery(item, query)), [query]);
  const filteredCursos = useMemo(() => CURSOS.filter(item => matchesQuery(item, query)), [query]);
  const filteredVestibulares = useMemo(() => VESTIBULARES.filter(item => matchesQuery(item, query)), [query]);

  const anyResults = filteredPublicas.length + filteredPrivadas.length + filteredCursos.length + filteredVestibulares.length > 0;

  /* Favoritar / desfavoritar */
  const isFavorited = (item) => favorites.some(f => f.id === item.id);
  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, item];
    });
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
      <BackgroundImage source={item.imagem} resizeMode="cover" imageStyle={{ borderRadius: 20 }} opacity={0.9}>
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
      <Image
        source={item.imagem}
        resizeMode="cover"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 20,
        }}
      />
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
            Olá, <WelcomeText style={{ fontWeight: 'bold', color: theme.textPrimary }}>Júlio!</WelcomeText>
          </WelcomeText>

          {/* Botão rápido para Favoritos (ícone no header) */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites', { favorites })}
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
          renderItem={({ item }) => (
            <View style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9100',
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
              marginRight: 10, gap: 6
            }}>
              <Ionicons name="heart-outline" size={16} color="white" />
              <WelcomeText style={{ color: 'white', fontSize: 14, marginLeft: 0, fontWeight: '600' }}>
                {item}
              </WelcomeText>
            </View>
          )}
        />

        {/* Seções filtradas */}
        {filteredPublicas.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Públicas</SectionTitle>
            <FlatList
              data={filteredPublicas} renderItem={renderCurso} keyExtractor={item => item.id}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {filteredPrivadas.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Privadas</SectionTitle>
            <FlatList
              data={filteredPrivadas} renderItem={renderCurso} keyExtractor={item => item.id}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {filteredCursos.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Cursos</SectionTitle>
            <FlatList
              data={filteredCursos} renderItem={renderCurso} keyExtractor={item => item.id}
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
            />
          </>
        )}

        {filteredVestibulares.length > 0 && (
          <>
            <SectionTitle style={{ color: theme.textPrimary }}>Vestibulares</SectionTitle>
            <FlatList
              data={filteredVestibulares} keyExtractor={item => item.id} horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
              renderItem={renderVestibularItem}
            />
          </>
        )}

        {!anyResults && (
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
        <TabItem onPress={() => navigation.navigate('Favorites', { favorites })}>
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
