import { Icon } from '@1doc/1ds-react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import halo from '../assets/ilustracao/halo.svg';
import onda from '../assets/ilustracao/onda.png';
import ponto1 from '../assets/ilustracao/ponto1.svg';
import ponto2 from '../assets/ilustracao/ponto2.svg';
import ponto3 from '../assets/ilustracao/ponto3.svg';
import ponto4 from '../assets/ilustracao/ponto4.svg';
import ponto5 from '../assets/ilustracao/ponto5.svg';
import ponto6 from '../assets/ilustracao/ponto6.svg';
import envelope from '../assets/ilustracao/envelope.svg';
import aviao from '../assets/ilustracao/aviao.svg';
import circleCheck from '../assets/ilustracao/circle-check.svg';

type IlustracaoEnvelopeProps = {
  /**
   * `positivo`: estado Enviado do Figma (halo verde e selo de check).
   * `negativo`: a mesma peça para a recusa, com halo, confete verde e selo
   * trocados pelos tokens de feedback negativo e o ícone de ×.
   */
  tom?: 'positivo' | 'negativo';
};

/**
 * Ilustração "Envelope de assinatura" (Figma 9648:7565). É ilustração, não
 * ícone: as peças são os SVGs exportados do Figma, na posição de lá (ver as
 * classes `ass-ilustracao__*`).
 */
export function IlustracaoEnvelope({ tom = 'positivo' }: IlustracaoEnvelopeProps) {
  // No tom negativo, halo, confete e selo são redesenhados com tokens.
  const colorido = tom === 'negativo';

  return (
    <div className={`ass-ilustracao ass-ilustracao--${tom}`} aria-hidden="true">
      {colorido ? (
        <span className="ass-ilustracao__halo" />
      ) : (
        <img className="ass-ilustracao__halo" src={halo} alt="" />
      )}
      <img className="ass-ilustracao__onda" src={onda} alt="" width={192} height={192} />
      <img className="ass-ilustracao__ponto ass-ilustracao__ponto--1" src={ponto1} alt="" />
      {colorido ? (
        <span className="ass-ilustracao__ponto ass-ilustracao__ponto--2" />
      ) : (
        <img className="ass-ilustracao__ponto ass-ilustracao__ponto--2" src={ponto2} alt="" />
      )}
      <img className="ass-ilustracao__ponto ass-ilustracao__ponto--3" src={ponto3} alt="" />
      <img className="ass-ilustracao__ponto ass-ilustracao__ponto--4" src={ponto4} alt="" />
      <img className="ass-ilustracao__ponto ass-ilustracao__ponto--5" src={ponto5} alt="" />
      {colorido ? (
        <span className="ass-ilustracao__ponto ass-ilustracao__ponto--6" />
      ) : (
        <img className="ass-ilustracao__ponto ass-ilustracao__ponto--6" src={ponto6} alt="" />
      )}
      <span className="ass-ilustracao__envelope">
        <img src={envelope} alt="" />
      </span>
      <img className="ass-ilustracao__aviao" src={aviao} alt="" />
      <span className="ass-ilustracao__selo">
        {colorido ? (
          <Icon icon={faCircleXmark} size="lg" variant="inherit" />
        ) : (
          <img src={circleCheck} alt="" />
        )}
      </span>
    </div>
  );
}
