# Checkpoint — 2026-08-07 22:4x UTC

## Tipo
unit-complete (il CSV della denuncia di Terra) + raccolta di tre cantieri di ricerca

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`97eb66c` — *Il CSV della denuncia di Terra taceva «non dichiarato» — e mentiva in tre righe*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 206 | **il CSV della denuncia** (`97eb66c`) | **3 righe** corrette; residuo dichiarato **1.098.600** dove è un massimo |

## ⛔ Il difetto, nel documento che va all'ente
Il foglio **stampato** la cosa giusta la faceva già («non dichiarato», e «il
cumulato è da intendersi come valore minimo»); il **CSV**, 107 righe più giù
nella stessa funzione, no — `pregressoDichiarato` compariva **zero** volte nel
suo blocco. E non era una riga: erano **tre**, tutte verso il tranquillo —
`pregresso` a 0, il cumulato che è un **minimo** e il residuo che è un
**massimo**, scritti come fatti.
⚠️ La disciplina era già scritta **due volte nella stessa funzione** venti righe
sopra (`${b.misurabile ? b.scavo : ""}`, «qui si legge, non si rifà»): le
ultime righe erano rimaste indietro.

## ⛔ Misurato premendo il bottone, e il caso difeso non c'era
Il censimento statico su questa famiglia legge **zero**: si preme e si apre il
file. E la dimostrazione il pregresso lo **dichiara**, quindi il difetto non si
vedeva — il caso è stato costruito togliendo la dichiarazione dalla **risposta
HTTP** del modulo dati, mai dal file. Il caso sano resta invariato alla cifra
(880000 / 981400 / 218600): è la prova che non ho spento i numeri.

## ⛔ Tre cantieri di ricerca raccolti (direttiva 3), e hanno reso
Tutti e tre hanno incollato comando e uscita per ogni affermazione, dichiarato
il denominatore e scartato da soli i casi già in `sonda-vuoto.mjs`. **Verificato
da me contro il codice solo il primo**, che è quello costruito. Gli altri
restano **proposti, non verificati** — e in quello stato vanno letti:
- **Terra**: (a) il CSV della denuncia → **fatto**; (b) `divarioRecupero` ha la
  bandiera per i m² e non per i m³ (`somma` usa `+x || 0`: un lotto senza volume
  vale 0); (c) `csvRilievi` scrive `0` per un volume `""`, e il messaggio dice
  «8 rilievi» mentre il lettore ne riporta 7.
- **Scudo**: (a) `parseInfortuniCsv` fa cadere una **gravità sconosciuta** su
  «lieve» — un evento *mortale* importato esce dal nostro CSV come *lieve*,
  mentre la riga sopra, sullo stesso oggetto, ricade di proposito sul caso più
  prudente; (b) `nominaAttiva`: una data di **fine illeggibile** tiene la nomina
  attiva per sempre (`giorniTra` → `NaN`, la guardia non scatta), e la regola
  giusta è due righe sopra; (c) la colonna «Consegnato il» del verbale DPI
  scrive «—» su una data assente.
- **Sentinella**: (a) una lettura registrata **a mano** taglia lo storico a
  **50** mentre `MAX_LETTURE` è **500** e il percorso import lo dichiara: 151
  letture **cancellate**, non scartate; (b) il **toast** di conferma usa la
  soglia **grezza** invece di `sogliaEfficace` — dice «Conforme» mentre la riga
  due centimetri sopra dice «Superamento»; (c) `(+mm.valore || 0)` porta
  «Conforme» nel file per l'ARPA con la cella del valore vuota (dormiente).

## Stato delle prove
Prove **2.300**, copertura **702/702**, banchi **153**, regole **68**, giro
`node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
⛔ Il giro completo (19:08 su `2ab9535`), a **212 sezioni**, con un'attesa armata.

## Prossimo passo atomico
1. ⛔ **Sentinella (b): il toast che dice «Conforme» mentre il badge dice
   «Superamento»** — è la più grave delle proposte non ancora verificate:
   contraddice lo schermo nell'istante in cui l'utente scrive il dato, ed è il
   sesto posto che il commento di `conSoglia` elenca e che manca. **Verificare
   contro il codice**, poi correggere e blindare.
2. ⛔ **Scudo (a): la gravità sconosciuta che diventa «lieve»** — esce nel CSV
   verso l'RSPP. Stessa procedura.
3. ⛔ **Raccogliere il giro** quando finisce, poi rilanciarlo sul commit
   corrente.
4. ⏱️ La prova permanente sul CSV della denuncia: `csv-dimostrazione.mjs` copre
   2 punti di export di Terra e **questo non è fra quelli**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
