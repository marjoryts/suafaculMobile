// Um método por endpoint da API Flask (/api/v1). Tudo devolve o campo `data` da resposta.
import { request } from './client';

export const authApi = {
  register: ({ nome_usuario, email, senha }) =>
    request('POST', '/auth/register', { body: { nome_usuario, email, senha }, auth: false }),
  login: (identificador, senha) =>
    request('POST', '/auth/login', { body: { identificador, senha }, auth: false }),
  logout: () => request('POST', '/auth/logout'),
};

export const meApi = {
  get: () => request('GET', '/me'),
  update: (dados) => request('PATCH', '/me', { body: dados }),
};

export const catalogApi = {
  home: () => request('GET', '/home', { auth: false }),
  busca: (q) => request('GET', '/busca', { query: { q }, auth: false }),
  sugestoes: (q) => request('GET', '/busca/sugestoes', { query: { q }, auth: false }),
  faculdade: (id) => request('GET', `/faculdades/${id}`, { auth: false }),
  curso: (id) => request('GET', `/cursos/${id}`, { auth: false }),
  vestibulares: (params) => request('GET', '/vestibulares', { query: { limit: 50, ...params }, auth: false }),
  vestibular: (id) => request('GET', `/vestibulares/${id}`, { auth: false }),
};

export const favoritesApi = {
  list: () => request('GET', '/favoritos'),
  add: (tipo, id) => request('PUT', `/favoritos/${tipo}/${id}`),
  remove: (tipo, id) => request('DELETE', `/favoritos/${tipo}/${id}`),
};

export const vocationalApi = {
  perguntas: () => request('GET', '/teste-vocacional/perguntas', { auth: false }),
  enviar: (respostas) => request('POST', '/teste-vocacional/resultados', { body: { respostas } }),
  ultimo: () => request('GET', '/teste-vocacional/resultados/ultimo'),
};
