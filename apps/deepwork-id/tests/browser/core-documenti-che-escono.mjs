/* I DOCUMENTI CHE ESCONO DAL CORE, PROVATI PREMENDO IL BOTTONE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-documenti-che-escono.mjs [--porta=8621]
     node core-documenti-che-escono.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. La domanda che il 03/08 ha trovato ventiquattro difetti in
   cinque app è una sola: *dove questa app compone qualcosa che ESCE — un CSV,
   un PDF, una frase di riepilogo — chi decide i suoi numeri?* Se la risposta
   non è «la stessa funzione che li decide a schermo», lì c'è una copia debole.
   Nel core la notte fra il 2 e il 3 sono stati sistemati sei documenti su
   otto; ne restavano due, e questo banco tiene chiusi i loro difetti:

   1. **il Report tecnico** (dashboard → «🔧 Report tecnico completo»). La
      dashboard che ospita quel bottone conta con `totaliRapportini` e scrive
      «— mc» e «2 fuori dal totale»; il PDF che ne esce, due centimetri più
      sotto, chiedeva i numeri direttamente al rapportino: `r.fori||0`,
      `(r.metri||0).toFixed(1)`, `(r.mc||0).toFixed(1)`. Sui dati della
      dimostrazione il turno del 21/07 — quello aperto e mai misurato — usciva
      stampato **«0 · 0.0 · 0.0»**, e quello del 23/07 (nove fori veri, maglia
      da confermare) usciva **«0.0» di metri cubi**. Lo stesso identico difetto
      che il 03/08 era stato tolto dal rapportino stampato, rimasto in piedi in
      un altro foglio. E il PDF non aveva **nessuna riga di totali**, quindi
      nemmeno il posto dove dichiarare che cosa aveva lasciato fuori.

   2. **il PDF della frammentazione**. Qui il verso è ancora più netto: la
      schermata, quando nessuno ha valutato niente, **tace** (il riquadro
      dell'indice oversize è dentro un `${overPct>0 ? ... : ''}`); il PDF
      stampava lo stesso, sempre, **«Indice oversize: 0% — ECCELLENTE»**, e
      quattro classi granulometriche a «0 %» con un totale a «0 %». Un
      giudizio di eccellenza su una volata che nessuno ha guardato, su un
      foglio che esce dall'azienda. È il principio del fondatore — l'assenza
      di un dato non è un dato favorevole — nella sua forma più pura: il
      numero tranquillo dove non è stato misurato niente.
      ⚠️ E la fonte era il valore iniziale: `apriFrammentazione` apriva la
      scheda con `{fine:0, media:0, grossa:0, oversize:0}`, quindi bastava
      aprire e salvare per scrivere nel database quattro zeri che nessuno
      aveva misurato.

   3. **le righe senza data sparivano dal Report tecnico.** `inRange` risponde
      falso su una data vuota, e il modulo «Segnala guasto» non obbliga a
      compilarla (`dataSegn:$('gu-data').value`, nessuna validazione): un
      guasto con la data cancellata si vede nella scheda del mezzo e **non
      c'era** nel documento. Peggio: se tutte le righe di un mezzo erano senza
      data, `if(!logs.length&&!guasti.length&&!consumi.length)return` faceva
      sparire **il mezzo intero**. È la stessa famiglia dei quattro mezzi che
      Flotta perdeva dal foglio dello scadenzario.

   ⚠️ COME SI MISURA UN PDF. jsPDF arriva da un CDN e qui la rete è chiusa; al
   suo posto si serve un **registratore** che espone la stessa interfaccia e
   annota che cosa il core gli chiede di disegnare — le stringhe di `text()` e
   le righe di `autoTable()`. Non è il PDF impaginato: è **esattamente il
   testo** che ci finirebbe dentro, che è la cosa di cui si discute. Il
   bottone lo si preme davvero (`click` sul bottone della dashboard, poi sul
   «GENERA» della modale), non si chiama la funzione.

   ⚠️ I CASI SONO QUELLI DELLA DIMOSTRAZIONE, non inventati: `DEFAULT_RAPPORTINI`
   contiene già il turno mai misurato e quello senza maglia,
   `DEFAULT_RAPPORTINI_FOC` la volata coi chili non scritti. Si aggiungono solo
   le volate (la dimostrazione non ne ha) e due guasti al primo mezzo, appesi
   al modulo servito — il file su disco non si tocca, perché accanto ci sono
   cantieri che scrivono.

   ⛔ E IL FINTO FIRESTORE DEVE **RIFIUTARE**, non rispondere vuoto: con un
   Firestore che dice «nessun documento» il core crede di essere al primo
   avvio, semina il database e l'accesso risponde «Credenziali errate» su
   credenziali giuste. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
/* ⚠️ DUE CONTROPROVE, E LA SECONDA È NATA PERCHÉ LA PRIMA MASCHERAVA LE ALTRE.
   Rimettendo TUTTI i difetti insieme, quello del toast — la striscia
   invisibile — impedisce di premere il bottone del Report tecnico, e allora
   le dodici prove sui numeri del foglio cadono per la ragione sbagliata: non
   perché il foglio menta, ma perché il foglio non esiste. Un rosso che si
   legge male è un rosso che insegna a non guardare. Lo strato del toast si
   prova da solo, con `--controprova-toast`. */
const CONTRO_TOCCO = process.argv.includes("--controprova-toast");
const CONTROPROVA = process.argv.includes("--controprova") || CONTRO_TOCCO;
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8621;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── I CASI ────────────────────────────────────────────────────────────────
   Tre volate, e sono tre perché servono tutt'e tre: una mai valutata, una
   valutata per bene, una a metà. Senza la seconda, il modo più facile di far
   passare le prove sarebbe spegnere ogni numero — l'errore opposto.

   ⛔ E L'AGGANCIO NON È PIÙ IL LETTERALE DI `DB`, PERCHÉ QUELLO VIENE
   SOVRASCRITTO. Fino al 07/08 le volate si infilavano in `volate:[], // ← F1`,
   cioè nella dichiarazione dell'oggetto `DB`. Poi il 06/08 la dimostrazione ha
   guadagnato i suoi progetti di volata, e con loro la riga
   `DB.volate = [...DEFAULT_VOLATE]` dentro `initDBOfflineFallback`: da quel
   momento i casi di questo banco venivano **buttati via** un istante dopo
   essere stati letti, `apriFrammentazione('vz1')` non trovava la volata, la
   scheda non si apriva e `page.click` moriva per timeout portandosi via
   undici prove. La sostituzione era avvenuta davvero — infatti la riga
   «i casi hanno agganciato la pagina servita» diceva ok: **guardava il file,
   non lo stato**. Adesso i casi si appendono a `DEFAULT_VOLATE`, che è la
   sorgente da cui `DB` viene riempito, esattamente come già facevano i guasti;
   e che siano ARRIVATI lo prova una riga sola, più sotto, invece di dedurlo. */
const VOLATE = "DEFAULT_VOLATE.push("
  + "{id:'vz1',cavaId:'cava_1',numero:101,data:'2026-07-14',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:null,media:null,grossa:null,oversize:null,note:'',foto:[],"
  + "dataValutazione:'2026-07-15',valutatoreId:'user_ufficio'}},"
  + "{id:'vz2',cavaId:'cava_1',numero:102,data:'2026-07-17',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:12,media:53,grossa:29,oversize:6,note:'',foto:[],"
  + "dataValutazione:'2026-07-18',valutatoreId:'user_ufficio'}},"
  + "{id:'vz3',cavaId:'cava_1',numero:103,data:'2026-07-20',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:20,media:null,grossa:null,oversize:2,note:'',foto:[],"
  + "dataValutazione:'2026-07-21',valutatoreId:'user_ufficio'}});\n";
const ANCORA_VOLATE = "const DEFAULT_DEPOSITO = {";

/* ⛔ IL TURNO RIAPERTO: I FORI AZZERATI, IL VOLUME RIMASTO DAL GIRO PRIMA.
   Serve perché senza di lui i due numeri che questo banco confronta —
   «somma di tutto» e «somma dei soli turni misurabili» — sulla dimostrazione
   coincidono: gli unici rapportini che non sanno dire il volume hanno anche
   `mc: 0`, quindi entrare o non entrare nel totale non cambia niente e le due
   prove sui TOTALI non distinguerebbero nulla (è la causa 1 dell'elenco:
   i dati fanno coincidere la risposta giusta con quella sbagliata).
   Qui `fori: 0` e `mc: 640.5`: `misureRapportino` dice «non misurato», quindi
   il volume non è suo — ma un `r.mc||0` lo sommerebbe. Somma ingenua 4106.6,
   somma giusta 3466.1. Ed è un caso vero, non una caricatura: il campo del
   volume resta scritto dal turno precedente quando si riaprono i fori. */
const RAPP_RIAPERTO = "DEFAULT_RAPPORTINI.push("
  + "{id:'rz1',userId:'user_operatore',cavaId:'cava_1',data:'2026-07-25',"
  + "oi:'07:00',of:'',diametro:89,maglia:'3x3.5',maglia_B:3,maglia_S:3.5,"
  + "mezzoId:'mlav_1',personale:[],fori:0,fori_fila1:0,fori_fila2:0,"
  + "metri:0,media_prof:0,mc:640.5,fori_dettaglio:[],volataId:null,"
  + "note:'Turno riaperto: i fori sono stati azzerati.',inviato:'2026-07-25'});\n";
