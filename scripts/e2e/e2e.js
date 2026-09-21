global.__DEV__=false;
process.env.EXPO_PUBLIC_API_URL='http://127.0.0.1:5055';
const c=require('./src/api/client'), s=require('./src/api/services'), m=require('./src/mappers'), cfg=require('./src/config');
let ok=0,fail=0;
const t=(n,c)=>{ if(c){ok++;console.log('  ✔',n)}else{fail++;console.log('  ✘',n)} };
(async()=>{
  console.log('API_URL =',cfg.API_URL);
  const u='user'+Date.now();
  let expired=0; c.setSessionExpiredHandler(()=>expired++);
  // 1 cadastro -> token
  const reg=await s.authApi.register({nome_usuario:u,email:u+'@ex.com',senha:'segredo1'});
  t('cadastro devolve token e usuário',reg.token&&reg.usuario.nome_usuario===u);
  c.setAuthToken(reg.token);
  // duplicado
  try{ await s.authApi.register({nome_usuario:u,email:'x'+u+'@ex.com',senha:'segredo1'}); t('duplicado rejeitado',false)}catch(e){t('duplicado rejeitado: '+e.code+' / '+c.errorMessage(e),e.status===409)}
  // login
  c.setAuthToken(null);
  try{ await s.authApi.login(u,'errada'); t('senha errada rejeitada',false)}catch(e){t('senha errada: '+c.errorMessage(e),e.status===401)}
  const lg=await s.authApi.login(u.toUpperCase(),'segredo1'); t('login (case-insensitive) ok',!!lg.token);
  c.setAuthToken(lg.token);
  t('GET /me',(await s.meApi.get()).email===u+'@ex.com');
  // perfil
  const up=await s.meApi.update({telefone:'11 99999-0000'}); t('PATCH /me telefone persistido',up.telefone==='11 99999-0000');
  t('telefone relido do servidor',(await s.meApi.get()).telefone==='11 99999-0000');
  // catálogo
  const home=await s.catalogApi.home();
  t('home: públicas/privadas/cursos/vestibulares',home.faculdades_publicas.length>0&&home.faculdades_privadas.length>0&&home.cursos.length>0&&home.vestibulares.length>0);
  const b=await s.catalogApi.busca('administracao'); t('busca sem acento acha "Administração"',b.cursos.some(x=>x.nome==='Administração'));
  const sg=await s.catalogApi.sugestoes('eng'); console.log('   sugestoes:',JSON.stringify(sg).slice(0,140)); t('autocomplete responde',sg!=null);
  const fac=await s.catalogApi.faculdade(home.faculdades_publicas[0].id); t('detalhe faculdade com lat/lng',fac.latitude!=null&&!!fac.descricao);
  const cur=await s.catalogApi.curso(home.cursos[0].id); t('detalhe curso',!!cur.nome&&Array.isArray(cur.modalidades));
  const ves=await s.catalogApi.vestibulares({proximos:1}); t('vestibulares futuros c/ dias_restantes',ves.length>0&&ves.every(v=>typeof v.dias_restantes==='number'));
  console.log('   ex:',ves[0].nome,m.textoDias(ves[0]),m.formatarData(ves[0].data_prova));
  const vd=await s.catalogApi.vestibular(ves[0].id); t('detalhe vestibular',vd.id===ves[0].id);
  // favoritos
  const f0=home.faculdades_publicas[0], c0=home.cursos[0], v0=ves[0];
  await s.favoritesApi.add('faculdade',f0.id); await s.favoritesApi.add('curso',c0.id); await s.favoritesApi.add('vestibular',v0.id);
  let fl=await s.favoritesApi.list(); t('3 favoritos salvos',fl.total===3);
  // "reinício do app": novo login em outra sessão vê os mesmos favoritos
  const lg2=await s.authApi.login(u,'segredo1'); c.setAuthToken(lg2.token);
  fl=await s.favoritesApi.list(); t('favoritos persistem em nova sessão',fl.total===3);
  await s.favoritesApi.remove('curso',c0.id); fl=await s.favoritesApi.list(); t('remoção persiste',fl.total===2&&fl.cursos.length===0);
  // vocacional
  const pq=await s.vocationalApi.perguntas(); t('15 perguntas',pq.perguntas.length===15);
  const resp={}; pq.perguntas.forEach((q,i)=>resp[q.id]= i%3===0?5:2);
  const res=await s.vocationalApi.enviar(resp); t('resultado com ranking e cursos',res.ranking.length===6&&res.cursos_recomendados.length>0);
  const ul=await s.vocationalApi.ultimo(); t('último resultado = enviado',ul.perfil_principal===res.perfil_principal);
  // logout / sessão expirada
  await s.authApi.logout(); 
  try{ await s.meApi.get(); t('token revogado rejeitado',false)}catch(e){t('token revogado -> 401 '+e.code,e.status===401)}
  t('handler de sessão expirada disparado',expired===1);
  // servidor indisponível
  process.env.EXPO_PUBLIC_API_URL='http://127.0.0.1:1';
  for (const k of Object.keys(require.cache)) if(k.includes('/harness/src')) delete require.cache[k];
  const c2=require('./src/api/client'), s2=require('./src/api/services');
  try{ await s2.catalogApi.home(); t('servidor fora',false)}catch(e){t('servidor fora -> isNetworkError: "'+c2.errorMessage(e)+'"',c2.isNetworkError(e))}
  console.log(`\n${ok} ok, ${fail} falhas`); process.exit(fail?1:0);
})().catch(e=>{console.error('ERRO',e);process.exit(1)});
