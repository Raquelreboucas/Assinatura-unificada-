import { useEffect, useState } from 'react';

import { ModalRecusa } from '../componentes/ModalRecusa';
import { usePerfil } from '../perfil';
import { TelaContaInterna } from './telas/TelaContaInterna';
import { TelaDocumentos } from './telas/TelaDocumentos';
import { TelaTipoAssinatura } from './telas/TelaTipoAssinatura';
import { TelaAssinando } from './telas/TelaAssinando';
import { TelaAssinaturaConcluida } from './telas/TelaAssinaturaConcluida';
import { TelaDocumentosRecusados } from './telas/TelaDocumentosRecusados';

type Etapa =
  | 'conta-interna'
  | 'documentos'
  | 'tipo-assinatura'
  | 'assinando'
  | 'concluida'
  | 'recusando'
  | 'recusada';

/** Tempo das telas de carregamento enquanto não há integração real. */
const DURACAO_PROCESSAMENTO_MS = 2500;

/** Para onde cada carregamento vai quando termina. */
const FIM_DO_PROCESSAMENTO: Partial<Record<Etapa, Etapa>> = {
  assinando: 'concluida',
  recusando: 'recusada',
};

/**
 * Assinador do usuário externo (cidadão ou empresa) que abriu o convite logado
 * com a conta interna: tem também a assinatura gov.br. Antes do assinador, vê o
 * aviso "Ops..." e precisa sair da conta; sair leva ao externo sem login, que
 * começa confirmando nome, CPF e data de nascimento.
 */
export function FluxoExterno() {
  const { setPerfil } = usePerfil();
  const [etapa, setEtapa] = useState<Etapa>('conta-interna');
  const [recusaAberta, setRecusaAberta] = useState(false);

  useEffect(() => {
    const proxima = FIM_DO_PROCESSAMENTO[etapa];
    if (!proxima) return;
    const timer = window.setTimeout(() => setEtapa(proxima), DURACAO_PROCESSAMENTO_MS);
    return () => window.clearTimeout(timer);
  }, [etapa]);

  const abrirRecusa = () => setRecusaAberta(true);

  const recusar = () => {
    setRecusaAberta(false);
    setEtapa('recusando');
  };

  const tela = (() => {
    switch (etapa) {
      case 'conta-interna':
        return <TelaContaInterna onSair={() => setPerfil('externo-token')} />;
      case 'documentos':
        return (
          <TelaDocumentos onAvancar={() => setEtapa('tipo-assinatura')} onRecusar={abrirRecusa} />
        );
      case 'tipo-assinatura':
        return (
          <TelaTipoAssinatura
            onVoltar={() => setEtapa('documentos')}
            onAssinar={() => setEtapa('assinando')}
            onRecusar={abrirRecusa}
          />
        );
      case 'assinando':
        return <TelaAssinando acao="assinar" />;
      case 'concluida':
        return <TelaAssinaturaConcluida onVoltar={() => setEtapa('documentos')} />;
      case 'recusando':
        return <TelaAssinando acao="recusar" />;
      case 'recusada':
        return <TelaDocumentosRecusados onVoltar={() => setEtapa('documentos')} />;
    }
  })();

  return (
    <>
      {tela}
      <ModalRecusa open={recusaAberta} onClose={() => setRecusaAberta(false)} onRecusar={recusar} />
    </>
  );
}
