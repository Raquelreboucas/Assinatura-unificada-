/**
 * Ilustração "Saindo pela porta": uma pessoa atravessa uma porta aberta, com a
 * seta indicando a saída. Usada na tela "Ops..." (sair da conta para assinar).
 *
 * É ilustração, não ícone, por isso é um SVG próprio (como as do envelope, não
 * existe no catálogo de ícones). Mesma tela de 256×200 e mesma linguagem da
 * "Envelope de assinatura": halo, órbita pontilhada e confete. As cores não
 * ficam no SVG: vêm de classes `ass-saida__*` que usam os tokens do 1DS, então
 * acompanham o tema.
 */
export function IlustracaoSaida() {
  return (
    <svg
      className="ass-saida"
      viewBox="0 0 256 200"
      width={256}
      height={200}
      aria-hidden="true"
      focusable="false"
    >
      <circle className="ass-saida__halo" cx="128" cy="100" r="83.2" />
      <circle className="ass-saida__orbita" cx="128" cy="100" r="96" />

      {/* Confete, nas mesmas posições da ilustração do envelope. */}
      <circle className="ass-saida__ponto ass-saida__ponto--azul" cx="28" cy="45.6" r="4" />
      <circle className="ass-saida__ponto ass-saida__ponto--laranja-claro" cx="228" cy="39.2" r="5.6" />
      <circle className="ass-saida__ponto ass-saida__ponto--laranja-claro" cx="20.8" cy="144" r="3.2" />
      <circle className="ass-saida__ponto ass-saida__ponto--azul" cx="232" cy="152" r="4.8" />
      <circle className="ass-saida__ponto ass-saida__ponto--azul-claro" cx="86.4" cy="14.4" r="3.2" />
      <circle className="ass-saida__ponto ass-saida__ponto--laranja" cx="183.2" cy="178.4" r="4" />

      {/* Porta: batente, vão iluminado e a folha aberta, em perspectiva. */}
      <ellipse className="ass-saida__chao" cx="128" cy="158" rx="54" ry="5" />
      <rect className="ass-saida__batente" x="90" y="44" width="76" height="114" rx="6" />
      <rect className="ass-saida__vao" x="98" y="52" width="60" height="102" rx="3" />
      <polygon className="ass-saida__folha" points="98,52 124,60 124,146 98,154" />
      <circle className="ass-saida__macaneta" cx="118" cy="104" r="2.6" />

      {/* Pessoa de lado, atravessando o vão em direção à saída. */}
      <line className="ass-saida__membro ass-saida__membro--escuro" x1="134" y1="98" x2="126" y2="116" />
      <line className="ass-saida__membro ass-saida__membro--escuro" x1="138" y1="122" x2="130" y2="150" />
      <line className="ass-saida__membro ass-saida__membro--escuro" x1="146" y1="122" x2="154" y2="150" />
      <rect className="ass-saida__corpo" x="132" y="92" width="20" height="34" rx="9" />
      <line className="ass-saida__membro ass-saida__membro--claro" x1="150" y1="98" x2="160" y2="114" />
      <circle className="ass-saida__cabeca" cx="142" cy="78" r="10" />

      {/* Seta da saída. */}
      <path className="ass-saida__seta" d="M174 104 H198 M190 96 L198 104 L190 112" />
    </svg>
  );
}
