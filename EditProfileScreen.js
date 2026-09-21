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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AvatarImg from './assets/AvatarPhoto.png';
import { useThemeContext } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { errorMessage } from './src/api/client';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.nome_usuario || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.telefone || '');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Salva no servidor (PATCH /api/v1/me) — só envia o que mudou.
  const handleSave = async () => {
    const dados = {};
    if (name.trim() !== (user?.nome_usuario || '')) dados.nome_usuario = name.trim();
    if (email.trim() !== (user?.email || '')) dados.email = email.trim();
    if (phone.trim() !== (user?.telefone || '')) dados.telefone = phone.trim();
    if (password) {
      if (!currentPassword) {
        Alert.alert('Senha atual', 'Informe sua senha atual para definir uma nova senha.');
        return;
      }
      dados.nova_senha = password;
      dados.senha_atual = currentPassword;
    }
    if (Object.keys(dados).length === 0) { navigation.goBack(); return; }
    setSaving(true);
    try {
      await updateProfile(dados);
      Alert.alert('Perfil atualizado', 'Suas alterações foram salvas.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Não foi possível salvar', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.purpleTop}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Salvar</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.avatarWrap}>
            <Image source={AvatarImg} style={styles.avatar} />
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </View>

          <Text style={styles.nameTop}>{user?.nome_usuario || ''}</Text>
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

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {password ? (
          <>
            <Text style={styles.label}>Senha atual</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Confirme sua senha atual"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </>
        ) : null}

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
    fontSize: 16,               
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  // Avatar
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 120,                
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