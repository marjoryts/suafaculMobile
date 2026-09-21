import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { favoritesApi } from '../src/api/services';
import { paraItem, chaveFav } from '../src/mappers';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

// Favoritos vivem no SERVIDOR (tabela `favoritos`); aqui fica só uma cópia para a interface reagir rápido.
export function FavoritesProvider({ children }) {
  const { status } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const versao = useRef(0); // descarta respostas antigas se o usuário trocar/sair

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') return;
    const v = ++versao.current;
    setLoading(true);
    try {
      const d = await favoritesApi.list();
      if (v !== versao.current) return;
      setItems([...d.faculdades, ...d.cursos, ...d.vestibulares].map(paraItem));
      setError(null);
      setLoaded(true);
    } catch (e) {
      if (v === versao.current) setError(e);
    } finally {
      if (v === versao.current) setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') { refresh(); return; }
    versao.current++;
    setItems([]); setLoaded(false); setError(null);
  }, [status, refresh]);

  const isFavorited = useCallback((item) => items.some((f) => chaveFav(f) === chaveFav(item)), [items]);

  // Atualização otimista: a tela muda na hora; se o servidor recusar, volta atrás e lança o erro.
  const toggle = useCallback(async (item) => {
    const tem = items.some((f) => chaveFav(f) === chaveFav(item));
    const antes = items;
    setItems(tem ? items.filter((f) => chaveFav(f) !== chaveFav(item)) : [item, ...items]);
    try {
      if (tem) await favoritesApi.remove(item.tipo, item.id);
      else await favoritesApi.add(item.tipo, item.id);
    } catch (e) {
      setItems(antes);
      throw e;
    }
  }, [items]);

  const value = useMemo(
    () => ({ items, loading, error, loaded, refresh, isFavorited, toggle }),
    [items, loading, error, loaded, refresh, isFavorited, toggle]
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
