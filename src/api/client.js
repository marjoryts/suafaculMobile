// Cliente HTTP único do app: timeout, JSON, Bearer token, erros padronizados,
// renovação automática do access token e tratamento central de "sessão expirada".
//
// Sessão (definida pelo backend Flask, /api/v1/auth/*):
//   access token  ~15 min  -> vai no cabeçalho Authorization
//   refresh token ~30 dias -> uso único; trocado em /auth/refresh por um par novo
// Quando a API responde 401 TOKEN_EXPIRED, o cliente renova uma única vez
// (mesmo com várias requisições simultâneas) e repete a requisição original.
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

// Códigos do backend que significam "esta sessão acabou: faça login de novo".
const CODIGOS_SESSAO = [
  'TOKEN_EXPIRED', 'INVALID_TOKEN', 'UNAUTHENTICATED',
  'INVALID_REFRESH_TOKEN', 'REFRESH_TOKEN_EXPIRED', 'REFRESH_TOKEN_REUSED',
];

let tokens = null;            // { access, refresh }
let onSessionExpired = null;  // chamado quando a sessão não pode mais ser renovada
let onTokensChanged = null;   // persiste o par novo após uma renovação
let renovacao = null;         // Promise da renovação em andamento (uma por vez)

export const setTokens = (t) => { tokens = t && t.access ? { access: t.access, refresh: t.refresh } : null; };
export const getTokens = () => tokens;
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn; };
export const setTokensChangedHandler = (fn) => { onTokensChanged = fn; };

const montarQuery = (query) => {
  if (!query) return '';
  const partes = [];
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    (Array.isArray(v) ? v : [v]).forEach((item) => partes.push(`${encodeURIComponent(k)}=${encodeURIComponent(item)}`));
  });
  return partes.length ? `?${partes.join('&')}` : '';
};

async function enviar(method, path, { body, query, bearer } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

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

  if (res.status === 204) return { data: null, meta: null };

  let json = null;
  try { json = await res.json(); } catch { /* corpo vazio ou não-JSON */ }

  if (!res.ok) {
    // formato da API v1: { error: { code, message, details, request_id } }
    const err = typeof json?.error === 'object' && json.error ? json.error : { message: json?.error };
    throw new ApiError(res.status, err.code || (json ? 'HTTP_ERROR' : 'BAD_RESPONSE'),
      err.message || `Erro ${res.status} no servidor.`, err.details);
  }
  if (json === null) throw new ApiError(res.status, 'BAD_RESPONSE', 'Resposta inesperada do servidor.');
  return { data: json.data, meta: json.meta };
}

function renovarTokens() {
  if (!renovacao) {
    const refresh = tokens?.refresh;
    renovacao = (async () => {
      if (!refresh) throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Sessão encerrada.');
      const { data } = await enviar('POST', '/auth/refresh', { body: { refresh_token: refresh } });
      tokens = { access: data.tokens.access_token, refresh: data.tokens.refresh_token };
      if (onTokensChanged) await onTokensChanged(tokens);
      return tokens;
    })().finally(() => { renovacao = null; });
  }
  return renovacao;
}

function sessaoAcabou(e) {
  if (e instanceof ApiError && e.status === 401 && CODIGOS_SESSAO.includes(e.code) && onSessionExpired) {
    onSessionExpired(e.code);
  }
}

// Requisição completa: devolve { data, meta }.
export async function requestCompleto(method, path, { body, auth = true, query } = {}) {
  const usarToken = auth && !!tokens?.access;
  try {
    return await enviar(method, path, { body, query, bearer: usarToken ? tokens.access : undefined });
  } catch (e) {
    if (!(usarToken && e instanceof ApiError && e.status === 401 && e.code === 'TOKEN_EXPIRED')) {
      if (usarToken) sessaoAcabou(e);
      throw e;
    }
  }
  // Access token expirou: renova uma vez e repete.
  try {
    await renovarTokens();
  } catch (e) {
    if (!isNetworkError(e)) sessaoAcabou(e instanceof ApiError && e.status === 401 ? e : new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Sessão encerrada.'));
    throw e;
  }
  try {
    return await enviar(method, path, { body, query, bearer: tokens?.access });
  } catch (e) {
    sessaoAcabou(e);
    throw e;
  }
}

// Atalho usado pelas telas: só o campo `data` da resposta.
export async function request(method, path, opcoes) {
  return (await requestCompleto(method, path, opcoes)).data;
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