const ANCORA_RAPP = "const DEFAULT_RAPPORTINI_FOC = [";

/* ⛔ LA VOLATA DISEGNATA E BASTA: i fori ci sono, le profondità e i chili no.
   È l'unico stato in cui `v.tot_metri` vale zero mentre i metri cubi — che da
   quei metri discendono — sono già dichiarati non noti: il riquadro del PDF si
   contraddiceva a due centimetri di distanza. Non è una caricatura:
   `ricalcolaTotaliVolata` lo produce da sé appena si disegna una maglia senza
   aver scritto la profondità di serie (`prof:parseNum0(v.default.profondita_m)
   ||0`). Serve anche alla riconciliazione, che su di lei scriveva «0,0» nella
   colonna PROGETTO accanto a un perforato vero. */
const VOLATA_NUDA = "DEFAULT_VOLATE.push("
  + "{id:'vz9',cavaId:'cava_1',numero:9,data:'2026-06-09',tipo:'cava',"
  + "nomeProgetto:'Banco 5 - da quotare',stato:'progetto',"
  + "fronte:{lunghezza_m:18,altezza_m:0,calotta_m:0,profilo:[],piede_attivo:false,piede_profondita:0},"
  + "maglia:{borraggio:3,spaziatura:3.5,file:1},"
  + "default:{diametro_mm:89,profondita_m:'',esplosivo:'',kg_per_foro:'',ritardo_ms:42,innesco:''},"
  + "fori:Array.from({length:6},(_,i)=>({id:'foro_vz9_'+(i+1),num:i+1,x:2+i*3,y:3,"
  + "prof:'',diam:89,kg:'',esplosivo:'',ritardo:'',innesco:'',sequenza:i+1,note:''})),"
  + "connessioni:[],tot_fori:6,tot_metri:0,tot_kg:0,tot_mc:0,note:'',"
  + "createdBy:'user_admin',createdAt:0,updatedAt:0});\n";

/* ⛔ TRE TURNI DI GIUGNO, e ognuno serve a una domanda che luglio non sa fare.
   · `rg1` è l'unico turno di giugno della cava Monte Serra e non è misurato:
     nel foglio «Riepilogo cave» dell'Excel quella cava non ha nessun volume da
     dichiarare, ed è lì che usciva «Mc 0,00» mentre il primo foglio, per lo
     stesso stato, lascia la cella vuota — due convenzioni nello stesso file;
   · `rg2` e `rg3` sono **lo stesso giorno sulla stessa cava** (mattina e
     pomeriggio, che in cava è la normalità): il nome del PDF del rapportino
     portava solo cava e data, quindi il secondo cancellava il primo.
   Si sceglie giugno di proposito: le prove sui totali di luglio, che sono
   derivate ma parlano di righe precise (14/07, 21/07, 23/07, 25/07), restano
   così com'erano e nessuna di loro cambia di significato. */
const RAPP_GIUGNO = "DEFAULT_RAPPORTINI.push("
  + "{id:'rg1',userId:'user_operatore',cavaId:'cava_1',data:'2026-06-09',oi:'07:00',of:'',"
  + "diametro:89,maglia:'3x3.5',maglia_B:3,maglia_S:3.5,mezzoId:'mlav_1',personale:[],"
  + "fori:0,fori_fila1:0,fori_fila2:0,metri:0,media_prof:0,mc:0,fori_dettaglio:[],"
  + "volataId:null,note:'Turno aperto.',inviato:'2026-06-09'},"
  + "{id:'rg2',userId:'user_operatore',cavaId:'cava_2',data:'2026-06-10',oi:'07:00',of:'12:00',"
  + "diametro:102,maglia:'3.2x3.8',maglia_B:3.2,maglia_S:3.8,mezzoId:'mlav_2',personale:[],"
  + "fori:8,fori_fila1:8,fori_fila2:0,metri:72,media_prof:9,mc:756,fori_dettaglio:[],"
  + "volataId:null,note:'Turno di mattina.',inviato:'2026-06-10'},"
  + "{id:'rg3',userId:'user_operatore',cavaId:'cava_2',data:'2026-06-10',oi:'13:00',of:'17:00',"
  + "diametro:102,maglia:'3.2x3.8',maglia_B:3.2,maglia_S:3.8,mezzoId:'mlav_2',personale:[],"
  + "fori:6,fori_fila1:6,fori_fila2:0,metri:54,media_prof:9,mc:567,fori_dettaglio:[],"
  + "volataId:null,note:'Turno di pomeriggio, stessa cava e stesso giorno.',inviato:'2026-06-10'});\n";

/* Due guasti sul primo mezzo: uno con la data e uno **senza**, che è lo stato
   che il modulo «Segnala guasto» produce se si svuota il campo. */
const GUASTI = "DEFAULT_MEZZILAV[0].guasti=["
  + "{id:'gz1',dataSegn:'2026-07-16',componente:'Impianto idraulico',gravita:'media',stato:'segnalato',descrizione:'Perdita sul martinetto',aggiornamenti:[]},"
  + "{id:'gz2',dataSegn:'',componente:'Compressore',gravita:'critica',stato:'segnalato',descrizione:'Non tiene la pressione',aggiornamenti:[]}];\n";
const ANCORA_GUASTI = "const DEFAULT_MEZZISTR = [";

/* ── I DIFETTI, per la controprova ──
   Sono le versioni **vere** che il core aveva prima, non caricature. */
