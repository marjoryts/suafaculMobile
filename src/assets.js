// A API devolve dados (nome, sigla...); as FOTOS continuam sendo os arquivos locais de /assets.
// Aqui casamos o item da API com a foto certa. Sem foto conhecida -> `null` (a tela usa um cartão roxo).
const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const FOTOS = {
  usp: require('../assets/photoUsp.png'),
  fatec: require('../assets/photoFatec.png'),
  unicamp: require('../assets/photoUnicamp.png.webp'),
  unesp: require('../assets/photoUnesp.png.jpg'),
  piaget: require('../assets/photoPiaget.png'),
  mackenzie: require('../assets/photoMackenzie.png'),
  puc: require('../assets/photoPUC.png.jpg'),
  fgv: require('../assets/photoFGV.png.png'),
  engSoftware: require('../assets/photoEngenhariaSoftware.png'),
  medicina: require('../assets/photoMedicina.png'),
  direito: require('../assets/photoDireito.png.jpg'),
  administracao: require('../assets/photoAdministracao.png.jpg'),
  enem: require('../assets/photoEnem.png'),
  fuvest: require('../assets/photoFuvest.png'),
  vestUnicamp: require('../assets/photoVestibularUnicamp.png.jpg'),
  vestUnesp: require('../assets/photoVestibularUnesp.jpg'),
};

export const AVATAR_PADRAO = require('../assets/AvatarPhoto.png');

export function imagemFaculdade(f) {
  const t = norm(`${f.sigla || ''} ${f.nome || ''}`);
  if (/(^|[\s-])usp([\s-]|$)|universidade de sao paulo/.test(t)) return FOTOS.usp;
  if (/fatec/.test(t)) return FOTOS.fatec;
  if (/unicamp|universidade estadual de campinas/.test(t)) return FOTOS.unicamp;
  if (/unesp|universidade estadual paulista/.test(t)) return FOTOS.unesp;
  if (/piaget/.test(t)) return FOTOS.piaget;
  if (/mackenzie/.test(t)) return FOTOS.mackenzie;
  if (/puc/.test(t) && /(sp|sao paulo)/.test(t)) return FOTOS.puc;
  if (/(^|[\s-])fgv([\s-]|$)|fundacao getulio vargas/.test(t)) return FOTOS.fgv;
  return null;
}

export function imagemCurso(c) {
  const t = norm(c.nome);
  if (t === 'engenharia de software') return FOTOS.engSoftware;
  if (t === 'medicina') return FOTOS.medicina;
  if (t === 'direito') return FOTOS.direito;
  if (t === 'administracao') return FOTOS.administracao;
  return null;
}

export function imagemVestibular(v) {
  const t = norm(v.nome);
  if (/enem/.test(t)) return FOTOS.enem;
  if (/fuvest/.test(t)) return FOTOS.fuvest;
  if (/unicamp/.test(t)) return FOTOS.vestUnicamp;
  if (/unesp/.test(t)) return FOTOS.vestUnesp;
  if (/fatec/.test(t)) return FOTOS.fatec;
  return null;
}

export function imagemDoItem(item) {
  if (item.tipo === 'curso') return imagemCurso(item);
  if (item.tipo === 'vestibular') return imagemVestibular(item);
  return imagemFaculdade(item);
}
