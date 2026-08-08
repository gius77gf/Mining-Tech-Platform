# Checkpoint — 2026-08-08T19:51:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Flotta, gli altri due documenti: lo zero sommabile e le due incertezze che
nessuno leggeva.** Il banco dei documenti passa da **2** a **4** punti d'uscita
su nove.

### 3 · `flotta-registro-interventi.csv` — lo zero sommabile
La cella dell'importo era `(+w.costo) || 0`: un intervento chiuso senza
scrivere quanto è costato usciva con uno **0**, e chi apre il file in un foglio
quello zero lo **somma** credendolo misurato. È l'export più grande dell'app,
quello che si porta al commercialista.
Lo schermo (2182) la pastiglia dell'importo non la disegna affatto; il libretto
(3423) scrive «costo non scritto». **E la ragione era già scritta in questo
stesso file**, a riga 4505, sopra la versione corretta: *chi apre il file in un
foglio quello zero lo SOMMA credendolo misurato*. Un'altra correzione fatta a
un export e non all'altro.
⚠️ **La correzione non è `> 0` ma `numeroDichiarato`**, ed è la parte che vale:
uno **zero scritto** è un dato — una riparazione in garanzia costa davvero zero
— e va tenuto distinto dal campo mai compilato. Il libretto, che è testo per un
umano, sceglie `> 0`; una **colonna di dati** no.
⚠️ E la convenzione giusta era già nelle **tre celle immediatamente sotto**
(`== null ? ""`): la riga sbagliata era una sola, in mezzo a quelle giuste.

### 4 · `flotta-lista-della-spesa.csv` — due bandiere dichiarate e mai lette
Regola 20 applicata a un export: il modulo si accorge di non poter misurare
bene, lo dice con una bandiera, e se quella bandiera non la legge nessuno il
numero tranquillo si stampa lo stesso.
- **`r.affidabile`** (`episodi >= 2`): a schermo «un solo consumo registrato: è
  un ordine di grandezza, non una media», e alla riga 3054 quella bandiera
  decide perfino se **proporre** una soglia più bassa. Nel file il consumo
  usciva come un numero fermo, e chi lo riceve ordina una quantità calcolata su
  un episodio solo credendola una media. Ora c'è la colonna **`episodi`**: il
  dato invece del giudizio, così chi legge il foglio si fa la sua idea.
- **`p.senzaData`**: gli interventi con ricambi il cui giorno non si legge
  restano **fuori** dal consumo, quindi la proposta è calcolata su meno di
  tutto — e l'errore va nella direzione che tranquillizza, un magazzino più
  magro del vero. Ora è una riga di avvertenza in fondo al file (non una
  colonna, che si ripeterebbe uguale su ogni riga), con una sola cella piena
  perché un foglio di calcolo la legga come testo e non come un dato da
  sommare.

### E `numeroDichiarato` si RI-ESPORTA, non si riscrive
La pagina non poteva vederla (è importata dentro `flotta-data.js`, che non la
esportava). Riscriverla nella pagina sarebbe stata la copia debole che questa
casa ha già pagato quattro volte: `flotta-data.js` la ri-esporta con lo stesso
idioma già usato per `VOCI_COSTO`, così `nomi-doppi` vede lo **stesso oggetto**
invece di due gemelli destinati a divergere.

## La cosa imparata
⛔ **Una prova che nessuna iniezione può far cadere non dimostra niente, anche
quando il riepilogo intorno a lei è rosso.** Aggiunte le due asserzioni
sull'avvertenza `senzaData`, la controprova le lasciava **verdi**: la quarta
iniezione toglieva la *colonna* `episodi`, non la *coda* del file. Il banco nel
complesso diceva «✔ distingue» — perché cadevano le altre dieci — e quelle due
sarebbero rimaste decorative. Serve un'iniezione **per bandiera**, non una per
documento. Adesso sono cinque, e ogni asserzione del banco sa cadere.

## Verifiche
- banco: **31 passati, 0 falliti** su 4 documenti; in controprova **12 KO
  voluti** con «i **5** difetti sono stati rimessi davvero»
- `node giro-node.mjs` → **30 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)
- `iniezioni-fresche` **179 sul bersaglio su 179** (erano 176: le tre nuove
  sono entrate da sole, l'elenco è derivato dal disco)
- `nomi-doppi` 37 nomi, 23 alias, 0 da sistemare — la ri-esportazione è vista
  come alias e non come doppione
- nessun numero di documento è cambiato: non sono state aggiunte prove `node`

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla».
Domanda *«chi decide i numeri di ciò che ESCE?»*:
- **Campo 6/6**, **Sentinella 5/5**, **Terra 3/3** → tutte delegano (negativi
  misurati, col denominatore)
- **core 2/2** → un difetto vero, corretto
- **Flotta 4/9 aperti** → **quattro** difetti veri, tutti corretti e blindati;
  **cinque** documenti non misurati (scadenze di legge, costi, ricambi,
  libretto, fermi macchina)
- **Conti 12**, **Scudo 5**, **Genesi 9** → cantieri di analisi in corso

## Prossimo passo atomico
**Chiudere Flotta portando il banco da 4 a 9**, nell'ordine in cui i file
pesano per chi li riceve: `flotta-costi.csv` e `flotta-scadenze-di-legge.csv`
(il cantiere li ha letti e dichiarati **puliti**, con la riga citata: vanno
confermati aprendo il file, ed è un negativo che va misurato, non dedotto),
poi `libretto-*.csv`, `flotta_ricambi.csv` e `flotta-fermi-macchina.csv`.
Attenzione a due cose già misurate su questo banco:
1. i file di Flotta **non escono tutti allo stesso modo** — situazione e
   registro sono `data:` URL, giri, lista della spesa e ricambi sono `blob:`
   col BOM. Il lettore del banco li distingue già, ma un banco nuovo no;
2. i bottoni non stanno dove il nome della schermata farebbe pensare:
   `btn-int-csv` e `btn-sco-csv` sono tutt'e due in **page-man**, non in
   page-cos e page-mez. Si controlla col numero di riga del bottone contro
   quelli dei `<div class="page" id="page-…">`.

## Blocchi
Nessuno.

## Note
⚠️ Restano i **due server orfani** (porte 8962 e 8941), uno dei quali serve la
cartella viva: dichiarato nel checkpoint precedente, non ancora corretto.
Il giro del browser (pid 21084) cammina ancora di fianco sulla sua copia.
