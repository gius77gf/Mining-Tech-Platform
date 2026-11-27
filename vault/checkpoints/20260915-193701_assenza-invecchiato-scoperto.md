# Checkpoint — 2026-09-15T19:37:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d2275b29

## Cosa è stato completato
Unità 53: invece di lanciare una ricerca nuova, ripreso
`docs/RICERCA_CONTINUA_ASSENZA.md` (uno dei quattro temi trasversali,
fermo dal 04/08-13/08 — oltre un mese) per verificare se le sue
proposte P1-P4, mai tradotte in codice, fossero ancora valide prima di
agire. La sezione D2 elenca otto lettori CSV "MUTI" (scartano righe
con un dato mancante senza dichiararlo, quindi la pagina non può mai
dire "N righe scartate"): fra questi, `terra/rilievi`.

Verificato di persona (non sulla parola del documento, applicando la
stessa regola "niente entra sulla parola dell'agente" ai documenti
vecchi quanto alle ricerche fresche): `terra-data.js:2371` ha già
`scartiRilieviCsv`, che riporta esattamente gli scarti con la ragione,
ED È GIÀ chiamata in `apps/terra/index.html:4804`
(`const scartate = scartiRilieviCsv(testoRil);`). **Il documento è
invecchiato su almeno una delle sue otto voci.**

Dato che tutte e sei le app hanno pattern `scarti<Nome>Csv` diffusi
(18 funzioni censite con un grep a tappeto — `campo`, `conti`,
`flotta`, `scudo`, `sentinella`, `terra` ne hanno tutte almeno due),
è plausibile che il documento sia invecchiato su più di una voce, non
solo terra/rilievi. Lanciato un agente dedicato per riverificare
sistematicamente le altre sette voci (comando grep + chiamata reale
nella pagina, per ciascuna) prima di tradurre P1-P4 in codice — le
proposte del documento vanno rilette alla luce di quanti "muti" sono
davvero rimasti, perché il loro "dove" potrebbe essere molto più
piccolo di otto.

Nessuna modifica al file `RICERCA_CONTINUA_ASSENZA.md` in questa
unità: la correzione completa arriverà dall'agente in background, per
evitare due scritture parziali e sovrapposte sullo stesso file.

## Verifica
- Grep diretti (non tramite agente): `grep -n "^export function
  scartiRilieviCsv" apps/terra/terra-data.js` → riga 2371; `grep -n
  "scartiRilieviCsv(" apps/terra/index.html` → riga 4804, chiamata
  reale
- `grep -n "^export function scarti" apps/*/​*-data.js`: 18 funzioni
  sorelle censite su sei app

## Stato roadmap
Nessuna voce di roadmap chiusa: è un lavoro di manutenzione della
ricerca stessa, che protegge dal tradurre in codice un delta che non
è più vero (la stessa famiglia di errore già pagata più volte in
questo repository con le ricerche fresche — qui capita a un documento
vecchio invece che a un giro appena tornato).

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. È in corso in background la
riverifica delle altre sette voci di D2. Quando torna:
1. Leggere la tabella finale e il conteggio (quanti "muti" restano
   veri su otto).
2. Se il numero è basso, valutare se vale la pena tradurre P1 in
   codice per le sole voci rimaste davvero mute (probabilmente
   `conti/pesate` e `conti/incassi`, dato il pattern già visto oggi
   su Conti con `scartiPesateCsv`/`scartiIncassiCsv` — da verificare,
   non dedurre).
3. Applicare la stessa riverifica anche a `docs/RICERCA_CONTINUA_
   PAROLE.md` (l'altro tema trasversale fermo al 04/09) prima di
   lanciarci sopra un lavoro nuovo.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
