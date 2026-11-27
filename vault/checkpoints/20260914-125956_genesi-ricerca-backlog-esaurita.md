# Checkpoint — 2026-09-14T12:59:56Z

## Tipo
unit-complete (revisione backlog di ricerca continua, solo documentazione)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

In attesa della risposta del fondatore sulla domanda CAD (ancora aperta,
vedi checkpoint `20260914-100055` e `vault/ULTIMO_CICLO.md`), ho
continuato a rileggere le ricerche già fatte in
`docs/RICERCA_CONTINUA_GENESI.md` per un delta pronto da chiudere, non
legato al CAD — lavoro esplicitamente non vietato mentre si aspetta.

Rilette sei sezioni, verificando il MECCANISMO nel codice (non fidandomi
del testo della ricerca né della sua assenza di una sezione "delta"):

1. **"Piano di tiro e il dopo-volata" (11/09)** — già chiusa (le quattro
   domande erano già risolte o dichiarate decisione del fondatore).
2. **"Esplosivi in cava" (11/09)** — già chiusa, stesso schema.
3. **"Limiti Kuz-Ram/powder factor" (12/09)** — già chiusa: verificato
   che `caricaDaX50Target` (genesi-data.js righe 1763-1793) e la sua UI
   (genesi.html righe 3631-3636) già portano `troppoFine`/
   `troppoGrossolano` con messaggi distinti, implementati il 12/09
   (unità 127) **citando questa stessa ricerca** come fonte.
4. **"Presplit e detonatori Nonel/elettronici" (12/09)** — già chiusa:
   le cinque domande del delta verificate una per una contro
   `genesi.html`/`genesi-data.js` (spaziatura/carica presplit già
   validate 8-14·Ø e 0,25-0,9 kg/m, coerenti col mondo; `INN_TAGLI` già
   dichiarato "di uso comune" non attribuito a un produttore; scatter
   già percentuale del tempo di riferimento, coerente col mondo;
   sicurezza da innesco accidentale già dichiarata fuori perimetro di
   Genesi dalla ricerca stessa).
5. **"Decking e air-decking" (12/09)** — **delta reale trovato**: il
   Decking non ha una riga di giudizio nella scheda validatori (a
   differenza del Presplit, che ce l'ha). **Non costruito**: i numeri
   della ricerca (risparmio 10-35%, ADF 0,10-0,35) riguardano
   specificamente l'**air-decking** (gap d'aria), un meccanismo fisico
   diverso dal decking **inerte** (borraggio solido fra deck) che Genesi
   già implementa — applicarli sarebbe la stessa famiglia di errore già
   raccolta in CLAUDE.md ("le due densità non sono la stessa cosa").
6. **"Criteri di scelta dell'esplosivo" (12/09)** — acqua, roccia e
   costo già implementati (acqua **oltre** la ricerca: avviso esplicito
   su mancata detonazione/fumi NOx con suggerimento di alternativa dal
   catalogo, righe 6226-6247). Il criterio diametro resta **candidato,
   non costruito**: la ricerca dà numeri per due categorie generiche
   contro un catalogo reale di **14 prodotti**
   (`apps/genesi/esplosivi.json`) — costruirlo userebbe dati assenti
   per undici voci su tredici.

Tutto scritto in coda a `docs/RICERCA_CONTINUA_GENESI.md` (tre note
datate), mai sovrascrivendo. Nessuna riga di codice toccata.

## Verificato

- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (il file toccato non
  è fra i documenti sorvegliati).
- Giro completo su worktree isolata (`git worktree add --detach HEAD` +
  `git diff --cached | git apply` + `git add -A`), poi
  `node apps/deepwork-id/tests/giro-node.mjs` dall'interno: **40 comandi
  a posto, 0 caduti**, 3909 asserzioni, addendi verificati uno per uno
  (2969+328+75+32+9+8+7+3+19).

## Stato roadmap

Nessuna voce nuova aperta: due candidati (diametro esplosivo vs
catalogo, air-decking come meccanismo distinto) restano dichiarati come
ricerche/decisioni future nel documento stesso, non in roadmap, perché
nessuno dei due ha oggi dati sufficienti per essere costruito senza
inventare numeri.

## Blocchi e limiti noti

Nessuno nuovo. Restano invariati: gate geometria/flyrock (founder,
DECISIONI_WEEKEND.md §6), soglie USBM/DIN (§9), e la domanda CAD ancora
aperta col fondatore.

## Prossimo passo atomico

Il backlog di ricerca continua su Genesi risulta ora sostanzialmente
esaurito (dieci sezioni rilette in questo blocco e nel precedente, tutte
chiuse o correttamente dichiarate come decisioni/ricerche future). Resta
da controllare, se serve altro lavoro prima che il fondatore risponda
sul CAD: le sezioni non ancora riverificate meccanismo-per-meccanismo
(import CAD/DXF 13/09, IREDES 13/09, Maptek/JKSimBlast e Orica/Maxam
13/09 — queste ultime due sono ricerca competitor, non hanno "domande
per il delta" per costruzione). In alternativa, tornare al fallback
della roadmap o attendere la prossima accensione della routine.

Nessuno stop volontario: si prosegue subito.
