import { Fragment, useState } from 'react';
import { Badge, Box, Button, Divider, Icon, Logo, Stack, Text } from '@1doc/1ds-react';
import {
  faArrowRight,
  faCircleXmark,
  faFileSignature,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { ModalPapel } from '../../componentes/ModalPapel';
import { Moldura } from '../../componentes/Moldura';
import { CORTES, useAbaixoDe } from '../../hooks';
import { RodapeAcoes } from '../../componentes/RodapeAcoes';
import { VisualizadorPdf } from '../../componentes/VisualizadorPdf';
import { assinantes, usuario } from '../../dados';

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <Text variant="body2" weight="semibold" color="secondary" className="ass-texto-compacto">
      {rotulo}:{' '}
      <Text as="span" variant="body2" weight="regular" color="inherit" className="ass-texto-compacto">
        {valor}
      </Text>
    </Text>
  );
}

/** Quem está assinando: marca, nome civil, CPF e papel no envelope. */
function IdentificacaoUsuario() {
  const [papel, setPapel] = useState(usuario.papel);
  const [editandoPapel, setEditandoPapel] = useState(false);

  return (
    <Box bordered radius="sm" padding="xxxs" direction="horizontal" gap="xxs" align="start" fullWidth>
      <Logo size="regular" variant="default" />
      <Stack gap="quarck">
        <Text variant="body2" weight="semibold" color="secondary" className="ass-texto-compacto">
          Você está identificado como:
        </Text>
        <Campo rotulo="Nome civil" valor={usuario.nome} />
        <Campo rotulo="CPF" valor={usuario.cpf} />
        <Stack direction="horizontal" gap="quarck" align="center">
          <Campo rotulo="Papel" valor={papel} />
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="primary"
            startIcon={faPenToSquare}
            ariaLabel="Alterar papel"
            className="ass-botao-inline"
            onClick={() => setEditandoPapel(true)}
          />
        </Stack>
      </Stack>
      <ModalPapel
        open={editandoPapel}
        papel={papel}
        onClose={() => setEditandoPapel(false)}
        onSalvar={(novo) => {
          setPapel(novo);
          setEditandoPapel(false);
        }}
      />
    </Box>
  );
}

function ListaAssinantes() {
  const quantosAssinaram = assinantes.filter((a) => a.situacao === 'assinou').length;

  return (
    <Stack gap="nano" fullWidth className="ass-assinaturas">
      <Text variant="body2" weight="medium" color="primary" className="ass-paragrafo">
        {quantosAssinaram} pessoas já assinaram esse documento
      </Text>
      <Box as="ul" bordered radius="sm" background="surface" fullWidth overflow="hidden" className="ass-lista">
        {assinantes.map((assinante, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <li aria-hidden="true">
                <Divider orientation="horizontal" />
              </li>
            )}
            <Stack as="li" direction="horizontal" gap="mini" align="center" className="ass-lista__item">
              <Stack grow gap="none">
                <Text variant="body2" weight="semibold" color="primary" className="ass-paragrafo">
                  {assinante.nome}
                </Text>
                <Text variant="caption" className="ass-texto-suave ass-paragrafo">
                  {assinante.detalhe}
                </Text>
              </Stack>
              {assinante.situacao === 'recusou' ? (
                <Badge
                  variant="negative"
                  appearance="soft"
                  size="sm"
                  iconLeft={<Icon icon={faCircleXmark} size="xs" variant="inherit" />}
                >
                  Recusou
                </Badge>
              ) : (
                <Badge
                  variant="positive"
                  appearance="soft"
                  size="sm"
                  iconLeft={<Icon icon={faFileSignature} size="xs" variant="inherit" />}
                >
                  Assinou
                </Badge>
              )}
            </Stack>
          </Fragment>
        ))}
      </Box>
    </Stack>
  );
}

type TelaDocumentosProps = {
  onVoltar?: () => void;
  onAvancar: () => void;
  onRecusar: () => void;
};

/** Tela 1 — documentos do envelope e detalhes das assinaturas. */
export function TelaDocumentos({ onVoltar, onAvancar, onRecusar }: TelaDocumentosProps) {
  const celular = useAbaixoDe(CORTES.md);
  return (
    <Moldura
      fundo="muted"
      rodape={
        <RodapeAcoes onVoltar={onVoltar}>
          <Button variant="negative-outlined" size="md" onClick={onRecusar}>
            {celular ? 'Recusar' : 'Recusar assinatura'}
          </Button>
          <Button variant="primary" size="md" endIcon={faArrowRight} onClick={onAvancar}>
            Avançar
          </Button>
        </RodapeAcoes>
      }
    >
      <div className="ass-envelope">
        <VisualizadorPdf />
        <aside className="ass-painel ass-painel--hug" aria-label="Detalhes do documento">
          <IdentificacaoUsuario />
          <ListaAssinantes />
        </aside>
      </div>
    </Moldura>
  );
}
