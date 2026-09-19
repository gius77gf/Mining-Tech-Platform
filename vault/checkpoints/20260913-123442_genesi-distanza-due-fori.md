# Checkpoint — 2026-09-13T12:34:42Z

## Tipo
unit-complete (più una seconda ricerca di fianco)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f2759450`

## Completato

**1. Seconda ricerca di fianco (commit `f1353028`, già pushato)**: su un
argomento diverso per rotazione — il mestiere della cava applicato al
rapporto di volata (blast report): che cosa si aspetta davvero un
direttore responsabile, un ispettore o un'assicurazione. Trovato e
scritto in coda a `docs/RICERCA_CONTINUA_GENESI.md`, con fonti: norme
USA (MSHA/30 CFR 77.1908), pre-blast survey/post-blast inspection in
alcuni stati, requisiti tipici di un'assicurazione (progetto firmato,
dati vibrazionali, foto pre/post, "load-out" digitale), e il fatto che
nessun software commerciale genera un rapporto completo pronto per
ispettore/assicurazione — resta un'assemblatura manuale. Nessun delta
scritto (rispettata l'istruzione): quella lettura contro ciò che Genesi
già esporta spetta a chi ha il codice in mano.

**2. G34quinquies — distanza fra due fori qualunque**: ultimo pezzo del
disegno di precisione per questo blocco. "Vicino" nel pannello laterale
rispondeva sempre alla stessa domanda (il foro più prossimo); disegnare
due file distanti chiede la distanza fra due fori QUALUNQUE, scelti da
chi progetta. Nessuno strumento nuovo: si selezionano due fori in
sequenza (il precedente resta in `D2.selPrev`) e la distanza appare nel
pannello, senza un secondo click o una modalità diversa.

- `D2.selPrev` si azzera in OGNI punto dove l'array dei fori cambia
  forma (nuova maglia generata, volata caricata, foro cancellato) — non
  solo dove nasce un array nuovo: uno `splice` sposta tutti gli indici
  dopo quello tolto, quindi un indice vecchio dopo una cancellazione
  punterebbe a un ALTRO foro, non a "nessuno" (misurare una distanza dal
  foro sbagliato senza che nulla lo dica — trovato leggendo il codice
  prima di scrivere, non dopo).
- Verificato a schermo con Playwright: primo foro (nessuna distanza,
  corretto), secondo foro diverso ("dal foro 1: 19,52 m"), re-clic sullo
  stesso foro (la distanza resta — corretto, nessun motivo di sparire
  finché non si sceglie un terzo foro diverso).
- Nessuna funzione nuova (147 funzioni invariate).
- ⚠️ Effetto collaterale sul censimento statico: il commento
  esplicativo aggiunto a `d2Down` sposta il suo conteggio dal bucket
  "3-5" a "11+" — falso positivo del tokenizzatore sulle PAROLE del
  commento, non sul codice (la funzione legge sempre solo `D2`).
  Documento corretto di conseguenza: 16→15 nel bucket 3-5, 37→38
  nell'11+.

Verificato sulla **copia** (git worktree): `giro-node.mjs` → **40
comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato: solo
lettura/visualizzazione di posizioni già note, nessun calcolo nuovo.

Resta aperta la domanda posta al fondatore su "aspetto più
professionale in stile CAD" vs. "struttura identica al core".

## Prossimo passo atomico

Il disegno di precisione (parte 2 di "tutte e tre le alternative") è
ora completo per questo blocco: aggancio alla griglia (G34), coordinata
in chiaro (G34bis), quote a schermo per fori (G34ter) e per fronte/piede
(G34quater), distanza fra due fori qualunque (G34quinquies). Insieme
all'export DXF (G33, parte 1), restano coperte tecnicamente le prime
due delle tre alternative del fondatore; la terza (aspetto CAD) è
bloccata sulla tensione con "struttura identica al core" — item E7
della roadmap, preesistente, non ancora deciso.

Con le strade sicure e non-decisionali su Genesi ormai in gran parte
esplorate per questo blocco (estrazioni B3 rimaste sono safety-adjacent
o I/O-bound; disegno di precisione completo; aspetto CAD bloccato),
il prossimo ciclo dovrebbe:
1. Attendere la risposta del fondatore (sulla tensione CAD-vs-struttura
   o sulla segnalazione di sicurezza boretrack — le due ricerche di
   questo blocco sono materiale extra per quelle decisioni).
2. Nel frattempo, continuare con ricerca di fianco su altri argomenti
   della regola 1 (concorrenti di Genesi non ancora studiati a fondo,
   parole del mestiere) o con verifiche/rifiniture di qualità su ciò
   che è stato appena costruito (es. controllo a schermo che i nuovi
   controlli — bottone Griglia, passo, export DXF — si vedano bene
   anche nei temi chiaro/sole, non solo in quello scuro usato finora
   per gli screenshot).
Continuare senza fermarsi (regola del fondatore).
