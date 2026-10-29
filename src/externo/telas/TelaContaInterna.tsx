import { Badge, Button, Stack, Text } from '@1doc/1ds-react';

import { Moldura } from '../../componentes/Moldura';
import { IlustracaoSaida } from '../../componentes/IlustracaoSaida';
import { contas } from '../../dados';

type TelaContaInternaProps = {
  onSair: () => void;
};

/**
 * Aviso "Ops..." do usuário externo que abriu o convite logado com a conta
 * interna: o documento foi enviado ao e-mail externo, então é preciso sair da
 * conta para assinar. Mensagem centralizada na página, com a ilustração da
 * pessoa saindo pela porta, no mesmo arranjo das telas de conclusão.
 */
export function TelaContaInterna({ onSair }: TelaContaInternaProps) {
  return (
    <Moldura fundo="muted">
      <Stack align="center" justify="center" className="ass-centro">
        <Stack align="center" gap="xxs">
          <IlustracaoSaida />
          <Stack align="center" gap="nano" className="ass-ops__mensagem">
            <Badge variant="info" appearance="soft" size="sm">
              Acesso interno
            </Badge>
            <Text as="h1" variant="h5" weight="bold" align="center" color="primary">
              Ops...
            </Text>
            <Stack gap="quarck" align="center">
              <Text variant="body2" align="center" color="secondary" className="ass-paragrafo">
                Você está autenticado como{' '}
                <Text as="span" variant="body2" weight="semibold" color="primary">
                  {contas.interna}
                </Text>{' '}
                (acesso interno).
              </Text>
              <Text variant="body2" align="center" color="secondary" className="ass-paragrafo">
                Para assinar este documento, é necessário acessar como{' '}
                <Text as="span" variant="body2" weight="semibold" color="primary">
                  {contas.externa}
                </Text>{' '}
                (acesso externo) ou estar deslogado do sistema.
              </Text>
            </Stack>
            <Button variant="primary" size="lg" onClick={onSair}>
              Sair da conta
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Moldura>
  );
}
