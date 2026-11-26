// Guarda os tokens da sessão (access 15 min + refresh rotativo 30 dias, emitidos pelo backend Flask).
// No celular usa SecureStore (Keychain/Keystore); na web (sem SecureStore) e como plano B usa AsyncStorage.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'suafacul.sessao';
const KEY_ANTIGA = 'suafacul.token'; // formato antigo (token único): não é mais aceito pelo servidor
const usaSecure = Platform.OS !== 'web';

async function ler(chave) {
  if (usaSecure) {
    try { return await SecureStore.getItemAsync(chave); } catch { /* cai no AsyncStorage */ }
  }
  return AsyncStorage.getItem(chave);
}

async function apagar(chave) {
  if (usaSecure) {
    try { await SecureStore.deleteItemAsync(chave); } catch { /* ignora */ }
  }
  try { await AsyncStorage.removeItem(chave); } catch { /* ignora */ }
}

export const tokenStorage = {
  // -> { access, refresh } ou null
  async get() {
    const bruto = await ler(KEY);
    if (!bruto) {
      await apagar(KEY_ANTIGA);
      return null;
    }
    try {
      const t = JSON.parse(bruto);
      return t && t.access && t.refresh ? t : null;
    } catch {
      return null;
    }
  },
  async set(tokens) {
    const valor = JSON.stringify({ access: tokens.access, refresh: tokens.refresh });
    if (usaSecure) {
      try { await SecureStore.setItemAsync(KEY, valor); return; } catch { /* cai no AsyncStorage */ }
    }
    await AsyncStorage.setItem(KEY, valor);
  },
  async clear() {
    await apagar(KEY);
    await apagar(KEY_ANTIGA);
  },
};