const DIFETTI = [
  // 1 · il Report tecnico che chiede i numeri al rapportino invece che a `misureRapportino`
  [`      return[dataO(r.data),c?c.nome:'\u2014',u?u.nome+' '+u.cognome:'\u2014',
        ms.misurato?ms.fori:'non misurato',
        ms.metri===null?'\u2014':ms.metri.toFixed(1),
        ms.calcolabile?ms.mc.toFixed(1):'\u2014'];}),`,
   `      return[dataO(r.data),c?c.nome:'\u2014',u?u.nome+' '+u.cognome:'\u2014',r.fori||0,(r.metri||0).toFixed(1),(r.mc||0).toFixed(1)];}),`],
  // 2 · la riga dei totali e la dichiarazione di che cosa e' rimasto fuori
  [`    foot:rp.length?[[{content:'TOTALI',colSpan:3,styles:{halign:'right',fontStyle:'bold'}},`,
   `    foot:[].length?[[{content:'TOTALI',colSpan:3,styles:{halign:'right',fontStyle:'bold'}},`],
  // 3 · il giudizio di eccellenza su una frammentazione mai valutata
  ["  const valutazione=mf.giudizio?mf.giudizio.toUpperCase():'NON VALUTATO';\n  d.setFont('helvetica','bold');d.setFontSize(11);\n  d.text(`Indice oversize: ${mf.oversize===null?'non valutato':mf.oversize+'%'} \u2014 ${valutazione}`,14,y);y+=8;",
   "  const overPct=f.oversize||0;\n  const valutazione=overPct<3?'ECCELLENTE':(overPct<8?'ACCETTABILE':'CRITICO');\n  d.setFont('helvetica','bold');d.setFontSize(11);\n  d.text(`Indice oversize: ${overPct}% \u2014 ${valutazione}`,14,y);y+=8;"],
  // 4 · le classi granulometriche a zero invece che «non valutato»
  ["  const cl=k=>mf.classi[k]===null?'non valutato':mf.classi[k]+' %';",
   "  const cl=k=>(f[k]||0)+' %';"],
  // 5 · il toast che, sparito, continua a mangiare i tocchi
  ["opacity:0;pointer-events:none;transition:all .3s;z-index:999;white-space:normal;width:max-content;max-width:90vw;text-align:center;line-height:1.35;overflow-wrap:break-word;}",
   "opacity:0;transition:all .3s;z-index:999;white-space:normal;width:max-content;max-width:90vw;text-align:center;line-height:1.35;overflow-wrap:break-word;}"],
  // 6 · il foglio che tace su quello che ha lasciato fuori dai totali
  ["  if(totRT.senzaMisura||totRT.senzaVolume){",
   "  if(false&&(totRT.senzaMisura||totRT.senzaVolume)){"],
  // 7 · le righe senza data buttate via dal Report tecnico
  ["  const inRange=dt=>!dt||((!da||dt>=da)&&(!a||dt<=a));",
   "  const inRange=dt=>dt&&(!da||dt>=da)&&(!a||dt<=a);"],
  /* 8 · lo schema di volata che dichiara come completo un carico a metà, e
        stampa «0m» dove i mc dicono già «-» */
  [`  const kpi=[['FORI',String(mv.fori)],
             ['METRI',mv.metri===null?'-':mv.metri+'m'],
             [mv.parziale?'KG · PARZIALE':'KG',mv.kgNoto?mv.kg+'kg':'-'],
             ['MC',mv.mcNoto?mv.mc+'mc':'-']];`,
   `  const kpi=[['FORI',String(v.tot_fori)],['METRI',v.tot_metri+'m'],['KG',v.tot_kg>0?v.tot_kg+'kg':'-'],['MC',v.tot_mc>0?v.tot_mc+'mc':'-']];`],
  // 9 · e la riserva scritta sotto i riquadri, che spiega il trattino
  ["    if(ris.length){\n      d.setTextColor(150,90,0);",
   "    if(false&&ris.length){\n      d.setTextColor(150,90,0);"],
  // 10 · i totali di pagina 3 dello stesso foglio
  [`      const tt=[['Fori',String(mv.fori)],
                ['Metri',mv.metri===null?'-':mv.metri+' m'],
                ['Carica',mv.kgNoto?(mv.parziale?'almeno ':'')+mv.kg+' kg':'-'],
                ['Mc',mv.mcNoto?mv.mc+' mc':'-']];`,
   `      const tt=[['Fori',String(v.tot_fori)],['Metri',v.tot_metri+' m'],['Carica',v.tot_kg>0?v.tot_kg+' kg':'-'],['Mc',v.tot_mc>0?v.tot_mc+' mc':'-']];`],
  // 11 · le due celle della maglia scritte «0» nel foglio che la dichiara mancante
  ["          'Diametro (mm)':cellaNum(r.diametro),\n          'Maglia':r.maglia||'—',\n          'Burden (m)':cellaNum(r.maglia_B),\n          'Spaziatura (m)':cellaNum(r.maglia_S),",
   "          'Diametro (mm)':r.diametro||0,\n          'Maglia':r.maglia||'—',\n          'Burden (m)':r.maglia_B||0,\n          'Spaziatura (m)':r.maglia_S||0,"],
  // 12 · il secondo foglio dell'Excel con la convenzione del primo capovolta
  ["                Mc:t.mc===null?'':+t.mc.toFixed(2),",
   "                Mc:+(t.mc||0).toFixed(2),"],
  // 13 · il modulo vuoto che si sovrascrive da solo
  ["+'_'+nFori+'fori'+(nFile>1?'_'+nFile+'file':'')+'.pdf');",
   "+'.pdf');"],
  /* 14 · il rapportino che si sovrascrive da solo — due punti in un colpo solo
         (perforazione e fochino), perché la stringa è la stessa */
  ["_${r.data}_${r.id.substr(0,8).toUpperCase()}.pdf`);",
   "_${r.data}.pdf`);"],
  /* 15 · la striscia sopra il bottone «⤓ PDF»: quella che dava «0m · 0mc» sopra
         un foglio che per lo stesso stato scrive «-». Il difetto qui è
         **una sola riga in un posto solo** solo perché la copia gemella è
         stata tolta: prima ce n'erano due, e rimetterne una sola avrebbe
         lasciato passare metà delle schermate. */
  /* ⛔ RIPUNTATA L'08/08: le tre unità sono state avvolte in `<span class="u">`
     dal cantiere delle unità nude sotto le classi maiuscole, e questa iniezione
     cercava ancora la `m` nuda. Non trovava più niente, la pagina restava sana,
     e il banco «non distingueva» senza che il numero delle prove si muovesse.
     Il difetto rimesso è lo stesso di prima — i totali della VOLATA al posto
     dei metri MISURATI — solo scritto com'è scritto oggi. */
  ["    <span class=\"ec-stat\"><b>${mv.metri===null?'—':mv.metri}</b><span class=\"u\">m</span></span>\n    ${mv.kgNoto?`<span class=\"ec-stat\"><b>${mv.parziale?'≥':''}${mv.kg}</b><span class=\"u\">kg</span></span>`:''}\n    <span class=\"ec-stat\"><b>${mv.mcNoto?mv.mc:'—'}</b><span class=\"u\">mc</span></span>",
   "    <span class=\"ec-stat\"><b>${v.tot_metri}</b><span class=\"u\">m</span></span>\n    ${v.tot_kg>0?`<span class=\"ec-stat\"><b>${v.tot_kg}</b><span class=\"u\">kg</span></span>`:''}\n    <span class=\"ec-stat\"><b>${v.tot_mc}</b><span class=\"u\">mc</span></span>"],
  // 16 · la colonna PROGETTO della riconciliazione a «0,0» invece che «non quotato»
  ["      ['Metri', cif(progMetri,'non quotato').replace('.',','), cif(realMetri).replace('.',','), seg(dM)],\n      ['Mc abbattuti', cif(progMc,'non quotato').replace('.',','), cif(realMc).replace('.',','), seg(dC)]",
   "      ['Metri', (progMetri||0).toFixed(1).replace('.',','), cif(realMetri).replace('.',','), seg(dM)],\n      ['Mc abbattuti', (progMc||0).toFixed(1).replace('.',','), cif(realMc).replace('.',','), seg(dC)]"],
];

/* ── IL REGISTRATORE AL POSTO DI jsPDF ──
   Espone quel poco che il core usa e annota le stringhe. `save()` chiude un
   documento e lo mette in `window.__pdf`. */
const REGISTRATORE = `
(function(){
  var reg = window.__pdf = { salvati: [] };
  function Doc(){
    this.__t = []; this.__tab = [];
    this.lastAutoTable = { finalY: 40 };
    var self = this;
    this.internal = { getNumberOfPages: function(){ return 1; },
                      pageSize: { getWidth: function(){ return 210; }, getHeight: function(){ return 297; } } };
  }
  ['setFillColor','rect','setTextColor','setFont','setFontSize','setDrawColor','line',
   'setLineWidth','addPage','setPage','circle','addImage','setProperties','setLineDash',
   'setGState','saveGraphicsState','restoreGraphicsState'].forEach(function(n){
    Doc.prototype[n] = function(){ return this; };
  });
  Doc.prototype.text = function(t){
    var v = Array.isArray(t) ? t : [t];
    for (var i = 0; i < v.length; i++) this.__t.push(String(v[i]));
    return this;
  };
  Doc.prototype.splitTextToSize = function(t){ return String(t).split('\\n'); };
  Doc.prototype.getTextWidth = function(t){ return String(t).length * 2; };
  Doc.prototype.autoTable = function(o){
    o = o || {};
    var cella = function(c){ return (c && typeof c === 'object' && 'content' in c) ? String(c.content) : String(c); };
    var riga = function(r){ return (r || []).map(cella); };
    this.__tab.push({ head: (o.head || []).map(riga), body: (o.body || []).map(riga), foot: (o.foot || []).map(riga) });
    this.lastAutoTable = { finalY: (o.startY || 20) + 10 };
    return this;
  };
  Doc.prototype.save = function(nome){
    reg.salvati.push({ nome: String(nome), testi: this.__t.slice(), tabelle: this.__tab.slice() });
    return this;
  };
  window.jspdf = { jsPDF: Doc };
})();
`;

/* ⚠️ E SERVE ANCHE UN FINTO Chart.js, se no la dashboard — che è la schermata
   da cui si preme il bottone — muore su `Chart is not defined` e il banco
   misura una pagina che non è mai arrivata in fondo. I grafici non c'entrano
   con quello che si sta provando; quello che serve è che la schermata si
   monti tutta. */
const FINTO_CHART = `
window.Chart = function(){ this.destroy = function(){}; this.update = function(){}; };
window.Chart.register = function(){};
window.Chart.defaults = { font: {}, plugins: { legend: { labels: {} } } };
`;

/* ⚠️ E UN REGISTRATORE AL POSTO DI SheetJS, con la stessa idea del jsPDF finto:
   quello che si vuole guardare non è il file .xlsx impaginato, sono **le celle**
   che il core chiede di scriverci. `json_to_sheet` riceve oggetti e ne fa righe,
   `sheet_add_aoa` appende righe già fatte, `writeFile` chiude la cartella di
   lavoro. Il bottone si preme davvero: il core, non trovando `window.XLSX`, va a
   caricarlo dal CDN — ed è quella richiesta a essere intercettata. */
const FINTO_XLSX = `
(function(){
  var reg = window.__xlsx = { salvati: [] };
  function Foglio(){ this.__righe = []; }
  window.XLSX = { utils: {
      json_to_sheet: function(righe){ var f = new Foglio();
        if (righe.length) { var col = Object.keys(righe[0]); f.__righe.push(col);
          righe.forEach(function(r){ f.__righe.push(col.map(function(k){ return r[k]; })); }); }
        return f; },
      sheet_add_aoa: function(f, aoa){ (aoa || []).forEach(function(r){ f.__righe.push(r); }); return f; },
      book_new: function(){ return { fogli: [] }; },
      book_append_sheet: function(wb, f, nome){ wb.fogli.push({ nome: String(nome), righe: f.__righe }); }
    },
    writeFile: function(wb, nome){ reg.salvati.push({ nome: String(nome), fogli: wb.fogli }); } };
})();
`;

