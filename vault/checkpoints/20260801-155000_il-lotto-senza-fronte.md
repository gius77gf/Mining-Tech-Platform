# Il lotto senza fronte, e la prova che non distingueva

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-152000_l-ordinamento-tranquillo.md`

## Il quarto dei cinque

Un **lotto che non dichiara nessun fronte** non ha volume zero: non ha un modo
di essere misurato. Senza il collegamento ai fronti non si sa quali rilievi lo
riguardino. La riga scrive **«misurati —»**, non «misurati 0 m³» — perché su un
lotto lo zero si legge «non ci abbiamo ancora lavorato», e la verità è un'altra.
In dimostrazione sono **tre lotti su sei**.

## ⚠️ E la prima versione della prova non distingueva

Rimesso il difetto (`m3: 0, misurabile: true` invece di `null/false`), il banco
**restava verde**. Non era difesa in profondità: era la prova a non provare.

`«misurati —»` compare **anche su un lotto che il fronte ce l'ha ma non ha
ancora rilievi** — un caso legittimo e diverso. Cercando solo quella frase, i
dati facevano coincidere la risposta giusta con quella sbagliata: **caso 1**
della tassonomia di `CLAUDE.md`. Si correggono i **dati della prova**, non il
codice.

Adesso la riga nomina il lotto: `/Lotto 1[\s\S]*misurati\s*—/i` — «Lotto 1» è
uno dei tre senza fronte. Rimesso il difetto, **cade**.

⚠️ È la seconda volta stanotte che una prova nuova nasce incapace di
distinguere, e tutt'e due le volte se n'è accorta **solo la controprova**. Senza
quel passaggio sarebbero due righe verdi che non guardano niente.

## Il `vietato`, anche qui

Non basta che compaia «misurati —»: accanto **non ci deve essere** «misurati
0 m³» sullo stesso lotto. Stessa forma di Sentinella e Terra/scavo: dire «non lo
so» e scrivere accanto un numero che sembra una misura è il difetto, non la sua
assenza.

## Verifica

Banco **46/0** — 21 stati, sei app. `run-kpi` 1120/0, `run-stile` 271/0,
`suite-collegate` 46 file. Controprova: rimesso lo zero, cade sul caso giusto;
ripristinato e `git status` vuoto.

## Dove siamo con i cinque

| # | stato | esito |
|---|---|---|
| 1 | Flotta · tagliando a ore senza ritmo | ✅ sotto guardia |
| 2 | Conti · fattura senza scadenza (aging) | ✅ sotto guardia |
| 3 | Conti · «non si sa entro quando» | ✅ sotto guardia — **ed era un difetto vero**, un ordinamento che nascondeva |
| 4 | Terra · lotto senza fronte | ✅ sotto guardia |
| 5 | Flotta · «Quando cadrà non si sa: …» | ⏳ resta |

## Prossimo passo atomico

L'**ultimo dei cinque**: Flotta, «Quando cadrà non si sa: …» con la ragione
(«di questo mezzo non c'è nessuna lettura del contatore con la sua data»). Sta
nel dettaglio di una manutenzione, quindi va prima trovato a schermo — e vale
la pena chiedersi, come per la fattura di Conti, se non compare per un
**filtro** o per un **ordinamento**, che è stata la sorpresa più utile di
questo filo.
