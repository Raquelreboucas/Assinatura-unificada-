import { Badge, Button, Stack, Text } from '@1doc/1ds-react';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';

import { EnvelopeComResultado } from '../../componentes/EnvelopeComResultado';
import { IlustracaoEnvelope } from '../../componentes/IlustracaoEnvelope';

/**
 * Tela 4 do externo sem login — confirmação de que os documentos foram
 * assinados, no painel ao lado do visualizador de PDF. Sem conta, não há
 * "Voltar para 1Doc": a pessoa baixa o arquivo assinado ou entra na 1Doc.
 */
export function TelaAssinaturaConcluida() {
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
        {/* Lado a lado; se não couber, o segundo botão quebra para a linha de baixo. */}
        <Stack direction="horizontal" gap="nano" justify="center" wrap fullWidth>
          <Button variant="primary" size="lg" startIcon={faDownload}>
            Baixar arquivo assinado
          </Button>
          <Button variant="secondary" size="lg">
            Fazer login na 1Doc
          </Button>
        </Stack>
      </Stack>
    </EnvelopeComResultado>
  );
}
