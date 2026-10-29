import { useCallback, useEffect, useId, useState } from 'react';
import { Alert, Badge, Icon, Link, Stack, Text } from '@1doc/1ds-react';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import logoGovBr from '../assets/logo-govbr.svg';

/** Mensagem que o popup do gov.br manda de volta para o assinador. */
export const MENSAGEM_GOVBR = 'assinador:login-govbr';

export type ContaGovBr = { nome: string; nivel: 'prata' | 'ouro' };

/** Como o login no popup terminou: autenticou, deu erro ou a pessoa desistiu. */
export type ResultadoGovBr = 'autenticado' | 'falha' | 'cancelado';

export type RespostaPopup = {
  tipo: typeof MENSAGEM_GOVBR;
  resultado: ResultadoGovBr;
  /** Só com `autenticado`. */
  conta?: ContaGovBr;
};

/** Tamanho da janela do popup, perto do da janela de login do gov.br. */
const JANELA = { largura: 480, altura: 640 };

/**
 * Login no gov.br por popup. `entrar()` abre a janela (centralizada sobre o
 * assinador); quando a pessoa conclui, o popup devolve o resultado por
 * `postMessage`: `conta` passa a ter o nome e o nível (autenticado) ou `falha`
 * liga (erro). Fechar sem concluir não muda nada. No protótipo a janela é uma
 * simulação (ver PopupGovBr); no produto, é o login real do gov.br.
 */
export function useLoginGovBr() {
  const [conta, setConta] = useState<ContaGovBr | null>(null);
  const [falha, setFalha] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    const receber = (e: MessageEvent<RespostaPopup>) => {
      if (e.origin !== window.location.origin || e.data?.tipo !== MENSAGEM_GOVBR) return;
      if (e.data.resultado === 'autenticado' && e.data.conta) {
        setConta(e.data.conta);
        setFalha(false);
      } else if (e.data.resultado === 'falha') {
        setConta(null);
        setFalha(true);
      }
    };
    window.addEventListener('message', receber);
    return () => window.removeEventListener('message', receber);
  }, []);

  const entrar = useCallback(() => {
    const left = window.screenX + (window.outerWidth - JANELA.largura) / 2;
    const top = window.screenY + (window.outerHeight - JANELA.altura) / 2;
    const popup = window.open(
      `${window.location.pathname}?popup=govbr`,
      'login-govbr',
      `popup=yes,width=${JANELA.largura},height=${JANELA.altura},left=${left},top=${top}`,
    );
    setBloqueado(!popup);
    popup?.focus();
  }, []);

  return { conta, falha, entrar, bloqueado };
}

type OpcaoGovBrProps = {
  selecionada: boolean;
  conta: ContaGovBr | null;
  /** O último login no gov.br falhou. */
  falha: boolean;
  /** O navegador bloqueou o popup. */
  bloqueado: boolean;
  /** Escolher a opção (abre o login, se ainda não autenticou). */
  onSelecionar: () => void;
  /** "clique aqui": abre o login de novo, se o redirecionamento não aconteceu. */
  onRedirecionar: () => void;
};

/**
 * Cartão "Gov.br", no mesmo arranjo dos outros cartões: título e texto à
 * esquerda, logo no canto direito. Não tem campo: escolher a opção redireciona
 * para o login do gov.br (popup). O texto traz o link "clique aqui" para
 * tentar de novo, então o cartão não pode ser um botão único (um link dentro de
 * um botão é inválido): a escolha é o botão do título, esticado sobre todo o
 * cartão, e o link fica por cima dele.
 */
export function OpcaoGovBr({
  selecionada,
  conta,
  falha,
  bloqueado,
  onSelecionar,
  onRedirecionar,
}: OpcaoGovBrProps) {
  const idTexto = useId();

  return (
    <div className={`ass-opcao ass-opcao--govbr${selecionada ? ' ass-opcao--selecionada' : ''}`}>
      <Stack gap="nano">
        <Stack direction="horizontal" gap="xxxs" align="start">
          <Stack grow gap="none">
            <button
              type="button"
              className="ass-opcao__acao"
              aria-pressed={selecionada}
              aria-haspopup="dialog"
              aria-describedby={idTexto}
              onClick={onSelecionar}
            >
              <Text as="span" variant="body1" weight="semibold" color="primary">
                Gov.br
              </Text>
            </button>
            <Stack gap="quarck" id={idTexto}>
              <Text variant="body2" color="secondary" className="ass-paragrafo">
                É necessário ter uma conta Gov.br de nível prata ou ouro para poder assinar documentos.
              </Text>
              <Text variant="body2" color="secondary" className="ass-paragrafo">
                Se o redirecionamento automático não acontecer,{' '}
                <Link variant="primary" className="ass-opcao__link-acima" onClick={onRedirecionar}>
                  clique aqui
                </Link>
                .
              </Text>
            </Stack>
          </Stack>
          <img src={logoGovBr} alt="gov.br" width={48} height={17} className="ass-opcao__logo-govbr" />
        </Stack>

        {conta && (
          <Stack direction="horizontal" gap="nano" align="center" wrap role="status">
            <Badge
              variant="positive"
              appearance="solid"
              size="sm"
              iconLeft={<Icon icon={faCircleCheck} size="xs" variant="inherit" />}
            >
              Autenticado
            </Badge>
          </Stack>
        )}
        {falha && !conta && (
          <Stack direction="horizontal" gap="nano" align="center" wrap role="status">
            <Badge
              variant="negative"
              appearance="solid"
              size="sm"
              iconLeft={<Icon icon={faCircleXmark} size="xs" variant="inherit" />}
            >
              Falha na autenticação
            </Badge>
          </Stack>
        )}
        {bloqueado && !conta && (
          <Text as="span" variant="caption" color="negative" role="alert">
            O navegador bloqueou a janela do gov.br. Permita pop-ups para este site e clique de novo.
          </Text>
        )}
      </Stack>
    </div>
  );
}

/**
 * Erro da conta gov.br, na página e fora do cartão de escolha: a autenticação
 * falhou porque a conta não tem o nível exigido. `negative` anuncia como
 * `role="alert"`. O link de upgrade aponta para o portal do gov.br (no
 * protótipo, só a página inicial; o endereço da página de nível da conta fica
 * para o produto).
 */
export function AlertaContaGovBr() {
  return (
    <Alert
      variant="negative"
      appearance="soft"
      className="ass-largura-total"
      description="É necessário ter uma conta Gov.br nível prata ou ouro para utilizar o serviço de assinatura."
      content={
        // O bloco de ação do Alert herda 14px e a descrição tem 12px: o texto e o
        // link da ação usam 12px para as duas linhas combinarem.
        <Text as="span" variant="caption" color="inherit">
          <Link variant="primary" size="small" href="https://www.gov.br" target="_blank">
            Clique aqui
          </Link>{' '}
          para realizar o upgrade da conta.
        </Text>
      }
    />
  );
}
