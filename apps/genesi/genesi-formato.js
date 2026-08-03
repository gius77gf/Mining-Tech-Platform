/* COME GENESI SCRIVE UN NUMERO — E COME LO LEGGE
   ══════════════════════════════════════════════════════════════════════
   Il primo pezzo di Genesi che esce da `genesi.html`, e non è stato scelto
   a caso: queste sei funzioni scrivono **quasi trecento** numeri della
   pagina — la spalla, la maglia, il consumo specifico, i tempi di sparo, i
   chili di esplosivo — e fino al 01/08 erano l'unica parte del prodotto con
   **zero prove pure**, perché `node` non importa un file `.html`.

   ⛔ E LA REGOLA CHE DIFENDONO È QUELLA DEL FONDATORE. Su un dato che manca
   rispondono **«—»**, non «0»: uno zero è un fatto («qui non c'è
   esplosivo»), un dato mancante è l'assenza di un fatto, e in una pagina di
   progettazione di volata i due si leggono in modo opposto. Erano già
   scritte così; adesso c'è una prova che lo pretende, invece della memoria
   di chi le rilegge.

   ⚠️ `useGrouping` è **esplicito** in tutt'e due i formattatori, e non è
   pedanteria: `toLocaleString("it-IT")` non raggruppa allo stesso modo in
   Node e in Chromium — sui numeri di quattro cifre il browser scrive
   «6.375» e Node «6375». Un modulo che gira in tutt'e due i posti e non lo
   dichiara restituisce due stringhe diverse a seconda di dove gira, e da lì
   nasce una prova verde in Node che fallirebbe nel browser. Misura:
   `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`.

   Non c'è dentro `gsv`: scrive **dentro un campo** con `$(id)`, quindi è
   della pagina e nella pagina resta. La distinzione l'ha fatta vedere
   `tests/genesi-estraibili.mjs`, dopo che lo strumento è stato corretto
   perché non la vedeva.

   ⛔ E DAL 03/08 QUI DENTRO C'È ANCHE IL VERSO OPPOSTO: `gEsito` e `gIn`,
   cioè come Genesi LEGGE un numero scritto a mano. Sono arrivate insieme al
   blocco della riconciliazione (`riconDelta` chiama `gIn` sul valore che il
   fochino digita dopo lo sparo), e stanno qui e non in `genesi-data.js` per
   la stessa ragione per cui ci stanno `gnum` e `gseg`: la convenzione dei
   numeri italiani è una sola, e scriverla e leggerla sono le sue due metà.
   Sono entrate IDENTICHE, riga per riga: la logica vera è del lettore
   condiviso (`numeroScritto` di `dw-shell.js`), qui c'è solo la scelta dei
   sei decimali — Genesi va da 0,05 m di errore al colletto a 4.680 kg di
   esplosivo totale, e non è il posto in cui arrotondare. */

import { numeroScritto } from '../../shared/deepwork-id-client/dw-shell.js';

export function gnum(v, dec){
  if(v===null || v==='' || v===undefined) return '—';
  const n = +v;
  if(!isFinite(n)) return '—';
  const d = Math.max(0, Math.min(6, dec==null?2:dec|0));
  return n.toLocaleString('it-IT', { maximumFractionDigits:d, useGrouping:true });
}

export function gseg(v, dec){
  if(v===null || v==='' || v===undefined) return '—';
  const n = +v;
  if(!isFinite(n)) return '—';
  return (n<0?'−':'+') + gnum(Math.abs(n), dec);
}

export function gfix(v, dec){
  if(v===null || v==='' || v===undefined) return '—';
  const n = +v;
  if(!isFinite(n)) return '—';
  const d = Math.max(0, Math.min(6, dec==null?1:dec|0));
  return n.toLocaleString('it-IT', { minimumFractionDigits:d, maximumFractionDigits:d, useGrouping:true });
}

export function gdata(s){
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/.exec(String(s || ''));
  return m ? m[3] + '/' + m[2] + '/' + m[1] + (m[4] ? ' alle ' + m[4] : '') : String(s || '');
}

export function fmtMs(v){ return gfix(v,1); }

export function fmtKg(v){ return gfix(v, v<0.1?3:2); }

/* ══════════════════════════════════════════════════════════════════════
   LEGGERE UN NUMERO SCRITTO A MANO — la virgola, che in cava è la norma
   ══════════════════════════════════════════════════════════════════════
   Misurato in Chromium: in un `<input type="number">`, digitando «4,5» da
   tastiera, `.value` diventa **«45»** e `checkValidity()` risponde true. Il
   browser scarta la virgola, tiene le cifre e chiama valido il numero
   sbagliato. In Genesi vuol dire una **spalla di 45 metri invece di 4,5**:
   cambia la maglia, il consumo specifico, la frammentazione, e soprattutto le
   vibrazioni e la gittata — cioè i numeri da cui dipendono le distanze di
   sicurezza.
   `gIn` accetta «4,5» e «4.5», e anche le migliaia in entrambe le convenzioni
   («1.250,5» e «1,250.5»). Su un valore che non si capisce ritorna NaN, MAI
   zero: chi chiama tiene il valore di prima invece di progettare su un numero
   inventato.
   `gEsito` è la lettura completa (con il motivo), `gIn` il solo numero per i
   ~30 punti che vogliono un numero e basta. */
export function gEsito(v, opts){ return numeroScritto(v, { decimali: 6, ...(opts||{}) }); }
export function gIn(v){ const r = gEsito(v); return r.ok ? r.valore : NaN; }
