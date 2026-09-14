# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 15:46 UTC
- **Commit di partenza**: `18625e8b`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Nuova accensione della routine "Weekly Dev Session" (fuoco delle
15:45:23 UTC), stessa conversazione col fondatore aperta dalle 09:47.
Repository raggiungibile, `git pull` senza cambiamenti (`HEAD` già
allineato al remoto).

⚠️ **Stato particolare, invariato dai canarini precedenti**: il
fondatore ha chiesto *"hai riflettuto su come rendere Genesi simile ad
un CAD?"*, gli è stata rimandata una domanda di chiarimento (quale
asse: precisione/snap, layer, strumenti di disegno, o import/export
CAD) — **non ha ancora risposto**, sono passate circa sei ore. Finché
non risponde, non si scompone né si costruisce niente in quella
direzione.

⚠️ **Direttiva del fondatore in conversazione, più recente e più
specifica del prompt fisso di questa routine — CONFERMATA ANCORA
VALIDA per la sesta volta**: concentrarsi SOLO sull'app Genesi. Il
prompt fisso di questa accensione (ponti fra le app, lavoro multi-app
in parallelo, "Genesi NON esce dal browser") resta un template generico
non personalizzato — la seconda parte è anche **scaduta**, verificato e
documentato nel checkpoint `20260914-005111`: il gap è stato chiuso il
02/09.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` resta bloccato sul fondatore
(`docs/DECISIONI_WEEKEND.md`, sezione 6). Le soglie USBM/DIN restano
un'altra decisione aperta (sezione 9), invariata. Nessuna delle due è
stata toccata in questo blocco.

## Cosa è successo nel blocco in corso (dal canarino delle 13:48)

Otto unità di lavoro, tutte committate e pushate, working tree pulita:

1. Backlog di ricerca continua su Genesi riletto a fondo (sei sezioni,
   quattro già chiuse, due candidati dichiaratamente non costruiti per
   mancanza di dati — decking/air-decking, diametro critico esplosivo).
2. Voce **G46** aggiunta alla roadmap (frammentazione misurata via
   foto/image-analysis) — non costruita, tocca la regola SOLDI.
3. **B3** (censimento estrazioni) aggiornata: era ferma al 13/09 con 57
   estraibili, il lavoro G39-G43 di questo stesso blocco l'aveva
   portata a 61 senza che la riga lo registrasse.
4. Due errori propri trovati e corretti PRIMA del commit (con
   `git status` e `numeri-nei-documenti.mjs`, non dopo): un commit che
   aveva lasciato fuori due note già scritte; un `Edit` che aveva
   inghiottito la prima riga di una voce di roadmap successiva.
5. **Difetto reale trovato con una seconda verifica nel browser**: la
   riga di provenienza sotto "Confronta burden" (G44) scriveva "e da
   **da** litologia (Calcare)" — parola doppia. Corretto, e scritto un
   banco browser nuovo (`genesi-obiettivo-burden.mjs`, in `tutti.mjs`)
   che copre G38/G44 con una difesa che resta.
6. **G8, prima fetta**: confrontato il Report volata con la ricerca su
   che cosa contiene davvero un rapporto di volata — il solo gap reale
   (firma del responsabile del tiro, come nei moduli Pennsylvania/AS
   2187-2) colmato con tre campi da riempire a penna, verificato con
   screenshot nel browser vero.

Ogni unità verificata su `git worktree` isolata (`giro-node.mjs`, 40/0)
prima del commit, con cascata sui quattro documenti sorvegliati dove
serviva.

## In corso adesso

Il **giro completo del browser** (`tutti.mjs`), lanciato alle 13:44Z su
una copia congelata del commit `477ac992`, è **ancora in esecuzione**
alle 15:46Z — circa due ore, in linea con la durata tipica dichiarata
in CLAUDE.md. Il ramo è andato avanti di **3 commit** da allora, uno
solo dei quali tocca una superficie che il giro misura
(`apps/genesi/genesi.html`, la firma di G8 — già verificata a parte con
screenshot, quindi non è un problema se il giro non la vede). Non è
"decine di commit sulle superfici misurate": non vale la pena spegnerlo
e rilanciarlo, si aspetta che finisca.

## Prossimo passo atomico

1. Quando il giro del browser finisce: raccoglierlo, leggere quanti
   commit di scarto la sua sezione 0 dichiara, e correggere quello che
   trova con la stessa disciplina di oggi (misura, non deduzione).
2. Nel frattempo, se serve altro lavoro prima che il giro finisca o che
   il fondatore risponda: il backlog di ricerca e il censimento di
   estrazione risultano entrambi sostanzialmente esauriti — resta il
   fallback generico della roadmap, o una revisione di qualità su
   un'altra funzione recente (stesso schema di G38/G44).
3. Continuare ad aspettare la risposta del fondatore sulla domanda CAD
   — non presumerla, non costruire in quella direzione.

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
