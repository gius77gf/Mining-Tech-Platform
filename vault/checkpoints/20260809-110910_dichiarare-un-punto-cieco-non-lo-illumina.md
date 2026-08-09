# Checkpoint — 2026-08-09T11:09:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`42caae6`

## Task completato

**La roadmap dichiarava lo STESSO numero in tre valori diversi, e la riga che
avvertiva del punto cieco non l'aveva impedito.** Adesso è sorvegliata su tre
numeri.

| dove | diceva | è |
|---|---|---|
| riga di stato (Riferimenti) | 2.366 | **2.380** |
| racconto in fondo («Adesso…») | 2.370 | idem |
| racconto di mezzo | 2.371 | idem |
| esecuzioni del browser | 157 | **159** |
| file di banco distinti | 70 | **71** |

## La cosa imparata

⛔ **DICHIARARE UN PUNTO CIECO NON LO ILLUMINA.** In fondo alla roadmap stava
scritto, onestamente: *«qui il controllo non arriva, e l'aggiornamento è a
mano. Chi la legge lo sappia»*. Quella riga **era nata la prima volta che il
file era invecchiato** — «120 banchi» quando ne erano 147 — cioè era già la
correzione di questo stesso difetto. Non ha impedito la seconda volta, e la
seconda è stata peggiore della prima: non un numero vecchio, **tre valori
diversi dello stesso numero nello stesso file**.

⚠️ La ragione per cui una dichiarazione del genere non può funzionare è
geometrica: **chi incontra il numero non ha modo di sapere quando è stato
scritto, e l'avvertimento sta duecento righe più in basso di lui.** Un lettore
onesto e attento lo legge comunque sbagliato. Il costo di portare il file
dentro l'elenco è **una voce**; il costo di lasciarlo fuori l'ha appena pagato
il documento che il fondatore apre per primo.

⛔ **E DENTRO LA STESSA FRASE C'ERA UN NUMERO CHE NESSUNO GUARDAVA: i FILE di
banco distinti.** «159 esecuzioni da 71 file» sono due cifre diverse — le
esecuzioni contano anche le controprove, che sono una riga in più sullo stesso
file — e nei documenti stanno **attaccate**. Ne bastava una vecchia per far
dubitare dell'altra. Adesso sono contate tutt'e due dalla tabella `BANCHI`.
⚠️ Il nome del banco si prende dalla **prima** stringa `.mjs` della riga — il
posto dichiarato dal contratto `[nome, file, argomenti]` — non da tutte le
stringhe del blocco: un `.mjs` citato in un **commento** gonfierebbe il conto
senza lasciare niente da leggere. È la lezione dei commenti da togliere in
tutte le sintassi, applicata a un censimento.

⏱️ **E la terza forma d'invecchiamento applicata a noi**: «Adesso **2.370**,
otto suite» era vero l'08/08 sera ed è diventato falso in un giorno. **Un
racconto datato resta vero; un racconto che dice «adesso» diventa falso da
solo.** Riscritto in «Quella sera 2.370», col rimando alla riga viva.

## Verifiche
- `numeri-nei-documenti` **28 → 32 prove**, 4 documenti letti (era 3)
- **controprova coi tre difetti rimessi** (2.380→2.379, 159→158, 71→70):
  **tre KO, uno per controllo**, poi ripristino dalla copia + `diff -q`
- una prova sul **righello**: i file distinti devono restare **meno** delle
  esecuzioni — se coincidessero, il `Set` non starebbe deduplicando e
  guarderei due volte lo stesso numero credendo di guardarne due
- `giro-node` **34 comandi a posto, 0 caduti**, sul disco **e** sulla copia del
  committato

## Il giro del browser
Vivo dalle **06:56:09Z** su una copia di `494863f` (pid 2712, ~4h13). Registro
483 KB → **520 KB** in venti minuti, figlio vivo su `terra-numeri-tranquilli`.

## Cantieri paralleli aperti (direttiva 3)
Tre, su app diverse e senza toccare `shared/`: **Flotta** (secondo giro su «chi
decide i numeri di ciò che ESCE», poi i disegni), **Campo** (il principio del
fondatore a tappeto: che cosa dice ogni riepilogo quando il dato NON c'è),
**Sentinella** (il disegno che contraddice il numero, ai casi di confine —
lettura *pari* alla soglia, zero, assente). Nessuno di loro committa.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Poi: raccogliere i tre cantieri, **rimisurare** ogni difetto che riferiscono
prima di scriverlo da qualche parte (niente entra sulla parola dell'agente,
nemmeno accompagnata da uno scatto), e committare io.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2), **`#vf-ente`** (termine dell'art. 71 c.11), e la
scelta di **quali** delle 47 mancanze confermate diventino lavoro.
