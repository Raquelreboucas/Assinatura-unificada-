import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Badge, Button, Icon, Input, Link, Logo, OtpInput, Select, Stack, Text } from '@1doc/1ds-react';
import { faArrowRight, faEnvelope, faFileSignature, faKey } from '@fortawesome/free-solid-svg-icons';

import { Moldura } from '../../componentes/Moldura';
import { AlertaContaGovBr, OpcaoGovBr, useLoginGovBr } from '../../componentes/OpcaoGovBr';
import { CORTES, useAbaixoDe } from '../../hooks';
import { RodapeAcoes } from '../../componentes/RodapeAcoes';
import { VisualizadorPdf } from '../../componentes/VisualizadorPdf';
import { certificados, tokenEmail } from '../../dados';
import logoIcpBrasil from '../../assets/logo-icp-brasil.svg';

type Tipo = '1doc' | 'govbr' | 'icp';

type OpcaoProps = {
  selecionada: boolean;
  onSelecionar: () => void;
  titulo: ReactNode;
  descricao: string;
  marca: ReactNode;
  children: ReactNode;
};

/**
 * Cartão de uma forma de assinar. Escolher é usar o campo de dentro: o foco
 * (ou o clique) em qualquer parte do cartão o marca como a opção ativa.
 */
function OpcaoAssinatura({ selecionada, onSelecionar, titulo, descricao, marca, children }: OpcaoProps) {
  return (
    <div
      className={`ass-opcao${selecionada ? ' ass-opcao--selecionada' : ''}`}
      onFocusCapture={onSelecionar}
      onClick={onSelecionar}
    >
      <Stack gap="nano">
        <Stack direction="horizontal" gap="xxxs" align="start">
          <Stack grow gap="none">
            <Stack direction="horizontal" gap="nano" align="center">
              {titulo}
            </Stack>
            <Text variant="body2" color="secondary" className="ass-paragrafo">
              {descricao}
            </Text>
          </Stack>
          {marca}
        </Stack>
        {children}
      </Stack>
    </div>
  );
}

type TelaTipoAssinaturaProps = {
  onVoltar: () => void;
  onAssinar: () => void;
  onRecusar: () => void;
};

/** Segundos até a pessoa poder pedir outro token, contados a cada envio. */
const ESPERA_REENVIO_S = 60;

/** Como a pessoa confirma a Assinatura 1Doc: senha da conta ou token enviado por e-mail. */
type Metodo1Doc = 'senha' | 'token';

/**
 * Tela 2 do usuário externo logado, sem token — escolha do tipo de assinatura:
 * 1Doc com a senha da conta (ou token enviado por e-mail), conta gov.br ou
 * certificado ICP-Brasil.
 */
