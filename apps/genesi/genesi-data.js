/* LA VIBRAZIONE AL RECETTORE — il secondo pezzo di Genesi che esce da
   `genesi.html`
   ══════════════════════════════════════════════════════════════════════════
   Il primo è stato `genesi-formato.js` (come Genesi SCRIVE un numero).
   Questo è come Genesi lo CALCOLA, sul numero che decide se una volata si
   può sparare: quanto farà vibrare la casa più vicina, e con quale limite di
   norma va confrontato.

   Perché queste e non altre. Il censimento (`tests/genesi-estraibili.mjs`)
   dice quali funzioni si portano fuori senza toccare l'architettura, ma non
   dice quali VALGONO. Queste stanno insieme e raccontano una storia sola,
   dall'inizio alla fine:

     il file del sismografo  →  `_sitoNormH` / `_sitoMappaColonne`
       (quale colonna è la distanza, quale la carica, quale la PPV)
     da dove viene il referto →  `_SITO_FONTI` / `_sitoFonte` / `_sitoFonteDaTesto`
     i referti diventano legge →  `sitoFit`   (minimi quadrati su ln, riga al 95°)
     la legge diventa un limite →  `NORME_PPV` / `normaPpvLab` / `ppvLimit`
     e l'aria che parte con la roccia →  `airblastDb`
     il tutto disegnato su scala log →  `_sitoTicks` / `_sitoNum`

   Nessuna di loro legge una variabile del modulo né tocca il DOM: sono
   entrate qui **identiche**, riga per riga, senza cambiare una virgola del
   comportamento. La pagina le importa; non ne tiene una seconda copia.

   ⛔ COSA È RIMASTO NELLA PAGINA, E PERCHÉ. `sitoStore`, `sitoSalva` e
   `sitoLegge` leggono e scrivono `localStorage`, che in `node` non esiste;
   `ppvSite` e `computeMIC` leggono lo stato del progetto (`D2`, `selRoccia`)
   e portarle fuori vuol dire cambiargli la firma — cioè un rifacimento, non
   un trasloco. `_sitoParseCsv` legge un CSV: quel mestiere vive già in
   `shared/` (`leggiCsv`), e riscriverlo qui sarebbe la violazione che
   `CLAUDE.md` racconta come la più costosa.

   ⚠️ `_sitoNum` non è un settimo formattatore: è la REGOLA DI QUANTI
   DECIMALI per i numeri del diagramma della legge di sito (sotto la decina
   due, sotto il centinaio uno, sopra nessuno), e li scrive chiamando `gnum`
   di `genesi-formato.js`. Una sola implementazione, un parametro diverso. */

import { gnum, gseg, gfix, gIn } from './genesi-formato.js';
/* il lettore dei numeri italiani e quello dei CSV: vivono in `shared/` perché
   servono a tutte e sei le app, e la regola di casa dice che una regola che
   serve a due app non si riscrive. `_riconParseCampo` li usava già così
   quando stava dentro `genesi.html`: sono arrivati qui con lei. */
/* ⛔ E DAL 03/08 ANCHE `csvCell` E `dataISOEsiste`, per la stessa ragione e
   dopo lo stesso errore. `csvRiconciliazione` si portava dietro dalla pagina
   una `cell` di casa — una COPIA PIÙ DEBOLE di `csvCell`, che le virgolette le
   metteva ma la formula no — e `_ricData` controllava la FORMA di una data
   invece della sua esistenza, mentre `dataISOEsiste` è in `shared/` da mesi.
   Due volte la risposta era già in casa. */
/* ⛔ E DAL 06/08 ANCHE `conta`: `_ricPlur` era la sua copia più debole — vedi
   la sua riga, più in giù. */
import { numIt, leggiCsv, csvCell, dataISOEsiste, conta } from '../../shared/deepwork-id-client/dw-shell.js';
import { scartoLivello } from '../../shared/dw-ponti.js';

/* ══════════════════════════════════════════════════════════════════════════
   G3 — LA LEGGE DI SITO K/β DAI REFERTI DEL SISMOGRAFO
   ══════════════════════════════════════════════════════════════════════════
   La vibrazione si stima con la legge di Devine  PPV = K · SD^−β , dove
   SD = distanza / √(carica per ritardo). K e β però NON sono universali:
   dipendono dal sito. La stessa carica, alla stessa distanza, fa vibrare in
   modo diverso in una cava e in quella accanto. Finché non si misura, Genesi
   li STIMA dalla litologia (`ppvSite`, nella pagina): valori da manuale,
   cautelativi, ma non "la tua roccia".
   Chi ha un sismografo ha invece i referti, e in ognuno c'è tutto il
   necessario: distanza del punto di misura, carica massima per ritardo, PPV
   registrata. Con tre o più referti si ricava la legge del proprio sito.

   Come: in scala logaritmica la legge diventa una retta
        ln(PPV) = ln K − β · ln(SD)
   quindi bastano i minimi quadrati. Il progetto però non si fa sulla media:
   sulla retta media metà delle volate finirebbe sopra. Si usa la riga al
   95° percentile (media + 1,645 × scarto dei residui), che è la prassi nella
   progettazione di conformità — ed è coerente con la stima da litologia, che
   è anch'essa un valore cautelativo e non una media.
   ══════════════════════════════════════════════════════════════════════════ */

/* Minimi quadrati su ln(PPV) = lnK − β·ln(SD).
   Torna sempre un oggetto: il campo `errore` dice perché la legge non è
   utilizzabile, così l'interfaccia può spiegarlo invece di tacere.
    · 'pochi'    meno di 3 referti: da due punti passa qualunque retta
    · 'stessaSD' tutti i referti alla stessa distanza scalata: senza escursione
                 di SD la pendenza non è determinabile (divisione per ~0)
    · 'pendenza' β fuori da 0,5–3: i dati non descrivono un'attenuazione
                 fisica (referti di siti diversi mescolati, carica sbagliata…) */
export function sitoFit(punti){
  const P=(punti||[]).filter(p=>p&&p.d>0&&p.w>0&&p.ppv>0);
  const n=P.length;
  if(n<3) return { n, errore:'pochi' };
  const x=P.map(p=>Math.log(p.d/Math.sqrt(p.w))), y=P.map(p=>Math.log(p.ppv));
  const mx=x.reduce((a,b)=>a+b,0)/n, my=y.reduce((a,b)=>a+b,0)/n;
  let sxx=0, sxy=0;
  for(let i=0;i<n;i++){ sxx+=(x[i]-mx)*(x[i]-mx); sxy+=(x[i]-mx)*(y[i]-my); }
  if(sxx<1e-6) return { n, errore:'stessaSD' };
  const b=sxy/sxx, a=my-b*mx, beta=-b;
  let ssr=0, sst=0;
  for(let i=0;i<n;i++){ const f=a+b*x[i]; ssr+=(y[i]-f)*(y[i]-f); sst+=(y[i]-my)*(y[i]-my); }
  const s = Math.sqrt(ssr/(n-2));                     // scarto dei residui in scala log
  const sd = P.map(p=>p.d/Math.sqrt(p.w));
  const out = { n, lnK:a, pend:b, s,
    K:  Math.round(Math.exp(a)),                      // riga media (50%)
    K95:Math.round(Math.exp(a+1.645*s)),              // riga di progetto (95%)
    beta:+beta.toFixed(2),
    /* ⛔ ZERO È UN VALORE, «non calcolabile» no. Quando tutte le PPV sono
       uguali `sst` è nullo e r² non esiste: scriverlo 0 vuol dire «la legge non
       spiega niente», che è un'affermazione, non un'ammissione.
       ⚠️ Onestà su quanto pesa: oggi quel caso esce SEMPRE con
       `errore: 'pendenza'` (PPV tutte uguali ⇒ β = 0, fuori da 0,5–3) e la
       modale disegna il riquadro di r² solo nel ramo senza errore — quindi
       nella pagina questo numero non si vede. È difesa in profondità, non
       innocuità: la difesa sta in un'altra riga, e la funzione adesso si
       importa. Si toglie lo strato che inventa. */
    r2: sst>1e-12 ? +(1-ssr/sst).toFixed(3) : null,
    sdMin:+Math.min.apply(null,sd).toFixed(1),
    sdMax:+Math.max.apply(null,sd).toFixed(1) };
  if(!(beta>0.5 && beta<3)) out.errore='pendenza';
  else if(n<8) out.avviso='pochi';                    // sotto gli 8 referti la legge resta provvisoria
  return out;
}

/* nome leggibile della normativa scelta per il limite PPV: serve nel report,
   e serve al file per Sentinella (che deve poter dire ACCANTO al numero quale
   limite è stato citato). Sta qui, accanto ai codici che traduce. */
export const NORME_PPV={'din-res':'DIN residenziale','din-ind':'DIN industriale','din-sens':'DIN sensibile/storico','usbm-old':'USBM intonaco','usbm-modern':'USBM cartongesso'};
export function normaPpvLab(n){ return NORME_PPV[n]||String(n==null?'':n); }
/* soglia PPV [mm/s] per normativa/edificio e frequenza dominante (soglie verificate USBM RI8507 e DIN 4150-3) */
/* ⛔ SU UNA FREQUENZA CHE NON È UN NUMERO NON SI INVENTA UNA SOGLIA.
   Fino al 01/08 questa funzione, con una frequenza illeggibile, cadeva
   nell'ultimo ramo di ogni `switch` e restituiva la fascia **più permissiva**
   di ogni norma — misurato: 50,8 invece di 12,7 (USBM vecchio), 20 invece di
   15 (DIN residenziale), e così per tutte e cinque. È il numero tranquillo
   dove non è stato misurato niente, sul valore che decide **se una volata si
   può sparare**: il posto peggiore in cui potesse capitare.
   ⚠️ **Nessuna soglia è cambiata**: le curve USBM e DIN sono bloccate senza
   conferma del fondatore, e i numeri qui sotto sono identici a prima —
   provato su 5 norme × 7 frequenze, 35 risposte uguali. Cambia solo che cosa
   succede quando la frequenza non c'è: adesso è `null`, e chi chiama lo dice
   invece di disegnare un rapporto.
   ⚠️ E la prima versione della guardia era sbagliata, l'ha bocciata il
   prototipo: `Number.isFinite(+f)` da sola lascia passare `null` e `""`,
   perché `+null` fa **zero** — che avrebbe dato 0 Hz, cioè la fascia più
   severa. Sempre un numero inventato, solo nella direzione che non spaventa. */
/* ⛔ E NEMMENO SU UNA NORMA CHE NON CONOSCIAMO. Il `default:` del `switch` è la
   DIN residenziale, e serve — è la norma di riferimento quando il codice è
   quello giusto. Ma un codice **sconosciuto** ci cadeva dentro in silenzio:
   `normaPpvLab('boh')` rispondeva onestamente «boh» e `ppvLimit('boh', 25)`
   rispondeva **15**, cioè l'etichetta e il numero raccontavano due cose diverse
   sullo stesso schermo. Chi legge «boh · 15 mm/s» crede che 15 sia la soglia
   di «boh».

   ⛔ E QUI STA IL SEGUITO, misurato il 02/08: `ppvLimit` risponde `null` per
   **due ragioni diverse**, e la scheda validatori le raccontava tutt'e due con
   la stessa frase — «la frequenza del recettore non è un numero leggibile».
   Cioè a chi apriva una volata salvata con un codice di norma non riconosciuto
   e una frequenza sana di 25 Hz, la pagina diceva di sistemare **il campo
   giusto**: mandare a correggere ciò che non è rotto è peggio che tacere,
   perché nasconde il campo vero e fa dubitare di un dato buono. È la stessa
   famiglia del ponte che dà la colpa a chi compila.
   La ragione vive QUI e non nella pagina per la regola di sempre: nella pagina
   non la prova nessuno. E `ppvLimit` la **chiama** invece di ripetere le due
   guardie, così il numero e la spiegazione non possono scostarsi — l'errore
   che il 01/08 era costato la seconda tabella delle norme.
   ⚠️ Il testo non incolla mai il codice scritto dall'utente: la pagina lo mette
   in `innerHTML`, e il nome della norma lo compone lei con `normaPpvLab`. */
export const PPV_SENZA_SOGLIA = {
  freq:  { che:'la frequenza dominante attesa non è un numero leggibile, e senza quella nessuna norma ha una fascia',
           come:'Reimposta la frequenza dominante attesa (tipicamente 10–40 Hz in cava).' },
  norma: { che:'la normativa scelta non è fra le cinque che Genesi conosce, e una soglia non si inventa',
           come:'Riscegli la normativa dall’elenco.' },
};
/* `null` quando la soglia c'è; altrimenti dice QUALE dei due campi manca — e
   se mancano tutt'e due li nomina tutt'e due, se no chi corregge il primo
   trova il secondo solo dopo, e crede di aver sbagliato di nuovo. */
export function ppvSenzaSoglia(norma,f){
  const freq  = (f === null || f === undefined || String(f).trim() === '' || !Number.isFinite(+f));
  const norm  = !Object.prototype.hasOwnProperty.call(NORME_PPV, norma);
  if(!freq && !norm) return null;
  const parti = [];
  if(freq) parti.push(PPV_SENZA_SOGLIA.freq);
  if(norm) parti.push(PPV_SENZA_SOGLIA.norma);
  return { freq, norma:norm,
    che:  parti.map(p=>p.che).join('; e '),
    come: parti.map(p=>p.come).join(' ') };
}
export function ppvLimit(norma,f){
  if (ppvSenzaSoglia(norma,f)) return null;
  const n = +f;
  switch(norma){
  case 'usbm-old': return n<40?12.7:50.8;
  case 'usbm-modern': return n<40?19:50.8;
  case 'din-ind': return n<10?20:(n<50?40:50);
  case 'din-sens': return n<10?3:(n<50?8:10);
  default: return n<10?5:(n<50?15:20); } }  // din-res

/* ══════════════════════════════════════════════════════════════════════════
   G16 · E LA TERZA ASSENZA: LA DISTANZA DEL RECETTORE
   ══════════════════════════════════════════════════════════════════════════
   ⛔ LE SOGLIE NON SI TOCCANO — QUI SI SMETTE DI INVENTARE GLI INGRESSI.
   `ppvLimit`, le curve USBM/DIN e i 133 dB(L) restano esattamente quelli che
   sono. Quello che cambia è che la distanza scalata `SD = d/√MIC` non nasce
   più da un `null` letto come zero.
   ⛔ MISURATO IL 10/08 NEL BROWSER, a ZERO clic, su una volata salvata con
   `design.recDist:null`, ed è il principio del fondatore ROVESCIATO — non un
   numero tranquillo, un'ACCUSA:
     · `null/√58` fa **0**, `Math.max(0.1, 0)` lo porta a 0,1 e la legge di
       Devine `K·SD^−β` sputa **67.627,4 mm/s** contro i 6,4 veri: la scheda
       diceva «Soglia DIN residenziale 15 mm/s @ 25 Hz → SUPERA»;
     · `Math.max(0.001, +null||0)` in `airblastDb` fa 0,001, `Math.max(1,sd3)`
       lo porta a 1 e `log10(1)` è zero: **172 dB(L)** esatti, cioè il TETTO
       della formula, «oltre il limite USBM/OSM» — contro i 127 veri;
     · e le stesse due cifre uscivano dal FOGLIO che si porta in cava e dal
       CSV che si archivia col rapportino («Esito PPV;SUPERA»), con la cella
       «Distanza recettore (m)» **vuota** accanto.
   Una distanza di ZERO METRI non è una distanza: è il recettore dentro la
   volata. Quindi la domanda è la stessa dei tre fattori di `volumeForo` —
   leggibile E positiva — e la risposta ha la forma di `ppvSenzaSoglia`:
   `null` quando c'è, altrimenti CHE COSA manca e CHE COSA si fa.
   ⚠️ Vive qui e non nella pagina per la regola di sempre: nella pagina non la
   prova nessuno, e i suoi lettori sono sette (la scheda, i KPI, il foglio, il
   CSV, il riquadro per Sentinella, il diagramma della legge di sito, il piano
   d'innesco). Il nome del campo è quello che si LEGGE sullo schermo, e sta
   già in `CAMPI_VOLATA`. */
export const PPV_SENZA_DISTANZA = {
  che:'la distanza del recettore non è un numero leggibile e positivo, e la distanza scalata parte da lì',
  come:'Reimposta la distanza del recettore, in metri.',
};
export function ppvSenzaDistanza(d){
  const x = (d === null || d === undefined || String(d).trim() === '') ? NaN : +d;
  if (Number.isFinite(x) && x > 0) return null;
  return { che: PPV_SENZA_DISTANZA.che, come: PPV_SENZA_DISTANZA.come };
}

/* ⛔ E LA SECONDA «PAROLA null STAMPATA», TROVATA CERCANDO LA PRIMA. Rimasta
   uguale in `HEAD` e scritta DUE VOLTE nella pagina — nel CSV della scheda e
   nel file che parte verso Sentinella — sempre come
   `normaPpvLab(norma)+' @ '+f+' Hz'`: con la frequenza assente le due uscite
   scrivevano «DIN residenziale @ **null** Hz». È la copia debole dove il
   documento si compone, nella sua forma tipica: la funzione giusta
   (`normaPpvLab`) esisteva già e faceva metà del lavoro, l'altra metà — la
   frequenza — se la componeva chi scriveva il file.
   Una sola funzione, quindi, e i due file non possono più scostarsi: la
   frequenza che non si legge diventa «frequenza non indicata», che in una
   cella di Excel si capisce, invece della parola `null`.
   ⚠️ La SOGLIA non c'entra e non si tocca: `ppvLimit` risponde già `null` a
   una frequenza assente e ha la sua ragione in `ppvSenzaSoglia`. Qui si
   scrive solo l'etichetta.
   ⛔ E IL 14/08 IL RESIDUO DI B0-decies, TROVATO RIVERIFICANDOLA: la frequenza
   usciva da qui **concatenata grezza**, cioè all'inglese — «DIN residenziale @
   **9.6** Hz» nel CSV che si archivia col rapportino e nel file che parte verso
   Sentinella, l'unica cifra col punto in due file tutti italiani. È la stessa
   famiglia del `+dev+` della modale della legge di sito, pagata il 07/08.
   `gnum` è il formattatore che scrive gli altri numeri di Genesi, ed era già
   importato in cima a questo file: qui non nasce niente di nuovo.
   ⚠️ DUE decimali, e il numero è dichiarato: una frequenza dominante si legge
   dal sismografo con un decimale, e con due c'è margine. Oltre i due
   l'arrotondamento torna — è un limite, non una svista, e la prova lo dice.
   ⛔ NESSUNA SOGLIA È TOCCATA: `ppvLimit` continua a decidere sul numero VERO,
   non su questa stringa. Quello che cambia è che la stringa smette di dire un
   numero diverso da quello con cui la soglia è stata scelta. */
export function normaConFrequenza(norma, f){
  const x = (f === null || f === undefined || String(f).trim() === '') ? NaN : +f;
  return normaPpvLab(norma) + (Number.isFinite(x) ? ' @ ' + gnum(x, 2) + ' Hz' : ' @ frequenza non indicata');
}

/* Sovrappressione d'aria (airblast) al recettore, in dB(L): scala cube-root
   della carica per ritardo. La formula sta QUI perché la usano in due — la
   scheda validatori e il file per Sentinella — e due copie di una formula
   prima o poi dicono due numeri diversi. STIMA, da calibrare.
   ⛔ **UNA MIC NON CALCOLABILE NON DÀ UN AIRBLAST, DÀ `null`** (09/08). Il
   `+mic||0` qui sotto trasformava l'assenza in **zero chili**, e la guardia
   `Math.max(0.1, …)` la portava a 0,1: con `micFinestra` che risponde `null`
   per un progetto senza fori, questa riga stampava **104,5 dB(L)** al posto
   dei 135,4 di una volata vera — sotto il limite USBM/OSM, cioè il verdetto
   più tranquillo che si possa dare a una cosa mai misurata. `esitoAirblast`
   sa già dire «non calcolabile» su un `null`: la strada c'era, mancava di
   arrivarci.
   ⚠️ Lo ZERO vero non è toccato: `mic` a 0 continua a passare dalla guardia
   di prima, perché uno zero misurato è un fatto. Nessuna soglia si muove —
   i 133 dB(L) USBM/OSM stanno in `esitoAirblast` e restano quelli.
   ⛔ E IL 10/08 LA STESSA FAMIGLIA SULL'ALTRO ARGOMENTO, che era rimasto
   scoperto: `Math.max(0.001, +dist||0)` di una distanza assente faceva 0,001,
   e `Math.max(1, sd3)` la portava a 1 — `log10(1)` è zero, quindi la formula
   restituiva **172 dB(L) esatti**, il suo TETTO, cioè il verdetto più grave
   che sappia dare, su una volata di cui nessuno aveva letto la distanza.
   Il verso è opposto a quello della MIC (lì il numero era tranquillo, qui è
   un'accusa) ma la causa è la stessa: un'assenza letta come un numero. La
   domanda la fa `ppvSenzaDistanza`, che è la stessa che fanno la scheda, il
   foglio e il file — una sola, così le quattro risposte non si scostano. */
export function airblastDb(dist,mic){
  const m=(mic===null||mic===undefined||mic==='')?NaN:+mic;
  if(!Number.isFinite(m)||m<0) return null;
  if(ppvSenzaDistanza(dist)) return null;
  const sd3=Math.max(0.001,+dist)/Math.cbrt(Math.max(0.1,m)); return 172-24*Math.log10(Math.max(1,sd3)); }

/* ══════════════════════════════════════════════════════════════════════════
   IL VERDETTO SULLA VIBRAZIONE — UNO SOLO, PER LO SCHERMO E PER IL FOGLIO
   ══════════════════════════════════════════════════════════════════════════
   ⛔ PERCHÉ ESISTONO QUESTE TRE FUNZIONI. Fino al 03/08 il giudizio sulla PPV
   lo prendeva la SCHEDA VALIDATORI, dentro la pagina, e il REPORT STAMPABILE
   — il foglio che si porta in cava e si archivia col rapportino — non lo
   prendeva affatto: stampava il numero e basta. Misurato premendo il bottone,
   col recettore a 60 m e la DIN sensibile:
     · schermo → «77,7 mm/s», pallino ROSSO, «Soglia 8 mm/s → SUPERA: riduci
       la MIC o allontana il recettore»;
     · foglio  → «PPV al recettore (60 m) 77,7 mm/s (limite 8,0, DIN
       sensibile/storico)», nella stessa tipografia piatta di tutte le altre
       righe, e l'AIRBLAST (143 dB(L), dieci sopra il limite USBM/OSM) non
       compariva per niente.
   Il confronto lo doveva fare il lettore. È la famiglia del «Conforme» che
   Sentinella scriveva nel file per l'ARPA mentre lo schermo diceva
   «Superamento»: il documento che esce non ripete la decisione della
   schermata, la lascia cadere.

   ⛔ E LA SECONDA META È LA PROVENIENZA. Con la legge di sito attiva su TRE
   referti — che `sitoFit` dichiara PROVVISORIA — la stessa volata stampava
   «2,8 mm/s» invece di «6,4»: il numero più che dimezzato, e il foglio
   scriveva la STESSA IDENTICA FRASE. La bandiera `pochi` il 03/08 era stata
   collegata alla scheda validatori e al riquadro «Manda a Sentinella»; il
   foglio stampato non era in quell'elenco.

   ⚠️ NESSUNA SOGLIA CAMBIA: 0,6 · 1,0 sul rapporto PPV/limite e i 133 dB(L)
   USBM/OSM sono gli stessi numeri di prima, spostati e non riscritti (le
   curve di sicurezza non si toccano senza il fondatore). Anche il confine di
   `esitoAirblast` è preservato com'era, `<128` verde e `<=133` giallo con la
   parola «sotto»: correggere quel bordo è una decisione sul limite, non un
   trasloco, e va chiesta.
   ══════════════════════════════════════════════════════════════════════════ */

/* La legge di Devine/USBM `PPV = K·SD^−β`, in un posto solo (12/09, unità
   126). Viveva scritta due volte dentro `genesi.html` — sulla scheda
   validatori e sul riquadro «Manda a Sentinella» — stesso `Math.max(0.1,…)`,
   stesso commento sul perché (`null/√MIC` dava 0,1 e la legge sputava
   67.627,4 mm/s), stessa formula: la firma troppo stretta che CLAUDE.md
   chiede di chiudere appena se ne trova una seconda copia. `sd` è la
   distanza scalata (`d/√MIC`, già `null` quando le manca un padre — vedi
   `ppvSenzaDistanza`/`micSenzaConto`); `K`/`beta` vengono da `ppvSite()`
   (referti del sismografo, o litologia). `null` propaga `null`, non 0,1:
   l'ha già insegnato il difetto che questa riga chiude. */
export function ppvDaSd(sd, K, beta){
  const s = (sd===null||sd===undefined||sd==='')?NaN:+sd;
  if(!Number.isFinite(s)) return null;
  return K*Math.pow(Math.max(0.1,s),-beta);
}

/* La PPV prevista contro la soglia di norma. `null` NON è «sotto soglia»:
   `+null` fa 0 e 0/15 darebbe la fascia più tranquilla di tutte, sul numero
   che decide se una volata si può sparare. Lo ZERO MISURATO invece resta un
   fatto, e resta verde. */
export function esitoPpv(ppv, limite){
  const p = (ppv===null||ppv===undefined||ppv==='')?NaN:+ppv;
  const l = (limite===null||limite===undefined||limite==='')?NaN:+limite;
  if(!isFinite(p) || !isFinite(l) || l<=0)
    return { confrontabile:false, rapporto:null, classe:'sv-warn', stato:'nonConfrontabile',
             verdetto:'non si può dire se è sotto soglia', consiglio:'' };
  const r = p/l;
  if(r>=1)   return { confrontabile:true, rapporto:r, classe:'sv-bad', stato:'supera',
    verdetto:'SUPERA', consiglio:'riduci la MIC (meno kg/foro o frazionamento ritardi) o allontana il recettore.' };
  if(r>=0.6) return { confrontabile:true, rapporto:r, classe:'sv-warn', stato:'vicino',
    verdetto:'sotto soglia ma vicino', consiglio:'monitora.' };
  return { confrontabile:true, rapporto:r, classe:'sv-ok', stato:'sotto',
    verdetto:'ampiamente sotto soglia', consiglio:'' };
}

/* La sovrappressione d'aria contro il limite USBM/OSM. Stessa ragione: un dB
   che non si può calcolare non è uno 0 dB, che sarebbe il silenzio. */
export const AIRBLAST_LIMITE_DB = 133;
export function esitoAirblast(db){
  const d = (db===null||db===undefined||db==='')?NaN:+db;
  if(!isFinite(d)) return { misurabile:false, classe:'sv-warn', stato:'nonCalcolabile',
    verdetto:'non calcolabile', consiglio:'' };
  if(d>AIRBLAST_LIMITE_DB) return { misurabile:true, classe:'sv-bad', stato:'oltre',
    verdetto:'oltre il limite USBM/OSM di '+AIRBLAST_LIMITE_DB+' dB(L)',
    consiglio:'borraggio corto/colletto scoperto amplifica; allunga il borraggio.' };
  return { misurabile:true, classe:(d<128?'sv-ok':'sv-warn'), stato:'sotto',
    verdetto:'sotto il limite USBM/OSM di '+AIRBLAST_LIMITE_DB+' dB(L)', consiglio:'' };
}

/* DA DOVE VENGONO K E β, e quanto pesano. Torna le decisioni (`provvisoria`,
   `fuoriIntervallo`, `referti`) perché le prendano tutte le superfici in un
   posto solo, e un `testo` già scritto per i documenti che non hanno grassetto.
   `st` è quello che risponde `ppvSite()` nella pagina: `{K,beta,fonte,fit}`.
   ⚠️ Una `fonte:'sito'` senza `fit` non inventa referti: ricade su litologia,
   che è l'unica cosa vera che si può dire di una legge che non c'è. */
export function provenienzaPpv(st, sd, roccia){
  const s = st||{};
  const capo = 'K≈'+gnum(s.K,0)+'/β≈'+gnum(s.beta,2);
  if(s.fonte!=='sito' || !s.fit)
    return { fonte:'litologia', K:s.K, beta:s.beta, referti:null, r2:null,
      provvisoria:false, fuoriIntervallo:false, sdMin:null, sdMax:null, avvisi:[],
      /* ⚠️ DUE LUNGHEZZE, E LA CORTA NON È UN VEZZO. Nel confronto A/B le
         colonne stanno in 85 px a 320: la frase lunga ci va a capo in mezzo
         alle parole («Impostazion-e», «provviso-ria»), misurato sullo scatto.
         La corta dice le stesse due cose che lì contano — da dove viene la
         legge e su quanti referti — e non è una seconda verità: esce dagli
         stessi campi. */
      breve: 'da litologia ('+String(roccia||'—')+')',
      testo: capo+' stimati da '+String(roccia||'litologia')+' (valori da manuale, cautelativi)' };
  const f = s.fit;
  const x = (sd===null||sd===undefined||sd==='')?NaN:+sd;
  const fuori = isFinite(x) && isFinite(+f.sdMin) && isFinite(+f.sdMax) && (x<f.sdMin || x>f.sdMax);
  const provvisoria = f.avviso==='pochi';
  const avvisi = [];
  if(provvisoria) avvisi.push('Legge provvisoria: sotto gli 8 referti la pendenza si muove ancora '
    +'parecchio a ogni misura nuova, quindi anche questa PPV si muoverà.');
  if(fuori) avvisi.push('Attenzione: SD '+gnum(x,1)+' è fuori dall’intervallo calibrato ('
    +gnum(f.sdMin,1)+'–'+gnum(f.sdMax,1)+'): qui la legge estrapola.');
  return { fonte:'sito', K:s.K, beta:s.beta, referti:f.n,
    r2:(f.r2===null||f.r2===undefined)?null:f.r2,
    provvisoria, fuoriIntervallo:fuori, sdMin:f.sdMin, sdMax:f.sdMax, avvisi,
    breve: 'legge di sito · '+conta(f.n,'referto','referti')+(provvisoria?' · provvisoria':'')
      +(fuori?' · estrapola':''),
    testo: capo+' ricavati dai tuoi '+gnum(f.n,0)+' referti (riga al 95° percentile, R²='+gnum(f.r2,3)+')' };
}

/* ══════════════════════════════════════════════════════════════════════════
   IL CONFRONTO A/B — «IL PROGETTO MIGLIORE», QUANDO SI PUÒ DIRE
   ══════════════════════════════════════════════════════════════════════════
   ⛔ MISURATO IL 03/08 SALVANDO DUE VOLTE LO STESSO PROGETTO. Fra i due scatti
   non è stato toccato niente: si è solo accesa la legge di sito (tre referti,
   che `sitoFit` dichiara provvisoria). Il confronto ha risposto così:
     · dieci righe su undici IDENTICHE — stessa maglia, stesso esplosivo, 12
       fori, 696 kg, PF 0,55, X50 28, X80 50, flyrock 101 m, €2.234;
     · **quattro celle dipinte di verde su quattro PAREGGI** (`A<=B` risponde
       'A' anche quando i due numeri sono lo stesso numero), sotto la didascalia
       «in verde il progetto migliore per ciascun KPI»;
     · e la PPV data VINTA a B — 2,8 contro 6,4 — cioè un cambio di
       CALIBRAZIONE raccontato come un miglioramento del PROGETTO.
   Nessuno dei due verdi corrisponde a qualcosa di misurato. È il numero
   tranquillo del principio del fondatore nella sua forma cromatica.

   ⚠️ E `(A.kpi.cost||0)` faceva vincere un costo ASSENTE, perché `||0` di un
   vuoto fa lo zero, cioè il valore più basso possibile. Lo zero VERO invece
   gioca e vince: è un fatto. Le due cose si distinguono qui dentro. */

/* Chi è meglio fra due valori in cui «più basso = meglio». `null` quando il
   confronto non si può fare O quando finisce pari: un pareggio non ha un
   vincitore, e dipingerlo di verde è un'affermazione. */
export function vincitoreKpi(a, b){
  const x=(a===null||a===undefined||a==='')?NaN:+a, y=(b===null||b===undefined||b==='')?NaN:+b;
  if(!isFinite(x)||!isFinite(y)) return null;
  if(x===y) return null;
  return x<y ? 'A' : 'B';
}
/* Due PPV previste si confrontano solo se vengono dalla STESSA legge. Una base
   non registrata (uno scatto salvato prima che questo campo esistesse) non è
   «uguale»: è «non lo so», e va detto invece di far vincere qualcuno. */
export function stessaBasePpv(a, b){
  if(!a || !b) return false;
  return a.fonte===b.fonte && a.K===b.K && a.beta===b.beta && a.referti===b.referti;
}

/* ── LA PROVENIENZA DI UN REFERTO ────────────────────────────────────────
   K e β decidono le distanze di sicurezza: chi li guarda deve poter sapere
   da dove vengono i numeri che li hanno prodotti. Quindi ogni referto porta
   scritto se è stato digitato qui, se arriva dal file di uno strumento o se
   arriva dal registro volate di Sentinella (dove la PPV è agganciata alla
   volata e alla lettura del sismografo di quel giorno).
   I referti salvati prima che questo campo esistesse restano validi e
   dichiarano «origine non registrata»: onesto, non riscritto a posteriori. */
export const _SITO_FONTI = {
  mano:       { et:'a mano',      cls:'',     lungo:'inseriti a mano in questa modale' },
  csv:        { et:'sismografo',  cls:'',     lungo:'importati dal file di uno strumento' },
  sentinella: { et:'Sentinella',  cls:'sent', lungo:'arrivati dal registro volate di Sentinella' },
};
export function _sitoFonte(p){
  return _SITO_FONTI[String((p&&p.fonte)||'')]
    || { et:'origine non registrata', cls:'ign', lungo:'senza provenienza registrata' };
}
/* la parola scritta nella colonna «origine» del file → la nostra chiave */
export function _sitoFonteDaTesto(v){
  const s=String(v==null?'':v).toLowerCase().trim();
  if(/sentinella/.test(s)) return 'sentinella';
  if(/mano|manual/.test(s)) return 'mano';
  return 'csv';
}
/* IL CSV DEI REFERTI DEL SISMOGRAFO — trasloco 12/09 (unità 121, fetta di
   mezzo di `genesi-estraibili.mjs`, quella «da 3 a 5 variabili»).
   ⛔ Il censimento la contava fra le funzioni legate allo stato del modulo
   («legge: n, t, d, g»), ed era un falso allarme: quelle lettere sono
   parametri di funzioni freccia dentro le regex della pagina
   (`/\r?\n/`, `/[;\t]|,(?=\s*[^\d\s])/`) e nomi di variabili LOCALI di altre
   funzioni della pagina dichiarate a poca indentazione — l'euristica del
   censimento le prende per «variabili del modulo» di proposito, per
   sbagliare nel verso prudente (il suo stesso commento lo dice). Letta a
   mano, la funzione non legge nessuno stato: prende `testo`, chiama
   `leggiCsv` (già condivisa) e torna righe pulite. Trasloco senza
   riscrittura, parola per parola.
   Il ripiego sulla virgola resta di casa: è stato provato a portarlo in
   `shared/` e la misura ha detto di no (nessun file cambia esito, un solo
   consumatore) — vedi il commento più lungo qui sotto. */
/* ⛔ IL TAGLIO DELLE RIGHE LO FA `leggiCsv` DI `shared/`, NON PIÙ QUESTA
   FUNZIONE DI CASA. Era la terza copia di casa del lettore di CSV, e
   misurandola contro quella condivisa su dieci file sbagliava in tre punti,
   tutti nel verso peggiore — un dato perso, non un errore dichiarato:
     · il nostro export riletto qui riportava dentro **l'apostrofo di guardia**
       che `csvCell` mette davanti a una formula, quindi il nome del referto
       cambiava a ogni giro di andata e ritorno;
     · un riferimento con un **punto e virgola dentro** («Fronte Sud; ovest»),
       pur virgolettato, veniva spezzato: da lì in poi tutte le colonne
       scalavano di uno, e la distanza finiva a leggere la carica;
     · una nota **su due righe fra virgolette** faceva sparire la prima metà
       della riga — è il difetto che in Conti faceva sparire un bonifico da
       12.300 €, e qui costava la distanza e la carica di un referto.
   ⚠️ RESTA il taglio di casa quando il file è a VIRGOLE, e non è pigrizia:
   `leggiCsv` sulla virgola non sa distinguere il separatore dal decimale
   italiano, e su «120,5,50,9,2» risponde cinque colonne plausibili invece di
   fermarsi. Misurato: con la sola `leggiCsv` quel file entrava come
   distanza 120, carica 5, PPV 50 — un numero sbagliato spacciato per certo, su
   una carica in chili. Il ripiego di casa lo rifiuta, e rifiutare è la
   risposta giusta. Il delimitatore lo dichiara `leggiCsv` stessa, così la
   scelta non è una seconda rilevazione scritta a somiglianza. */
/* ⚠️ IL RIPIEGO SULLE VIRGOLE È STATO PROVATO A PORTARE IN `shared/` E LA
   MISURA HA DETTO DI NO — scritto qui perché nessuno lo rifaccia alla cieca.
   L'idea era dare a `leggiCsv` un'opzione `virgolaDecimale`: con il separatore
   `,`, una virgola seguita da una CIFRA è un decimale e non un separatore.
   Costruita in scratchpad e misurata su quattro file:
     · «120,5,50,9,2» → una cella sola tanto di qua quanto di là, quindi la
       riga viene **scartata** in tutt'e due i casi. Ed è la cosa giusta: quel
       file è ambiguo per costruzione (cinque interi o tre decimali?), e
       accettarlo vorrebbe dire leggere la carica al posto della distanza;
     · «"Volata A, fronte est",120.5,50,9.2» → **scartata da tutt'e due**,
       perché la virgola prima del `5` di `120.5` resta ambigua comunque.
   L'unica differenza è la spazzatura intermedia: la regex di casa spezza
   DENTRO le virgolette e lascia un `"` a metà campo, la condivisa no. Nessun
   file cambia esito. Cioè il trasloco sposterebbe righe senza cambiare niente
   per l'utente, e aggiungerebbe a `shared/` un'opzione con **un solo** utente:
   la regola «una funzione che serve a due app» qui non si applica.
   ⛔ Quello che resta valido e non va toccato: il **taglio delle righe e delle
   virgolette** passa da `leggiCsv`, e solo il ripiego sulle virgole è di casa. */
export function _sitoParseCsv(testo){
  const L=leggiCsv(testo);
  const righe = (L.delim !== ',')
    ? L.righe.map(r=>r.map(c=>String(c==null?'':c).trim())).filter(r=>r.length>=3)
    : String(testo||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
        .map(s=>s.split(/[;\t]|,(?=\s*[^\d\s])/).map(c=>c.trim().replace(/^"|"$/g,'')))
        .filter(r=>r.length>=3);
  if(!righe.length) return null;
  const numerica=r=>r.filter(c=>isFinite(parseFloat(String(c).replace(',','.')))).length>=3;
  let intest=null;
  if(!numerica(righe[0])){ intest=righe[0]; righe.shift(); }
  return righe.length?{ righe, intest }:null;
}

/* intestazione normalizzata: "Distanza_m" e "DISTANZA (m)" devono valere
   uguale, altrimenti il riconoscimento delle colonne è una lotteria */
export function _sitoNormH(s){
  return String(s==null?'':s).toLowerCase().replace(/["']/g,'')
    .replace(/[_\-.()\[\]]+/g,' ').replace(/\s+/g,' ').trim();
}
/* RICONOSCIMENTO DELLE COLONNE dall'intestazione. I sismografi esportano
   formati diversi e l'utente resta l'ultima parola: qui si prepara solo la
   proposta, così un file che dichiara le colonne (il nostro export, o quello
   dei referti di Sentinella) entra senza rimappare niente a mano. Senza
   intestazione, o se non si riconoscono tutte e tre le colonne che contano,
   si torna all'ordine di prima (prima, seconda, terza colonna). */
export function _sitoMappaColonne(intest){
  const out={ d:0, w:1, p:2, rif:-1, data:-1, org:-1 };
  if(!intest||!intest.length) return out;
  const H=intest.map(_sitoNormH);
  const trova=(re,no)=>H.findIndex(h=>re.test(h)&&!(no&&no.test(h)));
  const d=trova(/distanz|dist\b/,/scalat|\bsd\b/), w=trova(/caric|\bkg\b/,/total/),
        p=trova(/ppv|vibraz|velocit|mm ?\/? ?s/,null);
  if(d>=0&&w>=0&&p>=0&&d!==w&&w!==p&&d!==p){ out.d=d; out.w=w; out.p=p; }
  out.rif=trova(/riferiment|volata|descriz|nota|evento|nome/,null);
  out.data=trova(/^data|giorno/,null);
  out.org=trova(/origine|fonte|provenienz|sorgente/,null);
  return out;
}

/* Tacche per scala logaritmica: 1-2-5 per decade quando l'intervallo è ampio,
   passo più fitto quando è stretto — altrimenti su un intervallo come 14–39
   uscirebbe una sola tacca e l'asse resterebbe muto. */
export function _sitoTicks(lo,hi){
  const mant = (hi-lo) > 1.1 ? [1,2,5] : ((hi-lo) > .55 ? [1,1.5,2,3,5,7] : [1,1.2,1.5,2,2.5,3,4,5,6,7,8,9]);
  const out=[];
  for(let e=Math.floor(lo); e<=Math.ceil(hi); e++) for(const m of mant){
    const v=m*Math.pow(10,e), l=Math.log10(v);
    if(l>=lo-1e-9 && l<=hi+1e-9) out.push(v);
  }
  return out;
}

/* quanti decimali per un numero del diagramma: sotto la decina due, sotto il
   centinaio uno, sopra nessuno. Il diagramma della legge di sito porta sulla
   stessa scala 0,12 mm/s e 1.200 m/kg^½, e due decimali fissi li renderebbero
   illeggibili tutt'e due — uno per rumore, l'altro per larghezza. */
export function _sitoNum(v){ return gnum(v, Math.abs(v)>=100?0:(Math.abs(v)>=10?1:2)); }


/* ══════════════════════════════════════════════════════════════════════════
   G-B3 — LA RICONCILIAZIONE: IL CONSUNTIVO DI CARICO CHE TORNA DA CAMPO
   ══════════════════════════════════════════════════════════════════════════
   Il terzo pezzo di Genesi uscito da `genesi.html`, e sta insieme per
   MESTIERE: è una schermata sola, e dentro c'è il giro intero del dato reale.
     il file che Campo riesporta  →  `_riconParseCampo`   (lo legge, o dice perché no)
     i chili diventano numeri     →  `_riconRiassuntoCampo` (somme e medie, niente stime)
     i numeri diventano schermo   →  `_ricKg` `_ricSegno` `_ricPct` `_ricPlur`
                                     `_ricData` `_ricColore` `riconDelta`
     e lo storico esce in CSV     →  `csvRiconciliazione`
   Perché queste e non altre: sono le funzioni che CALCOLANO UN NUMERO CHE
   L'UTENTE LEGGE (lo scostamento fra il progetto e i chili davvero caricati)
   e quella che SCRIVE UN FILE che esce dall'azienda. Sono le due categorie
   in cui un difetto costa di più.

   ⛔ SONO ENTRATE IDENTICHE, riga per riga, copiate da un programma e non a
   mano: un'estrazione non è una riscrittura, e se durante il trasloco si vede
   un difetto lo si SCRIVE e non lo si corregge nello stesso passo — se no
   nessuno sa più se la prova blinda il vecchio o il nuovo.

   ⛔ COSA È RIMASTO NELLA PAGINA, E PERCHÉ. `riconStorico`, `riconSave` e
   `riconRender` leggono `localStorage` o il DOM; `_riconCampoHtml` legge lo
   stato del progetto aperto (`_ricCampo`, `computeKPI`) e portarla fuori
   vuol dire cambiarle la firma, cioè un rifacimento. Quanto manca lo misura
   `tests/genesi-estraibili.mjs`. */

export function _rEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }


/* ═══ Il consuntivo di carico che TORNA da Campo ═══════════════════════════
   Il giro è: Genesi esporta il piano di carico in CSV → il fochino lo importa
   in Campo e registra foro per foro i chili DAVVERO caricati → Campo riesporta
   lo stesso file con la carica reale dentro → qui lo si rilegge.
   Prima questa schermata si riempiva a mano, e infatti restava vuota.

   Formato: NON è un formato nuovo, è il consuntivo che Campo già esportava —
     data;turno;foro;carica_prog_kg;carica_reale_kg;scarto_pct[;scarto_kg;squadra;operatore]
   La lettura va per NOME di colonna e non per posizione, così un file di una
   versione precedente di Campo (solo le prime sei colonne) si legge lo stesso.

   Regola di onestà: entra SOLO quello che è scritto nel file (chili reali,
   fori, chi e quando). Pezzatura, PPV e gittata non ci sono e restano vuoti:
   sono misure che solo chi era in cava può fare, e Genesi non le inventa. */

/* ⛔ QUI C'ERANO DUE FUNZIONI DI CASA, ED ERANO LA QUARTA E LA SECONDA COPIA.
   `_ricNum` riscriveva la convenzione sui numeri (l'ultimo separatore è il
   decimale) e `_ricSplit` la lettura di una riga CSV: tutt'e due vivono in
   `shared/` — `numIt` e `leggiCsv` — e la regola di casa dice che una regola
   che serve a due app **non si riscrive**, si importa.
   Misurato affiancando le due letture su sette file veri, **tre venivano letti
   diversi**, e nessuna delle tre differenze era innocua:
     · una nota su **due righe dentro le virgolette** (il caso che in Conti
       faceva sparire un bonifico da 12.300 €): la lettura di casa spezzava la
       riga e ne scartava una, `leggiCsv` la tiene intera;
     · «**1 234,5**» — le migliaia scritte con lo spazio, che i fogli di calcolo
       italiani producono — la lettura di casa la faceva diventare **1**. Non un
       errore dichiarato: **un numero sbagliato spacciato per certo**, su una
       carica in chili;
     · «12,5 kg», con l'unità appiccicata: la lettura di casa restituiva 12,5
       (è `parseFloat`, che accetta qualunque prefisso numerico — quindi anche
       «12,5 pippo»), `numIt` la **rifiuta**. È un cambio di comportamento e va
       detto: la riga non sparisce in silenzio, finisce fra le `scartate` e il
       messaggio all'utente le conta. Fra tirare a indovinare e dirlo, dice. */
// Legge il file e restituisce { righe, ... } oppure { errore } con una frase
// che dice COSA non va e cosa fare: un file sbagliato non deve mai rompere
// la pagina, deve spiegarsi.
export function _riconParseCampo(testo){
  const { righe: tutte } = leggiCsv(testo);
  if(!tutte.length) return { errore:'Il file è vuoto: non c’è nessuna riga da leggere.' };
  const testa=tutte[0].map(s=>String(s).toLowerCase());
  const haIntestazione = testa.indexOf('foro')>=0 || testa.some(c=>c.indexOf('carica')>=0);
  const dati = haIntestazione ? tutte.slice(1) : tutte;
  const col=(...nomi)=>{ for(const n of nomi){ const i=testa.indexOf(n); if(i>=0) return i; } return -1; };
  // con l'intestazione si va per nome; senza, si torna all'ordine fisso del
  // consuntivo di Campo (chi cancella la riga dei titoli non resta a piedi)
  const iData   = haIntestazione ? col('data') : 0;
  const iTurno  = haIntestazione ? col('turno') : 1;
  const iForo   = haIntestazione ? col('foro') : 2;
  const iProg   = haIntestazione ? col('carica_prog_kg','prog','carica_prog','progetto_kg') : 3;
  const iReale  = haIntestazione ? col('carica_reale_kg','reale','carica_reale') : 4;
  const iSquadra= haIntestazione ? col('squadra') : -1;
  const iOper   = haIntestazione ? col('operatore','fochino','chi') : -1;
  const iId     = haIntestazione ? col('id_foro','idforo') : 9;   // l'id stabile, in coda dal 05/09
  /* G52 (19/09, dal delta verificato di docs/RICERCA_CONTINUA_GENESI.md) —
     l'esito della detonazione, colonna nuova e ancora opzionale: senza
     intestazione non la si cerca (nessuna posizione fissa esisteva prima
     di oggi, quindi un ordine posizionale non può contenerla). Il punto
     del delta era esatto: `carica_reale_kg` da sola non distingue un foro
     caricato e sparato da uno caricato e MAI sparato — un colpo cieco, il
     caso più pericoloso, che oggi produce lo stesso scostamento vicino a
     zero di uno sparato regolarmente. */
  const iEsito  = haIntestazione ? col('esito') : -1;
  if(haIntestazione && iForo<0)
    return { errore:'Non trovo la colonna «foro»: questo non sembra il consuntivo di carico di Campo.' };
  if(haIntestazione && iReale<0)
    return { errore: iProg>=0
      ? 'Nel file c’è la carica di progetto ma non la colonna «carica_reale_kg»: questo è il PIANO di carico, non il consuntivo. In Campo, dopo aver registrato le cariche, premi «Esporta consuntivo (CSV)».'
      : 'Non trovo la colonna «carica_reale_kg»: questo non sembra il consuntivo di carico di Campo.' };
  if(!dati.length) return { errore:'Il file ha solo l’intestazione: dentro non c’è nessun foro.' };
  const righe=[]; let scartate=0;
  for(const r of dati){
    const c=r;
    const foro=numIt(c[iForo]), prog=numIt(c[iProg]);
    if(!(foro>0)||!(prog>0)){ scartate++; continue; }
    const grezzo = iReale>=0 ? String(c[iReale]==null?'':c[iReale]).trim() : '';
    const reale = grezzo === '' ? null : numIt(grezzo);
    /* «sparato»/«misfire» sono i due valori dichiarati; qualunque altra
       cosa scritta nella colonna (un refuso, un valore vecchio) non si
       spaccia per uno dei due — resta '' come una cella vuota, perché un
       valore che non capiamo non è più sicuro di uno assente. */
    const esitoGrezzo = iEsito>=0 ? String(c[iEsito]==null?'':c[iEsito]).trim().toLowerCase() : '';
    const esito = (esitoGrezzo==='sparato'||esitoGrezzo==='misfire') ? esitoGrezzo : '';
    righe.push({ foro, prog, reale: (reale!=null&&isFinite(reale)&&reale>=0)?reale:null,
      data: (iData>=0?c[iData]:'')||'', turno:(iTurno>=0?c[iTurno]:'')||'',
      squadra:(iSquadra>=0?c[iSquadra]:'')||'', operatore:(iOper>=0?c[iOper]:'')||'',
      idForo: iId>=0 ? String(c[iId]==null?'':c[iId]).trim() : '',
      esito: iEsito>=0 ? esito : null });
  }
  if(!righe.length) return { errore:'Nessuna riga leggibile: servono almeno il numero del foro e la carica di progetto in chili'
    +(scartate?' (ho scartato '+scartate+(scartate===1?' riga':' righe')+').':'.') };
  return { righe, scartate, colonneDaNome:haIntestazione, colonnaEsito: iEsito>=0 };
}

/* IL CONFRONTO FORO PER FORO (05/09) — quello che fino a oggi NON c'era:
   `_riconRiassuntoCampo` fa somme e medie sulla volata intera, e il «foro»
   del consuntivo era una posizione nella sequenza di sparo, che scivola se un
   foro si toglie. Qui ogni foro del PROGETTO aperto (`holes`, con `id` e
   `seq`) cerca la sua riga del consuntivo:
   · per ID quando tutti i fori e tutte le righe ne hanno uno (piano esportato
     e consuntivo tornato dal 05/09 in poi);
   · per NUMERO altrimenti — e lo DICHIARA (`chiave`), perché per numero un
     foro tolto accoppia ogni riga al foro sbagliato senza nessun errore.
   Un foro senza riga è «senza-riga», non «ok»; una riga senza foro nel
   progetto è orfana e si conta; una chiave doppia nel consuntivo si conta.
   `misurabile` è vero solo se almeno una riga accoppiata porta la carica
   reale — non esiste uno scostamento piccolo dove nessuno ha pesato. La
   soglia dello stato è `scartoLivello` di `shared/`, la stessa di Campo. Pura. */
/* ⏱️ 12/09 (unità 129): L'ABBINAMENTO FORO↔RIGA ERA SCRITTO DENTRO
   `confrontoPerForo`, e la nuova funzione per il rilievo di deviazione
   (`burdenVeroDaRilievo`, qui sotto) ha bisogno esattamente dello stesso
   abbinamento — per ID quando entrambe le parti ce l'hanno, per NUMERO
   (sequenza+1) altrimenti, con le chiavi doppie e le righe orfane contate.
   Prima di ricopiarlo (la regola di CLAUDE.md: «una copia nasce quasi
   sempre da una firma troppo stretta») è stato estratto qui, con due
   funzioni di lettura passate da chi chiama — perché il consuntivo di
   carica legge `idForo`/`foro` e il rilievo di deviazione legge gli stessi
   nomi ma da un oggetto con altri campi (`dx`/`dy` invece di `prog`/`reale`).
   `confrontoPerForo` sotto è stato riscritto per usarla: le sue prove
   esistenti (già in `run-kpi.mjs`, scritte per il comportamento, non per il
   testo del corpo) sono la controprova che l'estrazione non ha cambiato
   niente. */
export function abbinaForiRighe(holes, righe, leggiId, leggiNumero){
  const H = Array.isArray(holes) ? holes.filter(Boolean) : [];
  const R = Array.isArray(righe) ? righe.filter(Boolean) : [];
  const tuttiId = H.length>0 && R.length>0 && H.every(h=>h.id) && R.every(r=>leggiId(r));
  const chiave = tuttiId ? 'id' : 'numero';
  const numeroDi = (h,i) => Number.isInteger(h.seq) ? h.seq+1 : i+1;
  const chiaveRiga = (r) => chiave==='id' ? String(leggiId(r)) : String(leggiNumero(r));
  const perChiave = new Map(); const doppie = [];
  for (const r of R){ const k = chiaveRiga(r); if (perChiave.has(k)) { if (!doppie.includes(k)) doppie.push(k); } else perChiave.set(k, r); }
  const usate = new Set();
  const abbinati = H.map((h,i)=>{
    const numero = numeroDi(h,i), k = chiave==='id' ? String(h.id) : String(numero);
    const r = perChiave.get(k) || null; if (r) usate.add(k);
    return { h, numero, riga: r };
  });
  const orfane = R.filter(r => !usate.has(chiaveRiga(r)));
  return { chiave, abbinati, orfane, doppie };
}
export function confrontoPerForo(holes, righe){
  const { chiave, abbinati, orfane, doppie } = abbinaForiRighe(holes, righe, (r)=>r.idForo, (r)=>r.foro);
  const out = abbinati.map(({ h, numero, riga: r })=>{
    const prog = r && Number.isFinite(+r.prog) ? +r.prog : null;
    const reale = r && r.reale!=null && Number.isFinite(+r.reale) ? +r.reale : null;
    const scartoKg = reale!=null && prog!=null ? +(reale-prog).toFixed(3) : null;
    const scartoPct = scartoKg!=null && prog ? +(scartoKg/prog*100).toFixed(2) : null;
    const stato = !r ? 'senza-riga' : scartoLivello(reale, prog);
    return { id: h.id||null, numero, mx: h.mx, my: h.my, prog, reale, scartoKg, scartoPct, stato };
  });
  const orfaneOut = orfane.map(r => ({ idForo: r.idForo||'', foro: r.foro, prog: r.prog, reale: r.reale!=null?r.reale:null }));
  return { chiave, righe: out, senzaRiga: out.filter(x=>x.stato==='senza-riga').length,
           orfane: orfaneOut, doppie, misurabile: out.some(x=>x.reale!=null) };
}

/* ⏱️ 12/09 (unità 129), il "P1.1 residuo" di `docs/GENESI_ROADMAP_COMPETITOR.md`:
   Genesi SIMULA la deviazione dei fori (banda d'incertezza Monte-Carlo, sopra
   in `simulaPerforazione` della pagina) ma non ha mai avuto modo di leggere
   una deviazione MISURATA — il rilievo che un boretrack produce dopo la
   perforazione vera. Legge un CSV con la deviazione del PIEDE rispetto al
   progetto (`dx_m`, `dy_m`, nel piano della pianta) e la abbina ai fori con
   `abbinaForiRighe` (stesso meccanismo di `confrontoPerForo`, non
   ricopiato). Senza intestazione, l'ordine posizionale è foro;dx_m;dy_m —
   lo stesso schema del consuntivo di Campo. */
export function deviazioneForiDaCsv(testo){
  const { righe: tutte } = leggiCsv(testo);
  if (!tutte.length) return { errore: 'Il file è vuoto: non c’è nessuna riga da leggere.' };
  const testa = tutte[0].map(s => String(s).toLowerCase());
  const haIntestazione = testa.indexOf('foro') >= 0 || testa.some(c => c.indexOf('dx') >= 0 || c.indexOf('id_foro') >= 0);
  const dati = haIntestazione ? tutte.slice(1) : tutte;
  const col = (...nomi) => { for (const n of nomi) { const i = testa.indexOf(n); if (i >= 0) return i; } return -1; };
  const iForo = haIntestazione ? col('foro') : 0;
  const iId = haIntestazione ? col('id_foro', 'idforo') : -1;
  const iDx = haIntestazione ? col('dx_m', 'dx') : 1;
  const iDy = haIntestazione ? col('dy_m', 'dy') : 2;
  if (haIntestazione && iForo < 0 && iId < 0)
    return { errore: 'Non trovo la colonna «foro» né «id_foro»: questo non sembra un rilievo di deviazione fori (boretrack).' };
  if (haIntestazione && iDx < 0 && iDy < 0)
    return { errore: 'Non trovo le colonne «dx_m»/«dy_m»: questo non sembra un rilievo di deviazione fori (boretrack).' };
  if (!dati.length) return { errore: 'Il file ha solo l’intestazione: dentro non c’è nessun foro.' };
  /* ⛔ 26/11: UN FILE DI COORDINATE NON È UN FILE DI DEVIAZIONI, e senza
     intestazione questa funzione non aveva modo di accorgersene. Il Boretrak
     — la sonda di deviazione più documentata — esporta CSV SENZA riga
     d'intestazione con 5 colonne (`foro, fila, X, Y, Z`, una riga per
     stazione di misura), 8 o 9 (col progetto del foro): lo scrive il manuale
     del costruttore, con le righe d'esempio. Letto «per posizione» come
     foro;dx;dy, la FILA diventava una deviazione di 1 m e la coordinata X
     una deviazione di 1000 m — misurato sulla riga d'esempio del manuale,
     `1,1,1000.000,1000.000,1000.000`: accettato, zero righe scartate, e da
     lì un burden «vero» calcolato a un chilometro dal fronte.
     Qui non lo si LEGGE (riportare coordinate di cantiere «davanti/dietro il
     fronte» vuole l'aggancio al cantiere, decisione 32): lo si riconosce
     dalla forma e lo si rifiuta col suo nome, invece di inventare numeri. */
  if (!haIntestazione) {
    const larghezze = new Set(dati.filter(r => r.some(c => String(c == null ? '' : c).trim() !== '')).map(r => r.length));
    if (larghezze.size === 1 && [5, 8, 9].includes([...larghezze][0]))
      return { errore: 'Questo file ha ' + [...larghezze][0] + ' colonne e nessuna intestazione: ha la forma di un export di coordinate di una sonda (tipo Boretrak: foro, fila, X, Y, Z…), non di un rilievo di deviazioni. '
        + 'Genesi per ora legge tre colonne — foro; dx_m; dy_m — cioè di quanto il fondo foro si è spostato lungo il fronte e verso il fronte. Le coordinate per stazione non le legge ancora.' };
  }
  const righe = []; let scartate = 0;
  for (const r of dati) {
    const c = r;
    const foro = iForo >= 0 ? numIt(c[iForo]) : NaN;
    const idForo = iId >= 0 ? String(c[iId] == null ? '' : c[iId]).trim() : '';
    if (!(foro > 0) && !idForo) { scartate++; continue; }
    const dx = numIt(c[iDx]), dy = numIt(c[iDy]);
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) { scartate++; continue; }
    righe.push({ foro: foro > 0 ? foro : null, idForo, dx, dy });
  }
  if (!righe.length) return { errore: 'Nessuna riga leggibile: servono il numero (o l’id) del foro e le due deviazioni dx_m/dy_m'
    + (scartate ? ` (ho scartato ${scartate} ${scartate === 1 ? 'riga' : 'righe'}).` : '.') };
  return { righe, scartate, colonneDaNome: haIntestazione };
}

/* G59 (19/09) — statistica di QC sulla deviazione di perforazione, dalle
   righe già lette da `deviazioneForiDaCsv`. Segnalato dalla ricerca del
   19/09 (docs/RICERCA_CONTINUA_GENESI.md, confronto con Blastatistics di
   JKSimBlast) come mancanza REALE — verificata di persona aprendo questa
   funzione e il pannello che la mostra (genesi.html, `rilievoDevFile`):
   la pagina elenca lo scostamento foro per foro ma non ha mai un
   riepilogo (media, massimo). La ricerca stessa aveva già sbagliato
   "non c'è" tre volte su sei in questo stesso confronto — verificato
   qui con `grep -n "deviazioneStatistiche\|scartoMedio\|scarto.*massim"
   apps/genesi/` prima di scriverla: zero righe, la mancanza è vera.

   Usa DELIBERATAMENTE la distanza radiale `Math.hypot(dx,dy)`, non
   `dx`/`dy` col segno: quelli dipendono dalla convenzione di assi del
   rilievo boretrack rispetto agli assi di Genesi, che il blocco sopra
   `burdenVeroDaRilievo` dichiara ancora NON confermata su un caso reale.
   Una distanza è invariante per rotazione/riflessione degli assi — è
   sicura da mostrare anche prima che quella conferma arrivi, perché non
   inverte niente: dice solo "di quanto il foro è finito fuori posto",
   non "in quale direzione". */
export function deviazioneStatistiche(righe){
  const R = Array.isArray(righe) ? righe : [];
  if (!R.length) return null;
  const dist = R.map(r => Math.hypot(r.dx, r.dy));
  const media = dist.reduce((s, d) => s + d, 0) / dist.length;
  const massima = Math.max(...dist);
  return { n: dist.length, media: +media.toFixed(3), massima: +massima.toFixed(3) };
}

/* Il burden VERO ricalcolato sulle posizioni MISURATE (non simulate): stessa
   geometria di `simulaPerforazione` (fila per fila, la fila davanti nelle
   posizioni vere, non di progetto) ma con UNA realizzazione sola — quella
   che è successa davvero — invece di centinaia di sorteggi. Un foro senza
   riga di rilievo resta `misurato:false`: non gli si inventa una posizione,
   si dichiara che non si sa (lo stesso principio di `confrontoPerForo`). */
export function burdenVeroDaRilievo(holes, profilo, faccia, righe){
  const H = Array.isArray(holes) ? holes.filter(Boolean) : [];
  if (!H.length) return null;
  const { chiave, abbinati, orfane, doppie } = abbinaForiRighe(holes, righe, (r)=>r.idForo, (r)=>r.foro);
  const file = fileDeiFori(H);
  const pos = H.map((h, i) => {
    const r = abbinati[i] && abbinati[i].riga;
    const misurato = !!(r && Number.isFinite(+r.dx) && Number.isFinite(+r.dy));
    return { mx: h.mx + (misurato ? +r.dx : 0), my: h.my + (misurato ? +r.dy : 0), misurato };
  });
  const out = new Array(H.length);
  for (let ri = 0; ri < file.length; ri++) {
    const davanti = ri > 0
      ? file[ri-1].holes.map(i => [pos[i].mx, pos[i].my + interpProf(profilo, pos[i].mx)]).sort((a,b)=>a[0]-b[0])
      : (faccia || []);
    for (const i of file[ri].holes) {
      const h = H[i], numero = abbinati[i].numero;
      const burdenProgetto = h.burdenLoc!=null ? h.burdenLoc : null;
      if (!pos[i].misurato || davanti.length < 2) {
        out[i] = { id: h.id||null, numero, misurato: false, burdenVero: null, burdenProgetto };
        continue;
      }
      const py = pos[i].my + interpProf(profilo, pos[i].mx);
      const d = distanzaDaSpezzata(pos[i].mx, py, davanti);
      out[i] = { id: h.id||null, numero, misurato: true, burdenVero: d!=null?+d.toFixed(2):null, burdenProgetto };
    }
  }
  return { chiave, righe: out, orfane, doppie, misurabile: out.some(x=>x.misurato) };
}

/* Il numero d'ordine di un foro: la sequenza di sparo se c'è, altrimenti la
   posizione nell'array. Stessa forma già scritta in `abbinaForiRighe`
   (sopra), nell'export IREDES e nel disegno 2D — qui è la forma per la prima
   funzione NUOVA che ne ha bisogno, non un riordino delle copie esistenti. */
export function numeroForo(h, i){ return Number.isInteger(h.seq) ? h.seq+1 : i+1; }

/* ⏱️ 15/09, dal secondo giro di ricerca su Genesi: manca un pannello che
   elenchi il burden VERO di TUTTI i fori insieme — a differenza della carica
   (`confrontoPerForo`) e del rilievo boretrack (`burdenVeroDaRilievo`), che
   ce l'hanno già. Il dato non serve importarlo: `energiaSuMaglia` (sopra)
   scrive `h.burdenVero`/`h.burdenLoc` su OGNI foro a ogni rigenerazione della
   maglia, sempre, dalla ricostruzione automatica del fronte — oggi si vede
   solo un foro alla volta (l'ispettore, il disegno 2D) o aggregato (min/max
   nella riga KPI «Energia per foro»). Nessun calcolo nuovo: solo lettura e
   presentazione di un campo già scritto. Lo stato non si giudica quando manca
   uno dei due numeri (foro non ancora coperto dalla maglia, prima fila senza
   una faccia libera dietro): `misurabile:false`, niente inventato — lo stesso
   principio di `confrontoPerForo`/`burdenVeroDaRilievo`. La soglia (85%) è la
   stessa già usata nell'avviso «fronte stretto» della riga KPI, qui applicata
   foro per foro invece che sul solo minimo. */
export function burdenPerForo(holes){
  const H = Array.isArray(holes) ? holes.filter(Boolean) : [];
  return H.map((h, i) => {
    const burdenProgetto = h.burdenLoc != null ? h.burdenLoc : null;
    const burdenVero = h.burdenVero != null ? h.burdenVero : null;
    const misurabile = burdenProgetto != null && burdenVero != null;
    const scarto = misurabile ? +(burdenVero - burdenProgetto).toFixed(2) : null;
    const stato = !misurabile ? 'non-misurabile' : (burdenVero < burdenProgetto * 0.85 ? 'oltre' : 'dentro');
    return { id: h.id || null, numero: numeroForo(h, i), burdenProgetto, burdenVero, scarto, misurabile, stato };
  });
}

// Dai fori del file ai numeri della riconciliazione. Tutto qui è SOMMA o
// MEDIA di quello che c'è nel file: niente stime, niente riempimenti.
export function _riconRiassuntoCampo(p, nomeFile){
  const reg=p.righe.filter(r=>r.reale!=null);
  const somma=(a,f)=>a.reduce((t,x)=>t+f(x),0);
  const uniche=(f)=>[...new Set(p.righe.map(f).map(s=>String(s||'').trim()).filter(Boolean))];
  const kgProgTot=somma(p.righe,r=>r.prog);
  const kgProgReg=somma(reg,r=>r.prog);
  const kgReale=somma(reg,r=>r.reale);
  /* ⛔ SE NESSUN FORO HA LA CARICA REALE NON C'È UNO SCOSTAMENTO PICCOLO: NON
     C'È UNO SCOSTAMENTO. È il caso del piano appena importato in Campo e non
     ancora caricato, e fino al 03/08 qui uscivano quattro zeri — che la pagina
     disegnava «+0 kg (+0%)» in VERDE (rgb(102,187,106), misurato nel browser):
     il numero tranquillo dove non è stato misurato niente, cioè esattamente
     ciò che il principio del fondatore vieta. Che l'avviso sotto dicesse «nel
     file nessun foro ha la carica reale» è difesa in profondità, non
     innocuità: il numero e il colore dicevano il contrario.
     La forma giusta ce l'aveva già `peggio`, due righe più in giù: `null`.
     La bandiera `misurabile` sta accanto ai numeri perché chi disegna non
     debba dedurre il «non lo so» da un `null` (la legge `_riconCampoHtml`, che
     su di lei sceglie fra il valore e il trattino con la ragione). */
  const misurabile=reg.length>0;
  const scostKg=misurabile?+(kgReale-kgProgReg).toFixed(3):null;
  const scostPct=misurabile&&kgProgReg?+(scostKg/kgProgReg*100).toFixed(2):null;
  const medioKg=misurabile?+(somma(reg,r=>Math.abs(r.reale-r.prog))/reg.length).toFixed(3):null;
  const medioPct=misurabile?+(somma(reg,r=>Math.abs(r.reale-r.prog)/(r.prog||1))/reg.length*100).toFixed(2):null;
  const peggio=reg.slice().sort((a,b)=>Math.abs(b.reale-b.prog)-Math.abs(a.reale-a.prog))[0]||null;
  /* G52 — l'esito della detonazione non è come i sei numeri sopra: quelli
     rispondono `null` quando manca la MISURA (nessuna carica reale), questo
     risponde `null` quando manca la COLONNA (un consuntivo di prima di
     oggi, o scritto da una Campo che non la esporta ancora). I due «non lo
     so» sono diversi apposta: un file senza la colonna non deve dire «zero
     misfire», che si legge come «tutto sparato regolarmente» — esattamente
     il principio del fondatore, applicato al dato più pericoloso di questa
     schermata invece che a un chilo. */
  const misfire = p.colonnaEsito ? p.righe.filter(r=>r.esito==='misfire') : null;
  return { file:nomeFile||'', scartate:p.scartate||0,
    date:uniche(r=>r.data), turni:uniche(r=>r.turno),
    chi:uniche(r=>r.operatore), squadre:uniche(r=>r.squadra),
    foriTot:p.righe.length, foriReg:reg.length, misurabile,
    colonnaEsito: !!p.colonnaEsito,
    nMisfire: misfire ? misfire.length : null,
    foriMisfire: misfire ? misfire.map(r=>r.idForo || ('foro '+r.foro)) : [],
    /* ⛔ E DUE DEI SEI NUMERI ERANO RIMASTI ZERO, per tre anni buoni di lettori.
       Il 03/08 questa funzione ha imparato a rispondere `null` sui quattro
       scostamenti; `kgReale` e `kgProgReg` no, perché sullo SCHERMO la loro
       riga è già protetta da `misurabile` (`_riconCampoHtml`, «— · nessuna
       carica reale»). Ma la bandiera in quel punto è in ambito, e negli altri
       due posti che leggono questi numeri non ci arriva: misurato il 13/08 su
       un consuntivo appena esportato da Campo e non ancora caricato (12 fori,
       720 kg di progetto, colonna della carica reale vuota) la riga di storico
       scriveva «da Campo: **0 kg caricati** su 0/12 fori» — e resta lì per
       sempre — e il CSV che esce dall'azienda «campo_kg_reali;**0**;
       campo_kg_progetto;**0**», dove il progetto di quei fori è 720.
       È il numero tranquillo del principio del fondatore, nel file archiviato.
       Adesso i sei numeri rispondono allo stesso modo, e la protezione non
       dipende più da chi legge.
       ⚠️ `kgProgTot` NON diventa `null`: è la somma del progetto su TUTTE le
       righe del file, ed è un fatto anche quando nessuno ha ancora caricato. */
    kgProgTot:+kgProgTot.toFixed(3),
    kgProgReg:misurabile?+kgProgReg.toFixed(3):null, kgReale:misurabile?+kgReale.toFixed(3):null,
    scostKg, scostPct,
    medioKg, medioPct,
    peggio: peggio?{ foro:peggio.foro, prog:peggio.prog, reale:peggio.reale,
                     diff:+(peggio.reale-peggio.prog).toFixed(3) }:null };
}

/* ⛔ LA STESSA DOMANDA PER I DUE POSTI CHE RILEGGONO UN CONSUNTIVO SALVATO —
   la riga di storico e il CSV che esce dall'azienda — e scritta UNA volta,
   perché scriverla due è il modo in cui questa famiglia nasce.
   ⚠️ E si guarda il VALORE prima della bandiera, non il contrario: una
   riconciliazione salvata prima del 13/08 porta `kgReale:0` e nessun
   `misurabile`, e leggere una bandiera assente come «falsa» accuserebbe di
   non-misurabilità un consuntivo sanissimo (è la trappola già scritta accanto
   a `_cmpNum`, per gli scatti A/B senza base registrata). Il ripiego è
   `foriReg`, che i record vecchi hanno sempre avuto ed è la definizione
   stessa di `misurabile` un piano più su (`reg.length>0`) — non una seconda
   regola, la stessa domanda fatta al dato che c'è. */
export function campoMisurato(c){
  if(!c) return false;
  if(typeof c.misurabile === 'boolean') return c.misurabile;
  const n = +c.foriReg;
  return Number.isFinite(n) && n > 0;
}

// numeri scritti come si scrivono in Italia (virgola decimale) ovunque, anche
// nelle percentuali: dentro la stessa riga «-81,7 kg (-28.2%)» si leggerebbe
// come due unità di misura diverse
export const _ricKg=(v)=>gnum(v,1);
export const _ricSegno=(v)=>gseg(v,1);
/* ⚠️ IL «%» SI SCRIVE SOLO SE C'È UN NUMERO DAVANTI. `gseg` su un dato che non
   c'è risponde «—», e attaccargli il simbolo dava «—%», che si legge come una
   percentuale rotta invece che come «non lo so». */
export const _ricPct=(v)=>{ const s=gseg(v,1); return s==='—'?s:s+'%'; };
/* ⛔ QUI C'ERA LA COPIA PIÙ DEBOLE DI `conta` DI `shared/`, e si è vista il
   06/08 cercando i «1 fori» di Genesi: `n+' '+(n===1?uno:tanti)`. Funziona sui
   dati buoni — che è la ragione per cui nessuno se n'era accorto — e sbaglia
   nei due casi che `conta` esiste per prendere:
     · su «1» arrivato come STRINGA (una cella di CSV, un campo di testo) il
       confronto stretto risponde **«1 fori»**, cioè proprio il difetto;
     · su `null` scrive **«null fori»**, la parola che l'utente non deve
       leggere mai — `conta` scrive «—», la convenzione dell'ecosistema.
   La regola di casa dice che una regola che serve a due app non si riscrive:
   `plurale`/`conta` stanno in `shared/deepwork-id-client/dw-shell.js`. Questo
   è un ALIAS, non una seconda implementazione — il nome resta quello con cui
   la pagina l'ha sempre chiamata, e la prova pretende l'IDENTITÀ
   (`_ricPlur === conta`), non il comportamento: due copie uguali oggi
   divergono domani senza che nessuno lo veda. */
export const _ricPlur = conta;
// le date arrivano dal file in ISO (2026-07-29): in cava si legge 29/07/2026.
// Se non è una data ISO si lascia com'è: è testo di un file, non lo si indovina.
/* ⛔ E «È UNA DATA ISO» NON È LA SUA FORMA. Fino al 03/08 qui c'era una regex
   sui gruppi di cifre, e `2026-02-30` usciva riscritto «30/02/2026»: una data
   che non esiste, resa indistinguibile da una vera — e da lì finiva anche nel
   nome proposto per la riconciliazione, cioè nello storico e nel CSV.
   `dataISOEsiste` di `shared/` la costruisce e pretende che torni la stessa;
   qui non se ne scrive una seconda. La lunghezza si controlla lo stesso, e non
   è un doppione: `dataISOEsiste` guarda i primi dieci caratteri (accetta un
   ISTANTE, «2026-06-30T10:00»), e un istante riscritto come data sola
   perderebbe l'ora in silenzio. */
export const _ricData=(s)=>{ const t=String(s==null?'':s).trim();
  return t.length===10&&dataISOEsiste(t) ? t.slice(8,10)+'/'+t.slice(5,7)+'/'+t.slice(0,4) : t; };
/* ⛔ E UN VUOTO NON È UNO SCOSTAMENTO NULLO. `Math.abs(null)` fa 0, quindi un
   «non misurabile» usciva VERDE — mentre `undefined`, che è l'altro modo di
   dire la stessa cosa, usciva ROSSO: due vuoti, due colori, nessuno dei due
   giusto. Adesso quando non c'è una percentuale il colore è quello del testo
   spento, che nel resto della schermata vuol dire «non lo so». */
export const _ricColore=(pct)=>{
  if(pct===null||pct===undefined||pct==='') return 'var(--mut)';
  const a=Math.abs(+pct);
  if(!isFinite(a)) return 'var(--mut)';
  return a<10?'#66bb6a':(a<25?'#ffca28':'#ef5350'); };

export function riconDelta(prev, real, unit){
  /* `real` arriva grezzo dal campo, scritto a mano da chi ha misurato: la
     virgola vale quanto il punto. Con `+real` un «27,5» diventava NaN e la
     riga mostrava un trattino come se la misura non ci fosse. */
  const r = gIn(real);
  if(!isFinite(r)) return '<span style="color:var(--mut)">—</span>';
  /* ⛔ E IL PREVISTO SI GUARDA PRIMA DI DIVIDERCI SOPRA. Fino al 03/08:
       · previsto **assente** → `r - null` fa `r`, e usciva «+5 cm (+0%)» in
         verde, cioè uno scarto inventato contro una previsione che non c'era;
       · previsto **0** → la percentuale non è calcolabile, e veniva scritta
         **0**: che qui è la fascia più tranquilla di tutte (verde sotto il
         15%). Non è un caso di laboratorio — la PPV prevista è arrotondata al
         decimo, e con il recettore a 3.000 m esce «0,0 mm/s» da sola.
     Adesso: senza previsto non si scrive nemmeno lo scarto in unità (sarebbe
     un confronto con niente); col previsto a zero lo scarto in unità si
     scrive — è un fatto misurato — e al posto della percentuale c'è il motivo
     per cui non c'è, col colore spento perché non c'è niente da giudicare. */
  const p = (prev===null||prev===undefined||prev==='')?NaN:+prev;
  if(!isFinite(p)) return '<span style="color:var(--mut)">—</span>';
  const d=r-p;
  if(p===0) return '<span style="color:var(--mut);font-weight:600">'
    +gseg(d,1)+' '+unit+' (% non calcolabile)</span>';
  const pct=Math.round(100*d/p), ad=Math.abs(pct);
  const col=ad<15?'#66bb6a':(ad<35?'#ffca28':'#ef5350');
  return '<span style="color:'+col+';font-weight:600">'+gseg(d,1)+' '+unit+' ('+gseg(pct,0)+'%)</span>';
}

/* IL FILE CHE ESCE DALL'AZIENDA — lo storico delle riconciliazioni in CSV.
   ⛔ Queste righe erano il corpo di un `onclick` anonimo dentro la pagina:
   codice che scrive un file che l'utente manda fuori, e che NESSUNA prova
   poteva chiamare, perché non aveva un nome. Sono le stesse righe, con
   intorno una funzione: la pagina adesso la chiama e scarica quello che
   torna. Il separatore è il PUNTO E VIRGOLA e i numeri restano col punto —
   è un file di scambio, non un numero da leggere (vedi `genesi-formato.js`). */
export function csvRiconciliazione(st){
  // le colonne del carico reale si AGGIUNGONO in fondo: chi rilegge un export
  // vecchio (dieci colonne) continua a trovarle nello stesso ordine
  const H=['data','nome','x50_prev_cm','x50_reale_cm','ppv_prev_mms','ppv_reale_mms','flyrock_prev_m','flyrock_reale_m','oversize_reale_pct','note',
           'campo_data','campo_turno','campo_chi','campo_fori_registrati','campo_fori_totali','campo_kg_reali','campo_kg_progetto','campo_scostamento_pct',
           /* ⛔ `ppv_prev_mms` DA SOLA NON SI SA LEGGERE, e questo file esce
              dall'azienda. Lo stesso progetto, con la legge di sito accesa su
              tre referti, scrive 2.8 dove prima scriveva 6.4: senza dire su
              che cosa è tarata la previsione, le due righe sono confrontabili
              solo per sbaglio. La frase corta la compone già `provenienzaPpv`
              (`breve`), che è la stessa che decide il numero — così il file e
              lo schermo non possono scostarsi.
              La colonna si AGGIUNGE IN FONDO, come le otto di Campo: chi
              rilegge un export vecchio trova le altre nello stesso ordine. */
           'ppv_prev_base',
           /* G52 — vuota quando il consuntivo non porta la colonna «esito»
              (non lo sappiamo), non zero: la stessa distinzione già scritta
              sopra per `campo_kg_reali`/`campo_kg_progetto`, applicata al
              dato più pericoloso invece che a un chilo. Ultima colonna, come
              tutte le altre aggiunte qui: un export vecchio resta leggibile
              con le colonne precedenti nello stesso ordine. */
           'campo_misfire'];
  /* ⛔ QUI C'ERA UNA `cell` DI CASA, ED ERA UNA COPIA PIÙ DEBOLE DI `csvCell`.
     Metteva le virgolette su `; " \n` e basta: quindi `@SUM(1+1)` scritto nel
     nome di una volata usciva **nudo** — e questo è il file che l'azienda
     manda fuori, che si apre in Excel a casa del cliente — e un `\r` in una
     cella non veniva protetto, cioè sfondava la riga. `csvCell` fa tutt'e due
     le cose ed è la METÀ di una coppia: `leggiCsv` toglie l'apostrofo che lei
     mette, quindi il giro di andata e ritorno resta chiuso. La regola di casa
     dice che una regola che serve a due app non si riscrive: era riscritta. */
  const csv=H.join(';')+'\n'+st.map(r=>{ const c=r.campo||null;
    /* ⛔ E LE DUE COLONNE DEI CHILI PASSANO DA `campoMisurato`, non dal `c?`:
       un consuntivo importato e non ancora caricato dava `campo_kg_reali;0` e
       `campo_kg_progetto;0` in un file che si archivia col rapportino e si
       apre in Excel a casa del cliente, mentre lo schermo, per lo stesso
       consuntivo, scriveva «—». La cella vuota è la stessa che il file usa già
       per lo scostamento nella riga accanto. */
    const cm=campoMisurato(c);
    return [r.ts,r.nome,r.prev.x50,r.real.x50,r.prev.ppv,r.real.ppv,r.prev.fly,r.real.fly,r.real.ovs,r.real.note,
      c?(c.date||[]).join(' '):'', c?(c.turni||[]).join(' '):'', c?(c.chi||[]).join(' '):'',
      c?c.foriReg:'', c?c.foriTot:'', cm?c.kgReale:'', cm?c.kgProgReg:'', c?c.scostPct:'',
      /* una riconciliazione salvata prima che questa colonna esistesse resta
         VALIDA e lascia la cella vuota: non le si attribuisce una base che
         nessuno aveva registrato (è la stessa scelta di `_sitoFonte`). */
      (r.prev&&r.prev.ppvBase&&r.prev.ppvBase.breve)||'',
      // G52 — vuota se la riconciliazione è di prima di questa colonna, o il
      // consuntivo non tracciava l'esito: non «zero misfire», «non lo so».
      (c&&c.colonnaEsito)?c.nMisfire:''].map(csvCell).join(';');
  }).join('\n')+'\n';
  return csv;
}

/* ══════════════════════════════════════════════════════════════════════════
   G7 — IL CASO RIPETIBILE, E IL RIASSUNTO DEL CAMPIONE
   ══════════════════════════════════════════════════════════════════════════
   Il quarto pezzo di Genesi che esce da `genesi.html`, e sta insieme per un
   motivo solo: sono le funzioni che producono numeri **a caso** e quelle che
   li riassumono. In un'app che simula, il caso non è un dettaglio grafico —
   è la parte che dice **di quanto la previsione può sbagliare**, e deve
   essere RIPETIBILE: stessa volata, stessa banda; stesso seme, stesso fronte
   disegnato. Un numero che balla a ogni ridisegno non è una misura.

     il replay identico del 3D      →  `mulberry32`  (seme fisso `SEED`)
     la parete che non sembra
     fatta di riquadri              →  `vnoise3`     (value-noise continuo)
     la banda d'incertezza          →  `_rngDa`      (seme dalla geometria)
     la deviazione del foro         →  `_gauss`      (Box–Muller sul generatore)
     i percentili 5 · 50 · 95       →  `_perc`

   Nessuna di loro legge una variabile del modulo né tocca il DOM: sono
   entrate qui **identiche**, riga per riga, senza cambiare una virgola del
   comportamento. La pagina le importa; non ne tiene una seconda copia.

   ⚠️ `vnoise3` il censimento (`tests/genesi-estraibili.mjs`) NON la elencava
   fra le estraibili: conta `L` come variabile del modulo, perché sta in una
   dichiarazione multipla (`const sx=…, sy=…, sz=…, L=(a,b,t)=>…`) e il
   rilevatore prende solo il PRIMO nome di un `const`. È l'euristica che
   sbaglia nel verso prudente, dichiarata nella sua intestazione. Letta, la
   funzione è pura: solo `Math` e nomi suoi.

   ⛔ COSA RESTA NELLA PAGINA, E PERCHÉ. `jitterGeo` e `worldJitter` chiamano
   questi due generatori ma scrivono dentro una geometria `THREE`, che in
   `node` non esiste; `simulaPerforazione` legge lo stato del progetto (`D2`)
   e portarla fuori vuol dire cambiarle la firma, cioè un rifacimento.

   ⚠️ E DUE COMPORTAMENTI CHE SEMBRANO BUCHI E SONO GUARDIE, provati sotto
   perché nessuno li «aggiusti» leggendoli di sfuggita:
    · `_rngDa(0)` e `_rngDa(1)` danno la STESSA sequenza — il `||1` rifiuta
      il seme zero, che in un generatore lineare congruente si impianta;
    · `_gauss` alza `u` a `1e-9` prima del logaritmo: senza quel gradino un
      generatore che restituisce esattamente 0 darebbe `Infinity`, cioè un
      foro spostato a distanza infinita.
   ══════════════════════════════════════════════════════════════════════════ */

/* ============ RNG deterministico (replay identici) ============ */
export function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
/* rumore continuo NEL MONDO: pannelli adiacenti si deformano allo stesso modo sui bordi → niente "riquadri disegnati", il fronte è una parete unica */
export function vnoise3(x,y,z){
  const h=(ix,iy,iz)=>{ let n=ix*374761393 + iy*668265263 + iz*1274126177; n=(n^(n>>13))*1103515245; return (((n^(n>>16))>>>0)%1024)/1024; };
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z), fx=x-ix,fy=y-iy,fz=z-iz;
  const sx=fx*fx*(3-2*fx), sy=fy*fy*(3-2*fy), sz=fz*fz*(3-2*fz), L=(a,b,t)=>a+(b-a)*t;
  return L( L(L(h(ix,iy,iz),h(ix+1,iy,iz),sx), L(h(ix,iy+1,iz),h(ix+1,iy+1,iz),sx), sy),
            L(L(h(ix,iy,iz+1),h(ix+1,iy,iz+1),sx), L(h(ix,iy+1,iz+1),h(ix+1,iy+1,iz+1),sx), sy), sz );
}
export function _rngDa(seme){
  let s=(seme>>>0)||1;
  return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
}
export function _gauss(r){ const u=Math.max(1e-9,r()), v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
export function _perc(v,p){ if(!v.length) return null; const a=v.slice().sort((x,y)=>x-y); const i=Math.min(a.length-1,Math.max(0,Math.round(p*(a.length-1)))); return a[i]; }

/* ══════════════════════════════════════════════════════════════════════════
   G8 — IL PIANO DI INNESCO CHE VA FUORI DI CASA
   ══════════════════════════════════════════════════════════════════════════
   `genesi_piano_innesco.xml` è l'unica uscita di Genesi che NON è per noi: la
   leggono i software dei detonatori elettronici e delle perforatrici (schema
   in stile IREDES, dichiarato non certificato nel file stesso). Ed era il
   corpo di un `onclick` anonimo dentro la pagina — la stessa forma che aveva
   `csvRiconciliazione` prima del 03/08: codice che scrive un file che esce
   dall'azienda e che NESSUNA prova poteva chiamare, perché non aveva un nome.
   ⛔ Misurato il 07/08 col censimento per EFFETTO: dei nove bottoni che
   salvano un file, questo era l'unico che NESSUN banco premeva — né in export
   né in import. Le righe sono arrivate qui parola per parola, e la prova che
   non è cambiata una virgola è che la funzione riproduce **byte per byte**
   l'XML che la pagina scriveva prima (confronto fatto sul file vero, uscito
   dal bottone premuto nel browser).

   ⚠️ PERCHÉ NON USA `_rEsc`, che sta dodici righe più su e fa lo stesso
   lavoro: `_rEsc` scrive l'apostrofo come `&#39;`, qui esce `&apos;`. Le due
   forme sono equivalenti per qualunque lettore XML, ma questo è un file di
   scambio e i suoi byte non si cambiano per fare pulizia: unificarle è una
   decisione, non un riordino, e va chiesta. Finché non lo è, la ragione sta
   scritta qui invece che in nessun posto.
   ══════════════════════════════════════════════════════════════════════════ */
/* ⛔ 27/11 — IL NOSTRO XML LETTO DA UN ALTRO PARSER (quello severo della
   libreria standard di Python, `tests/campioni/xml-nostro/`). Un nome con un
   CARATTERE DI CONTROLLO dentro (arriva da un file importato, non da una
   tastiera) rendeva l'intero piano «non ben formato»: l'XML 1.0 quei
   caratteri non li ammette nemmeno scritti come entità, e un parser vero si
   ferma alla prima riga che ne contiene uno — il file che programma i
   detonatori non si apriva affatto. Escono come uno spazio. E mezzo carattere
   (un surrogato rimasto solo) esce come il segnaposto U+FFFD: nel browser
   faceva crollare l'esportazione prima ancora di scrivere il file.
   ⛔ NEUTRALITÀ: ogni altro nome esce byte per byte com'era. */
function _xmlEsc(s){ return String(s==null?'':s)
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,' ')
  .replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g,'\ufffd')
  .replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }

export function xmlPianoInnesco(p){
  const e=_xmlEsc, inn=(p&&p.innesco)||{};
  const micV=(p&&p.mic!==null&&p.mic!==undefined&&p.mic!=='')?+p.mic:NaN;
  const micOk=Number.isFinite(micV)&&micV>=0;
  /* ⛔ E DAL 13/08 LA STESSA REGOLA VALE PER GLI ALTRI SEI NUMERI DEL FILE.
     La MIC era stata messa in salvo il 09/08 con la frase giusta scritta sopra
     — «un `null` che diventa `0` in un file che esce è peggio del difetto di
     partenza» — e tre righe più giù `<Charge unit="kg">` scriveva **`0`** per
     la stessa ragione, `+null||0`. Misurato il 13/08 con la carica per foro
     illeggibile: il file dichiarava `MaxInstantCharge status="non-calcolabile"`
     e sotto, per ogni foro, `Depth 0 · Charge 0 · Stemming 0`, con la maglia a
     `0.00 × 0.00` e il diametro a `0`. Cioè un documento che si contraddice da
     solo, letto dal software che programma i detonatori e dalla perforatrice:
     dodici fori profondi zero metri, caricati con zero chili.
     ⚠️ E il giro di andata e ritorno lo faceva PEGGIO che leggerlo: il lettore
     di questa stessa pagina fa `if(charge!=null){ D2.kg=Math.max(5,…) }`, e
     `parseFloat("0")` è **0**, cioè un numero — quindi riaprendo il piano
     tornavano **5 kg per foro, 6 m di profondità e 0,5 m di borraggio**, tre
     valori inventati che nessuno aveva scritto e nessun avviso dichiarava. Con
     l'elemento VUOTO il ripiego non scatta (`parseFloat('')` è `NaN`), e chi
     rilegge si tiene quello che ha: il giro si chiude senza toccare il lettore.
     ⚠️ Uno zero SCRITTO resta uno zero, come per la MIC: la domanda è
     `Number.isFinite`, non il falsy — se no un dato vero verrebbe dichiarato
     mancante. */
  const _num=(x)=>{ const v=(x===null||x===undefined||x==='')?NaN:+x; return Number.isFinite(v)?v:null; };
  const _tag=(nome,unit,x,dec)=>{ const v=_num(x);
    return v===null
      ? '<'+nome+' unit="'+unit+'" status="non-calcolabile"/>'
      : '<'+nome+' unit="'+unit+'">'+e(dec==null?v:v.toFixed(dec))+'</'+nome+'>'; };
  const _mancanti=['B','S','diam','prof','kg','stem'].filter(k=>_num(p&&p[k])===null);
  let xml='<?xml version="1.0" encoding="UTF-8"?>\n';
  xml+='<!-- Genesi: bozza di interscambio in stile IREDES (non conformità certificata) -->\n';
  if(!micOk) xml+='<!-- ATTENZIONE: la carica massima per ritardo (MIC) NON e\' calcolabile su questo '
    +'progetto, e per questo MaxInstantCharge esce senza valore invece che a zero. '
    +'Non usare questo piano per programmare i detonatori finche\' la MIC non c\'e\'. -->\n';
  if(_mancanti.length) xml+='<!-- ATTENZIONE: '+_mancanti.length+' valori del progetto NON sono leggibili '
    +'(status="non-calcolabile"): escono senza valore invece che a zero. '
    +'Non usare questo piano per programmare i detonatori ne\' per perforare. -->\n';
  xml+='<BlastPlan xmlns="urn:genesi:blastplan:draft" generator="Genesi" schema="IREDES-like/0.1">\n';
  xml+='  <PlanData>\n';
  xml+='    '+_tag('MeshBurden','m',p.B,2)+'\n';
  xml+='    '+_tag('MeshSpacing','m',p.S,2)+'\n';
  xml+='    '+_tag('HoleDiameter','mm',p.diam)+'\n';
  /* L'INCLINAZIONE DEI FORI (26/11): gradi dalla verticale, verso la faccia.
     Fino al 26/11 il piano non la portava affatto: chi perforava da questo
     file non sapeva se i fori erano verticali o a 20°, e riaprendolo restava
     l'inclinazione che il progetto aveva per caso. Sta accanto al diametro.
     ⛔ Un chiamante che NON la dichiara non la vede inventata a zero: la riga
     non esce (è il piano di ieri) — tranne quando qualche foro ne ha una SUA:
     lì chi rilegge deve sapere da che cosa quel foro si scosta, e se non si
     sa lo si dice («non-calcolabile»). */
  const _inclNota=_num(p&&p.incl)!==null, _inclDeiFori=contaValoriPropri((p&&p.fori)||[]).incl>0;
  if(_inclNota || _inclDeiFori) xml+='    '+_tag('HoleInclination','deg',p.incl)+'\n';
  xml+='    <Explosive>'+e(p.esplosivo)+'</Explosive>\n';
  xml+='    <Initiation id="'+e(inn.id)+'">'+e(inn.nome)+'</Initiation>\n';
  xml+='    <Sequence>'+e(p.sequenza||'diagonale')+'</Sequence>\n';
  xml+='    <HoleDelay unit="ms">'+e(+p.ritardo||0)+'</HoleDelay>\n';
  xml+='    <RowDelay unit="ms">'+e(+p.ritardoFila||0)+'</RowDelay>\n';
  xml+='    <LastDetonation unit="ms">'+e((+p.lastDet||0).toFixed(1))+'</LastDetonation>\n';
  /* ⛔ QUESTO FILE LO LEGGE IL SOFTWARE CHE PROGRAMMA I DETONATORI, e fino al
     09/08 una MIC non calcolabile ci finiva dentro come **`0.0`**: `+null||0`
     fa zero, e zero chili per ritardo è la volata più innocua che esista. È
     alla lettera «un `null` che diventa `0` in un file che esce è peggio del
     difetto di partenza».
     La forma scelta è quella che un lettore automatico non può credere: niente
     testo da leggere come numero (l'elemento è **vuoto**, `parseFloat('')` fa
     `NaN`, non 0) e uno `status` che lo dice a parole. Il tag resta lo stesso —
     toglierlo renderebbe il file indistinguibile da uno vecchio, e «non c'è»
     e «non si può calcolare» sono due cose diverse.
     ⚠️ La spiegazione va PRIMA di `<PlanData>`: un commento lì dentro
     sarebbe un nodo estraneo, e la prova che sorveglia questo blocco lo
     direbbe (giustamente). */
  xml+=micOk
    ? '    <MaxInstantCharge unit="kg" window_ms="8">'+e(micV.toFixed(1))+'</MaxInstantCharge>\n'
    : '    <MaxInstantCharge unit="kg" window_ms="8" status="non-calcolabile"/>\n';
  /* F5 (26/11) — IL FILE DICE LA CARICA DI OGNI FORO, NON QUELLA DEL PROGETTO
     RIPETUTA. Misurato il 26/11: dato a un foro 0 kg (lasciato scarico), 8,5 m
     e 1,5 m di borraggio, il suo <Hole> usciva con 58 kg, 10 m e 2,2 m — i
     valori del progetto, identici per tutti. È il file che legge chi programma
     i detonatori e chi perfora: un foro scarico dichiarato carico.
     Adesso ogni <Hole> porta i valori che VALGONO per lui (`valoreDiForo`), e
     quando almeno un foro ne ha di suoi il file dichiara anche quelli del
     PROGETTO (DesignDepth / DesignCharge / DesignStemming): chi rilegge deve
     poter distinguere «questo foro è diverso» da «la volata è tutta così», e
     senza i tre Design il lettore di casa prendeva per progetto i valori del
     PRIMO foro — che può essere proprio quello diverso.
     ⛔ NEUTRALITÀ: senza valori per foro non compare niente di nuovo, e il
     file esce byte per byte com'era (provato). */
  const _nPropriXml=contaValoriPropri((p&&p.fori)||[]).fori;
  if(_nPropriXml){
    xml+='    '+_tag('DesignDepth','m',p.prof)+'\n';
    xml+='    '+_tag('DesignCharge','kg',p.kg)+'\n';
    xml+='    '+_tag('DesignStemming','m',p.stem)+'\n';
    xml+='    <HolesWithOwnValues>'+_nPropriXml+'</HolesWithOwnValues>\n';
  }
  xml+='  </PlanData>\n';
  const rows=((p&&p.fori)||[]).slice().sort((a,b)=>(a.tDet||0)-(b.tDet||0));
  xml+='  <Holes count="'+rows.length+'">\n';
  rows.forEach((h,i)=>{
    xml+='    <Hole id="H'+(i+1)+'" seq="'+((h.seq!=null?h.seq:i)+1)+'">\n';
    xml+='      <Position x="'+e((+h.mx||0).toFixed(2))+'" y="'+e((+h.my||0).toFixed(2))+'" unit="m"/>\n';
    xml+='      '+_tag('Depth','m',valoreDiForo(h,'prof',p))+'\n';
    xml+='      '+_tag('Charge','kg',valoreDiForo(h,'kg',p))+'\n';
    xml+='      '+_tag('Stemming','m',valoreDiForo(h,'stem',p))+'\n';
    /* F6 — il diametro del progetto sta già in PlanData (HoleDiameter): dentro
       il foro compare SOLO quando è suo, così un piano senza diametri per
       foro esce com'era */
    if(valoreProprioDiForo(h,'diam')!==null) xml+='      '+_tag('HoleDiameter','mm',valoreProprioDiForo(h,'diam'))+'\n';
    /* F6b — gradi dalla verticale, verso la faccia; solo quando è del foro */
    if(valoreProprioDiForo(h,'incl')!==null) xml+='      '+_tag('Inclination','deg',valoreProprioDiForo(h,'incl'))+'\n';
    xml+='      <Delay unit="ms">'+e((+h.tDet||0).toFixed(1))+'</Delay>\n';
    xml+='    </Hole>\n';
  });
  xml+='  </Holes>\n';
  xml+='</BlastPlan>\n';
  return xml;
}

/* ══════════════════════════════════════════════════════════════════════════
   G9 — LA QUOTA DEL FRONTE SAGOMATO, SOTTO UN NOME
   ══════════════════════════════════════════════════════════════════════════
   `interpProf` dice di quanto il fronte si scosta dal piano verticale a una
   certa distanza `mx`, interpolando fra i punti del profilo rilevato. Non è un
   dettaglio grafico: da lei dipendono la posizione dei fori sul disegno 2D e
   la burden reale di ognuno — cioè quanta roccia ha davanti — che è il numero
   con cui si decide una carica.
   ⛔ Stava dentro `genesi.html` e **nessuna prova poteva chiamarla**: è la
   famiglia censita da `genesi-estraibili.mjs`, che al 09/08 conta 166 funzioni
   nella pagina di cui 81 estraibili. Portarla qui costa un `export` e la
   rende provabile; la pagina la usa **con lo stesso nome**, quindi non cambia
   nemmeno una chiamata.
   ⚠️ IL COMPORTAMENTO NON È CAMBIATO DI UNA VIRGOLA, ed è la regola di casa:
   un trasloco che ne approfitta per «migliorare» non è più un trasloco, e se
   qualcosa si rompe non si sa più quale delle due cose l'ha rotto. Quello che
   la funzione fa, e che adesso è scritto invece che dedotto:
   · profilo vuoto o assente → **0** (nessun rilievo = nessuno scostamento,
     non un'estrapolazione inventata);
   · i punti si **ordinano per x** dentro la funzione, su una copia: chi la
     chiama non deve saperlo, e l'array di partenza non si tocca;
   · fuori dall'intervallo rilevato **non si estrapola**: si tiene il valore
     dell'estremo. Estrapolare la quota di un fronte oltre dove qualcuno è
     andato a misurare vorrebbe dire inventare la roccia;
   · dentro l'intervallo, interpolazione lineare fra i due punti che lo
     racchiudono;
   · `y` mancante vale **0** in tutti i rami (`a.y||0`), che è la convenzione
     con cui il profilo arriva dal rilievo a mano.
   ⚠️ La guardia `((b.x-a.x)||1)` esiste per due punti con la **stessa x** —
   che un rilievo battuto due volte produce — e senza di lei sarebbe `0/0`,
   cioè `NaN` propagato fino alla burden di un foro. */
export function interpProf(arr, mx) {
  if (!arr || !arr.length) return 0;
  const s = [...arr].sort((a, b) => a.x - b.x);
  if (mx <= s[0].x) return s[0].y || 0;
  if (mx >= s[s.length - 1].x) return s[s.length - 1].y || 0;
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i], b = s[i + 1];
    if (mx >= a.x && mx <= b.x) {
      const t = (mx - a.x) / ((b.x - a.x) || 1);
      return (a.y || 0) * (1 - t) + (b.y || 0) * t;
    }
  }
  return 0;
}
/* B3 (14/09) — trasloco con cambio di firma, stesso schema di
   `pfNominale`: `pieDev` componeva solo `interpProf`, già pura in
   questo modulo. La deviazione del PIEDE in un punto x, per la
   maniglia gialla della modellazione 3D (avanzando il piede la faccia
   si alza, come nel 2D) — zero se il piede non è ancora disegnato o
   ha meno di due punti. */
export function pieDev(D2, x){
  return (D2.piede && D2.piede.length >= 2) ? interpProf(D2.piede, x) : 0;
}

/* ══════════════════════════════════════════════════════════════════════════
   G10 — DUE FUNZIONCINE PURE CHE STAVANO FUORI DALLA PORTATA DELLE PROVE
   ══════════════════════════════════════════════════════════════════════════
   Seconda fetta del cantiere censito da `genesi-estraibili.mjs`. Nessuna delle
   due è grossa; tutt'e due decidono qualcosa che **esce** o che si **guarda**,
   e nella pagina nessuna prova poteva chiamarle.

   ⚠️ Come la prima fetta: **trasloco, non miglioria** — il corpo è arrivato
   parola per parola, e quello che è cambiato è che il comportamento adesso è
   scritto invece che dedotto. */

/* `_sentNum` — un numero dentro il file che Genesi consegna a **Sentinella**.
   ⛔ La regola che porta, e che nella pagina non aveva nessuna prova: un
   valore che non si può leggere esce **vuoto**, non «0». È il principio del
   fondatore applicato a un file che passa fra due app: uno zero in una colonna
   di PPV si legge «misurato, ed è zero», cioè la cosa più tranquillizzante che
   quel file possa dire di una vibrazione che nessuno ha misurato.
   ⚠️ E l'arrotondamento a **quattro decimali** non è cosmetico: senza,
   `0.1+0.2` uscirebbe `0.30000000000000004` in un CSV che qualcuno apre con un
   foglio di calcolo. È la stessa famiglia del «numero con quindici decimali
   dove lo schermo ne mostra zero» censita in `CLAUDE.md` — qui presa prima che
   facesse danno. */
export function _sentNum(n) {
  if (n === null || n === undefined || n === "") return "";
  const v = +n;
  return Number.isFinite(v) ? String(Math.round(v * 1e4) / 1e4) : "";
}

/* `_sentCell` — cella di TESTO per lo stesso file per Sentinella (trasloco
   12/09, unità 122, fetta di mezzo di B3). Il censimento la marcava legata a
   quattro variabili del modulo ("r, n, t, g"): sono lettere dentro la sua
   regex (`/[\r\n\t]+/g`), lo stesso falso positivo del tokenizzatore già
   chiuso su `_sitoParseCsv` — letta a mano è pura.
   ⛔ QUI C'ERA LA TERZA COPIA PIÙ DEBOLE DI `csvCell`: virgolettava `; "` e
   basta, quindi un fronte chiamato `=cmd|'/c calc'!A1` usciva **nudo** —
   misurato aprendo la pagina e premendo Esporta. È un file che gira fra due
   aziende e si apre in Excel. Adesso la cella la fa `csvCell` di `shared/`,
   che l'apostrofo di guardia lo mette, e `parseCsvLine` — quello che
   `parseVolateCsv` di Sentinella usa davvero — lo toglie: il giro resta chiuso.
   ⚠️ LA NORMALIZZAZIONE DEI RITORNI A CAPO RESTA, e non è un doppione di
   `csvCell`: è un requisito del LETTORE. `parseVolateCsv` fa
   `split(/\r?\n/)` PRIMA di leggere le celle, quindi un a-capo virgolettato —
   che `csvCell` da sola conserverebbe, giustamente — gli spaccherebbe la riga
   in due. Si normalizza per chi legge, poi si protegge con la regola di casa. */
export function _sentCell(v) { return csvCell(String(v == null ? "" : v).replace(/[\r\n\t]+/g, " ").trim()); }

/* `isoColore` — il colore di un'**isocrona** sul disegno 2D, da `u` ∈ [0,1]
   (0 = il primo fronte d'onda, 1 = l'ultimo). Tre canali che si muovono
   insieme: la tinta scorre dal celeste al blu, la saturazione **cala** e la
   luminosità **cala**, così le isocrone tarde sono più scure e più smorte e
   l'occhio legge la sequenza senza leggere i numeri.
   ⚠️ Sta in un modulo dati e non in un foglio di stile perché il disegno è su
   una **tela**: `canvas.fillStyle` vuole una stringa di colore vera, e una
   `var(--…)` lì **non fallisce, viene ignorata** — il pennello resta del colore
   di prima. È la trappola censita in `CLAUDE.md` (la tela che sbaglia in
   silenzio tenendo la risposta di prima), e la ragione per cui questo colore si
   compone in JavaScript. */
export function isoColore(u) {
  return "hsl(" + (188 + u * 26).toFixed(0) + "," + (62 - u * 10).toFixed(0) + "%," + (72 - u * 14).toFixed(0) + "%)";
}

/* ══════════════════════════════════════════════════════════════════════════
   G11 — LA MASSIMA CARICA ISTANTANEA, IL NUMERO CON CUI SI DECIDE SE UNA
   VOLATA STA SOTTO LA SOGLIA DI VIBRAZIONE
   ══════════════════════════════════════════════════════════════════════════
   Terza fetta del cantiere censito da `genesi-estraibili.mjs`. `computeMIC`
   stava dentro `genesi.html` e **nessuna prova poteva chiamarla**, eppure è la
   funzione da cui dipende la catena più delicata dell'app:

       MIC → distanza scalata `recDist / √MIC` → PPV prevista `K·SD^(−β)`
           → confronto con il limite di norma (`ppvLimit`)

   cioè il numero che dice se la volata si può sparare come è disegnata o se il
   piano va rifatto. Sbagliarlo non produce un difetto grafico: produce un
   «sotto soglia» su una volata che sotto soglia non è.

   ⛔ CHE COSA MISURA, in parole di cava. La roccia non sente la carica totale
   della volata: sente quanto esplosivo parte **nello stesso istante**. Due
   fori sullo stesso ritardo sono, per il terreno, un foro solo di carica
   doppia. La convenzione — la stessa dell'USBM e delle norme che ne
   discendono — è che due cariche separate da **meno di 8 ms** contino insieme.
   Quindi il conto è: si prende ogni foro come inizio di una finestra di 8 ms,
   si contano quanti fori partono dentro quella finestra, e si tiene il gruppo
   più numeroso. Quello, per la carica di un foro, è la MIC.

   ⚠️ **TRASLOCO, NON MIGLIORIA**: il corpo è arrivato parola per parola dalla
   pagina, `8` compreso. L'unica cosa cambiata è la **firma** — `D2.holes` e
   `D2.kg` sono diventati due argomenti, perché quello stato vive nella pagina
   e un modulo dati non deve conoscerlo. La pagina la chiama con lo stesso nome
   di prima (`computeMIC`) e nessuna delle sue otto chiamate è cambiata.

   Quello che la funzione fa, e che adesso è SCRITTO invece che dedotto:
   · la finestra è **aperta a destra**: due fori a 8,0 ms esatti NON contano
     insieme, due a 7,999 sì. È il bordo su cui un conto a mano sbaglia, ed è
     l'unico punto in cui la scelta di `<` invece di `<=` cambia una MIC;
   · l'ancora è **ogni foro**, non una griglia di finestre: una finestra
     ottima si può sempre far scorrere fino a partire da un foro, quindi
     provarle tutte basta a trovare il massimo vero;
   · un foro **senza `tDet`** vale 0 (`h.tDet || 0`): una volata di cui nessuno
     ha ancora calcolato la sequenza risulta tutta simultanea, cioè la MIC più
     ALTA possibile. È il verso prudente, ed è quello giusto: finché la
     sequenza non c'è, l'app non promette che i fori si separino.

   ⛔ **E FINO AL 09/08 IL VERSO OPPOSTO ERA SCRITTO QUI COME UN FATTO DA
   GUARDARE, NON COME UN DIFETTO DA CHIUDERE: con l'elenco dei fori VUOTO la
   funzione rispondeva `kg`, la carica di UN foro.** Cioè il valore più basso
   che potesse restituire, quindi la distanza scalata più grande e la PPV più
   bassa, **sul numero con cui si decide se una volata si può sparare**.
   Misurato sul progetto di partenza (60 kg/foro, recettore a 300 m, K=1140,
   β=1,6): dodici fori sullo stesso ritardo danno MIC 720 kg → PPV 23,95 mm/s;
   nessun foro disegnato dava MIC 60 kg → PPV **3,28 mm/s**, cioè **7,3 volte
   più tranquilla**. È «l'assenza di un dato non è un dato favorevole» —
   principio del fondatore — nella sua forma più cara.
   ⚠️ E NON ERA IRRAGGIUNGIBILE: cinque punti della pagina generano la maglia
   prima di chiedere i KPI (`if(!D2.holes.length) genMaglia2D()`), ma **otto
   chiamate a `computeKPI()` no** — `cmpSave`, il CSV della scheda volata,
   `_riconCampoHtml`, `riconRender`, `riconSave`, `sigRender`, `volSnapshot`,
   `simulaPerforazione`. E `apri` di una volata salvata fa `D2.holes=[]` prima
   di passare al 2D, quindi lo stato «progetto pieno, zero fori» esiste davvero.
   ⛔ Adesso risponde **`null`**, che in tutto l'ecosistema vuol dire «non
   calcolabile» — la stessa convenzione di `ppvLimit`, di `_sentNum` e di
   `esitoPpv`. Il perché lo dice `micSenzaConto` e il verdetto `esitoMic`,
   com'è già per la coppia `ppvSenzaSoglia`/`ppvLimit` trenta righe più su:
   una convenzione sola, non una inventata qui.
   ⚠️ **UN `null` CHE NESSUNO LEGGE È PEGGIO DEL NUMERO TRANQUILLO**, ed è
   misurato: coi lettori di prima, `Math.max(1, null)` fa 1, quindi la distanza
   scalata diventa la distanza nuda e la PPV scende a **0,12 mm/s** — non 7,3
   volte più bassa, **199**. Per questo il cantiere non finisce qui: `airblastDb`
   risponde `null` invece di 104,5 dB(L), `xmlPianoInnesco` **dichiara** invece
   di scrivere `0.0`, e nella pagina i sette lettori dicono «non calcolabile».

   ⚠️ E il contratto verso chi la chiama, che nella pagina non poteva emergere:
   · `holes` deve essere un array — con `null` **solleva**, esattamente come
     faceva prima dentro la pagina: quello non è un dato assente, è una
     chiamata sbagliata, e nasconderla dietro un `null` la renderebbe muta;
   · `kg` deve essere un numero **finito e non negativo**. Se non lo è la
     risposta è `null`: prima `kg` a `null` faceva `n * null` = **0**, cioè un
     secondo numero tranquillo nascosto nel ramo dei fori PIENI. Non è teoria —
     `apri` fa `Object.assign(D2, …)` da `localStorage` senza controlli, che è
     la stessa porta da cui il 03/08 è entrato il codice di normativa che
     Genesi non riconosce;
   · **`kg` a 0 resta 0**, e non è una svista: lo zero MISURATO è un fatto, e
     `esitoPpv` lo dice già con queste parole. Quello che non deve passare è
     l'assenza travestita da zero.
   ⚠️ `Number.isFinite(+kg)` **da solo non basta**, e l'ha detto la prova in
   scratchpad prima che la riga entrasse qui: `+null` fa 0, che è finito. Il
   `null` va nominato per nome, come fanno `esitoPpv` e `_sentNum`. */
export const MIC_SENZA_CONTO = {
  fori:   { che:'non c’è nessun foro nel disegno, e la carica per ritardo si conta sui fori',
            come:'Genera la maglia (o apri il progetto nel 2D) e la MIC torna.' },
  carica: { che:'la carica per foro non è un numero leggibile, e senza quella non c’è niente da sommare',
            come:'Reimposta la carica per foro nei parametri della volata.' },
};
/* `null` quando la MIC si può contare; altrimenti dice QUALE dei due manca — e
   se mancano tutt'e due li nomina tutt'e due, gemella di `ppvSenzaSoglia`.
   ⚠️ `holes` a `null` solleva qui dentro, ed è voluto: vedi il contratto. */
export function micSenzaConto(holes, kg) {
  const senzaFori = !holes.length;
  const q = (kg === null || kg === undefined || kg === '') ? NaN : +kg;
  const senzaCarica = !Number.isFinite(q) || q < 0;
  if (!senzaFori && !senzaCarica) return null;
  const parti = [];
  if (senzaFori) parti.push(MIC_SENZA_CONTO.fori);
  if (senzaCarica) parti.push(MIC_SENZA_CONTO.carica);
  return { fori:senzaFori, carica:senzaCarica,
    che:  parti.map(p => p.che).join('; e '),
    come: parti.map(p => p.come).join(' ') };
}
/* Il verdetto sulla MIC, per lo schermo e per i documenti — gemello di
   `esitoAirblast`. La bandiera `calcolabile` è quella che la pagina deve
   leggere: senza, il `null` si disegnerebbe tranquillo lo stesso (regola 20 di
   `run-stile`). `sv-warn` e non `sv-bad`: non sappiamo che una volata sia
   pericolosa, sappiamo di non poterlo dire — è un'altra cosa. */
export function esitoMic(mic) {
  const m = (mic === null || mic === undefined || mic === '') ? NaN : +mic;
  if (!Number.isFinite(m) || m < 0)
    return { calcolabile:false, kg:null, classe:'sv-warn', stato:'nonCalcolabile',
             verdetto:'non calcolabile' };
  return { calcolabile:true, kg:m, classe:'sv-info', stato:'contata', verdetto:'' };
}
/* LA DISPERSIONE DELL'INNESCO (lo «scatter»), in millisecondi (04/09, fetta di
   B3). Nella pagina era scritta TRE volte con lo stesso ternario — sul foro
   (`f.tDet`), sull'uniformità di Cunningham (`max(rit, lastDet)`) e nel badge
   e nel rilascio (`scatterMs`) — cioè la copia da firma troppo stretta: le tre
   differivano solo per il tempo di riferimento, che qui è un argomento.
   Elettronico 0,1 ms e elettrico 0,5 ms sono fissi; cordtex il 3% e Nonel il
   2% del tempo di riferimento. L'aritmetica è quella di prima, parola per
   parola: un tempo assente resta NaN come restava — chi chiama passa un
   numero. */
export function scatterInnesco(innesco, tRif) {
  return (innesco === "elettronico") ? 0.1 : ((innesco === "elettrico") ? 0.5 : ((innesco === "cordtex") ? 0.03 * tRif : 0.02 * tRif));
}
/* dispersione dell'innesco (stessa formula del badge "Scatter innesco"): due fori
   separati da meno di così sparano di fatto insieme e non si liberano a vicenda.
   Trasloco B3 (14/09): `D2` come primo argomento esplicito, come già per
   `pfNominale`/`pieDev`/`reliefCls`/`computeEnergia2D`/`isoPasso`. */
export function scatterMs(D2){
  const Th=D2.ritardo||42, tmx=Math.max(Th, D2.lastDet||Th);
  return scatterInnesco(D2.innesco, tmx);
}

/* ══════════════════════════════════════════════════════════════════════
   LA MIC DICE QUALI FORI LA FORMANO, E QUANDO (27/11).
   ══════════════════════════════════════════════════════════════════════
   La scheda e il foglio dicevano «MIC 174 kg (finestra 8 ms)» e basta: chi
   deve abbassarla non sapeva QUALI fori partono insieme, e doveva cercarli
   a occhio fra i ritardi. Il conto delle finestre c'era già, dentro
   `micFinestra`, e buttava via tutto tranne il massimo.
   ⛔ UNA SOLA FUNZIONE CONTA LE FINESTRE (`_finestreDiCarica`): la usano
   `micFinestra` (il numero) e `finestraDellaMic` (chi e quando). Due conti
   separati sarebbero stati la copia debole di sempre — e qui il numero
   decide la PPV. L'aritmetica è quella di prima PAROLA PER PAROLA (`fori ×
   carica del progetto + scarti`, nello stesso ordine): provato su 4000
   volate a caso contro la forma vecchia con `Object.is`, zero differenze.
    · `finestraDellaMic` risponde `null` dove risponde `null` la MIC;
    · a parità di chili vince la finestra che parte PRIMA, e `altre` dice
      quanti altri gruppi distinti arrivano alla stessa carica;
    · `daSoli` è vero solo se in OGNI finestra c'è un foro solo: «ogni foro
      parte da solo» non si deduce dal fatto che la finestra massima ne ha
      uno (un foro grosso può battere una coppia: misurato in scratchpad);
    · `senzaTempo`: quanti fori della finestra non hanno un ritardo
      leggibile. Per il conto valgono 0 ms — è la scelta prudente, li
      ammucchia tutti all'inizio — e la frase lo DICE invece di scrivere
      «partono insieme a 0 ms» come se fosse stato deciso. */
export const FINESTRA_MIC_MS = 8;
function _finestreDiCarica(H, kg){
  const ts = H.map((h) => h.tDet || 0);
  /* F2 (26/11) — LA FINESTRA SOMMA LE CARICHE VERE DEI FORI. Fino a oggi la
     MIC era «quanti fori nella finestra» × la carica unica della volata. Un
     foro può ora portare una carica sua (F1, `valoreProprioDiForo`), e la
     carica massima per ritardo è per definizione una SOMMA di cariche.
     ⛔ NON si sommano le cariche una per una: n volte 58,3 sommate non danno
     gli stessi decimali di n × 58,3, e un progetto di ieri deve restare
     identico ALLA CIFRA. Per ogni finestra si calcola `fori × carica del
     progetto` più gli SCARTI dei soli fori che hanno una carica loro: senza
     cariche proprie lo scarto è zero ed esce esattamente il numero di prima
     (provato in scratchpad su 4000 volate a caso, confronto con `Object.is`:
     zero differenze).
     ⚠️ E con cariche proprie la finestra che vince può NON essere quella con
     più fori: un foro isolato da 200 kg batte due fori da 58. Per questo si
     confrontano i chili di ogni finestra, non i conteggi. */
  const scarti = H.map((h) => { const suo = valoreProprioDiForo(h, 'kg'); return suo === null ? 0 : suo - kg; });
  const finestre = [];
  for (const t0 of ts) {
    let c = 0, s = 0; const dentro = [];
    for (let j = 0; j < ts.length; j++) if (ts[j] >= t0 && ts[j] < t0 + FINESTRA_MIC_MS) { c++; s += scarti[j]; dentro.push(j); }
    finestre.push({ t0, kg: c * kg + s, dentro });
  }
  return { ts, finestre };
}
export function micFinestra(holes, kg) {
  const H = holes;
  if (micSenzaConto(H, kg)) return null;
  let mic = null;
  for (const f of _finestreDiCarica(H, kg).finestre) if (mic === null || f.kg > mic) mic = f.kg;
  return mic;
}
export function finestraDellaMic(holes, kg){
  const H = holes;
  if (micSenzaConto(H, kg)) return null;
  const { ts, finestre } = _finestreDiCarica(H, kg);
  let m = null;
  for (const f of finestre) if (m === null || f.kg > m.kg || (f.kg === m.kg && f.t0 < m.t0)) m = f;
  const fin = (v) => v !== null && v !== undefined && v !== '' && Number.isFinite(+v);
  const numero = (j) => (fin(H[j] && H[j].seq) ? +H[j].seq : j) + 1;
  const pari = new Set(finestre.filter((f) => f.kg === m.kg).map((f) => f.dentro.join(',')));
  return { kg: m.kg, da: m.t0, a: Math.max(...m.dentro.map((j) => ts[j])), fori: m.dentro.map(numero).sort((a, b) => a - b),
    altre: pari.size - 1, daSoli: finestre.every((f) => f.dentro.length === 1), senzaTempo: m.dentro.filter((j) => !fin(H[j] && H[j].tDet)).length };
}
/* la frase, una per lo schermo e per il foglio. Sta in piedi da sola (comincia
   da «La MIC»): viene scritta in coda a testi che parlano anche d'altro. */
export function fraseFinestraMic(f){
  if (!f || !Array.isArray(f.fori) || !f.fori.length) return '';
  const N = f.fori.length;
  if (N === 1 && f.daSoli) return 'Ogni foro parte da solo: nessun altro entro ' + FINESTRA_MIC_MS + ' ms.';
  const altre = f.altre > 0 ? ' ' + (f.altre === 1 ? 'Un altro gruppo arriva' : 'Altri ' + gnum(f.altre, 0) + ' gruppi arrivano') + ' alla stessa carica.' : '';
  if (N === 1) return 'La MIC la forma il foro ' + f.fori[0] + ', che parte da solo.' + altre;
  const chi = N <= 8 ? f.fori.slice(0, -1).join(', ') + ' e ' + f.fori[N - 1] : f.fori.slice(0, 6).join(', ') + ' e altri ' + (N - 6);
  const quando = f.senzaTempo === N ? 'non hanno un ritardo assegnato: per il conto partono tutti insieme'
    : (f.a === f.da ? 'partono insieme a ' + gnum(f.da, 1) + ' ms' : 'partono fra ' + gnum(f.da, 1) + ' e ' + gnum(f.a, 1) + ' ms')
      + (f.senzaTempo > 0 ? ' (' + (f.senzaTempo === 1 ? 'uno non ha' : f.senzaTempo + ' non hanno') + ' un ritardo assegnato, e per il conto vale 0 ms)' : '');
  return 'La MIC la formano i fori ' + chi + ', che ' + quando + '.' + altre;
}
/* ══════════════════════════════════════════════════════════════════════
   LE CARICHE NEL TEMPO (27/11) — il disegno della MIC.
   ══════════════════════════════════════════════════════════════════════
   La frase dice quali fori formano la MIC; il disegno fa vedere TUTTE le
   finestre: per ogni istante in cui parte un foro, i chili che partono
   negli 8 ms da lì. È lo stesso conto di `micFinestra` (stesse finestre,
   `_finestreDiCarica`): la barra più alta È la MIC, non una sua stima.
    · `caricheNelTempo`: una voce per ISTANTE distinto, in ordine di tempo
      (due fori sullo stesso ritardo aprono la stessa finestra: una barra);
      `null` dove la MIC non si conta;
    · `diagrammaTempiPerFoglio`: le barre, per la carta. L'altezza è
      proporzionale ai chili e UNO ZERO SI DISEGNA ZERO (una finestra di
      soli fori scarichi non ha barra: niente altezza minima «per farla
      vedere»); in arancio le finestre che arrivano alla MIC; l'asse dei
      tempi ha tacche tonde. Stringa vuota se non c'è niente da disegnare
      (MIC non contabile, o tutti i fori scarichi). */
export function caricheNelTempo(holes, kg){
  const H = holes;
  if (micSenzaConto(H, kg)) return null;
  const visti = new Set(), out = [];
  for (const f of _finestreDiCarica(H, kg).finestre) if (!visti.has(f.t0)) { visti.add(f.t0); out.push({ da: f.t0, kg: f.kg, fori: f.dentro.length }); }
  return out.sort((a, b) => a.da - b.da);
}
export function diagrammaTempiPerFoglio(holes, kg, opz){
  const F = Array.isArray(holes) ? caricheNelTempo(holes, kg) : null;
  if (!F || !F.length) return '';
  const mic = Math.max(...F.map((f) => f.kg));
  if (!(mic > 0)) return '';
  const o = opz || {}, fin = (v) => v !== null && v !== undefined && v !== '' && Number.isFinite(+v);
  const L = (fin(o.larghezza) && +o.larghezza >= 320) ? +o.larghezza : 680, padL = 36, padR = 36, padTop = 26, altaBarre = 90, base = padTop + altaBarre;
  const tMax = F[F.length - 1].da, largaT = L - padL - padR, X = (t) => padL + (tMax > 0 ? t / tMax : 0) * largaT;
  /* la larghezza della barra: sette decimi del passo più stretto fra due istanti, fra 1,5 e 12 px */
  let passo = largaT; for (let i = 1; i < F.length; i++) passo = Math.min(passo, X(F[i].da) - X(F[i - 1].da));
  const w = Math.max(1.5, Math.min(12, passo * 0.7));
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
  const leg = ['barra: i chili che partono entro ' + FINESTRA_MIC_MS + ' ms da lì', 'in arancio: la MIC'];
  const legRighe = righeDiVoci(leg.map((t) => (t.length + 3) * 5), L - padL - padR), alta = base + 34 + legRighe.length * 13;
  const out = [];
  out.push('<svg xmlns="http://www.w3.org/2000/svg" class="tempi" viewBox="0 0 ' + L + ' ' + alta + '" width="100%" role="img" aria-label="Cariche nel tempo: ' + gnum(F.length, 0) + (F.length === 1 ? ' istante' : ' istanti') + ' di partenza, carica massima per ritardo ' + gnum(mic, 1) + ' kg" style="max-width:' + L + 'px;display:block;margin:0 auto;font-family:system-ui,Arial,sans-serif">');
  out.push('<rect x="0.5" y="0.5" width="' + (L - 1) + '" height="' + (alta - 1) + '" fill="#fff" stroke="#d8d8d8"/>');
  /* la riga della MIC, con il suo numero */
  out.push('<path class="t-mic" d="M' + padL + ' ' + padTop + 'H' + (L - padR) + '" stroke="#c05a00" stroke-width="1" stroke-dasharray="4 3"/>');
  out.push('<text class="t-micn" x="' + padL + '" y="' + (padTop - 6) + '" font-size="10" font-weight="700" fill="#a05a00">MIC ' + gnum(mic, 1) + ' kg</text>');
  F.forEach((f) => { const h = f.kg / mic * altaBarre; if (!(h > 0)) return;
    out.push('<rect class="t-b' + (f.kg === mic ? ' t-max' : '') + '" x="' + f1(X(f.da) - w / 2) + '" y="' + f1(base - h) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + (f.kg === mic ? '#c05a00' : '#8f8f8f') + '"/>'); });
  out.push('<path d="M' + padL + ' ' + base + 'H' + (L - padR) + '" stroke="#1a1a1a" stroke-width="1.2"/>');
  /* le tacche dei tempi: un passo tondo, al più sette tacche; con un istante solo, la sua */
  const passi = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000], pt = tMax > 0 ? (passi.find((p) => tMax / p <= 6) || 10000) : 0;
  const tacche = []; if (tMax > 0) for (let t = 0; t <= tMax + 1e-9; t += pt) tacche.push(t); else tacche.push(F[0].da);
  tacche.forEach((t) => { out.push('<path class="t-tacca" d="M' + f1(X(t)) + ' ' + base + 'v4" stroke="#1a1a1a" stroke-width="1"/>');
    out.push('<text class="t-ms" x="' + f1(X(t)) + '" y="' + (base + 15) + '" font-size="9.5" text-anchor="middle" fill="#1a1a1a">' + gnum(t, 1) + '</text>'); });
  /* «ms» sta 17 px oltre la fine dell'asse: l'ultima tacca può cadere proprio lì, e la sua cifra è larga fino a 24 px */
  out.push('<text class="t-u" x="' + (L - padR + 17) + '" y="' + (base + 15) + '" font-size="9.5" fill="#555">ms</text>');
  legRighe.forEach((riga, k) => out.push('<text class="t-leg" x="' + padL + '" y="' + (base + 34 + k * 13) + '" font-size="9.5" fill="#555">' + riga.map((i) => leg[i]).join(' · ') + '</text>'));
  out.push('</svg>');
  return out.join('');
}

/* ══════════════════════════════════════════════════════════════════════════
   G12 · LA CARICA TOTALE E IL COSTO DELLA VOLATA — «non lo so» invece di zero
   ══════════════════════════════════════════════════════════════════════════
   ⛔ LO STESSO DIFETTO DEL BLOCCO G11, UN NUMERO PIÙ IN LÀ, E QUI SI TOCCANO I
   SOLDI. `computeKPI` faceva `const Q = D2.kg` senza ripiego e poi
   `qtot = nf * Q`: con una carica per foro non leggibile, `nf * null` fa
   **zero** e `Math.round(0)` fa zero, quindi la volata dichiarava
   «Carica totale 0 kg» invece di dire che non lo sa.
   ⚠️ E il caso è RAGGIUNGIBILE per la stessa porta di sempre: `apri` fa
   `Object.assign(D2, …)` da `localStorage` senza controlli, e `kg` sta nel
   `design` che si salva — la stessa porta da cui il 03/08 è entrato il codice
   di normativa che Genesi non riconosce.
   ⚠️ **NON è il caso di `micFinestra`**, ed è la differenza che ha deciso la
   forma di queste funzioni: la MIC si conta sui fori DISEGNATI (`D2.holes`) e
   spariva quando il disegno era vuoto; la carica totale si conta sulla
   **griglia di progetto** (`perRow × file`, coi ripieghi 18 e 1), che una
   volata aperta ce l'ha sempre. Misurato: con `holes=[]` e la griglia piena
   `qtot` resta **720 kg**, identica al caso sano. Qui morde solo il `kg`.

   ⛔ E IL PEZZO CHE CONTA DI PIÙ È IL SECONDO: **UN COSTO CON UN ADDENDO CHE
   MANCA NON È UN COSTO PIÙ BASSO, È UN COSTO NON CALCOLABILE.** Misurato sul
   progetto di partenza (12 fori, 60 kg, 10 m + 0,9 di sotto, 8 €/m, 1,5 €/kg,
   12 €/foro): il costo vero è **2.270 €**, e con `kg` illeggibile usciva
   **1.190 €** — l'addendo dell'esplosivo, cioè **il 48% del costo**, sparito
   nella direzione che rassicura. Da lì il €/m³, il €/t e il **margine**.

   ⛔ E LA CORREZIONE INGENUA — `qtot` a `null` e basta — È STATA PROVATA IN
   SCRATCHPAD E BOCCIATA, perché **peggiorava proprio il numero dei soldi**:
   · `_vol>0 ? _cTot/_vol : 0` con `_cTot` a `null` fa `null/vol` = **0**, e
     la scheda scriveva «**0,00 €/m³**» — il costo unitario più tranquillo che
     esista, al posto di 1,80;
   · il margine è `ricavo − costo`: con `costo` a `null`, `28.350 − null` fa
     **28.350**, cioè **tutto il ricavo diventa margine**, dipinto di verde
     dalla riga che sceglie il colore su `_marg>=0`. Prima della correzione
     l'errore era di 1.190 €, dopo la correzione ingenua di **2.270**.
   Per questo i numeri DERIVATI dal costo (€/m³, €/t, margine) li restituisce
   questa funzione e non li ricava il chiamante: erano scritti in tre punti
   della pagina, e un `null` che attraversa tre aritmetiche scritte a mano
   torna a essere uno zero in almeno una delle tre.

   ⚠️ **UNO ZERO MISURATO RESTA ZERO**, come per `micFinestra`: `kg` a 0 dà
   `qtot` 0 e un costo vero di 1.190 €. Quello che non deve passare è
   l'assenza travestita da zero — e `Number.isFinite(+kg)` da solo non basta,
   perché `+null` fa 0 che è finito: il `null` va nominato per nome.
   ⚠️ E i PREZZI restano col ripiego a zero, di proposito e misurato: non
   passano da `apri` (né `volSnapshot` né `cmpSave` li mettono nel `design`) e
   dai campi arrivano già stretti fra `Math.max(0, Math.min(…))`. Un prezzo
   non inserito è «non lo addebito», che è una scelta, non un dato assente. */
export const CARICA_SENZA_CONTO = {
  fori:   { che:'il numero dei fori di progetto non è un numero leggibile, e la carica totale si conta sulla griglia',
            come:'Reimposta fori per fila e numero di file nei parametri della volata.' },
  carica: { che:'la carica per foro non è un numero leggibile, e la carica totale è quella moltiplicata per i fori',
            come:'Reimposta la carica per foro nei parametri della volata.' },
};
/* `null` quando la carica totale si può contare; altrimenti dice QUALE dei due
   manca — e se mancano tutt'e due li nomina tutt'e due, gemella di
   `micSenzaConto` e di `ppvSenzaSoglia`. */
export function caricaSenzaConto(nf, kg){
  const n = (nf === null || nf === undefined || nf === '') ? NaN : +nf;
  const q = (kg === null || kg === undefined || kg === '') ? NaN : +kg;
  const senzaFori = !Number.isFinite(n) || n < 0;
  const senzaCarica = !Number.isFinite(q) || q < 0;
  if (!senzaFori && !senzaCarica) return null;
  const parti = [];
  if (senzaFori) parti.push(CARICA_SENZA_CONTO.fori);
  if (senzaCarica) parti.push(CARICA_SENZA_CONTO.carica);
  return { fori:senzaFori, carica:senzaCarica,
    che:  parti.map(p => p.che).join('; e '),
    come: parti.map(p => p.come).join(' ') };
}
/* I chili di esplosivo dell'intera volata, o `null` se non si contano. */
/* F2 (26/11) — LO SCARTO DELLE CARICHE PROPRIE. Di quanti chili i fori che
   hanno una carica LORO si scostano, in tutto, dalla carica del progetto: la
   somma di (carica propria − carica del progetto). Zero se nessun foro ne ha
   una; `null` se la carica del progetto non si legge (di quanto ci si scosta
   da un numero che non c'è non si può dire). È il solo pezzo che serve per
   passare da «fori × carica» alla carica VERA della volata senza cambiare
   il conto di chi cariche proprie non ne ha: n × kg + 0 è n × kg, alla cifra.
   ⚠️ Vale solo dove «i fori» sono quelli DISEGNATI: sulla griglia di progetto
   (fori per fila × file) questi scarti non hanno un foro a cui appartenere. */
export function scartoCaricheProprie(holes, kg){
  const q = (kg === null || kg === undefined || kg === '') ? NaN : +kg;
  if (!Number.isFinite(q) || q < 0) return null;
  let s = 0;
  for (const h of (holes || [])){ const suo = valoreProprioDiForo(h, 'kg'); if (suo !== null) s += suo - q; }
  return s;
}
/* Lo stesso per la PROFONDITÀ (F2, 26/11): di quanti metri, in tutto, i fori
   con una profondità loro si scostano da quella del progetto. Serve ai metri
   perforati, che sono fori × (profondità + sottoperforazione): la
   sottoperforazione resta quella del progetto, quindi lo scarto dei metri è
   lo scarto delle profondità. Zero se nessun foro ne ha una; `null` se la
   profondità del progetto non si legge. Due funzioni e non una con un
   parametro: la carica ammette lo zero (foro scarico), la profondità no, e
   quella differenza sta già scritta in `valoreProprioDiForo`. */
export function scartoProfonditaProprie(holes, prof){
  const p = (prof === null || prof === undefined || prof === '') ? NaN : +prof;
  if (!Number.isFinite(p) || !(p > 0)) return null;
  let s = 0;
  for (const h of (holes || [])){ const sua = valoreProprioDiForo(h, 'prof'); if (sua !== null) s += sua - p; }
  return s;
}
/* F2 (26/11) — IL VERSO INVERSO: da un TOTALE scritto dall'utente alla
   carica del progetto. Il campo «Esplosivo totale» della pagina è a due
   versi: mostra la carica della volata e, se ci si scrive un numero, ricalcola
   la carica per foro. Fino a oggi era `totale / fori`. Con le cariche proprie
   quel conto farebbe rileggere al campo un totale DIVERSO da quello scritto.
   La regola discende da F1, non è una scelta nuova: il campo scrive la carica
   del PROGETTO, e un foro con una carica sua per definizione non la segue.
   Quindi i fori con una carica propria restano fermi e il totale si
   distribuisce sugli altri: (totale − somma delle proprie) / fori senza.
   Senza cariche proprie è `totale / fori`, alla cifra (3000 totali a caso in
   scratchpad, zero differenze).
   Risponde `null` se il totale o il numero dei fori non sono positivi. `kg`
   è `null` quando TUTTI i fori hanno una carica propria (non c'è nessuno su
   cui distribuire), ed è NEGATIVO quando il totale scritto è meno della somma
   delle cariche proprie: due casi che la pagina deve dire, non arrotondare. */
export function caricaProgettoDaTotale(tot, n, holes){
  const T = (tot === null || tot === undefined || tot === '') ? NaN : +tot;
  const N = (n === null || n === undefined || n === '') ? NaN : +n;
  if (!(T > 0) || !(N > 0)) return null;
  let somma = 0, propri = 0;
  for (const h of (holes || [])){ const suo = valoreProprioDiForo(h, 'kg'); if (suo !== null){ somma += suo; propri++; } }
  if (propri === 0) return { kg: T / N, propri: 0, liberi: N, sommaProprie: 0 };
  const liberi = N - propri;
  if (!(liberi > 0)) return { kg: null, propri, liberi: 0, sommaProprie: somma };
  return { kg: (T - somma) / liberi, propri, liberi, sommaProprie: somma };
}
/* `scarto` (facoltativo, da `scartoCaricheProprie`): assente, zero o
   illeggibile lascia il conto ESATTAMENTE com'era — fori × carica. */
export function caricaTotale(nf, kg, scarto){
  if (caricaSenzaConto(nf, kg)) return null;
  const base = +nf * +kg;
  const s = (scarto === null || scarto === undefined || scarto === '') ? NaN : +scarto;
  return (Number.isFinite(s) && s !== 0) ? base + s : base;
}

export const COSTO_SENZA_CONTO = {
  metri: { che:'i metri perforati non sono un numero leggibile, e la perforazione si paga al metro',
           come:'Reimposta profondità e sottoperforazione nei parametri della volata.' },
  fori:  { che:'il numero dei fori non è un numero leggibile, e gli inneschi si pagano a foro',
           come:'Reimposta fori per fila e numero di file nei parametri della volata.' },
};
/* ⛔ IL PUNTO UNICO IN CUI SI DECIDE QUANTO COSTA UNA VOLATA. La formula era
   scritta **tre volte** — in `computeKPI`, nel foglio stampabile e nella
   scheda validatori — con l'unica differenza di dove viene `nf` (la griglia di
   progetto nel primo, i fori DISEGNATI negli altri due). Tre copie della
   stessa formula prima o poi dicono tre numeri diversi, e questa decide dei
   soldi: la firma si allarga (`nf` e `mPerf` arrivano da fuori), non si
   ricopia il corpo.
   Torna gli addendi separati — così chi disegna può mostrare quello che si
   conta ancora e dire «non calcolabile» solo sul resto — più i tre numeri
   derivati che nessun chiamante deve rifarsi in casa.
   ⚠️ Il RICAVO non dipende dal costo: se le tonnellate e il valore del
   materiale ci sono, resta un numero vero anche quando il costo non c'è. È il
   MARGINE che sparisce, perché è una sottrazione fra i due. */
export function costoVolata(v){
  const o = v || {};
  const num = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const prezzo = (x) => { const p = num(x); return (Number.isFinite(p) && p >= 0) ? p : 0; };
  const nf = num(o.nf), mPerf = num(o.mPerf), vol = num(o.vol), ton = num(o.ton), vm = num(o.valMat);
  /* `o.scartoKg` (F2, 26/11): lo scarto delle cariche proprie dei fori disegnati — lo passa solo chi conta i fori DISEGNATI */
  const qtot = caricaTotale(o.nf, o.kg, o.scartoKg), perche = caricaSenzaConto(o.nf, o.kg);
  const senzaMetri = !Number.isFinite(mPerf) || mPerf < 0;
  const senzaFori  = !Number.isFinite(nf) || nf < 0;
  const perf    = senzaMetri ? null : mPerf * prezzo(o.cPerf);
  const expl    = qtot === null ? null : qtot * prezzo(o.cExpl);
  const innesco = senzaFori ? null : nf * prezzo(o.cInnesco);
  const tot = (perf === null || expl === null || innesco === null) ? null : perf + expl + innesco;
  const parti = [];
  if (senzaMetri) parti.push(COSTO_SENZA_CONTO.metri);
  if (senzaFori && !(perche && perche.fori)) parti.push(COSTO_SENZA_CONTO.fori);
  if (expl === null && perche) parti.push({ che:perche.che, come:perche.come });
  const ricavo = (Number.isFinite(ton) && ton >= 0 && Number.isFinite(vm) && vm >= 0) ? ton * vm : null;
  return { qtot, tot, perf, expl, innesco,
    calcolabile: tot !== null,
    perM3: (tot !== null && Number.isFinite(vol) && vol > 0) ? tot / vol : null,
    perT:  (tot !== null && Number.isFinite(ton) && ton > 0) ? tot / ton : null,
    ricavo,
    margine: (tot !== null && ricavo !== null) ? ricavo - tot : null,
    che:  parti.map(p => p.che).join('; e '),
    come: parti.map(p => p.come).join(' ') };
}

/* ══════════════════════════════════════════════════════════════════════════
   G13 · IL CONSUMO SPECIFICO E LA PEZZATURA PREVISTA — e la differenza fra
         un CLAMP e una GUARDIA
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL TERZO DELLA FAMIGLIA DI OGGI, dopo la MIC (G11) e la carica col costo
   (G12), e l'unico che sbaglia nei DUE VERSI insieme. Nella pagina c'era
   scritto, quattro volte:

       const pf  = kg / vol;
       const x50 = A * Math.pow(Math.max(0.05, pf), -0.8)
                     * Math.pow(Math.max(1, kg), 1/6) * Math.pow(115/RWS, 19/30);

   Con la carica per foro illeggibile — `apri` fa `Object.assign(D2, …)` da
   `localStorage` senza controlli, e `kg` sta nel `design` che `volSnapshot`
   salva — misurato aprendo una volata salvata con `kg:null`:
   · `pf` va a **0** e la pagina scrive «**0,00 kg/m³**» in cinque posti (il
     riquadro del 3D, la scheda validatori, il CSV, il foglio stampabile, il
     confronto A/B). È il verso che RASSICURA: uno zero si legge «poca
     carica», non «nessuno ha letto la carica»;
   · `x50` fa il contrario: i due `Math.max` **trasformano il dato che manca
     in un numero plausibile**, e la pezzatura prevista passa da **27 a 97
     cm** — con x20 da 13 a 45 e x80 da 49 a **173**. È il verso che ALLARMA,
     e manda a rifare una maglia che non ha niente che non va.
   Le due direzioni sono opposte e i testi devono distinguerle: un `pf` a
   zero e un x50 a 97 nascono dallo stesso dato mancante.

   ⛔ **UN CLAMP NON È UNA GUARDIA, ED È IL PUNTO TECNICO DI QUESTO BLOCCO.**
   `Math.max(0.05, pf)` e `Math.max(1, kg)` **servono** e restano: tengono in
   piedi il conto su dati VERI ma estremi (un consumo specifico bassissimo,
   una caricheta sotto il chilo), dove `pf^-0.8` esploderebbe. Quello che non
   va è che lo STESSO clamp coprisse anche il caso «il dato non c'è»: il
   clamp non sa distinguere un pf piccolo da un pf assente, e non è compito
   suo. Quindi l'ordine è: **prima si chiede se il dato c'è** (`fragSenzaConto`,
   che nomina il `null` per nome perché `+null` fa 0 e `Number.isFinite(0)`
   risponde `true`), **poi** si protegge il calcolo col clamp di sempre. Le
   prove di `run-kpi` pretendono tutt'e due le metà: che l'assenza dia `null`
   e che i clamp mordano ancora su un dato vero e piccolo.

   ⚠️ **UNO ZERO MISURATO RESTA ZERO**, come per `micFinestra` e
   `caricaTotale`: `kg` a 0 dà `pf` 0 — un consumo specifico davvero nullo è
   un fatto — e un `x50` vero, grosso, calcolato dal clamp. Quello che non
   deve passare è l'assenza travestita da zero.

   ⚠️ LA FORMULA NON CAMBIA DI UNA VIRGOLA, e nemmeno le sue costanti: A
   (Lilly/Cunningham), RWS, gli esponenti −0,8, 1/6 e 19/30 sono quelli di
   prima, spostati e non riscritti. L'unica differenza è che la scheda
   validatori scriveva l'ultimo esponente come **0,633** invece di **19/30**
   (0,6333…): su x50 vale un fattore 1,00005, cioè zero centimetri arrotondati
   — ma era la divergenza già nata fra due copie della stessa riga, ed è
   esattamente il motivo per cui adesso la riga è una sola.

   ⚠️ PERCHÉ DUE FUNZIONI E NON UNA. `fragKuzRam` risponde a «quanto è grosso
   il 50% passante»; `rosinRammler` a «che forma ha la curva intorno a quel
   numero», e vuole in più l'indice di uniformità `n`. Sono separate perché
   **la scheda validatori chiede solo la prima** — non calcola `n`, usa la
   curva KCO/Swebrec al suo posto — e una funzione sola l'avrebbe costretta a
   passare un `n` che non ha, cioè a farsi rispondere «non calcolabile» per
   un dato che non le serviva. Un «non calcolabile» dato per la ragione
   sbagliata è la famiglia del ponte che dà la colpa a chi compila.
   ⚠️ E `n` resta un ARGOMENTO invece di essere calcolato qui: le due copie
   della pagina lo calcolano in modi diversi di proposito (quella del 3D
   corregge con la precisione dell'innesco, quella dei KPI no), e unificarlo
   sarebbe una decisione sulla fisica, non un trasloco. */
export const FRAG_SENZA_CONTO = {
  carica:  { che:'la carica per foro non è un numero leggibile, e il consumo specifico è quella divisa per la roccia che il foro serve',
             come:'Reimposta la carica per foro nei parametri della volata.' },
  volume:  { che:'la maglia del foro (spalla × interasse × altezza del banco) non dà un volume leggibile, e senza quello non c’è un consumo specifico',
             come:'Reimposta spalla, interasse e altezza del banco nei parametri della volata.' },
  modello: { che:'il fattore roccia o l’energia relativa dell’esplosivo non sono numeri leggibili, e la formula di Kuznetsov li vuole tutt’e due',
             come:'Riscegli la litologia e l’esplosivo dagli elenchi.' },
};
/* `null` quando la pezzatura si può prevedere; altrimenti dice QUALI dei tre
   dati mancano — e se ne mancano più d'uno li nomina tutti, gemella di
   `micSenzaConto`, `caricaSenzaConto` e `ppvSenzaSoglia`.
   ⚠️ `modello` è un controllo di CONTRATTO, non un caso che la pagina possa
   raggiungere oggi: `rockFactorA` chiude A fra 1 e 16 e RWS ha già il suo
   `Math.max(8, …)`. Sta qui perché un chiamante nuovo non ci caschi in
   silenzio, e la prova lo dichiara per quello che è. */
export function fragSenzaConto(kg, vol, A, RWS){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const q = n(kg), v = n(vol), a = n(A), r = n(RWS);
  const senzaCarica  = !Number.isFinite(q) || q < 0;
  const senzaVolume  = !Number.isFinite(v) || v <= 0;
  const senzaModello = !Number.isFinite(a) || a <= 0 || !Number.isFinite(r) || r <= 0;
  if (!senzaCarica && !senzaVolume && !senzaModello) return null;
  const parti = [];
  if (senzaCarica)  parti.push(FRAG_SENZA_CONTO.carica);
  if (senzaVolume)  parti.push(FRAG_SENZA_CONTO.volume);
  if (senzaModello) parti.push(FRAG_SENZA_CONTO.modello);
  return { carica:senzaCarica, volume:senzaVolume, modello:senzaModello,
    che:  parti.map(p => p.che).join('; e '),
    come: parti.map(p => p.come).join(' ') };
}
/* I chili di esplosivo per metro cubo di roccia, o `null` se uno dei due non
   c'è. Sta a parte perché la pagina lo chiede in QUATTRO posti che non hanno
   niente a che fare con Kuznetsov — il riferimento della mappa dell'energia,
   il consumo del singolo foro, la forma del cumulo e il riquadro del 3D — e
   perché con la carica illeggibile rispondeva **0**, cioè il numero più
   tranquillo che si possa dare a una cosa mai letta. */
export function consumoSpecifico(kg, vol){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const q = n(kg), v = n(vol);
  if (!Number.isFinite(q) || q < 0 || !Number.isFinite(v) || v <= 0) return null;
  return q / v;
}
/* B3 (14/09) — trasloco con cambio di firma: `pfNominale` viveva nella
   pagina come funzione di un argomento solo (nessuno, leggeva `D2` dalla
   chiusura), qui prende `D2` come parametro — stesso schema già usato per
   ogni altra funzione "legame di una riga" di questa fascia. Il consumo
   specifico DI PROGETTO: quanti kg di esplosivo per m³ di roccia, dalla
   maglia nominale (non dal foro reale, che ha `pfLoc` — vedi il commento
   di `consumoSpecifico` su Kuz-Ram). */
export function pfNominale(D2){
  return consumoSpecifico(D2.kg, volumeForo(D2.B, D2.S, D2.prof));
}
/* Il RWS effettivo (12/09, unità 126): l'energia relativa dell'esplosivo,
   ridotta se il foro è bagnato — l'acqua penalizza l'esplosivo tanto meno
   quanto più è resistente all'acqua (`Nulla` 70%, `Eccellente` 0%). Viveva
   scritta una volta sola dentro `genesi.html` (`renderScheda2D`, che la
   chiede per `fragKuzRam`); esce ora perché il nuovo obiettivo di pezzatura
   (sotto) la chiede anche lui, e la regola di casa è che una formula che
   serve a due punti si scrive una volta, non due — è la stessa lezione già
   pagata su `computeMIC`/`ppvDaSd`. Il pavimento (8) è quello che c'era già. */
export const PENALITA_ACQUA = { Nulla:0.70, Bassa:0.40, Media:0.18, Buona:0.05, Eccellente:0 };
export function rwsEffettiva(rwsBase, bagnato, acquaClasse){
  const base = Number.isFinite(+rwsBase) ? +rwsBase : 100;
  const pen = bagnato ? (PENALITA_ACQUA[acquaClasse] ?? 0) : 0;
  return Math.max(8, base * (1 - pen));
}
/* Il consumo specifico (kg/m³) e la pezzatura mediana prevista (cm), o `null`
   per quello dei due che non si può contare — e sono DUE domande diverse: il
   consumo specifico è un numero vero anche quando il fattore roccia non c'è.
   `vol` è il volume di roccia che UN foro serve (spalla × interasse × altezza).
   La bandiera `calcolabile` è quella che i disegnatori devono leggere: senza,
   un `null` si stamperebbe tranquillo lo stesso (regola 20 di `run-stile`). */
export function fragKuzRam(v){
  const o = v || {};
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const perche = fragSenzaConto(o.kg, o.vol, o.A, o.RWS);
  const pf = consumoSpecifico(o.kg, o.vol);
  if (perche) return { pf, x50:null, calcolabile:false,
    carica:perche.carica, volume:perche.volume, modello:perche.modello,
    che:perche.che, come:perche.come };
  /* I CLAMP, dopo la guardia e non al posto suo: qui `pf` e `kg` ci sono di
     sicuro, e questi due numeri servono soltanto a tenere in piedi il conto
     su un dato vero ma estremo. */
  const x50 = n(o.A) * Math.pow(Math.max(0.05, pf), -0.8)
            * Math.pow(Math.max(1, n(o.kg)), 1/6) * Math.pow(115 / n(o.RWS), 19/30);
  return { pf, x50, calcolabile:true, carica:false, volume:false, modello:false, che:'', come:'' };
}

/* ══════════════════════════════════════════════════════════════════════════
   G32 · LA CARICA PER CENTRARE UN OBIETTIVO DI PEZZATURA (12/09, unità 126)
   ══════════════════════════════════════════════════════════════════════════
   `fragKuzRam` risponde a «con questa carica, che pezzatura viene?». Qui si fa
   la domanda al contrario — «per questa pezzatura, quanta carica serve?» —
   invertendo la STESSA formula, senza toccarla: la roccia, l'esplosivo e la
   maglia (volume per foro) restano quelli del progetto, e si risolve per il
   solo `kg` che li farebbe tornare all'obiettivo.

   Algebra (da `fragKuzRam`, con `pf = kg/vol`):
     x50 = A · pf^−0.8 · kg^(1/6) · (115/RWS)^(19/30)
         = A · (kg/vol)^−0.8 · kg^(1/6) · (115/RWS)^(19/30)
         = [A · vol^0.8 · (115/RWS)^(19/30)] · kg^(−0.8+1/6)
   e −0.8+1/6 = −19/30, quindi, chiamato C il fattore fra parentesi quadre:
     x50 = C · kg^(−19/30)  →  kg = (C / x50)^(30/19)
   Verificato PAROLA PER PAROLA — non a occhio — con 50.000 obiettivi generati
   a caso: `fragKuzRam(kg_ricavato).x50` torna l'obiettivo con un errore
   relativo peggiore di 8·10⁻¹⁶ (rumore binario, non un difetto), su ogni
   caso che non tocca i due CLAMP di `fragKuzRam` (vedi sotto).

   ⛔ E I DUE CLAMP DI `fragKuzRam` SONO IL DOMINIO IN CUI QUESTA INVERSIONE
   NON SI PUÒ FIDARE, NON UN DETTAGLIO. `fragKuzRam` tiene `pf` sopra 0,05 e
   `kg` sopra 1 per non far esplodere il conto su un dato vero ma estremo:
   sotto quelle soglie la funzione diretta smette di distinguere un kg da un
   altro (schiaccia tutto sulla soglia), quindi la sua inversa — che quella
   soglia non la conosce — calcolerebbe un numero preciso per un'equazione
   che, dall'altra parte, non è più quella. Misurato: senza questa guardia,
   50.000 obiettivi generati a caso ne restituivano 11.752 (23%) con un
   risultato che RIAPPLICATO in avanti non tornava affatto all'obiettivo —
   silenziosamente sbagliato, non solo impreciso. La regola è la stessa di
   `contrasto.mjs` su un righello che non sa quanto sbaglia: si dichiara
   incerto, non si stampa un numero che sembra preciso e non lo è.
   `fuoriDominio` è vero quando il kg calcolato cade in quella zona (kg<1 o
   pf<0.05): il chiamante lo mostra come «obiettivo troppo grossolano per
   questo modello», non come un kg qualunque. */
export const CARICA_TARGET_SENZA_CONTO = {
  obiettivo: { che:'la pezzatura obiettivo non è un numero leggibile, o non è maggiore di zero',
               come:'Scrivi un obiettivo di pezzatura mediana (x50), in centimetri, maggiore di zero.' },
};
export function caricaTargetSenzaConto(x50Target, vol, A, RWS){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const xt = n(x50Target);
  const senzaObiettivo = !Number.isFinite(xt) || xt <= 0;
  const perche = fragSenzaConto(1, vol, A, RWS);  // `kg` finto: qui serve solo il verdetto su volume/modello
  if (!senzaObiettivo && !perche) return null;
  const parti = [];
  if (senzaObiettivo) parti.push(CARICA_TARGET_SENZA_CONTO.obiettivo);
  if (perche && perche.volume) parti.push(FRAG_SENZA_CONTO.volume);
  if (perche && perche.modello) parti.push(FRAG_SENZA_CONTO.modello);
  return { obiettivo:senzaObiettivo, volume:!!(perche&&perche.volume), modello:!!(perche&&perche.modello),
    che: parti.map(p=>p.che).join('; e '), come: parti.map(p=>p.come).join(' ') };
}
/* ⛔ 17/09, dal terzo giro di deep-pass: SENZA `capacitaForo` QUESTA FUNZIONE
   PUÒ PROPORRE UNA CARICA CHE NON ENTRA NEL FORO, SENZA NESSUN AVVISO.
   `fuoriDominio` dice solo se il modello Kuz-Ram è ancora affidabile
   (1-100 cm, o i clamp bassi): un obiettivo di pezzatura dentro quel dominio
   può comunque chiedere una carica per foro superiore a quanto la geometria
   del foro (diametro, profondità, sottoperforazione, borraggio, densità
   dell'esplosivo — la stessa che calcola `caricaForoDaGeometria`) può
   fisicamente contenere: misurato sul progetto demo, un obiettivo x50=5cm
   propone 880 kg/foro contro un massimo fisico di 58 kg (15,2×), con
   `fuoriDominio:false` e nessun segnale se non un avviso sulla vibrazione
   proiettata — che parla d'altro. `capacitaForo` è OPZIONALE apposta:
   quando il chiamante non la passa (o il foro non è ancora definito),
   `superaCapacitaForo` resta `null` — «non verificato», non «va bene» —
   perché l'assenza di un dato non è un dato favorevole. */
export function caricaDaX50Target(x50Target, vol, A, RWS, capacitaForo){
  const perche = caricaTargetSenzaConto(x50Target, vol, A, RWS);
  const cf = (capacitaForo === null || capacitaForo === undefined) ? NaN : +capacitaForo;
  const capacitaNota = Number.isFinite(cf) && cf > 0;
  if (perche) return { kg:null, pf:null, calcolabile:false, fuoriDominio:false,
    troppoFine:false, troppoGrossolano:false,
    obiettivo:perche.obiettivo, volume:perche.volume, modello:perche.modello,
    che:perche.che, come:perche.come,
    capacitaForo:capacitaNota?cf:null, superaCapacitaForo:null };
  const xt = +x50Target, v = +vol, a = +A, r = +RWS;
  /* ⏱️ 12/09 (unità 126): il lato BASSO di `fuoriDominio` (kg<1 o pf<0.05)
     prende dove i clamp di `fragKuzRam` rendono l'inversione ambigua.
     ⏱️ 12/09 (unità 127, dalla ricerca in docs/RICERCA_CONTINUA_GENESI.md,
     sezione 2026-09-12): mancava il lato ALTO, ed era un buco diverso, non lo
     stesso. `fragKuzRam` non ha un clamp gemello in alto, quindi un obiettivo
     assurdamente fine restituiva un kg matematicamente corretto ma enorme,
     senza nessun avviso — non ambiguità, estrapolazione. La ricerca (solo
     risultati WebSearch, marcata di seconda mano, nessuna fonte legge un
     tetto sul consumo specifico) trova però un vincolo reale: la curva di
     Rosin-Rammler su cui il Kuz-Ram poggia è dichiarata precisa fra 10 e
     1000 mm (1-100 cm) — e il vincolo è SIMMETRICO, non solo sul fine: un
     target grossolano oltre 100 cm è fuori dominio quanto uno sotto 1 cm,
     e non è detto che ci arrivi passando per `kg<1` (dipende dalla maglia:
     misurato un caso reale in cui xt=150 cm dà ancora kg>1 e pf>0.05). Né
     l'uno né l'altro sono un numero di powder factor inventato: è il
     limite dimensionale che la letteratura dichiara per il modello stesso. */
  const troppoFine = xt < 1, troppoGrossolano = xt > 100;
  const C = a * Math.pow(v, 0.8) * Math.pow(115/r, 19/30);
  const kg = Math.pow(C/xt, 30/19);
  const pf = kg/v;
  return { kg, pf, calcolabile:true,
    fuoriDominio:(kg<1||pf<0.05||troppoFine||troppoGrossolano), troppoFine, troppoGrossolano,
    obiettivo:false, volume:false, modello:false, che:'', come:'',
    capacitaForo:capacitaNota?cf:null, superaCapacitaForo:capacitaNota?(kg>cf):null };
}

/* ══════════════════════════════════════════════════════════════════════════
   G38 · LA PRIMA FETTA DI G7 (ottimizzatore di volata), 14/09
   ══════════════════════════════════════════════════════════════════════════
   Scomposto prima di scrivere codice (vedi vault/ROADMAP_SETTIMANA.md, voce
   G7): un ottimizzatore vero tocca anche la vibrazione, e la sequenza che
   decide la MIC vive in `computeSeq2D`, nella PAGINA — costruirla qui
   sarebbe la TERZA copia della stessa domanda (la firma troppo stretta che
   CLAUDE.md avverte di non ricopiare). Questa prima fetta resta dentro il
   dominio già coperto da funzioni pure ESISTENTI: dato un intervallo di
   burden e una frammentazione TARGET fissa, quanta carica servirebbe per
   ogni burden della griglia? Nessuna soglia di sicurezza, nessuna vibrazione,
   nessuna sequenza — solo `volumeForo` + `caricaDaX50Target`, già in questo
   modulo, chiamate una per riga.
   Il rapporto S/B è un parametro: la funzione non lo assume mai 1 o 1,15
   (quel numero di mestiere non è suo — chi chiama lo decide, come fa già
   `genMaglia2D` con `D2.stagger`). */
export function curvaBurdenCarica(opz){
  const o = opz || {};
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const bMin = n(o.bMin), bMax = n(o.bMax), passo = n(o.passo), rapportoSB = n(o.rapportoSB);
  const H = n(o.prof), A = n(o.A), RWS = n(o.RWS), x50Target = n(o.x50Target);
  /* opzionale, come in `caricaDaX50Target`: il foro non cambia da una riga
     all'altra della curva (solo B/S variano), quindi lo si calcola una
     volta sola fuori dal ciclo e lo si passa a ogni riga. */
  const capacitaForo = n(o.capacitaForo);
  if (!Number.isFinite(bMin) || bMin <= 0 || !Number.isFinite(bMax) || bMax < bMin
      || !Number.isFinite(passo) || passo <= 0 || !Number.isFinite(rapportoSB) || rapportoSB <= 0)
    return [];
  /* tetto difensivo, non un limite d'uso (la stessa forma della griglia dei
     4 mm di `drawDesign2D`): un passo scritto a mano fuori misura non deve
     produrre un array senza fine */
  const righe = [];
  for (let i = 0; i * passo <= (bMax - bMin) + 1e-9 && righe.length < 200; i++) {
    const B = +(bMin + i * passo).toFixed(3);
    const S = +(B * rapportoSB).toFixed(3);
    const vol = volumeForo(B, S, H);
    const t = caricaDaX50Target(x50Target, vol, A, RWS, capacitaForo);
    righe.push({ B, S,
      kg: t.kg === null ? null : +t.kg.toFixed(2),
      pf: t.pf === null ? null : +t.pf.toFixed(3),
      calcolabile: t.calcolabile, fuoriDominio: t.fuoriDominio,
      troppoFine: t.troppoFine, troppoGrossolano: t.troppoGrossolano,
      che: t.che, come: t.come,
      superaCapacitaForo: t.superaCapacitaForo });
  }
  return righe;
}

/* La curva Rosin-Rammler intorno a una pezzatura mediana: dimensione
   caratteristica e i due passanti che la pagina mostra. `null` su tutt'e tre
   quando manca `x50` o l'indice di uniformità — un x20 inventato è la stessa
   bugia dell'x50 inventato, un gradino più in giù. */
export function rosinRammler(x50, n){
  const num = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const x = num(x50), u = num(n);
  if (!Number.isFinite(x) || x <= 0 || !Number.isFinite(u) || u <= 0)
    return { calcolabile:false, n:null, xc:null, x80:null, x20:null };
  const xc = x / Math.pow(0.693, 1/u);
  return { calcolabile:true, n:u, xc,
    x80: xc * Math.pow(-Math.log(0.2), 1/u),
    x20: xc * Math.pow(-Math.log(0.8), 1/u) };
}

/* ══════════════════════════════════════════════════════════════════════════
   G14 · UN CLAMP NON È UNA GUARDIA — UN PIANO PIÙ SU, NEI CAMPI
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL BLOCCO G13 HA CHIUSO TRE NUMERI TRANQUILLI (la MIC, la carica totale
   col costo, la pezzatura) E SI POTEVANO RIAPRIRE IN DUE CLIC. Misurato nel
   browser il 09/08 su una volata salvata con `design.kg:null`:
   · primo clic, «Apri»: il campo «Carica» mostrava **«0»** e «Esplosivo
     totale» **«0»** — uno zero inventato DENTRO un campo, che è peggio di uno
     zero in un riquadro perché sembra un dato che qualcuno ha scritto. La
     scheda però diceva già il vero: MIC, X50 e PPV «non calcolabile»;
   · secondo clic su un campo QUALUNQUE (provato con la **sequenza**, che con
     la carica non c'entra niente): `applyDesign` faceva
     `Math.max(5, Math.min(200, gvv('dKg')||D2.kg))` — `Math.min(200, null)` fa
     **0** e il clamp basso lo porta a **5**. Da lì «Esplosivo totale 60 kg»,
     MIC **30 kg**, X50 **127 cm**, PPV **3,8 mm/s**: quattro numeri, nessun
     toast, nessun errore, e il «non calcolabile» appena costruito sparito.
   `Math.max(min, …)` esiste per un valore VERO e piccolo, non per un valore
   ASSENTE — è la stessa frase del blocco G13, applicata ai campi invece che
   al calcolo. Quindi prima si chiede se il dato c'è, POI si stringe: i clamp
   restano dove sono e mordono come prima sui dati veri ed estremi.

   ⚠️ DUE COSE LE HA BOCCIATE LA PROVA IN SCRATCHPAD, prima che la funzione
   entrasse qui, e tutt'e due sono già scritte in CLAUDE.md:
   1. il controllo sui LIMITI era `Number.isFinite(+min)`, e `+null` fa **0**,
      che è finito: `valoreCampo(5, 5, null, 200)` passava e stringeva contro
      un minimo di zero. Il `null` va nominato per nome anche qui — è lo stesso
      inciampo di `micSenzaConto`, in un argomento a cui non si guarda;
   2. l'arrotondamento va PRIMA del clamp, come lo scrive la pagina. Non è
      indifferente: con un minimo non intero (2,5) un `2,4` esce **2,5**
      arrotondando prima e **3** arrotondando dopo. Oggi i campi interi hanno
      limiti interi e i due modi coincidono; domani no.

   ⚠️ IL CONTRATTO. `letto` è quello che si legge dal campo (`gvv`, che su un
   testo incomprensibile risponde NaN — MAI zero); `progetto` è il valore che
   il progetto sta usando. La risposta è, in ordine: il campo se si legge, il
   progetto se il campo non si legge, e `null` se non c'è nessuno dei due.
   Quel `null` è la convenzione di tutto l'ecosistema, e i tre blocchi qui
   sopra la sanno già trattare (`micSenzaConto`, `caricaSenzaConto`,
   `fragSenzaConto`): non serve inventare niente di nuovo a valle.
   ⚠️ Uno zero SCRITTO resta un dato: `valoreCampo(0, 60, 5, 200)` dà **5**,
   cioè il clamp su un valore vero, non il ripiego sul progetto. È la
   differenza fra «ho scritto zero» e «non ho scritto niente», la stessa che
   `micFinestra` e `caricaTotale` fanno un piano più giù. */
export function valoreCampo(letto, progetto, min, max, intero){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const lo = n(min), hi = n(max);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi)
    throw new TypeError('valoreCampo: i limiti vogliono due numeri, con min ≤ max');
  const stretto = (v) => Math.max(lo, Math.min(hi, intero ? Math.round(v) : v));
  const l = n(letto);
  if (Number.isFinite(l)) return stretto(l);
  const p = n(progetto);
  if (Number.isFinite(p)) return stretto(p);
  return null;
}

/* ⛔ E L'ALTRA METÀ: UN CAMPO CHE RESTA VUOTO È MUTO, e il silenzio è il
   difetto di partenza — non lo zero. Togliere lo «0» dal campo della carica
   senza dire niente sposterebbe la bugia dal numero al vuoto: chi apre una
   volata vecchia vedrebbe un campo bianco e penserebbe a un difetto della
   pagina, non a un dato che quella volata non ha mai avuto.
   Quindi all'apertura si NOMINANO i campi senza un valore leggibile, con la
   stessa forma delle tre famiglie qui sopra: `che` (che cosa manca) e `come`
   (che cosa si fa). La tabella è una sola perché la frase è una sola: due
   copie prima o poi chiamano lo stesso campo con due nomi diversi.
   ⚠️ I nomi sono quelli che si LEGGONO sullo schermo, non le chiavi. */
export const CAMPI_VOLATA = {
  B:'spalla', S:'interasse', prof:'altezza del banco', diam:'diametro',
  perRow:'fori per fila', file:'numero di file', kg:'carica per foro',
  stem:'borraggio', sub:'sottoperforazione', incl:'inclinazione',
  ritardo:'ritardo tra fori', ritardoFila:'ritardo tra file',
  ucs:'resistenza della roccia', eMod:'modulo elastico',
  acquaCol:'colonna d’acqua', psSpacing:'interasse del presplit',
  psCharge:'carica lineare del presplit', recDist:'distanza del recettore',
  recFreq:'frequenza al recettore', decks:'cariche per foro',
  deckStem:'borraggio tra deck',
};
/* `null` quando la volata ha un numero leggibile in ogni campo; altrimenti
   dice QUALI mancano. Legge solo le chiavi che conosce: un `design` che porta
   roba in più (o in meno) non è un errore, è una volata salvata da una
   versione diversa dell'app.
   ⚠️ `undefined` e chiave ASSENTE sono la stessa cosa e NON si segnalano: una
   volata salvata prima che il campo esistesse non ha un dato mancante, ha un
   campo che allora non c'era. Quello che si segnala è il valore che c'è ed è
   illeggibile — `null`, `''`, una parola. È la differenza fra il dato ASSENTE
   e il dato CORROTTO, la stessa che `run-demo` pretende. */
export function volataSenzaValori(design){
  const d = design || {};
  const campi = [];
  for (const k of Object.keys(CAMPI_VOLATA)){
    if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
    const v = d[k];
    if (v === undefined) continue;
    const x = (v === null || v === '') ? NaN : +v;
    if (!Number.isFinite(x)) campi.push({ chiave:k, nome:CAMPI_VOLATA[k] });
  }
  if (!campi.length) return null;
  const nomi = campi.map(c => c.nome), uno = nomi.length === 1;
  return { campi,
    che: (uno ? 'un valore non si legge: ' : nomi.length + ' valori non si leggono: ') + nomi.join(', '),
    come: uno
      ? 'Riscrivilo nei parametri: finché manca, i numeri che dipendono da lui restano «non calcolabile» invece di essere inventati.'
      : 'Riscrivili nei parametri: finché mancano, i numeri che dipendono da loro restano «non calcolabile» invece di essere inventati.' };
}

/* ══════════════════════════════════════════════════════════════════════════
   G15 · IL VOLUME CHE UN FORO SERVE — e la spalla di 3 m che nessuno ha scritto
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL BLOCCO G14 HA TOLTO IL NUMERO INVENTATO DAL CAMPO DELLA CARICA, E LA
   GEOMETRIA È RIMASTA COM'ERA. Misurato il 09/08 sulla stessa volata salvata,
   con `design.B:null`:
   · `pfNominale()` della pagina faceva
     `consumoSpecifico(D2.kg, (D2.B||3)*(D2.S||3.5)*(D2.prof||10))`, cioè
     **SUBITO DOPO «Apri»**, senza nemmeno il secondo clic, calcolava il
     consumo specifico di progetto su un volume di **105 m³** costruito con una
     spalla di 3 m, un interasse di 3,5 m e un banco di 10 m che nessuno aveva
     scritto: **0,552 kg/m³**, un numero pieno, con l'aria di una misura;
   · e al secondo clic `applyDesign` faceva `Math.max(1.5, Math.min(8, …))` su
     dodici campi di geometria — la stessa forma già corretta per la carica —
     portando la spalla a **1,5 m**, il diametro a **50 mm**, i fori per fila a
     **3**, l'altezza a **6 m**. Cioè un progetto intero, diverso da quello di
     un istante prima, e tutt'e due inventati.
   Le due metà vanno fatte insieme: correggere solo `applyDesign` lascerebbe la
   bugia dov'era, perché `pfNominale` la reinventa a valle.

   ⚠️ TRE BOZZE, E LA PROVA IN SCRATCHPAD LE HA DIVISE SU UN CASO SOLO.
   Sui dodici casi veri (null, `''`, una parola, la chiave assente, i numeri
   scritti come stringhe da `localStorage`, lo zero, il negativo) passavano
   **tutt'e tre**, compresa la più corta — togliere i ripieghi e scrivere
   `consumoSpecifico(D2.kg, D2.B*D2.S*D2.prof)`. Regge perché `null*3.5` fa
   **0** e un volume zero `consumoSpecifico` lo rifiuta: cioè la risposta
   giusta arriva **dall'aritmetica di `null`**, non da una domanda. Basta che un
   giorno quel volume si scriva con un `+` — un epsilon, un ripiego, una somma
   di deck — perché lo zero non sia più zero e il numero inventato torni senza
   che niente diventi rosso. Provato: con `(B*S*prof)+0.0001` la bozza corta
   passa **0,00055 kg/m³** e la funzione qui sotto continua a dire `null`.
   Quindi la domanda «il dato c'è?» si scrive una volta, per nome, come nel
   blocco G14 — è la stessa riga di CLAUDE.md, `+null` fa 0 e `Number.isFinite(0)`
   risponde `true`.
   ⛔ E LA PRIMA STESURA DELLA PROVA NON SAPEVA FALLIRE, il che è peggio che non
   averla: rimettendo la bozza corta dentro questa funzione, le 2.033 prove
   restavano **verdi**. La ragione è che l'argomento sull'epsilon dimostra un
   principio ma non interroga la funzione: sui casi veri le due rispondono
   uguale. Il caso che le divide c'è, e si misura — **due segni meno si
   annullano**: `(-3)×(-3,5)×10` fa **105**, cioè esattamente il volume della
   maglia sana, e la bozza corta lo accetta. Guardare ogni FATTORE invece del
   prodotto è quello che lo impedisce, e adesso è una riga rossa se qualcuno
   torna indietro.

   ⚠️ PERCHÉ STA NEL MODULO E NON NELLA PAGINA. Perché la prova che conta è
   quella del **percorso** (apro, non tocco niente, guardo il numero) e le
   prove del percorso girano in `node`: una guardia scritta dentro `pfNominale`
   sarebbe corretta e **non provabile**. E perché il nome esisteva già in prosa
   — l'intestazione di `fragKuzRam` dice «`vol` è il volume di roccia che UN
   foro serve (spalla × interasse × altezza)»: qui diventa una funzione.
   ⚠️ Uno ZERO non è un volume: una spalla di 0 m non serve niente. I tre
   fattori devono essere **positivi**, non solo leggibili — ed è la stessa
   soglia che `consumoSpecifico` usa sul volume che riceve. */
export function volumeForo(B, S, H){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const b = n(B), s = n(S), h = n(H);
  if (!(Number.isFinite(b) && b > 0)) return null;
  if (!(Number.isFinite(s) && s > 0)) return null;
  if (!(Number.isFinite(h) && h > 0)) return null;
  return b * s * h;
}

/* ⛔ IL CONFINAMENTO DEL COLLETTO (SDOB), BLOCCO G17 — l'ULTIMO posto in cui
   la carica per foro assente si trasformava in un numero, e per giunta in
   quello che RASSICURA.
   La formula (Chiappetta/McKenzie) è `(borraggio + 5·Ø) / W_top^(1/3)`, dove
   `W_top` è la carica contenuta nei dieci diametri superiori della colonna:
   `min(carica, carica_lineare · 10 · Ø)`. Con la carica illeggibile
   `Math.min(null, cap)` fa **0**, il clamp `Math.max(0.1, …)` lo tira su a un
   decimo di chilo, e l'SDOB esce **5,84 m/kg⅓** — misurato l'13/08 sulla
   maglia di dimostrazione (Ø102, borraggio 2,2 m) contro **1,43** veri. Non è
   solo un numero inventato: 5,84 supera la soglia 1,4 e la riga si dipinge
   VERDE con scritto «colletto ben confinato: disturbo superficiale minimo».
   Cioè un dato che nessuno ha scritto rendeva il progetto più tranquillo di
   quello vero — il principio del fondatore alla lettera, e nel verso peggiore.
   ⛔ E LA STESSA FORMULA ERA SCRITTA DUE VOLTE, con DUE ripieghi diversi: la
   scheda validatori faceva `min(null, cap)` = 0 → SDOB 5,84, e `flyrockEst`
   faceva `Q = D2.kg || P.kg || 50`, cioè si INVENTAVA una carica intera. Le
   due bugie si compensavano per caso — la scheda mostrava 5,84 in una riga e
   la riga sotto usava 1,43 per la gittata — quindi togliere l'invenzione a una
   sola delle due avrebbe **dimezzato** la distanza di sgombero senza che nulla
   diventasse rosso (misurato: gittata 101 m con la carica inventata, 49,3 m
   con lo zero, cioè sgombero persone 404 m → 197 m). È la regola di CLAUDE.md
   sul contratto allargato a metà, vista prima che facesse danno.
   ⚠️ I DUE CLAMP RESTANO, e sono clamp per dati VERI ma estremi: `max(0.1,
   W_top)` regge una carica vera di zero chili (nessun esplosivo nel colletto:
   il confinamento è davvero totale, e 5,84 lì è la risposta giusta), e la
   densità ha il suo valore d'appoggio perché arriva da un elenco chiuso.
   Quello che non si accetta più è l'ASSENZA travestita da numero.
   ⚠️ Il borraggio ammette lo ZERO (un colletto non borrato è un progetto
   pessimo, non un dato mancante: SDOB 0,27, pallino rosso); il diametro no,
   perché entra al quadrato nella carica lineare e uno zero non è un foro. */
export const CONFIN_SENZA_CONTO = {
  carica:    { che:'la carica per foro non è un numero leggibile, e il confinamento del colletto è il borraggio diviso per la radice cubica della carica che gli sta sotto',
               come:'Reimposta la carica per foro nei parametri della volata.' },
  borraggio: { che:'il borraggio non è un numero leggibile, ed è proprio la parte del foro che tiene giù il colletto',
               come:'Reimposta il borraggio nei parametri della volata.' },
  diametro:  { che:'il diametro del foro non è un numero leggibile, e decide quanta carica sta nei dieci diametri superiori della colonna',
               come:'Reimposta il diametro nei parametri della volata.' },
};
/* L'SDOB, la carica dei dieci diametri superiori e la carica lineare — o
   `null` su tutt'e tre quando uno dei dati non c'è, con la ragione accanto.
   La bandiera da leggere è `calcolabile`: senza, un `null` si stampa
   tranquillo lo stesso (regola 20 di `run-stile`).
   Gemella di `fragSenzaConto`, `caricaSenzaConto`, `micSenzaConto` e
   `ppvSenzaSoglia`: se manca più di un dato li nomina tutti. */
export function confinamentoColletto(v){
  const o = v || {};
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const q = n(o.kg), s = n(o.stem), d = n(o.diam), r = n(o.densita);
  const senzaCarica    = !Number.isFinite(q) || q < 0;
  const senzaBorraggio = !Number.isFinite(s) || s < 0;
  const senzaDiametro  = !Number.isFinite(d) || d <= 0;
  if (senzaCarica || senzaBorraggio || senzaDiametro) {
    const parti = [];
    if (senzaCarica)    parti.push(CONFIN_SENZA_CONTO.carica);
    if (senzaBorraggio) parti.push(CONFIN_SENZA_CONTO.borraggio);
    if (senzaDiametro)  parti.push(CONFIN_SENZA_CONTO.diametro);
    return { sdob:null, wTop:null, qLin:null, calcolabile:false,
      carica:senzaCarica, borraggio:senzaBorraggio, diametro:senzaDiametro,
      che:  parti.map(p => p.che).join('; e '),
      come: parti.map(p => p.come).join(' ') };
  }
  const Dm = d / 1000;
  const rho = (Number.isFinite(r) && r > 0) ? r : 0.82;
  const qLin = caricaLineare(d, rho);   // G31: la stessa formula di `caricaForoDaGeometria`, scritta una volta
  const wTop = Math.min(q, qLin * 10 * Dm);
  const sdob = (s + 5 * Dm) / Math.pow(Math.max(0.1, wTop), 1 / 3);
  return { sdob, wTop, qLin, calcolabile:true,
    carica:false, borraggio:false, diametro:false, che:'', come:'' };
}

/* ⛔ LA SPALLA ASSENTE E LA GITTATA — blocco B0-tervicies, il ripiego che G17
   aveva misurato e lasciato lì per non allargare un'unità sulla sicurezza.
   In `flyrockEst` stava scritto `B = D2.B || SPALLA`: con la spalla mai
   scritta, la distanza di sgombero delle PERSONE veniva da un burden che
   nessuno aveva messo — il ripiego globale `let SPALLA = 3.0`.
   ⛔ E QUI IL RIPIEGO NON SI POTEVA TOGLIERE E BASTA, ma nemmeno sostituire con
   un «non calcolabile» secco: la misura dice due cose opposte, e tutt'e due
   contano. `B` entra in UNA sola delle quattro formule — il face burst di
   Richards&Moore — e la gittata è il MASSIMO delle quattro, con il tetto di
   Lundborg sopra. Quindi:
   · su 40.500 combinazioni realistiche (Ø 51–165 × borraggio × inclinazione ×
     UCS × densità × B 1,5–8) il burden non sposta la gittata di un millimetro
     nell'**83,1%** dei casi — lì domina McKenzie o il cratering, e spegnere la
     riga toglierebbe dallo schermo una distanza di sgombero GIUSTA;
   · nel **14,1%** il ripiego RASSICURA — dice una gittata più corta del vero —
     e nel 2,8% allarma. Misurato sul prodotto vero, non sulla carta: stessa
     cava Ø102, borraggio 2,2 m, carica 58 kg, con la spalla vera di 1,5 m la
     scheda scrive «133 m → sgombero 267 / 533 m», con la spalla ASSENTE
     «101 m → 202 / 404 m». **129 metri di sgombero persone in meno**, e niente
     sullo schermo che lo dica.
     Su una cava a piccolo diametro (Ø51, borraggio 4 m, UCS 250, carica 12 kg),
     dove il face burst domina davvero: spalla vera 1,5 m → «51 m → 101 / 203
     m»; spalla assente → «8 m → **17 / 33 m**». Sei volte più corta.
   ⚠️ E il difetto non si vedeva affiancando le righe come nel blocco G17,
   perché la riga della gittata **non cambia**: sulla maglia di dimostrazione
   dice 101 m con la spalla e 101 m senza. Delle 29 righe della scheda ne
   cambiano 14 togliendo la spalla, e questa è fra le quindici che restano
   IDENTICHE — cioè il ripiego aveva riempito il buco così bene che il metodo
   del confronto la assolveva. Un numero identico non è un numero verificato.
   ⚠️ Provata e SMENTITA l'ipotesi che `SPALLA` si portasse dietro la spalla
   del progetto aperto prima: aprendo una volata con B=8 e poi quella senza
   spalla, la scheda dice gli stessi 101 m di quando la si apre da sola.
   `applyDesign` non gira all'apertura, quindi `SPALLA` resta al suo 3,0
   iniziale. Il ripiego è un numero fisso, non un residuo — e va detto, se no
   qualcuno rifà la misura.
   ⛔ LE SOGLIE E LE FORMULE NON SI TOCCANO: Richards&Moore, McKenzie e
   Lundborg restano dove sono e come sono, e questa funzione non ne conosce
   nessuna — riceve `lff` come funzione e gli altri due numeri già calcolati.
   Qui si decide soltanto CHE COSA SI FA QUANDO UN INGRESSO MANCA.
   ⚠️ L'intervallo 1,5–8 m non è una soglia inventata per l'occasione: è il
   dominio che l'app stessa impone alla spalla, scritto già in due posti
   (`valoreCampo(gvv('dB'), D2.B, 1.5, 8)` in `applyDesign` e il clamp
   dell'import XML). Con la spalla ignota la gittata sta fra i suoi due capi;
   `lff` decresce con `B`, quindi il capo basso dà la gittata più lunga. */
export const FLY_SENZA_SPALLA = {
  che: 'la spalla (burden) non è un numero leggibile, ed è lei a decidere il meccanismo "face burst" di Richards&Moore — quello che governa la gittata quando la roccia davanti al foro è poca',
  come: 'Reimposta la spalla nei parametri della volata.',
};
/* ⛔ LA SORELLA, e il 14/08 mancava a metà. Nella riga «Flyrock inverso» il
   confronto sulla SPALLA era già stato reso onesto (`_Binv`, con questo
   messaggio accanto); quello sul BORRAGGIO no, ed era rimasto
   `okS = (D2.stem || 2.5) >= inv.minStem`. Misurato: con il borraggio
   illeggibile e un requisito di 1,9 m, il 2,5 di comodo passa — la riga
   scriveva «Il borraggio di progetto **rispetta** il suo», cioè una promessa
   fatta su un numero che nessuno aveva scritto, e nel verso che rassicura.
   È la stessa forma della spalla: il REQUISITO si scrive (non dipende dal
   progetto), il CONFRONTO no. */
export const FLY_SENZA_BORRAGGIO = {
  che: 'il borraggio non è un numero leggibile, ed è lui a decidere se il progetto rispetta il minimo ricavato dal calcolo inverso',
  come: 'Reimposta il borraggio nei parametri della volata.',
};
/* La gittata quando la spalla NON c'è: il numero se la spalla non lo decide,
   `null` con la ragione se lo decide. `lff(B)` è il face burst del chiamante
   (la formula resta sua), `altri` il massimo degli altri meccanismi, `tetto`
   il limite di Lundborg.
   La bandiera da leggere è `calcolabile`; `meccanismoNoto` è la seconda, e
   serve al caso in cui il NUMERO è certo ma il NOME del meccanismo dominante
   no — succede quando gli altri meccanismi hanno già superato il tetto: la
   gittata è il tetto da tutt'e due i capi, ma l'argomento massimo cambia. Un
   nome di meccanismo scritto lì sarebbe inventato come il burden.
   Gemella di `confinamentoColletto`: stessa forma, stesso `che`/`come`. */
export function gittataSenzaSpalla(lff, altri, tetto) {
  const SPALLA_MIN = 1.5, SPALLA_MAX = 8;         // il dominio che l'app impone al campo
  const num = (x) => (typeof x === 'number' && Number.isFinite(x)) ? x : NaN;
  const a = num(altri), t = num(tetto);
  const gitt = (B) => Math.min(Math.max(num(lff(B)), a), t);
  const lunga = gitt(SPALLA_MIN);                 // spalla minima → face burst massimo
  const corta = gitt(SPALLA_MAX);                 // spalla massima → face burst minimo
  if (!Number.isFinite(lunga) || !Number.isFinite(corta))
    return { Lpred:null, calcolabile:false, meccanismoNoto:false, forbice:null,
      che:FLY_SENZA_SPALLA.che, come:FLY_SENZA_SPALLA.come };
  if (lunga - corta > 1e-9)
    return { Lpred:null, calcolabile:false, meccanismoNoto:false, forbice:lunga - corta,
      che: FLY_SENZA_SPALLA.che + ', e su questa volata è lei a deciderla: senza, la gittata sta fra '
        + Math.round(corta) + ' e ' + Math.round(lunga) + ' m, cioè uno sgombero persone fra '
        + Math.round(4 * corta) + ' e ' + Math.round(4 * lunga) + ' m',
      come: FLY_SENZA_SPALLA.come };
  /* la spalla non decide il numero. Decide ancora il NOME del meccanismo? */
  return { Lpred:corta, calcolabile:true, meccanismoNoto:(a >= num(lff(SPALLA_MIN))),
    forbice:0, che:'', come:'' };
}

/* ══════════════════════════════════════════════════════════════════════════
   G21 · LA GRIGLIA DI PROGETTO E I METRI PERFORATI — il ripiego che sopravvive
         al blocco G12, perché non sta nel COSTO: sta in quello che gli si passa
   ══════════════════════════════════════════════════════════════════════════
   ⛔ `costoVolata` (G12) sa già dire «non calcolabile» quando i metri o i fori
   non si contano: la sua guardia è `Number.isFinite`. Non serve a niente se
   chi la chiama gli consegna un numero INVENTATO al posto di un `null`, ed è
   esattamente quello che facevano tutt'e tre i suoi chiamanti.

   ⛔ IL PRIMO — la griglia di progetto, in `computeKPI`:

       const nf = (D2.perRow || 18) * (D2.file || 1);

   Diciotto. Il progetto ne ha dodici di suo, e diciotto non è nemmeno il
   default della pagina: è un numero che non compare da nessun'altra parte.
   Misurato chiamando `costoVolata` con gli stessi prezzi della dimostrazione
   (60 kg/foro, 8 €/m, 1,5 €/kg, 12 €/foro) su una volata aperta con
   `perRow:null` — la porta è `Object.assign(D2, …)` da `localStorage`, la
   stessa del blocco G14:
     · fori          12 → **18**
     · carica totale 720 kg → **1.080 kg**  (+50%)
     · costo         2.270 € → **3.406 €**
   e `calcolabile` restava **true**, cioè i KPI dichiaravano di saper contare.

   ⛔ IL SECONDO, ED È QUELLO CHE RASSICURA — i metri perforati, scritti
   **tre volte** (in `computeKPI`, nel foglio stampabile e nella scheda):

       mPerf = nf * (D2.prof + (D2.sub || 0))

   Qui non c'è nessun `||` sull'altezza del banco: c'è di peggio, un `+`.
   `null + 0.9` fa **0,9**, che è finito, positivo e plausibile — quindi la
   guardia di `costoVolata` non scatta. Misurato sulla stessa volata con
   `prof:null`:
     · metri perforati 130,8 m → **10,8 m**
     · costo           2.270 € → **1.310 €**  (−42%)
   cioè un progetto che costa quasi la metà del vero, con l'aria di un conto
   fatto. È il verso pericoloso, ed è la stessa famiglia già raccolta in
   CLAUDE.md: `+null` fa 0 e `Number.isFinite(0)` risponde `true`.

   ⚠️ LA SOTTOPERFORAZIONE È L'UNICO CAMPO CON DUE RISPOSTE GIUSTE, e vanno
   separate come pretende `run-demo`: **assente** (una volata salvata prima che
   il campo esistesse) vale **zero**, perché non le è mai stato chiesto niente;
   **presente e illeggibile** (`null`, `''`, una parola) ferma il conto, perché
   qualcosa c'era e non si legge. `volataSenzaValori` fa già questa distinzione
   sulle stesse chiavi, e non se ne inventa una seconda.
   ⚠️ E uno ZERO SCRITTO resta un dato: una volata senza sottoperforazione è
   normalissima e i suoi metri si contano. È la stessa differenza fra «ho
   scritto zero» e «non ho scritto niente» del blocco G14.

   ⛔ NESSUNA SOGLIA E NESSUNA FORMULA CAMBIA: il costo lo decide ancora
   `costoVolata`, il volume `volumeForo`, la carica `caricaTotale`. Qui si
   smette soltanto di consegnare loro numeri che nessuno ha scritto. */

/* Quanti fori ha la griglia di PROGETTO — fori per fila × numero di file — e
   `null` se uno dei due non è un numero leggibile e positivo.
   ⚠️ Zero fori per fila non è una griglia più piccola, è l'assenza di una
   griglia: il campo della pagina parte da 3. */
/* L'ID STABILE DEL FORO (05/09). Fino a oggi un foro del progetto 2D era la
   sua POSIZIONE nell'array: cancellarne uno rinumerava tutti quelli dopo, e il
   piano di carico che esce per Campo scriveva la posizione nella sequenza di
   sparo, ricalcolata a ogni `computeSeq2D`. Nessun confronto foro per foro
   può reggere su un nome che cambia sotto i piedi. L'id nasce con il foro e
   non cambia più: nella maglia è «fila-colonna» (f2-5: seconda fila, quinto
   foro), che si legge sulla carta; un foro aggiunto a mano sulla tela è
   m1, m2… — il primo numero libero, così cancellare m2 e aggiungerne uno
   non ne fa due con lo stesso nome. Pure. */
export function idForoMaglia(fila, colonna){
  const f = +fila, c = +colonna;
  if (!(Number.isInteger(f) && f >= 1 && Number.isInteger(c) && c >= 1)) return null;
  return 'f' + f + '-' + c;
}
export function idForoNuovo(holes){
  const presi = new Set((holes || []).map(h => h && h.id).filter(Boolean));
  let n = 1; while (presi.has('m' + n)) n++;
  return 'm' + n;
}

/* I FORI SALVATI COL PROGETTO (05/09). Fino a oggi «Salva» in Home scriveva i
   parametri della maglia e NON i fori: alla riapertura la maglia veniva
   rigenerata, quindi un foro aggiunto sulla tela spariva, un foro tolto
   RICOMPARIVA, e un ritardo messo a mano (`tMano`) tornava a quello dello
   schema — un dato perso, e nella direzione che non si vede. Adesso il
   design porta `holes` e questa funzione li rilegge: `null` se il design non
   li ha (una volata salvata prima: si rigenera la maglia, com'è sempre
   stato); altrimenti i fori con mx/my leggibili, l'id se c'è (se manca ne
   prende uno da foro a mano, senza doppioni), il ritardo a mano solo se è un
   numero. Quelli illeggibili si CONTANO in `scartati`: non spariscono in
   silenzio. Pura. */
/* ══════════════════════════════════════════════════════════════════════════
   F1 · IL FORO PUÒ PORTARE VALORI SUOI (26/11) — la fondazione del progetto
   «foro per foro», e nient'altro.
   ══════════════════════════════════════════════════════════════════════════
   Fino a oggi carica, profondità e borraggio erano UNO per tutta la volata
   (`D2.kg`, `D2.prof`, `D2.stem`): in ogni programma concorrente ogni foro ha
   i suoi (piano in docs/GENESI_ROADMAP_COMPETITOR.md, sezione 26/11, sei
   fette). Questa è la prima: un foro PUÒ portare `kg`, `prof`, `stem` suoi, e
   c'è UN posto solo che risponde alla domanda «quanto vale per questo foro?».
   ⛔ NESSUN CALCOLO LEGGE ANCORA DI QUI: MIC, carica totale, consumo
   specifico, costo, piano di carico e scena 3D usano i valori del progetto,
   come ieri. Li si porta qui una fetta alla volta (F2…F5), ognuna con la
   prova che un progetto senza valori per foro dà gli stessi numeri di prima.
   LE TRE REGOLE, provate in scratchpad prima di scriverle qui:
    · un foro senza valore suo usa quello del progetto — così ogni progetto
      salvato fino a oggi resta identico;
    · uno ZERO dichiarato sul foro resta zero: un foro lasciato SCARICO
      (0 kg) o non borrato (0 m) è una scelta, non un buco. Solo la
      profondità zero non è un foro;
    · se non lo sa né il foro né il progetto la risposta è `null`, mai zero.
   Un campo che NON è in elenco, chiesto qui, risponde `null` e non il valore
   del progetto di nascosto — un campo che sembra «per foro» e non lo è
   sarebbe peggio di un campo che manca. (Diametro e inclinazione sono
   entrati con F6 e F6b, più sotto.) */
/* F6 (26/11) — il DIAMETRO è il quarto campo per foro (fori di contorno o di
   presplit più piccoli, un foro riperforato più largo). È in fondo
   all'elenco di proposito: chi scorre i campi trova prima i tre di sempre.
   Lo leggono per foro i CONTI e i FILE (capienza del foro, cerchio nel DXF,
   piano d'innesco, file di scambio); le PREVISIONI sulla volata (pezzatura,
   proiezioni, confinamento del colletto, rapporti geometrici) restano sul
   diametro del progetto, come per la carica (decisione 33).
   F6b (26/11) — l'INCLINAZIONE è il quinto, e l'ultimo: gradi dalla
   verticale, verso la faccia, come quella del progetto (un foro di contorno
   più inclinato, uno raddrizzato perché il fronte lì è rientrato). È
   GEOMETRIA: sposta il piede del foro in pianta e ruota il foro nella scena
   3D; la legge chi disegna e chi scrive i file. Nessun conto di carica la
   usa (nemmeno quello del progetto), e le PREVISIONI — la gittata — restano
   sull'inclinazione del progetto, come per carica e diametro (decisione 33).
   Zero è un valore: un foro verticale in una volata inclinata è una scelta. */
const _REGOLE_PER_FORO = { kg: (v) => v >= 0, prof: (v) => v > 0, stem: (v) => v >= 0, diam: (v) => v > 0, incl: (v) => v >= 0 };
export const CAMPI_PER_FORO = Object.keys(_REGOLE_PER_FORO);
const _numForo = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
export function valoreProprioDiForo(h, campo){
  const regola = _REGOLE_PER_FORO[campo];
  if (!regola) return null;
  const v = _numForo(h && h[campo]);
  return (Number.isFinite(v) && regola(v)) ? v : null;
}
export function valoreDiForo(h, campo, progetto){
  if (!_REGOLE_PER_FORO[campo]) return null;
  const suo = valoreProprioDiForo(h, campo);
  if (suo !== null) return suo;
  const p = _numForo(progetto && progetto[campo]);
  return Number.isFinite(p) ? p : null;
}
/* F6b — DOVE STA IL PIEDE DEL FORO, in pianta, rispetto al colletto: un foro
   lungo L e inclinato di θ dalla verticale ha il piede L·sin θ più avanti,
   verso la faccia. Lunghezza e inclinazione sono quelle che VALGONO per quel
   foro. ⛔ Fino al 26/11 la pianta lo disegnava con la profondità del
   PROGETTO per tutti: un foro accorciato a 6 m in una volata da 10 mostrava
   il piede dove sarebbe arrivato a 10. `null` se una delle due non si sa
   (non zero: «non lo so» non è «verticale»); zero se il foro è verticale. */
export function scostamentoPiedeForo(h, progetto){
  const L = valoreDiForo(h, 'prof', progetto), a = valoreDiForo(h, 'incl', progetto);
  if (L === null || a === null) return null;
  return L * Math.sin(a * Math.PI / 180);
}
/* ciò che di un foro va nel file salvato OLTRE a id/posizione/ritardo: solo i
   valori suoi validi. Un foro senza valori suoi non guadagna chiavi — il
   `.volata.json` di un progetto di ieri esce byte per byte com'era. */
export function valoriPropriDiForo(h){
  const out = {};
  for (const c of CAMPI_PER_FORO){ const v = valoreProprioDiForo(h, c); if (v !== null) out[c] = v; }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   F3 (26/11) — DARE A UNO O PIÙ FORI UN VALORE LORO, dalla tastiera.
   ══════════════════════════════════════════════════════════════════════
   Fino a qui un foro poteva PORTARE un valore suo (F1) e i conti lo
   leggevano (F2), ma l'unico modo di scriverlo era aprire un file salvato.
   Queste sono le regole del comando; la pagina le chiama dalla scheda del
   foro e non ne tiene una copia.
   I LIMITI. In alto sono gli stessi del progetto (200 kg, 18 m, 6 m): un
   secondo modo di scrivere la stessa grandezza non può essere più largo del
   primo, e lì il limite serve a fermare l'«85» battuto per «8,5». In BASSO
   sono più larghi di proposito, ed è la ragione per cui il foro per foro
   esiste: 0 kg è un foro lasciato scarico, 0 m di borraggio un foro non
   borrato, 2 m di profondità un foro franato. Solo la profondità zero non è
   un foro (la stessa regola di F1, `_REGOLE_PER_FORO`).
   LE QUATTRO REGOLE, provate in scratchpad prima di scriverle qui:
    · un valore UGUALE a quello del progetto non diventa un valore proprio:
      il foro torna a seguire il progetto (e lo si dice). Se no ogni foro
      «toccato» resterebbe segnato sulla pianta per un numero che non lo
      distingue da niente, e il file salvato guadagnerebbe chiavi;
    · `null` toglie il valore proprio;
    · il BORRAGGIO NON PUÒ ESSERE PIÙ LUNGO DEL FORO, e si guarda su ogni
      foro scelto col valore che avrebbe DOPO: vale anche quando il valore
      «dopo» è quello del progetto. Togliere il solo borraggio proprio a un
      foro di 2 m lo lascerebbe con i 2,2 m del progetto — trovato dal
      prototipo, non pensato prima. Per questo «torna ai valori del
      progetto» è un'operazione sola (`foriSenzaValoriPropri`), non tre;
    · tutto o niente: se un foro scelto non regge, non si scrive su nessuno.
   Non si tocca l'array ricevuto né i suoi fori (l'annulla della pagina
   tiene le fotografie di prima): i fori cambiati sono oggetti nuovi, gli
   altri gli stessi di prima; se non cambia niente torna lo STESSO array. */
export const LIMITI_PER_FORO = {
  kg:   { min: 0, max: 200, unita: 'kg', nome: 'la carica del foro' },
  prof: { positivo: true, max: 18, unita: 'm', nome: 'la profondità del foro' },
  stem: { min: 0, max: 6, unita: 'm', nome: 'il borraggio del foro' },
  /* gli stessi del campo di progetto (50–160 mm, intero): un diametro è la
     misura di un utensile, non si sceglie al decimo di millimetro */
  diam: { min: 50, max: 160, unita: 'mm', nome: 'il diametro del foro', intero: true },
  /* gli stessi del campo di progetto: da 0 (verticale) a 30° dalla verticale */
  incl: { min: 0, max: 30, unita: '°', nome: "l'inclinazione del foro" },
};
/* «questo numero può essere il valore di un foro?»: una domanda, due posti che
   la fanno (il comando dalla tastiera e il piano riletto da un file) */
const _dentroLimitiForo = (campo, v) => { const L = LIMITI_PER_FORO[campo];
  return !!L && Number.isFinite(v) && (L.positivo ? v > 0 : v >= L.min) && v <= L.max && (!L.intero || Number.isInteger(v)); };
const _indiciDiFori = (H, indici) => [...new Set((Array.isArray(indici) ? indici : []).filter((i) => Number.isInteger(i) && i >= 0 && i < H.length))];
/* quanti dei fori `scelti` resterebbero col borraggio più lungo del foro, se diventassero `dopo(h)` */
const _foriTroppoCorti = (H, scelti, dopo, progetto) => scelti.filter((i) => {
  const d = dopo(H[i]);
  const pr = valoreDiForo(d, 'prof', progetto), st = valoreDiForo(d, 'stem', progetto);
  return pr !== null && st !== null && st > pr;
}).length;
export function foriConValoreProprio(holes, indici, campo, valore, progetto){
  const H = Array.isArray(holes) ? holes : [];
  const fermo = (motivo, extra) => ({ fori: H, toccati: 0, tornati: 0, valore: null, segueProgetto: false, motivo, ...(extra || {}) });
  const L = LIMITI_PER_FORO[campo];
  if (!L) return fermo('campo-non-per-foro');
  const scelti = _indiciDiFori(H, indici);
  if (!scelti.length) return fermo('nessun-foro');
  let v = null;
  if (valore !== null && valore !== undefined && valore !== ''){
    v = +valore;
    if (!_dentroLimitiForo(campo, v)) return fermo('fuori-limiti');
    const p = _numForo(progetto && progetto[campo]);
    if (Number.isFinite(p) && v === p) v = null;
  }
  const dopo = (h) => { const n = { ...h }; if (v === null) delete n[campo]; else n[campo] = v; return n; };
  if (campo === 'stem' || campo === 'prof'){
    const corti = _foriTroppoCorti(H, scelti, dopo, progetto);
    if (corti) return fermo('borraggio-oltre-il-foro', { corti });
  }
  let toccati = 0, tornati = 0;
  const set = new Set(scelti);
  const fori = H.map((h, i) => {
    if (!set.has(i)) return h;
    const prima = valoreProprioDiForo(h, campo);
    if (v === null ? !(h && campo in h) : prima === v) return h;
    toccati++; if (v === null && prima !== null) tornati++;
    return dopo(h);
  });
  return { fori: toccati ? fori : H, toccati, tornati, valore: v, segueProgetto: v === null, motivo: null };
}
/* «torna ai valori del progetto»: via TUTTI i valori propri dei fori scelti, in un colpo */
export function foriSenzaValoriPropri(holes, indici, progetto){
  const H = Array.isArray(holes) ? holes : [];
  const scelti = _indiciDiFori(H, indici);
  if (!scelti.length) return { fori: H, toccati: 0, motivo: 'nessun-foro' };
  const dopo = (h) => { const n = { ...h }; for (const c of CAMPI_PER_FORO) delete n[c]; return n; };
  const corti = _foriTroppoCorti(H, scelti, dopo, progetto);
  if (corti) return { fori: H, toccati: 0, motivo: 'borraggio-oltre-il-foro', corti };
  let toccati = 0;
  const set = new Set(scelti);
  const fori = H.map((h, i) => {
    if (!set.has(i) || !CAMPI_PER_FORO.some((c) => h && c in h)) return h;
    toccati++; return dopo(h);
  });
  return { fori: toccati ? fori : H, toccati, motivo: null };
}
/* che cosa scrivere nel campo quando i fori scelti sono più d'uno: il valore
   se è lo stesso per tutti, `null` + `diversi` se no (il campo resta vuoto e
   lo dice — una media non è il valore di nessuno di loro) */
export function valoreComuneDiFori(holes, indici, campo, progetto){
  const H = Array.isArray(holes) ? holes : [];
  const scelti = _indiciDiFori(H, indici);
  if (!LIMITI_PER_FORO[campo] || !scelti.length) return { n: 0, valore: null, diversi: false, propri: 0 };
  const vals = scelti.map((i) => valoreDiForo(H[i], campo, progetto));
  const uguali = vals.every((x) => x === vals[0]);
  return { n: scelti.length, valore: uguali ? vals[0] : null, diversi: !uguali,
    propri: scelti.filter((i) => valoreProprioDiForo(H[i], campo) !== null).length };
}
/* F5 (26/11) — RILEGGERE UN PIANO CHE PORTA VALORI PER FORO. Il lettore del
   piano d'innesco non ricostruisce i fori dal file: rilegge i parametri e
   RIGENERA la maglia. Quindi i valori per foro vanno riportati sui fori
   rigenerati, e l'unico aggancio onesto è la POSIZIONE (alla stessa
   precisione con cui il file la scrive, due decimali): il numero d'ordine no,
   nel file i fori sono in ordine di sparo.
    · un foro del file che non trova il suo posto nella maglia NON si riporta
      su un altro: si CONTA (`nonRiportati`) — chi rilegge deve saperlo;
    · un valore fuori dai limiti o un borraggio più lungo del foro si scarta
      e si conta (`scartati`): un file si può scrivere anche a mano;
    · un valore uguale a quello del progetto non è un valore proprio. */
export function valoriPerForoDaPiano(foriFile, holes, progetto){
  const H = Array.isArray(holes) ? holes : [];
  const F = Array.isArray(foriFile) ? foriFile : [];
  const chiave = (x, y) => (+x).toFixed(2) + '|' + (+y).toFixed(2);
  const posto = new Map();
  H.forEach((h, i) => { if (h && Number.isFinite(+h.mx) && Number.isFinite(+h.my)) posto.set(chiave(h.mx, h.my), i); });
  const fori = H.slice();
  let riportati = 0, nonRiportati = 0, scartati = 0;
  for (const f of F){
    const suoi = {};
    for (const c of CAMPI_PER_FORO){
      const v = _numForo(f && f[c]);
      if (!Number.isFinite(v)) continue;
      const pr = _numForo(progetto && progetto[c]);
      if (Number.isFinite(pr) && v === pr) continue;
      if (!_dentroLimitiForo(c, v)){ scartati++; continue; }
      suoi[c] = v;
    }
    if (!Object.keys(suoi).length) continue;
    const i = (f && Number.isFinite(+f.x) && Number.isFinite(+f.y)) ? posto.get(chiave(f.x, f.y)) : undefined;
    if (i === undefined){ nonRiportati++; continue; }
    const dopo = { ...fori[i], ...suoi };
    const pr = valoreDiForo(dopo, 'prof', progetto), st = valoreDiForo(dopo, 'stem', progetto);
    if (pr !== null && st !== null && st > pr){ scartati++; continue; }
    fori[i] = dopo; riportati++;
  }
  return { fori: riportati ? fori : H, riportati, nonRiportati, scartati };
}
/* quanti fori hanno un valore loro, in tutto e campo per campo: lo chiedono
   l'avviso accanto alle previsioni e quello della maglia rigenerata */
export function contaValoriPropri(holes){
  const out = { fori: 0 };
  for (const c of CAMPI_PER_FORO) out[c] = 0;
  for (const h of (Array.isArray(holes) ? holes : [])){
    let qualcuno = false;
    for (const c of CAMPI_PER_FORO) if (valoreProprioDiForo(h, c) !== null){ out[c]++; qualcuno = true; }
    if (qualcuno) out.fori++;
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   LA CARICA CHE NON ENTRA NEL FORO (26/11) — foro per foro.
   ══════════════════════════════════════════════════════════════════════
   Da quando un foro può avere carica, profondità e borraggio suoi (F3, F4)
   si può scrivere un foro impossibile senza accorgersene, in due modi:
    · dare a un foro una carica più grande di quella che la sua colonna
      può contenere;
    · ACCORCIARE un foro (o allungargli il borraggio) lasciandogli la carica
      del progetto — il caso più facile da non vedere, perché la carica non
      l'ha toccata nessuno.
   La capienza è quella che il prodotto usa già altrove (`caricaForoDaGeometria`:
   carica lineare dal diametro e dalla densità dell'esplosivo × colonna
   caricabile `prof + sottoperforazione − borraggio`), calcolata coi valori
   che valgono PER QUEL FORO. Diametro, sottoperforazione ed esplosivo sono
   del progetto (per foro è F6).
   ⛔ È UN AVVISO, NON UN RIFIUTO, e la soglia è dichiarata. La capienza è
   una STIMA: densità di caricamento, fori più larghi del nominale e cariche
   spezzate la spostano. Quindi due gradini: sopra la capienza il foro è
   `alLimite`; sopra il 110% è `nonEntra`. Il 10% non è una norma: è il
   margine entro cui la stima può sbagliare, scritto qui per essere cambiato
   con una misura e non a sentimento.
   ⛔ «NON LO SO» NON È «ENTRA»: un foro di cui manca la carica, la
   profondità, il borraggio — o il diametro e la densità del progetto — è
   `nonVerificabili`, e non entra nel conto dei fori a posto. */
export const MARGINE_CAPIENZA_FORO = 1.10;
export function capienzaFori(holes, progetto){
  const H = Array.isArray(holes) ? holes : [];
  const p = progetto || {};
  const out = { fori: H.length, verificati: 0, nonVerificabili: 0, alLimite: [], nonEntra: [], piuPieno: null };
  H.forEach((h, i) => {
    const kg = valoreDiForo(h, 'kg', p), prof = valoreDiForo(h, 'prof', p), stem = valoreDiForo(h, 'stem', p), diam = valoreDiForo(h, 'diam', p);
    const capienza = (prof === null || stem === null) ? null
      : caricaForoDaGeometria({ diam, prof, sub: p.sub, stem, densita: p.densita });
    if (kg === null || capienza === null){ out.nonVerificabili++; return; }
    out.verificati++;
    const rapporto = kg / capienza;
    const riga = { i, kg, capienza, rapporto, prof, stem, diam };
    if (out.piuPieno === null || rapporto > out.piuPieno.rapporto) out.piuPieno = riga;
    if (rapporto > MARGINE_CAPIENZA_FORO) out.nonEntra.push(riga);
    else if (kg > capienza) out.alLimite.push(riga);
  });
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   F4 (26/11) — LA TABELLA DEI FORI: una riga per foro, tutti insieme.
   ══════════════════════════════════════════════════════════════════════
   La scheda del foro (F3) ne mostra uno; chi progetta vuole vederli TUTTI
   in fila, coi diversi dal progetto riconoscibili, e ordinarli. Questa
   funzione prepara le righe; la pagina le disegna e non decide niente.
    · ogni riga porta `i`, l'indice del foro in `holes`: l'ORDINE È DELLA
      VISTA. Ordinare la tabella non sposta un foro, e chi scrive in una
      cella scrive sul foro `i`, non sulla riga che si vede in quel punto;
    · carica, profondità e borraggio sono quelli che VALGONO per il foro
      (`valoreDiForo`: il suo, se no il progetto, se no `null`), e `propri`
      dice quali dei tre sono suoi;
    · un valore che non c'è resta `null` e va IN FONDO in tutti e due i
      versi: «non lo so» non è il più piccolo né il più grande;
    · a parità si tiene l'ordine dei fori (ordinamento stabile, scritto e
      non sperato: due righe uguali non si scambiano di posto a ogni clic);
    · una colonna che non esiste ordina per numero del foro: una tabella
      in un ordine a caso sarebbe peggio di una nell'ordine di sparo. */
export const COLONNE_TABELLA_FORI = ['n', 'x', 'spalla', 'tDet', 'kg', 'prof', 'stem', 'diam', 'incl'];
export function tabellaFori(holes, progetto, ordine){
  const H = Array.isArray(holes) ? holes : [];
  const fin = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(+v)) ? null : +v;
  const righe = H.map((h, i) => {
    const suoi = valoriPropriDiForo(h);
    const seq = fin(h && h.seq);
    return { i, n: (seq === null ? i : seq) + 1, id: (h && h.id) || null,
      x: fin(h && h.mx), spalla: fin(h && h.my), tDet: fin(h && h.tDet), aMano: !!(h && h.tMano != null),
      kg: valoreDiForo(h, 'kg', progetto), prof: valoreDiForo(h, 'prof', progetto), stem: valoreDiForo(h, 'stem', progetto), diam: valoreDiForo(h, 'diam', progetto), incl: valoreDiForo(h, 'incl', progetto),
      propri: { kg: 'kg' in suoi, prof: 'prof' in suoi, stem: 'stem' in suoi, diam: 'diam' in suoi, incl: 'incl' in suoi } };
  });
  const campo = (ordine && COLONNE_TABELLA_FORI.includes(ordine.campo)) ? ordine.campo : 'n';
  const verso = (ordine && ordine.verso === 'giu') ? -1 : 1;
  return righe.map((r, k) => [r, k]).sort((A, B) => {
    const a = A[0][campo], b = B[0][campo];
    if (a === null || b === null) return (a === null && b === null) ? A[1] - B[1] : (a === null ? 1 : -1);
    return a === b ? A[1] - B[1] : (a < b ? -1 : 1) * verso;
  }).map((c) => c[0]);
}

/* ══════════════════════════════════════════════════════════════════════
   LE PREVISIONI SUL FORO TIPO: CHI RESTA FUORI, DETTO (26/11).
   ══════════════════════════════════════════════════════════════════════
   Pezzatura e gittata si calcolano coi valori del PROGETTO (quali debbano
   usare è la decisione 33, del fondatore). Finché è così, un foro con valori
   suoi è un foro per cui quella previsione NON è stata fatta — e per la
   gittata non è una sfumatura. Misurato il 26/11: un solo foro con 1,5 m di
   borraggio in una volata progettata a 2,2 lascia la gittata a 101 m e lo
   sgombero persone a 404 m; la STESSA formula, con quel borraggio, dà 193 m
   e 772 m. Il numero stampato vale per il foro tipo, e lo si deve leggere
   accanto al numero: sullo schermo, sul foglio, nel file.
   ⛔ Qui NON si decide quale foro usa la previsione e non si tocca nessuna
   formula né soglia: si CONTA chi resta fuori e si compone UNA frase, la
   stessa per tutti i posti che la scrivono.
    · `campi`: i campi che quella previsione legge. Un foro che ha di suo
      solo un campo che la previsione non usa non è «fuori»;
    · la frase dice «non è calcolata» e non «è maggiore» o «è minore»: da
      che parte sbagli non lo si sa senza rifare il conto foro per foro. */
export const CAMPI_DELLA_GITTATA = ['kg', 'stem', 'diam', 'incl'];
export const CAMPI_DELLA_PEZZATURA = ['kg', 'prof', 'stem', 'diam'];
const _NOMI_CAMPI_FORO = { kg: 'carica', prof: 'profondità', stem: 'borraggio', diam: 'diametro', incl: 'inclinazione' };
export function foriFuoriDalForoTipo(holes, campi){
  const C = CAMPI_PER_FORO.filter((c) => !Array.isArray(campi) || campi.includes(c));
  const perCampo = {}; for (const c of C) perCampo[c] = 0;
  let fori = 0;
  for (const h of (Array.isArray(holes) ? holes : [])){
    let fuori = false;
    for (const c of C) if (valoreProprioDiForo(h, c) !== null){ perCampo[c]++; fuori = true; }
    if (fuori) fori++;
  }
  return { fori, perCampo, campi: C.filter((c) => perCampo[c] > 0) };
}
export function avvisoForoTipo(holes, campi, soggetto){
  const q = foriFuoriDalForoTipo(holes, campi);
  if (!q.fori) return '';
  const nomi = q.campi.map((c) => _NOMI_CAMPI_FORO[c]);
  const elenco = nomi.length > 1 ? nomi.slice(0, -1).join(', ') + ' o ' + nomi[nomi.length - 1] : nomi[0];
  return q.fori + ' ' + (q.fori === 1 ? 'foro ha' : 'fori hanno') + ' un valore proprio di ' + elenco + ': '
    + (soggetto || 'questa previsione') + ' è calcolata sul FORO TIPO del progetto, e per '
    + (q.fori === 1 ? 'quel foro' : 'quei fori') + ' non è calcolata.';
}

/* ══════════════════════════════════════════════════════════════════════
   IL CONFRONTO A/B E I FORI CON VALORI LORO (26/11).
   ══════════════════════════════════════════════════════════════════════
   Il confronto mette accanto due SCATTI, e fino al 26/11 uno scatto non
   sapeva quanti fori avessero valori loro: due progetti con la stessa gittata
   «sul foro tipo» si leggevano uguali anche se in uno c'era un foro col
   borraggio corto, per il quale quella gittata NON è calcolata — e la colonna
   con la gittata minore si dipingeva di verde.
   Lo scatto adesso porta tre NUMERI (`foriPropri`, `flyTipo`, `fragTipo`: lo
   scatto è un dato, le frasi le compone chi lo legge). Questa funzione li
   legge come li legge il resto del confronto:
   ⛔ uno scatto salvato PRIMA non li ha, e «non c'è» non è «zero»: `noto` è
   falso, le celle dicono «non noto», e `gittataSuTutti` — la sola cosa che
   permette il verde sulla gittata — è vera SOLO quando lo zero è registrato.
   Quali valori usi la previsione resta la decisione 33: qui non si calcola
   niente, si dichiara per quanti fori il numero non vale. */
export function cmpForiPropri(kpi){
  const n = _cmpNum(kpi && kpi.foriPropri), fly = _cmpNum(kpi && kpi.flyTipo), frag = _cmpNum(kpi && kpi.fragTipo);
  const quanti = (v) => v === null ? 'non noto' : (v === 0 ? 'nessuno' : v + (v === 1 ? ' foro' : ' fori'));
  return { noto: n !== null, fori: n, fuoriGittata: fly, fuoriPezzatura: frag,
    cella: quanti(n), cellaGittata: quanti(fly), cellaPezzatura: quanti(frag),
    gittataSuTutti: fly === 0 };
}

/* ══════════════════════════════════════════════════════════════════════
   LA RIGA CHE RESTA NELLO STORICO (27/11).
   ══════════════════════════════════════════════════════════════════════
   Chi salva una volata lascia in Home UNA riga — «12 fori · 600 kg · X50 34
   cm» — che si rilegge mesi dopo: è un documento. Fino al 27/11 la componeva
   la pagina, e nessuna prova la guardava; e da quando un foro può avere
   valori suoi quella riga non diceva che la volata ne aveva. Due volate con
   la stessa maglia e cariche diverse foro per foro si leggevano uguali, e la
   X50 scritta lì è quella del FORO TIPO (decisione 33).
   La carica totale è già quella vera (la somma dei fori). Qui si aggiunge
   quanti fori hanno valori loro, e accanto alla X50 «foro tipo» quando per
   qualcuno non è calcolata. ⛔ Neutralità: senza valori per foro la riga è
   quella di sempre, carattere per carattere. Un conto che non c'è (un
   oggetto di numeri composto prima) non aggiunge niente: non si inventa un
   «nessuno». */
export function sintesiVolata(k){
  if (!k || typeof k !== 'object') return '';
  const propri = _cmpNum(k.foriPropri), tipo = _cmpNum(k.fragTipo);
  return conta(k.nf, 'foro', 'fori')
    + (propri > 0 ? ' · ' + gnum(propri, 0) + ' con valori propri' : '')
    + ' · ' + (_cmpNum(k.qtot) === null ? 'carica totale non calcolabile' : gnum(k.qtot, 0) + ' kg')
    + ' · ' + (k.fragCalcolabile ? 'X50 ' + gnum(k.x50, 0) + ' cm' + (tipo > 0 ? ' (foro tipo)' : '') : 'X50 non calcolabile');
}

/* ══════════════════════════════════════════════════════════════════════
   IL VALORE DEL PROGETTO, RILEGGENDO UN FILE DI SCAMBIO (26/11).
   ══════════════════════════════════════════════════════════════════════
   Chi riapre un `.volata.json` deve ricavare la carica e la profondità DEL
   PROGETTO. Fino al 26/11 lo faceva con la media dei fori del file, e finché
   i fori erano tutti uguali la media era il progetto. Da quando il file
   porta i valori veri di ogni foro (F5b) non lo è più — misurato: undici
   fori a 58 kg e uno lasciato scarico rientravano come «53,17 kg per foro»,
   una carica che non è di nessun foro, e la simulazione ripartiva da lì
   senza dirlo.
    · se il file DICHIARA il valore del progetto, vale quello (`dichiarato`);
    · se no (un file di ieri) resta la media dei fori che il dato ce l'hanno
      — e quando sono tutti uguali è quel valore ESATTO, non una somma
      divisa (2,2 sommato dodici volte e diviso per dodici non fa 2,2);
    · `senza`: quanti fori il dato non ce l'hanno; `diversi`: quanti ne hanno
      uno diverso dal valore scelto. Sono le due cose che chi importa deve
      sentirsi dire: la prima c'era già, la seconda mancava;
    · nessun dato da nessuna parte: `valore: null`, non zero. */
export function valoreProgettoDaFile(dichiarato, valoriDeiFori){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const V = (Array.isArray(valoriDeiFori) ? valoriDeiFori : []).map(n);
  const letti = V.filter(Number.isFinite), senza = V.length - letti.length;
  const d = n(dichiarato);
  let valore = null, fonte = null;
  if (Number.isFinite(d)){ valore = d; fonte = 'dichiarato'; }
  else if (letti.length){ valore = letti.every((x) => x === letti[0]) ? letti[0] : letti.reduce((s, x) => s + x, 0) / letti.length; fonte = 'media'; }
  return { valore, fonte, senza, diversi: valore === null ? 0 : letti.filter((x) => x !== valore).length };
}

/* ══════════════════════════════════════════════════════════════════════
   IL FOGLIO DICE I FORI DIVERSI (26/11).
   ══════════════════════════════════════════════════════════════════════
   Il report di volata — il foglio che si stampa e si porta in cava — scriveva
   diametro, profondità, borraggio, inclinazione e «carica per foro» DEL
   PROGETTO, e da nessuna parte i fori che ne hanno di loro: un foro lasciato
   scarico o accorciato, su quel foglio, non esisteva (i totali sì: erano già
   quelli veri). Questa funzione prepara ciò che il foglio deve dire; la
   pagina lo stampa e non decide niente.
    · `righe`: SOLO i fori con almeno un valore loro, nell'ordine del loro
      numero; per ciascuno i valori che VALGONO (suo o del progetto) e quali
      sono suoi;
    · `campi`: i soli campi in cui almeno un foro si scosta, nell'ordine di
      sempre — una colonna in cui tutti seguono il progetto non si stampa;
    · `quanti[campo]`: quanti fori hanno quel valore loro (per la nota
      accanto alla riga del progetto: «2 fori ne hanno una loro»);
    · senza valori per foro tutto è vuoto, e il foglio resta com'era. */
export function foriPropriPerFoglio(holes, progetto){
  const quanti = contaValoriPropri(holes);
  const righe = tabellaFori(holes, progetto, { campo: 'n' })
    .filter((r) => CAMPI_PER_FORO.some((c) => r.propri[c]))
    .map((r) => { const riga = { n: r.n, id: r.id, propri: r.propri }; for (const c of CAMPI_PER_FORO) riga[c] = r[c]; return riga; });
  return { fori: Array.isArray(holes) ? holes.length : 0, conPropri: righe.length,
    campi: CAMPI_PER_FORO.filter((c) => quanti[c] > 0), quanti, righe };
}

/* ══════════════════════════════════════════════════════════════════════
   IL FOGLIO HA LA PIANTA E LA TABELLA DI TUTTI I FORI (27/11).
   ══════════════════════════════════════════════════════════════════════
   Misurato il 27/11 aprendo il report: «img 0, canvas 0, svg 0». Il foglio
   che si porta in cava era solo testo — la maglia come due numeri, la
   sequenza come una parola — e la frase «il numero è quello scritto dentro
   il foro sulla pianta» rimandava a un disegno che sul foglio non c'era.
   Queste due funzioni lo compongono, pure: il foglio non dipende dalla tela
   (né dal suo ingrandimento, né dagli strati nascosti sullo schermo: quelli
   sono un modo di GUARDARE, il foglio stampa il progetto).
    · `piantaPerFoglio`: un disegno vettoriale (SVG) in bianco e nero più
      tre tinte, pensato per la carta. I fori stanno dove li mette la tela
      (`my + interpProf`), il numero dentro è l'ordine di sparo — lo stesso
      di `tabellaFori` — e il ritardo sta sotto il foro finché c'è posto;
      quando la maglia è troppo fitta il disegno lo DICE nella legenda e
      rimanda alla tabella (dove ogni foro ha la sua posizione), invece di
      scrivere numeri illeggibili;
    · la scala non supera 40 px per metro (tre fori non diventano un
      manifesto) e il segmento di scala ha una lunghezza tonda;
    · senza nessun foro collocabile la risposta è la stringa vuota: il
      foglio resta com'era, non stampa una cornice vuota;
    · `tabellaForiPerFoglio`: una riga per foro nell'ordine di sparo, coi
      valori che VALGONO per quel foro (li decide `tabellaFori`, la stessa
      della tabella a schermo). Un valore che non c'è si scrive «non noto»,
      un ritardo che non c'è «non assegnato»: su un foglio un trattino si
      legge come una cella dimenticata. La tabella sta in un riquadro suo
      (`.tfs`): su uno schermo più stretto delle sue nove colonne scorre lei,
      non la pagina. */
export function piantaPerFoglio(d, opz){
  const o = opz || {}, fin = (v) => v !== null && v !== undefined && v !== '' && Number.isFinite(+v);
  const punti = (a) => Array.isArray(a) ? a.filter((p) => p && fin(p.x) && fin(p.y)).map((p) => ({ x: +p.x, y: +p.y })) : [];
  const prof = punti(d && d.profilo), piede = punti(d && d.piede).sort((a, b) => a.x - b.x);
  const tratti = (Array.isArray(d && d.tratti) ? d.tratti : []).map((t) => ({ importato: !!(t && t.origine === 'dxf'), pts: punti(t && t.pts) })).filter((t) => t.pts.length >= 2);
  const H = (Array.isArray(d && d.holes) ? d.holes : []).map((h, i) => ({ h, i })).filter(({ h }) => h && fin(h.mx) && fin(h.my))
    .map(({ h, i }) => ({ x: +h.mx, y: +h.my + interpProf(prof, +h.mx), n: (fin(h.seq) ? +h.seq : i) + 1, t: fin(h.tDet) ? +h.tDet : null, suo: Object.keys(valoriPropriDiForo(h)).length > 0 }));
  if (!H.length) return '';
  const L = (fin(o.larghezza) && +o.larghezza >= 320) ? +o.larghezza : 680, padX = 36, padTop = 52, padBot = 84, OLTRE = 1.5, SCALA_MAX = 40, ALTEZZA_MAX = 460, RAGGIO_MIN_NUMERO = 6.2;   // sotto i 6,2 px di raggio il numero sarebbe più basso di 6,5 px: non si scrive
  const tp = tratti.flatMap((t) => t.pts);
  /* il fronte si disegna un metro e mezzo oltre il primo e l'ultimo foro: quel tratto fa parte
     del disegno, quindi entra nei limiti (se no, con un foro solo, usciva dal foglio) */
  const xs = H.map((p) => p.x).concat(tp.map((p) => p.x)), minx = Math.min(...xs) - OLTRE, maxx = Math.max(...xs) + OLTRE;
  const fx = [minx].concat(prof.map((p) => p.x).filter((x) => x > minx && x < maxx).sort((a, b) => a - b), [maxx]);
  const ys = H.map((p) => p.y).concat(fx.map((x) => interpProf(prof, x)), piede.map((p) => p.y), tp.map((p) => p.y));
  const miny = Math.min(0, ...ys), maxy = Math.max(...ys);
  const Wd = Math.max(2, maxx - minx), Hd = Math.max(2, maxy - miny);
  const scala = Math.min((L - 2 * padX) / Wd, ALTEZZA_MAX / Hd, SCALA_MAX);
  const X = (x) => padX + ((L - 2 * padX) - Wd * scala) / 2 + (x - minx) * scala, Y = (y) => padTop + (y - miny) * scala;
  const S = d && d.S, B = d && d.B, bf = d && d.bf;
  const passo = (fin(S) && fin(B) && +S > 0 && +B > 0) ? Math.min(+S, (fin(bf) && +bf > 0) ? +bf : +B) * scala : null;
  const r = raggioForoTela(passo), coiNumeri = r >= RAGGIO_MIN_NUMERO, haRitardi = H.some((p) => p.t !== null), coiRitardi = passo !== null && passo >= 26 && haRitardi;
  const leg = [coiNumeri ? 'nel foro: numero d\'ordine di sparo' : 'numeri dei fori: in tabella, con la posizione',
    coiRitardi ? 'sotto il foro: ritardo in ms' : (haRitardi ? 'ritardi: nella tabella dei fori' : null),
    H.some((p) => p.suo) ? 'bordo spesso: foro con valori suoi' : null,
    piede.length >= 2 ? 'tratteggio ocra: piede' : null,
    tratti.length ? 'linea blu: tratto' + (tratti.some((t) => t.importato) ? ' (tratteggiata se importato)' : '') : null].filter(Boolean);
  /* la legenda va a capo: le voci si dispongono per larghezza stimata (5 px a carattere, a corpo 9,5).
     ⚠️ Ogni voce da sola deve stare nel disegno più stretto (320 − 72 = 248 px, cioè 46 caratteri):
     la prima stesura della voce sui fori fitti ne aveva 91 e usciva dal foglio proprio sul telefono. */
  const legRighe = righeDiVoci(leg.map((t) => (t.length + 3) * 5), L - 2 * padX), inPiu = Math.max(0, legRighe.length - 1) * 13;
  const alta = Math.round(padTop + Hd * scala + padBot + inPiu);
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1), pl = (pts) => pts.map((p) => f1(X(p.x)) + ',' + f1(Y(p.y))).join(' ');
  const out = [];
  out.push('<svg xmlns="http://www.w3.org/2000/svg" class="pianta" viewBox="0 0 ' + L + ' ' + alta + '" width="100%" role="img" aria-label="Pianta della volata: ' + H.length + (H.length === 1 ? ' foro' : ' fori') + '" style="max-width:' + L + 'px;display:block;margin:0 auto;font-family:system-ui,Arial,sans-serif">');
  out.push('<rect x="0.5" y="0.5" width="' + (L - 1) + '" height="' + (alta - 1) + '" fill="#fff" stroke="#d8d8d8"/>');
  /* il fronte: la faccia libera, col suo profilo se è stato modellato */
  out.push('<polyline class="p-fronte" fill="none" stroke="#c05a00" stroke-width="2.5" points="' + pl(fx.map((x) => ({ x, y: interpProf(prof, x) }))) + '"/>');
  if (piede.length >= 2) out.push('<polyline class="p-piede" fill="none" stroke="#8a6d00" stroke-width="1.5" stroke-dasharray="6 4" points="' + pl(piede) + '"/>');
  tratti.forEach((t) => out.push('<polyline class="p-tratto" fill="none" stroke="#3f6f8f" stroke-width="1.4"' + (t.importato ? ' stroke-dasharray="5 4"' : '') + ' points="' + pl(t.pts) + '"/>'));
  /* la scritta del fronte DOPO le linee, con un alone bianco: resta leggibile anche se il piede le passa sotto */
  out.push('<text x="' + f1(X(minx)) + '" y="' + f1(Y(interpProf(prof, minx)) - 8) + '" font-size="11" font-weight="700" fill="#a05a00" stroke="#fff" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round">FRONTE — faccia libera</text>');
  H.forEach((p) => { const cx = f1(X(p.x));
    out.push('<circle class="p-foro" cx="' + cx + '" cy="' + f1(Y(p.y)) + '" r="' + f1(r) + '" fill="#fff" stroke="#1a1a1a" stroke-width="' + (p.suo ? 2.6 : 1.2) + '"/>');
    if (coiNumeri) out.push('<text class="p-n" x="' + cx + '" y="' + f1(Y(p.y) + r * 0.36) + '" font-size="' + f1(r * 1.05) + '" font-weight="700" text-anchor="middle" fill="#1a1a1a">' + p.n + '</text>');
    if (coiRitardi && p.t !== null) out.push('<text class="p-t" x="' + cx + '" y="' + f1(Y(p.y) + r + 10) + '" font-size="8.5" text-anchor="middle" fill="#555">' + Math.round(p.t) + '</text>');
  });
  /* la scala: un segmento di lunghezza tonda, mai più lungo di un terzo del disegno */
  const m = [1, 2, 5, 10, 20, 50, 100, 200, 500].filter((v) => v * scala <= (L - 2 * padX) * 0.3).pop() || 1, by = alta - 34 - inPiu, bx = f1(padX + m * scala);
  out.push('<path class="p-scala" d="M' + padX + ' ' + (by - 4) + 'V' + (by + 4) + 'M' + padX + ' ' + by + 'H' + bx + 'M' + bx + ' ' + (by - 4) + 'V' + (by + 4) + '" stroke="#1a1a1a" stroke-width="1.2" fill="none"/>');
  out.push('<text x="' + f1(padX + m * scala / 2) + '" y="' + (by - 7) + '" font-size="10" text-anchor="middle" fill="#1a1a1a">' + m + ' m</text>');
  /* il verso della sequenza: la stessa freccia della tela, dalla stessa parte */
  const dx = (d && d.dir) === 'dx', ax0 = dx ? L - padX : padX, ax1 = dx ? L - padX - 90 : padX + 90, s = dx ? 1 : -1;
  out.push('<path d="M' + ax0 + ' 18H' + ax1 + '" stroke="#2e7d32" stroke-width="1.8"/><path class="p-verso" d="M' + ax1 + ' 18l' + (s * 8) + ' -4v8z" fill="#2e7d32"/>');
  out.push('<text x="' + (dx ? ax1 - 6 : ax1 + 6) + '" y="22" font-size="10.5" text-anchor="' + (dx ? 'end' : 'start') + '" fill="#2e7d32">sequenza di sparo</text>');
  legRighe.forEach((riga, k) => out.push('<text class="p-leg" x="' + padX + '" y="' + (alta - 12 - (legRighe.length - 1 - k) * 13) + '" font-size="9.5" fill="#555">' + riga.map((i) => leg[i]).join(' · ') + '</text>'));
  out.push('</svg>');
  return out.join('');
}
const _NOMI_COLONNE_FOGLIO = { kg: 'Carica', prof: 'Profondità', stem: 'Borraggio', diam: 'Diametro', incl: 'Inclinazione' };
export function tabellaForiPerFoglio(holes, progetto){
  const righe = tabellaFori(holes, progetto, { campo: 'n' });
  if (!righe.length) return '';
  const suoi = righe.some((r) => CAMPI_PER_FORO.some((c) => r.propri[c])), aMano = righe.some((r) => r.aMano);
  const val = (r, c) => { const tx = r[c] === null ? 'non noto' : gnum(r[c], 2) + ((c === 'kg' && r[c] === 0) ? ' (scarico)' : ''); return '<td>' + (r.propri[c] ? '<b>' + tx + '</b>' : tx) + '</td>'; };
  const segni = [suoi ? 'in <b>grassetto</b> i valori che un foro ha di suo, diversi da quelli del progetto' : null, aMano ? '✎ ritardo messo a mano' : null].filter(Boolean);
  return '<h2>Tabella dei fori</h2>'
    + '<p class="fpi">' + gnum(righe.length, 0) + (righe.length === 1 ? ' foro' : ' fori') + ', nell\'ordine di sparo: il numero è quello del foro sulla pianta. «Lungo la fila» è la posizione del foro lungo la fila, «spalla» la sua distanza dal fronte.' + (segni.length ? ' Segni: ' + segni.join('; ') + '.' : '') + '</p>'
    + '<div class="tfs"><table class="tf"><thead><tr><th>Foro</th><th>Lungo la fila (m)</th><th>Spalla (m)</th><th>Ritardo (ms)</th>'
    + CAMPI_PER_FORO.map((c) => '<th>' + _NOMI_COLONNE_FOGLIO[c] + ' (' + LIMITI_PER_FORO[c].unita + ')</th>').join('') + '</tr></thead><tbody>'
    + righe.map((r) => '<tr><td>' + gnum(r.n, 0) + '</td><td>' + (r.x === null ? 'non noto' : gfix(r.x, 2)) + '</td><td>' + (r.spalla === null ? 'non noto' : gfix(r.spalla, 2)) + '</td><td>'
        + (r.tDet === null ? 'non assegnato' : gnum(r.tDet, 1)) + (r.aMano ? ' ✎' : '') + '</td>' + CAMPI_PER_FORO.map((c) => val(r, c)).join('') + '</tr>').join('')
    + '</tbody></table></div>';
}

/* ══════════════════════════════════════════════════════════════════════════
   LA FIRMA DELLA MAGLIA (26/11) — quando i fori «non sono più quelli».
   ══════════════════════════════════════════════════════════════════════════
   Misurato il 26/11 nel browser, cercando perché il campo «Esplosivo totale»
   perdeva le cariche proprie: `applyDesign` chiamava `genMaglia2D()` SEMPRE,
   a ogni parametro toccato. Cambiando SOLO il borraggio: il foro spostato a
   mano tornava al suo posto, il foro aggiunto sulla tela spariva, il ritardo
   messo a mano e la carica propria si perdevano (13 fori → 12, primo foro da
   0,7 a 0) — e per i primi due senza nemmeno un avviso. Il commento di
   `genMaglia2D` dice «rigenerare butta via i ritardi a mano, ed è giusto: i
   fori non sono più quelli»: vero quando cambia la GEOMETRIA della maglia,
   falso quando cambia il borraggio.
   I cinque numeri da cui `generaMaglia` costruisce le coordinate sono
   spalla, interasse, numero di file, fori per fila e sfalsamento: finché
   quelli non cambiano i fori sono gli stessi, e si tengono. La firma si
   prende quando la maglia NASCE (o quando un progetto salvato rimette i
   suoi fori) e si confronta con quella dei parametri di adesso. */
export function firmaMaglia(d){
  const o = d || {};
  return [o.B, o.S, o.file, o.perRow, o.stagger].map((x) => (x === null || x === undefined) ? '' : String(x)).join('|');
}
export function foriDaDesign(design){
  const d = design || {};
  if (!Array.isArray(d.holes)) return null;
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const fori = [];
  let scartati = 0, valoriScartati = 0;
  for (const h of d.holes){
    const mx = n(h && h.mx), my = n(h && h.my);
    if (!(Number.isFinite(mx) && Number.isFinite(my))) { scartati++; continue; }
    const id = (h.id !== null && h.id !== undefined && String(h.id).trim() !== '') ? String(h.id).trim() : null;
    const tm = n(h.tMano);
    const f = { id, mx, my };
    if (Number.isFinite(tm)) f.tMano = tm;
    /* F1 (26/11): i valori propri del foro rientrano solo se VALIDI. Uno
       scritto e illeggibile («abc», una carica negativa) non diventa in
       silenzio il valore del progetto: il foro resta, quel valore no, e si
       CONTA — è un dato perso, e chi riapre deve poterlo sapere. */
    for (const c of CAMPI_PER_FORO){
      if (h[c] === null || h[c] === undefined || h[c] === '') continue;
      const v = valoreProprioDiForo(h, c);
      if (v === null) valoriScartati++; else f[c] = v;
    }
    fori.push(f);
  }
  /* gli id mancanti si assegnano DOPO aver letto tutti quelli dichiarati:
     misurato prima di scrivere — assegnando strada facendo, un «m1» dichiarato
     più avanti nel file diventava il doppione di un «m1» appena inventato */
  for (const f of fori) if (!f.id) f.id = idForoNuovo(fori);
  return { fori, scartati, valoriScartati };
}

export function foriDiProgetto(perRow, file){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const c = n(perRow), r = n(file);
  if (!(Number.isFinite(c) && c > 0)) return null;
  if (!(Number.isFinite(r) && r > 0)) return null;
  return c * r;
}

/* I metri perforati dell'intera volata — fori × (altezza del banco +
   sottoperforazione) — e `null` se non si contano.
   `nf` sono i fori (di progetto o disegnati, lo decide il chiamante: è
   l'unica differenza fra i tre, come per `costoVolata`). */
export function metriPerforati(nf, prof, sub, scarto){
  const n = (x) => (x === null || x === undefined || x === '') ? NaN : +x;
  const f = n(nf), h = n(prof);
  if (!(Number.isFinite(f) && f >= 0)) return null;
  if (!(Number.isFinite(h) && h > 0)) return null;
  let s = 0;
  if (sub !== undefined) {                    // assente = zero; presente e illeggibile = ferma il conto
    s = n(sub);
    if (!(Number.isFinite(s) && s >= 0)) return null;
  }
  /* `scarto` (F2, 26/11, da `scartoProfonditaProprie`): i metri in più o in
     meno dei fori con una profondità loro. Assente, zero o illeggibile lascia
     il conto esattamente com'era. */
  const base = f * (h + s), sc = n(scarto);
  return (Number.isFinite(sc) && sc !== 0) ? base + sc : base;
}

/* ══════════════════════════════════════════════════════════════════════
   G8 · I DATI DI GENESI DIETRO UNA PORTA SOLA (02/09, unità 1 di
   `docs/GENESI_FUORI_DAL_BROWSER.md` §5)
   ────────────────────────────────────────────────────────────────────────
   Genesi è l'unica app che NON esce dal browser: cinque chiavi di
   `localStorage` lette e scritte da otto funzioni sparse nella pagina
   (`_lsGet/_lsSet`, `sitoStore/sitoSalva`, `cmpSave/_cmpLoad`,
   `riconStorico`, e la scrittura di `nuvola-poc.html`). Finché è così nessun
   ponte di DATI verso Genesi è possibile, e la mappa lo dichiara.
   Questa è la prima unità del piano, e per scelta NON CAMBIA NIENTE per chi
   usa Genesi oggi: `genesiData()` è una porta con la stessa forma delle porte
   di Terra e Conti (`db.volate()`, `db.aggiungi(nome, doc)`, …) costruita
   SOPRA LE STESSE CHIAVI, con gli stessi nomi, le stesse forme e gli stessi
   tetti (50 volate, 30 lavorazioni della nuvola). Un dato scritto da qui lo
   rilegge la pagina di oggi, e viceversa. La pagina non la chiama ancora:
   sono le unità 2 e 3 a portarcela, sette punti alla volta, con un banco che
   guarda la chiave prima e dopo.
   ⚠️ Lo storage si INIETTA (`{getItem, setItem, removeItem}`): in `node` non
   c'è `localStorage`, e la prova lo passa da una `Map`. Con niente, si usa
   `globalThis.localStorage` se esiste, se no una memoria che dura quanto la
   pagina — è la scelta di Terra e Conti in modalità non-live.
   ⚠️ La forma è ASINCRONA come nelle altre app, anche se oggi sotto c'è una
   memoria sincrona: è l'unica forma che regge quando sotto ci sarà
   l'organizzazione (unità 4), e una porta con due forme è la copia debole in
   agguato.
   Le collezioni e le chiavi, una a una (§3c del documento):
     volate          ← `genesiVolate`   elenco, tetto 50, `id` per riga
     confronti       ← `genesiCmpA/B`   uno scatto per slot, `slot` per riga
     riconciliazioni ← `genesiRicon`    elenco senza tetto
     sito            ← `genesiSito`     UN documento `{punti, usa}`
     nuvole          ← `genesiNuvole`   elenco, tetto 30 (lo scrive nuvola-poc)
   Un JSON corrotto risponde vuoto — `[]`, `null` per lo scatto, il sito
   vuoto — esattamente come le otto funzioni di oggi: non è una scelta nuova,
   è la loro, tenuta uguale di proposito e messa sotto prova.
   ══════════════════════════════════════════════════════════════════════ */
const GENESI_CHIAVI = Object.freeze({
  volate: { chiave: "genesiVolate", tetto: 50 },
  riconciliazioni: { chiave: "genesiRicon", tetto: 0 },
  nuvole: { chiave: "genesiNuvole", tetto: 30 },
  /* il ponte 3e (05/09): le volate «per Sentinella», scritte dal bottone che
     prima produceva solo il file — forma di `previstaDaGenesi` in shared/ */
  previste: { chiave: "genesiPreviste", tetto: 50 },
  /* il piano di carico «per Campo» (05/09, notte): un documento per export,
     forma di `pianoDaGenesi` in shared/; Campo lo legge dall'organizzazione */
  piani: { chiave: "genesiPiani", tetto: 20 },
});
const GENESI_SLOT = Object.freeze(["A", "B"]);
const GENESI_SITO_VUOTO = () => ({ punti: [], usa: false });
export const GENESI_COLLEZIONI = Object.freeze(["volate", "confronti", "riconciliazioni", "sito", "nuvole", "previste", "piani"]);

function _memoriaStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } };
}
function _leggiJson(st, chiave, vuoto) {
  try { const v = st.getItem(chiave); return v == null || v === "" ? vuoto : JSON.parse(v); } catch (e) { return vuoto; }
}
function _scriviJson(st, chiave, valore) {
  try { st.setItem(chiave, JSON.stringify(valore)); return true; } catch (e) { return false; }
}
function _nuovoId(prefisso) { return prefisso + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* LA MODALITÀ LIVE (unità 4, 02/09). Stessa forma di `terraData`: si prova
   l'SDK in un try/catch, e si è `live` SOLO se c'è un utente membro di
   un'organizzazione; in ogni altro caso — SDK che non si carica (senza rete
   l'import da gstatic fallisce, e il service worker di Genesi non lo mette in
   cache), tour, nessun login, errore qualunque — si resta `locale`, cioè sulle
   chiavi del browser di sempre. ⛔ NON «demo in memoria»: Genesi senza
   organizzazione è un'app che funziona da sola sul dispositivo, e i dati di
   chi la usa oggi restano dove sono.
   Le cinque collezioni nascono sotto `organizations/{org}/apps/genesi/…`, il
   percorso lo costruisce `orgCollection` (mai a mano): l'isolamento fra
   organizzazioni è quello delle regole già scritte per `apps/{appId}/**`, e
   la prova negativa sta in `tests/run.mjs` sotto l'emulatore.
   Forme dei documenti, decise qui e dichiarate:
     volate / riconciliazioni / nuvole → un documento per riga, id di Firestore;
     confronti → UN documento per slot, id = "A" | "B" (per organizzazione: la
       scelta «per persona» è aperta, §3c del piano, e non si decide qui);
     sito → UN documento, id = "unico" (la legge di sito è della cava).
   I tetti (50 volate, 30 lavorazioni) valgono per il browser; nell'org NON si
   applicano — «per organizzazione o per persona» è la decisione aperta del
   §3c, e tagliare in silenzio dati condivisi sarebbe peggio di non tagliare.
   `opzioni.live === false` salta l'SDK del tutto (le prove in node). */
export async function genesiData(opzioni) {
  const o = opzioni || {};
  if (o.live !== false) {
    try {
      const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
      const id = await DeepworkID.init({ appId: "genesi" });
      if (id && id.user && id.authState() === "member") {
        const { getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, doc } =
          await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const read = async (nome) => (await getDocs(id.orgCollection(nome))).docs.map((d) => ({ id: d.id, ...d.data() }));
        const slotDi = (x) => { const s = String((x && x.slot) || x || "").toUpperCase(); return GENESI_SLOT.includes(s) ? s : null; };
        const db = {
          mode: "live",
          // chi sta lavorando: serve a firmare ciò che si porta nell'organizzazione
          utente: { uid: id.user.uid, email: id.user.email || null },
          volate: () => read("volate"),
          riconciliazioni: () => read("riconciliazioni"),
          nuvole: () => read("nuvole"),
          previste: () => read("previste"),
          piani: () => read("piani"),
          confronti: async () => (await read("confronti")).filter((c) => GENESI_SLOT.includes(c.id)).map((c) => ({ ...c, slot: c.id })),
          sito: async () => {
            const s = await getDoc(doc(id.orgCollection("sito"), "unico"));
            const v = s.exists() ? s.data() : null;
            return v && Array.isArray(v.punti) ? { punti: v.punti, usa: !!v.usa } : GENESI_SITO_VUOTO();
          },
          aggiungi: async (nome, dati) => {
            if (nome === "confronti") {
              const slot = slotDi(dati); if (!slot) throw new Error("uno scatto di confronto vuole lo slot A o B");
              const { slot: _s, id: _i, ...resto } = dati || {};
              await setDoc(doc(id.orgCollection("confronti"), slot), resto); return { id: slot };
            }
            if (nome === "sito") {
              const s = dati && Array.isArray(dati.punti) ? { punti: dati.punti, usa: !!dati.usa } : GENESI_SITO_VUOTO();
              await setDoc(doc(id.orgCollection("sito"), "unico"), s); return { id: "unico" };
            }
            if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
            const { id: _i, ...resto } = dati || {};
            const r = await addDoc(id.orgCollection(nome), resto); return { id: r.id };
          },
          aggiorna: async (nome, docId, dati) => {
            if (nome === "confronti" || nome === "sito") return db.aggiungi(nome, nome === "confronti" ? { ...(dati || {}), slot: docId } : dati);
            if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
            await updateDoc(doc(id.orgCollection(nome), docId), dati || {}); return true;
          },
          rimuovi: async (nome, docId) => {
            if (nome === "confronti") { const slot = slotDi(docId); if (!slot) return false; await deleteDoc(doc(id.orgCollection("confronti"), slot)); return true; }
            if (nome === "sito") { await deleteDoc(doc(id.orgCollection("sito"), "unico")); return true; }
            if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
            await deleteDoc(doc(id.orgCollection(nome), docId)); return true;
          },
          logout: () => id.logout(),
        };
        /* IL CONSUNTIVO DI CARICO DALL'ORGANIZZAZIONE (ponte Campo→Genesi come
           dato, 05/09 notte): il piano di carico di Campo (`pianocarico`, una
           riga per foro, con la carica reale registrata dal fochino) letto con
           una seconda istanza dell'SDK sull'appId di Campo — pigra, sola
           lettura, forma di `nuvoleGenesi` in Terra. `null` = Campo non
           leggibile, che la pagina distingue da «nessun foro registrato». */
        let idCampo;
        db.pianoCampo = async () => {
          if (idCampo === undefined) {
            try { idCampo = await DeepworkID.init({ appId: "campo" }); } catch (e) { idCampo = null; }
          }
          if (!idCampo) return null;
          try { return (await getDocs(idCampo.orgCollection("pianocarico"))).docs.map((d) => ({ id: d.id, ...d.data() })); }
          catch (e) { return null; }
        };
        return db;
      }
    } catch (e) { /* SDK assente, senza rete, o nessun membro: si resta locale */ }
  }
  const st = o.storage || (typeof globalThis !== "undefined" && globalThis.localStorage) || _memoriaStorage();
  const elenco = (nome) => { const v = _leggiJson(st, GENESI_CHIAVI[nome].chiave, []); return Array.isArray(v) ? v : []; };
  const scriviElenco = (nome, arr) => {
    const t = GENESI_CHIAVI[nome].tetto; const a = arr.slice();
    if (t > 0) while (a.length > t) a.shift();
    _scriviJson(st, GENESI_CHIAVI[nome].chiave, a); return a;
  };
  const scatto = (slot) => { const v = _leggiJson(st, "genesiCmp" + slot, null); return v && typeof v === "object" ? { ...v, slot } : null; };
  const sito = () => { const s = _leggiJson(st, "genesiSito", null); return s && Array.isArray(s.punti) ? { punti: s.punti, usa: !!s.usa } : GENESI_SITO_VUOTO(); };
  const slotDi = (x) => { const s = String((x && x.slot) || x || "").toUpperCase(); return GENESI_SLOT.includes(s) ? s : null; };
  const db = {
    mode: "locale",
    utente: null,   // da solo sul dispositivo non c'è nessuno da firmare
    volate: async () => elenco("volate"),
    riconciliazioni: async () => elenco("riconciliazioni"),
    nuvole: async () => elenco("nuvole"),
    previste: async () => elenco("previste"),
    piani: async () => elenco("piani"),
    confronti: async () => GENESI_SLOT.map(scatto).filter(Boolean),
    sito: async () => sito(),
    /* da soli sul dispositivo Campo non si legge: `null`, e la pagina lascia il file */
    pianoCampo: async () => null,
    aggiungi: async (nome, doc) => {
      if (nome === "confronti") {
        const slot = slotDi(doc); if (!slot) throw new Error("uno scatto di confronto vuole lo slot A o B");
        const { slot: _s, ...resto } = doc || {};
        _scriviJson(st, "genesiCmp" + slot, resto); return { id: slot };
      }
      if (nome === "sito") {
        const s = doc && Array.isArray(doc.punti) ? { punti: doc.punti, usa: !!doc.usa } : GENESI_SITO_VUOTO();
        _scriviJson(st, "genesiSito", s); return { id: "sito" };
      }
      if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
      const d = { ...(doc || {}) }; if (d.id == null || d.id === "") d.id = _nuovoId(nome === "volate" ? "v" : "g");
      scriviElenco(nome, [...elenco(nome), d]); return { id: d.id };
    },
    aggiorna: async (nome, id, doc) => {
      if (nome === "confronti" || nome === "sito") return db.aggiungi(nome, nome === "confronti" ? { ...(doc || {}), slot: id } : doc);
      if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
      const a = elenco(nome); const i = a.findIndex((x) => x && x.id === id);
      if (i < 0) return false;
      a[i] = { ...a[i], ...(doc || {}), id }; scriviElenco(nome, a); return true;
    },
    rimuovi: async (nome, id) => {
      if (nome === "confronti") { const slot = slotDi(id); if (!slot) return false; const c = scatto(slot) !== null; try { st.removeItem("genesiCmp" + slot); } catch (e) {} return c; }
      if (nome === "sito") { try { st.removeItem("genesiSito"); } catch (e) {} return true; }
      if (!GENESI_CHIAVI[nome]) throw new Error("collezione sconosciuta: " + nome);
      const a = elenco(nome); const n = a.length; const r = a.filter((x) => !(x && x.id === id));
      if (r.length === n) return false;
      scriviElenco(nome, r); return true;
    },
    logout: async () => {},
  };
  return db;
}

/* ══════════════════════════════════════════════════════════════════════
   G9 · «PORTA LE TUE VOLATE NELL'ORGANIZZAZIONE» (02/09, unità 5 del piano)
   ────────────────────────────────────────────────────────────────────────
   Chi ha usato Genesi da solo ha volate, scatti A/B, riconciliazioni, la legge
   di sito e le lavorazioni della nuvola nelle chiavi del browser. Al primo
   accesso con un'organizzazione, questa funzione le COPIA nelle collezioni
   dell'organizzazione — una volta sola per browser, e senza cancellare niente
   dal browser: le chiavi restano com'erano, perché sono il ripiego di chi
   lavora senza rete e perché un dato si copia prima di fidarsi della copia.
   ⛔ UNA VOLTA SOLA vuol dire un CONTRASSEGNO nel browser (`genesiMigratoV1`,
   con la data e i conti): la seconda chiamata risponde `gia: true` e scrive
   ZERO. Il contrassegno è per browser, non per persona: chi porta le stesse
   volate da due computer le troverà due volte nell'organizzazione — è un
   limite dichiarato (§5 del piano), e la funzione lo mette nel risultato
   (`origine: 'browser'`, `autore`, `creatoIl` su ogni riga) perché si possa
   vedere da dove viene ogni cosa invece di nasconderlo.
   Pura rispetto alle porte: `daLocale` e `aOrg` sono due `genesiData` (o due
   finti con la stessa forma), `contrassegno` è un `{getItem, setItem}` — così
   la prova gira in node con due Map. */
export const GENESI_CONTRASSEGNO_MIGRAZIONE = "genesiMigratoV1";
export async function portaNellOrganizzazione(daLocale, aOrg, contrassegno, opzioni) {
  const o = opzioni || {};
  const st = contrassegno || { getItem: () => null, setItem: () => {} };
  const vuoto = { volate: 0, confronti: 0, riconciliazioni: 0, sito: 0, nuvole: 0 };
  let gia = null;
  try { gia = JSON.parse(st.getItem(GENESI_CONTRASSEGNO_MIGRAZIONE) || "null"); } catch (e) { gia = null; }
  if (gia && typeof gia === "object") return { gia: true, quando: gia.quando || null, scritte: { ...vuoto }, totale: 0, giaScritte: gia.scritte || null };
  if (!daLocale || !aOrg) return { gia: false, scritte: { ...vuoto }, totale: 0, errore: "mancano le due porte" };
  if (aOrg.mode !== "live" && !o.ancheSeNonLive) return { gia: false, scritte: { ...vuoto }, totale: 0, errore: "la destinazione non è un'organizzazione" };
  const quando = o.quando || new Date().toISOString();
  const marchia = (r) => {
    const { id: _i, ...resto } = r || {};
    return { ...resto, origine: "browser", autore: o.autore || null, creatoIl: (resto && resto.creatoIl) || quando };
  };
  const scritte = { ...vuoto };
  for (const nome of ["volate", "riconciliazioni", "nuvole"]) {
    const righe = await daLocale[nome]();
    for (const r of Array.isArray(righe) ? righe : []) { if (!r) continue; await aOrg.aggiungi(nome, marchia(r)); scritte[nome]++; }
  }
  for (const c of await daLocale.confronti()) { if (!c || !c.slot) continue; await aOrg.aggiungi("confronti", { ...marchia(c), slot: c.slot }); scritte.confronti++; }
  const sito = await daLocale.sito();
  if (sito && Array.isArray(sito.punti) && sito.punti.length) { await aOrg.aggiungi("sito", { punti: sito.punti, usa: !!sito.usa }); scritte.sito = 1; }
  const totale = Object.values(scritte).reduce((a, b) => a + b, 0);
  try { st.setItem(GENESI_CONTRASSEGNO_MIGRAZIONE, JSON.stringify({ quando, scritte, autore: o.autore || null })); } catch (e) {}
  return { gia: false, quando, scritte, totale };
}

/* ⛔ E L'ALTRA METÀ DELL'APERTURA (02/09, unità 7 del piano «Genesi fuori dal
   browser»): i campi del design che NON sono numeri. `volataSenzaValori` nomina
   i 21 numerici illeggibili; questi 11 — esplosivo, innesco, roccia,
   fratturazione, sequenza, norma del recettore, tre bandiere, due profili —
   arrivavano dalla porta senza nessuno che li guardasse, e il difetto è più
   silenzioso di uno zero: `selEsplosivo()` e `selRoccia()` RIPIEGANO SUL
   DEFAULT quando l'id non è nel catalogo, quindi una volata salvata con un
   esplosivo che questa versione non conosce (o da un altro browser
   dell'organizzazione, con un catalogo diverso) si apre con un altro
   esplosivo e nessuna parola. La pagina passa i suoi cataloghi (vivono lì:
   ESPL, INNESCHI, ROCCE, le tendine, NORME_PPV) e qui si dice che cosa non si
   riconosce, con la stessa forma di `volataSenzaValori`: `che` e `come`.
   Un campo ASSENTE non si segnala (volata salvata prima che esistesse); un
   valore presente e sconosciuto sì. Le bandiere devono essere booleane, i
   profili elenchi. */
export const CAMPI_SCELTA = {
  esplosivo: 'esplosivo', innesco: 'innesco', roccia: 'roccia',
  frat: 'fratturazione', sequenza: 'sequenza di sparo', recNorma: 'norma del recettore',
};
export const CAMPI_BANDIERA = { kgAuto: 'carica automatica', bagnato: 'foro bagnato', presplit: 'presplit' };
export const CAMPI_PROFILO = { profilo: 'profilo del fronte', piede: 'piede del fronte' };
export function designSconosciuti(design, cataloghi) {
  const d = design && typeof design === 'object' ? design : {};
  const c = cataloghi && typeof cataloghi === 'object' ? cataloghi : {};
  const campi = [];
  const ha = (k) => Object.prototype.hasOwnProperty.call(d, k) && d[k] !== undefined;
  for (const k of Object.keys(CAMPI_SCELTA)) {
    if (!ha(k)) continue;
    const ids = Array.isArray(c[k]) ? c[k].map(String) : null;
    if (!ids) continue;                       // la pagina non ha passato quel catalogo: non si giudica
    /* ⛔ LA NORMA DEL RECETTORE NON SI SOSTITUISCE (03/09, passata di verifica).
       Un esplosivo al posto di un altro si vede nella tendina; un codice di
       norma che non si riconosce, rimpiazzato con «DIN residenziale», produce
       un LIMITE (15 mm/s) e un VERDETTO («ampiamente sotto soglia») su una
       norma che nessuno ha scelto — misurato: nove KO in tre banchi (scheda
       CSV, report stampabile, file per Sentinella), tutti «limite 15,0, DIN
       residenziale» dove dal 08/08 usciva «non confrontabile». È il principio
       del fondatore: l'assenza di un dato non è un dato favorevole. Quindi il
       codice resta com'è scritto — `ppvSenzaSoglia` lo vede, `normaPpvLab` lo
       ripete — e il campo porta `sostituisci:false`, che la pagina legge. */
    if (!ids.includes(String(d[k]))) campi.push({ chiave: k, nome: CAMPI_SCELTA[k], valore: d[k] === null ? '' : String(d[k]), sostituisci: k !== 'recNorma' });
  }
  for (const k of Object.keys(CAMPI_BANDIERA)) if (ha(k) && typeof d[k] !== 'boolean') campi.push({ chiave: k, nome: CAMPI_BANDIERA[k], valore: String(d[k]), sostituisci: true });
  for (const k of Object.keys(CAMPI_PROFILO)) if (ha(k) && !Array.isArray(d[k])) campi.push({ chiave: k, nome: CAMPI_PROFILO[k], valore: String(d[k]), sostituisci: true });
  if (!campi.length) return null;
  const nomi = campi.map((x) => x.nome + (x.valore ? ' («' + x.valore + '»)' : ' (vuoto)'));
  const sost = campi.filter((x) => x.sostituisci), tenuti = campi.filter((x) => !x.sostituisci);
  const come = [];
  if (sost.length) come.push(sost.length === 1
    ? 'Al suo posto è entrato il valore di partenza: controllalo nei parametri prima di fidarti dei numeri.'
    : 'Al loro posto sono entrati i valori di partenza: controllali nei parametri prima di fidarti dei numeri.');
  if (tenuti.length) come.push('Per la norma del recettore non entra nessun valore di partenza: resta com\'è scritta e il limite PPV non si calcola finché non ne scegli una nei parametri.');
  return { campi,
    che: (nomi.length === 1 ? 'una scelta non si riconosce: ' : nomi.length + ' scelte non si riconoscono: ') + nomi.join(', '),
    come: come.join(' ') };
}

/* ══════════════════════════════════════════════════════════════════════════
   I PONTI DI GENESI, IN HOME (05/09, notte). Il pannello «Ponte Deepwork» della
   Home diceva che lo scambio passa «tramite file .volata.json»: vero per il
   core, e dal 05/09 FALSO per le altre app — le volate previste vanno a
   Sentinella, il piano di carico va a Campo e il consuntivo torna, le nuvole
   vanno a Terra, tutti come dati. Un testo che invecchia in una schermata è un
   «non c'è» scaduto letto dal fondatore. Qui il riepilogo è calcolato: quanti
   record ha scritto ogni ponte e quando l'ultimo, `null` = non leggibile (che
   non è zero), e lo stato vuoto dice come si produce il primo. Pura. */
export function riepilogoPontiGenesi(dati) {
  const d = dati || {};
  const lista = (x) => (Array.isArray(x) ? x : null);
  const dove = d.mode === "live" ? "nell'organizzazione" : "su questo computer";
  const ultimoDi = (arr, campo) => {
    let u = "";
    for (const r of arr || []) { const v = String((r && campo(r)) || ""); if (v > u) u = v; }
    return u;
  };
  const uno = (app, cosa, arr, campo, vuoto, plurali) => {
    if (!arr) return { app, cosa, n: null, ultimo: "", leggibile: false,
      testo: cosa + " " + (d.mode === "live" ? "non leggibili adesso: riprova più tardi" : "non leggibili") };
    const n = arr.length, ultimo = ultimoDi(arr, campo);
    if (!n) return { app, cosa, n: 0, ultimo: "", leggibile: true, testo: vuoto };
    /* la data dell'ultimo resta ISO in `ultimo`: la scrive la pagina, con il
       suo formattatore — un ISO dentro una frase è un numero nel vestito
       sbagliato, e un formattatore riscritto qui è la copia debole */
    return { app, cosa, n, ultimo, leggibile: true,
      testo: (n === 1 ? plurali[0] : n + " " + plurali[1]) + " " + dove, codaUltimo: n === 1 ? "del" : "l'ultimo del" };
  };
  return {
    dove,
    righe: [
      uno("Sentinella", "le volate previste", lista(d.previste), (r) => r.data,
        "Nessuna volata prevista scritta ancora: dalla scheda volata, «per Sentinella» la manda al registro (non solo al file).",
        ["una volata prevista scritta", "volate previste scritte"]),
      uno("Campo", "i piani di carico", lista(d.piani), (r) => String(r.quando || "").slice(0, 10),
        "Nessun piano di carico scritto ancora: «Esporta piano di carico» lo manda a Campo (non solo al file).",
        ["un piano di carico scritto", "piani di carico scritti"]),
      uno("Terra", "le lavorazioni della nuvola", lista(d.nuvole), (r) => String(r.data || "").slice(0, 10),
        "Nessuna lavorazione della nuvola: dal visore, ogni ritaglio con un volume arriva a Terra da solo.",
        ["una lavorazione scritta", "lavorazioni scritte"]),
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   G22 · IL FATTORE ROCCIA DI LILLY/CUNNINGHAM E L'x50 MISURATO SUL CUMULO —
   la testa e la coda della catena della frammentazione, salite dalla pagina
   il 10/09 (cantiere B3, quarta fetta).
   ═══════════════════════════════════════════════════════════════════════════
   La catena è `A → x50 di Kuz-Ram (fragKuzRam) → curva Rosin-Rammler →
   confronto con l'x50 misurato sul cumulo`: i due anelli di mezzo erano già
   qui (blocchi G12-G13), i due estremi stavano in `genesi.html` e nessuna
   prova poteva chiamarli. Sbagliare A non produce un difetto grafico: sposta
   la pezzatura prevista di TUTTE le volate di quella roccia, e da lì il
   consumo specifico consigliato, il rigonfiamento del cumulo (SF, che la
   pagina ricava da A) e il verdetto «coerente / non coerente» del confronto
   con la misura al cumulo.

   `fattoreRoccia(roccia, scelte)` — l'indice di brillabilità di Lilly,
   A = 0,06·(RMD + JF + RDI + HF), come Cunningham lo usa nel modello di
   Kuz-Ram: RMD dalla scheda della litologia, JF = jcf·(jps·mul + jpa) dove
   `mul` è la fratturazione scelta a schermo (fessurata 0,55 · media 1 ·
   compatta 1,35), RDI = 0,025·ρ − 50 con ρ in kg/m³, HF = E/3 sotto i 50 GPa
   e UCS/5 sopra. UCS ed E si possono ridire a schermo (`scelte.ucs`,
   `scelte.eMod`): uno zero o un vuoto valgono «quello della litologia», che
   è il comportamento di sempre. A è tenuto fra 1 e 16 come nel modello.
   Entrata IDENTICA, riga per riga: la pagina la chiama con `selRoccia()` e
   `D2`, e `rockFactorA` resta come legame, come `computeMIC` per
   `micFinestra`. Provato parola per parola: la vecchia funzione estratta dal
   file e messa accanto a questa su 6 litologie × UCS, E, fratturazione
   (compresi vuoti, zeri e valori fuori scala) → 0 divergenze.
   ⚠️ Quello che NON fa, e resta com'era: una litologia senza `ucs` né `eMod`
   e senza i due valori a schermo risponde `A: NaN` — nelle sei schede
   catalogate non succede, e inventare qui un valore sarebbe il numero
   tranquillo che questo repository combatte. Chi aggiunge una litologia le
   dà UCS ed E.

   `x50DaMisure(misure)` — la pezzatura mediana del CUMULO da un campione di
   pezzi misurati (cm): ogni pezzo pesa per il suo volume (d³), la curva
   passante cumulata si legge su quei pesi e l'x50 si interpola fra i due
   pezzi che stanno a cavallo del 50%. È il confronto qualitativo con la
   previsione di Kuz-Ram, e la pagina lo scrive: non sostituisce un'analisi
   granulometrica strumentale. Sotto due misure positive risponde `null` —
   con un pezzo solo non c'è una distribuzione, e uno «x50» da un pezzo
   sarebbe il pezzo. Anche questa è entrata identica. */
export function fattoreRoccia(roccia, scelte){
  const r=roccia||{}, D2=scelte||{};
  const rho=(r.rho||2.6)*1000, ucs=D2.ucs||r.ucs, E=D2.eMod||r.eMod;
  const mul={fessurata:0.55,media:1,compatta:1.35}[D2.frat]||1;
  const RDI=0.025*rho-50, HF=E<50?E/3:ucs/5, JF=(r.jcf||1)*((r.jps||50)*mul+(r.jpa||30));
  const A=Math.max(1,Math.min(16, 0.06*((r.rmd||20)+JF+RDI+HF)));
  return { A:+A.toFixed(1), BI:Math.round(A/0.06), RDI:Math.round(RDI), HF:Math.round(HF), JF:Math.round(JF) };
}
export function x50DaMisure(misure){
  const v=(misure||[]).filter(x=>x>0).sort((a,b)=>a-b);
  if(v.length<2) return null;
  const w=v.map(d=>d*d*d), tot=w.reduce((a,b)=>a+b,0);
  let c=0; const pts=[];
  for(let i=0;i<v.length;i++){ c+=w[i]; pts.push([v[i], c/tot]); }
  let x50=v[v.length-1];
  for(let i=0;i<pts.length;i++){ if(pts[i][1]>=0.5){
    if(i===0) x50=pts[0][0];
    else { const [x0,p0]=pts[i-1], [x1,p1]=pts[i]; x50 = x0 + (0.5-p0)/(p1-p0)*(x1-x0); }
    break; } }
  return { pts, x50, n:v.length };
}

/* ═══════════════════════════════════════════════════════════════════════════
   G23 · LA FIRMA DEL FORO SINGOLO E LA SOMMA RITARDATA — il PPV composito
   esce dalla pagina (10/09, cantiere B3, quinta fetta).
   ═══════════════════════════════════════════════════════════════════════════
   Il metodo è quello dell'analisi della «signature hole»: si registra col
   sismografo l'onda di UN foro sparato da solo, e la si somma a sé stessa
   spostata sui tempi di detonazione del piano di tiro. Il massimo della somma
   è il PPV composito che la volata intera produrrà in quel punto — e che la
   pagina mostra accanto al limite di norma. Tre funzioni, tre anelli:

   `ondaDaCsv(testo)` — la registrazione letta dal file del sismografo
   (`tempo_ms;ampiezza`, il separatore è quello del file): `{t, a, dt}` con
   il passo di campionamento medio (mai sotto 0,05 ms), `null` sotto tre
   campioni. ⛔ NON è entrata identica, ed è l'unica delle tre: la
   `_sigParse` della pagina spezzava OGNI riga su `;` `,` e TAB insieme e
   poi sostituiva la virgola col punto — cioè una registrazione scritta
   all'italiana, «0,5;1,23», diventava tempo 0 e ampiezza 5, e il composito
   si calcolava su un'onda che non è mai esistita, senza un errore. Adesso il
   file lo legge `leggiCsv` di `shared/` (un separatore per file, le
   virgolette, il BOM) e le celle `numIt` (la virgola italiana E il punto):
   sui file scritti col punto — quelli che escono da Genesi stessa e dai
   sismografi in inglese — la risposta è identica a prima, provato su 20.000
   file generati; sui file all'italiana è quella giusta.

   `tempiDetonazione(design)` — i tempi su cui sommare: quelli dei fori
   DISEGNATI se ci sono, altrimenti la griglia di progetto (`foriDiProgetto`,
   che sa dire `null` quando la griglia non si legge: la storia del «18 fori
   a 25 ms» è nel blocco G21 e nel commento della pagina). Il ripiego a `[0]`
   in fondo non è la stessa cosa: evita un vettore vuoto alla somma
   (`Math.max([])` fa -Infinity) e ci si arriva solo con una griglia
   leggibile che non produce nessun tempo. Entrata identica: la pagina la
   chiama con `D2` e `_sigDetTimes` resta come legame.

   `sommaRitardata(onda, tempi)` — la somma vera: l'onda ricopiata a ogni
   tempo di detonazione (arrotondato al passo) e sommata campione per
   campione, con un tetto di 80.000 passi; risponde il composito, il PPV
   (massimo del valore assoluto della somma) e `singolo` (il massimo
   dell'onda da sola), così la pagina può dire di quanto la volata amplifica
   il foro singolo. Entrata identica, provata su 20.000 casi. */
export function ondaDaCsv(testo){
  const rows=leggiCsv(testo).righe
    .filter(p=>p.length>=2)
    .map(p=>[numIt(p[0]), numIt(p[1])])
    .filter(p=>isFinite(p[0])&&isFinite(p[1]));
  if(rows.length<3) return null;
  const t=rows.map(r=>r[0]), a=rows.map(r=>r[1]);
  /* ⛔ 26/11: LA PRIMA COLONNA DEVE ESSERE UN TEMPO, E UN TEMPO NON TORNA
     INDIETRO. I sismografi da volata esportano la forma d'onda come tabella
     di CANALI (`Tran  Vert  Long  MicL`) senza colonna del tempo — il tempo
     sta nella frequenza di campionamento dell'intestazione (così la leggono
     i due lettori pubblici di quei file, `gmsp` e BlastingPy: vedi
     reports/Genesi formati di scambio cava.md). Su una tabella così questa
     funzione prendeva il canale trasversale per il TEMPO e il verticale per
     l'ampiezza, e restituiva un'onda: misurato su 40 campioni, «tempi»
     0 · 0,654 · 1,237 · 1,683 …, cioè una sinusoide spacciata per orologio,
     e nessun avviso. È il numero plausibile dove non è stato letto niente.
     La guardia non conosce nessun formato: chiede solo che il tempo non
     scenda mai e che dall'inizio alla fine sia andato avanti. */
  for(let i=1;i<t.length;i++) if(t[i]<t[i-1]) return null;
  if(!(t[t.length-1]>t[0])) return null;
  const dt=Math.max(0.05,(t[t.length-1]-t[0])/(t.length-1));
  return {t,a,dt};
}
/* Perché `ondaDaCsv` ha detto di no, con le parole per chi ha il file in
   mano. Stringa vuota se l'onda si legge. Non è un secondo lettore: chiama
   quello, e solo se rifiuta guarda la forma del testo per dire quale dei
   tre casi è. */
export function ondaPercheNo(testo){
  if(ondaDaCsv(testo)) return '';
  const s=String(testo==null?'':testo);
  if(/\bTran\b[^A-Za-z\n]+Vert\b[^A-Za-z\n]+Long\b/i.test(s))
    return 'Questo è l’export di un sismografo a canali (Tran / Vert / Long) senza la colonna del tempo: Genesi per ora legge due colonne, tempo in ms e ampiezza. Esporta un solo canale col suo tempo, oppure aggiungi la colonna del tempo in un foglio di calcolo.';
  const rows=leggiCsv(s).righe.filter(p=>p.length>=2).map(p=>[numIt(p[0]), numIt(p[1])]).filter(p=>isFinite(p[0])&&isFinite(p[1]));
  if(rows.length>=3)
    return 'La prima colonna non è un tempo: non cresce dall’inizio alla fine. Servono due colonne, tempo in ms e ampiezza (tempo_ms;ampiezza).';
  return 'CSV non valido: servono almeno tre righe con due colonne, tempo in ms e ampiezza (tempo_ms;ampiezza).';
}
export function tempiDetonazione(design){
  const D2=design||{};
  const H=D2.holes;
  if(H&&H.length) return H.map(h=>+h.tDet||0);
  const n=foriDiProgetto(D2.perRow, D2.file);
  /* ⛔ 10/09 (G25): un ritardo VUOTO non è un ritardo di zero. `+null` e `+""`
     fanno 0, e uno zero è legittimo (tutti simultanei), quindi fino a qui un
     campo mai scritto produceva N tempi a 0 ms — il composito più alto
     possibile, su un piano di tiro che nessuno ha scritto. È la stessa
     famiglia del «18 fori a 25 ms» di G21, un ripiego più in là: adesso
     null/"" rispondono `null`, come la griglia illeggibile. Lo zero scritto
     resta uno zero. */
  const v=(x)=>(x===null||x===undefined||x==='')?NaN:+x;
  const ri=v(D2.ritardo), rf=v(D2.ritardoFila);
  if(n===null || !Number.isFinite(ri) || ri<0 || !Number.isFinite(rf) || rf<0) return null;
  const nc=Math.max(1,+D2.perRow), nr=Math.max(1,+D2.file), out=[];
  for(let r=0;r<nr;r++) for(let c=0;c<nc;c++) out.push(c*ri+r*rf);
  return out.length?out:[0];   // mai vuoto: evita Math.max([]) = -Infinity nella somma
}
export function sommaRitardata(sig,times){
  const dt=sig.dt, n=sig.a.length, dur=sig.t[n-1]-sig.t[0];
  const tmax=Math.max.apply(null,times)+dur, steps=Math.min(80000,Math.ceil(tmax/dt)+2);
  const comp=new Float64Array(steps);
  for(const td of times){ const off=Math.round(td/dt); for(let i=0;i<n;i++){ const k=off+i; if(k>=0&&k<steps) comp[k]+=sig.a[i]; } }
  let ppv=0,singolo=0; for(let i=0;i<n;i++) singolo=Math.max(singolo,Math.abs(sig.a[i]));
  for(let i=0;i<steps;i++){ const v=Math.abs(comp[i]); if(v>ppv) ppv=v; }
  return {comp,dt,ppv,singolo,steps};
}

/* ═══════════════════════════════════════════════════════════════════════════
   G24 · LA GEOMETRIA DELLA PIANTA — la cresta importata, il burden vero, la
   spaziatura tipica, il campo dei tempi e il passo delle isocrone (10/09,
   cantiere B3, sesta fetta).
   ═══════════════════════════════════════════════════════════════════════════
   Cinque funzioni che la pianta 2D e la scena 3D chiamano per leggere la
   forma della volata, tutte entrate IDENTICHE (vecchie funzioni estratte da
   HEAD accanto alle nuove, 0 divergenze; i conti sono nel commit).

   `quotaCresta(profilo, x)` — l'offset z della faccia lungo x dal profilo
   della cresta importato (spezzata di `{x, z}`): fuori dagli estremi vale
   l'estremo, in mezzo si interpola, senza profilo vale 0 (fronte dritto), e
   il risultato è tenuto fra −6 e +10 m (il clamp di sicurezza della pagina).
   La pagina la chiama con `P.profilo` e `crestZ` resta come legame.

   `distanzaDaSpezzata(px, py, punti)` — la distanza minima da un punto a
   una spezzata di `[x, y]`: è il BURDEN VERO, cioè la distanza PERPENDICOLARE
   alla faccia libera, che su un fronte storto si accorcia dove la roccia
   sporge (è lì che nascono le proiezioni) anche se il foro sta alla distanza
   di progetto — una cosa diversa dal volume servito. `null` se la spezzata
   non ha nemmeno un segmento.

   `spaziaturaTipica(fori, ripiego)` — la mediana delle distanze al foro più
   vicino: con meno di due fori risponde il `ripiego`, che la pagina calcola
   da progetto (`max(S, B)`) e passa — così questa funzione non legge lo
   stato. Decide il raggio con cui si cercano i fori ADIACENTI e la larghezza
   del campo dei tempi.

   `tempoInPunto(px, py, fori, h2)` — il tempo di sparo in un punto della
   pianta ricostruito DAI `tDet` dei fori vicini: minimi quadrati mobili di un
   piano t = a + b·dx + c·dy con pesi gaussiani (`h2` è il quadrato della
   larghezza), regolarizzato su b e c perché regga anche una fila sola.
   Risponde `{t, dmin}`: `t` null se nessun foro pesa, e `dmin` è la distanza
   dal foro più vicino con cui chi disegna decide dove NON estrapolare.

   `passoIsocrone(passoScelto, ultimaDetonazione)` — il passo in ms fra due
   curve: quello scelto a schermo se c'è, se no il primo della scala
   `ISO_PASSI` che dà al massimo dieci curve sull'ultima detonazione (sei-
   dieci curve si leggono senza affollare). `isoPasso` resta come legame. */
export const ISO_PASSI=[1,2,5,10,20,25,50,100,200,250,500,1000];
export function quotaCresta(profilo, x){
  const pr = profilo;
  if(!pr || pr.length<1) return 0;
  let z;
  if(x<=pr[0].x) z = pr[0].z;
  else if(x>=pr[pr.length-1].x) z = pr[pr.length-1].z;
  else { z = pr[pr.length-1].z; for(let i=1;i<pr.length;i++){ if(x<=pr[i].x){ const a=pr[i-1], b=pr[i]; const t=(x-a.x)/((b.x-a.x)||1); z = a.z+(b.z-a.z)*t; break; } } }
  return Math.max(-6, Math.min(10, z));   // clamp di sicurezza
}
export function distanzaDaSpezzata(px,py,pts){
  let best=Infinity;
  for(let i=0;i<pts.length-1;i++){
    const ax=pts[i][0], ay=pts[i][1], bx=pts[i+1][0], by=pts[i+1][1];
    const vx=bx-ax, vy=by-ay, L2=vx*vx+vy*vy;
    let t = L2>1e-9 ? ((px-ax)*vx+(py-ay)*vy)/L2 : 0;
    t=Math.max(0,Math.min(1,t));
    const dx=px-(ax+t*vx), dy=py-(ay+t*vy), d=Math.hypot(dx,dy);
    if(d<best) best=d;
  }
  return isFinite(best)?best:null;
}
export function spaziaturaTipica(H, ripiego){
  if(!H||H.length<2) return ripiego;
  const dd=[];
  for(let i=0;i<H.length;i++){ let m=Infinity;
    for(let j=0;j<H.length;j++){ if(j===i) continue; const d=Math.hypot(H[j].mx-H[i].mx,H[j].my-H[i].my); if(d<m)m=d; }
    if(isFinite(m)) dd.push(m); }
  dd.sort((a,b)=>a-b);
  return dd.length? dd[Math.floor(dd.length/2)] : ripiego;
}
/* Trasloco B3 (14/09): il legame di una riga sul ripiego di progetto è
   uscito anche lui — `D2` come primo argomento esplicito, come già per
   `pfNominale`/`pieDev`/`reliefCls`/`computeEnergia2D`/`isoPasso`/`scatterMs`. */
export function _spazTipico(D2, H){ return spaziaturaTipica(H, Math.max(D2.S||3.5, D2.B||3)); }
export function tempoInPunto(px,py,H,h2){
  let W=0,Sx=0,Sy=0,Sxx=0,Sxy=0,Syy=0,St=0,Stx=0,Sty=0,dmin=Infinity;
  for(let i=0;i<H.length;i++){
    const dx=H[i].mx-px, dy=H[i].my-py, d2=dx*dx+dy*dy;
    if(d2<dmin) dmin=d2;
    if(d2>9*h2) continue;                                    // peso trascurabile: si salta
    const w=Math.exp(-d2/h2), t=H[i].tDet||0;
    W+=w; Sx+=w*dx; Sy+=w*dy; Sxx+=w*dx*dx; Sxy+=w*dx*dy; Syy+=w*dy*dy;
    St+=w*t; Stx+=w*dx*t; Sty+=w*dy*t;
  }
  const dm=Math.sqrt(dmin);
  if(W<=0) return {t:null, dmin:dm};
  const lam=1e-3*W*h2;                                       // regolarizzazione su b,c: regge i fori allineati
  const a11=W,a12=Sx,a13=Sy, a22=Sxx+lam,a23=Sxy, a33=Syy+lam;
  const det=a11*(a22*a33-a23*a23) - a12*(a12*a33-a23*a13) + a13*(a12*a23-a22*a13);
  if(!isFinite(det) || Math.abs(det)<1e-12) return {t:St/W, dmin:dm};
  const d0=St*(a22*a33-a23*a23) - a12*(Stx*a33-a23*Sty) + a13*(Stx*a23-a22*Sty);
  const t=d0/det;
  return {t:isFinite(t)?t:St/W, dmin:dm};
}
export function passoIsocrone(passoScelto, ultimaDetonazione){
  if(passoScelto>0) return passoScelto;
  const T=Math.max(1,ultimaDetonazione||0);
  for(let i=0;i<ISO_PASSI.length;i++) if(T/ISO_PASSI[i]<=10) return ISO_PASSI[i];   // ~6-10 curve: leggibili senza affollare
  return ISO_PASSI[ISO_PASSI.length-1];
}
export function isoPasso(D2){ return passoIsocrone(D2.isoStep, D2.lastDet); }

/* ═══════════════════════════════════════════════════════════════════════════
   G25 · LE FILE DEI FORI, I TAGLI DEI RACCORDI E LE CELLE DEL CONFRONTO A/B
   (10/09, cantiere B3, settima fetta).
   ═══════════════════════════════════════════════════════════════════════════
   `fileDeiFori(fori)` — i fori disegnati raggruppati in FILE per distanza
   dalla faccia (`my`), con una tolleranza di 0,45 m perché una fila
   trascinata a mano non è mai perfettamente dritta; ogni fila porta gli
   indici dei suoi fori e la loro distanza media, e le file escono già
   ordinate dalla faccia verso l'interno. È il primo passo della mappa
   dell'energia (G5: il burden vero di ogni fila verso quella davanti) e
   della scheda dei fori. Entrata identica.

   `INN_TAGLI` e `taglioRealizzabile(dt, innesco, tagli)` — i raccordi di
   superficie di uso comune (9, 17, 25, 42, 65, 100, 109, 176, 200 ms) e la
   regola «un ritardo di raccordo è realizzabile se esiste il taglio, a ±1 ms,
   oppure se l'innesco è elettronico (che programma qualunque millisecondo)»;
   un `dt` assente è realizzabile per definizione (non c'è un raccordo da
   trovare). La pagina la chiama con `D2.innesco` e `innTaglioOk` resta come
   legame. Entrata identica.

   `_cmpNum`, `_cmpKg`, `_cmpEur`, `_cmpPf`, `_cmpCm`, `_cmpFly` — le celle
   del confronto A/B fra due scatti di una volata: si giudica dal NUMERO
   (`null`, vuoto o illeggibile → «non calcolabile» in giallo, mai uno zero
   né un trattino che accanto a una gittata si legge «nessuno sgombero»), e
   la bandiera `fragCalcolabile`/`flyCalcolabile`, quando c'è, vale in più —
   così uno scatto salvato prima che la bandiera esistesse non fa sparire
   una riga sana. Entrate identiche, coi loro nomi: sono le celle di un
   documento che la pagina compone, e da qui `node` le legge. */
export function fileDeiFori(H){
  /* i fori si raggruppano in file per distanza dalla faccia; la tolleranza
     serve perché una fila trascinata a mano non è mai perfettamente dritta */
  const idx=H.map((h,i)=>i).sort((a,b)=>H[a].my-H[b].my);
  const file=[]; let cur=null;
  for(const i of idx){
    const my=H[i].my;
    if(!cur || my-cur.myMax>0.45){ cur={ myMax:my, holes:[i] }; file.push(cur); }
    else { cur.holes.push(i); cur.myMax=Math.max(cur.myMax,my); }
  }
  file.forEach(f=>{ f.my=f.holes.reduce((s,i)=>s+H[i].my,0)/f.holes.length; });
  return file;                                               // già ordinate dalla faccia verso l'interno
}
export const INN_TAGLI=[9,17,25,42,65,100,109,176,200];           // raccordi di superficie di uso comune
export function taglioRealizzabile(dt, innesco, tagli){
  if(dt==null) return true;
  if((innesco||'')==='elettronico') return true;
  return (tagli||INN_TAGLI).some(v=>Math.abs(v-dt)<=1.0);
}
/* un ritardo è realizzabile se esiste il raccordo (o se si usa l'elettronico).
   Trasloco B3 (14/09): il legame con l'innesco scelto è uscito anche lui —
   `D2` come primo argomento esplicito, stesso schema delle altre fette. */
export function innTaglioOk(D2, dt){ return taglioRealizzabile(dt, D2.innesco, INN_TAGLI); }
export function _cmpNum(v){ return (v===null||v===undefined||v==='')?null:(isFinite(+v)?+v:null); }
export function _cmpKg(k){ const v=_cmpNum(k&&k.qtot); return v===null?'<i style="color:#ffca28">non calcolabile</i>':gnum(v,0)+' kg'; }
export function _cmpEur(k){ const v=_cmpNum(k&&k.cost); return v===null?'<i style="color:#ffca28">non calcolabile</i>':'€'+gnum(v,0); }
export function _cmpPf(k){ const v=_cmpNum(k&&k.pf); return (v===null||(k&&k.fragCalcolabile===false))?'<i style="color:#ffca28">non calcolabile</i>':gfix(v,2)+' kg/m³'; }
export function _cmpCm(k,campo){ const v=_cmpNum(k&&k[campo]); return (v===null||(k&&k.fragCalcolabile===false))?'<i style="color:#ffca28">non calcolabile</i>':gnum(v,1)+' cm'; }
export function _cmpFly(k){ const v=_cmpNum(k&&k.fly); return (v===null||(k&&k.flyCalcolabile===false))?'<i style="color:#ffca28">non calcolabile</i>':gnum(v,0)+' m'; }

/* ═══════════════════════════════════════════════════════════════════════════
   G26 · LE CLASSI DELL'ENERGIA E DEL RELIEF, E IL CODICE DELLA VOLATA
   (10/09, cantiere B3, ottava fetta).
   ═══════════════════════════════════════════════════════════════════════════
   `pfCls(rapporto)` con `ENECOL` e `ENELAB` — la classe di un foro dal
   RAPPORTO fra il suo consumo specifico locale e quello di progetto (una cava
   a 0,25 kg/m³ e una a 0,7 hanno entrambe diritto alla loro media: conta
   quanto un foro se ne discosta): sotto il 75% «carica molto diluita», sotto
   il 90% «diluita», fino al 115% «in linea», fino al 140% «energia
   concentrata», oltre «molto concentrata». ⚠️ Di un rapporto non finito
   risponde `'ok'`, com'era: sono i CHIAMANTI a non chiederlo quando manca un
   pezzo (le due guardie pinnate in `run-kpi`, blocco G15), perché un verde
   su un confronto impossibile è il numero tranquillo. Le due mappe portano
   il colore e la frase di ogni classe: la prova pretende che coprano tutte
   le classi che la funzione sa dire (regola 18).

   `classeRelief(relief, relLo, relHi)` con `RELCOL` — la classe del relief di
   un foro (ms/m verso il vicino che ha già sparato) rispetto alla finestra
   scelta a schermo: sotto il 60% del minimo «bad», sotto il minimo «warn»,
   dentro «ok», sopra il massimo «hi»; `null` è «none» (il primo della sua
   zona spara sulla faccia già aperta). Il massimo sta sempre almeno mezzo
   ms/m sopra il minimo, e senza finestra valgono 5 e 15. La pagina la chiama
   con `D2.relLo`/`D2.relHi` e `reliefCls` resta come legame. ⚠️ La mappa
   `RELSV` (le classi CSS) NON è entrata: nella pagina non la leggeva nessuno
   (`grep -c RELSV` → 1, la sola dichiarazione), ed è stata tolta.

   `codiceVolataGenesi(dati, data, fronte)` — il CODICE della volata che esce
   verso Sentinella: deterministico, ricavato dal progetto (data, fronte,
   fori, chili, MIC, distanza), `GEN-<data senza trattini>-<impronta in base
   36>`. Serve a Sentinella per riconoscere i doppioni (`firmaVolata`) anche
   DOPO che la volata è stata confermata correggendo fori e chili: un codice
   casuale a ogni export non servirebbe a niente. Tutte entrate identiche. */
export const ENECOL={ moltoBassa:'#5c8dd6', bassa:'#86b0d8', ok:'#66bb6a', alta:'#ffb300', moltoAlta:'#ef5350' };
export const ENELAB={ moltoBassa:'carica molto diluita', bassa:'carica diluita', ok:'in linea col progetto', alta:'energia concentrata', moltoAlta:'energia molto concentrata' };
/* LE SOGLIE DEL RAPPORTO COL PROGETTO, scritte una volta (G30, 11/09): le
   legge `pfCls` e le scrive la legenda del disegno dell'energia, che prima le
   ripeteva a mano nella pagina («< 75%», «75–90%»…) — due copie degli stessi
   quattro numeri, una nel verdetto e una nel suo cartello. */
export const SOGLIE_PF={ moltoBassa:0.75, bassa:0.90, ok:1.15, alta:1.40 };
export function pfCls(r){
  if(r==null||!isFinite(r)) return 'ok';
  if(r<SOGLIE_PF.moltoBassa) return 'moltoBassa';
  if(r<SOGLIE_PF.bassa) return 'bassa';
  if(r<=SOGLIE_PF.ok) return 'ok';
  if(r<=SOGLIE_PF.alta) return 'alta';
  return 'moltoAlta';
}
// la legenda: [classe, etichetta in percentuale], derivata dalle soglie
// (identica, carattere per carattere, al letterale che la pagina teneva)
const _p=(v)=>Math.round(v*100);
export const LEGENDA_ENERGIA=[
  ['moltoBassa','< '+_p(SOGLIE_PF.moltoBassa)+'%'],
  ['bassa',_p(SOGLIE_PF.moltoBassa)+'–'+_p(SOGLIE_PF.bassa)+'%'],
  ['ok',_p(SOGLIE_PF.bassa)+'–'+_p(SOGLIE_PF.ok)+'% in linea'],
  ['alta',_p(SOGLIE_PF.ok)+'–'+_p(SOGLIE_PF.alta)+'%'],
  ['moltoAlta','> '+_p(SOGLIE_PF.alta)+'%'],
];
/* G56c (19/09) — `noneGap` accanto a `none`: stesso `relief=null`, causa
   diversa. `none` è il vero primo della zona (tranquillo, colore neutro);
   `noneGap` è un vicino che ha già sparato ma è oltre la distanza di
   adiacenza — quasi sempre un foro mancante nel mezzo — e usa il colore di
   `warn` perché è la stessa famiglia di rischio (confinamento non
   verificabile), non un'informazione mancante qualunque. */
export const RELCOL={bad:'#ef5350', warn:'#ffb300', ok:'#66bb6a', hi:'#86b0d8', none:'#9b8a60', noneGap:'#ffb300'};
export function classeRelief(r, relLo, relHi, fuoriFascia){
  if(r==null) return fuoriFascia ? 'noneGap' : 'none';
  const lo=relLo||5, hi=Math.max((relLo||5)+0.5, relHi||15);
  if(r<lo*0.6) return 'bad';                                 // molto sotto finestra
  if(r<lo) return 'warn';                                    // sotto finestra
  if(r<=hi) return 'ok';                                     // in finestra
  return 'hi';                                               // relief eccessivo
}
export function reliefCls(D2, r, fuoriFascia){ return classeRelief(r, D2.relLo, D2.relHi, fuoriFascia); }
export function codiceVolataGenesi(d,data,fronte){
  const base=[data,String(fronte||'').trim().toLowerCase(),d.nFori,d.kgTotali,d.mic,d.dist].join('|');
  let h=0; for(let i=0;i<base.length;i++) h=(Math.imul(h,31)+base.charCodeAt(i))|0;
  return 'GEN-'+String(data||'').replace(/-/g,'')+'-'+(h>>>0).toString(36);
}

/* ═══════════════════════════════════════════════════════════════════════════
   G39 · LA RETE DI COLLEGAMENTO DELL'INNESCO (14/09, cantiere B3).
   ═══════════════════════════════════════════════════════════════════════════
   `computeInnesco2D` era marcata nel censimento come legata a «più di dieci»
   variabili del modulo — falso, per la STESSA famiglia di falso positivo già
   presa quattro volte su questo file (unità 121, 122, 124, e ancora): la sua
   dipendenza vera è UNA sola, `D2`, e le altre lettere («si», «ci», «sotto»,
   «L», «r»…) sono nomi locali di ALTRE funzioni della pagina, scritti con
   un'indentazione bassa che l'euristica del censimento (dichiarata e accettata
   come prudente) scambia per variabili del modulo. Letta a mano: pura, chiama
   solo `spaziaturaTipica` — già in questo file — per la stessa soglia che
   `_spazTipico` calcolava nella pagina.
   Per ogni foro, cerca fra quelli che sparano PRIMA di lui quello che arriva
   con il ritardo più piccolo (il raccordo più economico, quello che si vede
   tirare in cava): è la rete che `drawInnesco2D` disegna sopra i fori. Entrata
   identica, `H` mutato sul posto come faceva la pagina (`innFrom`, `innDt` su
   ogni foro) — non è stata cambiata la forma dei dati, solo dove vive il
   calcolo. */

/* ═══════════════════════════════════════════════════════════════════════════
   G40 · IL BURDEN RELIEF FORO PER FORO (14/09, cantiere B3).
   ═══════════════════════════════════════════════════════════════════════════
   Il ms/m dei badge è una media di progetto: qui diventa un valore del
   singolo foro, che è dove nascono blocchi, picchi di vibrazione e
   proiezioni. Per ogni foro: quanti millisecondi passano dal foro che gli ha
   già aperto lo spazio, diviso la distanza da quel foro. Fra tutti i vicini
   già sparati vince il PIÙ VINCOLANTE (rapporto più basso): è quello che
   decide se la roccia davanti ha fatto in tempo a muoversi.
   Stessa famiglia di falso positivo di `innescoSuMaglia` qui sopra (G39):
   `computeRelief2D` era marcata dal censimento come dipendente da più di
   dieci variabili del modulo; letta a mano, la sua dipendenza vera è `D2`
   (per `S`/`B`, la soglia di distanza) più `dtMin`, che nella pagina viene
   dalla dispersione dell'innesco (`scatterMs()`, un altro legame di una
   riga su `scatterInnesco`, già in questo modulo) — passato qui come
   parametro invece di ricalcolato, perché richiede altri tre campi di `D2`
   (`ritardo`, `lastDet`, `innesco`) che non servono a nient'altro in questa
   funzione. Entrata identica, `H` mutato sul posto.

   ⛔ G56c (19/09) — `relief=null` NASCONDEVA DUE CAUSE DIVERSE SOTTO LA
   STESSA FACCIA TRANQUILLA. Misurato togliendo un foro dalla maglia
   (drag+Canc, gesto reale: un operatore scarta un foro perché intasato o
   fuori posto): il foro rimasto senza il suo vicino più vicino non diceva
   «attenzione, manca un vicino entro la distanza di adiacenza» — diceva
   ESATTAMENTE la stessa cosa del vero primo foro della volata, «primo
   della sua zona: spara sulla faccia già aperta» (il testo in genesi.html),
   perché `best` restava `null` sia quando NESSUN vicino aveva ancora
   sparato sia quando un vicino AVEVA sparato ma era finito fuori da `dMax`
   a causa del buco lasciato dal foro tolto. La seconda causa è quella che
   il relief foro-per-foro esiste apposta per segnalare (G40, sopra: «è
   quello che decide se la roccia davanti ha fatto in tempo a muoversi»),
   e finiva scartata in silenzio anche dalla sintesi del Validatore
   (`filter(v=>v!=null)`, genesi.html), che poteva scrivere «tutti i fori
   sono dentro la finestra impostata» ignorando proprio il foro col
   problema. Le due cause si dichiarano separate con `h.relFuoriFascia`. */
export function reliefSuMaglia(H, S, B, dtMin){
  if(!H||!H.length) return;
  const dMax=1.5*Math.max(S||3.5, B||3.0, spaziaturaTipica(H, Math.max(S||3.5, B||3)));   // solo i fori ADIACENTI: oltre, la roccia in mezzo e di un altro foro
  const soglia=Math.max(1, dtMin);                             // sotto la dispersione dell'innesco i due fori sono un istante solo
  for(let i=0;i<H.length;i++){
    const h=H[i]; let best=null, fuoriFascia=false;
    for(let j=0;j<H.length;j++){
      if(j===i) continue;
      const dt=(h.tDet||0)-(H[j].tDet||0);
      if(dt<soglia) continue;                                 // solo fori che hanno gia sparato, e non "insieme" a questo
      const d=Math.hypot(H[j].mx-h.mx, H[j].my-h.my);
      if(d<0.05) continue;
      if(d>dMax){ fuoriFascia=true; continue; }               // un vicino ha già sparato, ma il buco fra i due è troppo largo per dirsi adiacente
      const r=dt/d;                                          // ms/m disponibili verso QUEL foro
      if(!best || r<best.r) best={r:r,j:j,d:d,dt:dt};        // vince il vincolo piu stretto
    }
    h.relief = best? +best.r.toFixed(2) : null;              // null = nessun vicino adiacente ha gia sparato
    h.relFrom = best? best.j : -1;
    h.relD = best? +best.d.toFixed(2) : null;
    h.relDt = best? +best.dt.toFixed(1) : null;
    h.relFuoriFascia = !best && fuoriFascia;                 // il vicino c'è, ma è oltre dMax: quasi sempre un foro mancante nel mezzo
  }
}
/* Trasloco B3 (14/09): con `scatterMs` uscita anche lei (D2 esplicito), il
   legame di pagina che componeva `dtMin` da tre campi di D2 non serve più —
   `computeRelief2D` diventa una composizione diretta, senza wrapper, come
   già `computeEnergia2D`/`isoPasso`. */
export function computeRelief2D(D2){ reliefSuMaglia(D2.holes, D2.S, D2.B, scatterMs(D2)); }
/* ⛔ G56d (19/09) — STESSA CAUSA DI G56c, IN UN POSTO PIÙ PERICOLOSO: un
   `innFrom=-1` diceva sia «è il primo della volata, non serve un raccordo»
   sia «un foro ha già sparato prima di lui, ma è troppo lontano per tirarci
   un raccordo» — e il Validatore («Rete di innesco», genesi.html) filtra
   proprio su `innFrom>=0`, quindi un foro nel secondo caso SPARISCE dal
   conteggio dei collegamenti senza che nessuna riga lo dica: il piano può
   dichiararsi «collegabile con quello che si compra» mentre un foro reale
   non ha nessun raccordo che lo raggiunga. Misurato togliendo due fori
   adiacenti dalla maglia di demo (drag+Canc): il foro rimasto col buco di
   10,5 m attorno (soglia `dMax`=7,7 m) usciva identico al vero primo foro
   della volata. Stessa cura di `reliefSuMaglia`: si dichiara la causa. */
export function innescoSuMaglia(H, S, B){
  if(!H||!H.length) return;
  const dMax=2.2*Math.max(S||3.5, B||3.0, spaziaturaTipica(H, Math.max(S||3.5, B||3)));
  for(let i=0;i<H.length;i++){
    const h=H[i]; h.innFrom=-1; h.innDt=null;
    let best=null, fuoriFascia=false;
    for(let j=0;j<H.length;j++){
      if(j===i) continue;
      const dt=+(h.tDet-H[j].tDet).toFixed(1);
      if(dt<=0) continue;                                  // solo fori che sparano PRIMA: da lì può arrivare l'accensione
      const d=Math.hypot(H[j].mx-h.mx, H[j].my-h.my);
      if(d<0.05) continue;
      if(d>dMax){ fuoriFascia=true; continue; }            // un foro ha già sparato, ma troppo lontano: nessuno tira un raccordo così
      /* il fuoco arriva da chi ha sparato POCO PRIMA, non da chi sta più
         vicino: si sceglie il ritardo più piccolo, e a parità il foro più
         vicino. È anche il collegamento più economico — meno raccordi lunghi
         — ed è quello che si vede tirare in cava. */
      if(!best || dt<best.dt-0.05 || (Math.abs(dt-best.dt)<=0.05 && d<best.d)) best={j:j,d:d,dt:dt};
    }
    if(best){ h.innFrom=best.j; h.innDt=best.dt; }
    h.innFuoriFascia = !best && fuoriFascia;               // un foro ha già sparato prima di lui, ma nessun raccordo lo raggiunge
  }
}
/* Trasloco B3 (15/09): il G39 del 14/09 aveva estratto `innescoSuMaglia` ma
   lasciato in pagina il legame `computeInnesco2D()` a zero argomenti — stessa
   forma di `computeEnergia2D`/`computeRelief2D` prima di loro, stesso unico
   punto di chiamata (dentro `computeSeq2D`, già con `D2` in scope). Nessuna
   ragione strutturale per fermarsi un passo prima delle sue due sorelle. */
export function computeInnesco2D(D2){ innescoSuMaglia(D2.holes, D2.S, D2.B); }

/* ═══════════════════════════════════════════════════════════════════════════
   G41 · LA MAPPA DELL'ENERGIA FORO PER FORO (14/09, cantiere B3).
   ═══════════════════════════════════════════════════════════════════════════
   Sesta volta sulla stessa famiglia di falso positivo di `genesi-estraibili.mjs`
   già diagnosticata per G39/G40: `computeEnergia2D` era marcata «più di dieci
   variabili del modulo» per l'incrocio fra parole interne (`file`, `faccia`,
   `davanti`, `ord`…) e `const` omonimi dichiarati altrove nel file a bassa
   indentazione. Letta a mano: la dipendenza vera è `D2.holes`, `D2.prof`,
   `D2.S`, `D2.kg` e `D2.profilo` (quest'ultimo passato esplicitamente, perché
   `interpFronte(mx)` nella pagina è un wrapper di una riga che legge
   `D2.profilo` e delega a `interpProf` — già pura, sopra in questo stesso
   file — sostituito qui dalla chiamata diretta `interpProf(profilo, mx)`).
   Nessuna riga di logica cambiata: trasloco parola per parola, firma nuova
   `energiaSuMaglia(H, prof, S, kg, profilo)`. */
export function energiaSuMaglia(H, prof, S, kg, profilo){
  if(!H||!H.length) return;
  const file=fileDeiFori(H), Hb=Math.max(0.5,prof||10), Snom=Math.max(0.5,S||3.5);
  const xs=H.map(h=>h.mx), x0=Math.min(...xs)-Snom, x1=Math.max(...xs)+Snom;
  const passo=Math.max(.15,(x1-x0)/240), faccia=[];
  for(let x=x0;x<=x1+1e-9;x+=passo) faccia.push([x, interpProf(profilo,x)]);
  for(let r=0;r<file.length;r++){
    const f=file[r];
    const ord=f.holes.slice().sort((a,b)=>H[a].mx-H[b].mx);
    const davanti = r>0
      ? file[r-1].holes.slice().sort((a,b)=>H[a].mx-H[b].mx).map(i=>[H[i].mx, H[i].my+interpProf(profilo,H[i].mx)])
      : faccia;
    for(let k=0;k<ord.length;k++){
      const h=H[ord[k]];
      const sx = k>0 ? (h.mx-H[ord[k-1]].mx)/2 : Snom/2;
      const dx = k<ord.length-1 ? (H[ord[k+1]].mx-h.mx)/2 : Snom/2;
      const py=h.my+interpProf(profilo,h.mx);
      const yPrec = r>0 ? file[r-1].my : 0;
      const b=Math.max(.2, h.my-yPrec);
      const dPerp = (davanti.length>1) ? distanzaDaSpezzata(h.mx,py,davanti) : null;
      h.burdenVero = dPerp!=null ? +dPerp.toFixed(2) : null;
      /* F2 (26/11): il volume servito e il consumo specifico di QUESTO foro
         usano la SUA profondità e la SUA carica, se ne ha (`valoreProprioDiForo`);
         se no quelle della volata, e allora il conto è quello di prima, alla
         cifra — stesse variabili, stessa formula. */
      const _profSua=valoreProprioDiForo(h,'prof'), _kgSua=valoreProprioDiForo(h,'kg');
      const _Hb=_profSua===null ? Hb : Math.max(0.5,_profSua), _kg=_kgSua===null ? kg : _kgSua;
      const s=Math.max(.2, sx+dx), vol=b*s*_Hb;
      h.burdenLoc=+b.toFixed(2); h.spazLoc=+s.toFixed(2);
      h.volLoc=+vol.toFixed(1); { const _p=consumoSpecifico(_kg, vol); h.pfLoc = _p===null?null:+_p.toFixed(3); }
      h.enX0=h.mx-sx; h.enX1=h.mx+dx; h.enY0=yPrec; h.enY1=h.my; h.enFila=r;
    }
  }
}
export function computeEnergia2D(D2){ energiaSuMaglia(D2.holes, D2.prof, D2.S, D2.kg, D2.profilo); }

/* ═══════════════════════════════════════════════════════════════════════════
   G42 · LA SEQUENZA DI SPARO FORO PER FORO (14/09, cantiere B3, ULTIMA
   fetta del gruppo diagnosticato con `computeInnesco2D`/G39,
   `computeRelief2D`/G40, `computeEnergia2D`/G41).
   ═══════════════════════════════════════════════════════════════════════════
   Ottava volta sulla stessa famiglia di falso positivo di `genesi-estraibili.mjs`.
   Letta a mano: la dipendenza vera è `D2.holes`, `D2.ritardo`,
   `D2.ritardoFila`, `D2.S`, `D2.dir`, `D2.sequenza` (`h.tMano` è una
   proprietà per foro, non un campo di `D2`).
   ⚠️ SCELTA ARCHITETTURALE (dichiarata, non presa di default): questa
   funzione pura fa SOLO il calcolo di `tCalc`/`tDet`/`seq` e ritorna il
   `lastDet` (il tempo più tardo). NON chiama `reliefSuMaglia`/
   `energiaSuMaglia`/`innescoSuMaglia` al suo interno, anche se sono ormai
   tutte pure e nello stesso modulo: comporle è una decisione di
   ORCHESTRAZIONE (in che ordine si ricalcola la pagina dopo un cambio di
   sequenza), non di calcolo, e resta nel wrapper di pagina — lo stesso
   principio per cui `shared/dw-ponti.js` tiene la logica FRA le app e non
   la duplica, applicato qui alla logica FRA le fasi del progetto. Il
   trasloco resta "parola per parola" sul calcolo, non un rifacimento. */
export function sequenzaSuMaglia(H, tHole, tRowRaw, S, dir, sequenza){
  if(!H||!H.length) return 0;
  const tRow=tRowRaw||tHole*2, Snom=S||3.5;
  const mxs=H.map(h=>h.mx), minMx=Math.min(...mxs), maxMx=Math.max(...mxs), cxMx=(minMx+maxMx)/2;
  const rys=[...new Set(H.map(h=>Math.round(h.my*10)))].sort((a,b)=>a-b);
  const nRow=rys.length, centerRow=(nRow-1)/2, seq=sequenza||'diagonale';
  H.forEach(h=>{
    const rowI=rys.indexOf(Math.round(h.my*10));
    const cd=(dir==='sx'?(h.mx-minMx):(maxMx-h.mx))/Snom;
    const cc=Math.abs(h.mx-cxMx)/Snom;
    let t;
    if(seq==='vcut') t=rowI*tRow + cc*tHole;
    else if(seq==='box') t=Math.abs(rowI-centerRow)*tRow + cc*tHole;
    else if(seq==='riga') t=rowI*tRow + cd*1.5;
    else t=rowI*tRow + cd*tHole;
    h.tCalc=+t.toFixed(1);
    h.tDet = (h.tMano!=null && isFinite(h.tMano)) ? +(+h.tMano).toFixed(1) : h.tCalc;
  });
  H.map((h,i)=>i).sort((a,b)=>H[a].tDet-H[b].tDet).forEach((i,k)=>{ H[i].seq=k; });
  return Math.max(...H.map(h=>h.tDet));
}

/* ═══════════════════════════════════════════════════════════════════════════
   G43 · LA GENERAZIONE DELLA MAGLIA (14/09, cantiere B3 — nuova estrazione,
   non un falso positivo del censimento: `genMaglia2D` cade davvero nel
   bucket "11+" perché la sua funzione vera è mutare `D2` (assegna
   `D2.holes`/`D2.sel`/`D2.selPrev`/`D2.bf`/`D2.magliaAssente`, avvisa con
   un toast se rigenerando perde ritardi messi a mano, e orchestra
   `computeSeq2D`), non calcolare. Qui esce SOLO il calcolo delle
   coordinate — righe e colonne, sfalsamento a file alterne — che è la
   parte riusabile: la stessa griglia serve a un ottimizzatore che vuole
   provare un burden diverso SENZA toccare il progetto disegnato a
   schermo. Il resto (guardia su B/S assenti, mutazione di D2, il toast,
   l'orchestrazione della sequenza) resta nel wrapper di pagina — è la
   stessa distinzione calcolo/orchestrazione di G42. */
export function generaMaglia(B, S, nFile, perRow, bf, stagger){
  const holes=[];
  for(let r=0;r<nFile;r++){
    const my = B + r*bf;
    const off = (stagger && r%2===1) ? S/2 : 0;
    for(let c=0;c<perRow;c++) holes.push({ id:idForoMaglia(r+1,c+1), mx:+(c*S+off).toFixed(3), my:+my.toFixed(3) });
  }
  return holes;
}

/* ═══════════════════════════════════════════════════════════════════════════
   G44 · LA VIBRAZIONE PER OGNI BURDEN CANDIDATO — la seconda fetta di G7
   (14/09, cantiere B3), resa possibile da G39-G43 (sequenza e maglia ora
   pure). Risponde alla domanda che il bottone "Confronta burden" dichiarava
   esplicitamente di NON rispondere ("Non ricalcola vibrazione né
   sequenza... farla qui sarebbe una terza copia della stessa domanda"):
   per ogni burden candidato già uscito da `curvaBurdenCarica` (stessa
   pezzatura obiettivo, stesso rapporto spalla/interasse), genera una
   maglia di PROVA con la stessa forma del progetto disegnato (file, fori
   per fila, sfalsamento), la sequenzia con le stesse impostazioni di oggi
   (ritardo, direzione, schema), e stima MIC e PPV al recettore con le
   STESSE funzioni pure che la Scheda volata usa per il progetto reale
   (`micFinestra`, `ppvDaSd`, `esitoPpv`) — non una terza copia della
   formula, la stessa, con input diversi.
   ⚠️ Il burden fra file (`bf`) è sempre uguale al burden candidato
   (`r.B`), la stessa convenzione di `genMaglia2D` (`D2.bf=D2.B`): il
   progetto disegnato può avere un `bf` diverso da `B` se qualcuno l'ha
   editato a mano, ma qui si genera una maglia NUOVA, non si tocca quella
   disegnata — quindi la convenzione di partenza (bf=B) è quella giusta,
   non un'approssimazione.
   ⚠️ La carica per foro è quella che la riga già dichiara (target di
   frammentazione), assunta UNIFORME su tutti i fori — la stessa
   assunzione di `computeMIC`/`micFinestra` sul progetto reale (`D2.kg`
   unico, non per-foro).
   Righe non calcolabili (`kg===null`) restano tali: non si inventa una
   vibrazione su una carica che non si conosce. */
export function vibrazionePerBurden(righe, geom, seqOpz, sito){
  const nFile=geom.nFile, perRow=geom.perRow, stagger=geom.stagger;
  const tHole=seqOpz.tHole, tRowRaw=seqOpz.tRowRaw, dir=seqOpz.dir, sequenza=seqOpz.sequenza;
  const recDist=sito.recDist, K=sito.K, beta=sito.beta, limite=sito.limite;
  return righe.map(r=>{
    if(!r.calcolabile || r.kg===null) return { ...r, mic:null, ppv:null, esitoV:null };
    const H=generaMaglia(r.B, r.S, nFile, perRow, r.B, stagger);
    sequenzaSuMaglia(H, tHole, tRowRaw, r.S, dir, sequenza);
    const mic=micFinestra(H, r.kg);
    const sd=(mic!=null && ppvSenzaDistanza(recDist)===null) ? recDist/Math.sqrt(Math.max(1,mic)) : null;
    const ppv=sd!=null ? ppvDaSd(sd, K, beta) : null;
    const esitoV=ppv!=null ? esitoPpv(ppv, limite) : null;
    return { ...r, mic: mic===null?null:+mic.toFixed(1), ppv: ppv===null?null:+ppv.toFixed(2), esitoV };
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   G27 · TRE PEZZI DI DOCUMENTO CHE LA PAGINA COMPONEVA IN CASA — la miniatura
   del composito, la base della previsione PPV, la tinta della roccia
   (10/09, cantiere B3, nona fetta).
   ═══════════════════════════════════════════════════════════════════════════
   `_sigSpark(comp, steps)` — la miniatura SVG dell'onda composita (G23): il
   tracciato campionato a 240 punti al massimo, normalizzato sul picco (mai
   diviso per zero: il picco parte da 1e-9), con la linea dello zero. È il
   disegno che sta sotto il PPV composito nella modale della firma.

   `_ppvBaseHtml(pv)` — la «base della previsione PPV» scritta per il foglio
   stampabile e per la scheda: il testo di `provenienzaPpv` e, se ci sono, gli
   avvisi uno per riga col grassetto sul CAPO dell'avviso (prima dei due
   punti) e non su tutta la frase — sullo scatto a 390 px sei righe intere in
   grassetto smettono di segnalare qualcosa. Tutto passa da `_rEsc`.

   `shade(colore, fattore)` — il colore della roccia derivato dal litotipo
   (un fronte di basalto non è un fronte di arenaria): ogni canale RGB del
   colore intero scalato per il fattore, con il tetto a 255. Lo usano dieci
   materiali della scena 3D.
   Tutte e tre entrate identiche (vecchie estratte da HEAD accanto alle
   nuove, 20.000 casi ciascuna → 0 divergenze). `fmtT`, il quarto pezzo di
   questa fetta, è salito in `genesi-formato.js` perché scrive un numero. */
export function _sigSpark(comp,steps){
  const W=560,Hh=90,st=Math.max(1,Math.floor(steps/240));
  let mx=1e-9; for(let i=0;i<steps;i++){ const v=Math.abs(comp[i]); if(v>mx) mx=v; }
  let d='',j=0;
  for(let i=0;i<steps;i+=st){ const x=(i/steps)*W, y=Hh/2-(comp[i]/mx)*(Hh/2-4); d+=(j++?'L':'M')+x.toFixed(1)+' '+y.toFixed(1); }
  return '<svg viewBox="0 0 '+W+' '+Hh+'" style="width:100%;height:80px;background:rgba(0,0,0,.25);border-radius:8px"><line x1="0" y1="'+(Hh/2)+'" x2="'+W+'" y2="'+(Hh/2)+'" stroke="rgba(255,255,255,.15)"/><path d="'+d+'" fill="none" stroke="#ffd54f" stroke-width="1.2"/></svg>';
}
export function _ppvBaseHtml(pv){
  return _rEsc(pv.testo) + (pv.avvisi.length
    ? '<br>'+pv.avvisi.map(a=>{ const i=a.indexOf(':');
        return i<0 ? '<b>'+_rEsc(a)+'</b>' : '<b>'+_rEsc(a.slice(0,i))+'</b>'+_rEsc(a.slice(i)); }).join('<br>')
    : '');
}
export function shade(c,f){ const r=Math.min(255,Math.round(((c>>16)&255)*f)), g=Math.min(255,Math.round(((c>>8)&255)*f)), b=Math.min(255,Math.round((c&255)*f)); return (r<<16)|(g<<8)|b; }

/* ═══════════════════════════════════════════════════════════════════════════
   G28 · I CATALOGHI DEL MESTIERE — gli inneschi e le litologie — E LA REGOLA
   CON CUI LA PAGINA SCEGLIE UNA VOCE (11/09, cantiere B3, decima fetta).
   ═══════════════════════════════════════════════════════════════════════════
   `INNESCHI` — i quattro sistemi d'innesco (Nonel, elettronico, elettrico,
   miccia detonante) con la loro dispersione, i ritardi disponibili, la tenuta
   all'acqua, pro e contro: sono gli `id` che `scatterInnesco` (G11) conosce.
   `ROCCE` — le sei litologie: A = rock factor di Kuz-Ram (Cunningham/Lilly),
   rho in g/cc, vp velocità sonica in m/s (Z = rho·1000·vp è l'impedenza),
   UCS ed E che `fattoreRoccia` (G22) legge, i parametri dei giunti, la tinta
   della scena 3D. ⚠️ I loro A «storici» sono un'ETICHETTA: il prodotto usa
   sempre l'A che `fattoreRoccia` ricava dai parametri, e la prova pinna lo
   scarto fra i due per ogni litologia — cinque entro 0,3, il basalto a 0,8
   (12 scritto, 12,8 dai parametri) — così una scheda ritoccata si vede.
   Entrati IDENTICI, riga per riga, dal letterale della pagina. Gli esplosivi
   NO: stanno in `esplosivi.json` (la pagina lo carica e tiene il catalogo
   inline come ripiego), e un file che si scarica non si copia in un modulo.

   `scegliDaCatalogo(catalogo, id, indiceRipiego)` — la regola con cui la
   pagina sceglie la voce del progetto: quella con l'`id` scelto, se no quella
   marcata `default`, se no la voce all'indice di ripiego (0 per inneschi ed
   esplosivi, 2 — il calcare — per le rocce). Era scritta TRE volte nella
   pagina (`selEsplosivo`, `selInnesco`, `selRoccia`), una copia per catalogo
   con l'indice diverso: la firma troppo stretta di CLAUDE.md. I tre legami
   restano nella pagina e passano di qui. */
export const INNESCHI=[
  {id:'nonel',short:'Nonel',nome:'Nonel (tubo d\'urto)',tipo:'Non elettrico + connettori MS di superficie',scatter:'~1% del ritardo (cresce col periodo)',ritardi:'17/25/42/65/100 ms',acqua:'Eccellente',pro:'Immune a correnti vaganti/RF, economico, sicuro.',contro:'Ritardi a step, niente verifica continuità, scatter maggiore.',default:true},
  {id:'elettronico',short:'Elettr.',nome:'Detonatore elettronico',tipo:'Programmabile al ms',scatter:'~0,01–0,05% (molto preciso)',ritardi:'1–10000 ms liberi',acqua:'Eccellente',pro:'Precisione massima: X50 più fine, PPV fino a −50%, verifica pre-sparo.',contro:'Costo elevato, serve logger/blaster dedicato.',default:false},
  {id:'elettrico',short:'Elettrico',nome:'Detonatore elettrico',tipo:'A ponte resistivo',scatter:'medio',ritardi:'serie MS/LP',acqua:'Buona',pro:'Verifica continuità con ohmetro, economico.',contro:'Sensibile a correnti vaganti/fulmini/RF: rischio sicurezza.',default:false},
  {id:'cordtex',short:'Cordtex',nome:'Miccia detonante (cordtex)',tipo:'Trunkline + relay di ritardo',scatter:'dipende dai relay',ritardi:'da connettori MS',acqua:'Buona',pro:'Robusta e semplice, innesca tutta la colonna.',contro:'Airblast/rumore in superficie, meno precisa.',default:false},
];
/* litologie: A = rock factor Kuz-Ram (Cunningham/Lilly); rho g/cc; vp velocita sonica m/s; Z = rho*1000*vp (impedenza) */
export const ROCCE=[
  {id:'marna',nome:'Marna / scisto',cls:'tenera',A:4,rho:2.4,vp:3000,car:'heave',ucs:30,eMod:12,rmd:20,jps:10,jpa:10,jcf:1.5,tint:0x9aa08a,strat:true},
  {id:'arenaria',nome:'Arenaria',cls:'media-tenera',A:5,rho:2.3,vp:2600,car:'heave',ucs:70,eMod:25,rmd:20,jps:20,jpa:30,jcf:1,tint:0xc9a878,strat:true},
  {id:'calcare',nome:'Calcare',cls:'medio',A:8,rho:2.6,vp:4500,car:'misto',default:true,ucs:100,eMod:55,rmd:20,jps:50,jpa:30,jcf:1,tint:0xbfb6a2,strat:true},
  {id:'dolomia',nome:'Dolomia',cls:'dura',A:9,rho:2.8,vp:5000,car:'shock',ucs:150,eMod:65,rmd:20,jps:50,jpa:30,jcf:1,tint:0xb8b0a6,strat:true},
  {id:'granito',nome:'Granito',cls:'dura',A:10,rho:2.65,vp:5500,car:'shock',ucs:180,eMod:60,rmd:20,jps:50,jpa:40,jcf:1,tint:0xa89c93,strat:false},
  {id:'basalto',nome:'Basalto / diabase',cls:'molto dura',A:12,rho:2.95,vp:6000,car:'shock',ucs:250,eMod:80,rmd:20,jps:80,jpa:40,jcf:1,tint:0x6f6b65,strat:false},
];
export function scegliDaCatalogo(catalogo, id, indiceRipiego){
  const c=catalogo||[];
  return c.find(e=>e.id===id) || c.find(e=>e.default) || c[indiceRipiego||0];
}

/* `esplCardHtml` / `innCardHtml` — la scheda di approfondimento di un
   esplosivo o di un innesco, dai dati di catalogo scelti da
   `scegliDaCatalogo` sopra. Trasloco 12/09 (unità 124, fascia 6-10 e 11+ di
   B3): il censimento le marcava legate a dieci-più variabili del modulo
   ("g, cc, a, m, per, k, RWS, es, nome, ok" per `esplCardHtml`), ed erano
   tutti falsi positivi della STESSA famiglia già chiusa su `_sitoParseCsv` e
   `_sentCell`, ma nella veste che quelle due non avevano ancora mostrato: qui
   le lettere non vengono da una regex, vengono da CONTENUTO DI STRINGHE —
   `'ritardi '`, `"es-nome"`, `"es"` — che il tokenizzatore dello strumento
   spezza sui trattini e sugli apici e legge come nomi di variabile. Lette a
   mano sono pure: prendono un oggetto di catalogo `e` e tornano solo HTML,
   nessuno stato del progetto. */
export function esplCardHtml(e){ const specs=[];
  if(e.densita_gcc!=null) specs.push(gfix(e.densita_gcc,2)+' g/cc');   // 03/09: «0.82 g/cc» accanto a «3,8k m/s» — la virgola la scrive gfix, come per la VOD
  if(e.vod_ms!=null) specs.push(gfix(e.vod_ms/1000,1)+'k m/s VOD');
  if(e.rws_pct!=null) specs.push('RWS '+e.rws_pct);
  if(e.rbs_pct!=null) specs.push('RBS '+e.rbs_pct);
  specs.push('Acqua: '+e.acqua);
  return '<div class="es-card"><div class="es-nome">'+e.nome+'</div><div class="es-tipo">'+e.tipo+'</div><div class="es-specs">'+specs.map(s=>'<span>'+s+'</span>').join('')+'</div><div class="es-app">'+(e.applicazione||'')+'</div><div class="es-pc"><span class="ok">+</span> '+e.pro+'</div><div class="es-pc"><span class="no">-</span> '+e.contro+'</div><div class="es-foot"><span class="es-costo">'+(e.costo||'')+'</span></div></div>';
}
export function innCardHtml(e){ const specs=['scatter '+e.scatter,'ritardi '+e.ritardi,'Acqua: '+e.acqua];
  return '<div class="es-card"><div class="es-nome">'+e.nome+'</div><div class="es-tipo">'+e.tipo+'</div><div class="es-specs">'+specs.map(s=>'<span>'+s+'</span>').join('')+'</div><div class="es-pc"><span class="ok">+</span> '+e.pro+'</div><div class="es-pc"><span class="no">-</span> '+e.contro+'</div></div>';
}

/* ═══════════════════════════════════════════════════════════════════════
   G29 · LA RAMPA DELLE QUOTE, IL VERDETTO DI UN VALIDATORE, IL PUNTO PIÙ
   VICINO SULLA TELA (11/09, cantiere B3, undicesima fetta).
   ═══════════════════════════════════════════════════════════════════════
   `QUOTA_RAMPA` / `quotaColore(u, rampa)` — la rampa topografica tenue con cui
   la scena 3D tinge i vertici per quota (dal blu dell'impluvio all'avorio
   delle creste, passando per l'ambra di casa): un `u` fra 0 e 1 interpolato
   linearmente fra le fermate, con `u` fuori intervallo bloccato agli estremi.
   Entrata identica dal letterale della pagina; la rampa è un parametro con
   quella di casa come ripiego, così una tavola diversa non chiede una copia.

   `verdettoValidatore(x, lo, hi, wlo, whi)` — la regola con cui la scheda dei
   validatori colora un rapporto: dentro [lo, hi] è a posto; sotto `lo` è un
   avviso e sotto `wlo` un difetto; sopra `hi` e sopra `whi` lo stesso. Era
   dentro `badge`, chiusa in una funzione che la pagina non può provare.
   ⛔ E aveva un buco della famiglia «l'assenza non è un dato favorevole»: con
   `x` NaN (una divisione fra due zeri — `rit/S` con S=0) nessun confronto
   scattava e il rapporto usciva VERDE con la spiegazione del caso a posto.
   Qui un `x` che non è un numero risponde «non calcolabile», e la pagina lo
   scrive; la prova lo pinna nei due versi.

   `puntoTela(m, x, y)` / `indicePiuVicino(punti, px, py, raggioPx)` — la
   proiezione di un punto del modello sulla tela del disegno 2D
   (`startX + x·scale`, `faceY + y·scale`, la trasformazione che `drawDesign2D`
   salva in `D2._m`) e la ricerca del punto più vicino a un tocco entro un
   raggio, con il pari merito al primo. Era scritta due volte nella pagina,
   una per i fori e una per i punti del profilo (`d2HitTest`, `d2HitTestPt`):
   i due legami restano e passano di qui. Un tocco senza coordinate leggibili
   risponde −1, come un tocco lontano. */
export const QUOTA_RAMPA = [                                  // rampa topografica tenue, dal basso all'alto
  { t:0.00, c:[0.16,0.34,0.42] },                      // impluvio / quote basse
  { t:0.28, c:[0.25,0.48,0.35] },                      // verde profondo
  { t:0.52, c:[0.72,0.68,0.34] },                      // ocra
  { t:0.76, c:[0.92,0.60,0.22] },                      // ambra (colore di casa)
  { t:1.00, c:[1.00,0.92,0.78] } ];                    // creste
export function quotaColore(u, rampa){
  const R = (rampa && rampa.length) ? rampa : QUOTA_RAMPA;
  const x=Math.max(0, Math.min(1, +u || 0));
  for(let i=1;i<R.length;i++){
    const a=R[i-1], b=R[i];
    if(x<=b.t){ const k=(x-a.t)/Math.max(1e-6,(b.t-a.t));
      return [a.c[0]+(b.c[0]-a.c[0])*k, a.c[1]+(b.c[1]-a.c[1])*k, a.c[2]+(b.c[2]-a.c[2])*k]; }
  }
  return R[R.length-1].c;
}
export function verdettoValidatore(x, lo, hi, wlo, whi){
  if(!Number.isFinite(+x) || x === null || x === "") return { cls:'sv-warn', quale:'non-calcolabile' };
  if(x<lo) return { cls:(x<wlo?'sv-bad':'sv-warn'), quale:'basso' };
  if(x>hi) return { cls:(x>whi?'sv-bad':'sv-warn'), quale:'alto' };
  return { cls:'sv-ok', quale:'ok' };
}
export function puntoTela(m, x, y){
  if(!m) return null;
  return { cx:m.startX + (+x)*m.scale, cy:m.faceY + (+y)*m.scale };
}
export function indicePiuVicino(punti, px, py, raggioPx){
  const r = Number.isFinite(+raggioPx) && +raggioPx > 0 ? +raggioPx : 18;
  if(!Number.isFinite(+px) || !Number.isFinite(+py)) return -1;
  let best=-1, bd=r*r;
  (punti||[]).forEach((q, i) => {
    if(!q) return;
    const d=(q.cx-px)*(q.cx-px)+(q.cy-py)*(q.cy-py);
    if(d<bd){ bd=d; best=i; }
  });
  return best;
}
/* Trasloco B3 (14/09): tre "legami" del picking sull'editor 2D, usciti
   insieme perché `d2HitTest`/`d2HitTestPt` compongono `puntoTela`/
   `indicePiuVicino` qui sopra e `activeProf`. `D2` come primo argomento
   esplicito, come già per le fette precedenti. `interpFronte(mx)` (wrapper
   di pagina, resta lì: sedici altri punti di chiamata) diventa qui
   `interpProf(D2.profilo, mx)` diretto, come già fatto per G41. */
export function activeProf(D2){ return D2.tool==='piede'?D2.piede:D2.profilo; }
export function d2HitTest(D2, px, py, raggioPx){ if(!D2._m) return -1; return indicePiuVicino(D2.holes.map(h=>puntoTela(D2._m, h.mx, h.my+interpProf(D2.profilo, h.mx))), px, py, raggioPx); }
export function d2HitTestPt(D2, px, py, raggioPx){ if(!D2._m) return -1; return indicePiuVicino(activeProf(D2).map(q=>puntoTela(D2._m, q.x, q.y)), px, py, raggioPx); }

/* ═══════════════════════════════════════════════════════════════════════
   LA PIANTA SI MISURA IN PIXEL DI SCHERMO (27/11)
   ═══════════════════════════════════════════════════════════════════════
   La tela della pianta ha 960 punti di larghezza e il foglio la mostra a
   `width:100%` (al massimo 560 px). Fino a oggi TUTTO era scritto in punti
   di tela: su un telefono da 320 la tela è larga 292 px, quindi il numero
   di un foro (corpo 9) usciva alto 2,7 px, le quote 3,3 px, e — misurato
   premendo — il raggio con cui si prende un foro (18 punti) valeva 5,5 px:
   un tocco a 6 px dal centro NON selezionava il foro, ne CREAVA uno nuovo.
   Sul computer la tela è mostrata a 560 px: gli stessi testi erano 5-7 px.
   Adesso il disegno usa come unità il pixel di schermo (la tela tiene i suoi
   960 punti per la NITIDEZZA: `scalaTestoTela` è il rapporto fra le due
   cose), e queste tre funzioni decidono le misure che dipendono da quanto
   sono fitti i fori e da che cosa li tocca. */
/* Il raggio del pallino di un foro, in px di schermo: 9 quando c'è posto,
   più piccolo quando i fori sono fitti (mai meno di 4: sotto non è più un
   pallino). `passoPx` è la distanza a schermo fra due fori vicini. Un passo
   non leggibile non rimpicciolisce niente. */
export function raggioForoTela(passoPx){
  const p = +passoPx;
  if(!Number.isFinite(p) || !(p > 0)) return 9;
  return Math.max(4, Math.min(9, 0.4 * p));
}
/* Il raggio entro cui un tocco PRENDE un foro invece di crearne uno nuovo,
   in px di schermo. Col dito 22 (un bersaglio da 44 px), col mouse o la
   penna 14; ma mai più di metà del passo fra i fori — se no fra due fori
   vicini non resterebbe un punto in cui metterne uno nuovo — e mai meno di
   8. Un puntatore che non si dichiara è trattato come il mouse. */
export function raggioPresaTela(tipoPuntatore, passoPx){
  const base = tipoPuntatore === 'touch' ? 22 : 14;
  const p = +passoPx;
  if(!Number.isFinite(p) || !(p > 0)) return base;
  return Math.max(8, Math.min(base, 0.5 * p));
}
/* ═══════════════════════════════════════════════════════════════════════
   LA VISTA DELLA PIANTA: INGRANDIMENTO E SPOSTAMENTO (27/11)
   ═══════════════════════════════════════════════════════════════════════
   La pianta mostrava sempre TUTTA la maglia a misura fissa: su un telefono,
   con 20 fori per fila, i pallini si stringono a 4 px e i numeri non si
   scrivono più (misurato). La vista dice di quanto la pianta è ingrandita
   (`z`, da 1 a `VISTA_ZOOM_MAX`) e di quanto è spostata (`px`, `py`, in px di
   schermo). NON è un dato del progetto: non si salva, e a `z = 1` è ferma —
   la pianta «adattata» non si può trascinare via per sbaglio.
   · `vistaLimitata` tiene la vista nei suoi limiti: l'ingrandimento fra 1 e
     il tetto, lo spostamento mai oltre il bordo di ciò che l'ingrandimento
     ha portato fuori dalla tela. Un valore non leggibile è «ferma».
   · `vistaApplica` porta la mappatura di base (metri → px) nella vista,
     attorno a un perno (`ox`, `oy`): chi disegna e chi tocca usano la STESSA
     mappatura, quindi un foro ingrandito si prende dove lo si vede.
   · `vistaZoomAttorno` ingrandisce tenendo fermo il punto (`cx`, `cy`): il
     metro che sta sotto le dita resta sotto le dita.
   · `gestoDueDita` legge un gesto a due dita: di quanto si sono allontanate
     (il fattore) e di quanto si è spostato il punto di mezzo. Dita posate
     nello stesso punto non inventano un fattore. */
export const VISTA_ZOOM_MAX = 6;
const VISTA_FERMA = Object.freeze({ z: 1, px: 0, py: 0 });
export function vistaLimitata(v, larga, alta){
  const z0 = v && Number.isFinite(+v.z) ? +v.z : 1;
  const z = Math.max(1, Math.min(VISTA_ZOOM_MAX, z0));
  const L = Number.isFinite(+larga) && +larga > 0 ? +larga : 0, A = Number.isFinite(+alta) && +alta > 0 ? +alta : 0;
  const mx = (z - 1) * L / 2, my = (z - 1) * A / 2;
  const px = v && Number.isFinite(+v.px) ? Math.max(-mx, Math.min(mx, +v.px)) : 0;
  const py = v && Number.isFinite(+v.py) ? Math.max(-my, Math.min(my, +v.py)) : 0;
  return { z, px: px || 0, py: py || 0 };
}
export function vistaApplica(m, v, ox, oy){
  if(!m) return null;
  const w = v || VISTA_FERMA, z = Number.isFinite(+w.z) && +w.z > 0 ? +w.z : 1;
  return { scale: m.scale * z, startX: (m.startX - ox) * z + ox + (+w.px || 0), faceY: (m.faceY - oy) * z + oy + (+w.py || 0) };
}
export function vistaZoomAttorno(v, fattore, cx, cy, ox, oy, larga, alta){
  const a = vistaLimitata(v, larga, alta), f = Number.isFinite(+fattore) && +fattore > 0 ? +fattore : 1;
  const z = Math.max(1, Math.min(VISTA_ZOOM_MAX, a.z * f)), r = z / a.z;
  const X = Number.isFinite(+cx) ? +cx : ox, Y = Number.isFinite(+cy) ? +cy : oy;
  return vistaLimitata({ z, px: X - ox - (X - ox - a.px) * r, py: Y - oy - (Y - oy - a.py) * r }, larga, alta);
}
export function gestoDueDita(a0, b0, a1, b1){
  const ok = [a0, b0, a1, b1].every((p) => p && Number.isFinite(+p.x) && Number.isFinite(+p.y));
  if(!ok) return null;
  const d0 = Math.hypot(b0.x - a0.x, b0.y - a0.y), d1 = Math.hypot(b1.x - a1.x, b1.y - a1.y);
  const m0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 }, m1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
  return { fattore: d0 > 1 ? d1 / d0 : 1, cx: m0.x, cy: m0.y, dx: m1.x - m0.x, dy: m1.y - m0.y };
}
/* Un tocco è un TOCCO, o è l'inizio di una passata? Lo decide quanto si è
   mosso il dito fra quando si posa e quando si alza: meno di `sogliaPx` (10 px
   di schermo, se non detto) è un tocco. Serve alla pianta: col dito un foro
   nuovo nasce quando il dito SI ALZA senza essersi mosso, non quando si posa —
   se no una passata per scorrere la pagina ne creava uno (misurato). Coordinate
   non leggibili non sono un tocco: nel dubbio non si crea niente. */
export function eUnTocco(x0, y0, x1, y1, sogliaPx){
  const s = Number.isFinite(+sogliaPx) && +sogliaPx > 0 ? +sogliaPx : 10;
  const dx = +x1 - +x0, dy = +y1 - +y0;
  if(!Number.isFinite(dx) || !Number.isFinite(dy)) return false;
  return Math.hypot(dx, dy) < s;
}
/* Le voci di una legenda disposte su più righe: `larghezze` sono le
   larghezze a schermo delle voci (già col loro spazio), `larghezzaMax` è
   quanto è larga la riga. Va a capo quando la voce non ci sta; una voce più
   larga della riga resta sola sulla sua. Restituisce gli INDICI, riga per
   riga: chi disegna sa già che cosa sono. */
export function righeDiVoci(larghezze, larghezzaMax){
  const max = +larghezzaMax, righe = []; let riga = [], x = 0;
  (Array.isArray(larghezze) ? larghezze : []).forEach((w, i) => {
    const ww = +w; if(!Number.isFinite(ww) || ww < 0) return;
    if(riga.length && Number.isFinite(max) && max > 0 && x + ww > max){ righe.push(riga); riga = []; x = 0; }
    riga.push(i); x += ww;
  });
  if(riga.length) righe.push(riga);
  return righe;
}

/* ═══════════════════════════════════════════════════════════════════════
   G30 · LO SCATTO DEI PROFILI E LE ALTEZZE DEI FORI DAL PIEDE (11/09,
   cantiere B3, dodicesima fetta) — più le soglie e la legenda dell'energia,
   scritte sopra accanto a `pfCls`.
   ═══════════════════════════════════════════════════════════════════════
   `scattoProfili(profilo, piede)` — la copia con cui annulla/ripristina
   salvano INSIEME cresta e piede (una modellazione sbagliata non è mai
   definitiva, e i due profili si annullano insieme, senza sorprese). Copia
   profonda dei soli campi che contano: `x,z` sulla cresta, `x,y` sul piede.

   `altezzeForiDaPiede(nFori, interasse, prof, piede)` — il piede modellato
   riscrive l'altezza della faccia foro per foro: al centro di ogni foro
   (`i·interasse + interasse/2`) l'altezza è la profondità meno la deviazione
   del piede in quel punto, bloccata fra 5 e 20 m (stessa regola del 2D).
   Risponde `null` senza un piede con almeno due punti (la pagina allora
   AZZERA le altezze) e `[]` senza fori (la pagina allora NON tocca niente):
   sono due «niente» diversi, ed erano già diversi nella pagina — il legame
   li tiene distinti. */
export function scattoProfili(profilo, piede){
  return { cresta:(profilo||[]).map(p=>({ x:p.x, z:p.z })),
           piede:(piede||[]).map(p=>({ x:p.x, y:p.y })) };
}
/* ⚠️ La stessa regola era scritta DUE volte nella pagina — qui e nella
   sincronizzazione 2D→3D, che senza piede modellato riempiva comunque le
   altezze con la profondità bloccata (un fronte dritto). È la firma troppo
   stretta di CLAUDE.md: la copia sparisce con un argomento, `pianoSenzaPiede`,
   che dice che cosa fare quando il piede non c'è — `null` per chi azzera
   (la modellazione), il piano a profondità piena per chi ricostruisce il 3D. */
export function altezzeForiDaPiede(nFori, interasse, prof, piede, opts){
  const conPiede = !!(piede && piede.length>=2);
  if(!conPiede && !(opts && opts.pianoSenzaPiede)) return null;
  const n=Math.max(0, Math.round(+nFori||0));
  const out=[];
  for(let i=0;i<n;i++){
    const x=i*interasse + interasse/2;
    const dv = conPiede ? interpProf(piede, x) : 0;
    out.push(Math.max(5, Math.min(20, prof - dv)));
  }
  return out;
}

/* ═══════════════════════════════════════════════════════════════════════
   G31 · LA CARICA DI UN FORO DALLA SUA GEOMETRIA, E LE COSTANTI PPV DALLA
   LITOLOGIA (11/09, B3 tredicesima fetta).
   `caricaLineare(diamMm, densitaGcc)` — i kg per metro di colonna: era
   scritta due volte, in `deriveCharge` della pagina e in
   `confinamentoColletto` qui sotto (la firma troppo stretta di CLAUDE.md).
   `caricaForoDaGeometria({diam, prof, sub, stem, densita})` — la carica per
   foro che la pagina deriva quando `kgAuto` è acceso: colonna caricata
   `Lc = max(0,5; prof + sub − stem)`, chili = carica lineare × Lc,
   arrotondati e mai sotto 2 kg. Risponde `null` — non un numero — se manca
   uno dei quattro ingressi che contano (diametro, profondità, borraggio,
   densità dell'esplosivo): è il blocco G17 della pagina, portato qui con
   la sua ragione (la densità che il catalogo dichiara di non avere non
   diventa 0,82). La sottoperforazione assente vale zero: «non perforo sotto
   il piano» è il caso normale, non un dato mancante.
   `costantiPpvLitologia(vp)` — K e β stimati dalla velocità delle onde P
   quando non c'è una legge di sito: K conservativo (upper-bound, non media),
   roccia dura attenua meno. STIMA, da calibrare col monitoraggio reale; `vp`
   assente → 4500 m/s come sempre. Nessuna soglia toccata. */
export function caricaLineare(diamMm, densitaGcc){
  const d = +diamMm, r = +densitaGcc;
  if(!(d > 0) || !(r > 0)) return null;
  const Dm = d / 1000;
  return r * 1000 * Math.PI * Dm * Dm / 4;
}
export function caricaForoDaGeometria(g){
  const o = g || {};
  // ⛔ 17/09, dal deep-pass che ha trovato G21 incompleta: `+o.stem > 0`
  // trattava un borraggio di ESATTAMENTE ZERO come dato mancante, mentre
  // `confinamentoColletto` (stessa geometria, poco più su) lo accetta di
  // proposito — «un colletto non borrato è un progetto pessimo, non un dato
  // mancante» (commento G17). Con «carica automatica» accesa, un borraggio a
  // zero azzerava l'intera scheda KPI invece di calcolare la colonna piena.
  // ⚠️ E `null`/`undefined`/`''` vanno esclusi PRIMA di convertire: `+null`
  // fa 0 e passerebbe il «>= 0» come se fosse un borraggio vero — lo stesso
  // `+null === 0` già costato due volte in questo progetto.
  const stem = (o.stem === null || o.stem === undefined || o.stem === "") ? NaN : +o.stem;
  if(!(+o.diam > 0) || !(+o.prof > 0) || !(Number.isFinite(stem) && stem >= 0) || !(+o.densita > 0)) return null;
  const Lc = Math.max(0.5, +o.prof + (+o.sub || 0) - stem);
  return Math.max(2, Math.round(caricaLineare(o.diam, o.densita) * Lc));
}
export function costantiPpvLitologia(vp){
  const v = (+vp > 0) ? +vp : 4500;
  const t = Math.max(0, Math.min(1, (v - 2600) / (6000 - 2600)));
  return { K: Math.round(2800 - 1600 * t), beta: +(1.75 - 0.35 * t).toFixed(2), fonte: 'litologia' };
}

/* ══════════════════════════════════════════════════════════════════════════
   G33 · IL PIANO CHE APRE UN CAD VERO (13/09, su richiesta diretta del
   fondatore: "potremmo rendere Genesi più simile a un CAD?")
   ══════════════════════════════════════════════════════════════════════════
   Genesi non sapeva parlare con AutoCAD/LibreCAD/QGIS né con i programmi che
   un topografo o un ufficio tecnico di cava usano già: era un "non c'è"
   confermato con la ricerca (docs/GENESI_EVOLUZIONE_STRATEGICA.md), non
   dedotto. Il DXF è il formato che tutti quei programmi sanno aprire.

   Questa è SOLO ESPORTAZIONE, e di proposito: i numeri che escono (mx, my
   dei fori, i punti del profilo del fronte) sono quelli che Genesi ha GIÀ
   calcolato e mostra a schermo — nessun calcolo nuovo, nessuna soglia di
   sicurezza toccata. È l'opposto del rischio già segnalato sull'IMPORT del
   rilievo boretrack (dove un numero ESTERNO entra e la sua convenzione di
   assi non è verificata): qui i numeri restano nella convenzione di Genesi
   dall'inizio alla fine, escono soltanto in un contenitore che altri
   programmi sanno leggere.

   Formato scelto: DXF versione R12 (AC1009) — la più vecchia e compatibile,
   letta da qualunque programma CAD esistente, anche quelli di vent'anni fa.
   Struttura minima valida: una sola SECTION di ENTITIES (niente HEADER né
   TABLES, che servono solo a dichiarare stili non necessari qui). Verificata
   con un lettore DXF vero (`ezdxf`, libreria Python installata apposta per
   questo controllo — non a occhio sul testo): la prima stesura usava
   `LWPOLYLINE` ed era invalida (vedi il commento sopra `_dxfPolilinea`), la
   correzione è stata riverificata con lo stesso lettore dopo il fix.

   Due livelli (layer), così chi apre il file può accendere/spegnere:
   "FORI" (un cerchio per foro, raggio dal diametro di progetto, più
   un'etichetta col numero/id del foro) e "FRONTE" (la linea spezzata del
   profilo, se è stato disegnato/importato — mai inventata: se `profilo` è
   vuoto o ha meno di due punti, il livello FRONTE semplicemente non esce,
   non si disegna una linea a caso). */
function _dxfNum(x){ const v=+x; return Number.isFinite(v) ? v.toFixed(3) : '0.000'; }
function _dxfCerchio(layer, x, y, raggio){
  return '0\nCIRCLE\n8\n'+layer+'\n10\n'+_dxfNum(x)+'\n20\n'+_dxfNum(y)+'\n30\n0.0\n40\n'+_dxfNum(raggio)+'\n';
}
/* ⛔ 27/11 — IL NOSTRO DXF LETTO DA UN ALTRO PROGRAMMA (`ezdxf`), e due cose
   che l'andata e ritorno di casa non poteva vedere, perché il nostro lettore i
   testi non li legge:
   1. UN NOME CON UN ACCENTO ARRIVAVA STORPIATO. Il file esce in UTF-8, ma un
      DXF di questa forma (R12, senza intestazione) non dichiara la codifica e
      un CAD lo legge come Windows-1252: «Foro n°1 (àèì)» si apriva «Foro
      nÂ°1 (Ã\xa0Ã¨Ã¬)». La forma che il DXF prevede per questo, e che ogni CAD
      rilegge, è `\U+XXXX`: così il file resta ASCII puro e non dipende dalla
      codifica di chi lo apre. I caratteri fuori dal piano di base (che
      `\U+` a quattro cifre non sa dire) escono «?»; i caratteri di controllo
      uno spazio. E l'accento circonflesso, che in un testo DXF annuncia un
      carattere di controllo («a^b» si apriva «a» più un carattere invisibile),
      esce come il DXF scrive un circonflesso vero: seguito da uno spazio.
      ⚠️ Dichiarato e NON curato: un nome che contiene due percento di fila
      seguiti da una lettera (c, d, p…) in CAD diventa un simbolo — è il modo
      del DXF di scrivere ø, ° e ±, e un nome di foro così non si è mai visto.
   2. UN FORO SENZA NOME LASCIAVA UN TESTO VUOTO: un oggetto che in CAD non si
      vede e non si seleziona, e che le pulizie del disegno segnalano. Senza
      nome non si scrive nessun testo: il cerchio c'è lo stesso.
   ⛔ NEUTRALITÀ: con nomi ASCII e non vuoti (quelli che Genesi dà ai fori) il
   file è byte per byte quello di prima. */
function _dxfTesto(layer, x, y, altezza, testo){
  const t = String(testo==null?'':testo).replace(/[\u0000-\u001f\u007f]/g,' ')
    .replace(/[\ud800-\udbff][\udc00-\udfff]/g,'?')
    .replace(/[^\x20-\x7e]/g, (c)=>'\\U+'+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0'))
    .replace(/\^/g,'^ ');
  if(!t.trim()) return '';
  return '0\nTEXT\n8\n'+layer+'\n10\n'+_dxfNum(x)+'\n20\n'+_dxfNum(y)+'\n30\n0.0\n40\n'+_dxfNum(altezza)+'\n1\n'+t+'\n';
}
/* ⛔ 13/09: QUI STAVA `LWPOLYLINE` — e un DXF R12 senza HEADER/TABLES
   (la forma minima scelta per la compatibilità più larga possibile) NON HA
   i marcatori di sottoclasse (`AcDbPolyline`) che `LWPOLYLINE` pretende dal
   DXF R14 in poi: aperto con un lettore vero (`ezdxf`, non letto a occhio
   sul testo) dava `DXFStructureError: missing 'AcDbPolyline' subclass`. La
   forma che regge dal DXF più vecchio in poi è quella classica a tre pezzi
   — `POLYLINE` d'apertura, un `VERTEX` per punto, `SEQEND` di chiusura —
   verificata di nuovo con lo stesso lettore dopo la correzione. */
function _dxfPolilinea(layer, punti){
  if(!Array.isArray(punti) || punti.length<2) return '';
  let s='0\nPOLYLINE\n8\n'+layer+'\n66\n1\n70\n0\n';
  for(const p of punti) s+='0\nVERTEX\n8\n'+layer+'\n10\n'+_dxfNum(p.x)+'\n20\n'+_dxfNum(p.y)+'\n30\n0.0\n';
  s+='0\nSEQEND\n';
  return s;
}
/* G47d (14/09) — import DXF in SOLA LETTURA, ultima fetta di "Genesi
   simile a un CAD" (il fondatore ha risposto "tutto"). Legge LINE,
   POLYLINE (col suo VERTEX/SEQEND, la stessa forma che `_dxfPolilinea`
   scrive) e LWPOLYLINE (aggiunta il 19/09: è l'entità polilinea di
   DEFAULT di AutoCAD dal R14/1997, LibreCAD e QCAD — senza di lei un file
   scritto da uno di questi tre programmi dava "nessun tratto leggibile"
   anche quando la geometria c'era) e li porta dentro come TRATTI
   (D2.tratti), MAI come fori, fronte o piede.

   È la scelta di sicurezza che chiude la ricerca del 13/09
   (docs/RICERCA_CONTINUA_GENESI.md, "import CAD/DXF: come i software
   commerciali evitano l'errore di convenzione degli assi"): un file
   esterno può avere una convenzione di assi diversa dalla nostra, e la
   ricerca non ha trovato nessun software del settore che validi
   esplicitamente la convenzione prima di fidarsi della geometria per un
   calcolo di burden/sicurezza — solo difese indirette (associazione al
   più vicino, tolleranze). Qui il rischio non si valida: si TOGLIE alla
   radice. Un tratto non entra in NESSUN calcolo (relief, energia,
   burden, flyrock) — è un riferimento visivo sulla pianta, esattamente
   come i tratti disegnati a mano da G47c-2. Un orientamento sbagliato si
   VEDE (la pagina lo dice: "verifica l'orientamento") e si annulla con
   un Ctrl+Z, non produce un numero sbagliato — è la stessa differenza
   fra "protegge da un errore" e "un errore qui non può fare danno". */
/* ══════════════════════════════════════════════════════════════════════════
   26/11 — IL LETTORE RIMISURATO CONTRO UN CAD VERO, NON CONTRO SÉ STESSO.
   ══════════════════════════════════════════════════════════════════════════
   Fino a oggi le prove di questo lettore erano andata-e-ritorno col NOSTRO
   export, o stringhe DXF scritte a mano da chi aveva scritto il lettore: le
   due metà potevano sbagliare insieme. Il 26/11 gli sono stati dati 23 file
   scritti da `ezdxf` (la libreria di riferimento, la stessa già usata il
   13/09 per l'export) nelle forme che AutoCAD/LibreCAD/QCAD producono
   davvero: **9 su 23 letti male**, e nessuno con un errore — tutti con una
   geometria plausibile e sbagliata. In ordine di danno:
    · le linee di un BLOCCO (un simbolo: la freccia del nord, il cartiglio)
      comparivano attorno all'origine anche se il blocco non era mai stato
      inserito nel disegno — geometria che nel disegno NON C'È;
    · le linee dello SPAZIO CARTA (la squadratura del foglio, 420×297)
      entravano come se fossero terreno;
    · una polilinea CHIUSA (un confine, il perimetro di un fabbricato)
      perdeva il lato di chiusura: il contorno arrivava aperto;
    · una superficie a maglia (il TIN di un rilievo) diventava UNA polilinea
      che passava per tutti i suoi vertici e per (0,0);
    · una polilinea specchiata (estrusione 0,0,-1) arrivava con la X negata;
    · un DXF binario rispondeva «non contiene linee», che è falso.
   La regola che li tiene insieme è quella già scritta sopra: un tratto
   importato è un riferimento VISIVO, quindi deve essere quello che il CAD
   mostra — né di più (blocchi, cartiglio) né di meno (il lato che chiude).
   E ciò che NON si legge si CONTA e si dichiara (`nonLette`), invece di
   sparire: 1 linea letta su 6 entità non è «1 tratto importato».
   ⚠️ COSA RESTA FUORI, DICHIARATO: testi, retini, quote, e le spline
   scritte coi soli punti di passaggio. Archi, cerchi, ellissi, spline e
   tratti ad arco delle polilinee (`bulge`) dal 26/11 ENTRANO, come
   spezzate (vedi «GLI ARCHI DEL DXF», «L'ELLISSE DEL DXF» e «LA SPLINE DEL
   DXF» più sotto), e si contano in `archiSpezzati`; e dal 26/11 entra anche il contenuto dei blocchi
   INSERITI (vedi «I BLOCCHI INSERITI»), contati in `blocchiEspansi`.
   ⚠️ LE UNITÀ NON SI CONVERTONO DA SOLE, e non per pigrizia: il modello
   metrico di AutoCAD (`acadiso.dwt`) dichiara `$INSUNITS = 4` (millimetri),
   e un topografo che ci disegna in metri consegna un file che «dichiara
   millimetri» con coordinate in metri. Convertire sulla parola del file
   rimpicciolirebbe di mille volte un disegno giusto. Si riporta l'unità
   dichiarata insieme all'INGOMBRO letto, e decide chi guarda la pianta
   (c'è già «⤢ Scala tratti»). */
const _DXF_UNITA = {
  1:{nome:'pollici',inMetri:0.0254}, 2:{nome:'piedi',inMetri:0.3048}, 4:{nome:'millimetri',inMetri:0.001},
  5:{nome:'centimetri',inMetri:0.01}, 6:{nome:'metri',inMetri:1}, 7:{nome:'chilometri',inMetri:1000},
  10:{nome:'iarde',inMetri:0.9144}, 14:{nome:'decimetri',inMetri:0.1}, 21:{nome:'piedi topografici USA',inMetri:1200/3937}
};
function _dxfStruttura(testo){
  const t = String(testo||'');
  const st = { binario:false, haSezioni:false, insunits:null, entita:[], blocchi:Object.create(null) };
  if(t.slice(0,18)==='AutoCAD Binary DXF'){ st.binario=true; return st; }
  const righe = t.split(/\r\n|\r|\n/);
  let sezione=null, attesaNome=false, cur=null, varHeader=null, blocco=null;
  const definiti=[];
  for(let i=0; i+1<righe.length; i+=2){
    const codice = righe[i].trim(), valore = righe[i+1];
    if(codice==='0'){
      const tipo = valore.trim(); cur = null;
      if(tipo==='SECTION'){ st.haSezioni=true; attesaNome=true; sezione=null; }
      else if(tipo==='ENDSEC'){ sezione=null; blocco=null; }
      else if(tipo==='EOF'){ break; }
      /* BLOCKS contiene le DEFINIZIONI dei blocchi, ognuna fra un BLOCK e il
         suo ENDBLK, in coordinate proprie (attorno al punto base). Non sono
         disegno: lo diventano solo dove un INSERT le richiama, e allora
         `dxfLeggi` le legge col suo stesso ciclo, spostate. Qui si mettono da
         parte per nome. (Dal R2000 anche i fogli di stampa non attivi stanno
         qui, come blocchi `*Paper_Space…` che nessuno inserisce.) */
      else if(sezione==='BLOCKS'){
        if(tipo==='BLOCK'){ blocco={campi:{}, entita:[]}; definiti.push(blocco); cur={tipo, campi:blocco.campi, verts:[]}; }
        else if(tipo==='ENDBLK'){ blocco=null; }
        else if(blocco){ cur={tipo, campi:{}, verts:[]}; blocco.entita.push(cur); }
      }
      /* SOLO la sezione ENTITIES è il disegno (tabelle e oggetti non lo
         sono). Un file senza nessuna sezione (un frammento, o le prove
         storiche scritte a mano) si legge tutto: lì non c'è niente da cui
         distinguere. */
      else if(sezione==='ENTITIES' || !st.haSezioni){ cur={tipo, campi:{}, verts:[]}; st.entita.push(cur); }
    } else if(attesaNome && codice==='2'){ sezione=valore.trim(); attesaNome=false; }
    else if(sezione==='HEADER'){
      if(codice==='9') varHeader=valore.trim();
      else if(varHeader==='$INSUNITS' && codice==='70'){ const u=parseInt(valore,10); if(Number.isFinite(u)) st.insunits=u; varHeader=null; }
    } else if(cur){
      /* LWPOLYLINE (dal 19/09) porta i suoi vertici DENTRO la stessa entità,
         come coppie di codici 10/20 RIPETUTE una volta per vertice — a
         differenza di LINE/VERTEX, dove ogni codice compare una volta sola
         e `campi[codice]=valore` (l'ultimo vince) basta. Un oggetto con
         chiave "10" terrebbe solo l'ULTIMO vertice: si accumula invece un
         array, un vertice per ogni "10" incontrato (l'ordine del formato
         DXF garantisce che il gruppo 10 di un vertice precede sempre il
         suo 20, e il suo eventuale 42 — la curvatura — li segue). */
      if(cur.tipo==='LWPOLYLINE' && codice==='10') cur.verts.push({x:+valore, y:NaN, bulge:0});
      else if(cur.tipo==='LWPOLYLINE' && codice==='20' && cur.verts.length) cur.verts[cur.verts.length-1].y = +valore;
      else if(cur.tipo==='LWPOLYLINE' && codice==='42' && cur.verts.length){ const b=+valore; if(Number.isFinite(b)) cur.verts[cur.verts.length-1].bulge = b; }
      /* SPLINE: anche lei porta tutto DENTRO l'entità, a codici ripetuti —
         i punti di controllo (10/20), i nodi (40), i pesi (41), e a volte i
         punti di passaggio (11/21), che qui si contano soltanto. */
      else if(cur.tipo==='SPLINE' && codice==='10') cur.verts.push({x:+valore, y:NaN});
      else if(cur.tipo==='SPLINE' && codice==='20' && cur.verts.length) cur.verts[cur.verts.length-1].y = +valore;
      else if(cur.tipo==='SPLINE' && codice==='40') (cur.nodi || (cur.nodi=[])).push(+valore);
      else if(cur.tipo==='SPLINE' && codice==='41') (cur.pesi || (cur.pesi=[])).push(+valore);
      else if(cur.tipo==='SPLINE' && codice==='11') cur.passaggi = (cur.passaggi||0)+1;
      else cur.campi[codice]=valore;
    }
  }
  /* i nomi dei blocchi non distinguono maiuscole e minuscole; di due
     definizioni con lo stesso nome vale la prima. 70 = 4 o 8: il blocco è un
     RIFERIMENTO ESTERNO, cioè il suo contenuto sta in un altro file. */
  for(const b of definiti){
    const nome=String(b.campi['2']||'').trim().toUpperCase(), f=parseInt(b.campi['70'],10)||0;
    if(nome && !st.blocchi[nome]) st.blocchi[nome]={ bx:+b.campi['10']||0, by:+b.campi['20']||0, esterno:!!(f&(4|8)), entita:b.entita };
  }
  return st;
}
/* Le entità PIANE (LWPOLYLINE, POLYLINE 2D) scrivono i vertici nel sistema
   dell'OGGETTO (OCS), non in quello del mondo: i due coincidono finché il
   vettore di estrusione (210/220/230) è (0,0,1), cioè quasi sempre — e
   divergono quando il disegno è stato specchiato, dove diventa (0,0,-1) e la
   X del mondo è l'opposto di quella scritta. La regola è l'«algoritmo
   dell'asse arbitrario» della specifica DXF. LINE e le polilinee 3D sono già
   in coordinate mondo e non passano di qui. */
function _dxfOcs(campi, quota){
  let nx=+campi['210'], ny=+campi['220'], nz=+campi['230'];
  if(!Number.isFinite(nx)) nx=0; if(!Number.isFinite(ny)) ny=0; if(!Number.isFinite(nz)) nz=1;
  const m=Math.hypot(nx,ny,nz);
  if(!(m>0) || (Math.abs(nx/m)<1e-9 && Math.abs(ny/m)<1e-9 && nz>0)) return null;   // estrusione normale: OCS = mondo
  nx/=m; ny/=m; nz/=m;
  let ax, ay, az;
  if(Math.abs(nx)<1/64 && Math.abs(ny)<1/64){ ax=nz; ay=0; az=-nx; } else { ax=-ny; ay=nx; az=0; }
  const ma=Math.hypot(ax,ay,az); ax/=ma; ay/=ma; az/=ma;
  const bx=ny*az-nz*ay, by=nz*ax-nx*az;
  const q=Number.isFinite(+quota) ? +quota : 0;
  return (p)=>({ x:p.x*ax+p.y*bx+q*nx, y:p.x*ay+p.y*by+q*ny });
}
/* ══════════════════════════════════════════════════════════════════════
   GLI ARCHI DEL DXF (26/11) — letti, non più solo dichiarati.
   ══════════════════════════════════════════════════════════════════════
   Fino al 26/11 un ARC e un CIRCLE finivano fra le entità «non lette» e un
   tratto ad arco di una polilinea (`bulge`) entrava come CORDA dritta fra i
   suoi estremi, dichiarata. Onesto, ma una curva di livello, un raccordo di
   pista o il bordo tondo di un piazzale arrivavano mozzi: un semicerchio di
   5 m di raggio diventava un segmento di 10 m, cioè 5 m di terreno spariti.
   Adesso un arco entra come SPEZZATA che non si scosta dalla curva vera più
   di `DXF_FRECCIA_ARCO_M` (2 cm: sotto la precisione con cui si traccia un
   foro), e si conta in `archiSpezzati` — la pagina dice quanti e con che
   scarto, perché una spezzata non è l'arco.
    · il numero di lati viene dalla FRECCIA, non da un passo fisso: un arco
      di 100 m di raggio e uno di 1 m con lo stesso passo angolare
      sbaglierebbero di cento volte tanto; mai meno di un lato ogni 30°
      (un cerchio piccolo non deve diventare un triangolo);
    · gli estremi sono ESATTI (quelli del file), i punti in mezzo stanno
      sulla circonferenza;
    · `bulge` = tangente di un quarto dell'angolo al centro, positivo in
      senso antiorario da un vertice al successivo;
    · si lavora nel sistema dell'oggetto e l'estrusione si applica DOPO, a
      ogni punto: un arco specchiato esce specchiato senza un caso a parte.
   (Ellissi e spline hanno il loro conto più sotto.) */
export const DXF_FRECCIA_ARCO_M = 0.02;
function _dxfLati(r, ampiezza, scala){
  const t = Math.min(DXF_FRECCIA_ARCO_M/(scala>0 ? scala : 1), r);
  const passoMax = Math.min(Math.PI/6, 2*Math.acos(1 - t/r));
  return Math.max(1, Math.min(1440, Math.ceil(ampiezza/passoMax - 1e-9)));
}
/* un codice ASSENTE vale il suo predefinito (scala 1, angolo 0, ellisse intera); uno presente e illeggibile no */
function _dxfOpz(campi, codice, predefinito){ const v=campi[codice]; return (v==null || String(v).trim()==='') ? predefinito : +v; }
/* ══════════════════════════════════════════════════════════════════════
   L'ELLISSE DEL DXF (26/11) — letta, non più solo dichiarata.
   ══════════════════════════════════════════════════════════════════════
   Un'ELLIPSE è scritta in coordinate MONDO (a differenza di ARC e CIRCLE):
   centro, ESTREMO del semiasse maggiore relativo al centro, rapporto fra
   i semiassi, parametro iniziale e finale (radianti, antiorario attorno
   all'estrusione; 0 e 2π = ellisse intera). Il punto al parametro t è
     centro + M·cos t + m·sin t      con m = estrusione × M × rapporto
   — l'estrusione qui non sposta niente: dice solo da che parte sta m, cioè
   in che verso gira (un'ellisse specchiata ha estrusione (0,0,-1)).
   I lati si contano come per un CERCHIO di raggio pari al semiasse più
   lungo, a passi uguali di parametro: l'ellisse è quel cerchio schiacciato
   lungo una direzione, e schiacciando una spezzata non la si allontana
   dalla sua curva. Quindi la freccia dichiarata (`DXF_FRECCIA_ARCO_M`) vale
   anche qui, senza un conto a parte. Restituisce null se non è un'ellisse. */
function _dxfEllisse(campi, scala){
  const cx=+campi['10'], cy=+campi['20'], Mx=+campi['11'], My=+campi['21'], k=+campi['40'];
  const Mz=_dxfOpz(campi,'31',0), t0=_dxfOpz(campi,'41',0), t1=_dxfOpz(campi,'42',2*Math.PI);
  let nx=_dxfOpz(campi,'210',0), ny=_dxfOpz(campi,'220',0), nz=_dxfOpz(campi,'230',1);
  if(![cx,cy,Mx,My,Mz,k,t0,t1,nx,ny,nz].every(Number.isFinite) || !(k>0)) return null;
  const nn=Math.hypot(nx,ny,nz); if(!(nn>0)) return null;
  const mx=(ny*Mz-nz*My)/nn*k, my=(nz*Mx-nx*Mz)/nn*k;
  /* il semiasse più lungo della curva COM'È SULLA PIANTA (se l'ellisse è
     inclinata, M e m proiettati non sono più perpendicolari) */
  const qM=Mx*Mx+My*My, qm=mx*mx+my*my, pm=Mx*mx+My*my;
  const a=Math.sqrt(((qM+qm)+Math.sqrt((qM-qm)*(qM-qm)+4*pm*pm))/2);
  if(!(a>0)) return null;
  const TAU=2*Math.PI;
  let amp=((t1-t0)%TAU+TAU)%TAU; const intera = amp<1e-9 || TAU-amp<1e-9; if(intera) amp=TAU;
  const n=_dxfLati(a, amp, scala), pts=[];
  for(let j=0;j<=n;j++){ const t=t0+amp*j/n; pts.push({x:cx+Mx*Math.cos(t)+mx*Math.sin(t), y:cy+My*Math.cos(t)+my*Math.sin(t)}); }
  if(intera) pts[n]={x:pts[0].x, y:pts[0].y};
  return pts;
}
/* ══════════════════════════════════════════════════════════════════════
   LA SPLINE DEL DXF (26/11) — letta dove il file dice che curva è.
   ══════════════════════════════════════════════════════════════════════
   Una SPLINE è una curva B-spline (NURBS se ha i pesi): grado, NODI, PUNTI
   DI CONTROLLO. Con quei tre la curva è definita esattamente, e si calcola
   con l'algoritmo di de Boor — è così che la scrive AutoCAD, sempre.
   ⚠️ C'è però una seconda forma: la spline che porta SOLO i punti di
   passaggio (i «punti di adattamento» di AutoCAD), senza nodi né punti di
   controllo. Lì la curva non è nel
   file: ogni programma la ricostruisce a modo suo, e due CAD disegnano due
   curve diverse per gli stessi punti. Unire i punti con segmenti dritti
   sarebbe inventarne una terza: quella forma resta fra le non lette,
   dichiarata COL SUO NOME («spline definita solo dai punti di
   adattamento»), perché chi importa sappia che basta riesportarla. Così anche una spline coi conti che non tornano (nodi ≠ punti
   di controllo + grado + 1, nodi che tornano indietro, pesi non positivi).
   I lati non si contano con una formula (la curvatura di una spline cambia
   lungo la curva): ogni tratto fra due nodi si DIMEZZA finché la curva, a un
   quarto, a metà e a tre quarti del lato, non sta entro METÀ della freccia
   dichiarata dalla corda — metà, perché tre punti non sono tutta la curva.
   Coordinate MONDO, come l'ellisse: l'estrusione non sposta niente.
   Restituisce null se la curva non è nel file. */
const _DXF_SPLINE_MAX_PUNTI = 20000;
function _dxfSpline(e, scala){
  const grado = Math.round(_dxfOpz(e.campi,'71',3)), flag = parseInt(e.campi['70'],10)||0;
  const P = e.verts, U = e.nodi||[], n = P.length-1;
  if(!(grado>=1 && grado<=11) || n<grado || U.length!==n+grado+2) return null;
  if(!P.every(q=>Number.isFinite(q.x) && Number.isFinite(q.y)) || !U.every(Number.isFinite)) return null;
  for(let i=1;i<U.length;i++) if(U[i]<U[i-1]) return null;
  let W = null;
  if(e.pesi && e.pesi.length){ if(e.pesi.length!==P.length || !e.pesi.every(w=>Number.isFinite(w) && w>0)) return null; W=e.pesi; }
  const u0=U[grado], u1=U[n+1];
  /* de Boor, in coordinate omogenee (x·w, y·w, w): con tutti i pesi a 1 è la B-spline semplice */
  const punto = (u)=>{
    let k=grado; while(k<n && u>=U[k+1]) k++;
    const d=[];
    for(let j=0;j<=grado;j++){ const q=P[k-grado+j], w=W ? W[k-grado+j] : 1; d.push([q.x*w, q.y*w, w]); }
    for(let r=1;r<=grado;r++) for(let j=grado;j>=r;j--){
      const i=k-grado+j, den=U[i+grado-r+1]-U[i], a=den>0 ? (u-U[i])/den : 0;
      d[j]=[(1-a)*d[j-1][0]+a*d[j][0], (1-a)*d[j-1][1]+a*d[j][1], (1-a)*d[j-1][2]+a*d[j][2]];
    }
    return {x:d[grado][0]/d[grado][2], y:d[grado][1]/d[grado][2]};
  };
  const tol = 0.5*DXF_FRECCIA_ARCO_M/(scala>0 ? scala : 1);
  const dalSegmento = (q, a, b)=>{ const dx=b.x-a.x, dy=b.y-a.y, L=dx*dx+dy*dy; let t=L ? ((q.x-a.x)*dx+(q.y-a.y)*dy)/L : 0; t=Math.max(0, Math.min(1, t)); return Math.hypot(q.x-a.x-t*dx, q.y-a.y-t*dy); };
  const pts=[punto(u0)];
  const tratto = (ua, pa, ub, pb, prof)=>{
    if(pts.length>=_DXF_SPLINE_MAX_PUNTI) return;
    const um=(ua+ub)/2, pm=punto(um);
    if(prof<18){
      const pq=punto((ua+um)/2), pr=punto((um+ub)/2);
      if(Math.max(dalSegmento(pm,pa,pb), dalSegmento(pq,pa,pb), dalSegmento(pr,pa,pb))>tol){ tratto(ua, pa, um, pm, prof+1); tratto(um, pm, ub, pb, prof+1); return; }
    }
    pts.push(pb);
  };
  for(let k=grado;k<=n;k++){
    const ua=Math.max(U[k], u0), ub=Math.min(U[k+1], u1);
    if(ub>ua) tratto(ua, punto(ua), ub, punto(ub), 0);
  }
  /* nodi tutti uguali: nessun tratto ha una lunghezza, la curva è un punto solo */
  if(pts.length<2) return null;
  /* 70 = 1: curva chiusa. Se gli estremi coincidono a meno dell'aritmetica, l'ultimo punto È il primo */
  if((flag&1) && Math.hypot(pts[0].x-pts[pts.length-1].x, pts[0].y-pts[pts.length-1].y)<1e-9) pts[pts.length-1]={x:pts[0].x, y:pts[0].y};
  return pts;
}
/* arco di centro (cx,cy) e raggio r, dall'angolo a0 per `ampiezza` radianti
   (positiva = antiorario): i punti, estremi compresi */
function _dxfArco(cx, cy, r, a0, ampiezza, scala){
  const n=_dxfLati(r, Math.abs(ampiezza), scala), pts=[];
  for(let k=0;k<=n;k++){ const a=a0+ampiezza*k/n; pts.push({x:cx+r*Math.cos(a), y:cy+r*Math.sin(a)}); }
  return pts;
}
/* i punti IN MEZZO del tratto ad arco fra p1 e p2 (gli estremi restano quelli del file) */
function _dxfBulge(p1, p2, bulge, scala){
  const dx=p2.x-p1.x, dy=p2.y-p1.y, c=Math.hypot(dx,dy);
  if(!(c>0) || !Number.isFinite(bulge) || bulge===0) return [];
  const amp=4*Math.atan(bulge), r=c/(2*Math.sin(Math.abs(amp)/2)), h=(c/2)/Math.tan(amp/2);
  const cx=(p1.x+p2.x)/2 - h*dy/c, cy=(p1.y+p2.y)/2 + h*dx/c;
  return _dxfArco(cx, cy, r, Math.atan2(p1.y-cy, p1.x-cx), amp, scala).slice(1, -1);
}
/* una polilinea coi suoi tratti ad arco resi a spezzata. La curvatura
   sull'ULTIMO vertice vale solo se la polilinea è chiusa (descrive il tratto
   che torna al primo): su una aperta non disegna niente. */
function _dxfPoliConArchi(verts, chiusa, scala){
  const pts=[]; let archi=0;
  for(let i=0;i<verts.length;i++){
    const a=verts[i], ultimo=(i===verts.length-1);
    pts.push({x:a.x, y:a.y});
    if(ultimo && !chiusa) break;
    const z=ultimo ? verts[0] : verts[i+1];
    if(a.bulge && (a.x!==z.x || a.y!==z.y)){ archi++; for(const q of _dxfBulge(a, z, a.bulge, scala)) pts.push(q); }
  }
  if(chiusa && pts.length>=3){ const a=pts[0], z=pts[pts.length-1]; if(a.x!==z.x || a.y!==z.y) pts.push({x:a.x, y:a.y}); }
  return { pts, archi };
}
/* ══════════════════════════════════════════════════════════════════════
   I BLOCCHI INSERITI (26/11) — espansi, non più solo contati.
   ══════════════════════════════════════════════════════════════════════
   Un CAD disegna una volta un simbolo, un mezzo, una sezione tipo — il
   BLOCCO — e poi lo «inserisce» dove serve, spostato, ruotato, scalato,
   specchiato. In un rilievo vero i blocchi non sono decorazione: spesso è un
   blocco l'intera planimetria ricevuta da un altro studio. Fino al 26/11 si
   contavano («3 blocchi inseriti») e il loro contenuto restava fuori.
   Adesso il contenuto entra dov'è nel disegno:
     mondo = inserimento + Rot(angolo) · ( Scala · (p − base) + passo di schiera )
   e poi l'estrusione dell'INSERT, come per ogni entità piana.
    · il contenuto si legge con lo STESSO ciclo delle entità del disegno
      (non una copia): ciò che là non si legge (testi, retini, spline) qui si
      conta allo stesso modo, una volta per ogni inserimento;
    · un blocco dentro un blocco si espande a sua volta, fino a
      `_DXF_PROFONDITA_BLOCCHI` livelli; un blocco che richiama sé stesso
      (file guasto) si ferma al primo giro. Ciò che non si espande — nome
      sconosciuto, scala nulla, troppo profondo, oltre `_DXF_MAX_ESPANSIONI`
      copie — resta fra le non lette come «blocco inserito»;
    · un RIFERIMENTO ESTERNO (xref) non ha contenuto in questo file: si
      dichiara col suo nome, perché chi importa deve chiedere l'altro file;
    · gli ATTRIBUTI visibili di un blocco espanso (il numero del punto, la
      quota scritta accanto) sono testi: si contano fra i testi non entrati;
    · la freccia degli archi vale NEL MONDO: un cerchio di raggio 1 dentro
      un blocco inserito a scala 50 è un cerchio di 50 m, e i lati si
      contano su quello (la scala più grande delle due, se sono diverse:
      l'arco diventa un tratto d'ellisse e la spezzata gli resta addosso);
    · la schiera (righe × colonne dello stesso INSERT) si espande copia per
      copia, col passo ruotato insieme al blocco e non scalato. */
const _DXF_PROFONDITA_BLOCCHI = 8;
const _DXF_MAX_ESPANSIONI = 20000;
export function dxfLeggi(testo){
  const st = _dxfStruttura(testo);
  const esito = { tratti:[], nonLette:{}, nNonLette:0, spazioCarta:0, archiSpezzati:0, blocchiEspansi:0, binario:st.binario, unita:null, ingombro:null };
  if(st.insunits!=null && _DXF_UNITA[st.insunits]) esito.unita = { codice:st.insunits, nome:_DXF_UNITA[st.insunits].nome, inMetri:_DXF_UNITA[st.insunits].inMetri };
  const nonLetta = (tipo)=>{ esito.nonLette[tipo]=(esito.nonLette[tipo]||0)+1; esito.nNonLette++; };
  let espansioni = 0;
  /* `T` porta un punto dal sistema del blocco al mondo (null: siamo già nel
     mondo); `scala` è di quanto T ingrandisce al più; `catena` i blocchi
     dentro cui si sta leggendo. */
  const leggi = (lista, T, scala, catena)=>{
    let poli = null;        // la POLYLINE in corso (i suoi VERTEX arrivano come entità a sé, fino a SEQEND)
    let appesa = 0;         // dopo un INSERT con attributi: 1 = blocco non espanso (i suoi ATTRIB restano con lui), 2 = espanso (i suoi ATTRIB sono testi non entrati)
    const metti = (pts)=>{ esito.tratti.push({pts: T ? pts.map(T) : pts}); };
    for(const e of lista){
      if(e.tipo==='VERTEX'){
        if(!poli) continue;
        const fv=parseInt(e.campi['70'],10)||0;
        if((fv&128) && !(fv&64)) continue;                         // record-faccia di una mesh: non è un punto
        let p={x:+e.campi['10'], y:+e.campi['20']};
        if(!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
        const bv=+e.campi['42'];
        poli.verts.push({x:p.x, y:p.y, bulge:(poli.piana && Number.isFinite(bv)) ? bv : 0});
        continue;
      }
      if(e.tipo==='SEQEND'){
        if(poli && poli.verts.length>=2){
          const r=_dxfPoliConArchi(poli.verts, poli.chiusa, scala);
          esito.archiSpezzati += r.archi;
          metti(poli.ocs ? r.pts.map(q=>poli.ocs(q)) : r.pts);
        }
        poli=null; appesa=0; continue;
      }
      if(e.tipo==='ATTRIB' && appesa){
        /* 70 = 1: attributo invisibile, sul disegno non c'è */
        if(appesa===2 && !((parseInt(e.campi['70'],10)||0)&1)) nonLetta('ATTRIB');
        continue;
      }
      poli=null; appesa=0;
      /* codice 67 = 1: l'entità sta nello SPAZIO CARTA (il foglio di stampa
         col suo cartiglio), non nel modello. Non è geometria del sito. */
      if(String(e.campi['67']||'').trim()==='1'){ esito.spazioCarta++; continue; }
      if(e.tipo==='LINE'){
        const a={x:+e.campi['10'], y:+e.campi['20']}, b={x:+e.campi['11'], y:+e.campi['21']};
        if([a.x,a.y,b.x,b.y].every(Number.isFinite) && (a.x!==b.x || a.y!==b.y)) metti([a,b]);
      } else if(e.tipo==='POLYLINE'){
        const f=parseInt(e.campi['70'],10)||0;
        /* 16 = maglia di poligoni, 64 = mesh a facce (il TIN di un rilievo):
           i loro VERTEX sono nodi di una SUPERFICIE, non i punti di una linea.
           Unirli in fila disegnerebbe uno scarabocchio che nel file non c'è. */
        if(f&(16|64)){ nonLetta('POLYLINE (superficie)'); continue; }
        /* 8 = polilinea 3D: i suoi vertici sono già nel mondo e la curvatura non ha senso */
        poli={ verts:[], chiusa:!!(f&1), piana:!(f&8), ocs:(f&8)?null:_dxfOcs(e.campi, e.campi['30']) };
      } else if(e.tipo==='LWPOLYLINE'){
        /* ⛔ 19/09, dal quarto giro di deep-pass QA: LWPOLYLINE è l'entità
           polilinea di DEFAULT scritta da AutoCAD (dal R14/1997), LibreCAD e
           QCAD — cioè i tre programmi che il tooltip del bottone nomina come
           interoperabilità. Senza questo ramo un file con SOLO LWPOLYLINE (il
           caso comune) dava tratti:[] e la pagina diceva "il file non contiene
           LINE o POLYLINE leggibili": falso, il file la geometria ce l'aveva. */
        const f=parseInt(e.campi['70'],10)||0, chiusa=!!(f&1), ocs=_dxfOcs(e.campi, e.campi['38']);
        const buoni=e.verts.filter(p=>Number.isFinite(p.x) && Number.isFinite(p.y));
        if(buoni.length>=2){
          const r=_dxfPoliConArchi(buoni, chiusa, scala);
          esito.archiSpezzati += r.archi;
          metti(ocs ? r.pts.map(q=>ocs(q)) : r.pts);
        }
      } else if(e.tipo==='ARC' || e.tipo==='CIRCLE'){
        const cx=+e.campi['10'], cy=+e.campi['20'], r=+e.campi['40'];
        /* un arco senza centro o senza raggio non è un arco: si conta fra le non lette, non si inventa */
        if(![cx,cy,r].every(Number.isFinite) || !(r>0)){ nonLetta(e.tipo); continue; }
        let pts;
        if(e.tipo==='CIRCLE'){ pts=_dxfArco(cx, cy, r, 0, 2*Math.PI, scala); pts[pts.length-1]={x:pts[0].x, y:pts[0].y}; }
        else {
          const a0=+e.campi['50'], a1=+e.campi['51'];
          if(!Number.isFinite(a0) || !Number.isFinite(a1)){ nonLetta('ARC'); continue; }
          /* un ARC va SEMPRE in senso antiorario dall'angolo iniziale a quello finale (in gradi) */
          let amp=((a1-a0)%360+360)%360; if(amp===0) amp=360;
          pts=_dxfArco(cx, cy, r, a0*Math.PI/180, amp*Math.PI/180, scala);
        }
        const ocs=_dxfOcs(e.campi, e.campi['30']);
        metti(ocs ? pts.map(q=>ocs(q)) : pts);
        esito.archiSpezzati++;
      } else if(e.tipo==='ELLIPSE'){
        /* un'ellisse senza semiasse o senza rapporto non è un'ellisse: si conta fra le non lette */
        const ell=_dxfEllisse(e.campi, scala);
        if(!ell){ nonLetta('ELLIPSE'); continue; }
        metti(ell);
        esito.archiSpezzati++;
      } else if(e.tipo==='SPLINE'){
        /* la spline di soli punti di passaggio non ha la sua curva nel file: si dichiara, non si inventa */
        const spl=_dxfSpline(e, scala);
        if(!spl){ nonLetta(!e.verts.length && e.passaggi ? 'SPLINE (punti di adattamento)' : 'SPLINE'); continue; }
        metti(spl);
        esito.archiSpezzati++;
      } else if(e.tipo==='INSERT'){
        const conAttributi = String(e.campi['66']||'').trim()==='1';
        const nome = String(e.campi['2']||'').trim().toUpperCase(), b = st.blocchi[nome];
        const num = (codice, predefinito)=>_dxfOpz(e.campi, codice, predefinito);
        const ix=num('10',0), iy=num('20',0), sx=num('41',1), sy=num('42',1), rot=num('50',0)*Math.PI/180;
        const passoC=num('44',0), passoR=num('45',0);
        /* una schiera a passo nullo mette tutte le copie nello stesso posto: è una copia sola */
        const colonne = passoC ? Math.max(1, parseInt(e.campi['70'],10)||1) : 1, righe = passoR ? Math.max(1, parseInt(e.campi['71'],10)||1) : 1;
        let fuori = null;
        if(b && b.esterno) fuori='INSERT (riferimento esterno)';
        else if(!b || ![ix,iy,sx,sy,rot,passoC,passoR].every(Number.isFinite) || sx===0 || sy===0) fuori='INSERT';
        else if(catena.includes(nome) || catena.length>=_DXF_PROFONDITA_BLOCCHI) fuori='INSERT';
        else if(espansioni + colonne*righe > _DXF_MAX_ESPANSIONI) fuori='INSERT';
        if(fuori){ if(conAttributi) appesa=1; nonLetta(fuori); continue; }
        if(conAttributi) appesa=2;
        if(!catena.length) esito.blocchiEspansi++;
        espansioni += colonne*righe;
        const co=Math.cos(rot), si=Math.sin(rot), ocs=_dxfOcs(e.campi, e.campi['30']);
        const dentro=catena.concat(nome), ingrandisce=scala*Math.max(Math.abs(sx), Math.abs(sy));
        for(let j=0;j<righe;j++) for(let k=0;k<colonne;k++){
          const ox=k*passoC, oy=j*passoR;
          leggi(b.entita, (p)=>{
            const u=(p.x-b.bx)*sx + ox, v=(p.y-b.by)*sy + oy;
            let q={x:ix+u*co-v*si, y:iy+u*si+v*co};
            if(ocs) q=ocs(q);
            return T ? T(q) : q;
          }, ingrandisce, dentro);
        }
      } else if(e.tipo==='ATTDEF' && catena.length){
        /* la DEFINIZIONE di un attributo dentro un blocco non si disegna: al
           suo posto c'è l'ATTRIB di ogni inserimento (contato là). Fa
           eccezione l'attributo COSTANTE (70 = 2), che si vede com'è scritto. */
        const fa=parseInt(e.campi['70'],10)||0;
        if((fa&2) && !(fa&1)) nonLetta('ATTDEF');
      } else {
        nonLetta(e.tipo);
      }
    }
  };
  leggi(st.entita, null, 1, []);
  if(esito.tratti.length){
    let x0=Infinity, x1=-Infinity, y0=Infinity, y1=-Infinity;
    for(const t of esito.tratti) for(const p of t.pts){ if(p.x<x0) x0=p.x; if(p.x>x1) x1=p.x; if(p.y<y0) y0=p.y; if(p.y>y1) y1=p.y; }
    esito.ingombro = { larghezza:x1-x0, altezza:y1-y0 };
  }
  return esito;
}
/* ⚠️ `dxfInTratti` (il nome del 14/09) non esiste più: restituiva i soli
   tratti, e la pagina adesso ha bisogno anche di ciò che NON è entrato. Un
   alias tenuto per le prove sarebbe stato una funzione esportata che il
   prodotto non chiama — chi cerca il vecchio nome trova `dxfLeggi(x).tratti`. */
/* Che cosa c'era nel file e NON è entrato, con le parole di chi disegna e non
   coi nomi del formato: «2 archi, 1 cerchio, 3 blocchi inseriti». Stringa
   vuota se è entrato tutto. I tipi che non hanno un nome italiano escono col
   loro (un nome sconosciuto si mostra, non si nasconde sotto «altro»). */
const _DXF_NOMI = {
  ARC:['arco','archi'], CIRCLE:['cerchio','cerchi'], TEXT:['testo','testi'], MTEXT:['testo','testi'],
  INSERT:['blocco inserito','blocchi inseriti'], SPLINE:['curva spline','curve spline'], ELLIPSE:['ellisse','ellissi'],
  POINT:['punto','punti'], HATCH:['retino','retini'], DIMENSION:['quota','quote'], '3DFACE':['faccia 3D','facce 3D'],
  SOLID:['campitura','campiture'], 'POLYLINE (superficie)':['superficie a maglia','superfici a maglia'],
  'SPLINE (punti di adattamento)':['spline definita solo dai punti di adattamento','spline definite solo dai punti di adattamento'],
  ATTRIB:['testo','testi'], ATTDEF:['testo','testi'], 'INSERT (riferimento esterno)':['riferimento a un altro file','riferimenti ad altri file']
};
export function dxfFraseNonLette(nonLette){
  const somma = {};
  for(const [tipo, n] of Object.entries(nonLette||{})){
    if(!(n>0)) continue;
    const nomi = _DXF_NOMI[tipo] || [tipo, tipo];
    const chiave = nomi[1];
    if(!somma[chiave]) somma[chiave] = { n:0, nomi };
    somma[chiave].n += n;
  }
  return Object.values(somma).sort((a,b)=>b.n-a.n || (a.nomi[1]<b.nomi[1]?-1:1))
    .map(v=> v.n+' '+(v.n===1 ? v.nomi[0] : v.nomi[1])).join(', ');
}
/* IL PIEDE DEI FORI INCLINATI (26/11): il quarto argomento, `progetto`, è
   facoltativo e serve a UNA cosa — sapere quanto è lungo e quanto è inclinato
   ogni foro (`scostamentoPiedeForo`: i valori del foro, se no quelli del
   progetto). Un foro inclinato ha il piede più avanti del boccaforo, verso la
   faccia (y più piccola: la faccia è a y = 0), ed è il punto che chi traccia e
   chi controlla il fronte in CAD vuole vedere: esce come una linea
   boccaforo→piede su un livello suo, `PIEDI`, così si accende e si spegne.
   ⛔ NEUTRALITÀ: senza `progetto`, o con fori verticali, o dove lunghezza o
   inclinazione non si sanno, non esce niente di nuovo — il file di una volata
   a fori verticali è byte per byte quello di prima (provato). */
export function dxfPianoFori(fori, diamMm, profilo, progetto){
  const H = Array.isArray(fori) ? fori.filter(h=>h && Number.isFinite(+h.mx) && Number.isFinite(+h.my)) : [];
  const raggio = (Number.isFinite(+diamMm) && +diamMm>0) ? (+diamMm/2000) : 0.05; // 50mm di default, mai zero: un cerchio a raggio 0 non si vede e sembra un foro mancante
  let ent = '';
  for(const h of H){
    /* F6 (26/11) — un foro con un diametro SUO si disegna col suo: il cerchio
       è l'unico posto in cui questo file dice quanto è largo un foro. Senza
       diametri per foro ogni cerchio ha il raggio del progetto, com'era. */
    const suo = valoreProprioDiForo(h, 'diam'), r = suo === null ? raggio : suo/2000;
    ent += _dxfCerchio('FORI', h.mx, h.my, r);
    ent += _dxfTesto('FORI', h.mx+r*1.3, h.my, Math.max(0.15, r*0.9), h.id!=null ? String(h.id) : '');
  }
  if(progetto) for(const h of H){
    const avanti = scostamentoPiedeForo(h, progetto);
    if(avanti !== null && avanti > 0) ent += _dxfPolilinea('PIEDI', [{x:+h.mx, y:+h.my}, {x:+h.mx, y:+h.my - avanti}]);
  }
  const P = Array.isArray(profilo) ? profilo.filter(p=>p && Number.isFinite(+p.x) && Number.isFinite(+p.y)) : [];
  ent += _dxfPolilinea('FRONTE', P.map(p=>({x:p.x, y:p.y})));
  return '0\nSECTION\n2\nENTITIES\n'+ent+'0\nENDSEC\n0\nEOF\n';
}

/* ══════════════════════════════════════════════════════════════════════════
   G34 · L'AGGANCIO ALLA GRIGLIA (13/09, secondo pezzo di "tutte e tre le
   alternative": dopo l'interoperabilità DXF, il disegno di precisione).
   ══════════════════════════════════════════════════════════════════════════
   Un CAD vero non lascia che un trascinamento a mano libera sposti un punto
   di 3 cm senza che chi disegna se ne accorga: aggancia la posizione al passo
   scelto. È un aiuto OPZIONALE (si accende e si spegne dalla pagina, spento
   di default): un progetto salvato prima di questa unità continua a
   disegnare esattamente gli stessi punti, perché niente qui viene applicato
   da solo — la pagina chiama questa funzione solo mentre l'utente sta
   posizionando un punto col mouse/dito, mai sui dati già salvati. */
export function snapAGriglia(v, passo){
  const x = +v;
  if(!Number.isFinite(x)) return x;                      // un valore già illeggibile resta illeggibile: non è questa funzione a doverlo dichiarare
  const p = +passo;
  if(!Number.isFinite(p) || p<=0) return x;               // passo non valido: nessun aggancio, si passa il valore invariato
  return Math.round(x/p)*p;
}
/* Trasloco B3 (14/09): il legame di una riga con l'aggancio opzionale è
   uscito anche lui — `D2` come primo argomento esplicito, come già per le
   fette precedenti. Dieci punti di chiamata nella pagina, tutti dentro gli
   event handler del mouse dell'editor 2D. */
export function _snapXY(D2, v){ return D2.snap ? snapAGriglia(v, D2.snapPasso) : v; }

/* ══════════════════════════════════════════════════════════════════════════
   G48 · SNAP A UN ESTREMO GIÀ DISEGNATO (19/09, dal delta verificato del
   censimento CAD chiesto dal fondatore — vedi la correzione in
   docs/RICERCA_GENESI_CAD.md: lo snap a OGGETTI, non solo a griglia, era
   l'unico dei quattro assi del 13/09 rimasto scoperto).
   ══════════════════════════════════════════════════════════════════════════
   G34 aggancia alla griglia; questo aggancia a un vertice che esiste GIÀ
   sulla pianta — un punto del fronte, del piede, o di un tratto libero
   (disegnato a mano o importato da DXF, stessa struttura da G47c-2/G47d).
   Serve a chiudere una polilinea esattamente sul suo punto di partenza, o a
   far ripartire un tratto nuovo esattamente dalla fine di uno vecchio,
   senza indovinare a occhio — quello che un CAD chiama "endpoint snap".
   Ogni vertice di una polilinea è un candidato valido (non solo i due
   estremi): in un rilievo importato il punto utile è spesso un vertice
   intermedio, non la fine della linea.
   La tolleranza è passata già convertita in METRI dalla pagina (pixel /
   scala corrente): a uno zoom stretto un aggancio in metri sarebbe enorme
   sullo schermo, a uno zoom largo invisibile — la stessa ragione per cui
   G34 lavora in unità di griglia e non in pixel. */
export function estremiDisegno(profilo, piede, tratti){
  const pts = [];
  for(const p of (profilo||[])) if(p && Number.isFinite(+p.x) && Number.isFinite(+p.y)) pts.push({x:+p.x, y:+p.y});
  for(const p of (piede||[])) if(p && Number.isFinite(+p.x) && Number.isFinite(+p.y)) pts.push({x:+p.x, y:+p.y});
  for(const t of (tratti||[])) for(const p of (t&&t.pts)||[]) if(p && Number.isFinite(+p.x) && Number.isFinite(+p.y)) pts.push({x:+p.x, y:+p.y});
  return pts;
}
export function puntoSnapEstremo(candidati, mx, my, tolleranza){
  const x=+mx, y=+my, tol=+tolleranza;
  if(!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(tol) || tol<=0) return null;
  let migliore=null, distMin=Infinity;
  for(const p of (candidati||[])){
    if(!p || !Number.isFinite(+p.x) || !Number.isFinite(+p.y)) continue;
    const d=Math.hypot(+p.x-x, +p.y-y);
    if(d<distMin){ distMin=d; migliore=p; }
  }
  return (migliore && distMin<=tol) ? {x:+migliore.x, y:+migliore.y} : null;
}

/* ══════════════════════════════════════════════════════════════════════════
   G49 · SELEZIONE MULTIPLA DEI FORI — LA PRIMA FETTA (19/09, secondo asse
   CAD confermato dal censimento dopo G48: window/crossing selection è il
   passo pieno, questo è "Maiusc+clic per aggiungere/togliere" — un
   modificatore che non tocca il gesto esistente su un click singolo.
   ══════════════════════════════════════════════════════════════════════════
   La selezione multipla vive come array di ID (`D2.selMulti`, in
   genesi.html), non di indici: `splice` sposta tutti gli indici dopo quello
   tolto, la stessa lezione già scritta per `D2.selPrev`. Questa funzione
   è la sola parte pura dell'eliminazione batch — filtrare l'array dei fori
   togliendo quelli il cui id è nella selezione — e vive qui per la stessa
   ragione di `estremiDisegno`: testabile sotto `node`, la pagina resta un
   chiamante come un altro. */
export function foriSenzaId(holes, idsSelezionati){
  const via=new Set(idsSelezionati||[]);
  return (holes||[]).filter(h=>h && !via.has(h.id));
}

/* ══════════════════════════════════════════════════════════════════════════
   G50 · RIFLETTI LA SELEZIONE — LA PRIMA TRASFORMAZIONE (19/09, terzo asse
   CAD confermato dal censimento: rotate/scale/mirror completi con pivot
   scelto a mano sono "costo medio-grande" — vedi
   docs/RICERCA_GENESI_CAD.md, sezione 3 — e restano il passo pieno.
   Questo è il mirror più stretto possibile: nessun pivot da scegliere
   (il centro è il centroide della selezione stessa, calcolato, non
   chiesto), nessun angolo (l'asse è sempre verticale — la fila resta
   una fila, si specchia solo lungo di lei, la direzione in cui un
   pattern di fori è quasi sempre simmetrico in cava). Un mirror ad
   asse scelto liberamente è un'estensione della stessa idea, non una
   riscrittura, quando servirà davvero.
   ══════════════════════════════════════════════════════════════════════════
   La spalla (`my`, la distanza dal fronte) non si tocca: specchiare la
   PROFONDITÀ di un foro non ha significato fisico in questo dominio,
   solo la sua posizione lungo la fila (`mx`) — a differenza di un CAD
   generico, dove "verticale" e "orizzontale" sono simmetrici fra loro. */
export function foriRiflessi(holes, idsSelezionati){
  const via=new Set(idsSelezionati||[]);
  const selezionati=(holes||[]).filter(h=>h && via.has(h.id));
  if(!selezionati.length) return (holes||[]).slice();
  const cx=selezionati.reduce((s,h)=>s+ +h.mx, 0)/selezionati.length;
  return (holes||[]).map(h=>(h && via.has(h.id)) ? {...h, mx:+(2*cx - h.mx).toFixed(2)} : h);
}

/* ══════════════════════════════════════════════════════════════════════════
   G57 · RUOTA I TRATTI (19/09) — LA TRASFORMAZIONE CHE MANCAVA, MA SOLO
   DOVE HA SENSO FISICO FARLA.
   ══════════════════════════════════════════════════════════════════════════
   docs/RICERCA_GENESI_CAD.md, sezione 3, la classifica come «costo
   medio-grande» per via del pivot e dell'angolo da chiedere — e per i FORI
   è vero: `mx`/`my` non sono coordinate cartesiane qualunque, sono
   burden/spaziatura rispetto alla faccia (lo stesso principio già scritto
   sopra `foriRiflessi`: la spalla non si specchia perché non ha un
   equivalente fisico). Ruotare un foro di un angolo qualunque mescolerebbe
   le due grandezze e romperebbe quel significato per l'intera selezione.
   I TRATTI no: sono geometria di riferimento importata (un rilievo DXF,
   un profilo disegnato a mano), mai un dato che entra nei calcoli — lo
   stesso motivo per cui l'import DXF li tiene "in sola lettura, mai come
   fori/fronte/piede" (G47d). Ed è proprio lì che la rotazione risolve un
   problema reale, già scritto nel messaggio di quell'import: «un file DXF
   esterno può avere una convenzione di assi diversa... verifica
   l'orientamento» — finora l'unico rimedio a un'importazione storta era
   annullare e reimportare. Ruotare i tratti lascia correggere l'orientamento
   sul posto, senza toccare fori/fronte/piede.
   Pivot: il centroide di TUTTI i punti di TUTTI i tratti (nessun pivot da
   scegliere, stessa scelta minima di `foriRiflessi`). Angolo: l'unico
   pezzo che un mirror non ha e una rotazione non può fare a meno di avere
   — digitato, non trascinato (un handle di rotazione sulla tela è
   un'estensione futura, non necessaria per correggere un asse invertito o
   ruotato di 90°/180°, il caso reale che questa unità risolve). */
export function trattiRuotati(tratti, gradi){
  const T=tratti||[];
  if(!T.length || !gradi) return T.slice();
  const tutti=T.flatMap(t=>t&&t.pts||[]);
  if(!tutti.length) return T.slice();
  const cx=tutti.reduce((s,p)=>s+ +p.x,0)/tutti.length, cy=tutti.reduce((s,p)=>s+ +p.y,0)/tutti.length;
  const rad=gradi*Math.PI/180, co=Math.cos(rad), si=Math.sin(rad);
  return T.map(t=>({...t, pts:(t&&t.pts||[]).map(p=>{
    const dx=p.x-cx, dy=p.y-cy;
    return { x:+(cx+dx*co-dy*si).toFixed(2), y:+(cy+dx*si+dy*co).toFixed(2) };
  })}));
}

/* ══════════════════════════════════════════════════════════════════════════
   G58 · SCALA I TRATTI (19/09) — LA TERZA TRASFORMAZIONE, PER UN CASO
   REALE CHE NÉ IL CENSIMENTO NÉ G57 AVEVANO NOMINATO.
   ══════════════════════════════════════════════════════════════════════════
   `dxfInTratti` (sopra) legge `10`/`20`/`11`/`21` — i numeri grezzi del
   file — e non tocca `$INSUNITS`, la variabile del DXF che dichiara in che
   unità è disegnato. Genesi lavora in METRI ovunque (`D2.B`, `D2.S`, `mx`,
   `my`): un rilievo esportato da un programma che scrive in MILLIMETRI
   (default comune di molti CAD) arriva 1000 volte più grande — non storto
   come nel caso di G57, ILLEGGIBILE: o invisibile fuori scala sulla pianta,
   o talmente enorme da rendere lo zoom automatico inutile. Non è un caso
   ipotizzato: è la stessa famiglia dell'avviso già scritto per l'import DXF
   («verifica l'orientamento»), sull'altro asse possibile — la SCALA invece
   della rotazione — e nessuna riga di questo file lo copriva.
   ⛔ E QUI LA COPIA DA G57 ERA SBAGLIATA, PRESA PRIMA DI SCRIVERLA COSÌ.
   Il mirror e la rotazione hanno ragione a girare intorno al CENTROIDE:
   un'orientazione storta si corregge in un punto che il disegno ha già
   scelto bene, e la posizione assoluta resta quella giusta. Ma un errore
   di UNITÀ non è un errore di orientamento: ogni coordinata è sbagliata
   della stessa proporzione, compresa quella del centroide. Scalare
   attorno al centroide lascia il centro ESATTAMENTE dov'era — un rilievo
   a 7500 mm dall'origine resta a ~7500 dopo aver "scalato" per 0,001,
   solo più piccolo, cioè lontanissimo dai fori che vivono vicino allo
   zero. Misurato prima di scriverla qui: un DXF con due LINE fino a
   10.000/5.000 (mm), scalato di 0,001 attorno al centroide, restava a
   coordinate ~7492–7502 invece di ~0–10 — invisibile sulla stessa pianta
   dei fori tanto quanto prima. La scala giusta per un errore di unità è
   dall'ORIGINE, non dal centro: `x·fattore`, senza sottrarre nessun
   centro prima. Resta fuori dal dominio dei fori per lo stesso motivo
   fisico di G57 (mx/my non sono coordinate libere). Un fattore ≤0 non ha
   senso geometrico (0 collasserebbe tutto sull'origine, negativo
   mescolerebbe una scala con un mirror che nessuno ha chiesto): si
   rifiuta, non si "corregge" silenziosamente al valore assoluto. */
export function trattiScalati(tratti, fattore){
  const T=tratti||[];
  if(!T.length || !fattore || fattore<=0) return T.slice();
  return T.map(t=>({...t, pts:(t&&t.pts||[]).map(p=>({
    x:+(p.x*fattore).toFixed(2), y:+(p.y*fattore).toFixed(2)
  }))}));
}

/* ══════════════════════════════════════════════════════════════════════════
   G51 · INPUT RELATIVO/POLARE PER LE COORDINATE ESATTE (19/09)
   ══════════════════════════════════════════════════════════════════════════
   Sezione 4 del censimento CAD verificato (docs/RICERCA_GENESI_CAD.md):
   il pezzo a basso costo, isolato nella Decisione #43 come NON bloccato
   dalla parte grande (i blocchi riusabili, filata al fondatore). G47a
   aveva già i due campi esatti (x/spalla) ma solo assoluti: chi disegna
   una fila di fori uguali fra loro deve ancora calcolare a mente ogni x
   successivo. Qui si aggiunge, SOPRA l'input assoluto già esistente
   (invariato: un numero senza «@» funziona come prima), una sintassi in
   stile CAD applicata a entrambe le coordinate insieme, col punto di
   riferimento che è lo stesso già tracciato da G34quinquies/G47a per
   l'allineamento e la distanza fra due fori (`D2.selPrev`) — non un
   concetto nuovo.
   ⛔ Il prototipo in scratchpad (prima di scrivere qui, come vuole
   CLAUDE.md) ha bocciato la sintassi annunciata nella decisione
   (`@dx,dy`): la virgola come separatore fra dx e dy COLLIDE con la
   virgola decimale italiana che ogni altro campo di quest'app accetta.
   "@1,5" da solo sarebbe letto come dx=1,dy=5 (due interi), non come un
   singolo decimale con dy mancante — un'ambiguità silenziosa, non un
   errore. Il separatore qui è «;» (`@dx;dy`), che lascia la virgola
   libera di essere decimale in entrambi i numeri come ovunque nell'app;
   il polare non ha questa collisione (`<` non compare mai in un numero)
   e resta `@distanza<angolo`, gradi, 0°=lungo la fila positiva.
   Tre uscite dichiarate, non due — la stessa disciplina di
   `puntoSnapEstremo`: `null` (il testo non inizia per «@», il chiamante
   tratta il valore come assoluto: il comportamento di sempre), un
   oggetto con `errore` (sintassi «@…» tentata ma non valida, o nessun
   punto di riferimento selezionato — un caso che l'utente DEVE vedere,
   non un ripiego muto sullo zero), un oggetto con `mx`/`my` (successo).
   La classe di caratteri `[\d.,]` esclude di proposito il segno «-»
   dalla distanza polare: non serve un controllo `dist<0` a valle,
   perché quella forma non può mai combaciare la sintassi — un controllo
   su un caso che il testo stesso non può produrre sarebbe un ramo morto
   (CLAUDE.md: non si valida ciò che non può accadere). */
export function coordinataRelativa(testo, rif){
  const t = String(testo==null?'':testo).trim();
  if(!t.startsWith('@')) return null;
  if(!rif) return { errore:'serve un punto di riferimento: seleziona prima un altro foro' };
  const corpo = t.slice(1).trim();
  const cart = corpo.match(/^(-?[\d.,]+)\s*;\s*(-?[\d.,]+)$/);
  if(cart){
    const dx=+cart[1].replace(',','.'), dy=+cart[2].replace(',','.');
    if(!isFinite(dx)||!isFinite(dy)) return { errore:'sintassi non valida: usa @dx;dy con due numeri' };
    return { mx: rif.mx+dx, my: rif.my+dy };
  }
  const polar = corpo.match(/^([\d.,]+)\s*<\s*(-?[\d.,]+)$/);
  if(polar){
    const dist=+polar[1].replace(',','.'), ang=+polar[2].replace(',','.');
    if(!isFinite(dist)||!isFinite(ang)) return { errore:'sintassi non valida: usa @distanza<angolo, due numeri' };
    const rad=ang*Math.PI/180;
    return { mx: rif.mx+dist*Math.cos(rad), my: rif.my+dist*Math.sin(rad) };
  }
  return { errore:'sintassi non riconosciuta: usa @dx;dy oppure @distanza<angolo' };
}

/* ══════════════════════════════════════════════════════════════════════════
   G35 · IL PROSSIMO PEZZO DI "GENESI CONTINUA A USCIRE DALLA PAGINA" (13/09)
   ══════════════════════════════════════════════════════════════════════════
   `measureGeom2D` misura la maglia DISEGNATA (non quella di progetto): il
   burden minimo fra i fori, l'interasse fra fori affiancati sulla stessa
   fila (entro mezzo metro di my — la tolleranza che distingue "stessa fila"
   da "fila diversa"), e la lunghezza totale della pianta. Nessun calcolo
   nuovo: era già così nella pagina, cambia solo la firma — legge tre valori
   passati come parametri invece di leggere `D2` direttamente, così può
   girare sotto `node` e la pagina resta un chiamante come un altro.
   ⛔ `Number.isFinite` sul valore GREZZO di `Sprog`, non su `+Sprog`: `+null`
   fa 0, che è finito — è la riga di CLAUDE.md, già pagata una volta in
   `valoreCampo`. E vale anche per la via SENZA fori: prima restituiva
   `Sprog` così com'era (poteva essere `undefined`, una stringa, qualunque
   cosa); il contratto di questa funzione è UNO — S è un numero, oppure
   `null` — e due uscite con due contratti diversi sono una copia più
   debole (la stessa famiglia di CLAUDE.md sulle firme strette). */
export function misuraGeom2D(holes, Sprog, Bprog){
  const Sp = Number.isFinite(Sprog) ? Sprog : null;
  const H = Array.isArray(holes) ? holes : [];
  if(!H.length) return { n:0, B:Bprog, S:Sp, Lm:0 };
  let Bm=Infinity, minx=Infinity, maxx=-Infinity, Sm=Infinity;
  for(const h of H){ if(h.my<Bm)Bm=h.my; if(h.mx<minx)minx=h.mx; if(h.mx>maxx)maxx=h.mx; }
  for(let i=0;i<H.length;i++) for(let j=i+1;j<H.length;j++){
    if(Math.abs(H[i].my-H[j].my)<0.5){ const d=Math.abs(H[i].mx-H[j].mx); if(d>0.05 && d<Sm) Sm=d; }
  }
  if(!isFinite(Sm)) Sm=Sp;
  return { n:H.length, B:+Bm.toFixed(2), S:(Sm===null?null:+Sm.toFixed(2)), Lm:+(maxx-minx).toFixed(1) };
}
/* Trasloco B3 (15/09): il legame di pagina `measureGeom2D()` componeva SOLO
   questa funzione con tre campi dello stato del progetto — sette punti di
   chiamata, tenuto per il nome corto invece di ripetere i tre campi ad ogni
   chiamata. Nessuna ragione per lasciarlo in pagina: stesso nome, lo stato
   passato esplicito come primo argomento. */
export function measureGeom2D(design){ return misuraGeom2D(design.holes, design.S, design.B); }

/* ══════════════════════════════════════════════════════════════════════════
   G36 · UN'ALTRA FETTA DI "GENESI CONTINUA A USCIRE DALLA PAGINA" (13/09)
   ══════════════════════════════════════════════════════════════════════════
   `_puntiNuvola` non leggeva affatto `D2`: il censimento statico
   (`genesi-estraibili.mjs`) la marcava legata a nove variabili del modulo
   («lo, conta, c, locale, n, riga, a, si, su») per lo stesso falso positivo
   già preso tre volte su questo file (unità 121, 122, 124) — lettere e
   parole dentro le STRINGHE della funzione ("nel ritaglio", "caricati",
   "disegnati su") e nei suoi commenti, spezzate dal tokenizzatore
   sull'indentazione. Letta a mano: pura, prende un evento/record e chiama
   solo `_ricPlur` (alias di `conta`, già in questo modulo) e `gnum` (già
   importato da `genesi-formato.js`). Nessun cambio di firma: prendeva un
   parametro prima, lo prende identico adesso.

   ⛔ QUALE conto di punti si sta scrivendo? Fino al 03/08 lo storico metteva
   «250.000 punti» accanto a «volume ≈ 1.234 m³»: il primo era la nuvola
   INTERA (per giunta sottocampionata a quello che si riesce a disegnare), il
   secondo il RITAGLIO. Due numeri di due cose diverse, uno accanto all'altro,
   che chiunque legge come «il ritaglio ha 250.000 punti» — cioè un numero
   tranquillo dove non era stato misurato niente.
   Adesso: se il conto del ritaglio c'è, si scrive QUELLO e si dice che è del
   ritaglio; altrimenti si scrive quello della nuvola dicendo che è caricata,
   e se era sottocampionata si scrive anche su quanti.
   I record vecchi hanno solo `punti`: si mostrano com'erano, senza inventare. */
export function _puntiNuvola(e){
  if(!e) return '';
  if(e.puntiRitaglio>0) return ' · '+_ricPlur(e.puntiRitaglio,'punto','punti')+' nel ritaglio';
  const mostrati = e.puntiMostrati || e.punti || 0;
  if(!mostrati) return '';
  const tot = e.puntiTotali || 0;
  return tot>mostrati
    ? ' · '+_ricPlur(mostrati,'punto disegnato','punti disegnati')+' su '+gnum(tot,0)+' caricati'
    : ' · '+_ricPlur(mostrati,'punto caricato','punti caricati');
}

/* ══════════════════════════════════════════════════════════════════════════
   G37 · CHE COSA DISEGNA UNA PIANTA SENZA MAGLIA (B0-septies, 04/09 → 14/09)
   ══════════════════════════════════════════════════════════════════════════
   Col burden o l'interasse di progetto non numerici — misurato reale: si
   arriva qui aprendo una volata salvata prima del 05/09 (senza fori propri)
   il cui progetto porta un valore assente, la stessa via già usata per la
   controprova di B0-nonies — la pagina costruiva comunque una maglia: le
   coordinate dei fori degenerano per coercizione di un valore assente a
   ZERO (non a un ripiego "plausibile" come i cinque consumatori a valle,
   che invece ripiegano su un burden e un interasse finti), quindi TUTTI i
   fori finivano disegnati sovrapposti nello stesso punto — un conteggio
   foro corretto sopra una geometria completamente falsa. Da lì i cinque
   ripieghi a valle (`computeEnergia2D`, `computeSeq2D`, `computeRelief2D`,
   `_spazTipico`, `drawInnesco2D`) calcolavano numeri su una maglia che non
   esiste.
   ⛔ **Farla a metà era la trappola scritta nella roadmap**: correggere i
   cinque consumatori uno per uno rischiava di lasciarne indietro uno (sono
   risultati 11+ punti che leggono lo stesso ripiego nella pagina, non
   cinque) e di far divergere fra loro i valori di scorta. La cura sta
   invece alla RADICE: se la maglia non si può posizionare, non la si
   genera — e i cinque consumatori NON vengono mai chiamati su una maglia
   vuota, perché ciascuno ha già una guardia sull'assenza di fori scritta
   per altre ragioni. Una guardia sola, non cinque riscritture.
   Questa funzione decide SE la maglia è disegnabile; la pagina la chiama
   prima di generare le coordinate. */
/* ⛔ 27/11 — CON LA PIANTA NON DISEGNABILE NESSUN DOCUMENTO ESCE COME SE LO
   FOSSE. `magliaAssenteMotivo` (qui sotto) dal 14/09 ferma il DISEGNO: senza
   spalla o interasse non nasce nessun foro e lo schermo lo dice. Ma i comandi
   che producono un documento non lo sapevano. Misurato premendoli tutti su
   una volata salvata senza spalla: la scheda CSV usciva con «Maglia;null×3.5
   m», «Fori;0» e «Carica totale (kg);0» e il messaggio «✓ esportata: 39
   parametri»; il piano di carico usciva VUOTO e veniva scritto nella raccolta
   che legge Campo («✓ esportato: 0 fori — Campo lo trova in…»); DXF e piano
   d'innesco uscivano a zero fori; il report si apriva con «Maglia — × 3,5 m»;
   «Simula» portava in una scena senza maglia; e lo scatto A/B salvava un
   progetto a zero fori. Nessun errore, nessuna riga rossa.
   Una frase sola, decisa qui, e una guardia sola nella pagina (`_senzaPianta`)
   davanti a ogni comando: il documento non esce, e chi ha premuto legge che
   cosa manca e dove scriverlo. Salvare la volata resta permesso — è il modo
   di non perdere il lavoro — e la riga che resta in Home lo dice. */
export function nonEsceSenzaPianta(motivo, cosa, verbo){
  if(!motivo) return '';
  return (cosa || 'Il documento') + ' ' + (verbo || 'non esce') + ': la pianta non è disegnabile — ' + fraseMagliaAssente(motivo)
    + (_MAGLIA_PAROLE[motivo] && _MAGLIA_PAROLE[motivo][1] ? '. Scrivi i due dati' : '. Scrivi il dato')
    + ' nei Parametri volata: i fori si ridisegnano da soli.';
}
/* ⛔ 27/11 — LA PAROLA È QUELLA DEL CAMPO, NON QUELLA DEL CODICE. Lo stato che
   ferma il disegno si chiama `'burden'` (è il nome della grandezza nel codice
   e nelle formule), e fino a oggi quella stessa stringa finiva A SCHERMO:
   «Pianta non disegnabile: manca burden». Ma il campo da riempire, sei
   centimetri più su, si chiama «Spalla (m)»: chi legge il messaggio cerca un
   campo «burden» che nella schermata non c'è. Con due dati mancanti in più il
   verbo restava al singolare («manca burden e interasse»).
   Lo STATO non cambia — lo leggono tre banchi e la guardia del disegno — e
   questa funzione dà la FRASE da mostrare, verbo compreso, in un posto solo:
   la pianta, la scheda, i nove comandi fermati e la riga che resta in Home
   passano tutti di qui. Un motivo che non conosce non lo ingoia: lo scrive
   com'è, perché un messaggio vuoto sarebbe peggio di una parola tecnica. */
const _MAGLIA_PAROLE = {
  'burden':             ['manca la spalla', 0],
  'interasse':          ["manca l'interasse", 0],
  'burden e interasse': ["mancano la spalla e l'interasse", 1],
};
/* ⛔ 27/11 — UN TESTO SCRITTO SULLA TELA SI MISURA IN PUNTI DELLA TELA, NON
   DELLO SCHERMO. La pianta è una tela larga 960 punti che il foglio mostra a
   `width:100%` (al massimo 560 px): su un telefono da 320 è larga 292 px, cioè
   ogni punto vale meno di un terzo di pixel. La frase «Pianta non
   disegnabile…» era scritta a 13 punti: misurata, usciva alta circa 4 px —
   una riga gialla, non una frase (visto nello scatto, deciso con la misura).
   Questa funzione dice per quanto moltiplicare un corpo perché sullo schermo
   esca della misura scritta: larghezza interna / larghezza mostrata. Mai meno
   di 1 (su uno schermo largo la tela non si ingrandisce), e 1 quando la tela
   non è a schermo (larghezza zero): un numero non leggibile non diventa un
   corpo infinito. */
export function scalaTestoTela(larghezzaInterna, larghezzaMostrata){
  const a = +larghezzaInterna, b = +larghezzaMostrata;
  if(!Number.isFinite(a) || !Number.isFinite(b) || !(a > 0) || !(b > 0)) return 1;
  return Math.max(1, a / b);
}
export function fraseMagliaAssente(motivo){
  if(!motivo) return '';
  const p = _MAGLIA_PAROLE[motivo];
  return p ? p[0] : 'manca ' + motivo;
}
export function magliaAssenteMotivo(B, S){
  const bOk = Number.isFinite(B) && B>0, sOk = Number.isFinite(S) && S>0;
  if(bOk && sOk) return null;
  if(!bOk && !sOk) return 'burden e interasse';
  return !bOk ? 'burden' : 'interasse';
}
