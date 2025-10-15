import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';

console.log(
  `            .--~~,__
:-....,-------\`~~'._.'
 \`-,,,  ,_      ;'~U'
  _,-' ,' \`-__; '--.
 (_/'~~      ''''(;

 Enjoy a Doggo :)
`
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
