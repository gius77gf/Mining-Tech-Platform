# Checkpoint — 2026-09-18T18:03:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b2ec3e20

## Cosa è stato completato
Fix Conti: `emessoIncassato` sommava `importiFattura(f).totale` per ogni
fattura emessa nel mese SENZA applicare la guardia `!statoSdi(f, oggi).nonEmessa`
— la stessa guardia già propagata a nove funzioni gemelle (agingIncassi,
fattureOltre90, kpiFrom, incassoAtteso, testoSollecito, sollecitabile,
esposizioneClienti, incassoPerMese, estrattoContoCliente, registroVendite).
Decima ricorrenza della stessa dimenticanza, mai propagata a questo confronto
del Report ("Emesso contro incassato").

Caso vero già nella demo: la fattura f4 (Calcestruzzi RG, 5.900 €, scartata
dallo SdI il 19/07/2026) veniva contata come "emesso" di luglio insieme agli
8.100 € della f3, mostrando 14.000 € invece di 8.100 € nel Report e nel
grafico della linea temporale — proprio il confronto pensato per dare la
fotografia più onesta del flusso di cassa.

Corretto aggiungendo `if (statoSdi(f, oggi).nonEmessa) continue;` in
`apps/conti/conti-data.js`, come nelle nove funzioni gemelle.

## Verifica
- Nuovo test unitario in `run-kpi.mjs` con fixture + controprova inline:
  senza la guardia il totale sale a 7120 invece di 1220 per luglio.
- Nuovo banco browser permanente `conti-emesso-scartata.mjs` (registrato in
  `tutti.mjs`) che riproduce il caso vero sul Report reale: 3/3 dal vivo
  (luglio mostra "€ 8.100,00"), controprova 1/3 KO voluto (mostra "€ 14.000,00"
  con la guardia rimossa).
- KPI: 3155→**3156**. sintassi-pagine.mjs: 34/34. suite-collegate.mjs: 162
  banchi, 225 file. giro-node.mjs (worktree isolata, due lanci per
  convergenza): 41/41, asserzioni eseguite dal giro **4160→4162**, banchi del
  browser **363→365** esecuzioni, **161→162** file distinti.
- Propagato nei quattro documenti tracciati: `docs/DEVELOPMENT.md`,
  `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
  `vault/ROADMAP_SETTIMANA.md`. Verificato con `numeri-nei-documenti.mjs`
  (43/0, 365 banchi contati) e `sonda-vuoto.mjs` (15/0) sulla worktree.
- Sanity finale sull'albero principale dopo la copia: run-kpi.mjs (3156/0),
  sintassi-pagine.mjs (34/34), suite-collegate.mjs (162/225),
  numeri-nei-documenti.mjs (43/0, 365 banchi) — tutti verdi.

## Stato roadmap
Task #7 (emessoIncassato-sdi) chiuso. Backlog rimasto (verificato dal vivo da
agenti QA, non ancora implementato): #8 (Campo/Flotta CAUSALI_FERMO —
solo documentazione), #9 (Genesi stemB/subB Validator), #10 (Genesi 3D X-ray
borraggio illeggibile), #11 (Terra prospettoDenuncia residuo senza massimo),
#12 (Deepwork ID admin.html canManage su OWNER), #13 (Sentinella .ics con
VALARM nel passato), #15 (Scudo organigrammaSicurezza senza-data), #16
(Genesi popup/tooltip tDet invece di tNom), #17 (Genesi import .volata.json
ignora esplosivo/innesco).

## Prossimo passo atomico
Rimuovere la worktree `/tmp/wt-conti-emesso` (`git worktree remove --force`
+ `git worktree prune`), poi implementare il task #8: censire in
`docs/MAPPA_ECOSISTEMA.md` la sovrapposizione Campo/Flotta `CAUSALI_FERMO`
(due app esportano una costante omonima con contenuto diverso — 9 vs 10
voci — mai collegata da `shared/dw-ponti.js`, unica coppia di app a zero
letture reciproche sulla mappa a 56 direzioni). Solo censimento: NON
costruire il ponte, che richiede prima una decisione di prodotto (i record
`attivita` di Campo non hanno un riferimento `mezzoId`).

## Blocchi
Nessuno. Procedere subito con #8 per la regola di non fermarsi.
