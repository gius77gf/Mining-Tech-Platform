# Checkpoint — 2026-08-02 10:40:56 UTC

## Tipo
unit-complete (le quattro decisioni del fondatore + il censimento in tre app)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ecc65d5` — *Conti e Terra: dieci numeri tranquilli, e due erano vivi sul serio*

## Che cosa è stato completato

### Le quattro decisioni del fondatore (13, 14, 16, 17) — `3fad1c5`
Ha risposto «vai» con una riga sola e sono state attuate lo stesso giorno.
La porta d'ingresso scende da **23 a 19** decisioni aperte, e il conto lo
misura `numeri-nei-documenti.mjs` contando le caselle, non è scritto a mano.

| | prima | dopo |
|---|---|---|
| **13** mansione senza requisiti | «può andare» (`puo 3/6`) | «non lo sappiamo» (`puo 2, nonSo 1`) |
| **14** DPI senza data | «regolare», 0 allarmi | «senza data», 1 allarme |
| **16** punto senza soglia | «conforme» nel report per l'ente | «su quello non si può dire né conforme né non conforme» |
| **17** prognosi aperta | «un infortunio che non è costato una giornata» | «almeno 4 giornate perse», IG dichiarato minimo |

Trovato per strada: con una soglia **negativa** il rapporto usciva **120.000%**.
Sulla **14** non è stato inventato niente: «senza data» era già in `shared/`.

### Il censimento: Conti, Terra e Scudo a **zero** — `ecc65d5`
Dieci punti, dieci veri. I due che pesano:
- **Terra**: il verbale per l'ente stampava «quota di base 0,00 m» **e**
  l'elenco di ciò che non risulta registrato non la nominava — due bugie che si
  coprivano. E su una data 30 febbraio: 29 giorni, 48 m³/giorno, **143.235
  m³/anno**, il numero da cui esce l'anno di esaurimento della concessione;
- **Conti**: `giorniFraDate` rispondeva `NaN`, che **passa i filtri** che
  scartano solo `null` — una fattura storta portava a «NaN giorni» il tempo
  medio di pagamento di tutta la cava.
⚠️ E l'onestà: `apertoDi`, annunciato come «il più pesante di tutti», è vero
come contratto ma **dormiente** (`residuo` non viene mai salvato). Il censimento
aveva gonfiato quella riga, ed è stata corretta.

### Tre difese nuove sulle pagine, tutte nate da difetti veri di oggi
1. `sintassi-pagine.mjs` (`9b89ed2`) — la CI compilava i blocchi `<script>` e il
   giro di casa no: un `${...}` fuori da un template ha spinto un commit rosso;
2. `pagine-vive --solo=` prima di committare una pagina (`26cb540`);
3. `import-esistenti.mjs` (`15571b5`) — 95 file, 79 import di casa, **858 nomi**:
   è il difetto che tenne la pagina di Scudo morta per cinque commit, e gli altri
   due controlli non lo vedono (un import sbagliato è sintatticamente perfetto).

### La nuvola di punti (`89c7f93`) e il messaggio del ripiego (`acb00ff`)
Vedi il checkpoint delle 09:53.

## Stato delle prove
**1.915** senza rete (run-kpi **1521**, stile 282, helpers 63, pointcloud 32,
manifest 9, demo 8), **53** banchi del browser, copertura **602/602**, nessuna
funzione scoperta, 60 file collegati, 15 pagine che compilano.

## Prossimo passo atomico
Raccogliere i **tre cantieri in corso** e committare app per app dopo la
verifica sulla copia (`git worktree` + `git diff --cached | git apply` +
**`git -C "$W" add -A`**):
1. **Conti · `valorePesata`** — la premessa di una decisione dichiarata regge su
   una schermata su due: il registro Pesate dice «manca la densità», il
   selettore della fattura differita mostra **`€ 0,00`** sullo stesso DDT;
2. **Flotta e Campo** — gli ultimi punti del censimento (`flotta 3 · campo 2`),
   più la verifica che le ragioni dei falsi allarmi reggano ancora;
3. **`docs/CONCORRENTI_SENTINELLA.md`** — il delta rimesso alla prova: era
   l'arretrato più alto dei sei documenti (14 commit).
Poi: aggiornare i numeri nei tre documenti (si muovono a ogni cantiere) e
spuntare in roadmap quello che è stato chiuso.

## Blocchi
Nessuno. Al fondatore restano solo le decisioni che dipendono da lui: **1**
(Firebase nuovo, quando c'è un cliente pilota), **4** (password prima del primo
cliente), **7** (il volo del drone — non blocca più niente, vedi
`docs/NUVOLA_DI_PUNTI.md`), **9** (curve di vibrazione). Le altre quindici
procedono venerdì se non arriva risposta.

## Note
⚠️ Il contenitore si è riavviato una volta durante il blocco, uccidendo quattro
agenti; il lavoro su disco è sopravvissuto. Da lì la regola di committare ogni
punto stabile invece di aspettare la fine dell'unità.
⚠️ `sonda-vuoto.mjs` oggi è stato modificato da **tre** cantieri diversi senza
sovrapposizioni: chi lo tocca lo rilegga prima.
