# Checkpoint — 2026-09-05T17:52:15Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5fcea8b4 — Tutti i documenti delle sei app, sulla dimostrazione, senza browser —
110 in due secondi, con la controprova

## Completato
`apps/deepwork-id/tests/documenti-dimostrazione.mjs`: 110 documenti composti
con gli argomenti dei bottoni, cinque prove (si compongono, non vuoti,
niente «undefined»/«NaN»/«null», nessun «1 rilievi», denominatore), la
misura delle celle tranquille (117 in 13 documenti, `--dimmi`),
`--controprova` che sporca sei documenti e pretende due cadute. In
`npm test` e nel giro: 40 comandi, asserzioni 3.636. Una riga in CLAUDE.md
(Test). Giro `node` sulla copia: 40 comandi a posto. Pin: comandi 38 → 40,
asserzioni 3.636; prove 3.198 e copertura 890/890 invariate.

## Stato roadmap
Voce `[x]` «TUTTI I DOCUMENTI DELLE SEI APP, SULLA DIMOSTRAZIONE, SENZA
BROWSER» in coda alle voci del 05/09, con la riga ⏱️ sui 117 candidati.

## Prossimo passo atomico
I 117 candidati «tranquilli», uno per uno:
`node apps/deepwork-id/tests/documenti-dimostrazione.mjs --dimmi` elenca i
13 documenti; per ognuno si stampa la riga con lo zero e ci si chiede se lo
zero è MISURATO o è un'assenza. Primo sguardo già fatto su tre: in
`csvProspettoDdt` lo `sconto_pct;0` è uno sconto non scritto (= nessuno
sconto: vero), `stornato;0` e `ddt;0` sono conti; in
`csvSituazioneFatture` `incassato;0` su una fattura aperta è vero. Da
guardare per primi: `csvStorico` (43: le giornate senza registrazioni —
dichiarate?), `csvRiepilogoAnno` (20: i mesi a zero sono la forma del
modulo, ma il totale?), `csvRegistroInfortuni` (5), `csvRiepilogoNearMiss`
(3), `csvAppello Pomeriggio` (1), `csvRicambi` (1), `csvGiriMacchina` (1),
`csvProspettoPreventivi` (6), `csvProspettoIncassi` (3). Ogni zero che
risulta un'assenza → cella vuota o parola, prova in run-kpi, e la misura
del banco scende: si scrive il numero nuovo nella voce di roadmap.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
