import { Badge, Button, Stack, Text } from '@1doc/1ds-react';

import { Moldura } from '../../componentes/Moldura';
import { IlustracaoEnvelope } from '../../componentes/IlustracaoEnvelope';

type TelaDocumentosRecusadosProps = {
  onVoltar: () => void;
};

/**
 * Confirmação de que a assinatura foi recusada. Não há frame no Figma: segue a
 * tela "Assinatura concluída" (9728:29199) com o tom de feedback negativo.
 */
export function TelaDocumentosRecusados({ onVoltar }: TelaDocumentosRecusadosProps) {
  return (
    <Moldura fundo="muted">
      <Stack align="center" justify="center" className="ass-centro">
        <Stack align="center" gap="xxs">
          <IlustracaoEnvelope tom="negativo" />
          <Stack align="center" gap="nano" fullWidth>
            <Badge variant="negative" appearance="soft" size="sm">
              Assinatura recusada
            </Badge>
            <Text as="h1" variant="h5" weight="bold" align="center" color="primary">
              Documentos recusados
            </Text>
            <Text variant="body2" align="center" className="ass-texto-suave ass-paragrafo">
              Sua recusa foi registrada em 21/10/2026 às 14:32.
            </Text>
            <Button variant="primary" size="lg" onClick={onVoltar}>
              Voltar para 1Doc
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Moldura>
  );
}
