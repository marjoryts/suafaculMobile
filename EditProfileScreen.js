// EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from './context/ThemeContext';
import AvatarImg from './assets/AvatarPhoto.png';

export default function EditProfileScreen({ navigation }) {
  const theme = useThemeContext();

  const [name, setName] = useState('Júlio César');
  const [email, setEmail] = useState('julio@example.com');
  const [phone, setPhone] = useState('+55 11 9XXXX-XXXX');
  const [password, setPassword] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header idêntico ao perfil */}
      <View style={[styles.header, { borderBottomColor: theme.divider || '#eee' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Perfil</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Topo idêntico à tela de perfil */}
        <View style={styles.topArea}>
          <Image source={AvatarImg} style={styles.avatar} />
          <Text style={[styles.nameText, { color: theme.textPrimary }]}>Júlio César</Text>
          <Text style={[styles.emailText, { color: theme.textSecondary }]}>julio@example.com</Text>
        </View>

        {/* Seção Alterar Perfil */}
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Alterar Perfil</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.inputBg || '#fff', color: theme.textPrimary, borderColor: theme.inputBorder || 'transparent' }]}
            />

            <Text style={[styles.label, { color: theme.textPrimary }]}>Endereço de e-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="seu@email.com"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.inputBg || '#fff', color: theme.textPrimary, borderColor: theme.inputBorder || 'transparent' }]}
            />

            <Text style={[styles.label, { color: theme.textPrimary }]}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.inputBg || '#fff', color: theme.textPrimary, borderColor: theme.inputBorder || 'transparent' }]}
            />

            <Text style={[styles.label, { color: theme.textPrimary }]}>Telefone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+55 11 9XXXX-XXXX"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.inputBg || '#fff', color: theme.textPrimary, borderColor: theme.inputBorder || 'transparent' }]}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer com botões idênticos ao estilo do app */}
      <View style={[styles.footer, { borderTopColor: theme.divider || '#eee' }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary || '#401A65' }]}
          onPress={() => {
            // salvar: implemente API/AsyncStorage conforme necessário
            navigation.goBack();
          }}
        >
          <Text style={styles.saveText}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelWrap}>
          <Text style={{ color: theme.textSecondary }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 64,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 18 : 14,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  headerButton: { padding: 8 },
  headerTitleWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  scroll: { paddingBottom: 24 },

  topArea: { alignItems: 'center', marginTop: 18 },
  avatar: { width: 96, height: 96, borderRadius: 48, resizeMode: 'cover' },
  nameText: { marginTop: 12, fontSize: 18, fontWeight: '700' },
  emailText: { marginTop: 4, fontSize: 13 },

  sectionWrap: { paddingHorizontal: 20, marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  label: { marginTop: 12, marginBottom: 6, fontSize: 13, fontWeight: '600' },
  input: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1
  },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    backgroundColor: 'transparent'
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveText: { color: '#fff', fontWeight: '700' },
  cancelWrap: { alignItems: 'center', marginTop: 12 }
});
