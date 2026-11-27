# Checkpoint — 2026-09-17T19:32:04Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7f2789c7

## Cosa è stato completato
Con la deep-pass completa su tutte le sei app + core (checkpoint precedente),
il ciclo è passato ai due binari della fase aperta dal fondatore il 26/08:
ricerca continua (rotazione sull'app/topic più stale) e una sovrapposizione
nuova nella mappa ecosistema. Tre cantieri in background lanciati in
parallelo, ognuno riverificato leggendo io stesso il codice prima di agire.

**Sovrapposizione nuova (commit `e2431e58`)**: cercata in
`docs/MAPPA_ECOSISTEMA.md`, che si dichiarava esaustiva dopo il censimento
del 16/09. Trovata `oreAnno` (Scudo) / `presenze` (Campo): Scudo ha bisogno
delle ore lavorate per calcolare IF/IG/LTIFR e le vuole solo scritte a mano,
rifiutando esplicitamente di stimarle; Campo le misura già per persona e
turno dagli orari veri di entrata/uscita, ma nessuna funzione le somma su un
anno e nessuno dei due moduli legge l'altro. Censita in §3i/§6 di
`MAPPA_ECOSISTEMA.md`; routing a decisione (**voce 35**) perché le ore di
Campo potrebbero non coprire tutta la forza lavoro — un ponte silenziosamente
parziale produrrebbe l'esatto denominatore inventato che Scudo vieta già.

**Ricerca su Core (commit `76517d75`, `4b02acc7`, `7f2789c7`)**: il file più
stale (fermo dal 04/09). Tre proposte, comparate con dashboard multi-sito
comparabili (Trimble InsightHQ e pattern del settore, fonti di seconda mano).
Le prime due erano economiche — riusavano dati e pattern già scritti nel
core — e sono state costruite e verificate nella stessa unità:
1. Il badge delle notifiche in home contava solo `DB.promemoria`, non le
   scadenze mezzi (`mzScad`, già calcolate per la pagina notifiche completa).
   Estratta `mezziScadenzeUrgenti()` (era una copia inline), usata in
   entrambi i punti.
2. L'elenco "Macchine da lavoro" non aveva nessun indicatore d'eccezione, a
   differenza del suo gemello "Mezzi da strada" (badge RAG sulle scadenze).
   I mezzi da lavoro non hanno scadenze ma hanno guasti con gravità
   dichiarata: aggiunto lo stesso linguaggio visivo sul segnale che questi
   mezzi hanno davvero (guasto critico aperto).
   Verificato dal vivo: badge passato da conteggio parziale a completo;
   "Atlas Copco ROC F9" (guasto critico in demo) ora mostra il badge nella
   riga dell'elenco, senza dover aprire la scheda.
3. La terza (obiettivo di produzione per cava, oggi assente ovunque nel
   core) è dichiarata "grande" dalla ricerca stessa — introduce un processo
   aziendale nuovo, non un ritocco di schermo. Routing a decisione
   (**voce 36**) invece di costruirla alla cieca.

**Ricerca su Campo (commit `43b49462`)**, chiusa nel blocco precedente,
aveva già prodotto **voce 34** (fase dell'operazione / sterile-commerciale
nel rapportino).

Le decisioni aperte in `docs/DECISIONI_WEEKEND.md` sono ora **23** (33, 34,
35, 36 nuove in questa sessione), tutte verificate con la porta d'ingresso
(`numeri-nei-documenti.mjs`).

## Stato roadmap
Deep-pass completa su tutte le superfici. Ricerca continua attiva su Campo
(settimo giro) e Core (primo giro dopo lo stallo); resta da fare almeno un
giro su Genesi/Scudo/Sentinella/Terra/Flotta/Conti/DeepworkID/Norme/Parole
per rotazione, dato che erano tutti più recenti del Core.

## Prossimo passo atomico
1. Continuare la ricerca a rotazione: il prossimo file più stale dopo Core
   era `docs/RICERCA_CONTINUA_NORME.md` (15/09) — controllare con
   `git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md` per la classifica
   aggiornata prima di scegliere.
2. In alternativa: una seconda iterazione mirata della deep-pass, o
   implementare — se arriva una risposta o se si decide di procedere senza
   aspettarla — una delle decisioni aperte (33-36) con la stessa disciplina
   di verifica (mai di iniziativa su quelle marcate "serve una decisione").
3. Nota chiusa: l'apparente instabilità del totale "asserzioni eseguite dal
   giro" (misurata nel checkpoint precedente) è confermata un falso allarme
   — tre lanci consecutivi sullo stesso commit hanno dato 4092 tutte e tre le
   volte. Non richiede altro lavoro.

## Blocchi
Nessuno.
