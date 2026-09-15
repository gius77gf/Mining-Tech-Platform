# Checkpoint — 2026-09-05T23:37:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9f9f356d — Le regole dei ponti sotto l'emulatore (91 prove) e la passata a 320 px
su tutte e sei le app

## Completato
Dieci prove in `tests/run.mjs` (previste, piani, pianocarico: dentro l'org
sì, fra org no, senza org no), 91/0 sotto l'emulatore; pin aggiornati con la
data (CLAUDE.md, DECISIONI, roadmap). Passata a 320 px su sei app: niente da
correggere, dichiarato in roadmap con le ragioni. Giro `node` sulla copia:
40 comandi a posto.

## Stato roadmap
Voce `[x]` «LA PASSATA IN PROFONDITÀ A 320 PX SU TUTTE E SEI LE APP, E LE
REGOLE DEI PONTI SOTTO L'EMULATORE».

## Prossimo passo atomico
Lo strumento della passata (`pass-app.mjs`) è una misura buona e vive nello
scratchpad: la regola di casa dice che gli strumenti di misura vivono nei
test. Portarlo in `tests/browser/numeri-tranquilli-a-320.mjs` come BANCO —
apre ogni schermata di ogni app a 320 px, apre le linguette chiuse visibili,
e pretende che nessuna riga porti «NaN», «undefined», «null», «[object»;
gli zeri con unità e i «—» li CONTA e li stampa come misura (non verdetto:
oggi sono tutti etichette di assi e assenze dichiarate), con il denominatore
(schermate aperte, righe lette). Controprova: iniettare un «undefined» in un
template di una pagina e pretendere che cada. Registrarlo in `tutti.mjs`,
pin 253 → 255 esecuzioni / 106 → 107 file. Poi: le tre cose indietro
rispetto ai concorrenti che il codice può colmare (routine, punto 3):
rileggere `docs/MERCATO_E_CONCORRENTI.md` e scegliere la più chiesta.

## Blocchi
Nessuno.
