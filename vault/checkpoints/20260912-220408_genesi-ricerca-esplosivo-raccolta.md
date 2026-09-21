# Checkpoint — 2026-09-12T22:04:08Z

## Tipo
ricerca di fianco raccolta (nessun delta di codice — per scelta, non per blocco)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f8f9da60`

## Completato

Raccolta in `docs/RICERCA_CONTINUA_GENESI.md` la ricerca di fianco lanciata
nell'unità precedente: criteri pratici di selezione del tipo di esplosivo
(ANFO/heavy ANFO/emulsione/gelatina) in base ad acqua, roccia, diametro,
holding time, costo; il coupling ratio; l'assenza (nei quattro software
commerciali cercati) di un vero advisor automatico di selezione.

**Perché non è stata tradotta subito in un delta di prodotto**: quasi ogni
numero specifico trovato è dichiarato dalla ricerca stessa come **fonte
singola non incrociata** (tabella dedicata "regola/valore/fonte/confermato
da 2a fonte?" nel documento). La regola di questo repository è chiara:
"niente entra in roadmap sulla parola dell'agente" e "un numero... di
seconda mano è peggio di un numero assente" — costruire un testo d'aiuto
nel catalogo esplosivi di Genesi citando queste cifre senza prima
riverificarle su una seconda fonte indipendente sarebbe esattamente
l'errore che CLAUDE.md documenta più volte. Il materiale resta disponibile
per quando (se) qualcuno vorrà investire il tempo di riverifica.

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

Nessun blocco nuovo. Resta valido il blocco di sicurezza su geometria del
fronte 3D/flyrock/burden reale (`docs/DECISIONI_WEEKEND.md` §6).

## Riepilogo dell'intero blocco (unità 132-136 + audit + ricerche)

Per chi riprende da qui dopo una compattazione: in questo blocco sono
state chiuse due famiglie di lavoro importanti oltre alle unità di
prodotto (126-131, nel blocco precedente):
1. **La famiglia "splash lento"**: 66 falliti pre-esistenti su 4 banchi
   browser di Genesi, tutti la stessa causa (avvio senza GPU più lento di
   quanto i banchi aspettassero), tutti chiusi e verificati con controprova.
2. **La scoperta di sicurezza sul rilievo boretrack**: un gate di sicurezza
   del 07/08 (mai risolto) violato da un'unità di questo stesso blocco;
   mitigato con un avviso onesto nell'app, non con una correzione
   indovinata; propagato a quattro documenti che contenevano la stessa
   affermazione scaduta; verificato visivamente a tre larghezze.
3. **Quattro ricerche di fianco raccolte** (frammentazione da foto, flyrock
   quantitativo/backbreak, criteri di selezione esplosivo, più il
   confronto formula-per-formula che ha verificato Lundborg come esatto
   nel motore di Genesi) — nessuna tradotta in codice prodotto per scelta
   esplicita (blocco di sicurezza per le prime due, fonti troppo deboli
   per l'ultima), tutte disponibili per il futuro.

## Prossimo passo atomico

Con la ricerca raccolta e nessun delta a basso rischio rimasto senza
inventare o citare fonti deboli, le strade aperte sono:
1. Attendere una risposta del fondatore sulla segnalazione di sicurezza
   (`docs/DECISIONI_WEEKEND.md` §6) — è il blocco più importante aperto.
2. Una nuova ricerca di fianco su un angolo Genesi genuinamente non
   coperto, se se ne trova uno che non rischi di ripetere lo stesso esito
   (fonti tutte deboli) delle ultime due ricerche.
3. Tornare a controllare se il cantiere B3 (funzioni estraibili) ha
   davvero esaurito i candidati, con uno sguardo fresco invece di fidarsi
   della valutazione precedente (`genesi-estraibili.mjs --elenco`).
