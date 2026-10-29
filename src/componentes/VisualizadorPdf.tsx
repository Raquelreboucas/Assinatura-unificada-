import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button, Stack, Text } from '@1doc/1ds-react';
import {
  faBars,
  faDownload,
  faEllipsisVertical,
  faMinus,
  faPlus,
  faPrint,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

import { arquivo, paginas, type Bloco } from '../dados';
import { CORTES, useAbaixoDe } from '../hooks';

const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_PASSO = 25;
/** Largura do papel no visualizador, a mesma de `--ass-pagina-largura`. */
const LARGURA_PAGINA = 560;
/** Respiro lateral da área de páginas (spacing-xxs dos dois lados). */
const RESPIRO_PAGINAS = 48;

function PaginaDocumento({ blocos }: { blocos: Bloco[] }) {
  return (
    <Stack gap="xxxs" className="ass-pagina">
      {blocos.map((bloco, i) =>
        bloco.tipo === 'titulo' ? (
          <Text key={i} as="h2" variant="body1" weight="semibold" align="center" color="primary">
            {bloco.texto}
          </Text>
        ) : (
          <Text
            key={i}
            variant="body2"
            weight={bloco.tipo === 'clausula' ? 'semibold' : 'regular'}
            color="primary"
            className="ass-paragrafo"
          >
            {bloco.texto}
          </Text>
        ),
      )}
    </Stack>
  );
}

/**
 * Visualizador do PDF do envelope: barra de ferramentas, miniaturas à esquerda
 * e as páginas à direita. No desktop as páginas rolam com a janela; no celular o
 * visualizador tem altura própria e as páginas encolhem até caber na largura.
 * O 1DS não tem um visualizador de documento; a superfície é do produto,
 * montada com Stack, Text, Button e tokens.
 */
export function VisualizadorPdf() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotacao, setRotacao] = useState(0);
  const refsPaginas = useRef<(HTMLDivElement | null)[]>([]);
  const refAreaPaginas = useRef<HTMLDivElement>(null);
  const [miniaturasAbertas, setMiniaturasAbertas] = useState(true);
  const celular = useAbaixoDe(CORTES.md);
  const [ajuste, setAjuste] = useState(1);

  // Encaixe na largura: abaixo de 560px de área útil, o papel encolhe junto.
  useEffect(() => {
    const area = refAreaPaginas.current;
    if (!area) return;
    const medir = () =>
      setAjuste(Math.min(1, (area.clientWidth - RESPIRO_PAGINAS) / LARGURA_PAGINA));
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(area);
    return () => observador.disconnect();
  }, []);

  // A página atual é a que cruza o meio da parte visível da área de páginas,
  // role a janela (desktop) ou o próprio visualizador (celular).
  useEffect(() => {
    const atualizar = () => {
      const area = refAreaPaginas.current?.getBoundingClientRect();
      if (!area) return;
      const meio = (Math.max(area.top, 0) + Math.min(area.bottom, window.innerHeight)) / 2;
      const indice = refsPaginas.current.findIndex((el) => {
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= meio && bottom >= meio;
      });
      if (indice >= 0) setPaginaAtual(indice + 1);
    };
    window.addEventListener('scroll', atualizar, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', atualizar, { capture: true });
  }, []);

  const irParaPagina = (numero: number) => {
    setPaginaAtual(numero);
    refsPaginas.current[numero - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="ass-pdf"
      aria-label={`Visualização de ${arquivo.nome}`}
      style={{ '--ass-ajuste': ajuste } as CSSProperties}
    >
      <Stack direction="horizontal" gap="xxxs" align="center" className="ass-pdf__barra">
        <Stack direction="horizontal" gap="xxxs" align="center" className="ass-pdf__arquivo">
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faBars}
            className="ass-pdf__so-largo"
            ariaLabel={miniaturasAbertas ? 'Ocultar miniaturas' : 'Mostrar miniaturas'}
            ariaPressed={miniaturasAbertas}
            onClick={() => setMiniaturasAbertas((aberto) => !aberto)}
          />
          <Text variant="body2" weight="semibold" className="ass-pdf__nome ass-paragrafo">
            {arquivo.nome}
          </Text>
        </Stack>

        <Stack direction="horizontal" gap="mini" align="center">
          <Stack direction="horizontal" gap="nano" align="center">
            <span className="ass-pdf__campo">
              <Text as="span" variant="label" weight="regular">
                {paginaAtual}
              </Text>
            </span>
            <Text as="span" variant="label" weight="regular" className="ass-pdf__texto">
              / {paginas.length}
            </Text>
          </Stack>
          <span className="ass-pdf__divisor ass-pdf__so-largo" aria-hidden="true" />
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faMinus}
            className="ass-pdf__so-largo"
            ariaLabel="Diminuir zoom"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_PASSO))}
          />
          <span className="ass-pdf__campo ass-pdf__so-largo">
            <Text as="span" variant="label" weight="regular">
              {zoom}%
            </Text>
          </span>
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faPlus}
            className="ass-pdf__so-largo"
            ariaLabel="Aumentar zoom"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_PASSO))}
          />
          <span className="ass-pdf__divisor ass-pdf__so-largo" aria-hidden="true" />
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faRotateRight}
            className="ass-pdf__so-largo"
            ariaLabel="Girar página"
            onClick={() => setRotacao((r) => (r + 90) % 360)}
          />
        </Stack>

        <Stack direction="horizontal" gap="xxxs" align="center" className="ass-pdf__acoes">
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faDownload}
            ariaLabel="Baixar documento"
          />
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faPrint}
            className="ass-pdf__so-largo"
            ariaLabel="Imprimir documento"
            onClick={() => window.print()}
          />
          <Button
            variant="icon"
            size="xs"
            iconSize="sm"
            iconTone="inverse"
            startIcon={faEllipsisVertical}
            ariaLabel="Mais opções"
          />
        </Stack>
      </Stack>

      <div className="ass-pdf__corpo">
        {miniaturasAbertas && !celular && (
          <nav className="ass-pdf__miniaturas" aria-label="Páginas do documento">
            <div className="ass-pdf__miniaturas-lista">
            {paginas.map((blocos, i) => {
              const numero = i + 1;
              const ativa = numero === paginaAtual;
              return (
                <button
                  key={numero}
                  type="button"
                  className="ass-miniatura"
                  aria-current={ativa ? 'page' : undefined}
                  aria-label={`Página ${numero}`}
                  onClick={() => irParaPagina(numero)}
                >
                  <span className={`ass-miniatura__borda${ativa ? ' ass-miniatura__borda--ativa' : ''}`}>
                    <span className="ass-miniatura__recorte" aria-hidden="true">
                      <PaginaDocumento blocos={blocos} />
                    </span>
                  </span>
                  <Text as="span" variant="caption" className="ass-pdf__texto ass-paragrafo">
                    {numero}
                  </Text>
                </button>
              );
            })}
            </div>
          </nav>
        )}

        <div className="ass-pdf__paginas" ref={refAreaPaginas}>
          {paginas.map((blocos, i) => (
            <div
              key={i}
              ref={(el) => {
                refsPaginas.current[i] = el;
              }}
              className="ass-pdf__pagina"
              style={{ zoom: (zoom / 100) * ajuste, rotate: `${rotacao}deg` }}
            >
              <PaginaDocumento blocos={blocos} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
