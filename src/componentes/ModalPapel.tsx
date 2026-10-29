import { useEffect, useState } from 'react';
import { Button, Modal, Select, Stack } from '@1doc/1ds-react';

import { papeis } from '../dados';
import { CORTES } from '../hooks';

type ModalPapelProps = {
  open: boolean;
  /** Papel atual, que já vem escolhido no campo. */
  papel: string;
  onClose: () => void;
  onSalvar: (papel: string) => void;
};

/** Escolha do papel da pessoa na assinatura do envelope. */
export function ModalPapel({ open, papel, onClose, onSalvar }: ModalPapelProps) {
  const [escolhido, setEscolhido] = useState(papel);

  // Cada abertura começa do papel atual, mesmo que a anterior tenha sido cancelada.
  useEffect(() => {
    if (open) setEscolhido(papel);
  }, [open, papel]);

  return (
    <Modal
      open={open}
      title="Alterar papel"
      layout="content"
      size="md"
      // O botão mora no painel lateral (sticky, com overflow): no body, o modal
      // não fica preso no empilhamento do painel nem atrás do rodapé fixo.
      portal
      // No celular, vira painel que sobe pela borda de baixo.
      responsive
      responsiveBreakpoint={CORTES.md}
      onClose={onClose}
      footerSlot={
        <Stack direction="horizontal" gap="xxxs" align="center">
          <Button variant="text" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={() => onSalvar(escolhido)}>
            Salvar
          </Button>
        </Stack>
      }
    >
      {/* 1ds: a lista do Select abre dentro do corpo do Modal, que corta o que passa
          dele. O corpo reserva a altura da lista aberta. Ver 1DS-DIVERGENCIAS.md */}
      <div className="ass-papel">
      <Select
        label="Papel na assinatura"
        placeholder="Selecione o papel"
        helperText="O papel aparece junto da sua assinatura no documento."
        options={papeis}
        value={escolhido}
        onChange={(valor) => setEscolhido(String(valor))}
        placement="auto"
        fullWidth
      />
      </div>
    </Modal>
  );
}
