/* ⛔ L'INDIRIZZO DELLA PAGINA STAVA SCRITTO DENTRO A QUATTRO RIGHELLI, ED ERA
      LO STESSO INDIRIZZO MORTO IN TUTTI E QUATTRO.

   Misurato il 25/08. `contrasto-foto`, `prova`, `zone-nere`, `corona-urti` e
   `centro` caricavano `http://127.0.0.1:8941/_p-….html` — il nome che
   l'anteprima aveva nello scratchpad il giorno in cui il primo di loro e' nato.
   Spostata la pagina dentro il repository, quell'indirizzo non esisteva piu':
   `contrasto-foto` ha caricato un 404, ha trovato ZERO sezioni e ha stampato
   «0 sotto soglia», cioe' un verde su tutti i denominatori a zero.
   ⚠️ E l'eccezione che quel righello dichiarava — «i 37 testi con un fondo
   proprio li misura gia' `prova.mjs`» — era onesta e **vuota**: anche
   `prova.mjs` puntava allo stesso 404. Un'eccezione dichiarata resta un posto
   in cui nessuno guarda.

   Qui la regola sta scritta UNA volta perche' la usano in cinque, e la porta
   NON si sceglie: la si chiede al sistema con `listen(0)`. Cosi' la trappola
   del banco che, trovando la porta occupata, riusa il server di qualcun altro
   e ne misura la copia, qui non puo' proprio presentarsi — non c'e' nessuna
   porta da contendere. E' la difesa del contrassegno col pid portata a monte:
   invece di accorgersi che il server e' di un altro, si fa in modo che non ci
   sia nessun altro. */
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, resolve } from 'path';

const TIPI = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
               '.css':'text/css', '.svg':'image/svg+xml', '.json':'application/json',
               '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp' };

/** Alza un server statico sulla cartella data e restituisce la sua porta.
 *  `chiudi()` va chiamata alla fine, se no il processo non muore. */
export async function servi(radice) {
  const R = resolve(radice);
  if (!existsSync(R)) throw new Error(`la cartella da servire non esiste: ${R}`);
  const srv = createServer((req, res) => {
    const via = join(R, decodeURIComponent(req.url.split('?')[0]));
    /* ⛔ e non si esce dalla radice: un `..` nell'indirizzo leggerebbe il disco */
    if (!via.startsWith(R) || !existsSync(via)) { res.writeHead(404); return res.end('no'); }
    res.writeHead(200, { 'content-type': TIPI[extname(via).toLowerCase()] || 'application/octet-stream' });
    res.end(readFileSync(via));
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  return { porta: srv.address().port, chiudi: () => srv.close() };
}
