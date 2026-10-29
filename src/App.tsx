import { useMemo, useState } from 'react';

import { FluxoExterno } from './externo/FluxoExterno';
import { FluxoExternoLogado } from './externo-logado/FluxoExternoLogado';
import { FluxoExternoToken } from './externo-token/FluxoExternoToken';
import { FluxoInterno } from './interno/FluxoInterno';
import { PerfilContext, type Perfil } from './perfil';
import { SeletorPerfil } from './componentes/SeletorPerfil';

/**
 * Protótipo com os assinadores: interno, externo logado com a conta interna
 * ("Ops..."), externo logado com a conta externa (sem token) e externo sem login
 * (token do e-mail). O seletor flutuante (SeletorPerfil) troca entre eles; cada
 * troca começa o fluxo do zero.
 */
export default function App() {
  const [perfil, setPerfil] = useState<Perfil>('interno');
  const contexto = useMemo(() => ({ perfil, setPerfil }), [perfil]);

  return (
    <PerfilContext.Provider value={contexto}>
      {perfil === 'interno' && <FluxoInterno key="interno" />}
      {perfil === 'externo' && <FluxoExterno key="externo" />}
      {perfil === 'externo-logado' && <FluxoExternoLogado key="externo-logado" />}
      {perfil === 'externo-token' && <FluxoExternoToken key="externo-token" />}
      <SeletorPerfil />
    </PerfilContext.Provider>
  );
}
