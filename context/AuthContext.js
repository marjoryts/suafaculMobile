import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, meApi } from '../src/api/services';
import { setAuthToken, setSessionExpiredHandler, isNetworkError } from '../src/api/client';
import { tokenStorage } from '../src/storage';

const AuthContext = createContext(null);
const USER_KEY = 'suafacul.user'; // cópia do usuário só para abrir o app sem internet; a verdade é o servidor

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'anonymous'
  const [user, setUser] = useState(null);

  const guardarUsuario = useCallback(async (u) => {
    setUser(u);
    try { await AsyncStorage.setItem(USER_KEY, JSON.stringify(u)); } catch { /* ignora */ }
  }, []);

  const clearSession = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    setStatus('anonymous');
    try { await tokenStorage.clear(); await AsyncStorage.removeItem(USER_KEY); } catch { /* ignora */ }
  }, []);

  const startSession = useCallback(async ({ token, usuario }) => {
    setAuthToken(token);
    await tokenStorage.set(token);
    await guardarUsuario(usuario);
    setStatus('authenticated');
  }, [guardarUsuario]);

  // Sessão expirada/encerrada no servidor -> limpa tudo e avisa uma vez (o navegador volta para a Welcome).
  const expirou = useCallback(() => {
    clearSession();
    Alert.alert('Sessão expirada', 'Sua sessão terminou. Faça login novamente para continuar.');
  }, [clearSession]);

  // Ao abrir o app: restaura a sessão salva.
  useEffect(() => {
    setSessionExpiredHandler(expirou);
    (async () => {
      let token = null;
      try { token = await tokenStorage.get(); } catch { /* ignora */ }
      if (!token) { setStatus('anonymous'); return; }
      setAuthToken(token);
      try {
        await guardarUsuario(await meApi.get());
        setStatus('authenticated');
      } catch (e) {
        if (isNetworkError(e)) {
          // Servidor fora do ar: não expulsa o usuário. Abre com o último perfil conhecido;
          // cada tela mostra "servidor indisponível" com botão de tentar de novo.
          try {
            const salvo = await AsyncStorage.getItem(USER_KEY);
            if (salvo) { setUser(JSON.parse(salvo)); setStatus('authenticated'); return; }
          } catch { /* ignora */ }
        }
        // 401 já foi tratado por `expirou`; qualquer outro caso: pede login.
        setAuthToken(null);
        setStatus('anonymous');
      }
    })();
  }, [expirou, guardarUsuario]);

  const login = useCallback(async (identificador, senha) => startSession(await authApi.login(identificador, senha)), [startSession]);
  const register = useCallback(async (dados) => startSession(await authApi.register(dados)), [startSession]);
  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* mesmo offline, encerramos localmente */ }
    await clearSession();
  }, [clearSession]);
  const updateProfile = useCallback(async (dados) => {
    const u = await meApi.update(dados);
    await guardarUsuario(u);
    return u;
  }, [guardarUsuario]);

  const value = useMemo(
    () => ({ status, user, login, register, logout, updateProfile }),
    [status, user, login, register, logout, updateProfile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
