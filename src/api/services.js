// Um método por funcionalidade, todos sobre a API REAL do backend Flask (/api/v1 — contrato em
// /api/v1/openapi.json). Nenhuma regra de negócio é recalculada aqui: pontuação do teste,
// recomendações, favoritos e permissões são do servidor. Este arquivo só traduz o formato da
// API para o formato que as telas já usavam.
import { ApiError, getTokens, request, requestCompleto } from './client';
import { comPrazo, normalizarTexto } from '../mappers';

const comTipo = (tipo) => (x) => ({ ...x, tipo });

// Resposta de /auth/login e /auth/registrar -> { usuario, tokens: { access, refresh } }
const sessao = (d) => ({
  usuario: d.usuario,
  tokens: { access: d.tokens.access_token, refresh: d.tokens.refresh_token },
});

export const authApi = {
  register: async ({ nome_usuario, email, senha }) =>
    sessao(await request('POST', '/auth/registrar', { body: { nome_usuario, email, password: senha }, auth: false })),
  // `identificador` = nome de usuário OU e-mail (como no login do site).
  login: async (identificador, senha) =>
    sessao(await request('POST', '/auth/login', { body: { identificador, password: senha }, auth: false })),
  // Encerra a sessão no servidor (revoga o refresh token deste aparelho).
  logout: () => request('POST', '/auth/logout', { body: { refresh_token: getTokens()?.refresh || '' }, auth: false }),
};

export const meApi = {
  get: () => request('GET', '/me'),
  // Campos da tela de edição -> campos do PATCH /me.
  update: (dados) => {
    const corpo = {};
    if ('nome_usuario' in dados) corpo.nome_usuario = dados.nome_usuario;
    if ('email' in dados) corpo.email = dados.email;
    if ('telefone' in dados) corpo.telefone = dados.telefone;
    if (dados.nova_senha) {
      corpo.password = dados.nova_senha;
      corpo.password_confirm = dados.nova_senha;
      corpo.senha_atual = dados.senha_atual || '';
    }
    return request('PATCH', '/me', { body: corpo });
  },
  dashboard: () => request('GET', '/me/dashboard'),
};

const listar = (path, query) => request('GET', path, { query, auth: false });

