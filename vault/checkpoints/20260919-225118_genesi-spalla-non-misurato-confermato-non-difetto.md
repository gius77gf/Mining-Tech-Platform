# Checkpoint — 2026-09-19T22:51:18Z

## Tipo
verifica (nessun codice), chiusura di un'indagine

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
01e641c5 (fix(genesi): Ruota/Scala tratti restavano visibili durante il disegno)

## Cosa è stato completato
Seguendo il "prossimo passo atomico" del checkpoint precedente: capire
perché `genesi-campi-assenti.mjs` dichiara «NON MISURATI (2): la
spalla..., la spalla che non decide...».

- [x] **Riprodotto in isolamento** (non solo nel batch sotto carico):
  stesso esito, quindi non è flakiness da carico parallelo.
- [x] **Causa isolata con Playwright**: aprendo un progetto salvato con
  `B` (spalla) assente, `body.className` è correttamente `scr-design`
  (la navigazione riesce), zero errori pagina, ma `#d2-scheda .sv-row`
  resta a **zero** anche dopo secondi di attesa extra — non è un
  problema di timing.
- [x] **La risposta era già scritta nel file stesso**, in un commento
  del 14/09 (blocco "B0-septies") che avevo semplicemente non ancora
  letto quando ho aperto l'indagine: `apriSenza("B")` fa scattare
  `D2.magliaAssente='burden'` con `D2.holes=[]`, e `renderScheda2D` esce
  PRIMA di disegnare qualunque riga — cioè il prodotto dichiara
  correttamente "maglia non disegnabile" invece di inventare una scheda,
  ed è il comportamento GIUSTO, già verificato a parte dal banco
  "la maglia assente di Genesi non si disegna (B0-septies)" (letto nel
  batch di ieri: tutto pulito, "B assente: zero fori disegnati, la
  ragione dichiarata è burden, la scheda nomina la ragione").
  `vivaEsana()` (che pretende >20 righe) risponde `false` per
  costruzione con questo scenario, e il banco dichiara onestamente "non
  misurato" — ESATTAMENTE come il commento del 14/09 prescrive di fare,
  invece di riscrivere il test alla cieca.
- [x] **Nessuna azione presa**: non è un difetto di prodotto (il
  comportamento è corretto e già testato altrove), non è un test da
  riscrivere (chi l'ha scritto il 14/09 ha già valutato l'alternativa —
  uno scenario con B che sparisce DOPO che i fori esistono — e l'ha
  lasciata come domanda aperta, gated dietro una decisione del fondatore
  su un caso d'uso, sezione 6 di DECISIONI_WEEKEND.md, non presa qui).
  Riscriverlo ora senza un nuovo elemento sarebbe esattamente "un test
  riscritto senza aver capito se il caso che difendeva è ancora
  raggiungibile" — il difetto che il commento stesso mette in guardia.
- [x] Confermato che questo È il caso della regola di questo file:
  **"la risposta è quasi sempre già in casa — si cerca prima di
  inventare"**. Ho speso tempo a riprodurre un difetto che era già
  spiegato, con tanto di data e blocco nominato, nello stesso file che
  stavo leggendo. La lezione pratica: quando un banco dichiara "NON
  MISURATO" con una frase tra parentesi che nomina la causa (qui:
  "una delle due schede non si è aperta, o la pagina ha errori"), si
  legge PRIMA il commento sopra la sezione, non si riproduce da zero.

## Verifica prima del commit
Nessun codice toccato: solo lettura, e questo checkpoint.

## Stato roadmap
Tutti e 22 i "da guardare" del batch dopo G58/G59 sono ora risolti: 20
controprove funzionanti (nessuna azione), 1 "non misurato" confermato
corretto-così-com'è (questo), 1 difetto vero corretto (`syncTrattoUI`,
commit 01e641c5).

## Prossimi passi
- **Prossimo passo atomico**: proseguire con una nuova unità verificata
  di persona su Genesi (grep/lettura del codice + Playwright mirato),
  visto che il batch è stato letto e chiuso per intero. Nessun batch
  --solo=genesi da rilanciare subito: si può rilanciare a fine blocco,
  come indicato dalla regola sui costi della verifica.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
