import { useState, type FormEvent } from 'react';
import { Button, Icon, Input, Stack, Text } from '@1doc/1ds-react';
import { faArrowRight, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

import { Moldura } from '../../componentes/Moldura';
import { usuario } from '../../dados';

/**
 * Formata o que foi digitado como DD/MM/AAAA. O `Input` do 1DS não tem máscara
 * de data (só cpf, cnpj, cep e phone), então o formato sai no `onChange`.
 * 1ds: limitação #11.
 */
function mascararData(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)].filter(Boolean).join('/');
}

/** Data DD/MM/AAAA que existe no calendário e já passou. */
function dataValida(valor: string) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!partes) return false;
  const [, dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia && data < new Date()
  );
}

type TelaConfirmarDadosProps = {
  onConfirmar: () => void;
};

/**
 * Antes do assinador, o externo sem login confirma quem é: o nome já vem do
 * convite; CPF e data de nascimento são digitados. Só com os dois completos o
 * "Avançar" libera.
 */
export function TelaConfirmarDados({ onConfirmar }: TelaConfirmarDadosProps) {
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [tentou, setTentou] = useState(false);

  const cpfCompleto = cpf.replace(/\D/g, '').length === 11;
  const nascimentoOk = dataValida(nascimento);
  const pronto = cpfCompleto && nascimentoOk;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (pronto) onConfirmar();
  };

  return (
    <Moldura fundo="surface">
      <Stack align="center" justify="center" className="ass-centro">
        <Stack as="form" gap="xxs" fullWidth className="ass-confirmar" onSubmit={enviar}>
          <Stack align="center" gap="nano">
            <Text as="h1" variant="h5" weight="bold" align="center" color="primary">
              Confirme seus dados
            </Text>
            <Text variant="body2" align="center" className="ass-texto-suave ass-paragrafo">
              Para sua segurança, confirme seus dados antes de acessar o documento para assinatura.
            </Text>
          </Stack>

          <Stack gap="xxxs">
            <Input label="Nome completo" required readOnly value={usuario.nomeCompleto} fullWidth />
            <Input
              label="CPF"
              required
              mask="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={setCpf}
              onBlur={() => setTentou(true)}
              errorMessage={tentou && cpf && !cpfCompleto ? 'Digite os 11 números do CPF.' : undefined}
              fullWidth
            />
            <Input
              label="Data de nascimento"
              required
              placeholder="DD/MM/AAAA"
              value={nascimento}
              onChange={(valor) => setNascimento(mascararData(valor))}
              onBlur={() => setTentou(true)}
              errorMessage={
                tentou && nascimento.length === 10 && !nascimentoOk ? 'Digite uma data válida.' : undefined
              }
              fullWidth
            />
          </Stack>

          <Stack gap="xxxs" align="center">
            <Button type="submit" variant="primary" size="md" endIcon={faArrowRight} disabled={!pronto} fullWidth>
              Avançar
            </Button>
            <Stack direction="horizontal" gap="quarck" align="center" className="ass-confirmar__seguro">
              <Icon icon={faShieldHalved} size="xs" variant="inherit" />
              <Text as="span" variant="caption" weight="semibold" color="inherit">
                Ambiente seguro
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Moldura>
  );
}
