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
/* Sovrappressione d'aria (airblast) al recettore, in dB(L): scala cube-root
   della carica per ritardo. La formula sta QUI perché la usano in due — la
   scheda validatori e il file per Sentinella — e due copie di una formula
   prima o poi dicono due numeri diversi. STIMA, da calibrare. */
export function airblastDb(dist,mic){ const sd3=Math.max(0.001,+dist||0)/Math.cbrt(Math.max(0.1,+mic||0)); return 172-24*Math.log10(Math.max(1,sd3)); }

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
    kgProgTot:+kgProgTot.toFixed(3), kgProgReg:+kgProgReg.toFixed(3), kgReale:+kgReale.toFixed(3),
    scostKg, scostPct,
    medioKg, medioPct,
    peggio: peggio?{ foro:peggio.foro, prog:peggio.prog, reale:peggio.reale,
                     diff:+(peggio.reale-peggio.prog).toFixed(3) }:null };
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
    return [r.ts,r.nome,r.prev.x50,r.real.x50,r.prev.ppv,r.real.ppv,r.prev.fly,r.real.fly,r.real.ovs,r.real.note,
      c?(c.date||[]).join(' '):'', c?(c.turni||[]).join(' '):'', c?(c.chi||[]).join(' '):'',
      c?c.foriReg:'', c?c.foriTot:'', c?c.kgReale:'', c?c.kgProgReg:'', c?c.scostPct:'',
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
  let xml='<?xml version="1.0" encoding="UTF-8"?>\n';
  xml+='<!-- Genesi: bozza di interscambio in stile IREDES (non conformità certificata) -->\n';
  xml+='<BlastPlan xmlns="urn:genesi:blastplan:draft" generator="Genesi" schema="IREDES-like/0.1">\n';
  xml+='  <PlanData>\n';
  xml+='    <MeshBurden unit="m">'+e((+p.B||0).toFixed(2))+'</MeshBurden>\n';
  xml+='    <MeshSpacing unit="m">'+e((+p.S||0).toFixed(2))+'</MeshSpacing>\n';
  xml+='    <HoleDiameter unit="mm">'+e(+p.diam||0)+'</HoleDiameter>\n';
  xml+='    <Explosive>'+e(p.esplosivo)+'</Explosive>\n';
  xml+='    <Initiation id="'+e(inn.id)+'">'+e(inn.nome)+'</Initiation>\n';
  xml+='    <Sequence>'+e(p.sequenza||'diagonale')+'</Sequence>\n';
  xml+='    <HoleDelay unit="ms">'+e(+p.ritardo||0)+'</HoleDelay>\n';
  xml+='    <RowDelay unit="ms">'+e(+p.ritardoFila||0)+'</RowDelay>\n';
  xml+='    <LastDetonation unit="ms">'+e((+p.lastDet||0).toFixed(1))+'</LastDetonation>\n';
  xml+='    <MaxInstantCharge unit="kg" window_ms="8">'+e((+p.mic||0).toFixed(1))+'</MaxInstantCharge>\n';
  xml+='  </PlanData>\n';
  const rows=((p&&p.fori)||[]).slice().sort((a,b)=>(a.tDet||0)-(b.tDet||0));
  xml+='  <Holes count="'+rows.length+'">\n';
  rows.forEach((h,i)=>{
    xml+='    <Hole id="H'+(i+1)+'" seq="'+((h.seq!=null?h.seq:i)+1)+'">\n';
    xml+='      <Position x="'+e((+h.mx||0).toFixed(2))+'" y="'+e((+h.my||0).toFixed(2))+'" unit="m"/>\n';
    xml+='      <Depth unit="m">'+e(+p.prof||0)+'</Depth>\n';
    xml+='      <Charge unit="kg">'+e(+p.kg||0)+'</Charge>\n';
    xml+='      <Stemming unit="m">'+e(+p.stem||0)+'</Stemming>\n';
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
