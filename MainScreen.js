import React from 'react';
import { FlatList, Image, View, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FotoPerfil from './assets/AvatarPhoto.png';
import { SafeAreaView } from 'react-native-safe-area-context';

import photoUsp from './assets/photoUsp.png';
import photoFatec from './assets/photoFatec.png';
import photoPiaget from './assets/photoPiaget.png';
import photoMackenzie from './assets/photoMackenzie.png';

import photoEngenhariaSoftware from './assets/photoEngenhariaSoftware.png';
import photoMedicina from './assets/photoMedicina.png';
import photoEnem from './assets/photoEnem.png';
import photoFuvest from './assets/photoFuvest.png';

import { 
  SafeContainer, ScrollWrapper, Header, Avatar, WelcomeText, 
  SearchBar, Input, SectionTitle, CardContainer, BackgroundImage, 
  CardTitle, TabBar, TabItem, TabText 
} from './styles';

const PUBLICAS = [
  { id: '1', nome: "USP", imagem: photoUsp },
  { id: '2', nome: "Fatec", imagem: photoFatec },
];

const PRIVADAS = [
  { id: '3', nome: "Piaget", imagem: photoPiaget },
  { id: '4', nome: "Mackenzie", imagem: photoMackenzie },
];

const CURSOS = [
  { id: '5', nome: "Engenharia\nde Software", imagem: photoEngenhariaSoftware },
  { id: '6', nome: "Medicina", imagem: photoMedicina },
];

const VESTIBULARES = [
  { id: '7', nome: "", imagem: photoEnem },
  { id: '8', nome: "", imagem: photoFuvest },
];

export default function MainScreen({ navigation }) {
  
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
    <SafeContainer>
      <ScrollWrapper 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        
       <Header>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Avatar source={FotoPerfil} />
          </TouchableOpacity>
          <WelcomeText>Olá, <WelcomeText style={{ fontWeight: 'bold' }}>Júlio!</WelcomeText></WelcomeText>
        </Header>

        <SearchBar>
          <Input placeholder="Pesquise faculdades, cursos...." />
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

        <SectionTitle>Faculdades Públicas</SectionTitle>
        <FlatList
          data={PUBLICAS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle>Faculdades Privadas</SectionTitle>
        <FlatList
          data={PRIVADAS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle>Cursos</SectionTitle>
        <FlatList
          data={CURSOS} renderItem={renderCurso} keyExtractor={item => item.id}
          horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
        />

        <SectionTitle>Vestibulares</SectionTitle>
        <FlatList
          data={VESTIBULARES} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, marginBottom: 25 }}
          renderItem={({ item }) => (
            <CardContainer 
              onPress={() => navigation.navigate('Vestibulares')} 
              style={{ backgroundColor: '#FFFFFF', padding: 15, borderRadius: 20, opacity: 0.6 }}>
              <Image source={item.imagem} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
              <Ionicons name="heart-outline" size={24} color="#401A65" style={{ position: 'absolute', bottom: 10, right: 10 }} />
            </CardContainer>
          )}
        />

      </ScrollWrapper>

      <TabBar>
        <TabItem><Ionicons name="search" size={24} color="white" /><TabText>Explorar</TabText></TabItem>
        <TabItem><Ionicons name="bookmark-outline" size={24} color="white" /><TabText>Salvos</TabText></TabItem>
        <TabItem><Ionicons name="person-outline" size={24} color="white" /><TabText>Perfil</TabText></TabItem>
      </TabBar>
    </SafeContainer>
  );
}