// Teste ponta a ponta da camada de API do app contra o backend Flask REAL (e o banco dele).
// Uso: ver build.js. Variáveis: EXPO_PUBLIC_API_URL (backend) e, opcional, E2E_ADMIN_EMAIL/
// E2E_ADMIN_PASSWORD para conferir que um aluno não acessa o painel administrativo.
global.__DEV__ = false;
const path = require('path');
const H = path.join(__dirname, 'harness', 'src');
const c = require(path.join(H, 'api', 'client'));
const s = require(path.join(H, 'api', 'services'));
const m = require(path.join(H, 'mappers'));
const cfg = require(path.join(H, 'config'));

let ok = 0; let fail = 0;
const t = (nome, cond) => { if (cond) { ok++; console.log('  ✔', nome); } else { fail++; console.log('  ✘', nome); } };
const falha = async (fn) => { try { await fn(); return null; } catch (e) { return e; } };

(async () => {
  console.log('API_URL =', cfg.API_URL);
  const u = 'e2e' + Date.now();
  let expirou = 0;
  let salvos = 0;
  c.setSessionExpiredHandler(() => expirou++);
  c.setTokensChangedHandler(() => { salvos++; });

  // Saúde
  const saude = await fetch(cfg.HEALTH_URL).then((r) => r.json());
  t('GET /api/health: app e banco no ar', saude.status === 'ok' && saude.database === 'ok');

  // Cadastro e login
  const reg = await s.authApi.register({ nome_usuario: u, email: u + '@exemplo.com', senha: 'segredo1' });
  t('cadastro devolve access + refresh e o usuário', !!reg.tokens.access && !!reg.tokens.refresh && reg.usuario.nome_usuario === u);
  let e = await falha(() => s.authApi.register({ nome_usuario: u, email: 'x' + u + '@exemplo.com', senha: 'segredo1' }));
  t('nome de usuário duplicado rejeitado (409): ' + c.errorMessage(e), e && e.status === 409);
  e = await falha(() => s.authApi.login(u, 'errada'));
  t('senha errada (401 INVALID_CREDENTIALS)', e && e.status === 401 && e.code === 'INVALID_CREDENTIALS');
  t('login por nome de usuário', !!(await s.authApi.login(u, 'segredo1')).tokens.access);
  const lg = await s.authApi.login((u + '@exemplo.com').toUpperCase(), 'segredo1');
  t('login por e-mail (sem diferenciar maiúsculas)', !!lg.tokens.access);
  c.setTokens(lg.tokens);
  t('GET /me', (await s.meApi.get()).email === u + '@exemplo.com');

  // Perfil
  const up = await s.meApi.update({ telefone: '(11) 99999-0000' });
  t('PATCH /me: telefone salvo', up.telefone === '(11) 99999-0000');
  t('telefone relido do servidor', (await s.meApi.get()).telefone === '(11) 99999-0000');
  e = await falha(() => s.meApi.update({ nova_senha: 'nova-senha-1', senha_atual: 'errada' }));
  t('troca de senha com senha atual errada é recusada', e && e.status === 422);
  await s.meApi.update({ nova_senha: 'nova-senha-1', senha_atual: 'segredo1' });
  t('troca de senha com a senha atual correta', !!(await s.authApi.login(u, 'nova-senha-1')).tokens.access);
  const dash = await s.meApi.dashboard();
  t('dashboard do usuário', dash.usuario.nome_usuario === u && 'contagem_favoritos' in dash);

  // Catálogo
  const home = await s.catalogApi.home();
  t('home: públicas, privadas, cursos e vestibulares do banco',
    home.faculdades_publicas.length > 0 && home.faculdades_privadas.length > 0 && home.cursos.length > 0 && home.vestibulares.length > 0);
  t('home: públicas são públicas e privadas são privadas',
    home.faculdades_publicas.every((f) => f.tipo_instituicao === 'Pública') && home.faculdades_privadas.every((f) => f.tipo_instituicao === 'Privada'));
  t('home: cursos do catálogo apontam para cursos reais', home.cursos.every((x) => Number.isInteger(x.id)));
  const b = await s.catalogApi.busca('administracao');
  t('busca sem acento acha "Administração" (uma vez só)', b.cursos.filter((x) => x.nome === 'Administração').length === 1);
  const bf = await s.catalogApi.busca('unicamp');
  t('busca de faculdade', bf.faculdades.some((f) => /UNICAMP/i.test(f.nome)));
  const sg = await s.catalogApi.sugestoes('eng');
  t('autocomplete (cursos, faculdades e locais)', Array.isArray(sg.curso) && sg.curso.length > 0);
  const fac = await s.catalogApi.faculdade(home.faculdades_publicas[0].id);
  t('detalhe de faculdade com cursos', fac.id === home.faculdades_publicas[0].id && Array.isArray(fac.cursos));
  const cur = await s.catalogApi.curso(home.cursos[0].id);
  t('detalhe de curso com modalidades e instituições', !!cur.nome && cur.modalidades.length > 0 && cur.instituicoes.length > 0);
  const ves = await s.catalogApi.vestibulares({ proximos: 1 });
  t('próximos vestibulares com dias restantes', ves.length > 0 && ves.every((v) => typeof v.dias_restantes === 'number' && v.dias_restantes >= 0));
  console.log('   ex.:', ves[0].nome, '-', m.textoDias(ves[0]), '-', m.formatarData(ves[0].data_prova));
  const vd = await s.catalogApi.vestibular(ves[0].id);
  t('detalhe de vestibular', vd.id === ves[0].id && !!vd.link_edital);

  // Favoritos
  const f0 = home.faculdades_publicas[0]; const c0 = home.cursos[0]; const v0 = ves[0];
  await s.favoritesApi.add('faculdade', f0.id); await s.favoritesApi.add('curso', c0.id); await s.favoritesApi.add('vestibular', v0.id);
  let fl = await s.favoritesApi.list();
  t('3 favoritos salvos (1 de cada tipo)', fl.faculdades.length === 1 && fl.cursos.length === 1 && fl.vestibulares.length === 1);
  const outra = await s.authApi.login(u, 'nova-senha-1');
  c.setTokens(outra.tokens);
  fl = await s.favoritesApi.list();
  t('favoritos persistem em outra sessão (outro aparelho)', fl.faculdades.length + fl.cursos.length + fl.vestibulares.length === 3);
  await s.favoritesApi.remove('curso', c0.id);
  fl = await s.favoritesApi.list();
  t('remoção de favorito persiste', fl.cursos.length === 0 && fl.faculdades.length === 1);

  // Teste vocacional
  const pq = await s.vocationalApi.perguntas();
  t('perguntas do teste com alternativas próprias', pq.perguntas.length > 0 && pq.perguntas.every((q) => q.opcoes.length >= 2));
  const resp = {};
  pq.perguntas.forEach((q, i) => { resp[q.id] = q.opcoes[i % q.opcoes.length].id; });
  const res = await s.vocationalApi.enviar(resp);
  t('resultado calculado no servidor e salvo na conta', res.salvo === true && res.ranking.length > 0 && res.cursos_recomendados.length > 0);
  const ul = await s.vocationalApi.ultimo();
  t('último resultado = o enviado, com cursos compatíveis', ul.resultado_id === res.resultado_id && ul.cursos_recomendados.length > 0);
  t('dashboard conta o teste', (await s.meApi.dashboard()).testes_vocacionais.length >= 1);

  // Aluno não acessa o painel administrativo
  e = await falha(() => c.request('GET', '/admin/estatisticas'));
  t('aluno recebe 403 no painel administrativo', e && e.status === 403);

  // Renovação automática do access token (simula o token de 15 min vencido)
  const atual = c.getTokens();
  c.setTokens({ access: atual.access + 'x', refresh: atual.refresh });
  e = await falha(() => s.meApi.get());
  t('access token adulterado -> 401 INVALID_TOKEN e sessão encerrada', e && e.code === 'INVALID_TOKEN' && expirou === 1);
  // Com o backend rodando com ACCESS_TOKEN_TTL_SECONDS curto (E2E_ACCESS_TTL = mesmo valor),
  // espera o access token vencer de verdade e confere a renovação automática.
  const ttl = Number(process.env.E2E_ACCESS_TTL || 0);
  if (ttl) {
    const sessaoNova = await s.authApi.login(u, 'nova-senha-1');
    c.setTokens(sessaoNova.tokens);
    await new Promise((r) => setTimeout(r, (ttl + 1.5) * 1000));
    const antes = salvos;
    const [a, b2] = await Promise.all([s.meApi.get(), s.favoritesApi.list()]);
    t('access vencido é renovado sozinho (uma vez) e as requisições repetidas',
      a.nome_usuario === u && b2.faculdades.length === 1 && salvos === antes + 1);
    t('o refresh token foi trocado (rotação)', c.getTokens().refresh !== sessaoNova.tokens.refresh);
  }

  // Logout revoga a sessão no servidor
  const ultima = await s.authApi.login(u, 'nova-senha-1');
  c.setTokens(ultima.tokens);
  await s.authApi.logout();
  e = await falha(() => s.meApi.get());
  t('depois do logout o token é recusado (401)', e && e.status === 401);
  e = await falha(() => c.request('POST', '/auth/refresh', { body: { refresh_token: ultima.tokens.refresh }, auth: false }));
  t('e o refresh token também', e && e.status === 401);

  console.log(`\n${ok} ok, ${fail} falhas`);
  process.exit(fail ? 1 : 0);
})().catch((err) => { console.error('ERRO', err); process.exit(1); });
