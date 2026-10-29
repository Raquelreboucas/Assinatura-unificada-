import { Box, Button, Stack, Text } from '@1doc/1ds-react';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import { usuario } from '../dados';
import {
  MENSAGEM_GOVBR,
  type ContaGovBr,
  type RespostaPopup,
  type ResultadoGovBr,
} from './OpcaoGovBr';

const CONTA: ContaGovBr = { nome: usuario.nome, nivel: 'prata' };

/**
 * Janela que o cartão "Gov.br" abre em popup (`?popup=govbr`). No produto, é
 * o login do próprio gov.br; aqui é uma SIMULAÇÃO do protótipo: não pede
 * credencial nem imita a tela do gov.br, só deixa escolher o resultado do
 * login (autenticar ou dar erro) e o devolve ao assinador por `postMessage`.
 */
export function PopupGovBr() {
  const responder = (resultado: ResultadoGovBr) => {
    const resposta: RespostaPopup = {
      tipo: MENSAGEM_GOVBR,
      resultado,
      conta: resultado === 'autenticado' ? CONTA : undefined,
    };
    window.opener?.postMessage(resposta, window.location.origin);
    window.close();
  };

  return (
    <Stack align="center" justify="center" className="ass-popup">
      <Box background="surface" bordered radius="sm" padding="xxs" className="ass-popup__caixa">
        <Stack gap="xxxs">
          <Stack gap="quarck">
            <Text as="h1" variant="h6" color="primary">
              Login gov.br (simulação)
            </Text>
            <Text variant="body2" color="secondary" className="ass-paragrafo">
              Protótipo do assinador 1Doc. No sistema real, esta janela é o login do gov.br, onde a pessoa
              entra com CPF e senha e autoriza o compartilhamento dos dados. Aqui, escolha o resultado que
              quer simular.
            </Text>
          </Stack>

          <Box background="muted" radius="sm" padding="xxxs">
            <Stack gap="none">
              <Text variant="body2" weight="semibold" color="primary">
                {CONTA.nome}
              </Text>
              <Text variant="caption" className="ass-texto-suave ass-paragrafo">
                CPF {usuario.cpf} · conta nível {CONTA.nivel}
              </Text>
            </Stack>
          </Box>

          <Stack direction="horizontal" gap="nano" justify="end" wrap>
            <Button variant="text" size="md" onClick={() => responder('cancelado')}>
              Cancelar
            </Button>
            <Button
              variant="negative-outlined"
              size="md"
              startIcon={faTriangleExclamation}
              onClick={() => responder('falha')}
            >
              Simular erro
            </Button>
            <Button
              variant="primary"
              size="md"
              startIcon={faCircleCheck}
              onClick={() => responder('autenticado')}
            >
              Simular autenticação
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
