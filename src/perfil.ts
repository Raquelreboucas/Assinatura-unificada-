import { createContext, useContext } from 'react';

/**
 * Qual assinador está na tela: o do usuário interno, o do externo logado ou o
 * do externo sem login, que chegou pelo link do e-mail com o token validado.
 */
export type Perfil = 'interno' | 'externo' | 'externo-logado' | 'externo-token';

type PerfilContexto = {
  perfil: Perfil;
  setPerfil: (perfil: Perfil) => void;
};

export const PerfilContext = createContext<PerfilContexto>({
  perfil: 'interno',
  setPerfil: () => {},
});

export const usePerfil = () => useContext(PerfilContext);
