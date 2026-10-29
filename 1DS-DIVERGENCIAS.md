# Divergências entre o Figma e o 1DS (2.25.0)

Pontos em que o frame do Figma pede algo que o componente publicado não faz, e o
que foi feito enquanto isso. Para levar ao time do DS como
`divergência: <Componente> — <o que difere>`.

Arquivo: [-1Doc- Processo de Design](https://www.figma.com/design/VBRtPd8YYSRqjC5T7NjOW7/-1Doc--Processo-de-Design)

| # | Onde | O Figma pede | O 1DS tem | O que foi feito |
| --- | --- | --- | --- | --- |
| 1 | Tela 2, botão "Assinar" ([9781:11228](https://www.figma.com/design/VBRtPd8YYSRqjC5T7NjOW7/-1Doc--Processo-de-Design?node-id=9781-11228)) | Botão verde (positivo) com ícone | `Button` não tem variante positiva (o Code Connect do frame também diz `primary`) | `Button variant="primary"` (azul). Não repintado com CSS |
| 2 | Tela 2, senha e certificado | Campos sem rótulo visível | Regra de tela nova do 1DS: rótulo sempre visível | Mantido o visual do Figma; nome acessível em `ariaLabel` ("Senha da 1Doc", "Certificado digital"). Decisão de design para confirmar |
| 3 | Topo de todas as telas | Marca + avatar + nome em 16px bold `primary-dark` com seta preenchida, sem navegação | `AppHeader` desenha o nome em 14px semibold neutro | Topo montado com `Box`, `Logo`, `Avatar`, `Text`, `Icon` e `Dropdown` (menu "Sair") |
| 4 | Tela 3, marca | `Logo` com 80px | `Logo` só tem `regular` (40px) e `small` (15px) | Classe `ass-logo-grande` com `calc(spacing-sm * 2)` |
| 5 | Textos de parágrafo | Estilo Paragraph, altura de linha 170% | `Text` `body2`/`caption` usa 150% | Classe `ass-paragrafo` com o token `--umds-semantic-typography-paragraph-line-height` |
| 6 | Legendas e apoio | Cor `neutral-dark-medium` | `Text color` não tem esse tom | Classe `ass-texto-suave` com o token semântico |
| 7 | Visualizador de PDF | Barra, miniaturas e páginas | Não há componente de visualizador de documento | Superfície do produto com `Stack`, `Text`, `Button variant="icon" iconTone="inverse"` e tokens |
| 8 | Painéis e cartões de opção | Sombra `Shadow/Center/md` | `Box shadow` só tem as sombras de baixo | Classe com `--umds-semantic-shadow-center-md` |
| 9 | Rodapé, espaço entre botões | 10px | Escala 8 / 12 | `gap="nano"` (8px) |

| 10 | Recusa ([9728:29419](https://www.figma.com/design/VBRtPd8YYSRqjC5T7NjOW7/-1Doc--Processo-de-Design?node-id=9728-29419)) | `Modal` base de 650px, título à esquerda, × no topo | A pedido, trocado por `ConfirmDialog variant="negative"`: 440px, centralizado, ícone de alerta, sem × (fecha em "Voltar", Esc ou overlay) | O Figma precisa ser atualizado para o dialog. A justificativa da recusa foi removida a pedido; o dialog tem só a pergunta |

| 11 | Modal "Alterar papel" (sem frame no Figma) | — | A lista do `Select` abre dentro do corpo do `Modal` (`overflow: auto`) e é cortada por ele; o `Select` não tem prop para abrir num Portal | O corpo reserva a altura da lista aberta (classe `ass-papel`). Lacuna do DS: pedir que o `Select` abra fora do corpo do modal |

| 12 | Seletor "Visualização" (só do protótipo) | Pílula escura flutuante e arrastável, com menu "Ver o assinador como" (formato da referência enviada) | Não há componente flutuante arrastável no 1DS; `Dropdown` tem painel claro | Componente do protótipo (`SeletorPerfil`) com `Text`, `Icon` e tokens (`background-dark`, `layer-toast`). Menu com `menuitemradio`, setas, Esc e clique fora. Fica fora da Moldura: não é tela do produto |

## Usuário externo ([9792:22001](https://www.figma.com/design/VBRtPd8YYSRqjC5T7NjOW7/-1Doc--Processo-de-Design?node-id=9792-22001))

- O Figma traz só o cartão "Gov.br". A tela do externo é a cópia da interna (`src/externo/`) com esse cartão entre "Assinatura 1Doc" e "Certificado ICP-Brasil". Ordem e presença das outras duas opções para validar com design.
- Texto do cartão corrigido de "em um conta GOV.br" para "em uma conta gov.br" (grafia oficial da marca).
- A pedido, o logo do gov.br saiu da moldura à esquerda (como no Figma) e foi para o canto direito, sem moldura, como os logos da 1Doc e da ICP-Brasil. O Figma precisa ser atualizado.
- Texto do cartão (a pedido): "É necessário ter uma conta Gov.br de nível prata ou ouro para poder assinar documentos." e, abaixo, "Se o redirecionamento automático não acontecer, **clique aqui**." (`Link` do 1DS, que abre o login de novo). Escolher o cartão já redireciona (popup 480×640, centralizado); "Assinar" com gov.br sem conta autenticada, ou depois de uma falha, abre o login de novo.
- Estados do cartão: **autenticado** mostra o `Badge` `positive` `solid` "Autenticado" sozinho, sem o nome nem o nível da conta; **falha** mostra o `Badge` `negative` `solid` "Falha na autenticação" (tentar de novo reabre o login); fechar o popup sem concluir não muda nada. Se o navegador bloquear o popup, o cartão avisa.
- **Erro da conta, fora do cartão (a pedido):** com a falha na autenticação e a opção gov.br escolhida, um `Alert` `negative` `soft` aparece na página, no painel, entre as opções e o "Prosseguir sem assinar": "É necessário ter uma conta Gov.br nível prata ou ouro para utilizar o serviço de assinatura." e, abaixo, "**Clique aqui** para realizar o upgrade da conta." (`Link` para o portal do gov.br). Some ao autenticar ou ao escolher outra opção, e volta ao retornar ao gov.br com a falha. O `Alert` separa o texto (`description`, 12px) do bloco de ação (`content`), então o link fica na linha de baixo, e não dentro da frase como na referência; os dois usam 12px. O endereço do link é só a página inicial do gov.br: o da página de nível da conta fica para o produto.
- Como o texto tem um link, o cartão deixou de ser um `<button>` único (link dentro de botão é inválido): a escolha é o botão do título esticado sobre o cartão (`::after`) e o link fica por cima (`z-index`); o foco do botão aparece no cartão todo (`:has`). Padrão de "cartão clicável" que o DS não oferece: lacuna do DS.
- No protótipo, o popup é uma página de SIMULAÇÃO (`?popup=govbr`, `PopupGovBr`): não pede credencial nem imita a tela do gov.br; tem os botões "Simular autenticação", "Simular erro" e "Cancelar" e devolve o resultado por `postMessage`. No produto, é o login real do gov.br.

## Usuário externo logado com a conta interna (tela "Ops...")

- No seletor, o item passou a se chamar "Usuário externo, com login interno". O assinador continua com a opção gov.br.
- Antes de abrir o assinador, a pessoa vê "Ops..." (referência enviada): está autenticada com a conta interna, mas o convite foi para o e-mail externo. O botão "Sair da conta" leva ao externo sem login, que começa em "Confirme seus dados" (nome, CPF e data de nascimento) e depois mostra o assinador com "Fazer login na 1Doc" no topo.
- A referência é uma tela do sistema legado (fonte Lato, botão cinza, texto à esquerda, sem topo). A pedido, foi refeita no 1DS com visual mais moderno: `Moldura` (topo com a pessoa logada), mensagem centralizada na página, `Badge` "Acesso interno" (`info`), título, os dois textos com os e-mails em destaque e `Button primary lg`. A ilustração "Saindo pela porta" (pessoa atravessando uma porta aberta, com seta de saída) foi criada para este caso, sem frame no Figma: SVG próprio (`IlustracaoSaida`), 256×200 como a do envelope, com as cores só em tokens (`feedback-info`, `primary`, `neutral`) pelas classes `ass-saida__*`. Os e-mails são os do print, em `dados.ts` (`contas`). Texto, badge e ilustração para validar com design; se o time de design desenhar a versão final, troca-se só o componente.

## Usuário externo logado com a conta externa, sem token

- Sem frame no Figma. Cópia do externo em `src/externo-logado/` (sem a tela "Ops..."). Entra direto nos documentos, já identificado (nome no topo, como no interno). No seletor: "Logado · Usuário externo, logado como externo, sem token".
- Na Assinatura 1Doc, o campo é a **senha da conta** (`Input password`, nome em `ariaLabel`, como no interno) com o link "Enviar token por e-mail" logo abaixo.
- Ao enviar, o campo vira um `OtpInput` numérico de 6 dígitos **vazio** (a pessoa digita o token que chegou), com o foco na primeira caixa, o aviso "Token enviado para r•••••@gmail.com" e os links "Reenviar token" e "Usar senha" (16px entre eles, `spacing-xxxs`). **Reenvio só após 1 minuto:** a cada envio o link fica desabilitado com a contagem "Reenviar token em 59s" e só libera ao zerar (o aviso passa a "Token reenviado"). A espera vale também depois de "Usar senha": o "Enviar token por e-mail" fica desabilitado com a mesma contagem, para não burlar o intervalo. Mesmo desabilitado, clicar nele (ou Enter/Espaço) leva de volta às caixas do token **já enviado**, sem novo envio e sem zerar a contagem. Como o `Link` desabilitado não recebe clique nem foco, um wrapper (`role="button"`, `tabIndex=0`, `pointer-events: none` no filho) recebe os dois: lacuna do DS (link desabilitado ainda acionável). No celular, `size="sm"` nas caixas. Intervalo de 60s, textos e contagem para validar com design e segurança.
- Diferença para o externo sem login: lá o token vem **preenchido** pelo link do e-mail (já validado); aqui a pessoa o digita. No protótipo, "Assinar" não valida senha nem token.

## Usuário externo sem login (token do e-mail)

- Sem frame no Figma. Cópia do externo em `src/externo-token/`. O topo troca o menu da pessoa pelo botão "Fazer login" (`Button variant="secondary" size="sm"`); com ele, o respiro vertical do topo cai para 12px, para a altura continuar 57px.
- Na Assinatura 1Doc, a senha vira `OtpInput` numérico de 6 dígitos, já preenchido com o token do e-mail (`482915` no protótipo), com a legenda "Token enviado para r•••••@gmail.com". Sem rótulo visível (como a senha), o nome vai em `ariaLabel`. No celular, `size="sm"` para as 6 caixas caberem no cartão.
- Variante do botão de login, texto da legenda e e-mail mascarado para validar com design.
- **Reenvio do token (a pedido):** abaixo das caixas, o link "Reenviar token" (`Link` do 1DS). Como o token já veio do link do e-mail, o primeiro reenvio começa **liberado**; ao reenviar, o campo **esvazia** (o novo token invalida o anterior, e a pessoa digita o novo), o aviso passa a "Token reenviado para …" e o link fica desabilitado com a contagem "Reenviar token em 59s" até zerar (60s, a mesma regra da visualização logada sem token). Intervalo e comportamento do campo para validar com design e segurança.
- Antes do assinador, a tela "Confirme seus dados" (referência enviada): nome completo só leitura, CPF (`Input mask="cpf"`) e data de nascimento obrigatórios; "Avançar" (`md`, largura total) só libera com os dois válidos. O `Input` não tem máscara de data, então DD/MM/AAAA é formatado no `onChange` (limitação #11). O botão do topo passou a ser "Fazer login na 1Doc" (`primary`, `sm`), como na referência.

## Assinando e assinatura concluída ao lado do PDF (a pedido)

- Nas quatro visualizações, as telas "Assinando os documentos..." e "Documentos assinados com sucesso!" mantêm o visualizador de PDF à esquerda e põem a mensagem no painel da direita, centralizada, no lugar do "Tipo de assinatura" (`EnvelopeComResultado`: mesma moldura da escolha do tipo, sem rodapé). No celular e no tablet, o painel vem abaixo do PDF. As telas da recusa ("Recusando…" e "Documentos recusados") continuam centralizadas, sem o PDF.
- No externo sem login, como o painel é estreito, os botões da conclusão empilham em largura total, com "Baixar arquivo assinado" (principal) em cima de "Fazer login na 1Doc" (antes ficavam lado a lado, com o login primeiro).
- Sem frame no Figma. Se o design quiser a mensagem centralizada na página, como antes, em alguma das visualizações, basta trocar o layout dessa tela.

## Estados que o Figma não desenhou

- **Modal "Alterar papel"**: não há frame. Usa o `Modal` base com `Select` "Papel na assinatura" (Parte, Testemunha, Representante legal, Interveniente, Fiador, Aprovador), "Cancelar" e "Salvar". Lista de papéis e textos para validar com design e produto.

- **Erro da assinatura** (senha errada, certificado inválido): não há frame; hoje o fluxo sempre conclui.
- **Loading da recusa** e **tela "Documentos recusados"**: não há frame. Seguem as telas "Assinando" (9728:29236) e "Assinatura concluída" (9728:29199); na recusa, a ilustração troca halo, confete verde e selo pelos tokens de feedback negativo e o ícone de ×. Textos propostos: "Recusando os documentos...", "Assinatura recusada", "Documentos recusados", "Sua recusa foi registrada em …". Para validar com design.
- **"Prosseguir sem assinar"**: sem destino no Figma; o link está no lugar, sem ação.
- **Baixar / Mais opções** do visualizador: sem ação definida.
