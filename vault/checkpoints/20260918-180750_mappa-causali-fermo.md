# Checkpoint — 2026-09-18T18:07:50Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a17ec47d

## Cosa è stato completato
Task #8: censita in `docs/MAPPA_ECOSISTEMA.md` (nuova sezione 3k) la
sovrapposizione Campo/Flotta `CAUSALI_FERMO`. Verificato dal codice: Campo
9 voci (fermo di un'attività di turno, `campo.attivita`), Flotta 10 voci
(fermo di una macchina, `flotta.fermi`); zero letture reciproche in
entrambe le direzioni (`leggiApp` di Campo non chiama mai `flotta`;
`appId:` di Flotta non cita mai `campo`).

Spiegato perché NON va costruito un ponte che fonde le due liste: sono due
eventi di mestiere diversi che possono capitare insieme senza essere la
stessa causale (criterio già scritto in
`docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md`: se togliendo una copia
qualcuno perde qualcosa, non sono la stessa regola — qui si perde). Il
collegamento sensato — puntare da un fermo di turno di Campo al fermo
macchina di Flotta che lo spiega — richiede prima un `mezzoId` su
`campo.attivita`: è una decisione di prodotto, non un canale tecnico, e
resta censita, non costruita.

Corretta anche una premessa del backlog QA che si è rivelata falsa
verificandola nel testo: Campo↔Flotta NON è l'unica coppia a zero letture
reciproche sulla mappa a 16 direzioni — lo sono anche altre otto coppie
(Conti↔Scudo, Conti↔Sentinella, Conti↔Genesi, Flotta↔Terra,
Flotta↔Sentinella, Flotta↔Genesi, Scudo↔Genesi, Sentinella↔Terra),
verificato rileggendo la tabella di §1 riga per riga.

Solo documentazione: nessun file di codice toccato. Aggiornato il conto in
fondo al documento (sovrapposizioni non collegate: 2→3) e la nota di
verifica finale con l'hash del commit contro cui è stata scritta.

## Verifica
- Grep citati nel documento rilanciati e confermati identici a quanto
  scritto (`leggiApp(` in campo-data.js, `appId:` in flotta-data.js/
  index.html).
- Conteggio voci delle due liste rifatto con uno script Node isolato sul
  blocco `export const CAUSALI_FERMO … ];` di ognuna: 9 e 10, confermati.
- Non essendo un cambio a codice o a numeri di test, non tocca
  `numeri-nei-documenti.mjs` né gli altri quattro documenti tracciati
  (MAPPA_ECOSISTEMA.md non è nel loro elenco).

## Stato roadmap
Task #8 chiuso. Prossimo task del backlog: #9 (Genesi, Validatore
stemB/subB — falso allarme rosso se `D2.stem`/`D2.sub` è illeggibile,
perché `null` diventa 0 nella divisione invece di "non calcolabile"; la
riga gemella "Confin. colletto (SDOB)" due righe più sotto gestisce già
questo caso correttamente via `confinamentoColletto`).

Backlog rimasto dopo #9: #10 (Genesi 3D X-ray borraggio illeggibile), #11
(Terra prospettoDenuncia residuo senza massimo), #12 (Deepwork ID
admin.html canManage su OWNER), #13 (Sentinella .ics con VALARM nel
passato), #15 (Scudo organigrammaSicurezza senza-data), #16 (Genesi
popup/tooltip tDet invece di tNom), #17 (Genesi import .volata.json
ignora esplosivo/innesco). In corso in background: due agenti QA (Terra,
Flotta) lanciati subito dopo la chiusura del task #7.

## Prossimo passo atomico
Aprire `apps/genesi/genesi.html` intorno a `renderScheda2D` (righe
~6604/6705/6976 dal backlog), leggere come `stemB`/`subB` vengono
calcolati da `D2.stem`/`D2.sub`, confrontare con `confinamentoColletto`
(la funzione gemella che gestisce già il caso illeggibile) e correggere
propagando la stessa guardia. Scrivere test in scratchpad prima di
toccare il modulo, poi unità completa con controprova, banco se serve,
verifica su worktree isolata, propagazione dei numeri nei quattro
documenti se il conteggio prove cambia.

## Blocchi
Nessuno. Procedere subito con #9 per la regola di non fermarsi.
