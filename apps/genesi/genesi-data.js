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
import { numIt, leggiCsv } from '../../shared/deepwork-id-client/dw-shell.js';

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
  const scostKg=+(kgReale-kgProgReg).toFixed(3);
  const scostPct=kgProgReg?scostKg/kgProgReg*100:0;
  const medioKg=reg.length?somma(reg,r=>Math.abs(r.reale-r.prog))/reg.length:0;
  const medioPct=reg.length?somma(reg,r=>Math.abs(r.reale-r.prog)/(r.prog||1))/reg.length*100:0;
  const peggio=reg.slice().sort((a,b)=>Math.abs(b.reale-b.prog)-Math.abs(a.reale-a.prog))[0]||null;
  return { file:nomeFile||'', scartate:p.scartate||0,
    date:uniche(r=>r.data), turni:uniche(r=>r.turno),
    chi:uniche(r=>r.operatore), squadre:uniche(r=>r.squadra),
    foriTot:p.righe.length, foriReg:reg.length,
    kgProgTot:+kgProgTot.toFixed(3), kgProgReg:+kgProgReg.toFixed(3), kgReale:+kgReale.toFixed(3),
    scostKg, scostPct:+scostPct.toFixed(2),
    medioKg:+medioKg.toFixed(3), medioPct:+medioPct.toFixed(2),
    peggio: peggio?{ foro:peggio.foro, prog:peggio.prog, reale:peggio.reale,
                     diff:+(peggio.reale-peggio.prog).toFixed(3) }:null };
}

// numeri scritti come si scrivono in Italia (virgola decimale) ovunque, anche
// nelle percentuali: dentro la stessa riga «-81,7 kg (-28.2%)» si leggerebbe
// come due unità di misura diverse
export const _ricKg=(v)=>gnum(v,1);
export const _ricSegno=(v)=>gseg(v,1);
export const _ricPct=(v)=>gseg(v,1)+'%';
export const _ricPlur=(n,uno,tanti)=>n+' '+(n===1?uno:tanti);
// le date arrivano dal file in ISO (2026-07-29): in cava si legge 29/07/2026.
// Se non è una data ISO si lascia com'è: è testo di un file, non lo si indovina.
export const _ricData=(s)=>{ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||'').trim());
  return m?m[3]+'/'+m[2]+'/'+m[1]:String(s||''); };
export const _ricColore=(pct)=>{ const a=Math.abs(pct); return a<10?'#66bb6a':(a<25?'#ffca28':'#ef5350'); };

export function riconDelta(prev, real, unit){
  /* `real` arriva grezzo dal campo, scritto a mano da chi ha misurato: la
     virgola vale quanto il punto. Con `+real` un «27,5» diventava NaN e la
     riga mostrava un trattino come se la misura non ci fosse. */
  const r = gIn(real);
  if(!isFinite(r)) return '<span style="color:var(--mut)">—</span>';
  const d=r-prev, pct=prev?Math.round(100*d/prev):0, ad=Math.abs(pct);
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
           'campo_data','campo_turno','campo_chi','campo_fori_registrati','campo_fori_totali','campo_kg_reali','campo_kg_progetto','campo_scostamento_pct'];
  const cell=v=>{ const s=String(v==null?'':v); return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; };
  const csv=H.join(';')+'\n'+st.map(r=>{ const c=r.campo||null;
    return [r.ts,r.nome,r.prev.x50,r.real.x50,r.prev.ppv,r.real.ppv,r.prev.fly,r.real.fly,r.real.ovs,r.real.note,
      c?(c.date||[]).join(' '):'', c?(c.turni||[]).join(' '):'', c?(c.chi||[]).join(' '):'',
      c?c.foriReg:'', c?c.foriTot:'', c?c.kgReale:'', c?c.kgProgReg:'', c?c.scostPct:''].map(cell).join(';');
  }).join('\n')+'\n';
  return csv;
}
