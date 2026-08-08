# Checkpoint — 2026-08-08T19:35:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Flotta: due parole tranquille nei file che escono, e il primo banco che quei
file li apre davvero.**

Flotta ha **nove** punti d'uscita ed era l'app grossa senza nessun banco che ne
aprisse uno: `flotta-disegni` guarda i pixel, `flotta-frasi-da-uno` il
singolare, e i file non li apriva nessuno.

### 1 · «pianificata» dove lo schermo è rosso — REALE E RAGGIUNGIBILE
`flotta_situazione.csv` scriveva la parola `pianificata` **fissa nel modello di
riga**, per ogni ordine di lavoro. `statoOrdine` sa dire tre cose — «da fare»,
«in corso» e «attesa pezzi» — e l'ultima a schermo porta `cls: "danger"`, col
perché scritto nel modulo: *il lavoro è fermo perché manca un pezzo, è la
ragione più frequente di una macchina ferma a lungo*.
Cioè una macchina ferma ad aspettare un ricambio finiva nel foglio che si gira
al responsabile o all'officina come **«pianificata»**.
Verificato che il caso è raggiungibile prima di scrivere la riga: lo stato si
mette a mano dalla scheda dell'ordine (`data-odl-stato` → `salvaOrdine`).
La prova più bella è la riga della controprova, dove file e schermo si vedono
uno accanto all'altro: `{"file":"pianificata","schermo":["attesa pezzi"]}`.
(Stessa riga: le ore uscivano `6000` dove lo schermo raggruppa `6.000`.)

