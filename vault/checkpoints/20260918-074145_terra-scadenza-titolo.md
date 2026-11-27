# Checkpoint — 2026-09-18T07:41:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8f7458ff — fix(terra): la scadenza assente del titolo non era mai marcata mancante

## Cosa è stato completato
Dal secondo giro di deep-pass su Terra (agente abccb861702fa2d4a),
un difetto vero verificato dal vivo con Playwright (dato iniettato
nella risposta HTTP, mai sul file):

`fogliaRelazione` (`apps/terra/index.html`) — la relazione di fine
lavori del lotto — compone la sezione "Titolo autorizzativo di
riferimento" **direttamente nella pagina** (non nel modulo, a
differenza della funzione gemella `verbaleRilievo`). Il terzo campo
della riga "Scadenza del titolo" era **cablato a `false`**: qualunque
valore avesse `aut.dataScadenza` (assente, `null`, illeggibile), la
cella non veniva mai marcata mancante — mentre la frase due righe sotto
dichiara esplicitamente "la relazione non li stima e non li sostituisce
con uno zero". Le altre due righe della stessa sezione (numero
dell'atto, ente) calcolavano correttamente il campo "manca" dal valore
vero; solo la scadenza no.

Corretto: la cella usa ora `dataISOEsiste`/`dataIt` (già importati
nella pagina), esattamente come fa `verbaleRilievo` nel modulo, e il
caso mancante viene aggiunto a mano a `R.nonMisurati` (perché
`relazioneLotto` non riceve l'autorizzazione come parametro e non può
saperlo da sé — non si è cambiata la sua firma, fix scoped alla pagina).

## Verifica
- `terra-relazione-lotto.mjs` esteso: un nuovo CASO (data di scadenza
  assente, iniettato nella risposta HTTP del modulo, applicato sia in
  normale sia in controprova) e due voci dedicate in `DIFETTI_PAGINA`
  (una per metà del fix: la cella/classe `manca`, e la voce in
  `nonMisurati`).
- Normale: **50/50**. Controprova: **10 KO su 50** (entrambi i difetti
  rimessi, catturati indipendentemente).
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Nessun numero nei documenti da correggere (nessun nuovo banco, nessuna
  nuova suite in run-kpi.mjs per questa unità — l'unico file toccato
  oltre index.html è il banco esteso). `numeri-nei-documenti.mjs`:
  43 passati, 0 falliti, confermato PRIMA del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Terra chiusa.

## Prossimo passo atomico
Chiudere l'unità **Conti** (sesto giro di deep-pass, agente
a8e5ab52b4f891993) — tre difetti veri, stessa famiglia del quinto giro
(guardia `statoSdi(f, oggi).nonEmessa` mancante in altri consumatori),
**già implementati sul disco, non ancora committati**:

1. `apps/conti/conti-data.js` — `incassoAtteso` e `incassoPerMese`
   guadagnano la stessa guardia già presente in
   `kpiFrom`/`agingIncassi`/`fattureOltre90`/`esposizioneClienti`.
2. `apps/conti/index.html` — la copia debole del calcolo dell'aging nel
   Quadro (`const aperte = FAT.filter(f => !f.incassata)`, mai passata
   da `statoSdi`) ora esclude `nonEmessa`, propagando la correzione a
   `scadute`/`scadutoTot` e ai badge che li riusano (erano la stessa
   variabile). Stessa guardia aggiunta a `fatMatch` per i filtri
   "aperte"/"insolute" delle Fatture.
3. **Verificato dal vivo** con uno script Playwright ad-hoc (server
   statico + iniezione via risposta HTTP): KPI "Scaduto" ora mostra
   € 30k/3 fatture (prima 36k/4, includeva la scartata); il filtro
   "Insolute" ora elenca 3 fatture, non più la scartata "Calcestruzzi
   RG" — coerente con l'Aging del Report. **Nota di metodo**: la prima
   verifica dava un falso negativo per un mio errore di selettore
   Playwright (`[data-filtro="insolute"]` non è unico nella pagina —
   esiste sia sul KPI del Quadro sia sul bottone del filtro — e il
   `.click()` ambiguo falliva silenziosamente dentro un `.catch(()=>{})`).
   Corretto restringendo a `#fat-filtri [data-filtro="insolute"]`, poi
   riverificato con successo. Lezione: un `.catch(()=>{})` su un click
   ambiguo nasconde esattamente il tipo di errore che si sta cercando
   di misurare — variante nuova della famiglia "il controllo che non
   guarda dove crede".
4. Nuovo test in `apps/deepwork-id/tests/run-kpi.mjs` (dopo il test del
   quinto giro, prima di "csvRilievi: i numeri escono col PUNTO"):
   copre `incassoAtteso`/`incassoPerMese` con fixture emessa+scartata
   sullo stesso cliente, più un controllo statico sul sorgente di
   `index.html` per le due guardie di pagina. **Verificato: 3135
   passati, 0 falliti** (KPI 3134→3135, +1).
5. Nessun nuovo banco browser dedicato per il fix di pagina (Quadro/
   Fatture) — coperto dal test statico sul sorgente (stesso pattern già
   in uso nel test del quinto giro, righe vicine) più la verifica dal
   vivo appena descritta, non ripetuta in una suite per limiti di tempo
   in questa unità.

Passi per chiudere:
1. `git worktree add -q --detach /tmp/wt-conti HEAD` (HEAD ora è
   8f7458ff)
2. Copiare `apps/conti/conti-data.js`, `apps/conti/index.html`,
   il blocco Conti-only isolato di `run-kpi.mjs` (isolabile via diff:
   nessun'altra unità pendente tocca run-kpi.mjs adesso)
3. Costruire il delta doc: KPI 3134→3135, 9-suite sum 3.628→3.629
   (verificare con Python contro la copia pulita, MAI a mano — sono già
   successi due arrotondamenti sbagliati in questa sessione)
4. Lanciare `giro-node.mjs` in background, wait-loop sul PID
5. Correggere l'eventuale mismatch sulle asserzioni totali leggendo
   l'uscita VERA (è già successo 3 volte in questa sessione: Flotta,
   Campo, Genesi — sempre +1 rispetto al placeholder scritto a mano)
6. `numeri-nei-documenti.mjs` verde prima di committare
7. Commit -F, push, checkpoint, push checkpoint
8. Poi: continuare "mai fermarsi" — dispatchare nuovi cantieri paralleli
   (≥3, regola del 26/07) e raccogliere eventuali report ancora in
   sospeso, sempre verificando ogni "difetto" contro il codice ATTUALE
   prima di agire.

## Blocchi
Nessuno.
