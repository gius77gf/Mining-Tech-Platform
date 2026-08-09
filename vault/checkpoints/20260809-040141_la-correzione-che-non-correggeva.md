# Checkpoint — 2026-08-09T04:01:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2cda76e`

## Task completato

**La riverifica dei KO del giro**, e il primo tentativo di correzione — che
**non ha corretto niente ed è stato ripristinato**.

## Le tre cose imparate

1. ✅ **LA SOTTRAZIONE DELL'ETÀ HA PAGATO AL PRIMO GIRO IN CUI SERVIVA.** I due
   KO sul CSV dei costi di Conti: **già chiusi** (81 passati, 0 falliti, 12
   punti d'uscita su 12). Erano veri a `7cddb59` e li ha chiusi il lavoro sulle
   voci senza importo. Le 5 tendine di Scudo: **ancora vere, 5 su 5**. Due
   fronti, due risposte opposte — ed è esattamente perché la sezione 0 esiste.
2. ⛔ **LA PROVA IN SCRATCHPAD HA VERIFICATO LA FUNZIONE, NON I SUOI DATI — ed
   è lì che stava l'errore.** Avevo scritto la strada in roadmap («togliere ciò
   che è identico fra tutte le voci», calcolando il prefisso comune), l'ho
   provata su **sei casi**, tutti corretti, l'ho messa nella pagina… e il banco
   ha ridato gli **stessi 5 KO, identici**. Il motivo stava **una riga più su
   nel codice**: `docOrd` non sono i verbali, è `DOC` — **tutti** i documenti,
   solo ordinati coi verbali davanti. Il prefisso comune fra «DVR», «POS» e
   «Verbale verifica periodica — …» è **vuoto**: la funzione faceva
   correttamente niente. Il prefisso lo condividono i due verbali **fra loro**,
   non con la lista.
   Avevo **dedotto la premessa dai due KO** invece di leggerla dal codice. La
   prova in scratchpad non poteva prenderlo: provava la funzione con i dati che
   le davo io.
3. ⛔ **UN CODICE CHE MISURABILMENTE NON FA NIENTE È PEGGIO DEL DIFETTO CHE
   RESTA APERTO**, e dentro una modale di conformità doppiamente. Ripristinato
   (`git checkout` su quel file solo, con l'albero per il resto **pulito e
   spinto** — verificato prima).
   ⚠️ E nel farlo è saltato fuori un difetto duro preso dal giro `node` in tre
   secondi: avevo aperto il suggerimento come **template literal** lasciandogli
   la **chiusura a singolo apice**. La stringa non si chiudeva più e il parser
   moriva **300 righe dopo**, su una riga sana. `sintassi-pagine`: 33/1 → dopo
   la correzione 34/0.

## La strada vera, per chi la riprende
Il banco misura la voce **selezionata a tendina CHIUSA**, e un `<select>` chiuso
**non manda a capo**: con un titolo lungo taglierà **sempre**, qualunque cosa si
tolga dal testo. Quindi non si combatte la piattaforma — la parte che distingue
va messa dove si può leggere: **un suggerimento sotto il campo col titolo intero
del documento scelto**, aggiornato al cambio.
⚠️ Ma attenzione: **quel suggerimento da solo NON fa passare il banco**, perché
il KO è sul `<select>`. Le due strade vanno decise insieme, ed è una scelta di
prodotto: o si accorcia ciò che entra nell'`<option>` (tenendo la **coda**, che
è ciò che distingue) fino a stare in **284 px a 390 e 214 px a 320**, oppure si
insegna al banco che una voce tagliata è accettabile **quando il titolo intero è
leggibile lì accanto**. La seconda cambia uno standard: non la prendo da solo.
⚠️ `#vf-ente` è un caso a parte e **non si tocca senza il fondatore**:
«Soggetto pubblico o privato abilitato» è il termine dell'**art. 71 c.11**.

## Verifiche
- `conti-documenti-che-escono` 81/0 · `modali-dentro --solo=scudo` 5 KO prima e
  5 dopo (la misura che ha bocciato la correzione)
- `sintassi-pagine` 34/0 dopo il ripristino · albero pulito

## Stato roadmap
I 20 KO: **2 chiusi**, **5 confermati veri** (con la diagnosi corretta e le due
strade), **13 da riverificare** — Genesi 4, Campo 6, Conti 1, Sentinella 2.

## Prossimo passo atomico
**Riverificare i 13 rimasti**, un banco alla volta e sul commit di adesso:
`genesi-piano-innesco` / `punti-nuvola` (4), `campo-foglio-turno` (3),
`stati-non-misurati --solo=campo` (2), `promesse-tocco --solo=campo` (1),
`conti-barre-peso` (1), `modali-dentro --solo=sentinella` (2).
⛔ Prima di ogni cantiere: il KO va **riprodotto adesso**, come si è fatto per
Conti (già chiuso) e Scudo (ancora vero). Due su sette fronti hanno già
cambiato risposta in trentanove commit.

## Blocchi
Nessuno.