// Mesmo curso em várias instituições: mostra uma vez só (a primeira oferta).
function semRepetirNome(cursos) {
  const vistos = new Set();
  return cursos.filter((c) => {
    const chave = normalizarTexto(c.nome);
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

export const catalogApi = {
  // Tela inicial: faculdades públicas e privadas, formações do catálogo (as mesmas da home do
  // site) e os próximos vestibulares — tudo do banco.
  home: async () => {
    const [publicas, privadas, catalogo, vestibulares] = await Promise.all([
      listar('/faculdades', { tipo_instituicao: 'Pública', limit: 10 }),
      listar('/faculdades', { tipo_instituicao: 'Privada', limit: 10 }),
      listar('/cursos/catalogo'),
      listar('/vestibulares', { incluir_privados: 'true', limit: 10 }),
    ]);
    return {
      faculdades_publicas: publicas.map(comTipo('faculdade')),
      faculdades_privadas: privadas.map(comTipo('faculdade')),
      // `id` = uma oferta real do curso (tabela cursos): detalhe e favorito usam esse id.
      cursos: catalogo.filter((c) => c.curso_id).map((c) => ({ ...c, catalogo_id: c.id, id: c.curso_id, tipo: 'curso' })),
      vestibulares: vestibulares.map(comPrazo).map(comTipo('vestibular')),
    };
  },
  busca: async (q) => {
    const [faculdades, cursos, vestibulares] = await Promise.all([
      listar('/faculdades', { busca: q, limit: 20 }),
      listar('/cursos', { busca: q, limit: 50 }),
      listar('/vestibulares', { busca: q, incluir_privados: 'true', limit: 20 }),
    ]);
    return {
      faculdades: faculdades.map(comTipo('faculdade')),
      cursos: semRepetirNome(cursos).map(comTipo('curso')),
      vestibulares: vestibulares.map(comPrazo).map(comTipo('vestibular')),
    };
  },
  sugestoes: (q) => listar('/busca/sugestoes', { q }),
  faculdade: async (id) => ({ ...(await listar(`/faculdades/${id}`)), tipo: 'faculdade' }),
  // Detalhe do curso + onde ele é oferecido (todas as ofertas com o mesmo nome).
  curso: async (id) => {
    const curso = await listar(`/cursos/${id}`);
    const { data: ofertas } = await requestCompleto('GET', '/cursos', {
      query: { busca: curso.nome, limit: 100 }, auth: false,
    });
    const mesmas = ofertas.filter((o) => normalizarTexto(o.nome) === normalizarTexto(curso.nome));
    const unicos = (valores) => [...new Set(valores.filter(Boolean))];
    return {
      ...curso,
      tipo: 'curso',
      duracoes: unicos(mesmas.map((o) => o.duracao)),
      modalidades: unicos(mesmas.map((o) => o.modalidade)),
      instituicoes: unicos(mesmas.map((o) => o.instituicao)).map((nome) => ({ nome })),
    };
  },
  // `proximos`: só provas de hoje em diante (calendário da aba Vestibulares).
  vestibulares: async ({ proximos, ...params } = {}) => {
    const lista = (await listar('/vestibulares', { incluir_privados: 'true', limit: 50, ...params })).map(comPrazo);
    return (proximos ? lista.filter((v) => v.dias_restantes !== null && v.dias_restantes >= 0) : lista)
      .map(comTipo('vestibular'));
  },
  vestibular: async (id) => ({ ...comPrazo(await listar(`/vestibulares/${id}`)), tipo: 'vestibular' }),
};

export const favoritesApi = {
  // A API devolve uma lista [{tipo, item_id, nome_item, item}]; as telas usam três listas.
  list: async () => {
    const lista = await request('GET', '/favoritos');
    const grupos = { faculdades: [], cursos: [], vestibulares: [] };
    const destino = { faculdade: 'faculdades', curso: 'cursos', vestibular: 'vestibulares' };
    lista.forEach((f) => {
      const item = { ...(f.item || {}), id: f.item_id, nome: f.item?.nome || f.nome_item, tipo: f.tipo };
      grupos[destino[f.tipo]].push(f.tipo === 'vestibular' ? comPrazo(item) : item);
    });
    return grupos;
  },
  add: (tipo, id) => request('PUT', `/favoritos/${tipo}/${id}`),
  remove: (tipo, id) => request('DELETE', `/favoritos/${tipo}/${id}`),
};

// Ranking dos perfis (percentual calculado pelo servidor) no formato da tela de resultado.
const ranking = (pontuacoes) => (pontuacoes || []).map((p, i) => ({
  posicao: i + 1, chave: p.chave, nome: p.nome, nota: p.percentual, maximo: 100,
}));

export const vocationalApi = {
  // Mesmo questionário da web (fonte única no backend): cada pergunta tem as próprias alternativas.
  perguntas: async () => {
    const d = await request('GET', '/teste-vocacional/perguntas', { auth: false });
    return {
      perguntas: d.secoes.flatMap((s) => s.perguntas.map((p) => ({ ...p, categoria: s.titulo }))),
    };
  },
  // Pontuação feita no servidor; com login, o resultado fica salvo no histórico da conta.
  enviar: async (respostas) => {
    const r = await request('POST', '/teste-vocacional/resultados', { body: { respostas } });
    const vistos = new Set();
    const cursos = (r.perfis || []).flatMap((p) => p.cursos_sugeridos || [])
      .filter((c) => (vistos.has(c.id) ? false : vistos.add(c.id)))
      .map(comTipo('curso'));
    return { ...r, perfil_nome: r.perfis?.[0]?.nome, ranking: ranking(r.pontuacoes), cursos_recomendados: cursos };
  },
  // Último resultado salvo na conta + cursos por compatibilidade (mesma regra da web).
  ultimo: async () => {
    const historico = await request('GET', '/teste-vocacional/resultados', { query: { limit: 1 } });
    if (!historico.length) {
      throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Você ainda não fez o teste vocacional.');
    }
    const h = historico[0];
    const rec = await request('GET', '/teste-vocacional/recomendacoes', { query: { id: h.id, limite: 6 } });
    return {
      resultado_id: h.id,
      perfil_nome: h.perfil_nome,
      created_at: h.created_at,
      ranking: ranking(h.pontuacoes),
      cursos_recomendados: (rec.cursos || []).map(comTipo('curso')),
    };
  },
};
