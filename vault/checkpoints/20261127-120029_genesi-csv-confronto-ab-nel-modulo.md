# Checkpoint — Genesi: anche il CSV del confronto A/B lo compone il modulo (fetta di B3)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («refactor(genesi): anche il CSV del
confronto A/B lo compone il modulo»). Stato dei precedenti: vedi
«Verifiche».

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `csvConfrontoAB(A, B)` — il corpo
  dell'`onclick` di `cmpExport`, 48 righe, identico — e `righeDiDatoCsv(csv)`
  (229 → 231 provate).
- `apps/genesi/genesi.html`: chiama il modulo; i due messaggi di conferma
  («Legge di sito esportata: N referti», «Confronto A/B esportato: N righe»)
  contano le righe del FILE uscito.
- `run-kpi` 3274 → 3275; `documenti-dimostrazione` 172 documenti, 30 di
  Genesi.
- `genesi-foro-per-foro.mjs`: due iniezioni riancorate dalla pagina al
  modulo.

## Trovato strada facendo
- ⛔ **Un difetto mio, due volte, e una delle due in un commit pushato.**
  Traslocando le righe dei due file ho lasciato nella pagina il messaggio di
  conferma che contava l'array d'origine. Nel confronto A/B `R` non esisteva
  più: il gestore moriva dopo il download (preso prima del commit da
  `nomi-liberi` e da due banchi). Nella legge di sito — commit `32a0b024`,
  ramo di sessione — `P` esiste come GLOBALE: nessun errore, il messaggio
  diceva «esportata: — referti», e nessun controllo leggeva quella frase.
  Corretti tutt'e due in questo commit; `genesi-numeri-tranquilli` ora legge
  il messaggio.
- La regola per le prossime fette: per OGNI `const X=` del corpo che si
  sposta, cercare `X` nel resto del gestore.
- ⛔ Il passo «contare PRIMA le iniezioni che citano quelle righe» l'avevo
  fatto cercando quattro righe e non le altre venti: due iniezioni di
  `genesi-foro-per-foro.mjs` sono sfuggite. `iniezioni-fresche` le ha dette
  subito («il file dichiarato non le contiene più»). La prossima volta il
  conto si fa sul CORPO che si sposta: ogni riga del corpo, cercata nei
  banchi.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4541. (Il
  primo giro, prima delle correzioni, era caduto su `nomi-liberi`: «R» usato
  fuori dallo scope.)
- Sull'albero vero, dopo le correzioni: `genesi-numeri-tranquilli` 40/40 —
  col controllo nuovo sul messaggio di conferma — e controprova (9 difetti
  su 9, 20 prove cadute; fra queste il controllo nuovo, che col difetto
  rimesso legge proprio «esportata: — referti»); `genesi-foglio-in-cava`
  55/55 e controprova (13 su 13); `genesi-foro-per-foro` 214/214 e
  controprova col rosso voluto; `genesi-documenti-che-escono` 101/101.
  (Prima delle correzioni foglio-in-cava e foro-per-foro cadevano su «la
  pagina non solleva errori: R is not defined».)
- `08d02801` (Genesi nel controllo dei documenti; contiene `baa549f9`, il
  bottone «MIC»): giro `node` 4539 e giro completo dei 56 banchi di Genesi
  su una copia del committato, 56 su 56 a uscita 0.
- ⚠️ `32a0b024` (legge di sito) NON ha un giro di conferma suo: è il commit
  col messaggio rotto, corretto da questo. Il giro sul committato parte dopo
  questo push e li copre tutti e due.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.777 prove senza rete (3275 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4541 su 47 comandi · condivisi 405 su 405 · `genesi-data.js` 231/231 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
Restano nella pagina due CSV di Genesi e il foglio intero.
1. **`genesi_piano_carico.csv`**: il testo lo compone già `pianoCsvGenesi`
   (fuori da Genesi: non si tocca); nella pagina restano le RIGHE
   (`righePiano`, in `btn-piano-csv`): portarle in una funzione pura
   `righePianoDiCarico(holes, progetto)` del modulo, identità sugli stessi
   fori, e mettere il file in `documenti-dimostrazione`. Prima: per OGNI
   riga del corpo che si sposta, `grep` nei banchi (non quattro righe a
   campione).
2. Poi la scheda volata (`btn-scheda-csv`): NON è un trasloco puro (legge
   `D2`, `computeKPI`, il costo) — va scomposta prima di scrivere codice:
   una funzione che riceve `k`, il progetto e i verdetti già calcolati.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti e decimali nei CSV: prima la prova con Excel), 37
(sul telefono: trascinare un foro subito o dopo averlo scelto); 32
rimandata.
