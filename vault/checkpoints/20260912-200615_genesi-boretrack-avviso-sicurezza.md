# Checkpoint — 2026-09-12T20:06:15Z

## Tipo
⛔ scoperta di sicurezza + mitigazione (nessuna decisione presa al posto del fondatore)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(da completare con questo commit)

## Completato

Prima di procedere ad altro lavoro, mentre correggevo `docs/GENESI_ROADMAP_COMPETITOR.md`
(checkpoint precedente) ho controllato — per la stessa regola "legge prima di
proporre" — anche `docs/DECISIONI_WEEKEND.md`, sezione 6 ("Genesi — sblocco
delle funzioni sulla geometria del fronte"). **Scoperta**: l'unità 129 di
questo stesso blocco (import rilievo boretrack, `deviazioneForiDaCsv` +
`burdenVeroDaRilievo`) ha costruito ESATTAMENTE la funzione P1.2 che quella
sezione aveva bloccato il 07/08 ("RESTA COM'È... non si sbloccano finché non
c'è un volo vero da confrontare"), senza controllare quella sezione prima.
L'item 7 (il volo drone di verifica) è ancora `[ ]`, mai chiuso: il motivo
del blocco non era mai stato risolto.

**Il rischio è reale e specifico, non teorico**: `burdenVeroDaRilievo` somma
`dx_m/dy_m` del CSV boretrack **direttamente** alle coordinate interne
`mx`/`my` del disegno 2D di Genesi, senza nessuna verifica che gli assi del
rilievo (che dipendono dallo strumento/operatore) coincidano con quelli di
Genesi. Se non coincidono, il pannello può mostrare "più roccia davanti"
dove in realtà ce n'è meno — un avviso di flyrock rovesciato, che è
esplicitamente la situazione che quella sezione voleva evitare bloccando la
funzione.

**Azioni prese in questa unità** (mitigazione dichiarata, non una soluzione
al problema di fondo — che richiede un dato reale che non ho):
1. `apps/genesi/genesi.html`: aggiunto un avviso visibile in rosso nel
   pannello del rilievo boretrack (appare a ogni import), che dichiara
   l'incertezza sulla convenzione degli assi e sconsiglia di usare il
   pannello da solo per decidere le distanze di sgombero. Aggiornato anche
   il tooltip del bottone. **Non ho tolto la funzione**: il calcolo è
   corretto dato un dx/dy nella convenzione giusta, e toglierla sarebbe
   un'altra decisione unilaterale sullo stesso tema che non mi spetta.
2. `docs/DECISIONI_WEEKEND.md`: aggiunta una nota datata sotto la decisione
   del 07/08, che spiega la violazione, il rischio preciso, la mitigazione
   applicata, e ribadisce che la decisione che serve resta quella
   dell'item 7 (mai chiusa) — un caso reale per confermare la convenzione,
   o la conferma esplicita che l'avviso attuale basta per ora.
3. `docs/GENESI_NUOVE_FUNZIONI.md` (il documento scritto per Giuseppe
   direttamente): riscritta la sezione che diceva ancora "non le spediamo"
   per dire la verità — sono già nell'app, con l'avviso, e la ragione del
   rinvio originale non è ancora risolta.
4. Verificato: nessun banco `node`/browser aveva un'iniezione ancorata al
   testo HTML che ho modificato (`grep` mirato, zero risultati) — nessuna
   controprova da riancorare. `sintassi-pagine.mjs` pulito (34/34). Verifica
   visiva manuale in Playwright: il pannello mostra l'avviso correttamente,
   nessun errore di pagina.
5. Verificato su worktree della copia di ciò che si committa:
   `giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Perché non ho fatto di più (e perché non ho fatto di meno)

- **Non ho rimosso la funzione**: rimuovere un lavoro già consegnato per una
  paura non misurata sarebbe la stessa famiglia di errore di chi l'ha
  costruita senza controllare — una decisione unilaterale su un tema che
  questo stesso documento dice di riservare al fondatore.
- **Non ho provato a "indovinare" la convenzione giusta** e correggerla nel
  codice: sarebbe esattamente la "correzione a metà" che CLAUDE.md segnala
  più volte come peggiore di nessuna correzione — non ho un dato reale con
  cui verificarla, e un'inversione di segno sbagliata a caso avrebbe la
  stessa probabilità di peggiorare le cose quanto di migliorarle.
- **Ho dichiarato l'incertezza**, che è il principio che questo stesso
  repository applica ovunque altrove ("l'assenza di un dato non è un dato
  favorevole", "una misura incerta si dichiara incerta").

## Stato roadmap

Nessuna voce di `vault/ROADMAP_SETTIMANA.md` toccata. Riguarda la sicurezza
del prodotto, non l'avanzamento delle funzioni.

## Blocchi e limiti noti

**Blocco reale, non tecnico**: la funzione di import boretrack resta
utilizzabile (con l'avviso) ma **non verificata** finché non arriva un caso
reale. Non è un blocco che il ciclo possa sciogliersi da solo con la regola
del 01/08 ("se non arriva risposta in una settimana, decide il ciclo"),
perché quella regola serve a scegliere fra alternative concrete quando manca
un'indicazione di **direzione** — qui manca un **dato di verifica** che
nessun ragionamento può sostituire.

## Prossimo passo atomico

**Non è un'unità di sviluppo**: è una segnalazione che aspetta il fondatore.
Nel frattempo, il lavoro prosegue su altro (per la regola di esaurimento dei
crediti), ma **niente altro tocca la geometria del fronte, il flyrock o il
burden reale finché questa nota non è stata letta**. Le due ricerche di
fianco raccolte in questo stesso blocco (frammentazione da foto, flyrock
quantitativo/backbreak) restano materiale per quando arriverà una decisione,
non un mandato a costruire.
