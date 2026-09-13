# Checkpoint — 2026-09-02T08:44:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0fdfee38 — «La prima passata su Conti: zero difetti del prodotto, venti dell'ambiente e due del calendario»

## Completato
- Le sei passate del browser su Conti, con l'ambiente tolto: **0 difetti del
  prodotto** (documenti-che-escono 81/0 su 12 punti d'uscita, stampe 20/0,
  numeri-tranquilli 28/0, barre-peso 15/0, frasi 22/0, frasi-da-uno 41/0).
- Trovato e curato l'ambiente: Chromium legge `HTTPS_PROXY` e il proxy tiene
  l'import di Firebase 12,7 s prima di azzerarlo → i banchi a tempo fisso
  misuravano schermate vuote. `tutti.mjs` toglie le variabili ai figli; il
  LEGGIMI dice come lanciare un banco a mano (`env -u HTTPS_PROXY …`).
- Due fixture invecchiate col calendario rese relative a oggi (scadenza
  assoluta 30/08 in `conti-frasi`; costo «sei giorni fa» in `conti-frasi-da-uno`
  che dal 1 al 6 del mese cade nel mese da chiudere). Controprove ancora rosse.
- Ricerca «sul mondo» sulla pesa a ponte in `docs/RICERCA_CONTINUA_conti.md`
  (seconda mano, fonti citate, 5 domande sul meccanismo).
- PR #345: CI verde su `1dc812ff`, titolo e corpo aggiornati (mappa + ponte +
  nomi + mercato). **Non unita**: unire a main è una decisione del fondatore.

## Prima domanda del meccanismo, già risposta a metà
«Con la tara non registrata, chi decide il netto?» Nella PAGINA: se lordo o
tara mancano il netto resta «—» con la spiegazione (difesa del 09/08, provata
in `conti-numeri-tranquilli`). Nel MODULO `nettoPesata` fa `Math.max(0,
lordo − tara)` con `+tara || 0`: la guardia sta nella pagina, non nella
funzione. **Da guardare: il percorso del CSV** (`parsePesateCsv`) — una riga
con la tara vuota passa dalla pagina o chiama `nettoPesata` direttamente?

## Prossimo passo atomico
Aprire `parsePesateCsv` e `rigaPesata` in `apps/conti/conti-data.js`, costruire
in scratchpad un CSV con UNA riga a tara vuota (leggendo PRIMA la
destrutturazione delle colonne, come pretende CLAUDE.md), passarlo al lettore e
guardare che netto esce: se esce il lordo, è «si vende anche il camion» nella
via che nessuno guarda, e va corretto nel MODULO con una prova in `run-kpi`.
Poi la seconda domanda: dove nasce il nesso pesata → DDT (`fatturaId`,
`ddtIds`), e che cosa succede a un DDT il cui peso viene rettificato dopo.

## Blocchi
Nessuno.