let agganci = { volate: 0, guasti: 0, riaperto: 0, nuda: 0, giugno: 0 };
let colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p === join(R, "index.html")) {
    let t = corpo.toString("utf8");
    let prima = t;
    t = t.split(ANCORA_VOLATE).join(VOLATE + ANCORA_VOLATE);
    if (t !== prima) agganci.volate = 1;
    prima = t;
    t = t.split(ANCORA_GUASTI).join(GUASTI + ANCORA_GUASTI);
    if (t !== prima) agganci.guasti = 1;
    prima = t;
    t = t.split(ANCORA_RAPP).join(RAPP_RIAPERTO + ANCORA_RAPP);
    if (t !== prima) agganci.riaperto = 1;
    prima = t;
    t = t.split(ANCORA_VOLATE).join(VOLATA_NUDA + ANCORA_VOLATE);
    if (t !== prima) agganci.nuda = 1;
    prima = t;
    t = t.split(ANCORA_RAPP).join(RAPP_GIUGNO + ANCORA_RAPP);
    if (t !== prima) agganci.giugno = 1;
      if (CONTROPROVA) for (const [sano, malato] of DIFETTI) {
      const suoStrato = sano.includes("pointer-events");
      if (suoStrato !== CONTRO_TOCCO) continue;         // uno strato per volta
      if (t.includes(sano)) { colpiti.add(sano); t = t.split(sano).join(malato); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e risponde «non so fallire». */
const SEGNO = join(R, "__core-doc-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-doc-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const schedeNonAperte = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};

/* ⚠️ Alto 1200 e non 844: il bottone del Report tecnico sta in fondo alla
   dashboard, e a 844 finisce **sotto la barra di navigazione fissa** — il
   click non arriva mai al bottone e il banco muore per timeout invece di
   misurare. La larghezza resta quella del telefono. */
/* ⛔ E IL SERVICE WORKER VA BLOCCATO, se no una rotta smette di funzionare DOPO
   qualche secondo e non si capisce perché. Misurato il 07/08 e costato mezz'ora:
   la libreria di Excel il core la va a prendere dal CDN solo quando si preme il
   bottone — cioè **tardi**, quando `setupPWA` ha già registrato `./sw.js` e il
   worker controlla la pagina. Da quel momento le richieste non passano più dal
   livello delle rotte di Playwright (che di norma non intercetta quelle del
   service worker): la richiesta usciva davvero, non c'era rete, e tornava
   `net::ERR_ABORTED` → «Impossibile caricare Excel (serve connessione)».
   Il segno che inganna: jsPDF e Chart.js, caricati all'AVVIO, arrivavano
   benissimo — quindi «le rotte funzionano» era vero e falso allo stesso tempo,
   a seconda di quando si chiede. */
const pg = await b.newPage({ viewport: { width: 390, height: 1200 }, serviceWorkers: "block" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await montaFintoFirebase(pg);
/* il registratore al posto di jsPDF (la rotta va DOPO `montaFintoFirebase`:
   Playwright prova i gestori dal più recente) */
await pg.route("https://cdn.jsdelivr.net/npm/jspdf@**/jspdf.umd.min.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: REGISTRATORE }));
await pg.route("https://cdn.jsdelivr.net/npm/chart.js@**", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: FINTO_CHART }));
await pg.route("https://cdn.jsdelivr.net/npm/xlsx@**", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: FINTO_XLSX }));
await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript",
    body: MODULI["firebase-firestore.js"].replace(
      "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
      "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));

await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
let dentro = false;
for (let giro = 0; giro < 8 && !dentro; giro++) {
  await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
  await pg.waitForTimeout(800);
  dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
}
dice(dentro, "si entra davvero nell'app");
/* ⚠️ Questa riga dice solo che la SOSTITUZIONE è avvenuta nel file servito.
   Non dice che i casi siano arrivati nello stato dell'app — ed è esattamente
   la distinzione che il 07/08 è costata undici prove. Che siano arrivati lo
   provano due righe più sotto: la riga del turno riaperto nel foglio e la
   scheda della frammentazione che si apre. */
dice(Object.values(agganci).every((x) => x === 1),
  `i casi hanno agganciato il TESTO della pagina servita (${Object.entries(agganci).map(([k, v]) => k + " " + v).join(", ")})`,
  JSON.stringify(agganci));
dice(await pg.evaluate(() => !!(window.jspdf && window.jspdf.jsPDF)), "il registratore ha preso il posto di jsPDF");

/* ══ 1 · IL REPORT TECNICO, premendo il bottone della dashboard ══ */
await pg.evaluate(() => window.nav("dashboard"));
await pg.waitForTimeout(900);
const viste = await pg.$$eval("[id^=screen-]", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
dice(viste.includes("screen-dashboard"), `navigato alla dashboard (${viste.join(",") || "niente"})`, viste);

/* quello che la SCHERMATA dice, per poterlo confrontare col foglio.
   ⛔ E SI LEGGE IL RIQUADRO, NON LA PAGINA. Fino al 07/08 questa controprova
   cercava «2395» dentro l'`innerText` di tutta la dashboard e diceva ok: quel
   numero c'era, ma era la riga «DETTAGLIO PER OPERATORE · L.Rossi 2395.1 mc»
   — un totale per operatore che per pura coincidenza valeva quanto il totale
   generale di quando la dimostrazione aveva quattro rapportini. Il KPI, nello
   stesso istante, diceva 3466. Una controprova che pesca una sottostringa da
   un blocco di testo di seicento caratteri non confronta niente: risponde ok
   qualunque cosa succeda al numero che dovrebbe sorvegliare. */
await pg.evaluate(() => window.dashSetPeriodo("totale"));
await pg.waitForTimeout(600);
const kpi = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".kpi-card")].find((x) => /Totali/i.test(x.querySelector(".kpi-lbl")?.textContent || ""));
  const n = [...document.querySelectorAll(".kpi-card")].find((x) => /Rapportini perf/i.test(x.querySelector(".kpi-lbl")?.textContent || ""));
  return { val: c ? c.querySelector(".kpi-val")?.textContent.trim() : null,
           sub: c ? c.querySelector(".kpi-sub")?.textContent.trim() : null,
           righe: n ? n.querySelector(".kpi-val")?.textContent.trim() : null };
});
dice(kpi.val !== null && kpi.sub !== null && kpi.righe !== null,
  `⚠️ il riquadro dei totali della dashboard si legge (val "${kpi.val}", sub "${kpi.sub}", righe "${kpi.righe}")`, JSON.stringify(kpi));

/* ⚠️ DUE COSE COPRONO QUEL BOTTONE, e tutt'e due fanno morire il click per
   timeout invece di misurare qualcosa:
   · il toast dell'avvio («Accesso al database non consentito») resta davanti
     per due secondi e mezzo — si ASPETTA che sparisca, non si forza il click,
     perché un click forzato prova un gesto che l'utente non può fare;
   · la barra di navigazione è **fissa in fondo**, e `scrollIntoViewIfNeeded`
     di Playwright si accontenta di portare il bottone dentro la finestra:
     dentro la finestra ma sotto la barra. Si centra a mano. */
await pg.waitForFunction(() => !document.getElementById("toast")?.classList.contains("show"),
  { timeout: 15000 }).catch(() => {});
await pg.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => /Report tecnico/.test(x.textContent));
  if (b) b.scrollIntoView({ block: "center" });
});
await pg.waitForTimeout(300);
/* ⛔ E IL CLICK PUÒ NON ARRIVARE: è così che è saltata fuori la striscia
   invisibile del toast. Se non arriva NON si lascia morire il banco per
   timeout — si dichiara, perché «non sono riuscito a premere il bottone» è
   esattamente il difetto, non un intoppo del banco. */
let premuto = true;
try { await pg.click('button:has-text("Report tecnico completo")', { timeout: 8000 }); }
catch (e) { premuto = false; }
dice(premuto, "⛔ il bottone del Report tecnico si può PREMERE davvero (niente di invisibile davanti)",
  "il click non arriva mai al bottone: qualcosa lo copre");
if (premuto) {
  await pg.waitForTimeout(500);
  /* ⛔ LE DATE SI SVUOTANO, e non è pigrizia. Il confronto col riquadro della
     dashboard vale solo se i due numeri parlano dello STESSO insieme di
     righe: la dashboard sta su «TOTALE» (dal 2000 a oggi), quindi il foglio
     deve prendere tutto. Con un intervallo scritto a mano — «01/07 → 31/07»,
     com'era — i due insiemi coincidono finché la dimostrazione ha rapportini
     solo di luglio, e il giorno che ne nasce uno di agosto la prova cade
     accusando i totali di essere sbagliati mentre sono giusti tutt'e due.
     `inRange` risponde vero a tutto quando `da` e `a` sono vuoti. Che i due
     insiemi coincidano davvero non si dà per buono: si misura, confrontando
     il conto delle righe. */
  await pg.fill("#rt-da", "");
  await pg.fill("#rt-a", "");
  await pg.click('#modal .mbtn.primary');
  await pg.waitForTimeout(900);
}
const rt = await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
dice(!!rt && /Report_tecnico/.test(rt.nome), `il bottone ha prodotto un documento (${rt ? rt.nome : "nessuno"})`, rt && rt.nome);

const tabRp = rt && rt.tabelle[0] ? rt.tabelle[0] : { head: [], body: [], foot: [] };
const tabRf = rt && rt.tabelle[1] ? rt.tabelle[1] : { head: [], body: [], foot: [] };
const piatto = (t) => JSON.stringify(t.body);

