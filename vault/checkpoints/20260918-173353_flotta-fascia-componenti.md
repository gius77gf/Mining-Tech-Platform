# Checkpoint — 2026-09-18T17:33:53Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6b8c2c40 — fix(flotta): la fascia dei componenti a vita propria era fissa

## Cosa è stato completato
Terzo item della coda dei deep-pass QA: la correzione di oggi sulla
mappa degli stati dei componenti (regola 18) aveva sistemato solo il
badge; il contenitore della riga in `#sch-comp` restava fisso a
`st-accent`. Corretto usando `striscia[clsVita[c.stato]]`, come le due
liste gemelle nella stessa funzione. Trovato e corretto anche, per
caso, un difetto nel banco `flotta-contatore.mjs` (non nel prodotto):
un click non protetto crashava l'intero processo quando la sua stessa
controprova fa sparire il bottone bersaglio dal DOM — task
d'investigazione dedicato (#6) risolto con esito "nessun difetto di
prodotto", poi la correzione del banco stesso applicata qui.

## Verifica
- Nuovo banco browser permanente (`flotta-componenti-fascia.mjs`) che
  riproduce il caso vero della demo (Escavatore E1, pneumatico a
  124,7% della vita attesa): 5/5, controprova 2/5 KO voluti.
- `flotta-contatore.mjs` corretto: normale 72/72 invariato, controprova
  ora arriva al verdetto finale su entrambe le larghezze senza crash.
- Nessun modulo dati toccato: KPI invariato a 3155. `sintassi-pagine.mjs`
  34/34, `suite-collegate.mjs` 161 banchi/224 file, `giro-node.mjs`
  41/41 (asserzioni 4160, propagato), `numeri-nei-documenti.mjs` 43/0
  (363 banchi, 161 file distinti, propagato nei quattro documenti).

## Stato roadmap
Coda dei deep-pass QA di background rimasta (task #7-#13, #15 nel
tracker di sessione — #6 e #14 chiusi in questa unità):
- #7 Conti: `emessoIncassato` non esclude fatture scartate SdI.
- #8 (solo documentazione) censire sovrapposizione Campo/Flotta
  `CAUSALI_FERMO` in `docs/MAPPA_ECOSISTEMA.md`.
- #9 Genesi: `stemB`/`subB` nel Validatore, falso allarme rosso.
- #10 Genesi: vista 3D raggi-X, carica fino al colletto se borraggio
  illeggibile.
- #11 Terra: `prospettoDenuncia` non annota "Residuo" come MASSIMO.
- #12 Deepwork ID: `admin.html` offre azioni sull'owner a un admin.
- #13 Sentinella: export `.ics` genera allarmi nel passato.
- #15 Scudo: `organigrammaSicurezza` ignora lo stato "senza data"
  (stessa lacuna già corretta oggi in `abilitazioneLavoratore`, non
  propagata a questo secondo consumatore di `statoRequisito`).

Due agenti QA dispatchati in questo blocco (investigazione
flotta-contatore, Scudo secondo giro nuovo angolo) — entrambi tornati
con un esito. Nessun agente attualmente in corso: da rilanciare per
mantenere ≥3 cantieri.

## Prossimo passo atomico
Implementare il fix Conti `emessoIncassato` (task #7): in
`apps/conti/conti-data.js`, righe ~2645-2682 (buco a 2653-2658), la
funzione somma `importiFattura(f).totale` per ogni fattura emessa nel
mese SENZA applicare `!statoSdi(f, oggi).nonEmessa`, la guardia già
propagata a 9 funzioni gemelle (agingIncassi, fattureOltre90, kpiFrom,
incassoAtteso, testoSollecito/sollecitabile, esposizioneClienti,
incassoPerMese, estrattoContoCliente, registroVendite). Il caso vero è
già nella demo (fattura f4, scartata SdI, € 5.900), verificato da un
agente QA sia a livello di modulo (Node) sia via Playwright (Report,
sezione "Emesso contro incassato", #flusso-list e grafico
#graf-flusso). Isolare in una worktree fresca da HEAD, verificare con
test unitario/Playwright + controprova prima di committare. In
parallelo, dispatchare 2-3 nuovi agenti di deep-pass QA per mantenere
≥3 cantieri. Poi proseguire con la censimento mappa (#8), Genesi ×2
(#9, #10), Terra (#11), Deepwork ID (#12), Sentinella .ics (#13),
Scudo organigramma (#15). Continuare "mai fermarsi".

## Blocchi
Nessuno.
