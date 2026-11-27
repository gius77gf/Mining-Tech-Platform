# Checkpoint — 2026-09-18T13:48:21Z

## Tipo
unit-complete (correttivo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ed78d6e3 — fix: registrato il banco browser di Terra in tutti.mjs (mancava dal commit bc109da4)

## Cosa è stato completato
Il commit del fix di Terra (bc109da4) aggiungeva un nuovo banco browser
senza registrarlo nella tabella `BANCHI` di `tutti.mjs`. `suite-collegate.mjs`
esiste apposta per prendere questo caso, ma non l'ha visto **al momento
della verifica**, per lo stesso identico motivo già scritto in CLAUDE.md
sulla worktree ("sulla copia ci vuole `git add -A`, se no i file nuovi non
esistono") — qui applicato a un file NUOVO, non solo modificato: la
worktree isolata su cui avevo verificato il fix non aveva mai fatto `git
add` del banco, quindi `git ls-files` (da cui `suite-collegate.mjs` legge
l'elenco tracciato) non lo vedeva, e il controllo passava vacuamente.
Scoperto solo perché la worktree della UNITÀ SUCCESSIVA (Flotta), costruita
DOPO che il commit era stato pushato (quindi col file tracciato), l'ha
fatto cadere.

## Lezione di metodo (nuova, la più importante di questo blocco)
**Quando si verifica un file NUOVO su una worktree isolata, va sempre
`git add`-ato prima di lanciare il giro** — non solo per far vedere i file
alla worktree di `git diff --cached | git apply` (regola già scritta), ma
perché controlli come `suite-collegate.mjs` leggono l'elenco dei file
TRACCIATI (`git ls-files`), e un file copiato con `cp` ma mai aggiunto
all'indice è invisibile a quel controllo — che quindi non fallisce MAI,
dando un falso senso di sicurezza. La regola pratica: `git -C <worktree>
add -A` prima di ogni giro che verifica un file nuovo, non solo prima del
confronto `--cached`.
Ho applicato la stessa correzione anche al banco appena scritto per Conti
(`conti-modal-foot-listener.mjs`, coda di lavoro) PRIMA di lanciare il suo
giro, così non si ripete la terza volta.

## Verifica
`node apps/deepwork-id/tests/suite-collegate.mjs` passa (155 banchi in
`tutti.mjs`). Giro completo su worktree isolata: **41/41, 0 caduti**. KPI
invariato a 3153. 9-suite sum invariato a **3.649**. Asserzioni totali del
giro: **4152** (invariato). Banchi del browser: 349→**351** esecuzioni,
154→**155** file distinti, propagato nei quattro documenti che lo
dichiarano (DEVELOPMENT, STATO_PRODOTTO, DECISIONI_WEEKEND, ROADMAP).

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Conti — listener accumulato su `#modal-foot`** ("Scrivi il verbale"):
   fix scritto (`once:false`→`once:true`), nuovo banco browser
   `conti-modal-foot-listener.mjs` scritto e verificato mirato con
   controprova quantitativa (4 fires prima del fix, 1 dopo). **Già
   registrato in `tutti.mjs`** e già `git add`-ato sul main tree (applicando
   subito la lezione qui sopra). **Manca ancora**: costruire la worktree
   isolata, `git add -A` lì dentro, lanciare il giro completo, propagare i
   numeri, commit, push, checkpoint.
2. Due nuovi difetti verificati dai deep-pass QA appena tornati, non ancora
   implementati:
   - **Conti `margineMese`** (agente a0dcbb7a264c32e8d): non esclude le
     fatture scartate dallo SdI dal margine mensile per competenza — stessa
     guardia `statoSdi(f, oggi).nonEmessa` già propagata a
     kpiFrom/agingIncassi/fattureOltre90/esposizioneClienti/incassoAtteso/
     incassoPerMese, mai a questa. Verificato dal vivo: € 5.900 di una
     fattura scartata gonfiavano il margine di luglio 2026.
   - **Genesi Decking** (agente ae164109bbdd90b50): `renderScheda2D` usa
     `D2.stem` grezzo invece del valore guardato che `computeKPI` già
     applica allo stesso campo — un borraggio illeggibile (`null`) viene
     trattato come zero, disegnando un piano di carico fisicamente diverso
     (deck più lunghi, niente borraggio di testa) senza dire "non
     calcolabile".
3. La trappola del focus nella modale (`shared/dw-app-ui.js`) — non ancora
   iniziata.

## Prossimo passo atomico
Costruire una worktree isolata dall'HEAD corrente per il fix di Conti già
scritto sul main tree (`#modal-foot`), fare `git add -A` PRIMA del giro
(lezione di questo checkpoint), lanciare `giro-node.mjs`, propagare i
numeri, commit, push, checkpoint. Poi Conti/`margineMese` e
Genesi/Decking, ciascuno in worktree propria. Continuare "mai fermarsi".

## Blocchi
Nessuno.
