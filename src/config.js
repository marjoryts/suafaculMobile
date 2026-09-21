// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO CENTRAL DA API — é o ÚNICO lugar que decide a URL do backend.
//
// Ordem de prioridade:
//   1. EXPO_PUBLIC_API_URL  (arquivo .env / variável de ambiente)   ← use em produção/túnel
//   2. expo.extra.apiUrl    (app.json)
//   3. Automático em desenvolvimento: o Expo já sabe o IP do seu PC (é por ele que o
//      celular baixa o app), então usamos esse mesmo IP na porta da API.
//        • celular físico (Expo Go) ........ http://<IP-do-PC>:5000
//        • emulador Android ................ http://<IP-do-PC>:5000  (ou 10.0.2.2 se o Expo não informar)
//        • simulador iOS / navegador ....... http://localhost:5000
//
// Nunca use "localhost" no celular físico: lá, localhost é o próprio celular.
// ─────────────────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_PORT = 5000; // mesma porta do Flask (variável PORT do backend)
const API_PATH = '/api/v1';

export const REQUEST_TIMEOUT_MS = 12000;

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

function hostDoExpo() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    null;
  if (!hostUri) return null;
  const host = String(hostUri).split(':')[0];
  // Túnel do Expo (xxx.exp.direct) aponta para o Metro, não para o Flask: não serve.
  return IPV4.test(host) || host === 'localhost' ? host : null;
}

function normalizar(url) {
  let u = String(url).trim().replace(/\/+$/, '');
  if (!/\/api\/v1$/.test(u)) u += API_PATH;
  return u;
}

function resolverOrigem() {
  const daEnv = process.env.EXPO_PUBLIC_API_URL;
  if (daEnv) return { url: normalizar(daEnv), origem: 'EXPO_PUBLIC_API_URL' };

  const doAppJson = Constants.expoConfig?.extra?.apiUrl;
  if (doAppJson) return { url: normalizar(doAppJson), origem: 'app.json (extra.apiUrl)' };

  const host = hostDoExpo();
  if (host) return { url: `http://${host}:${API_PORT}${API_PATH}`, origem: 'IP do servidor Expo' };

  if (Platform.OS === 'android') return { url: `http://10.0.2.2:${API_PORT}${API_PATH}`, origem: 'emulador Android' };
  return { url: `http://localhost:${API_PORT}${API_PATH}`, origem: 'localhost' };
}

const resolvido = resolverOrigem();

export const API_URL = resolvido.url;                       // ex.: http://192.168.0.10:5000/api/v1
export const API_ORIGEM_CONFIG = resolvido.origem;          // de onde a URL veio (para diagnóstico)
export const HEALTH_URL = API_URL.replace(/\/api\/v1$/, '/api/health');

if (__DEV__) {
  // Ajuda a diagnosticar "não conecta no celular": confira este IP no navegador do celular + /api/health
  console.log(`[api] usando ${API_URL}  (${API_ORIGEM_CONFIG})`);
}
