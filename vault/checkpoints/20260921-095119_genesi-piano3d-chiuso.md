# Checkpoint — 2026-09-21T09:51:19Z

## Tipo
documentazione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b8eefb38 (canarino: ciclo automatico vivo, 2026-09-21T09:47:48Z)

## Cosa è stato completato
Seguito il "prossimo passo atomico" del checkpoint precedente: letto per
intero `apps/genesi/PIANO_3D.md` (mai riletto in questa sessione,
datato 19/07 — due mesi fa). La sezione "Lavoro REALE rimanente"
elencava cinque punti come da fare.

- [x] **Verificato uno per uno sul codice vivo, non sulla parola del
  documento**: tre punti su cinque erano già completamente costruiti
  (flyrock/gittata con visualizzazione 3D a tre anelli; fori bagnati,
  sia il calcolo su carica/accoppiamento sia l'indicazione visiva/
  scheda; presplit + comparatore A/B). Il quarto (rock-factor Lilly)
  ha la FORMULA costruita per intero (`fattoreRoccia`, RMD/joint
  factor/RDI/hardness) ma non il "form dedicato" che il documento
  descriveva: verificato con `grep -n "rmd\|jcf\|jps\|jpa"
  apps/genesi/genesi.html` → zero righe, i parametri vengono solo dal
  preset del litotipo. Il quinto (rifiniture estetiche) è già tracciato
  altrove (candidato "burden map" in `RICERCA_CONTINUA_GENESI.md`,
  trovato e verificato due unità fa in questa sessione).
- [x] **Aggiornato il documento** per riflettere lo stato vero, con la
  prova per ognuno dei cinque punti, invece di lasciarlo come un "todo"
  che avrebbe potuto far ripartire un cantiere su lavoro già fatto.

## Verifica prima del commit
`PIANO_3D.md` non è fra i documenti tracciati da `numeri-nei-
documenti.mjs`/`documenti-invecchiati.mjs` (verificato col grep).
Rilanciati comunque entrambi: **43/0** e **15/0**.

## Stato roadmap
Nessun codice di prodotto toccato. Un documento di pianificazione
vecchio di due mesi ora riflette lo stato vero, con le prove.

## Prossimi passi
- **Prossimo passo atomico**: letto `apps/genesi/PIANO_3D.md`, resta da
  leggere `docs/GENESI_ROADMAP_COMPETITOR.md` per intero (203 righe,
  mai riletto in questa sessione) con lo stesso metodo — verificare
  ogni voce sul codice vivo prima di crederla aperta o chiusa.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
