import type { ReactNode } from 'react';
import { Button, Stack } from '@1doc/1ds-react';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';

import { CORTES, useAbaixoDe } from '../hooks';

type RodapeAcoesProps = {
  onVoltar?: () => void;
  /** Ações da direita (recusar, avançar, assinar). */
  children: ReactNode;
};

/**
 * Barra fixa no rodapé: "Voltar" à esquerda e as ações do passo à direita.
 * No celular o "Voltar" fica só com o ícone, para as ações caberem na linha.
 */
export function RodapeAcoes({ onVoltar, children }: RodapeAcoesProps) {
  const celular = useAbaixoDe(CORTES.md);

  return (
    <Stack
      as="footer"
      direction="horizontal"
      justify="between"
      align="center"
      gap="nano"
      className="ass-rodape"
    >
      {celular ? (
        <Button variant="icon" size="md" startIcon={faArrowLeft} ariaLabel="Voltar" onClick={onVoltar} />
      ) : (
        <Button variant="text" size="md" startIcon={faArrowLeft} onClick={onVoltar}>
          Voltar
        </Button>
      )}
      <Stack direction="horizontal" gap="nano" align="center" className="ass-rodape__acoes">
        {children}
      </Stack>
    </Stack>
  );
}
