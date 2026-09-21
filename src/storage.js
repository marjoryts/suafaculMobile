// Guarda o token da sessão. No celular usa SecureStore (Keychain/Keystore);
// na web (sem SecureStore) e como plano B usa AsyncStorage.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'suafacul.token';
const usaSecure = Platform.OS !== 'web';

export const tokenStorage = {
  async get() {
    if (usaSecure) {
      try { return await SecureStore.getItemAsync(KEY); } catch { /* cai no AsyncStorage */ }
    }
    return AsyncStorage.getItem(KEY);
  },
  async set(valor) {
    if (usaSecure) {
      try { await SecureStore.setItemAsync(KEY, valor); return; } catch { /* cai no AsyncStorage */ }
    }
    await AsyncStorage.setItem(KEY, valor);
  },
  async clear() {
    if (usaSecure) {
      try { await SecureStore.deleteItemAsync(KEY); } catch { /* ignora */ }
    }
    try { await AsyncStorage.removeItem(KEY); } catch { /* ignora */ }
  },
};
