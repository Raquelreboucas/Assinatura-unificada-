import { useEffect, useState, type ReactNode } from 'react';
import { Badge, Button, Icon, Link, Logo, OtpInput, Select, Stack, Text } from '@1doc/1ds-react';
import { faArrowRight, faEnvelope, faFileSignature } from '@fortawesome/free-solid-svg-icons';

import { Moldura } from '../../componentes/Moldura';
import { AlertaContaGovBr, OpcaoGovBr, useLoginGovBr } from '../../componentes/OpcaoGovBr';
import { CORTES, useAbaixoDe } from '../../hooks';
import { RodapeAcoes } from '../../componentes/RodapeAcoes';
import { VisualizadorPdf } from '../../componentes/VisualizadorPdf';
import { certificados, tokenEmail } from '../../dados';
import logoIcpBrasil from '../../assets/logo-icp-brasil.svg';

type Tipo = '1doc' | 'govbr' | 'icp';

/** Segundos até a pessoa poder pedir outro token, contados a cada reenvio. */
const ESPERA_REENVIO_S = 60;

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

/**
 * Tela 2 do usuário externo sem login — escolha do tipo de assinatura: 1Doc com
 * o token do e-mail (já preenchido), conta gov.br ou certificado ICP-Brasil.
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
  const [token, setToken] = useState(tokenEmail.codigo);
  /** Quantas vezes o token foi reenviado; a partir do 1º, o aviso diz "reenviado". */
  const [reenvios, setReenvios] = useState(0);
  /** Segundos que faltam para liberar um novo reenvio; 0 = liberado. */
  const [espera, setEspera] = useState(0);

  // Conta os segundos de 1 em 1. O token que veio do link do e-mail já foi
  // enviado antes, então o primeiro reenvio começa liberado; os seguintes
  // esperam 1 minuto.
  useEffect(() => {
    if (espera <= 0) return;
    const timer = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [espera]);

  // O novo token invalida o anterior: o campo esvazia para a pessoa digitá-lo.
  const reenviarToken = () => {
    if (espera > 0) return;
    setToken('');
    setReenvios((n) => n + 1);
    setEspera(ESPERA_REENVIO_S);
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
              {/* Sem login: no lugar da senha, o token numérico do e-mail, que chega
                  validado pelo link e por isso já vem preenchido. */}
              <Stack gap="quarck">
                <OtpInput
                  length={tokenEmail.codigo.length}
                  type="numeric"
                  // No celular, as 6 caixas md (48px) não cabem no cartão.
                  size={celular ? 'sm' : 'md'}
                  ariaLabel={`Token enviado para ${tokenEmail.emailMascarado}`}
                  value={token}
                  onChange={setToken}
                />
                <Text variant="caption" className="ass-texto-suave ass-paragrafo" role="status">
                  {reenvios > 0 ? 'Token reenviado' : 'Token enviado'} para {tokenEmail.emailMascarado}
                </Text>
                <Link
                  variant="primary"
                  underline="hover"
                  standalone
                  iconLeft={<Icon icon={faEnvelope} size="xs" variant="inherit" />}
                  disabled={espera > 0}
                  onClick={reenviarToken}
                >
                  {espera > 0 ? (
                    <>
                      Reenviar token em <span className="ass-contador">{espera}s</span>
                    </>
                  ) : (
                    'Reenviar token'
                  )}
                </Link>
              </Stack>
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
