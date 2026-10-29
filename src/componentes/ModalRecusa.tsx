import { ConfirmDialog, Text } from '@1doc/1ds-react';

import { envelope } from '../dados';

type ModalRecusaProps = {
  open: boolean;
  onClose: () => void;
  onRecusar: () => void;
};

/** Confirmação de "Recusar assinatura" (texto do Figma 9728:29419) no ConfirmDialog negativo. */
export function ModalRecusa({ open, onClose, onRecusar }: ModalRecusaProps) {
  return (
    <ConfirmDialog
      open={open}
      variant="negative"
      title="Recusar assinatura"
      confirmLabel="Recusar assinatura"
      cancelLabel="Voltar"
      onConfirm={onRecusar}
      onCancel={onClose}
    >
      <Text variant="body2" color="primary" align="center" className="ass-paragrafo">
        Deseja recusar a assinatura dos{' '}
        <Text as="span" variant="body2" weight="semibold" color="inherit">
          {envelope.documentos} documentos
        </Text>{' '}
        do{' '}
        <Text as="span" variant="body2" weight="semibold" color="inherit">
          {envelope.nome}
        </Text>
        ?
      </Text>
    </ConfirmDialog>
  );
}
