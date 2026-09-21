// Cliente HTTP único do app: timeout, JSON, Bearer token, erros padronizados
// e tratamento central de "sessão expirada" (401).
import { API_URL, REQUEST_TIMEOUT_MS } from '../config';

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;   // 0 = nem chegou no servidor
    this.code = code;       // NETWORK | TIMEOUT | BAD_RESPONSE | TOKEN_EXPIRED | INVALID_CREDENTIALS | ...
    this.details = details;
  }
}

const CODIGOS_SESSAO = ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'TOKEN_MISSING'];

let authToken = null;
let onSessionExpired = null;

export const setAuthToken = (t) => { authToken = t; };
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn; };

const montarQuery = (query) => {
  if (!query) return '';
  const partes = [];
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    (Array.isArray(v) ? v : [v]).forEach((item) => partes.push(`${encodeURIComponent(k)}=${encodeURIComponent(item)}`));
  });
  return partes.length ? `?${partes.join('&')}` : '';
};

export async function request(method, path, { body, auth = true, query } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const tinhaToken = auth && !!authToken;
  if (tinhaToken) headers.Authorization = `Bearer ${authToken}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API_URL}${path}${montarQuery(query)}`, {
      method,
      headers,
      signal: ctrl.signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError(0, e?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK',
      e?.name === 'AbortError' ? 'O servidor demorou demais para responder.' : 'Não foi possível conectar ao servidor.');
  } finally {
    clearTimeout(timer);
  }

  let json = null;
  try { json = await res.json(); } catch { /* corpo vazio ou não-JSON */ }

  if (!res.ok) {
    // formato novo: { error: { code, message, details } } — legado: { error: "texto" }
    const err = typeof json?.error === 'object' && json.error ? json.error : { message: json?.error };
    const apiErr = new ApiError(res.status, err.code || (json ? 'HTTP_ERROR' : 'BAD_RESPONSE'),
      err.message || `Erro ${res.status} no servidor.`, err.details);
    if (res.status === 401 && tinhaToken && CODIGOS_SESSAO.includes(apiErr.code) && onSessionExpired) {
      onSessionExpired(apiErr.code);
    }
    throw apiErr;
  }
  if (json === null) throw new ApiError(res.status, 'BAD_RESPONSE', 'Resposta inesperada do servidor.');
  return json.data;
}

export const isNetworkError = (e) => e?.code === 'NETWORK' || e?.code === 'TIMEOUT';
export const isSessionError = (e) => CODIGOS_SESSAO.includes(e?.code);

// Texto amigável para mostrar ao usuário.
export function errorMessage(e) {
  if (!e) return 'Ocorreu um erro inesperado.';
  if (e.code === 'NETWORK') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está no ar.'
      + (__DEV__ ? `\n\n(${API_URL})` : '');
  }
  if (e.code === 'TIMEOUT') return 'O servidor demorou demais para responder. Tente novamente.';
  if (e.code === 'BAD_RESPONSE') return 'O servidor respondeu algo inesperado. Tente novamente em instantes.';
  if (e.status >= 500) return 'Erro no servidor. Tente novamente em instantes.';
  return e.message || 'Ocorreu um erro inesperado.';
}
