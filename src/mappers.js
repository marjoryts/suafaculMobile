import { imagemDoItem } from './assets';

// Item da API -> formato que as telas já usavam ({ id, nome, imagem, tipo }).
// `id` é sempre string (as telas antigas usavam string); `chave` diferencia ids iguais de tipos diferentes.
export function paraItem(x) {
  const nome = x.tipo === 'faculdade' ? (x.nome_curto || x.nome) : x.nome;
  return {
    ...x,
    id: String(x.id),
    nome,
    nomeCompleto: x.nome,
    imagem: imagemDoItem(x),
  };
}

export const chaveFav = (item) => `${item.tipo}:${item.id}`;

const MODALIDADES = { presencial: 'Presencial', ead: 'EAD', semipresencial: 'Semi-Presencial' };
export const rotuloModalidade = (m) => MODALIDADES[m] || m;

// "2026-11-01" -> "01/11/2026"
export function formatarData(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export function textoDias(v) {
  if (v.status === 'sem_data') return 'a definir';
  if (v.status === 'encerrado') return 'encerrado';
  if (v.status === 'hoje') return 'hoje!';
  return `${v.dias_restantes} ${v.dias_restantes === 1 ? 'dia' : 'dias'}`;
}