// il turno del 21/07 è quello aperto e mai misurato
const r21 = tabRp.body.find((r) => /21\/07/.test(r[0]));
dice(!!r21, `la riga del turno mai misurato c'è (${tabRp.body.length} righe)`, piatto(tabRp));
dice(!!r21 && !/^0$/.test(r21[3]) && !/^0\.0$/.test(r21[4]) && !/^0\.0$/.test(r21[5]),
  "⛔ il turno aperto e mai misurato NON esce «0 · 0.0 · 0.0»", r21 && r21.join(" | "));
dice(!!r21 && /non misurato/.test(r21[3]), "e lo dice, invece di tacere", r21 && r21.join(" | "));

// il turno del 23/07: nove fori veri, maglia da confermare
const r23 = tabRp.body.find((r) => /23\/07/.test(r[0]));
dice(!!r23 && r23[3] === "9" && /^81/.test(r23[4]), "il turno misurato senza maglia tiene fori e metri, che sono misurati", r23 && r23.join(" | "));
dice(!!r23 && !/^0\.0$/.test(r23[5]), "⛔ ma i metri cubi NON sono «0.0»: la maglia non c'è, il volume non si calcola", r23 && r23.join(" | "));

// il turno sano resta un numero
const r14 = tabRp.body.find((r) => /14\/07/.test(r[0]));
dice(!!r14 && r14[3] === "14" && /1190\.7/.test(r14[5]), "il turno misurato per bene continua a dire il suo volume", r14 && r14.join(" | "));

/* ── I TOTALI ──────────────────────────────────────────────────────────────
   ⛔ E I NUMERI ATTESI NON SI SCRIVONO A MANO. Fino al 07/08 qui c'era
   `2395.1 / 317 / 34`: erano i totali giusti della dimostrazione **di quattro
   rapportini**, e il 06/08 la dimostrazione ne ha guadagnato un quinto
   (`rp_5`, 12 fori · 102 m · 1071 mc). Da quel commit le due righe accusavano
   il core di sommare i turni non misurati mentre il foglio, misurato nello
   stesso istante del riquadro della dashboard, diceva esattamente il suo
   stesso numero. Un banco che porta dentro di sé una copia dei dati invecchia
   ogni volta che i dati cambiano, e quando invecchia manda a cercare un
   guasto che non c'è.
   Le due domande, adesso, sono **derivate** e non hanno un numero dentro:
   1. il piede è d'accordo con quello che il foglio ha stampato **da sé** —
      cioè non somma le righe che ha appena dichiarato non misurabili;
   2. il piede è d'accordo con il riquadro della dashboard che ospita il
      bottone, che è la stessa domanda con cui questo banco è nato. */
const piede = JSON.stringify(tabRp.foot || []);
const num = (s) => { const v = parseFloat(String(s).replace(/\s/g, "")); return Number.isFinite(v) ? v : null; };
const sommaCol = (i) => tabRp.body.reduce((s, r) => s + (num(r[i]) ?? 0), 0);
const pf = (tabRp.foot && tabRp.foot[0]) || [];
/* il piede ha quattro celle: l'etichetta (che vale per tre colonne) e i tre numeri */
const pFori = num(pf[1]), pMetri = num(pf[2]), pMc = num(pf[3]);
const vicino = (a, b) => a !== null && Math.abs(a - b) < 0.05;
dice(pf.length === 4 && vicino(pMc, sommaCol(5)),
  `⛔ il foglio ha una riga di TOTALI, e il volume è la somma di quello che il foglio stesso ha stampato (${sommaCol(5).toFixed(1)})`, piede);
dice(vicino(pMetri, sommaCol(4)) && vicino(pFori, sommaCol(3)),
  `con metri e fori sommati con la stessa regola (${sommaCol(4).toFixed(1)} m, ${sommaCol(3)} fori)`, piede);
/* ⛔ E LA SOMMA INGENUA DEVE ESSERE DIVERSA, se no le due righe qui sopra non
   distinguono niente: è il turno riaperto (fori azzerati, volume rimasto) a
   renderle capaci di fallire. Se un giorno quel caso sparisse dai dati, questa
   riga lo direbbe invece di lasciare due prove che passano sempre. */
const r25 = tabRp.body.find((r) => /25\/07/.test(r[0]));
dice(!!r25 && /non misurato/.test(r25[3]) && r25[5] === "—",
  "⛔ il turno riaperto (fori azzerati, volume rimasto dal giro prima) non porta il suo volume nel foglio", r25 && r25.join(" | "));
const testi = (rt ? rt.testi : []).join(" · ");
dice(/senza nessun foro misurato/.test(testi) && /senza maglia/.test(testi),
  "⛔ e il foglio DICHIARA quanti turni sono rimasti fuori dal totale, con le due ragioni distinte", testi);

/* ── LA CONTROPROVA SULLO SCHERMO ──
   Prima: gli insiemi coincidono? Il foglio è senza date (tutto), la dashboard
   è su «TOTALE». Se i conti delle righe non combaciano, i numeri non sono
   confrontabili e va detto — invece di dare la colpa ai totali. */
const righeFoglio = ((rt ? rt.testi : []).find((t) => /^Rapportini perforazione/.test(t)) || "").match(/\((\d+)\)/);
dice(!!righeFoglio && righeFoglio[1] === kpi.righe,
  `⚠️ foglio e riquadro parlano dello stesso insieme di righe (foglio ${righeFoglio ? righeFoglio[1] : "?"}, riquadro ${kpi.righe})`,
  JSON.stringify({ foglio: righeFoglio && righeFoglio[1], riquadro: kpi.righe }));
/* il riquadro arrotonda all'intero (`toFixed(0)`), il piede tiene un decimale */
const kMc = num(kpi.val), kFori = num((kpi.sub || "").match(/(\d+)\s*for/)?.[1]), kMetri = num((kpi.sub || "").match(/([\d.]+)\s*m\b/)?.[1]);
dice(pMc !== null && kMc !== null && Math.abs(Math.round(pMc) - kMc) < 1
     && kFori === pFori && kMetri !== null && Math.abs(Math.round(pMetri) - kMetri) < 1,
  `controprova sullo schermo: il riquadro che ospita il bottone dice gli stessi numeri (riquadro ${kMc} mc · ${kFori} fori · ${kMetri} m — foglio ${pMc} · ${pFori} · ${pMetri})`,
  JSON.stringify({ riquadro: kpi, piede: pf }));

// il fochino: i chili non scritti
const rf18 = tabRf.body.find((r) => /18\/07/.test(r[0]));
dice(!!rf18 && /non dichiarato/.test(rf18[3]), "la volata coi chili non scritti lo dice", rf18 && rf18.join(" | "));

// i guasti senza data
dice(/Compressore/.test(JSON.stringify(rt ? rt.tabelle : [])),
  "⛔ il guasto con la data cancellata È nel documento, invece di sparire", JSON.stringify(rt ? rt.tabelle.slice(2) : []));
dice(/senza data/.test(JSON.stringify(rt ? rt.tabelle : [])),
  "e la sua data manca dichiarandolo, non con un vuoto qualunque", JSON.stringify(rt ? rt.tabelle.slice(2) : []));

/* ══ 2 · IL PDF DELLA FRAMMENTAZIONE ══
   ⚠️ Nessun bottone della pagina apre questa scheda: misurato con
   `grep -n "apriFrammentazione" index.html` — una sola riga, la definizione,
   più l'elenco dei segnaposto. Si apre per la sola via che esiste, e la cosa
   sta scritta nel resoconto invece che nascosta. */
async function pdfFrammentazione(idVolata) {
  /* `apriEditorCava` è la via vera con cui una volata diventa «quella
     selezionata» (`state.volataSel`), ed è il bottone della scheda cava; da lì
     `apriFrammentazione` è l'unico modo che esiste di aprire questa scheda. */
  await pg.evaluate((id) => { window.apriEditorCava(id); window.apriFrammentazione(id); }, idVolata);
  await pg.waitForTimeout(400);
  /* ⛔ LA SCHEDA PUÒ NON APRIRSI, E ALLORA NON SI ASPETTA TRENTA SECONDI UN
     BOTTONE CHE NON C'È. Il 07/08 è successo — `apriFrammentazione` non
     trovava la volata (`toast('Volata non trovata')` e via) — e `page.click`
     è morto per timeout portandosi dietro **undici** prove che venivano dopo,
     tutte mai eseguite: le tre sulla volata mai valutata, quella sulla
     valutata per bene, le due sulla valutata a metà, le tre sulla striscia
     invisibile del toast e quella sugli errori di pagina. Un banco che crolla
     smette di guardare, e il riepilogo non lo dice: dichiara meno prove,
     non un buco. Adesso si guarda se la scheda è aperta e si torna indietro
     dicendolo, così le prove dopo girano lo stesso. */
  const aperta = await pg.evaluate(() => {
    const m = document.getElementById("modal");
    return !!m && m.classList.contains("show")
      && [...m.querySelectorAll(".mbtn")].some((b) => /PDF/.test(b.textContent));
  });
  if (!aperta) { schedeNonAperte.push(idVolata); return null; }
  const prima = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.click('#modal .mbtn:has-text("PDF")');
  await pg.waitForTimeout(700);
  const dopo = await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
  const n = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.evaluate(() => window.closeModal());
  await pg.waitForTimeout(200);
  return n > prima ? dopo : null;
}

