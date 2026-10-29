import { Logo, Spinner, Stack, Text } from '@1doc/1ds-react';

import { EnvelopeComResultado } from '../../componentes/EnvelopeComResultado';
import { Moldura } from '../../componentes/Moldura';

type TelaAssinandoProps = {
  /** O que está sendo registrado: a assinatura ou a recusa. */
  acao?: 'assinar' | 'recusar';
};

const TITULOS = {
  assinar: 'Assinando os documentos...',
  recusar: 'Recusando os documentos...',
};

/**
 * Tela 3 — carregamento enquanto a assinatura (ou a recusa) é registrada.
 * Assinando: a mensagem fica ao lado do visualizador de PDF. Recusando: tela
 * própria, centralizada.
 */
export function TelaAssinando({ acao = 'assinar' }: TelaAssinandoProps) {
  const titulo = TITULOS[acao];

  const mensagem = (
    <>
      <Stack align="center" gap="nano">
        {/* 1ds: o Logo só tem 40px (regular) e 15px (small); o Figma pede 80px. Ver 1DS-DIVERGENCIAS.md */}
        <Logo size="regular" variant="default" className="ass-logo-grande" />
        <Text as="h1" variant="h5" align="center" color="primary">
          {titulo}
        </Text>
        <Text variant="body2" align="center" className="ass-texto-suave ass-texto-compacto">
          Aguarde alguns instantes
        </Text>
      </Stack>
      <Spinner variant="primary" size="lg" label={titulo.replace('...', '')} />
    </>
  );

  if (acao === 'assinar') {
    return <EnvelopeComResultado rotulo="Assinando os documentos">{mensagem}</EnvelopeComResultado>;
  }

  return (
    <Moldura fundo="muted">
      <Stack align="center" justify="center" gap="xxs" className="ass-centro" aria-live="polite">
        {mensagem}
      </Stack>
    </Moldura>
  );
}
