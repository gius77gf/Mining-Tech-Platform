/* COME GENESI SCRIVE UN NUMERO
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
   perché non la vedeva. */

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
