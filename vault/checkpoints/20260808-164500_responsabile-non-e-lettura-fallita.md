# Checkpoint — 2026-08-08 16:45 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`48450a2` — fix(sentinella): «responsabile da assegnare» era detto anche a una
lettura fallita

## Che cosa è stato completato

Un difetto **vero nel prodotto**, e sta esattamente sul filo della settimana —
*un'etichetta tranquilla dove non è stato misurato niente*.

In Sentinella il responsabile di un'azione correttiva si ricava cercando il suo
id nell'elenco dei lavoratori che arriva **da Scudo**. Il ponte diceva:

    lavoratori: () => read("lavoratori").catch(() => [])

Cioè una lettura fallita — rete, permessi, l'altra app non raggiungibile —
diventava **«non c'è nessuno»**. Misurati i tre stati affiancati, **due erano
indistinguibili**:

| stato | quello che si leggeva |
|---|---|
| Scudo letto, e il responsabile c'è | «responsabile Mario Rossi» |
| Scudo letto, e davvero non c'è nessuno | «responsabile da assegnare» ✔ vero |
| **Scudo NON letto** | «responsabile da assegnare» ⛔ **falso** |

La terza riga è un'affermazione **sull'azione** mentre il fatto riguarda **la
nostra lettura**: quell'azione un responsabile ce l'ha, e chi legge quella riga
può riassegnarla a un altro.

**La correzione.** `ponteScudo` restituisce `{lista, leggibile}` e
`descriviResponsabile` **legge** la bandiera — regola 20: una non-misurabilità
dichiarata e non letta non protegge niente. Quattro stati distinti, non due:

- id assente → «responsabile da assegnare» (vero);
- id e nome trovati → il nome;
- **id presente, elenco non leggibile** → «responsabile assegnato, il **nome**
  non si legge da Scudo», stampato **in neretto**, perché è un non-so e non un
  fatto;
- id presente, elenco leggibile, persona non trovata → «**non più in
  anagrafica**», che non è «da assegnare»: qualcuno era stato scelto.

E la modale non toglie più il campo in silenzio quando l'elenco è vuoto perché
illeggibile: **dice perché** non si può assegnare da qui.

## Come è stato verificato

- `run-kpi` **1908 → 1910**, 0 falliti (il totale è **salito**, non solo «zero
  rossi»).
- **Controprova che morde**: rimesso il comportamento vecchio, la prova cade con
  «*elenco NON leggibile: la frase si dichiara non nota: atteso false, ottenuto
  true*». File ripristinato da una copia `cp`, **non** da `git checkout`.
- Scatti **guardati**, non solo prodotti, con la **schermata visibile
  dichiarata** (`page-dash`): la modale con la nota nuova, e la riga del ponte
  nei due stati.
- Giro `node` **verde sulla copia di ciò che si committa** (worktree da `HEAD`
  + `git diff --cached | git apply` + `add -A`, diff identico): **27 comandi, 0
  caduti**.
- Numeri dei documenti rimisurati e corretti dove il controllo li sorveglia:
  **2.350 → 2.351** prove, copertura **710 → 711**.

## Il limite dichiarato

Lo stato «id presente ed elenco non leggibile» **in dimostrazione non si
raggiunge premendo i bottoni** — non si sceglie un nome da un elenco che non si
legge. Quindi la sonda fa costruire il record **alla pagina** (bottone vero,
modale vera, conferma vera) e poi gli aggiunge l'id: che è esattamente ciò che
in produzione lascia un'azione aperta quando Scudo **era** leggibile e adesso
non lo è. In dimostrazione Scudo non si interroga affatto, quindi la frase che
si vede sempre è quella del **non leggibile**.

## Il censimento, e il risultato onesto

La stessa forma è stata cercata **altrove, e non è sparsa** — al contrario di
quello che mi aspettavo:

- `apps/campo/index.html:1885-1886` usa `.catch(() => null)`, e sotto
  `leggiScudo` (campo-data.js:2951) **cattura già dentro** restituendo `null`:
  «non lo so» resta diverso da «non ce n'è», e il commento del ponte lo dichiara;
- `apps/conti/index.html:4548` tiene `RIL = null` distinto dalla lista vuota, e
  lo stato `no-terra` scrive testualmente che Conti **non se lo inventa**.

Quindi **Sentinella era l'unico posto**, e questo va scritto senza gonfiarlo:
il censimento non ha aperto un secondo cantiere.

## Stato roadmap

Spuntata la riga nuova in fondo a `vault/ROADMAP_SETTIMANA.md` con l'hash
`48450a2`. Resta aperta e **non pre-emptibile** la parte di prodotto della
decisione 5b (se accendere la coda offline, chi vince e come lo si dice a chi ha
perso): è una scelta del fondatore.

## Prossimo passo atomico

Raccogliere il **giro del browser** ancora in corso (PID 16670, avviato ~5h fa,
registro `scratchpad/nomi4/giro-nuovo.txt`, **ancora in crescita**: verificato
due `stat` a 20 s di distanza, 589364 → 590271 byte) con

    node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>

leggendo **la sezione 1 prima della 2**, e in particolare le righe «non ho
guardato» **prima dei KO**. ⚠️ Quel giro attesta `c3888fe`: **nessuna** delle
unità di oggi ci sta dentro. ⚠️ E nel registro il rosso di una **controprova** è
il verde del banco — l'intestazione adesso lo dichiara, ma va letta.

## Blocchi

Nessuno.
