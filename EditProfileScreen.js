import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AvatarImg from './assets/AvatarPhoto.png';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('Júlio César');
  const [email, setEmail] = useState('julio@example.com');
  const [phone, setPhone] = useState('+55 11 9XXXX-XXXX');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.purpleTop}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrap}>
            <Image source={AvatarImg} style={styles.avatar} />
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </View>

          <Text style={styles.nameTop}>Júlio César</Text>
        </SafeAreaView>
      </View>

      {/* ── Card arredondado ── */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Alterar Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Endereço de e-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="seu@email.com"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+55 11 9XXXX-XXXX"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },

  // Header roxo
  purpleTop: {
    backgroundColor: '#5A189A',
    paddingBottom: 32,
    paddingHorizontal: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,               // igual ao EditProfileText do profileStyles
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  // Avatar
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 120,                 // igual ao ProfileImage do profileStyles
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#401A65',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameTop: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 30,              
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 40,
    marginBottom: 4,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 35,    
    borderTopRightRadius: 35,
    marginTop: -20,
  },
  cardContent: {
    paddingHorizontal: 30,      
    paddingTop: 35,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,               
    fontWeight: '700',
    color: '#401A65',
    marginBottom: 30,
  },
  label: {
    fontSize: 22,               
    fontWeight: '600',
    color: '#401A65',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,               
    color: '#1F1535',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
});