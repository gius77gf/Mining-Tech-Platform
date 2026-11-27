# Checkpoint — 2026-09-18T17:10:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
75533e4e — fix(campo): il banner di "Chi c'è in squadra" ignorava senza-scadenze

## Cosa è stato completato
Il secondo item della coda dei deep-pass QA di background: il banner
aggregato di "Chi c'è in squadra" (renderOperatori, index.html) non
controllava `hse.senzaScadenze` — una persona collegata a Scudo con zero
documenti registrati — nel guard né nel ripiego finale. Stessa famiglia
dell'ottavo stato ("senza data") corretto poche ore prima sullo stesso
file. Aggiunta la chiave al guard e una frase dedicata.

## Verifica
- Nuovo banco browser permanente (`campo-hse-senza-scadenze.mjs`) che
  riproduce il caso vero della demo ("Anna Neri"/d4, zero righe in
  scadenzeScudo), filtrato su Squadra C: 4/4, controprova 1/4 KO voluto.
- Nessun modulo dati toccato: KPI invariato a 3155. `sintassi-pagine.mjs`
  34/34, `suite-collegate.mjs` 160 banchi/223 file, `giro-node.mjs` 41/41
  (asserzioni 4159, propagato), `numeri-nei-documenti.mjs` 43/0 (361
  banchi, 160 file distinti, propagato nei quattro documenti). Aggiunte
  anche le voci di roadmap mancanti per le due unità precedenti (Flotta
  csvGiriMacchina, Scudo statoAppalto) che erano state chiuse solo col
  checkpoint, senza narrativa in vault/ROADMAP_SETTIMANA.md.

## Stato roadmap
Coda dei deep-pass QA di background (task #5-#13 nel tracker di
sessione), tutti verificati dal vivo:
- #5 Flotta: fascia colore riga componenti a vita propria fissa.
- #6 (da investigare) crash `flotta-contatore.mjs --controprova`.
- #7 Conti: `emessoIncassato` non esclude fatture scartate SdI.
- #8 (solo documentazione) censire sovrapposizione Campo/Flotta
  `CAUSALI_FERMO` in `docs/MAPPA_ECOSISTEMA.md`.
- #9 Genesi: `stemB`/`subB` nel Validatore, falso allarme rosso.
- #10 Genesi: vista 3D raggi-X, carica fino al colletto se borraggio
  illeggibile.
- #11 Terra: `prospettoDenuncia` non annota "Residuo" come MASSIMO.
- #12 Deepwork ID: `admin.html` offre azioni sull'owner a un admin.
- #13 Sentinella: export `.ics` genera allarmi nel passato per elementi
  già in ritardo (programma di monitoraggio, adempimenti).

Un solo agente QA dispatchato in questo blocco (Sentinella terzo
angolo, tornato con #13); nessuno attualmente in corso. Da rilanciare
per mantenere ≥3 cantieri mentre si smaltisce la coda.

## Prossimo passo atomico
Implementare il fix Flotta della fascia colore componenti (task #5):
in `apps/flotta/index.html`, `disegnaScheda()`, riga ~4130 (blocco
`#sch-comp`), il contenitore della riga usa la classe fissa
`st-accent` invece di `striscia[clsVita[c.stato]]` (o equivalente) come
fanno le due liste gemelle `#sch-sca`/`#sch-man` due righe più sopra
nella stessa funzione. Isolare in una worktree fresca da HEAD,
verificare con Playwright (iniettare `vitaAttesaOre` più bassa su un
componente della demo, come ha fatto l'agente QA) + controprova prima
di committare. In parallelo, dispatchare 2-3 nuovi agenti di deep-pass
QA per mantenere ≥3 cantieri. Poi proseguire con l'investigazione
flotta-contatore (#6), Conti (#7), la censimento mappa (#8), Genesi ×2
(#9, #10), Terra (#11), Deepwork ID (#12), Sentinella .ics (#13).
Continuare "mai fermarsi".

## Blocchi
Nessuno.
