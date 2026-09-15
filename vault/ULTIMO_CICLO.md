# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-15, 04:22 UTC
- **Commit di partenza**: `4bdb9520`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Nuova accensione della routine "Weekly Dev Session" (fuoco delle
03:45:41 UTC), stessa conversazione. Repository raggiungibile, `HEAD`
allineato al remoto (`git fetch` senza divergenza).

Chiuso il cantiere B3 (Genesi) per esaurimento dei candidati economici
nel bucket "1-2" del censimento (verificato leggendo il codice dei
candidati rimasti, non dedotto dal loro numero di chiamanti — vedi
checkpoint `20260915-020918`). B12 (core, calotta della galleria)
chiuso lo stesso blocco.

Tre passate in profondità lanciate in parallelo su Flotta, Conti e
Sentinella (agenti in background, regola dei tre cantieri), ognuna
riverificata a mano prima di agire — niente entra sulla parola
dell'agente. Tre difetti veri trovati e corretti, tutti della famiglia
"numero tranquillo / record sbagliato":

- **Flotta**: l'import CSV del parco confrontava il nome INTERO invece
  del nome breve (la chiave vera) contro l'archivio esistente — un
  mezzo già registrato con marca/modello non fermava una riga CSV col
  solo nome corto, e nasceva un secondo documento con lo stesso nome
  breve. Nuovo banco dedicato, controprova verificata.
- **Conti**: `estrattoContoCliente` (la lettera che riepiloga tutto
  l'aperto di un cliente) non escludeva le fatture "come non emesse"
  (scartate dallo SdI, o mai inviate) dal totale/mora — la stessa
  regola che `sollecitabile()` applica già al bottone «Sollecito».
  Corretto anche in `testoSollecito` stesso (difesa in profondità).
- **Sentinella**: `misureDelGiornoPerReclamo` leggeva la soglia grezza
  del punto invece della soglia EFFICACE (quella del ricettore
  collegato, quando esiste) — la card del reclamo e la lettera di
  risposta potevano accusare un «superamento» che la schermata
  Monitoraggi, sulla stessa lettura, dichiarava «Conforme» (o
  viceversa, il verso pericoloso).

Le tre correzioni sono verificate (run-kpi.mjs diretto, pulito) e in
fase di commit: tre giri isolati su worktree separate sono stati
lanciati in parallelo (Flotta-solo, Conti-sopra-Flotta, e il
combinato Flotta+Conti+Sentinella) per la verifica pre-commit; ancora
in corso al momento in cui questo canarino si scrive.

## Prossimo passo atomico

1. **Immediato**: appena i tre giri isolati confermano zero cadute,
   committare le tre unità separatamente (Flotta, poi Conti, poi
   Sentinella), ciascuna col suo checkpoint, verificando `git status
   --short` prima di ogni `git commit -F`.
2. Continuare con altre passate in profondità sulle app non ancora
   toccate in questo blocco (Terra è già stata passata a mano senza
   trovare difetti nuovi — il modulo è già molto maturo), o tornare al
   blocco B4 (mancanze confermate del delta) per altri candidati
   piccoli e già decisi, sul modello della riga stale chiusa in
   `docs/CONCORRENTI_FLOTTA.md` (commit `baae0a9b`).

Nessuno stop volontario: si prosegue subito.
