import { useEffect, useState } from 'react';

/** Cortes de tela, os mesmos do `Grid` do 1DS. */
export const CORTES = {
  /** Abaixo disto é celular. */
  md: 768,
  /** Abaixo disto o visualizador e o painel empilham (tablet). */
  lg: 1024,
};

/** `true` enquanto a janela for mais estreita que `largura` px. */
export function useAbaixoDe(largura: number) {
  const consulta = `(max-width: ${largura - 1}px)`;
  const [casa, setCasa] = useState(() => window.matchMedia(consulta).matches);

  useEffect(() => {
    const mql = window.matchMedia(consulta);
    const mudar = () => setCasa(mql.matches);
    mudar();
    mql.addEventListener('change', mudar);
    return () => mql.removeEventListener('change', mudar);
  }, [consulta]);

  return casa;
}
