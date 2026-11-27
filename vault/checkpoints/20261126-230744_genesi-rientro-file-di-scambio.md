# Checkpoint — Genesi: riaprendo il file di scambio il progetto non è più la media dei fori

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): riaprendo il file di scambio…»).
Il precedente, `15b07bc6` (il report coi fori diversi), è confermato dal
giro `node` completo: 43 comandi a posto, 4417 asserzioni.

## Che cosa è stato fatto
- MISURA prima di toccare (`scratchpad/rientro/misura.mjs`: bottoni veri,
  file vero): un foro lasciato scarico e uno accorciato; riaprendo il
  `.volata.json` la scena ripartiva da 53,17 kg e 9,875 m per foro, col
  messaggio «Volata importata: 12 fori». Difetto nato da F5b: finché i fori
  uscivano tutti uguali, la media era il progetto.
- `apps/genesi/genesi-data.js`: `valoreProgettoDaFile(dichiarato, valori)`
  → `{ valore, fonte: 'dichiarato'|'media'|null, senza, diversi }`
  (202/202). Tutti uguali → il valore esatto, non la somma divisa.
- `apps/genesi/genesi.html`: l'export scrive `default.carica_kg`; l'import
  usa `default.carica_kg` e `default.profondita_m` quando ci sono (la media
  resta per i file che non li dichiarano) e il messaggio dice i fori con
  una carica diversa, oppure che la media «non è la carica di nessun foro».
  Sparita `_mediaDichiarata` dalla pagina.
- Rimisurato dopo: 58 kg e 10 m, col messaggio.
- Prove: `run-kpi.mjs` 3254 → 3255 (controprova 5 su 5; tre asserzioni che
  leggevano il SORGENTE della pagina aggiornate, due ora chiamano la
  funzione); banco `genesi-foro-per-foro.mjs` 172 → 176, 56 iniezioni tutte
  sul bersaglio; rigirati i tre banchi che importano un file
  (`genesi-documenti-che-escono`, `genesi-frasi-limite`,
  `genesi-import-esplosivo-innesco`): a posto.
- Numeri: 3.755 prove senza rete; giro `node` 4418 (per somma: 4417 + 1);
  condivisi 376/376.

## Dichiarato
- I valori dei singoli fori NON rientrano nel progetto 2D da questo file: il
  lettore ricostruisce la scena 3D da una riga sola (scelta già scritta
  lì). Lo si dice nel messaggio; la profondità di ogni foro rientra come
  altezza del fronte in quel punto (`P.foriH`).
- I limiti del rientro restano quelli di prima (carica 10–120 kg,
  profondità 6–18 m).

## Stato roadmap
Aperte per Genesi: `i cinque campi per foro, uscita per uscita: censimento`
(nuova, la prossima), `il piede che esce dalla faccia` (in attesa della
decisione 35). In attesa del fondatore: decisioni 28, 33, 34, 35.

## Prossimo passo atomico — il censimento delle uscite, premendo i bottoni
1. In scratchpad, un banco sul modello di `scratchpad/rientro/misura.mjs`
   (server proprio, ganci su `HTMLAnchorElement.prototype.click` e
   `window.open`): progetto di dimostrazione con inclinazione 10°, poi dal
   ponte di debug `D2.holes[2].kg = 0`, `[4].prof = 8.5`, `[6].stem = 1.5`,
   `[8].diam = 76`, `[10].incl = 20`.
2. Premere OGNI bottone che fa uscire qualcosa (cercarli:
   `grep -n "a.download=\|window.open(" apps/genesi/genesi.html`) e salvare
   ogni file nello scratchpad.
3. Per ogni file, cercare i cinque valori (0 kg, 8,5 m, 1,5 m, 76 mm, 20°)
   e i cinque del progetto: tabella uscita × campo con «per foro / solo
   progetto / assente» e «lo dice / tace».
4. Scrivere la tabella in `docs/` (o nella roadmap) e aprire UNA voce per
   ogni cella che tace. Non correggere niente prima di avere la tabella
   intera: due difetti di questa famiglia oggi sono usciti uno alla volta.

## Blocchi
Nessuno tecnico.
