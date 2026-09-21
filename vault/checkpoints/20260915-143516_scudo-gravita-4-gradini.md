# Checkpoint — 2026-09-15T14:35:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
674f8dfe

## Cosa è stato completato
Diciottesima unità del ciclo odierno: Scudo Finding 2 dell'ottavo giro di
ricerca (secondo passaggio, infortuni/INAIL) — il terzo e quarto gradino di
gravità per un infortunio vero (permanente/mortale), chiuso insieme al
rischio latente UNI 7249 che la stessa ricerca aveva segnalato.

Aggiunta `GRAVITA_INFORTUNIO` (vocabolario chiuso a 4 gradini, stessa forma
di `GRAVITA_POTENZIALE` ma esplicitamente un vocabolario DIVERSO: un danno
avvenuto non è un danno evitato), `gravitaInfortunioDi`, `infortunioGrave`
("grave o peggio" per gli aggregati) e `giornateConvenzionali` (UNI 7249:
75 giorni convenzionali per una permanente, 7500 per un mortale — sostituisce
i giorni di assenza reali, che per un esito mortale non hanno senso e per
una permanente possono restare `null` a prognosi ancora aperta).

`indiciInfortunistici` usa ora `giornateConvenzionali` sia per l'indice di
gravità sia per il conteggio "con assenza" del LTIFR: prima del fix una
fatalità sarebbe uscita dal LTIFR, l'indice costruito apposta per contarla.
Collegati tre punti che confrontavano `.gravita === "grave"` per lettera
(`riepilogoInfortuni`, `cicloDss` ×2), il fascicolo per l'ispettore
(etichetta dal vocabolario invece di capitalizzazione a mano), e l'importatore
CSV (`parseInfortuniCsv` leggeva un elenco scritto a mano `["grave","lieve"]`
— la stessa svista un livello più su di quella che il suo commento già
metteva in guardia). index.html: `#inf-gravita` ricostruisce le opzioni da
`GRAVITA_INFORTUNIO` (derivato) e si restringe a lieve/grave per un near-miss.

Demo: i9 passa da "grave" a "permanente" (doppio uso, coerente col giudizio
d'idoneità di d2). Il quarto gradino (mortale) resta fuori dalla demo per
scelta dichiarata — non un buco: copertura del ramo affidata ai test sintetici.

Test: 6 nuovi blocchi in run-kpi.mjs, con due controprove verificate (il
controllo del `tipo` mancante in `infortunioGrave`, trovato dalla mia stessa
prima stesura del test; la sostituzione UNI 7249 tolta e confermata la
caduta). Corretto anche un test preesistente che asseriva il vecchio
comportamento sbagliato ("mortale" scartato) per asserire quello giusto.
run-kpi 3014→3019, copertura 1007/1007→1012/1012.

## Verifica
- `run-kpi.mjs`: 3019 passati, 0 falliti
- `run-stile.mjs`: 328 passati, 0 falliti
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, copertura 1012/1012
- Due giri isolati su worktree (verifica prima e dopo la correzione della
  cascata dei documenti, entrambe rimosse): 39/40 comandi a posto la prima
  volta (l'unico caduto era `numeri-nei-documenti.mjs`, poi corretto),
  40/40 la seconda
- Cascata dei quattro documenti aggiornata: 3.498→3.503 prove, 3.921→3.926
  asserzioni del giro completo — misurate fresche, non ricopiate
- Push riuscito al primo tentativo: `bf81d5cd..674f8dfe`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. **L'ottavo giro di ricerca su Scudo è
chiuso su tutto ciò che si può fare senza una decisione del fondatore**:
finding 3 (radice, lavoratoreId) fatto, finding 4 (stato + rientro dopo 60
giorni) fatto, finding 2 (terzo/quarto gradino + UNI 7249) fatto. Resta
aperto solo il finding 1 (scadenza/documento per la denuncia INAIL — tre
termini legali distinti, 48h/2gg/24h, chiede una scelta di quale tracciare
in `SCADENZE_PRESET`). Conti Finding 2 (scoring cliente) resta riservato a
`DECISIONI_WEEKEND.md`.

## Prossimo passo atomico
Con l'ottavo giro di ricerca su Scudo chiuso salvo la decisione del
fondatore, il lavoro prosegue su un fronte diverso (direttiva 5: più
cantieri aperti insieme su app diverse). Candidati, in ordine di prontezza:
1. **Nuovo giro di ricerca in background** su un'app non ancora coperta due
   volte in questo ciclo (Genesi, Campo, Terra, Flotta, Sentinella hanno
   già avuto un giro recente; Genesi non ha ancora avuto un secondo
   passaggio approfondito in questo ciclo — buona candidata), lanciato con
   `Agent`/`Workflow` in background mentre si prosegue con altro.
2. **Seconda iterazione estetica/UX** di un'app already-shipped, seguendo
   il metodo del confronto affiancato (regola vincolante «l'eccellenza è lo
   standard», almeno tre iterazioni).
3. Presentare al fondatore in `docs/DECISIONI_WEEKEND.md` le due decisioni
   in sospeso di questa sessione (Scudo finding 1 — tre scadenze INAIL;
   Conti finding 2 — scoring cliente) in un'unica voce, così la prossima
   volta che il fondatore legge il documento le trova entrambe pronte.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