const fr1 = await pdfFrammentazione("vz1");   // nessuno ha valutato niente
dice(schedeNonAperte.length === 0,
  `⛔ la scheda della frammentazione si APRE davvero: i casi sono arrivati nello stato, non solo nel file servito`,
  "apriFrammentazione non ha trovato: " + schedeNonAperte.join(", "));
dice(!!fr1, "il bottone PDF della frammentazione produce un documento", fr1 && fr1.nome);
const t1 = (fr1 ? fr1.testi : []).join(" · ");
const g1 = JSON.stringify(fr1 ? fr1.tabelle : []);
dice(!/ECCELLENTE/.test(t1), "⛔ una volata che nessuno ha valutato NON esce «ECCELLENTE»", t1);
dice(/non valutat/i.test(t1), "e il foglio dice che non è stata valutata", t1);
dice(!/"0 %"/.test(g1), "⛔ e le quattro classi non escono a «0 %»", g1);

const fr2 = await pdfFrammentazione("vz2");   // valutata per bene
const t2 = (fr2 ? fr2.testi : []).join(" · ");
dice(/6/.test(t2) && /ACCETTABILE/.test(t2),
  "la volata valutata per bene continua a dire il suo giudizio", t2);

const fr3 = await pdfFrammentazione("vz3");   // valutata a metà: 20 + 2 = 22%
const t3 = (fr3 ? fr3.testi : []).join(" · ");
const g3 = JSON.stringify(fr3 ? fr3.tabelle : []);
dice(/2%/.test(t3) || /2 %/.test(t3), "la valutazione a metà tiene i due valori che qualcuno ha scritto", t3);
dice(/incompleta|non attendibile|22/.test(t3 + g3),
  "⛔ ma dichiara che la distribuzione non fa 100: un oversize su un totale del 22% non è confrontabile", t3 + " | " + g3);

/* ══ 3 · LO SCHEMA DI VOLATA, e il numero più sorvegliato dell'app ══
   ⛔ «56 KG» SU UNA VOLATA CARICATA PER META'. Misurato il 07/08 premendo il
   bottone «⤓ PDF» dell'editor su `vol_2` della dimostrazione: sette fori su
   dodici portano i chili, `tot_kg` vale 56, e il foglio scriveva nel riquadro
   grande «56kg» e nei totali di pagina 3 «Carica: 56 kg», senza una parola.
   La prova che quel totale sia incompleto sta DENTRO lo stesso documento —
   pagina 3, colonna «Carica», cinque righe su dodici a «-» — quindi il foglio
   porta il proprio smentimento e dichiara comunque il numero come definitivo.
   La scheda della cava, nello stesso istante, la diceva giusta: passa da
   `volKg` → `misureVolataProgetto` e scrive «56 kg di esplosivo (7 fori su 12
   caricati)». Qui la copia debole era il DOCUMENTO — il verso opposto a quello
   del 03/08, sulla stessa coppia di funzioni.
   ⚠️ E LE DUE DOMANDE SONO SEPARATE. Il conto (56) può essere giusto mentre a
   mentire è il modo in cui viene dichiarato: si guarda il numero **e** si
   guarda che il foglio sia d'accordo con la propria tabella. */
