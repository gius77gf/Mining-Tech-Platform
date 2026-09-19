# Checkpoint — 2026-09-19T21:50:24Z

## Tipo
verifica (nessun codice), lettura di un giro incompleto

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4822516a (canarino: ciclo automatico vivo, 2026-09-19T21:47:41Z)

## Cosa è stato completato
`tutti.mjs --solo=genesi`, lanciato alle 20:08Z (dopo G58, per il
"prossimo passo atomico" del checkpoint precedente), è morto senza
arrivare al RIEPILOGO finale: il registro si ferma a metà di una
controprova, senza la riga di chiusura. **Causa: la sessione è rimasta
idle per oltre un'ora e il processo in background è stato riciclato dal
contenitore** — non un banco piantato (nessun banco supera i 30 minuti
di default di `--limite`), e non un difetto del prodotto. È la stessa
famiglia già scritta in CLAUDE.md: *"un giro più lungo della sessione
non finisce mai"*.

- [x] **Letto per intero quel che c'è** (869 righe, fino a metà della
  controprova di "carica fuori dal foro"): ~14 banchi distinti coperti
  (struttura, foglio in cava, recettore assente, campi vuoti, maglia
  assente, persistenza di tratti/direzione-costi/errColl-dev/relief su
  "Apri", piano innesco XML, obiettivo x50/confronta burden, burden per
  foro, vocabolario voladura, scheda volata CSV, Home ponti tagliati,
  carica fuori dal foro).
- [x] **Verificato riga per riga che OGNI `KO` cade dentro una finestra
  `CONTROPROVA / FINE CONTROPROVA`**: zero KO veri nelle sezioni normali
  (i sei `RIEPILOGO` presenti nel log incompleto sono tutti puliti). Non
  letto "70 ok" e concluso "va tutto bene": controllato che il rosso
  presente fosse SEMPRE quello dichiarato voluto, per la regola "il rosso
  di una controprova è il verde del banco" — un errore già preso due
  volte in questa casa.
- [x] **Non dichiarato "pulito" il giro nel suo complesso**: è arrivato
  solo a una parte dei banchi che `--solo=genesi` copre (il file
  `tutti.mjs` ne elenca molti di più — Kuz-Ram, energia, sequenza,
  contrasto, unità di misura, ecc. — mai raggiunti in questo lancio). Un
  giro incompleto non è un giro pulito: è un giro che non ha guardato il
  resto.

## Verifica prima del commit
Nessun codice toccato in questa unità: solo lettura e canarino. Il
canarino di questo ciclo è già stato committato separatamente
(4822516a).

## Stato roadmap
I 21 "da guardare" del batch generico dopo G58 (task `bi15dnflk`, letto
con `| tail -20` e quindi senza dettaglio) restano non identificati nel
dettaglio — ma la parte di banchi genesi coperta da QUESTO secondo
lancio, più ampio, non ha trovato nessun KO vero: è ragionevole (non
certo, perché i due lanci non coprono necessariamente lo stesso
sottoinsieme di banchi) che gran parte dei 21 fossero anch'essi
controprove non lette per intero, come qui.

## Prossimi passi
- **Prossimo passo atomico**: NON rilanciare un giro `--solo=genesi`
  completo lasciandolo girare per oltre un'ora senza supervisione attiva
  (rischia lo stesso esito). Se serve una copertura completa, lanciarlo a
  inizio ciclo e continuare a lavorare/interagire nel frattempo (mai
  "aspettare guardando", ma nemmeno lasciare la sessione idle per
  un'ora+). Nel frattempo, proseguire con un'altra unità verificata di
  persona su Genesi (grep/lettura del codice + Playwright mirato), che è
  il metodo che ha prodotto G56c/d, G57, G58, G59 in questa sessione.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
