# Checkpoint — 2026-09-12T12:41:13Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f3f7013a

## Cosa è stato completato (unità 125)

Continuando dal "prossimo passo" del prompt fisso della routine (i
ponti fra le app / le app in profondità), ho riletto l'entry **B4** di
`vault/ROADMAP_SETTIMANA.md`, che segnalava un buco reale: il bottone
`btn-piano-export` di Campo (l'export del consuntivo di carico verso
Genesi) era l'UNICO su 39 punti d'uscita censiti in tutto l'ecosistema
senza un banco del browser che lo premesse — un rischio concreto, perché
è esattamente il tipo di bottone la cui rottura silenziosa (nome
sbagliato, gestore morto) è già costata giorni di produzione in Terra e
Flotta (episodi documentati altrove in questo file).

La riga diceva ancora **"da fare"**, con la nota "non fatto in questa
unità... serve la fixture del piano, è un'unità sua". Aprendo
`apps/deepwork-id/tests/browser/campo-numeri-tranquilli.mjs` ho trovato
che la sezione esiste **già**, completa (righe 807-978): fixture di 5
fori con un caso senza carica reale, il round-trip fino al lettore di
Genesi, i casi limite di testo (punto e virgola, virgolette, decimali).
Rilanciata a mano per non fidarmi del codice sorgente da solo:
**94 verifiche passate, 0 fallite**.

Questo è un caso di **documento invecchiato nel verso "non ancora
fatto"**: qualcuno ha completato il lavoro in un cantiere successivo
senza tornare ad aggiornare questa riga specifica — la regola 7 di
questo stesso file ("chi chiude un'unità aggiorna il documento che
gliel'aveva proposta") violata nel senso opposto a come di solito viene
raccontata qui (di solito è un "non c'è" che si scopre falso; qui era un
"non fatto" che si scopre falso). Corretto con una nota ✅ datata,
seguendo la convenzione append-only del documento — la riga originale
resta, come cronaca.

Verificato con `giro-node.mjs` su worktree pulita (commit di sola
prosa, nessun test/codice toccato): **40 comandi a posto, 0 caduti,
exit 0**.

## Stato roadmap

Corretta l'entry B4 (il quinto bottone) e la sua nota sul denominatore
("39 bottoni, 1 senza banco"). Resta `[ ]` perché B4 è una lista più
lunga di mancanze, di cui questa era solo una voce.

## Blocchi
Nessuno.

## Prossimo passo atomico

Il giro del browser mirato lanciato dopo l'unità 123 (Genesi +
Sentinella, `--solo=unita-maiuscole,modali-dentro,pagine-vive,
csv-dimostrazione,disegni,contrasto`) potrebbe essere ancora in corso:
verificare con `ps` sul pid registrato in
`$SCRATCHPAD/giri/ultimo-log.txt`, e leggerlo con `leggi-giro.mjs`
appena finito. Poi continuare a scorrere B4 (altre mancanze del delta
elencate più sotto nella stessa entry) o le altre voci `[ ]` (B12, B0-bis,
B0, C2, E-serie, Q1). Data l'estensione di questa sessione (7 unità
completate: 119-125), se il ciclo automatico dovesse compattarsi,
riprendere esattamente da qui — questo è il checkpoint più recente.
Mai fermarsi.