const volateProvate = [], ripieghi = [];
const strisce = {};
async function pdfVolata(id) {
  await pg.evaluate((i) => window.apriEditorCava(i), id);
  await pg.waitForTimeout(500);
  /* ⛔ E LA STRISCIA SOPRA IL BOTTONE SI LEGGE PRIMA DI PREMERLO. È la domanda
     di questo banco applicata al centimetro: quello che lo schermo dice
     nell'istante in cui il dito tocca «⤓ PDF» e quello che il foglio scrive
     devono essere la stessa cosa. Fino al 07/08 la striscia diceva «0m · 0mc»
     su una volata non ancora quotata — e la stessa riga era scritta DUE volte
     nel core, a millesettecento righe di distanza. */
  strisce[id] = await pg.evaluate(() => (document.getElementById("ec-stats")?.textContent || "").replace(/\s+/g, " ").trim());
  const prima = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  /* il bottone vero della barra dell'editor, non la funzione */
  let premuto = true;
  try { await pg.click('.ec-tool:has-text("PDF")', { timeout: 6000 }); }
  catch (e) { premuto = false; ripieghi.push(id); }
  await pg.waitForTimeout(600);
  const n = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  volateProvate.push(id);
  if (!premuto || n === prima) return null;
  return await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
}
/* lo SCHERMO: la scheda della cava mostra le volate con `volKg`/`volMc` */
await pg.evaluate(() => window.apriCava("cava_2"));
await pg.waitForTimeout(600);
const schermoVol2 = await pg.evaluate(() => {
  /* ⚠️ solo i `.sitem` della scheda VISIBILE: le altre schermate restano nel
     DOM con `display:none`, e una ricerca a tappeto pescherebbe la riga di
     un'altra pagina credendola quella che si sta guardando. */
  const r = [...document.querySelectorAll("#screen-cava-det .sitem")]
    .filter((x) => x.getBoundingClientRect().height > 0)
    .find((x) => /Volata #1/.test(x.querySelector(".sname")?.textContent || ""));
  return r ? (r.querySelector(".ssub")?.textContent || "").trim() : "";
});
/* ⛔ QUESTA RIGA PORTAVA DENTRO DUE NUMERI E UNA PAROLA, e tutt'e tre sono
   invecchiati — corretto l'08/08, dopo tre KO per giro.
   Chiedeva `/56/` e `/su 12/`. Il «su 12» non c'è più perché la frase è
   cambiata **di proposito**: `f108ef0` («l'elenco delle volate era la quarta
   copia debole: "0 mc" dove nessuno aveva misurato») l'ha riscritta in
   «12 fori · almeno 56 kg · 1.240,3 mc», e la forma nuova sta scritta nel
   commento del core (`index.html:621`). Cioè il banco accusava il prodotto per
   una **correzione** del prodotto — e per giunta una correzione fatta in nome
   del principio del fondatore, che è l'ultima cosa che un banco dovrebbe
   ostacolare.
   ⚠️ E il `56` era peggio del «su 12»: un numero atteso scritto a mano
   invecchia col crescere della dimostrazione. Quattro righe più in basso
   questo stesso file fa già la cosa giusta — «i due numeri si prendono dai due
   posti e si confrontano, invece di scriverne uno» — e infatti `kgSchermo` lo
   ricava dalla frase. Qui si prova quindi il **significato**: che la riga dica
   quanti fori sono, e che quando il totale è parziale lo **dichiari** con
   «almeno» invece di spacciarlo per completo. I numeri li confronta il
   confronto, non questa riga. */
const foriSchermo = (schermoVol2.match(/(\d+)\s*fori\b/i) || [])[1];
dice(!!foriSchermo && /\balmeno\b/i.test(schermoVol2) && /[\d.,]+\s*kg/i.test(schermoVol2),
  `⚠️ lo SCHERMO dice quanti fori sono e dichiara la riserva con «almeno» ("${schermoVol2}")`, schermoVol2);

const pv2 = await pdfVolata("vol_2");
const t_v2 = (pv2 ? pv2.testi : []).join(" · ");
const tabFori2 = (pv2 && pv2.tabelle[0]) ? pv2.tabelle[0].body : [];
dice(!!pv2, `il bottone «PDF» dell'editor produce un documento (${pv2 ? pv2.nome : "nessuno"})`, pv2 && pv2.nome);
/* i due numeri si prendono dai due posti e si confrontano, invece di scriverne uno */
const kgSchermo = (schermoVol2.match(/([\d.,]+)\s*kg/i) || [])[1];
const kgFoglio = (t_v2.match(/([\d.,]+)kg/) || [])[1];
dice(!!kgSchermo && kgSchermo === kgFoglio,
  `⛔ il riquadro KG del foglio porta lo stesso numero della scheda a schermo (schermo ${kgSchermo}, foglio ${kgFoglio})`,
  JSON.stringify({ schermoVol2, t_v2: t_v2.slice(0, 300) }));
dice(/PARZIALE/.test(t_v2) && /non portano i chili/.test(t_v2),
  "⛔ e dichiara che il carico è a metà, invece di far passare il totale per definitivo", t_v2);
dice(/almeno 56 kg/.test(t_v2), "e i totali di pagina 3 dicono «almeno», la stessa parola del foglio del fochino", t_v2);
/* ⛔ LA PROVA DERIVATA: il foglio dev'essere d'accordo con la propria tabella.
   Non c'è nessun numero scritto a mano qui dentro — se domani la dimostrazione
   caricasse un foro in più, questa riga continuerebbe a dire il vero. */
const senzaCarica = tabFori2.filter((r) => r[6] === "-").length;
const dichiarati = Number((t_v2.match(/(\d+)\s+fori su (\d+) non portano/) || [])[1]);
dice(tabFori2.length > 0 && senzaCarica === dichiarati,
  `⛔ i fori che il foglio dichiara senza chili sono quelli che la sua tabella mostra senza chili (${dichiarati} dichiarati, ${senzaCarica} nella tabella su ${tabFori2.length} righe)`,
  JSON.stringify({ dichiarati, senzaCarica, righe: tabFori2.length }));

const pv3 = await pdfVolata("vol_3");
const t_v3 = (pv3 ? pv3.testi : []).join(" · ");
dice(/Nessun foro porta i chili/.test(t_v3),
  "⛔ una volata i cui chili non ha ancora scritto nessuno lo DICE, invece di un «-» muto", t_v3);

const pvN = await pdfVolata("vz9");
const t_vN = (pvN ? pvN.testi : []).join(" · ");
dice(!!pvN && !/"0m"/.test(JSON.stringify(pvN.testi)) && !/\b0m\b/.test(t_vN),
  "⛔ una volata disegnata e non ancora quotata NON stampa «0m» di metri", t_vN);
dice(/Nessun foro porta la profondit/.test(t_vN),
  "e dice perché: metri e volume non sono zero, non ci sono", t_vN);
dice(!!pvN && pvN.testi.some((x, i) => x === "Metri:" && pvN.testi[i + 1] === "-"),
  "⛔ e nei totali di pagina 3 i metri sono un trattino, non uno zero", t_vN);

/* ⚠️ E LA VOLATA SANA DEVE RESTARE UN NUMERO, se no il modo più facile di far
   passare le tre righe qui sopra sarebbe spegnere ogni valore. */
const pv1 = await pdfVolata("vol_1");
const t_v1 = (pv1 ? pv1.testi : []).join(" · ");
dice(/112kg/.test(t_v1) && /1323mc/.test(t_v1) && !/PARZIALE/.test(t_v1) && !/non portano i chili/.test(t_v1),
  "la volata caricata per intero continua a dire i suoi numeri, senza riserve", t_v1);
/* ── LO SCHERMO CHE OSPITA IL BOTTONE, CONFRONTATO COL FOGLIO ──
   Le due domande sono le stesse per tutt'e quattro le volate, e la risposta si
   ricava dai due testi: nessun numero scritto a mano qui dentro. */
dice(!/\b0m\b/.test(strisce.vz9 || "") && /—m/.test(strisce.vz9 || ""),
  `⛔ la striscia sopra il bottone NON dice «0m» sulla volata non quotata ("${strisce.vz9}")`, strisce.vz9);
dice(!/\b0mc\b/.test(strisce.vz9 || "") && /—mc/.test(strisce.vz9 || ""),
  "e nemmeno «0mc»: lo schermo e il foglio danno la stessa risposta", strisce.vz9);
dice(/≥56kg/.test(strisce.vol_2 || ""),
  `⛔ e sulla volata caricata a metà la striscia dichiara che il totale è un minimo ("${strisce.vol_2}")`, strisce.vol_2);
dice(/126m/.test(strisce.vol_1 || "") && /112kg/.test(strisce.vol_1 || "") && /1323mc/.test(strisce.vol_1 || "") && !/≥/.test(strisce.vol_1 || ""),
  "⚠️ e sulla volata sana continua a dire i suoi numeri, senza riserve", strisce.vol_1);
dice(volateProvate.length === 4 && ripieghi.length === 0,
  `⚠️ schemi di volata premuti col bottone vero: ${volateProvate.length} (${volateProvate.join(", ")})`,
  "il bottone non si è potuto premere su: " + ripieghi.join(", "));

/* ══ 4 · L'EXCEL MENSILE, che si smentiva di tre colonne ══
   ⛔ Misurato premendo «📊 Excel» su luglio: la riga del 23/07 usciva
   «Maglia: —», «Mc: (vuoto)» e in fondo al foglio la nota «1 senza maglia,
   quindi senza volume calcolabile» — e in mezzo, **«Burden 0» e
   «Spaziatura 0»**. Cioè il foglio dichiarava mancante proprio la maglia di cui
   scriveva le due misure, e chi ne fa la media in Excel somma due zeri che
   sembrano misure.
   ⛔ E IL SECONDO FOGLIO AVEVA LA CONVENZIONE DEL PRIMO CAPOVOLTA: «Riepilogo
   cave» partiva da `Mc:0` e sommava `mm.calcolabile?mm.mc:0`, quindi una cava i
   cui rapportini del mese non sanno dire il volume usciva «Mc 0,00» — lo zero
   tranquillo, due schede più in là dalla stessa cosa scritta vuota. */
async function excelDi(mese) {
  const prima = await pg.evaluate(() => (window.__xlsx?.salvati || []).length);
  await pg.evaluate(() => window.exportRapportiniXLSX());
  await pg.waitForTimeout(1500);           // il core va a prendere SheetJS dal CDN
  const apertaX = await pg.evaluate(() => !!document.getElementById("xlsx-mese"));
  if (!apertaX) return null;
  await pg.fill("#xlsx-mese", mese);
  await pg.click("#modal .mbtn.primary");
  await pg.waitForTimeout(800);
  const n = await pg.evaluate(() => (window.__xlsx?.salvati || []).length);
  if (n === prima) { await pg.evaluate(() => window.closeModal()); return null; }
  return await pg.evaluate(() => (window.__xlsx?.salvati || []).slice(-1)[0] || null);
}
const xLug = await excelDi("2026-07");
dice(!!xLug, `il bottone «Excel» produce una cartella di lavoro (${xLug ? xLug.nome : "nessuna"})`, xLug && xLug.nome);
const f1 = (xLug && xLug.fogli[0]) ? xLug.fogli[0].righe : [];
const f2 = (xLug && xLug.fogli[1]) ? xLug.fogli[1].righe : [];
const col = (nome) => (f1[0] || []).indexOf(nome);
const rigaLug = (gg) => f1.find((r) => String(r[0]) === gg) || [];
const r23x = rigaLug("23/07/2026"), r14x = rigaLug("14/07/2026");
dice(r23x.length > 0 && r23x[col("Burden (m)")] === "" && r23x[col("Spaziatura (m)")] === "",
  `⛔ la riga senza maglia lascia VUOTE le due celle della maglia, invece di scriverci due zeri (burden ${JSON.stringify(r23x[col("Burden (m)")])}, spaziatura ${JSON.stringify(r23x[col("Spaziatura (m)")])})`,
  JSON.stringify(r23x));
dice(r23x.length > 0 && r23x[col("Maglia")] === "—" && r23x[col("Mc")] === "",
  "e nella stessa riga la maglia è «—» e il volume è vuoto: il foglio non si smentisce più di tre colonne",
  JSON.stringify(r23x));
dice(r14x.length > 0 && r14x[col("Burden (m)")] === 3 && r14x[col("Spaziatura (m)")] === 3.5,
  "⚠️ e la riga sana tiene i suoi 3 × 3,5: non si è spento tutto", JSON.stringify(r14x));
/* il piede del primo foglio è la somma di quello che il foglio stesso ha
   stampato — derivata, come quella del Report tecnico */
const totRiga = f1.find((r) => r.includes("TOTALI")) || [];
const sommaMcF1 = f1.slice(1).filter((r) => r !== totRiga && typeof r[col("Mc")] === "number").reduce((s, r) => s + r[col("Mc")], 0);
dice(totRiga.length > 0 && Math.abs(totRiga[col("Mc")] - sommaMcF1) < 0.05,
  `la riga TOTALI è la somma delle celle che il foglio ha davvero scritto (${sommaMcF1.toFixed(1)})`, JSON.stringify(totRiga));

const xGiu = await excelDi("2026-06");
const g2 = (xGiu && xGiu.fogli[1]) ? xGiu.fogli[1].righe : [];
const colG = (nome) => (g2[0] || []).indexOf(nome);
const gSerra = g2.find((r) => /Monte Serra/.test(String(r[0]))) || [];
const gSecca = g2.find((r) => /Valle Secca/.test(String(r[0]))) || [];
dice(gSerra.length > 0 && gSerra[colG("Mc")] === "" && gSerra[colG("Metri")] === "",
  `⛔ nel «Riepilogo cave» la cava senza nessun volume misurabile ha la cella VUOTA, come nel primo foglio (mc ${JSON.stringify(gSerra[colG("Mc")])})`,
  JSON.stringify(gSerra));
dice(gSerra.length > 0 && gSerra[colG("Senza misura")] === 1,
  "e lo dichiara nella colonna che serve a quello", JSON.stringify(gSerra));
dice(gSecca.length > 0 && typeof gSecca[colG("Mc")] === "number" && gSecca[colG("Mc")] > 0,
  "⚠️ e la cava che il volume lo sa dire lo scrive: le due colonne distinguono ancora", JSON.stringify(gSecca));
dice(!!xLug && !!xGiu && xLug.nome !== xGiu.nome,
  `⚠️ due mesi, due file (${xLug && xLug.nome} · ${xGiu && xGiu.nome})`, JSON.stringify([xLug && xLug.nome, xGiu && xGiu.nome]));

/* ══ 5 · I NOMI DEI FILE, che si sovrascrivevano da soli ══
   ⛔ Misurato il 07/08 salvando due volte di fila: un modulo da 5 fori su 2
   file e uno da 30 su 1 uscivano tutt'e due «Modulo_rapportino_perforazione
   .pdf»; due turni della stessa cava nello stesso giorno — mattina e
   pomeriggio, che in cava è la normalità — uscivano tutt'e due
   «Rapportino_Cava_Valle_Secca_2026-06-10.pdf». Chi ne scarica due si tiene
   solo il secondo, e il nome non gli dice quale sia rimasto. */
const ultimoPdf = () => pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
async function nomeModulo(tipo, fori, file) {
  await pg.evaluate(() => window.rapportinoVuoto());
  await pg.waitForTimeout(350);
  await pg.selectOption("#rv-tipo", tipo);
  await pg.fill("#rv-fori", String(fori)); await pg.fill("#rv-file", String(file));
  await pg.click("#modal .mbtn.primary");
  await pg.waitForTimeout(500);
  const d = await ultimoPdf();
  return d ? d.nome : null;
}
const modA = await nomeModulo("perf", 5, 2), modB = await nomeModulo("perf", 30, 1);
dice(!!modA && !!modB && modA !== modB,
  `⛔ due moduli vuoti diversi, due nomi di file diversi (${modA} · ${modB})`, JSON.stringify([modA, modB]));
dice(!!modA && /perforazione/.test(modA) && /5/.test(modA),
  "e il nome resta leggibile: dice il tipo e quello che l'utente ha scelto", modA);

async function nomeRapportino(id) {
  await pg.evaluate((i) => window.apriRapport(i), id);
  await pg.waitForTimeout(400);
  await pg.click('#modal .mbtn:has-text("PDF")');
  await pg.waitForTimeout(500);
  const d = await ultimoPdf();
  return d ? d.nome : null;
}
const nrA = await nomeRapportino("rg2"), nrB = await nomeRapportino("rg3");
dice(!!nrA && !!nrB && nrA !== nrB,
  `⛔ due turni della stessa cava nello stesso giorno, due nomi di file diversi (${nrA} · ${nrB})`, JSON.stringify([nrA, nrB]));
dice(!!nrA && /Valle_Secca/.test(nrA) && /2026-06-10/.test(nrA),
  "e il nome porta ancora la cava e il giorno, che è quello che si cerca in una cartella", nrA);

/* ══ 6 · LA RICONCILIAZIONE DI UN PROGETTO NON ANCORA QUOTATO ══
   ⛔ La colonna «Progetto» aveva lo stesso difetto della colonna «Perforato»,
   dall'altra parte: `v.tot_metri||0` scriveva «0,0 PROGETTO» accanto a un
   perforato vero, cioè uno sforamento totale, dove la verità è che il progetto
   non è ancora stato quotato. E la colonna della differenza rispondeva già
   «non calcolabile»: la riga si contraddiceva da sola.
   ⚠️ Qui erano deboli tutt'e due le metà — schermo e documento — quindi il
   confronto è che DICANO LA STESSA COSA e che nessuna delle due dica «0,0». */
await pg.evaluate(() => { window.apriEditorCava("vz9"); window.apriRiconciliazione("vz9"); });
await pg.waitForTimeout(700);
const ricSchermo = await pg.evaluate(() => (document.getElementById("modal-body")?.innerText || "").replace(/\s+/g, " "));
const ricAperta = /PROGETTO/.test(ricSchermo);
let ricPdf = null;
if (ricAperta) {
  const prima = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.click('#modal .mbtn:has-text("Esporta PDF")');
  await pg.waitForTimeout(700);
  const n = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  if (n > prima) ricPdf = await ultimoPdf();
}
dice(ricAperta, "⚠️ la riconciliazione si apre davvero sul progetto non quotato", ricSchermo.slice(0, 200));
const ricTab = (ricPdf && ricPdf.tabelle[0]) ? ricPdf.tabelle[0].body : [];
const ricMetri = ricTab.find((r) => /Metri/.test(r[0])) || [];
const ricMc = ricTab.find((r) => /Mc/.test(r[0])) || [];
dice(ricMetri.length > 0 && /non quotato/.test(ricMetri[1]) && /non quotato/.test(ricMc[1]),
  `⛔ la colonna PROGETTO dice «non quotato», non «0,0» (metri ${JSON.stringify(ricMetri[1])}, mc ${JSON.stringify(ricMc[1])})`,
  JSON.stringify(ricTab));
dice(ricAperta && !/0\.0 PROGETTO/.test(ricSchermo) && /— PROGETTO/.test(ricSchermo),
  "e lo schermo, nello stesso istante, dice la stessa cosa a modo suo («—»)", ricSchermo.slice(0, 400));
dice(ricMetri.length > 0 && /non calcolabile/.test(ricMetri[3]),
  "e la differenza resta non calcolabile: la riga non si contraddice più", JSON.stringify(ricMetri));

/* ══ 7 · IL TOCCO ARRIVA DAVVERO AL BOTTONE? ══
   ⛔ Trovato mentre si cercava di premere il bottone del Report tecnico, e non
   leggendo il codice: `.toast` non si nasconde mai. Resta `position:fixed` a
   80 px dal fondo con `opacity:0` ma `visibility:visible` e — questo era il
   punto — `pointer-events:auto`, largo fino al 90% dello schermo. Dal primo
   messaggio in poi una striscia invisibile di circa 351×57 px sta per sempre
   davanti alla pagina, proprio dove cade il pollice. Censimento su otto
   sezioni: **6 comandi su 137**, fra cui DUE dei bottoni di esportazione.
   ⚠️ La domanda è di un piano più sotto di quella di `promesse-tocco.mjs`:
   là si chiede «questa riga, che mostra la manina, ha un aggancio?», qui
   «l'aggancio c'è, ma il tocco ci ARRIVA?». Un `onclick` sotto un velo
   invisibile risponde di sì alla prima domanda e di no alla seconda.
   ⚠️ E si guarda il RISULTATO del test di collisione del browser
   (`elementFromPoint`), che è la sua risposta a «di chi è questo punto»: non
   si confrontano rettangoli a mano. */
await pg.evaluate(() => window.nav("dashboard"));
await pg.waitForTimeout(3500);          // i toast di prima («PDF generato») sono svaniti da un pezzo
const testoToast = await pg.evaluate(() => (document.getElementById("toast")?.textContent || "").trim());
dice(testoToast.length > 0 && !(await pg.evaluate(() => document.getElementById("toast").classList.contains("show"))),
  `⚠️ prova che un toast c'è stato ed è svanito: senza, questa misura non guarda niente ("${testoToast.slice(0, 40)}")`, testoToast);
/* ⚠️ SI SCORRE, se no si misura una schermata su tre: la striscia è FISSA a
   80 px dal fondo, quindi che cosa ci finisca dentro dipende da dove si è
   scrollati — e i bottoni che ci cadevano (Report tecnico, Esporta PDF
   mensile) stanno in fondo alla loro pagina. Un controllo che guarda solo il
   primo schermo risponde «zero» e non ha guardato dove il difetto sta. */
const coperti = await pg.evaluate(async () => {
  const vis = (e) => { const c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden" && e.getBoundingClientRect().height > 0; };
  const fuori = new Set(), misurati = new Set();
  for (const sez of ["home", "cave", "volate", "dashboard", "ufficio", "macchine", "deposito"]) {
    try { window.nav(sez); } catch (e) { continue; }
    await new Promise((r) => setTimeout(r, 250));
    for (let y = 0; y < Math.max(1, document.body.scrollHeight); y += 120) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      for (const e of [...document.querySelectorAll("button,[onclick],a[href],.sitem,.item,input,select,textarea")].filter(vis)) {
        const b = e.getBoundingClientRect();
        if (b.bottom < 0 || b.top > innerHeight) continue;
        const k = sez + "|" + (e.id || "") + "|" + (e.textContent || "").trim().slice(0, 30);
        misurati.add(k);
        const s = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        if (s && s.id === "toast") fuori.add(k);
      }
    }
    window.scrollTo(0, 0);
  }
  return { n: misurati.size, fuori: [...fuori] };
});
dice(coperti.fuori.length === 0,
  `⛔ nessun comando finisce sotto la striscia invisibile del toast (${coperti.n} comandi misurati)`,
  coperti.fuori.join(" | "));
const stileToast = await pg.evaluate(() => getComputedStyle(document.getElementById("toast")).pointerEvents);
dice(stileToast === "none", `e il toast non prende i tocchi (pointer-events: ${stileToast})`, stileToast);

dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

if (CONTROPROVA) {
  const attesi = DIFETTI.filter((x) => x[0].includes("pointer-events") === CONTRO_TOCCO).length;
  console.log(`\n  difetti rimessi: ${colpiti.size} su ${attesi} (strato: ${CONTRO_TOCCO ? "il tocco che non arriva" : "i numeri dei documenti"})`);
  if (colpiti.size !== attesi) {
    console.log("  ⚠️  un difetto non ha trovato il suo testo: la controprova non prova quello che dice");
    ko++;
  }
}
console.log(`\nRisultato documenti che escono (core): ${ok} passate, ${ko} cadute`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));
