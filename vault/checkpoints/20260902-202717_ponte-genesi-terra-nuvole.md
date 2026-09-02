# Checkpoint — 2026-09-02T20:27:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
360b682e — Il primo ponte di dati verso Genesi: Terra legge le nuvole dall'organizzazione

## Completato
- Unità 8 del piano Genesi: `api.nuvoleGenesi` (seconda istanza SDK, pigra,
  sola lettura, `null` se non risponde; in demo `null`), la scelta pura
  `ultimoRitaglioNuvola` (5 prove), il bottone «Dal visore drone» che legge le
  due fonti e dice quando il volume viene dall'organizzazione.
- run-kpi 2444; copertura terra 71 (769/769 sulle sei app); banchi Terra
  (quota-base-reale 12/0, punti-nuvola 7/0) verdi. Giro node 37/37 dopo i conti.
- Mappa §4 e §6: **12** ponti, Genesi non è più «app che nessuno legge», zero
  app senza scambio di dati. Piano §5: righe 1, 2, 3, 4, 8 ✅.

## Prossimo passo atomico
Restano del piano Genesi la **5** (porta le tue volate nell'organizzazione:
copia una tantum e idempotente delle chiavi locali nelle collezioni, con
contrassegno `genesiMigratoV1` e i campi `autore`/`creatoIl`; le chiavi
locali NON si cancellano; un bottone in Home visibile solo in modalità live;
prova pura: seconda chiamata → 0 scritture) e la **7** (`designLeggibile`:
32 campi del design, valore sporco → vuoto dichiarato, mai zero; 1 riga in
pagina sulla porta `Object.assign(D2, design)` dell'azione «apri»). La 6 è
la decisione 5b del fondatore: non si fa.
Prima conviene la **7**, piccola e pura, che chiude un rischio reale già oggi
(un design salvato da un altro browser dell'organizzazione con un campo
illeggibile): leggere `volSnapshot` per i 32 campi e il ramo `act==='apri'`
in `genesi.html`; scrivere la funzione in scratchpad, poi nel modulo, poi le
prove in run-kpi (un caso sporco per campo).

## Blocchi
Nessuno.
