import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Icon, Text } from '@1doc/1ds-react';
import { faCheck, faChevronDown, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { usePerfil, type Perfil } from '../perfil';

/** `resumo` vai no chip da pílula; `descricao`, no menu. */
const OPCOES: { valor: Perfil; nome: string; resumo: string; descricao: string }[] = [
  { valor: 'interno', nome: 'Interno', resumo: 'usuário interno', descricao: 'usuário interno, com conta 1Doc' },
  {
    valor: 'externo',
    nome: 'Externo',
    resumo: 'usuário externo',
    descricao: 'Usuário externo, com login interno',
  },
  {
    valor: 'externo-logado',
    nome: 'Logado',
    resumo: 'externo logado',
    descricao: 'Usuário externo, logado como externo, sem token',
  },
  {
    valor: 'externo-token',
    nome: 'Token',
    resumo: 'externo sem login',
    descricao: 'externo sem login, com token do e-mail',
  },
];

/** Distância (px) que o ponteiro anda antes de virar arrasto em vez de clique. */
const LIMIAR_ARRASTO = 4;
/** Margem mínima (px) entre a pílula e a borda da janela. */
const MARGEM = 8;
/** Largura do menu, a mesma do CSS (`.ass-seletor__menu`). */
const LARGURA_MENU = 340;
const CHAVE_POSICAO = 'assinador:seletor-perfil:posicao';

type Posicao = { x: number; y: number };

function lerPosicao(): Posicao | null {
  try {
    const salvo = localStorage.getItem(CHAVE_POSICAO);
    return salvo ? (JSON.parse(salvo) as Posicao) : null;
  } catch {
    return null;
  }
}

function salvarPosicao(posicao: Posicao) {
  try {
    localStorage.setItem(CHAVE_POSICAO, JSON.stringify(posicao));
  } catch {
    // Sem armazenamento (aba anônima, bloqueio): a posição só não é lembrada.
  }
}

/**
 * Seletor do protótipo, flutuante e arrastável: troca entre o assinador do
 * usuário interno e o do externo. Clique abre o menu; arrastar move a pílula
 * (a posição fica salva neste navegador). Não é tela do produto, é ferramenta
 * de quem apresenta o protótipo, por isso fica fora da Moldura.
 */
export function SeletorPerfil() {
  const { perfil, setPerfil } = usePerfil();
  const [aberto, setAberto] = useState(false);
  const [posicao, setPosicao] = useState<Posicao | null>(lerPosicao);
  const [menuAbaixo, setMenuAbaixo] = useState(false);
  /** Deslocamento horizontal do menu em relação à pílula, para caber na janela. */
  const [menuEsquerda, setMenuEsquerda] = useState(0);
  const refRaiz = useRef<HTMLDivElement>(null);
  const refGatilho = useRef<HTMLButtonElement>(null);
  const refItens = useRef<(HTMLButtonElement | null)[]>([]);
  const arrasto = useRef<{ inicioX: number; inicioY: number; dx: number; dy: number; movendo: boolean } | null>(
    null,
  );

  const atual = OPCOES.find((o) => o.valor === perfil) ?? OPCOES[0];

  // Mantém a pílula dentro da janela (ao arrastar e ao redimensionar).
  const encaixar = useCallback((p: Posicao): Posicao => {
    const el = refRaiz.current;
    const largura = el?.offsetWidth ?? 0;
    const altura = el?.offsetHeight ?? 0;
    return {
      x: Math.min(Math.max(p.x, MARGEM), window.innerWidth - largura - MARGEM),
      y: Math.min(Math.max(p.y, MARGEM), window.innerHeight - altura - MARGEM),
    };
  }, []);

  // Primeira vez: centralizada, logo acima da barra de ações do rodapé.
  useEffect(() => {
    const el = refRaiz.current;
    if (!el) return;
    if (!posicao) {
      const rodape = document.querySelector('.ass-rodape')?.getBoundingClientRect().height ?? 0;
      setPosicao(
        encaixar({
          x: (window.innerWidth - el.offsetWidth) / 2,
          y: window.innerHeight - rodape - el.offsetHeight - 16,
        }),
      );
    }
    const aoRedimensionar = () => setPosicao((p) => (p ? encaixar(p) : p));
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, [posicao, encaixar]);

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: globalThis.PointerEvent) => {
      if (!refRaiz.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('pointerdown', fora);
    return () => document.removeEventListener('pointerdown', fora);
  }, [aberto]);

  // Ao abrir, o foco vai para a opção escolhida.
  useEffect(() => {
    if (!aberto) return;
    const indice = OPCOES.findIndex((o) => o.valor === perfil);
    refItens.current[indice]?.focus();
  }, [aberto, perfil]);

  const abrir = () => {
    const caixa = refRaiz.current?.getBoundingClientRect();
    if (caixa) {
      // O menu abre para cima; perto do topo da janela, abre para baixo.
      setMenuAbaixo(caixa.top < 260);
      // Alinhado à direita da pílula, mas sem sair da janela.
      const largura = Math.min(LARGURA_MENU, window.innerWidth - MARGEM * 4);
      const desejado = caixa.right - largura;
      const encaixado = Math.min(Math.max(desejado, MARGEM), window.innerWidth - largura - MARGEM);
      setMenuEsquerda(encaixado - caixa.left);
    }
    setAberto(true);
  };

  const fechar = (devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) refGatilho.current?.focus();
  };

  const escolher = (valor: Perfil) => {
    if (valor !== perfil) setPerfil(valor);
    fechar();
  };

  const aoApertar = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const caixa = refRaiz.current!.getBoundingClientRect();
    arrasto.current = {
      inicioX: e.clientX,
      inicioY: e.clientY,
      dx: e.clientX - caixa.left,
      dy: e.clientY - caixa.top,
      movendo: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const aoMover = (e: PointerEvent<HTMLButtonElement>) => {
    const a = arrasto.current;
    if (!a) return;
    if (!a.movendo && Math.hypot(e.clientX - a.inicioX, e.clientY - a.inicioY) < LIMIAR_ARRASTO) return;
    if (!a.movendo) {
      a.movendo = true;
      setAberto(false);
    }
    setPosicao(encaixar({ x: e.clientX - a.dx, y: e.clientY - a.dy }));
  };

  const aoSoltar = () => {
    const a = arrasto.current;
    arrasto.current = null;
    if (!a) return;
    if (a.movendo) {
      setPosicao((p) => {
        if (p) salvarPosicao(p);
        return p;
      });
    } else if (aberto) {
      fechar();
    } else {
      abrir();
    }
  };

  const aoTeclarGatilho = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      abrir();
    }
  };

  const aoTeclarMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    const itens = refItens.current.filter(Boolean) as HTMLButtonElement[];
    const indice = itens.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      fechar();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const passo = e.key === 'ArrowDown' ? 1 : -1;
      itens[(indice + passo + itens.length) % itens.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      itens[e.key === 'Home' ? 0 : itens.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      fechar(false);
    }
  };

  return (
    <div
      ref={refRaiz}
      className="ass-seletor"
      style={posicao ? { left: posicao.x, top: posicao.y } : { visibility: 'hidden' }}
    >
      {aberto && (
        <div
          role="menu"
          aria-label="Ver o assinador como"
          className={`ass-seletor__menu${menuAbaixo ? ' ass-seletor__menu--abaixo' : ''}`}
          style={{ left: menuEsquerda }}
          onKeyDown={aoTeclarMenu}
        >
          <Text as="span" variant="caption" weight="bold" transform="uppercase" className="ass-seletor__titulo">
            Ver o assinador como
          </Text>
          {OPCOES.map((opcao, i) => {
            const marcada = opcao.valor === perfil;
            return (
              <button
                key={opcao.valor}
                ref={(el) => {
                  refItens.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={marcada}
                tabIndex={-1}
                className={`ass-seletor__item${marcada ? ' ass-seletor__item--marcado' : ''}`}
                onClick={() => escolher(opcao.valor)}
              >
                <Text as="span" variant="body2" weight="bold" color="inherit" className="ass-seletor__nome">
                  {opcao.nome}
                </Text>
                <Text as="span" variant="body2" color="inherit" className="ass-seletor__descricao">
                  {opcao.descricao}
                </Text>
                {marcada && <Icon icon={faCheck} size="sm" variant="inherit" />}
              </button>
            );
          })}
        </div>
      )}

      <button
        ref={refGatilho}
        type="button"
        className="ass-seletor__pilula"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={`Visualização: ${atual.nome}, ${atual.descricao}. Arraste para mover.`}
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={() => (arrasto.current = null)}
        onKeyDown={aoTeclarGatilho}
      >
        <Icon icon={faLayerGroup} size="sm" variant="inherit" />
        <Text as="span" variant="caption" weight="bold" transform="uppercase" className="ass-seletor__rotulo">
          Visualização
        </Text>
        <span className="ass-seletor__chip">
          <Text as="span" variant="body2" weight="bold" color="inherit">
            {atual.nome}
          </Text>
          <Text as="span" variant="body2" color="inherit" className="ass-seletor__chip-descricao">
            · {atual.resumo}
          </Text>
        </span>
        <Icon icon={faChevronDown} size="xs" variant="inherit" />
      </button>
    </div>
  );
}
