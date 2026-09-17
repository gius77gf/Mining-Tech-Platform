# Checkpoint — 2026-09-17T21:42:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8fc73e59

## Cosa è stato completato
Chiusi i due difetti che l'agente di deep-pass su Genesi aveva trovato e
lasciato aperti nel checkpoint precedente (entrambi verificati di persona
prima di agire, poi corretti con test + controprova + giro node completo
su worktree isolata).

1. **Import del `.volata.json`, il borraggio mancava dalla G21.** La
   geometria del file (spalla/interasse/diametro) era stata corretta il
   17/09 nello stesso giorno, ma `borraggio_m` — che esce nel file da mesi
   — non veniva letto da nessun punto. Aggiunta la stessa lettura con
   `valoreCampo`. Esteso il test G21 esistente in
   `genesi-documenti-che-escono.mjs` (round-trip B×S×stem, verificato sia
   `D2.stem` in memoria sia il campo `#dStem` a schermo) e la sua DIFETTI
   (voce 12).
2. **`caricaForoDaGeometria` trattava un borraggio zero come dato
   mancante.** `confinamentoColletto`, sulla stessa geometria, lo accetta
   di proposito. Corretto — e nel farlo si è ripresentato il `+null===0`:
   la prima stesura del fix trattava anche `null` come borraggio valido
   (0), preso subito dal test esistente a riga 31382. Corretto
   normalizzando `null`/`undefined`/`''` PRIMA di convertire. Verificato
   dal vivo con Playwright (kgAuto:true, stem:0 → carica 80 kg, non
   vuota).

Giro finale: 41/41 comandi, 0 caduti, 4098 asserzioni (invariato: nessun
nuovo `test()`, solo assertion aggiunte a test esistenti).

## Stato roadmap
Secondo giro di deep-pass completo su tutte le sei app + core, e i due
difetti residui di Genesi ora chiusi. Nessun difetto noto rimasto aperto
dai giri di deep-pass di questa sessione.

## Prossimo passo atomico
1. Continuare la rotazione di ricerca continua sul prossimo file più stale
   (`git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`).
2. Terza iterazione di deep-pass, o approfondimenti "secondo passaggio"
   delle schede ricerca, o implementazione di una delle decisioni aperte
   (33-37) SE arriva una risposta (nessuna finora).
3. Aprire almeno altri due cantieri in parallelo (regola delle tre app),
   continuando a lavorare fino a esaurimento crediti senza fermarsi.

## Blocchi
Nessuno.
