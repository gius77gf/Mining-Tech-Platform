# Checkpoint — 2026-08-14 12:26 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `2bb62504` — canarino: il ciclo è vivo, quattro cantieri aperti
- `81a05dd0` — il censimento dei ripieghi non guardava `shared/`
- `87f8e568` — la pagina del fondatore dice che cosa è cambiato nei due fogli che ESCONO
- `efea9119` — ricerca(campo): il DELTA, fatto da chi ha il codice

## Che cosa è stato completato

**Il delta della ricerca, fatto da chi ha il codice — ed è la prova che la
regola del 14/08 era giusta.** Sei domande su dieci aperte e risposte con le
funzioni davanti: **cinque avevano già una risposta nel prodotto**, e in due
casi più severa di quanto la fonte del mondo pretendesse (il rifiuto di
calcolare quando i minuti di fermo superano la durata dichiarata; il
`provvisorio` a **tre** valori, dove il terzo è «non lo so»). Se il delta
l'avesse fatto la ricerca, oggi avremmo **cinque mancanze false su sei**.
⛔ E la mia prima ipotesi era falsa: dalla riga della dimostrazione avevo
concluso «in Campo la causale è testo libero». È un **elenco chiuso di nove
voci**, e quella riga ne era la quarta. L'ha presa **aprire `CAUSALI_FERMO`**,
non rileggere la frase.
Il solo candidato vero: in Campo l'elenco è di **stringhe** (l'etichetta fa da
chiave), in Flotta di oggetti — rinominare una voce in Campo **orfana lo
storico** e fa **scendere** la causale principale del Pareto senza dirlo.

**Il censimento dei ripieghi non guardava `shared/`** — non un'eccezione
dichiarata, un'assenza, nel posto che `CLAUDE.md` indica come il più
pericoloso. Entrano quattro moduli (15 → **19 superfici**). Esito onesto: **16
MESTIERE e ZERO ripieghi veri** al gradino 2, con la ragione scritta per
famiglia.

## Le verifiche che il ciclo non aveva fresche
- **Emulatori, tutte e quattro le suite**: regole di sicurezza **75**, SDK
  **19**, funzioni **21**, primo avvio **8** — **123, tutte verdi**. Serviva
  perché la correzione dei claims di stamattina tocca il trigger che riscrive i
  permessi: la barriera fra organizzazioni concorrenti va **rimisurata**, non
  dedotta.
- **Giro `node` in ORA ITALIANA** (`--tz`, su copia immobile): **72 comandi a
  posto, 0 caduti** — 36 in UTC e 36 in `Europe/Rome`. Il 01/08 due prove verdi
  in UTC erano cadute con l'orologio del cliente; oggi no.
- **Direttiva 7**: arretrato **8 commit, 0 che mordono**.
- **Le 19 decisioni**: riletta la pagina d'ingresso, non c'è niente di nuovo da
  prendere. Sette prese dal ciclo il 07/08, cinque prese e costruite, quattro
  ferme per natura (sicurezza o un file suo) e **mezza aperta** — la coda
  offline, che chiede a lui *chi vince quando due si incontrano al ritorno, e
  come lo diciamo a chi ha perso*.

## Che cos'è vivo
**Quattro cantieri** sul tema della settimana (Flotta 22 candidati, Conti 18,
Terra 19, Genesi 111) e un **giro mirato del browser**. Il disco è sporco per
costruzione: `run-kpi` sul vivo dà **2812 prove e 758 funzioni** contro le
2.790/755 committate — è il loro lavoro a metà, e infatti la verifica di
questa unità è girata sulla **copia di ciò che si committa**, non sul disco.

## Prossimo passo atomico
Raccogliere i quattro cantieri **uno per volta**: per ognuno l'indice si
costruisce da `HEAD` più il **solo suo blocco** in `run-kpi.mjs` (ci scrivono in
quattro: si separano i tratti del diff e si rimette insieme per controprova che
la divisione sia completa), poi worktree + `git apply` + `add -A`, giro `node`
sulla copia, documenti allineati al numero **misurato**, commit e push.

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies**, le **soglie di sicurezza** e
  **`dRecFreq` intero all'ingresso**: fermi al fondatore.
