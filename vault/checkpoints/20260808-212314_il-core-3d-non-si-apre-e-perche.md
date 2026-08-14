# Checkpoint — perché il CSV dei fori 3D del core non si può aprire con un banco

## Tipo
unit-complete (limite misurato e dichiarato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
Il core è l'unica superficie con **un difetto trovato** che resta ferma al
livello «letto». Prima di dichiararla una lacuna — o peggio di lasciarla
sottintesa — ho misurato **se un banco possa aprire quel file**.

**Non può, e la ragione è netta:**
- `index.html` importa `three` da `cdn.jsdelivr.net` (riga 9 della importmap);
- servito in locale, la richiesta **fallisce** (misurato: `cdn.jsdelivr.net/npm`
  e `www.gstatic.com/firebasejs` fra le richieste rifiutate) e `window.THREE`
  resta **`undefined`**;
- senza THREE `build3D` non parte, `_recon` resta `null`, e i marcatori — che
  nascono da un **raycast sulla mesh** — non possono esistere;
- quindi `reconExportHoles` si ferma sulla sua prima riga: *«Nessun foro segnato
  sul modello»*. Il bottone c'è (misurato), il file no.

⚠️ **E non è aggirabile senza cambiare il soggetto.** `_recon` è una variabile
di modulo, non su `window`: per popolarla dall'esterno bisognerebbe servire una
pagina **modificata**, e allora il banco misurerebbe una pagina che nessun
utente ha. Iniettare un difetto in una controprova è un conto; modificare la
pagina per renderla misurabile è un altro, e cambia ciò che si sta provando.

## Come quel difetto è difeso, allora
Non con un banco, ma con tre cose che coprono le due metà del problema:
1. **`foriDalModello` in `shared/`** con cinque prove `node` sul contratto —
   ordine, numerazione, cambio d'origine, il caso «nessun foro», il foro non
   collocabile;
2. **la regola 31 di `run-stile`**, che guarda la PAGINA: nessuna aritmetica
   d'origine ricalcolata a mano, la funzione **chiamata due volte** (i due
   consumatori) e **importata** da `dw-shell.js`;
3. la **controprova della regola 31 sul file vero**: rimesso il difetto in
   `index.html`, la regola diventa rossa; ripristino da copia verificato.

## Che cosa vale oltre questo file
È un **limite strutturale del parco banchi**, non un dettaglio di un CSV: tutto
ciò che nel core dipende dal 3D — la ricostruzione, i marcatori, l'immagine PNG
del fronte, e per estensione ogni funzione che nasce da una mesh — **è fuori
dalla portata dei banchi in questo ambiente**. Chi in futuro leggesse «il core
ha 2 documenti, nessuno aperto» deve poter trovare qui il perché, invece di
concludere che nessuno ci ha pensato.
⚠️ La via che lo cambierebbe, se un giorno servisse: mettere `three` **in
locale** invece che da CDN. È una decisione che tocca il caricamento del core e
il suo peso, quindi non si prende di slancio dentro un'unità di prova — sta
scritta qui come opzione, non come proposta.

## Stato del giro «chi decide i numeri di ciò che ESCE?»
51 punti d'uscita su 51 resi conto, **otto difetti veri** tutti corretti.
Profondità: **aperti col browser 21** (Flotta 9, Conti 12) · **letti riga per
riga 30**, dei quali **2 non apribili per costruzione** (i due del core che
dipendono dal 3D), adesso con la ragione scritta.

## Prossimo passo atomico
**Il giro del browser** (pid 21084, ~2h55): quando finisce, `leggi-giro.mjs`
dalla **sezione 0** — attesta un commit ormai di diciotto indietro, quindi i suoi
KO vanno letti come vecchi di diciotto commit. Poi le righe «**non ho
guardato**» (che in questa casa si leggono PRIMA dei KO), poi i KO col rosso
VOLUTO separato dai marcatori `⚠️ CONTROPROVA` / `FINE CONTROPROVA`.
La domanda da fargli: **quali controprove non sanno più fallire** sul codice di
oggi — l'ultimo giro ne mostrava dieci, ma tre sono state chiuse e quel registro
attestava un commit molto indietro.
E resta la **domanda di prodotto** aperta: una voce di costo senza importo
sparisce dal riepilogo e dal file in silenzio.

## Blocchi
Nessuno.
