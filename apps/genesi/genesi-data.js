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

import { gnum } from './genesi-formato.js';

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
    r2: sst>1e-12 ? +(1-ssr/sst).toFixed(3) : 0,
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
export function ppvLimit(norma,f){
  if (f === null || f === undefined || String(f).trim() === '') return null;
  const n = +f;
  if (!Number.isFinite(n)) return null;
  /* ⛔ E NEMMENO SU UNA NORMA CHE NON CONOSCIAMO. Il `default:` qui sotto è la
     DIN residenziale, e serve — è la norma di riferimento quando il codice è
     quello giusto. Ma un codice **sconosciuto** ci cadeva dentro in silenzio:
     `normaPpvLab('boh')` rispondeva onestamente «boh» e `ppvLimit('boh', 25)`
     rispondeva **15**, cioè l'etichetta e il numero raccontavano due cose
     diverse sullo stesso schermo. Chi legge «boh · 15 mm/s» crede che 15 sia
     la soglia di «boh». */
  if (!Object.prototype.hasOwnProperty.call(NORME_PPV, norma)) return null;
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
