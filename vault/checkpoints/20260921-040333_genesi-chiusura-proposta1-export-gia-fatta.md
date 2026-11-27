# Checkpoint — 2026-09-21T04:03:33Z

## Tipo
verifica/documentazione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7975e1c6 (chore(vault): audit costoVolata/margine, nessun difetto trovato)

## Cosa è stato completato
Seguito il "prossimo passo atomico" (cambiare metodo dopo ~9 audit manuali
a vuoto): prima ho verificato se `tests/simulatore/cava-sintetica.mjs`
copre Genesi — **no** (`grep -n "genesi" apps/deepwork-id/tests/
simulatore/cava-sintetica.mjs` → una sola menzione in un commento sul
seme fisso; il generatore costruisce solo Scudo/Campo/Terra/Conti/Flotta/
Sentinella, una "cava che vive nel tempo": Genesi è un progettista di
singole volate, struttura diversa, non un candidato naturale per
l'estensione). Scartata l'opzione (b), senza modificare nulla.

Poi ho riletto `docs/RICERCA_CONTINUA_GENESI.md` (regola "legge prima di
proporre") cercando un candidato già verificato e non ancora chiuso, invece
di aprire una ricerca nuova con rendimento già in calo. Trovato: la sezione
del 19/09 "validazione pre-sparo" aveva una "⛔ RIVERIFICA" che diceva
**proposta 1 (avviso prima di esportare con indicatori gravi) scartata,
lasciata come candidato Medio, non implementata**.

- [x] **Verificato con `git log -S` prima di credere alla riga**: la
  proposta 1 **è stata implementata lo stesso giorno**, poche ore dopo la
  riverifica che la dichiarava non fatta — commit `8e49ccf2 feat(genesi):
  il semaforo di sintesi letto prima di esportare (G53)`, 2026-09-19T09:14:29Z.
- [x] **Verificato che copre tutt'e quattro gli export dichiarati nella
  proposta**: `fraseGraviExport()` (genesi.html:3645) concatenata al
  toast di successo in tutte e quattro le funzioni di export che portano
  il piano fuori dall'app — righe 3808 (scheda CSV), 5672 (piano di
  carico CSV), 5691 (piano fori DXF), 5755 (piano innesco XML). Zero
  mancanti.
- [x] **Verificato che non è il modale bloccante scartato**: è un
  suffisso non bloccante sullo stesso `toast()` — il download resta
  sincrono, quindi nessun banco esistente si rompe (il difetto di costo
  che aveva fatto scartare il modale, 24/91 prove cadute, non si
  ripresenta con questa forma).
- [x] **Verificato che esiste già un banco dedicato**:
  `apps/deepwork-id/tests/browser/genesi-semaforo-export.mjs`, registrato
  in `tutti.mjs` (righe 490-491, passata + controprova).
- [x] **Chiusa la riga in `docs/RICERCA_CONTINUA_GENESI.md`** con una
  sezione "✅ CHIUSA IL 21/09" che documenta la scoperta e i grep di
  verifica, così nessun cantiere futuro la riapra credendola ancora
  aperta (è la stessa famiglia di difetto raccolta più volte in
  CLAUDE.md: una riga che propone un lavoro già fatto lo fa rinascere
  finché nessuno la chiude).

## Verifica prima del commit
`RICERCA_CONTINUA_GENESI.md` non è fra i documenti sorvegliati da
`numeri-nei-documenti.mjs` o `documenti-invecchiati.mjs` (verificato:
`grep -n "RICERCA_CONTINUA_GENESI" apps/deepwork-id/tests/numeri-nei-
documenti.mjs apps/deepwork-id/tests/documenti-invecchiati.mjs` → 0
righe — è un registro di ricerca append-only, non uno dei quattro
documenti tracciati). Lanciati comunque entrambi per sicurezza sullo
stato generale dei documenti tracciati: **43/0** e **15/0**, verdi.
`giro-node.mjs` completo lanciato in background per la conferma finale
di fine blocco.

## Stato roadmap
Nessun codice di prodotto toccato in questa unità: è una correzione di
un documento di ricerca invecchiato, non un'unità di sviluppo. La
mappatura fra ricerca e codice per Genesi resta ora corretta (zero righe
aperte false).

## Prossimi passi
- **Prossimo passo atomico**: tornare a un'unità di sviluppo vera per
  Genesi. Con l'audit manuale a rendimento sceso e il simulatore
  sintetico non applicabile, la pista più produttiva resta leggere per
  intero UNI 9916 / ISEE guidelines (non solo riassunti WebSearch) — ma
  va prima verificato con WebSearch se un testo integrale è raggiungibile
  (sono standard tipicamente a pagamento: va misurato, non assunto, come
  impone CLAUDE.md sui "non si può"). In alternativa: scorrere
  `docs/RICERCA_CONTINUA_GENESI.md` per altre sezioni di ricerca con
  proposte NON ancora verificate con `git log -S` (lo stesso metodo usato
  qui), partendo dalle sezioni più vecchie non ancora rilette da quando
  sono state scritte.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
