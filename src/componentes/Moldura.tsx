import type { ReactNode } from 'react';
import { Avatar, Box, Button, Dropdown, Icon, Logo, Text } from '@1doc/1ds-react';
import { faCaretDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { usuario } from '../dados';
import { usePerfil } from '../perfil';

type MolduraProps = {
  /** Fundo da área de conteúdo: `surface` (branco) ou `muted` (cinza claro). */
  fundo?: 'surface' | 'muted';
  /** Barra de ações fixa no rodapé. */
  rodape?: ReactNode;
  children: ReactNode;
};

/**
 * Topo do assinador como no Figma: só a marca e o menu da pessoa identificada.
 * 1ds: o Figma não usa o AppHeader (nome em 16px bold primary-dark, seta
 * preenchida); o topo é montado com Logo, Avatar, Text e Dropdown. Ver 1DS-DIVERGENCIAS.md
 *
 * Quem chegou pelo link do e-mail, sem login (perfil `externo-token`), vê o
 * botão "Fazer login na 1Doc" no lugar do menu da pessoa.
 */
function Topo() {
  const { perfil } = usePerfil();
  const semLogin = perfil === 'externo-token';

  return (
    <Box
      as="header"
      direction="horizontal"
      justify="between"
      align="center"
      paddingX="sm"
      // O botão de login (32px) é mais alto que o avatar (24px): com respiro
      // menor, o topo fica com a mesma altura nos três assinadores.
      paddingY={semLogin ? 'mini' : 'xxxs'}
      background="surface"
      borderBottom
      className="ass-topo"
    >
      <Logo size="regular" variant="default" />
      {semLogin ? (
        <Button variant="primary" size="sm">
          Fazer login na 1Doc
        </Button>
      ) : (
        <Dropdown
          placement="bottom-end"
          ariaLabel="Menu da conta"
          items={[{ key: 'sair', label: 'Sair', icon: faRightFromBracket }]}
        >
          <button type="button" className="ass-topo__usuario">
            <Avatar type="letter" size="sm" name={usuario.nome}>
              {usuario.iniciais}
            </Avatar>
            <span className="ass-topo__menu">
              <Text as="span" variant="body1" weight="bold" className="ass-topo__nome">
                {usuario.nome}
              </Text>
              <Icon icon={faCaretDown} size="xs" variant="inherit" />
            </span>
          </button>
        </Dropdown>
      )}
    </Box>
  );
}

/**
 * Moldura de todas as telas do assinador: topo, conteúdo ocupando o resto da
 * janela e, quando há, a barra de ações fixa por cima da borda de baixo.
 */
export function Moldura({ fundo = 'muted', rodape, children }: MolduraProps) {
  return (
    <div className={`ass-moldura${rodape ? ' ass-moldura--com-rodape' : ''}`}>
      <Topo />
      <main className={`ass-moldura__conteudo ass-moldura__conteudo--${fundo}`}>{children}</main>
      {rodape}
    </div>
  );
}
