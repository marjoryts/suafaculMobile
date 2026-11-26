# SuaFacul Mobile — conexão com a API

O app **não tem banco nem regra de negócio próprios**: tudo vem do backend Flask
(`suafaculwebsite`, rotas `/api/v1`), que guarda os dados no **Supabase (PostgreSQL)**.
O app nunca fala direto com o Supabase e não contém nenhuma chave dele.

## Rodando

1. Suba o backend: `cd suafaculwebsite && python run.py` (porta 5000; ver `.env.example` de lá —
   `DATABASE_URL` aponta para o Supabase).
2. Celular físico: PC e celular na **mesma rede Wi-Fi**, porta 5000 liberada no firewall e o backend
   com `HOST=0.0.0.0`. Teste no navegador do celular: `http://<IP-do-PC>:5000/api/health` deve mostrar
   `{"status": "ok", "database": "ok"}`.
3. `npm install --legacy-peer-deps` e `npx expo start`. A URL da API é detectada a partir do IP do
   Metro (`src/config.js`); emulador Android sem essa info usa `10.0.2.2`.
4. Para outra URL (produção na Vercel, ngrok...): `EXPO_PUBLIC_API_URL=https://...` (ver `.env.example`).
5. Build standalone Android com HTTP (sem HTTPS) exige liberar cleartext; em produção use HTTPS.

## Sessão

- Login por **nome de usuário ou e-mail** (`POST /auth/login` com `identificador`).
- O backend devolve um **access token (15 min)** e um **refresh token (30 dias, uso único)**,
  guardados no SecureStore. Quando o access vence, `src/api/client.js` renova sozinho
  (`/auth/refresh`) e repete a requisição; se a sessão foi encerrada no servidor (logout, troca de
  senha, reuso de token), o app volta para a tela inicial.
- Sair (`/auth/logout`) revoga a sessão no servidor.

## Onde cada tela busca os dados

| Tela | Endpoints |
|---|---|
| Início | `/faculdades?tipo_instituicao=Pública\|Privada`, `/cursos/catalogo`, `/vestibulares` |
| Busca | `/faculdades?busca=`, `/cursos?busca=`, `/vestibulares?busca=` (sem diferenciar acentos) |
| Detalhe de curso / faculdade / vestibular | `/cursos/{id}` (+ ofertas do mesmo curso), `/faculdades/{id}`, `/vestibulares/{id}` |
| Favoritos | `GET /favoritos`, `PUT`/`DELETE /favoritos/{tipo}/{id}` |
| Teste vocacional | `/teste-vocacional/perguntas`, `POST /teste-vocacional/resultados`, `/resultados`, `/recomendacoes` |
| Perfil | `GET`/`PATCH /me` (nome, e-mail, telefone, senha com confirmação da senha atual) |

Contrato completo: `GET /api/v1/openapi.json`.

## Teste ponta a ponta (camada de API contra o backend real)

```
cd scripts/e2e && npm init -y >/dev/null && npm i @babel/core @babel/plugin-transform-modules-commonjs
node build.js && EXPO_PUBLIC_API_URL=http://127.0.0.1:5000 node e2e.js
```

Para testar também a renovação automática do token, suba o backend com
`ACCESS_TOKEN_TTL_SECONDS=4` e rode o e2e com `E2E_ACCESS_TTL=4`.
