/** Dados de exemplo do protótipo, os mesmos do Figma. */

export const usuario = {
  nome: 'Raquel Rebouças',
  /** Nome civil completo, como vem no convite (tela "Confirme seus dados"). */
  nomeCompleto: 'Raquel Rebouças Reis do Nascimento',
  iniciais: 'RR',
  cpf: '023.XXX.XXX-17',
  papel: 'Parte',
};

/** Papéis possíveis de quem assina o envelope. */
export const papeis = [
  { label: 'Parte', value: 'Parte' },
  { label: 'Testemunha', value: 'Testemunha' },
  { label: 'Representante legal', value: 'Representante legal' },
  { label: 'Interveniente', value: 'Interveniente' },
  { label: 'Fiador', value: 'Fiador' },
  { label: 'Aprovador', value: 'Aprovador' },
];

/**
 * Token numérico que o externo sem login recebe no e-mail. Ele já chega
 * validado pelo link, por isso vem preenchido na Assinatura 1Doc.
 */
export const tokenEmail = {
  codigo: '482915',
  emailMascarado: 'r•••••@gmail.com',
};

export const envelope = {
  nome: 'Envelope 01/2026',
  documentos: 12,
};

/**
 * Contas da tela "Ops": a pessoa está logada com a conta interna, mas o
 * convite para assinar foi enviado ao e-mail externo dela.
 */
export const contas = {
  interna: 'raquel.nascimento@1doc.com.br',
  externa: 'raquellrebouças@gmail.com',
};

export const arquivo = {
  nome: 'Contrato de prestação de serviços.pdf',
};

export type Bloco = { tipo: 'titulo' | 'clausula' | 'paragrafo'; texto: string };

const clausulaQuarta: Bloco[] = [
  { tipo: 'clausula', texto: 'CLÁUSULA QUARTA — DAS OBRIGAÇÕES' },
  {
    tipo: 'paragrafo',
    texto:
      'Compete à CONTRATADA executar os serviços com zelo e diligência, observando as normas técnicas aplicáveis e os prazos estabelecidos no plano de trabalho.',
  },
];

export const paginas: Bloco[][] = [
  [
    { tipo: 'titulo', texto: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS' },
    {
      tipo: 'paragrafo',
      texto:
        'Pelo presente instrumento particular, de um lado a SECRETARIA DE EDUCAÇÃO, doravante denominada CONTRATANTE, e de outro lado RAQUEL REBOUÇAS, doravante denominada CONTRATADA, têm entre si justo e contratado o que segue.',
    },
    { tipo: 'clausula', texto: 'CLÁUSULA PRIMEIRA — DO OBJETO' },
    {
      tipo: 'paragrafo',
      texto:
        'O presente contrato tem por objeto a prestação de serviços de consultoria técnica, conforme especificações descritas no Anexo I - Plano de trabalho, que integra este instrumento para todos os fins.',
    },
    { tipo: 'clausula', texto: 'CLÁUSULA SEGUNDA — DO PRAZO' },
    {
      tipo: 'paragrafo',
      texto:
        'O prazo de vigência deste contrato é de 12 (doze) meses, contados a partir da data de sua assinatura, podendo ser prorrogado mediante termo aditivo firmado entre as partes.',
    },
    { tipo: 'clausula', texto: 'CLÁUSULA TERCEIRA — DO VALOR E DO PAGAMENTO' },
    {
      tipo: 'paragrafo',
      texto:
        'Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor mensal acordado, mediante apresentação de nota fiscal e relatório de atividades do período.',
    },
  ],
  clausulaQuarta,
  clausulaQuarta,
  clausulaQuarta,
];

export type Assinante = {
  nome: string;
  situacao: 'assinou' | 'recusou';
  detalhe: string;
};

export const assinantes: Assinante[] = [
  { nome: 'Lucas C.', situacao: 'recusou', detalhe: 'Recusou a assinatura' },
  { nome: 'Priscila M.', situacao: 'assinou', detalhe: 'Assinou em 28/05/2026 às 08:46' },
  { nome: 'Priscila M.', situacao: 'assinou', detalhe: 'Assinou em 16/07/2026 às 14:37' },
];

export const certificados = [
  { label: 'RAQUEL REBOUCAS:02312345617 (e-CPF A3)', value: 'ecpf-a3' },
  { label: 'RAQUEL REBOUCAS:02312345617 (e-CPF A1)', value: 'ecpf-a1' },
];
