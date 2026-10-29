import { useEffect, useState } from 'react';

import { ModalRecusa } from '../componentes/ModalRecusa';
import { TelaDocumentos } from './telas/TelaDocumentos';
import { TelaTipoAssinatura } from './telas/TelaTipoAssinatura';
import { TelaAssinando } from './telas/TelaAssinando';
import { TelaAssinaturaConcluida } from './telas/TelaAssinaturaConcluida';
import { TelaDocumentosRecusados } from './telas/TelaDocumentosRecusados';

type Etapa =
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

/** Assinador do usuário interno (servidor do órgão, com conta 1Doc). */
export function FluxoInterno() {
  const [etapa, setEtapa] = useState<Etapa>('documentos');
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
