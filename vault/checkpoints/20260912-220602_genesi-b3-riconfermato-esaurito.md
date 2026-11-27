# Checkpoint — 2026-09-12T22:06:02Z

## Tipo
verifica di qualità (nessun difetto trovato, nessun codice cambiato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ad208e34` (nessun commit nuovo da questa unità: verifica pura)

## Completato

Per la regola "misura prima di irrigidire" (non fidarsi di una valutazione
precedente senza rimisurarla), ho riletto `genesi-estraibili.mjs --elenco`
con occhio fresco invece di accettare la conclusione del checkpoint
`20260912-175849` ("B3 esaurito dei candidati facili") per sentito dire.
Il tool elenca **47 funzioni** che leggono 1-2 variabili del modulo — un
numero che, visto isolato, sembrava un cantiere aperto più grande di
quanto il checkpoint precedente lasciasse intendere (quel checkpoint
aveva verificato esplicitamente solo 4 esempi: `selRoccia`, `selEsplosivo`,
`crestZ`, `rockFactorA`).

**Campionate altre tre funzioni dall'elenco** (`pfNominale`, `reliefCls`,
`isoPasso`) per vedere se il pattern regge oltre i 4 esempi già noti.
**Regge**: tutt'e tre sono wrapper di una riga che compongono funzioni
GIÀ estratte e GIÀ testate in `genesi-data.js` (`consumoSpecifico`+
`volumeForo` per `pfNominale`; `classeRelief` per `reliefCls`;
`passoIsocrone` per `isoPasso`), con un commento esplicito nel codice che
dichiara la scelta ("qui resta il legame con lo stato"). Estrarre questi
wrapper non aggiungerebbe copertura di test reale (la logica è già
provata nelle funzioni che compongono) e sposterebbe solo una riga di
lettura di `D2` da un file a un altro con un cambio di firma in ogni
chiamante — costo reale, valore marginale.

**Conclusione confermata, questa volta con un campione più ampio (7
funzioni su 47 controllate, non 4): il cantiere B3 è genuinamente
esaurito dei candidati a basso costo/alto valore.** Non è più solo
un'affermazione ereditata da un checkpoint precedente.

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

Nessuno nuovo. Blocco di sicurezza su geometria/flyrock/burden invariato.

## Prossimo passo atomico

Con B3 riconfermato esaurito e le quattro ricerche di fianco di questo
blocco tutte raccolte (nessuna tradotta in codice per scelta esplicita,
non per pigrizia), le strade che restano aperte sono:
1. Attendere la risposta del fondatore sulla segnalazione di sicurezza
   (`docs/DECISIONI_WEEKEND.md` §6) — resta il blocco principale.
2. Se serve altro lavoro nel frattempo: una revisione di qualità più
   ampia (screenshot a tappeto di tutte le schermate di Genesi, non solo
   quelle toccate in questo blocco), o attendere che la roadmap
   settimanale generale porti nuovo materiale.
