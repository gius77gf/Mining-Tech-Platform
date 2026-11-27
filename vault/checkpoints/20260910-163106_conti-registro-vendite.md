# Checkpoint — 2026-09-10T16:31:06Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ff086163 — Conti: il registro delle vendite per il commercialista

## Completato
`registroVendite` / `csvRegistroVendite` / `descriviRegistroVendite` (una
riga per aliquota, anagrafica del cliente, note di credito col segno meno,
IVA vuota non zero, senza data dichiarato); il bottone nei Report. run-kpi
+6 (2807), banco `conti-registro-vendite.mjs` 22 ok, controprova 6/22; 267
esecuzioni / 113 file; copertura 933/933 (fondo Conti 192). Docs:
CONCORRENTI_CONTI riga «Export contabilità» a C'È (parte a metà dichiarata).

## Stato roadmap
Voce `[x]` «IL REGISTRO DELLE VENDITE PER IL COMMERCIALISTA (10/09)».

## Prossimo passo atomico
Le righe 1-3 della lista del fisco di CONCORRENTI_CONTI sono chiuse per
quanto il codice possa (1 = il file XML c'è, l'invio no: canale, decisione;
2 = rimanenze; 3 = registro vendite). Le altre cinque sono decisioni o fuori
perimetro (ritenuta: numeri fiscali di seconda mano; conservazione a norma;
ruoli; e-ticketing; bilancia/foto). Si passa a un'altra app: Terra (4
confermate assenti, tutte modelli) e Sentinella/Campo (hardware) non danno
righe da codice; quindi il binario 2 della routine — la PASSATA IN
PROFONDITÀ — su Conti, perché ha ricevuto tre riquadri/bottoni nuovi oggi
(rimanenze, registro, tendina dell'ordine di Flotta): aprire ogni schermata
a 320 e 430 con lo strumento `scratchpad/pass-app.mjs` se c'è ancora (se no
un banco usa-e-getta nello scratchpad), GUARDARE gli scatti, premere ogni
bottone che produce un file e aprire il file (`documenti-dimostrazione`
ne giudica 134: si leggono anche gli zeri tranquilli con `--dimmi`),
cercare i numeri tranquilli. Ogni difetto vero = un'unità con prova che
lo rimette. Poi la stessa passata su Flotta (la riga «In Conti» sull'ordine
è nuova). Procedura come sempre: scratchpad, modulo, run-kpi prima del
riepilogo, banco con controprova per file in tutti.mjs, scatti guardati,
pin, giro sulla COPIA, commit con -F, checkpoint, push.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore.
