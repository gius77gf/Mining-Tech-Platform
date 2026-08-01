# La detrazione che ho progettato e non ho collegato

**Data:** 01/08/2026 · **Area:** progetto in scratchpad + `docs/DECISIONI_WEEKEND.md`
**Unità precedente:** `20260801-074500_la-difesa-che-viveva-in-scratchpad.md`

## Il punto di partenza

`baseOnereEscavazione` accetta `volumeDetrattoM3` e **nessuno può scriverlo**.
Il passo dichiarato era: fare il campo. Prima, il passaggio che `CLAUDE.md`
pretende — **progettare in scratchpad**, non nel modulo.

## ⛔ Il primo istinto era sbagliato, e la risposta era in casa

L'istinto: «è un dato per anno, e Terra non ha un'entità anno — quindi ne serve
una nuova». Due minuti di ricerca prima di inventarla:

- i **lotti** di Terra hanno già `recuperoIniziatoIl`, `recuperoFinitoIl`,
  `collaudatoIl` e gli stati `in-recupero` / `recuperato` / `collaudato`;
- la **prescrizione dell'atto**, in dimostrazione, dice testualmente «Recupero
  ambientale contestuale alla coltivazione, **lotto per lotto**».

Quindi il materiale rimesso non è un numero libero per anno: è il volume rimesso
**su un lotto**, e l'anno si ricava dalla sua data. Un campo `volumeRecuperoM3`
sul lotto, e nessuna entità nuova. È la quinta volta in tre giorni che la
risposta era già in casa.

## Il prototipo, e i due casi che ha bocciato

5 prove su 5 in scratchpad (`prova-recupero.mjs`), e due sono state scritte
**dopo** aver visto il progetto sbagliare:

1. **un lotto che ha finito il recupero e nessuno ha scritto quanto materiale ci
   è andato.** La somma parziale sarebbe una detrazione che *sembra* completa:
   adesso la risposta porta `completa: false` e l'elenco dei lotti scoperti.
   `+null` fa **0** e `Number.isFinite(0)` risponde **true** — la trappola di
   sempre, e qui produceva una detrazione tranquilla;
2. **un anno senza nessun recupero** → `volume: null`, non `0`.

## ⛔ E perché mi sono fermato prima di collegarla

La nota della pagina, che c'era già ed è vera: *«**diverse** regioni applicano
la tariffa al volume al netto del materiale usato per il recupero»*. **Diverse,
non tutte.**

L'errore non è simmetrico:

| | effetto |
|---|---|
| detrarre dove **non** è ammesso | il foglio all'ente dichiara **meno del dovuto** |
| non detrarre dove si potrebbe | il cliente paga di più |

Il secondo è spiacevole. Il primo un ispettore non lo legge come una svista. E
`CLAUDE.md` è esplicito: le cose che cambiano da regione a regione non si
cablano, e le soglie che toccano la conformità non si muovono senza il
fondatore.

Quindi il campo **non l'ho scritto nel modulo** e la detrazione **non l'ho
collegata** all'onere. Ho scritto la **decisione 18**, con dentro la parte già
risolta (dove sta il dato) separata da quella che tocca a lui (se si applica, e
a quale anno conta un recupero a cavallo di due anni).

⚠️ La tentazione era forte, perché il codice era pronto e funzionava. Ma un
progetto finito non è un'autorizzazione a spedirlo: `baseOnereEscavazione`
continua ad accettare il parametro e a comportarsi bene se un giorno arriverà.

## Verifica

Prototipo 5/0. `numeri-nei-documenti` 17/0 dopo aver allineato i conteggi:
le decisioni passano da 17 a **18** e le caselle da 23 a **25** — corrette in
tutt'e due i posti (il documento e l'estratto della roadmap, che è la lista che
il fondatore guarda davvero: era già successo che mostrasse meno di un quarto
delle decisioni).

## Prossimo passo atomico

Le **anagrafiche `cantieri` e `vettori` di Conti insieme alla pagina del DDT** —
l'unico buco di **dati** rimasto dei cinque documenti prioritari, e l'unica voce
di quella lista che non aspetta una decisione. La decisione di non fondere i
`cantieri` di Conti con quelli di Scudo è già presa e scritta
(`20260801-062000`): sono due cose diverse, e fonderle farebbe comparire gli
indirizzi di consegna fra i siti con obblighi di sicurezza.