### 2 · «tutto a posto» senza aver guardato — VERO MA LATENTE
Il registro dei giri decideva l'esito dalle sole `voci`: un controllo che
dichiara `anomalie: 2` senza portarne l'elenco usciva `tutto a posto ; 0`
mentre lo schermo, sullo stesso record, scrive «2 da vedere».
⚠️ **Onestà sulla gravità, perché la misura l'ha ridimensionata**: quella forma
di record **oggi non è producibile**. L'unico punto che crea un controllo
scrive sempre `voci`, e `anomalie` esce dallo stesso elenco. È un difetto
latente — vive per i record vecchi, per un import, per una scrittura parziale.
Resta corretto perché *la versione giusta era già in questo stesso file 220
righe più in basso* (il CSV del libretto, che il caso lo distingue in tre rami
e nel commento racconta esattamente questo difetto): una correzione fatta a un
export e non all'altro è la firma della copia debole.
La regola ora sta in **`statoGiro`** (`flotta-data.js`) e la leggono in
quattro: il registro CSV, il libretto, i due aiuti dello schermo e
`giriDelGiorno`. Misurato su dieci casi prima di estrarla: **sei** disaccordi
fra le tre versioni della pagina — cinque di vocabolario («con anomalie» contro
«2 da vedere», tutt'e due veri), uno era la bugia.

### 3 · «nessun giro» non è «giro andato bene» — l'ha preteso `sonda-vuoto`
Alla prima stesura `statoGiro()` senza record rispondeva «tutto a posto» e
`gravita: "ok"`. Corretto, e **il confine l'ho sbagliato una volta**: avevo
scritto «se il record esiste, che sia stato salvato dimostra che qualcuno l'ha
fatto», quindi `{}` restava «tutto a posto». Ma quella è una deduzione sulla
**provenienza** del dato, non una cosa che il dato dica. Il confine giusto è la
**prova**: o c'è l'elenco delle voci, o c'è un numero di anomalie *dichiarato*
(anche zero, che è un'ottima notizia e va detta) — se no «da fare» con
`gravita: null`. «Dichiarato» lo decide `numeroDichiarato` di `shared/`, non
una copia locale.

## Le cose che questa unità ha insegnato

1. ⛔ **Un'iniezione di controprova che cita cinque righe di codice scade in
   un'ora.** La mia era nata la mattina citando il modello di riga; ho poi
   cambiato `s.voci` in `s.dettaglio` per non perdere la nota di chi fa il
   giro, e l'iniezione non ha più combaciato. **Non è successo niente di
   visibile**: la pagina servita è rimasta sana, la controprova ha girato su un
   prodotto sano, e il riepilogo ha stampato «✔ distingue» perché era caduto
   l'ALTRO difetto. L'ha presa solo il conto dei difetti rimessi (`[0]` invece
   di due) — che è esattamente la ragione per cui quel conto esiste.
   La cura non è aggiornare la citazione: è **un'ancora corta** (`const s =
   statoGiro(c);`, otto spazi per distinguerla dalla gemella del libretto) e il
   vecchio comportamento rimesso ombreggiando `s`. Il modello di riga può
   cambiare quanto vuole, l'iniezione arriva lo stesso.
2. ⚠️ **Il righello, non il soggetto — di nuovo, e al primo colpo.** Il banco
   ha accusato Flotta di esportare un registro dei giri **vuoto**. In Flotta i
   due file non escono nello stesso modo: la situazione è un `data:` URL, i
   giri un `blob:` (col BOM per Excel). Il mio lettore tagliava sempre alla
   prima virgola — che in un `blob:` non c'è — quindi `indexOf` dava -1 e il
   «file» misurato era l'URL stesso, una riga sola.
3. ⚠️ **`suite-collegate` non ha visto il banco nuovo perché non era ancora
   committato**: conta i soggetti con `git ls-files`, ed è scritto nel suo
   commento. Un banco appena creato è invisibile a quel controllo finché non
   entra nell'indice — cioè «passa» non vuol dire «è agganciato».
4. ⚠️ **Il caso pericoloso non c'era nella dimostrazione**: i due `controlli`
   d'esempio portano tutt'e due le `voci`. Ecco perché nessuno l'aveva visto —
   la stessa forma della barra alta che non c'era mai stata.

## Verifiche
- `node apps/deepwork-id/tests/giro-node.mjs` → **30 comandi a posto, 0 caduti**,
  rifatto su una **copia di ciò che si committa** (worktree + `diff --cached`,
  identità della patch verificata)
- banco nuovo `browser/flotta-documenti-che-escono.mjs`: **19 passati, 0
  falliti**; in controprova **6 KO voluti**, con i due difetti dichiarati
  rimessi davvero (`i 2 difetti sono stati rimessi davvero` ok)
- KPI 1916 → **1921**; copertura Flotta **85/85**, sei app **713/713**
- `sonda-vuoto` **15/15**, «5 tranquilli trovati, **5** dichiarati» — nessuna
  eccezione nuova aggiunta all'elenco
- `iniezioni-fresche` **176 sul bersaglio su 176**, 21 banchi (il banco nuovo è
  entrato da solo: l'elenco è derivato dal disco)
- documenti rimessi in pari: prove **2.366** (addendi 1921+318+71+32+9+8+7,
  sommati), giro completo **2.658** (addendi dei dodici = 292, sommati),
  copertura **713/713**, banchi del browser **155**

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla».
Giro della domanda *«chi decide i numeri di ciò che ESCE?»*, per app:
- **Campo 6/6**, **Sentinella 5/5**, **Terra 3/3** → delegano tutte (negativi
  misurati, col denominatore)
- **core 2/2** → un difetto vero, corretto
- **Flotta 2/9 aperti** → due difetti veri, corretti; **sette non misurati**
- **Conti 12**, **Scudo 5**, **Genesi 9** → cantieri di analisi in corso

## Prossimo passo atomico
**Flotta, gli altri due candidati del cantiere, verificati ma non ancora
corretti** (li ho riletti io, non sono parola d'agente):
1. riga **3787**, `flotta-registro-interventi.csv`: `(+w.costo) || 0` scrive
   uno **zero sommabile** su un intervento chiuso senza costo. Lo schermo
   (2182) la pastiglia dell'importo non la disegna affatto, e il libretto
   (3422) scrive «costo non scritto». **La versione giusta è a riga 4493 dello
   stesso file** — `(+w.costo > 0) ? +w.costo : null` — con sopra il commento
   che spiega perché: *chi apre il file in un foglio quello zero lo SOMMA
   credendolo misurato*. È il registro che si porta al commercialista.
2. righe **4689-4691**, `flotta-lista-della-spesa.csv`: il file perde due
   bandiere che il modulo produce e lo schermo scrive in rosso — `senzaData`
   (gli interventi con ricambi fuori dal conto, quindi magazzino più magro del
   vero) e `affidabile` (`episodi >= 2`: «un solo consumo registrato è un
   ordine di grandezza, non una media»). È il file che si manda al fornitore.
Tutt'e due si aggiungono al banco appena scritto, che così sale da 2 a 4 punti
d'uscita su 9.

## Blocchi
Nessuno.

## Note
⚠️ **Due server orfani** vivi da oltre due ore (porte 8962 e 8941), uno dei
quali serve **la cartella viva** del repository. La guardia
`togliServerOrfano` non li vede: uccide solo quelli la cui cartella è stata
*cancellata*. Un giro futuro che trovasse quella porta occupata e la riusasse
misurerebbe l'albero vivo invece della propria copia immobile. Dichiarato, non
corretto — unità a sé.

Il giro del browser (pid 21084) cammina di fianco su `giro-copia-21084` e
prende l'impronta della copia: le modifiche di qui non lo invalidano.
