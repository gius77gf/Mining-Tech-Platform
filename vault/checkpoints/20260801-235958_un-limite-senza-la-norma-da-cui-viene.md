# Un limite senza la norma da cui viene

**Data:** 01/08/2026 · **Area:** `apps/sentinella/sentinella-data.js` (dimostrazione), banco degli stati
**Unità precedente:** `20260801-235955_il-ricettore-di-cui-non-si-sa-quanto-e-lontano.md`

## Il terzo e ultimo stato vero del censimento

Nella tabella «previsto, misurato e scarto» del report per l'ente, l'ultima
colonna riporta il **limite dichiarato sul progetto** e — accanto — **la norma
da cui è stato preso**. È il riferimento di contesto che permette a chi legge di
capire da dove viene quel numero. Un limite **senza** la sua norma è un numero
senza provenienza, e il report lo dichiara invece di lasciar credere che la
citazione ci sia.

Non lo vedeva nessuno: l'unica volata con previsione (`b3`) la norma ce l'aveva.

Aggiunta `b5`, una volata eseguita con previsione fatta a mano, limite
dichiarato e **norma vuota**. Assenza, e additiva: porta tutti i suoi numeri,
quindi non cambia neanche il conto delle righe incomplete della tabella sopra.

## ⚠️ Il banco guardava dove non c'era

Prima esecuzione: **caduta**. Non per un difetto della pagina — la frase c'era,
alta 42 pixel — ma perché vive in `<span class="fonte">`, e `.fonte` non era fra
i selettori del banco.

È la **terza volta oggi** che un selettore mancante fa cadere un caso giusto
(prima `.count`, poi `.rep-punto-meta`), e le tre volte insieme dicono una cosa
sola: **l'elenco dei selettori è la dichiarazione di dove il banco ha guardato**,
e finché resta corto ci sono posti dove non guarda nessuno. `.fonte` è per
mestiere il posto dove il prodotto scrive **da dove viene un numero** — quindi
anche dove dice che una provenienza non ce l'ha.

## La controprova

Tolta la dichiarazione (il ramo senza norma sparisce, resta solo «norma citata
sul progetto: »): il limite senza provenienza non dice più niente, e il banco
cade sul caso giusto.

## Verifica

`stati-non-misurati` **83/0** — 48 stati cercati, 6 app (erano 82/0 e 47).
`run-kpi` 1123/0, `run-demo` 8/0.

## Prossimo passo atomico

⛔ **I tre stati veri del censimento sono chiusi**, quindi questo filone è
finito: quello che resta nella classifica sono i **ripieghi di campo già
dichiarati** in `docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md`, e riaprirli
sarebbe far crescere il banco di prove che non difendono niente.

Il passo successivo **non** è un'altra riga del banco: è tornare alla roadmap.
Prima però conviene una verifica che oggi non è mai stata fatta per intero — il
**giro completo del browser** (`tests/browser/tutti.mjs`, 39 banchi): la
giornata ha toccato le dimostrazioni di **cinque app su sei** e i banchi
girati sono sempre e solo `stati-non-misurati`. Un giro intero dice se qualcosa
si è rotto altrove, ed è l'unica cosa che nessuna delle prove `node` può dire.
