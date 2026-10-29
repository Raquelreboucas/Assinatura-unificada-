import { Badge, Button, Stack, Text } from '@1doc/1ds-react';

import { EnvelopeComResultado } from '../../componentes/EnvelopeComResultado';
import { IlustracaoEnvelope } from '../../componentes/IlustracaoEnvelope';

type TelaAssinaturaConcluidaProps = {
  onVoltar: () => void;
};

/**
 * Tela 4 — confirmação de que os documentos foram assinados, no painel ao lado
 * do visualizador de PDF.
 */
export function TelaAssinaturaConcluida({ onVoltar }: TelaAssinaturaConcluidaProps) {
  return (
    <EnvelopeComResultado rotulo="Assinatura concluída" semFundo>
      <IlustracaoEnvelope />
      <Stack align="center" gap="nano" fullWidth>
        <Badge variant="positive" appearance="soft" size="sm">
          Assinatura concluída
        </Badge>
        <Text as="h1" variant="h5" weight="bold" align="center" color="primary">
          Documentos assinados com sucesso!
        </Text>
        <Text variant="body2" align="center" className="ass-texto-suave ass-paragrafo">
          Sua assinatura foi registrada em 21/10/2026 às 14:32.
        </Text>
        <Button variant="primary" size="lg" onClick={onVoltar}>
          Voltar para 1Doc
        </Button>
      </Stack>
    </EnvelopeComResultado>
  );
}