export function TelaTipoAssinatura({ onVoltar, onAssinar, onRecusar }: TelaTipoAssinaturaProps) {
  const celular = useAbaixoDe(CORTES.md);
  const [tipo, setTipo] = useState<Tipo>('1doc');
  const govbr = useLoginGovBr();

  // Escolher o gov.br já abre o login dele em popup (se ainda não entrou).
  const escolherGovBr = () => {
    setTipo('govbr');
    if (!govbr.conta) govbr.entrar();
  };

  // "clique aqui": se o redirecionamento não aconteceu, abre o login de novo.
  const redirecionarDeNovo = () => {
    setTipo('govbr');
    govbr.entrar();
  };

  // Assinar com gov.br sem conta autenticada (inclui a falha) abre o login antes.
  const assinar = () => {
    if (tipo === 'govbr' && !govbr.conta) govbr.entrar();
    else onAssinar();
  };
  const [senha, setSenha] = useState('');
  const [metodo, setMetodo] = useState<Metodo1Doc>('senha');
  const [token, setToken] = useState('');
  /** Quantas vezes o token foi enviado: a partir da 2ª, o aviso diz que foi reenviado. */
  const [envios, setEnvios] = useState(0);

  /** Segundos que faltam para liberar um novo envio; 0 = liberado. */
  const [espera, setEspera] = useState(0);

  // Conta os segundos de 1 em 1. A espera vale em qualquer modo (senha ou
  // token): voltar para a senha e pedir de novo não burla o intervalo.
  useEffect(() => {
    if (espera <= 0) return;
    const timer = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [espera]);

  const enviarToken = () => {
    if (espera > 0) return;
    setToken('');
    setEnvios((n) => n + 1);
    setEspera(ESPERA_REENVIO_S);
    setMetodo('token');
  };

  // Com o envio em espera, o link fica desabilitado, mas clicar nele leva ao
  // campo do token que já foi enviado: sem novo envio e sem zerar a contagem.
  const informarTokenEnviado = () => setMetodo('token');

  const aoTeclarLinkEmEspera = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    informarTokenEnviado();
  };

  const usarSenha = () => {
    setMetodo('senha');
    setToken('');
  };
  const [certificado, setCertificado] = useState<string>('');

  return (
    <Moldura
      fundo="muted"
      rodape={
        <RodapeAcoes onVoltar={onVoltar}>
          <Button variant="negative-outlined" size="md" onClick={onRecusar}>
            {celular ? 'Recusar' : 'Recusar assinatura'}
          </Button>
          {/* 1ds: o Figma pinta este botão de verde; o Button não tem variante positiva. Ver 1DS-DIVERGENCIAS.md */}
          <Button variant="primary" size="md" startIcon={faFileSignature} onClick={assinar}>
            Assinar
          </Button>
        </RodapeAcoes>
      }
    >
      <div className="ass-envelope ass-envelope--compacto">
        <VisualizadorPdf />
        <aside className="ass-painel" aria-label="Tipo de assinatura">
          <Text as="h2" variant="body1" weight="semibold" color="primary" className="ass-largura-total">
            Tipo de assinatura
          </Text>

          <Stack gap="xxxs" fullWidth>
            <OpcaoAssinatura
              selecionada={tipo === '1doc'}
              onSelecionar={() => setTipo('1doc')}
              titulo={
                <>
                  <Text as="h3" variant="body1" weight="semibold" color="primary">
                    Assinatura 1Doc
                  </Text>
                  <Badge variant="primary" appearance="solid" size="xs">
                    Recomendado
                  </Badge>
                </>
              }
              descricao="Assinatura eletrônica com validade jurídica"
              marca={<Logo size="regular" variant="default" />}
            >
              {metodo === 'senha' ? (
                <Stack gap="nano" align="start">
                  {/* 1ds: o Figma não mostra rótulo visível; o nome do campo vai em ariaLabel. Ver 1DS-DIVERGENCIAS.md */}
                  <Input
                    type="password"
                    ariaLabel="Senha da conta 1Doc"
                    placeholder="Digite a senha da sua conta"
                    value={senha}
                    onChange={setSenha}
                    fullWidth
                  />
                  {espera > 0 ? (
                    // O Link desabilitado não recebe clique nem foco; o wrapper recebe os dois.
                    <span
                      className="ass-link-espera"
                      role="button"
                      tabIndex={0}
                      title="O token já foi enviado: clique para informá-lo"
                      onClick={informarTokenEnviado}
                      onKeyDown={aoTeclarLinkEmEspera}
                    >
                      <Link
                        variant="primary"
                        underline="hover"
                        standalone
                        iconLeft={<Icon icon={faEnvelope} size="xs" variant="inherit" />}
                        disabled
                      >
                        Enviar token por e-mail em <span className="ass-contador">{espera}s</span>
                      </Link>
                    </span>
                  ) : (
                    <Link
                      variant="primary"
                      underline="hover"
                      standalone
                      iconLeft={<Icon icon={faEnvelope} size="xs" variant="inherit" />}
                      onClick={enviarToken}
                    >
                      Enviar token por e-mail
                    </Link>
                  )}
                </Stack>
              ) : (
                <Stack gap="nano" align="start">
                  <OtpInput
                    length={tokenEmail.codigo.length}
                    type="numeric"
                    // No celular, as 6 caixas md (48px) não cabem no cartão.
                    size={celular ? 'sm' : 'md'}
                    ariaLabel={`Token enviado para ${tokenEmail.emailMascarado}`}
                    value={token}
                    onChange={setToken}
                    autoFocus
                  />
                  <Text variant="caption" className="ass-texto-suave ass-paragrafo" role="status">
                    {envios > 1 ? 'Token reenviado' : 'Token enviado'} para {tokenEmail.emailMascarado}
                  </Text>
                  <Stack direction="horizontal" gap="xxxs" wrap>
                    <Link
                      variant="primary"
                      underline="hover"
                      standalone
                      iconLeft={<Icon icon={faEnvelope} size="xs" variant="inherit" />}
                      disabled={espera > 0}
                      onClick={enviarToken}
                    >
                      {espera > 0 ? (
                        <>
                          Reenviar token em <span className="ass-contador">{espera}s</span>
                        </>
                      ) : (
                        'Reenviar token'
                      )}
                    </Link>
                    <Link
                      variant="primary"
                      underline="hover"
                      standalone
                      iconLeft={<Icon icon={faKey} size="xs" variant="inherit" />}
                      onClick={usarSenha}
                    >
                      Usar senha
                    </Link>
                  </Stack>
                </Stack>
              )}
            </OpcaoAssinatura>

            <OpcaoGovBr
              selecionada={tipo === 'govbr'}
              conta={govbr.conta}
              falha={govbr.falha}
              bloqueado={govbr.bloqueado}
              onSelecionar={escolherGovBr}
              onRedirecionar={redirecionarDeNovo}
            />

            <OpcaoAssinatura
              selecionada={tipo === 'icp'}
              onSelecionar={() => setTipo('icp')}
              titulo={
                <Text as="h3" variant="body1" weight="semibold" color="primary">
                  Certificado ICP-Brasil
                </Text>
              }
              descricao="Necessário ter um certificado digital (ICP-Brasil) instalado no seu dispositivo."
              marca={
                <span className="ass-opcao__marca">
                  <img src={logoIcpBrasil} alt="ICP-Brasil" width={28} height={34} />
                </span>
              }
            >
              <Select
                ariaLabel="Certificado digital"
                placeholder="Selecione o certificado"
                options={certificados}
                value={certificado || undefined}
                onChange={(valor) => setCertificado(String(valor))}
                fullWidth
              />
            </OpcaoAssinatura>
          </Stack>

          {/* Fora do cartão: o erro da conta gov.br aparece na página, abaixo das opções. */}
          {tipo === 'govbr' && govbr.falha && !govbr.conta && <AlertaContaGovBr />}

          <Link
            variant="primary"
            size="default"
            underline="hover"
            standalone
            iconRight={<Icon icon={faArrowRight} size="xs" variant="inherit" />}
          >
            Prosseguir sem assinar
          </Link>
        </aside>
      </div>
    </Moldura>
  );
}
