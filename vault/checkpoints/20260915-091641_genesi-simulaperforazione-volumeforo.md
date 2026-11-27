# Checkpoint — 2026-09-15T09:16:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fdf4228a (pushato)

## Cosa è stato completato

Chiusa l'ultima delle tre unità del quarto giro di ricerca (Sentinella,
Conti, Genesi). Riverificato di persona il finding su Genesi — non salvato
come file di testo separato in questo giro, quindi riletto direttamente
il codice invece che fidarsi della sintesi dell'agente, come richiesto
dalla regola "niente entra sulla parola dell'agente".

**Il difetto**: `simulaPerforazione` (la simulazione Monte Carlo a 300
tiri dietro la card "Precisione di perforazione" della scheda validatori)
calcolava `Bnom`, `Snom` e `L` con `D2.B||3`, `D2.S||3.5` e `D2.prof||10`
— esattamente la stessa spalla di progetto a 3 m già tolta altrove nella
stessa pagina per `pfNominale` (blocco G15, `_Bprog`, commento che cita
alla lettera `(D2.B||3)*(D2.S||3.5)*(D2.prof||10)` come "una spalla di
3 m che nessuno ha scritto"). Qui però il numero inventato non finiva in
una frase: alimentava un'intera simulazione statistica che tornava con
una banda di burden precisa al centimetro e un "rischio" in percento, su
una geometria mai dichiarata — e la funzione può partire anche su fori
arrivati per importazione (DXF, point cloud), che non passano mai da
`applyDesign`, dove B/S/prof restano scritti su `D2`.

**La correzione**: riusata `volumeForo(D2.B, D2.S, D2.prof)` come guardia
(stesso contratto già usato da `pfNominale`: leggibile e positivo, altri­
menti `null`) invece di scrivere una seconda copia della stessa domanda.
Se la geometria non è leggibile, `simulaPerforazione` torna `null`, come
già faceva per "nessun foro" — l'unico chiamante (`if(!S){return;}`)
gestisce già quel caso, omettendo semplicemente la card.

**Verifica**:
- Nessuna funzione nuova in `genesi-data.js`: zero logica nuova non
  testata, solo riuso di `volumeForo`, già coperta da un'ampia suite di
  casi (dodici forme dell'assenza, il caso dei due segni meno che si
  annullano).
- Verificato a mano in `node`, prima di scrivere il fix nella pagina: sei
  casi (B assente, B zero, S assente, prof assente, prof zero, tutto
  valido) — `volumeForo` torna `null` sui primi cinque, `105` sull'ultimo.
- `sintassi-pagine.mjs` conferma che `genesi.html` compila ancora dopo la
  modifica (34/34).
- Nessuna voce nuova in `run-kpi.mjs`: la cascata dei quattro documenti
  non si tocca sul totale prove; solo la cifra "asserzioni eseguite dal
  giro" ricalcolata fresca sulla worktree isolata (3.945).
- Giro isolato su worktree separata: **40 comandi a posto, 0 caduti**.

⚠️ **Limite dichiarato**: `simulaPerforazione` resta una funzione di
pagina (legge `D2` dalla chiusura, non estratta), quindi non esiste un
test `node` che eserciti la funzione stessa nel suo insieme — solo la
guardia riusata (`volumeForo`) è testata a fondo. Non è stato scritto un
banco browser nuovo per verificare l'intero percorso pagina (costo non
proporzionato a un fix difensivo su un caso limite, non la funzione
principale); se in futuro emergesse un caso reale di fori senza B/S/prof
letti sbagliati, è lì che si guarda per primo.

## Stato roadmap

Il quarto giro di ricerca (Sentinella, Conti, Genesi) è **chiuso**: tutti
e tre i findings verificati di persona e risolti (Sentinella
`fogliaVolata`, Conti `applicaIncassi`, Genesi `simulaPerforazione`).
Resta aperta la nota DDT di Conti (numerazione "senza salti" dichiarata
ma non imposta — destinata a `docs/DECISIONI_WEEKEND.md` come decisione,
non un fix di codice) dal giro precedente, non ancora scritta.

## Prossimo passo atomico

Scrivere la nota/decisione su DDT "senza salti" in
`docs/DECISIONI_WEEKEND.md` (tocca l'assunzione "readonly = niente
doppioni" che è vera, ma "senza salti" non lo è mai stata davvero — è una
domanda per il fondatore, non un bug, sul modello della decisione 29 già
scritta in questa sessione per il finding C di Deepwork ID). Poi, per la
regola "il lavoro non finisce mai da solo": lanciare un nuovo giro di
ricerca mirata in background (tre cantieri paralleli su app non ancora
coperte in profondità in questo giro, o un secondo passaggio più
approfondito), seguendo il mandato corretto della routine
(`docs/MAPPA_ECOSISTEMA.md` §6 come fonte di stato vivo, corretto in
questa sessione via `update_trigger`). Nessuno stop volontario: si
prosegue subito.
