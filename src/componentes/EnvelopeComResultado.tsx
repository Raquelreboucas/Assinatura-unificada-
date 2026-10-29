import type { ReactNode } from 'react';

import { Moldura } from './Moldura';
import { VisualizadorPdf } from './VisualizadorPdf';

type EnvelopeComResultadoProps = {
  /** Nome do painel para leitor de tela (ex.: "Assinando os documentos"). */
  rotulo: string;
  /** A mensagem do resultado, centralizada no painel. */
  children: ReactNode;
  /** Tira o fundo branco, a borda e a sombra do painel: a mensagem fica direto sobre o fundo da tela. */
  semFundo?: boolean;
};

/**
 * Telas de "Assinando…" e "Documentos assinados": o documento continua à vista
 * no visualizador e a mensagem ocupa o painel da direita, no lugar do "Tipo de
 * assinatura". Mesma moldura da escolha do tipo (visualizador + painel), para a
 * tela não "pular" entre os passos.
 */
export function EnvelopeComResultado({ rotulo, children, semFundo }: EnvelopeComResultadoProps) {
  return (
    <Moldura fundo="muted">
      <div className="ass-envelope ass-envelope--compacto">
        <VisualizadorPdf />
        <aside
          className={`ass-painel ass-painel--centro${semFundo ? ' ass-painel--sem-fundo' : ''}`}
          aria-label={rotulo} aria-live="polite">
          {children}
        </aside>
      </div>
    </Moldura>
  );
}
