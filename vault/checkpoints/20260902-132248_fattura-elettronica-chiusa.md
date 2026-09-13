# Checkpoint — 2026-09-02T13:22:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6d4f16ee — «Conti: il bottone «XML per lo SdI» sulla fattura, e il file si apre da un banco»

## Completato
La fattura elettronica è chiusa in tre unità nello stesso giorno (A generatore,
B campi, C bottone). Il punto 5 della roadmap della fatturazione è ✅ e la riga
del mercato («nessuna fatturazione elettronica») è barrata con la data.
- Banco `conti-xml-sdi.mjs` (17 prove, controprova che cade in 4): apre il
  file e lo confronta col modulo (5 righe, 9 DDT, totale); con una fattura
  vecchia niente file e la modale nomina la ragione.
- Trovato sullo scatto e corretto: il toast leggeva i tag come testo ed era un
  muro; ora è corto, la riga di onestà intera sta nella modale e nella stampa.
- La guardia sugli export senza marchio ha preso l'XML (giusto: in
  dimostrazione il file porta «DATI-DI-ESEMPIO_» davanti come i CSV), e il
  suo censimento è passato da 29 a 30 siti.
- Giro node 37/0; documenti a 2.902 prove, 3.310 asserzioni, 208 esecuzioni
  del browser da 85 file di banco.

## Prossimo passo atomico
Il binario dei ponti: la prossima famiglia della mappa è **3b, le `scadenze`
di Terra, Flotta e Scudo** — tre scadenzari, e chi ha un'autorizzazione (Terra),
una revisione del mezzo (Flotta) e una visita medica (Scudo) le vede in tre app.
Prima la misura, poi il ponte: aprire i tre moduli e scrivere nel checkpoint
(a) la forma di una scadenza in ciascuno (campi, chi la calcola scaduta —
`statoScadenzaHSE` in Scudo, e gli omologhi), (b) dove vive già una lettura
incrociata (Campo legge le scadenze di Scudo con `idoneitaDiTurno`), (c) la
domanda del meccanismo: «chi decide che una scadenza è scaduta, e i tre dicono
la stessa cosa sullo stesso giorno?» — provato in scratchpad con la stessa data
sui tre. Se i tre verdetti divergono, il ponte comincia da una regola sola in
`shared/dw-ponti.js` (identità, non comportamento), come per i numeri.
In parallelo (cantiere, altra app): la passata in profondità su **Scudo** con
la stessa domanda «dove compone qualcosa che esce, chi decide i suoi numeri?».

## Blocchi
Nessuno. PR #345 verde, aperta (unire è del fondatore). Il limite di sessione
degli agenti scatta ogni ~3 ore: un cantiere che muore lascia il lavoro sul
disco, non committato — si misura prima di crederci.
