import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@1doc/1ds-tokens/dist/css/primitives.css';
import '@1doc/1ds-tokens/dist/css/semantic.css';
import '@1doc/1ds-tokens/dist/css/theme-1doc.css';

import { setTheme } from '@1doc/1ds-react';

import './assinador.css';
import App from './App';
import { PopupGovBr } from './componentes/PopupGovBr';

setTheme('1doc');

// `?popup=govbr`: a janela de login do gov.br que o cartão "Gov.br" abre.
const emPopupGovBr = new URLSearchParams(window.location.search).get('popup') === 'govbr';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{emPopupGovBr ? <PopupGovBr /> : <App />}</StrictMode>,
);
