# SuaFacul Mobile — conexão com a API

1. Suba o backend: `cd suafaculwebsite-main && python app.py` (porta 5000).
2. No celular físico: PC e celular na **mesma rede Wi-Fi**; libere a porta 5000 no firewall do PC.
   Teste no navegador do celular: `http://<IP-do-PC>:5000/api/health` deve mostrar `"status": "ok"`.
3. `npm install --legacy-peer-deps` e `npx expo start`. A URL da API é detectada automaticamente
   a partir do IP do Metro (`src/config.js`). Emulador Android sem essa info usa `10.0.2.2`.
4. Para forçar outra URL: `EXPO_PUBLIC_API_URL=http://IP:5000` (ver `.env.example`) ou `expo.extra.apiUrl` no `app.json`.
   Túnel do Expo (`--tunnel`) não expõe o Flask: use ngrok/servidor e `EXPO_PUBLIC_API_URL`.
5. Build standalone Android com HTTP (sem HTTPS) exige liberar cleartext (expo-build-properties); em produção use HTTPS.
