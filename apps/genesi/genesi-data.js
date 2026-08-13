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

import { gnum, gseg, gIn } from './genesi-formato.js';
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
   scrive solo l'etichetta. */
export function normaConFrequenza(norma, f){
  const x = (f === null || f === undefined || String(f).trim() === '') ? NaN : +f;
  return normaPpvLab(norma) + (Number.isFinite(x) ? ' @ ' + x + ' Hz' : ' @ frequenza non indicata');
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
    righe.push({ foro, prog, reale: (reale!=null&&isFinite(reale)&&reale>=0)?reale:null,
      data: (iData>=0?c[iData]:'')||'', turno:(iTurno>=0?c[iTurno]:'')||'',
      squadra:(iSquadra>=0?c[iSquadra]:'')||'', operatore:(iOper>=0?c[iOper]:'')||'' });
  }
  if(!righe.length) return { errore:'Nessuna riga leggibile: servono almeno il numero del foro e la carica di progetto in chili'
    +(scartate?' (ho scartato '+scartate+(scartate===1?' riga':' righe')+').':'.') };
  return { righe, scartate, colonneDaNome:haIntestazione };
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
  return { file:nomeFile||'', scartate:p.scartate||0,
    date:uniche(r=>r.data), turni:uniche(r=>r.turno),
    chi:uniche(r=>r.operatore), squadre:uniche(r=>r.squadra),
    foriTot:p.righe.length, foriReg:reg.length, misurabile,
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
           'ppv_prev_base'];
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
      (r.prev&&r.prev.ppvBase&&r.prev.ppvBase.breve)||''].map(csvCell).join(';');
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
function _xmlEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }

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
  xml+='  </PlanData>\n';
  const rows=((p&&p.fori)||[]).slice().sort((a,b)=>(a.tDet||0)-(b.tDet||0));
  xml+='  <Holes count="'+rows.length+'">\n';
  rows.forEach((h,i)=>{
    xml+='    <Hole id="H'+(i+1)+'" seq="'+((h.seq!=null?h.seq:i)+1)+'">\n';
    xml+='      <Position x="'+e((+h.mx||0).toFixed(2))+'" y="'+e((+h.my||0).toFixed(2))+'" unit="m"/>\n';
    xml+='      '+_tag('Depth','m',p.prof)+'\n';
    xml+='      '+_tag('Charge','kg',p.kg)+'\n';
    xml+='      '+_tag('Stemming','m',p.stem)+'\n';
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
export function micFinestra(holes, kg) {
  const H = holes;
  if (micSenzaConto(H, kg)) return null;
  const ts = H.map((h) => h.tDet || 0);
  let n = 1;
  for (const t0 of ts) {
    let c = 0;
    for (const t of ts) if (t >= t0 && t < t0 + 8) c++;
    if (c > n) n = c;
  }
  return n * kg;
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
export function caricaTotale(nf, kg){
  if (caricaSenzaConto(nf, kg)) return null;
  return +nf * +kg;
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
  const qtot = caricaTotale(o.nf, o.kg), perche = caricaSenzaConto(o.nf, o.kg);
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
  const qLin = rho * 1000 * Math.PI * Dm * Dm / 4;
  const wTop = Math.min(q, qLin * 10 * Dm);
  const sdob = (s + 5 * Dm) / Math.pow(Math.max(0.1, wTop), 1 / 3);
  return { sdob, wTop, qLin, calcolabile:true,
    carica:false, borraggio:false, diametro:false, che:'', come:'' };
}
