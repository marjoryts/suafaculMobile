// Compila a camada de API do app (src/config, mappers, api/*) para CommonJS e a roda no Node,
// contra um backend Flask REAL — sem simulador e sem mocks da API.
//
//   cd scripts/e2e && npm init -y >/dev/null && npm i @babel/core @babel/plugin-transform-modules-commonjs
//   node build.js && EXPO_PUBLIC_API_URL=http://127.0.0.1:5055 node e2e.js
//
// Só os módulos nativos (react-native, expo-constants e as imagens de src/assets.js) são trocados
// por versões mínimas, porque não existem fora do celular.
const fs = require('fs');
const path = require('path');
const babel = require(require.resolve('@babel/core', { paths: [__dirname] }));
const plugin = require.resolve('@babel/plugin-transform-modules-commonjs', { paths: [__dirname] });

const raiz = path.resolve(__dirname, '..', '..', 'src');
const saida = path.join(__dirname, 'harness');
fs.rmSync(saida, { recursive: true, force: true });
fs.mkdirSync(path.join(saida, 'src', 'api'), { recursive: true });
for (const f of ['config.js', 'mappers.js', 'api/client.js', 'api/services.js']) {
  const r = babel.transformFileSync(path.join(raiz, f), { babelrc: false, configFile: false, plugins: [plugin] });
  fs.writeFileSync(path.join(saida, 'src', f), r.code);
}
fs.writeFileSync(path.join(saida, 'src', 'assets.js'),
  'exports.imagemDoItem = () => null; exports.AVATAR_PADRAO = null;\n');
const nm = path.join(saida, 'node_modules');
fs.mkdirSync(path.join(nm, 'react-native'), { recursive: true });
fs.writeFileSync(path.join(nm, 'react-native', 'index.js'), "module.exports = { Platform: { OS: 'web' } };\n");
fs.mkdirSync(path.join(nm, 'expo-constants'), { recursive: true });
fs.writeFileSync(path.join(nm, 'expo-constants', 'index.js'), 'module.exports = { default: {}, __esModule: true };\n');
console.log('harness gerado em', saida);
