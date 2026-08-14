# Checkpoint — 2026-08-02T08:15:00Z

## Tipo
kickoff

## Branch
`claude/scheduled-tasks-remote-control-bk4ap6`

## Ultimo commit
`934b3c3`

## Stato roadmap
Settimana nuova avviata: **lunedì 03/08 → venerdì 07/08**, v6.0 «lo standard
delle funzioni». Vedi `vault/ROADMAP_SETTIMANA.md`.

⛔ **Prima di scriverla ho verificato quali task erano ancora davvero aperti, e
tre non lo erano**: gli appaltatori di Scudo, il primo passo del cantiere di
Genesi e il banco `browser/modali.mjs` erano chiusi da ore con la casella
rimasta vuota. È lo stesso difetto misurato la notte scorsa — il documento più
vecchio del codice — commesso dalla roadmap invece che dal delta.
E due task erano invecchiati al contrario: «suite test da 364 a oltre 420» si
legge oggi con **1.838** prove.

## Prossimi passi
**A1 — Flotta, la metà gasolio del costo orario.** Misurata e dichiarata la
notte scorsa, non corretta: `consumoPerMezzo` scarta il primo pieno (metodo
pieno-a-pieno) mentre `costoOrarioMezzo` lo rimette nel numeratore. Scarti
misurati: **+93,7%** su Pala P1, +50,4% su Dumper D1, +49,2% su Escavatore E1.
Sono due conti della stessa cosa che divergono, dieci righe sotto il commento
che vieta esattamente questo. Il codice è già strutturato perché la correzione
sia una riga: `euroOra` di `consumoPerMezzo` è già calcolato col metodo giusto.

Poi A2 (la densità in `shared/`, perché oggi Terra e Campo convertirebbero con
due numeri diversi), A3 (il DDT che non eredita il prezzo dell'ordine), A4 (il
banco per le modali).

## Blocchi
- **25 decisioni** aspettano il fondatore, con la pagina d'ingresso in cima a
  `docs/DECISIONI_WEEKEND.md`. **19 procedono da sole entro venerdì** se non
  arriva risposta, e la cosa va scritta nel commit. Le altre **6 restano ferme**:
  3 perché toccano sicurezza (dati di default veri, password in chiaro, curve
  USBM/DIN) e 3 perché richiedono un suo account o un suo file.

## Note
Quattro cantieri sono morti insieme alle 02:40 UTC sul limite della piattaforma
— l'unico stop legittimo — con il lavoro a metà: Flotta (gasolio), `shared/`
(densità), Conti (prezzo dell'ordine) e il banco delle modali. Nessuno aveva
committato, e l'albero è rimasto **pulito**: si rilanciano dai loro mandati, che
sono nella cronologia della sessione.

⚠️ E una cosa da sapere per la ripresa: il checkpoint «più recente» **non è**
quello col nome più alto. In `vault/checkpoints/` ci sono file datati avanti
rispetto al giorno in cui sono entrati in git (640 precedenti alla regola). Il
più fresco per data vera è
`20260801-235400_quattro-cantieri-e-un-numero-piu-alto-di-ogni-suo-addendo.md`.
