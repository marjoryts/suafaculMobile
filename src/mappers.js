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
    // Foto local conhecida; senão a imagem cadastrada no catálogo (cursos_catalogo.imagem_url).
    imagem: imagemDoItem(x) || (x.imagem_url ? { uri: x.imagem_url } : null),
  };
}

// Sem acentos e em minúsculas (mesma regra de normalizar() do backend).
export const normalizarTexto = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Dias até a prova, a partir da data REAL do vestibular (data_prova 'AAAA-MM-DD').
// `status` passa a ser o prazo usado pelas telas (sem_data | encerrado | hoje | aberto);
// o status de validação vindo da API fica preservado em `status_validacao`.
export function comPrazo(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v?.data_prova || '');
  let dias = null;
  if (m) {
    const prova = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dias = Math.round((prova - hoje) / 86400000);
  }
  const prazo = dias === null ? 'sem_data' : dias < 0 ? 'encerrado' : dias === 0 ? 'hoje' : 'aberto';
  return { ...v, status_validacao: v?.status_validacao ?? v?.status, status: prazo, dias_restantes: dias };
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
