import React from 'react';
import { FlatList, Image, View, TouchableOpacity } from 'react-native';
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

const PUBLICAS = [
  { id: '1', nome: "USP",     imagem: photoUsp },
  { id: '2', nome: "Fatec",   imagem: photoFatec },
  { id: '3', nome: "Unicamp", imagem: photoUnicamp },
  { id: '4', nome: "Unesp",   imagem: photoUnesp },
];

const PRIVADAS = [
  { id: '5', nome: "Piaget",    imagem: photoPiaget },
  { id: '6', nome: "Mackenzie", imagem: photoMackenzie },
  { id: '7', nome: "PUC",       imagem: photoPUC },
  { id: '8', nome: "FGV",       imagem: photoFGV },
];

const CURSOS = [
  { id: '9',  nome: "Engenharia\nde Software", imagem: photoEngenhariaSoftware },
  { id: '10', nome: "Medicina",                imagem: photoMedicina },
  { id: '11', nome: "Direito",                 imagem: photoDireito },
  { id: '12', nome: "Administração",           imagem: photoAdministracao },
];

const VESTIBULARES = [
  { id: '13', imagem: photoEnem },
  { id: '14', imagem: photoFuvest },
  { id: '15', imagem: photoVestibularUnicamp },
  { id: '16', imagem: photoVestibularUnesp },
];

export default function MainScreen({ navigation }) {
  const theme = useThemeContext();

  const renderCurso = ({ item }) => (
    <CardContainer onPress={() => navigation && navigation.navigate('CourseScreen')}>
      <BackgroundImage source={item.imagem} resizeMode="cover">
        {item.nome ? <CardTitle>{item.nome}</CardTitle> : null}
        <Ionicons
          name="heart-outline"
          size={24}
          color="#401A65"
          style={{ position: 'absolute', bottom: 10, right: 10 }}
        />
      </BackgroundImage>
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
        </Header>

        <SearchBar style={{ backgroundColor: theme.searchBg, borderColor: theme.searchBorder }}>
          <Input
            placeholder="Pesquise faculdades, cursos...."
            placeholderTextColor={theme.textSecondary}
            style={{ color: theme.inputColor }}
          />
          <Ionicons name="search" size={20} color="orange" />
        </SearchBar>

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

        <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Públicas</SectionTitle>
        <FlatList
          data={PUBLICAS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle style={{ color: theme.textPrimary }}>Faculdades Privadas</SectionTitle>
        <FlatList
          data={PRIVADAS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle style={{ color: theme.textPrimary }}>Cursos</SectionTitle>
        <FlatList
          data={CURSOS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle style={{ color: theme.textPrimary }}>Vestibulares</SectionTitle>
        <FlatList
          data={VESTIBULARES} keyExtractor={item => item.id} horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
          renderItem={({ item }) => (
            <CardContainer
              onPress={() => navigation.navigate('Vestibulares')}
              style={{ backgroundColor: theme.cardBg, padding: 15, borderRadius: 20, opacity: 0.85 }}
            >
              <Image source={item.imagem} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
              <Ionicons name="heart-outline" size={24} color="#401A65" style={{ position: 'absolute', bottom: 10, right: 10 }} />
            </CardContainer>
          )}
        />

      </ScrollWrapper>

      <TabBar>
        <TabItem><Ionicons name="search" size={24} color="white" /><TabText>Explorar</TabText></TabItem>
        <TabItem><Ionicons name="bookmark-outline" size={24} color="white" /><TabText>Salvos</TabText></TabItem>
        <TabItem onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="white" />
          <TabText>Perfil</TabText>
        </TabItem>
      </TabBar>
    </SafeContainer>
  );
}
