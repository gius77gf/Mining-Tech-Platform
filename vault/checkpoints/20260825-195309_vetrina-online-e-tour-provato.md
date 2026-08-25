# Checkpoint — 2026-08-25T19:53:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
28c7267f

## Completato
La vetrina nuova sostituisce la vecchia ed è pronta per `main` (PR #341).

1. **L'ellisse torna sul telefono.** La riga che l'aveva tolta diceva «a 390px
   erano 63 sovrapposizioni, e nessun raggio li fa stare»: misurata a corpo
   14px, cioè il carattere del desktop. A corpo 10–11,5px sono **zero**. Il
   raggio è una formula (`clamp(86px, 50vw - 54px, 148px)`, ry = rx·.95)
   perché un anello che gira porta il raggio lungo anche in orizzontale, quindi
   due vincoli si contendono lo spazio. Pulita a 1440·1024·430·390·375·360;
   a 320px resta la griglia, confine **misurato** (provato a tenerla fino a
   300px: non regge).
2. **Il moto continuo torna sul telefono.** Le «schermate statiche al ripasso»
   non erano un guasto — due righelli hanno mostrato che le immagini girano —
   ma una mia scelta: avevo spento tutto il movimento, e restava la sola
   animazione d'ingresso. Il lampeggio veniva dalle **dissolvenze**. Misurato
   nei due versi con CPU 4x: 41/399 fotogrammi lenti senza moto, 36/413 con.
3. **`tour-aperto.mjs`**: segue i nove collegamenti con un browser e guarda
   che cosa arriva a schermo. **9 su 9 aperte, 0 eccezioni** (il core incluso,
   col finto Firebase: un'eccezione che si può togliere si toglie).
4. **`servi.mjs`**: nove righelli della vetrina puntavano a un indirizzo morto
   dello scratchpad. `contrasto-foto` stampava «0 sotto soglia» su **zero
   soggetti**. Ora la porta si chiede al sistema e zero soggetti è NON MISURATO.
5. **L'indirizzo del sito**: `deepworksic.netlify.app`. Non era introvabile —
   lo dichiara Netlify nello **stato del commit** di ogni PR.

## Misure che valgono oltre il caso
- **Una conclusione è larga quanto il suo denominatore**: «nessun raggio li fa
  stare» valeva solo per il corpo con cui era stata presa.
- **Un righello che non ripete la stessa misura non sa dire se una correzione
  ha funzionato**: `corona-urti` campionava la rotazione dormendo, e dava 2 e
  3 sullo stesso commit. Mi ha mandato a rimpicciolire il marchio per niente.
- **Un righello deve sapere in che FORMA è il suo soggetto**: sotto il confine
  i nomi sono una griglia, e imporle la rotazione **produceva** il difetto.
- **Vince l'ultimo, anche dentro un `@media`**: la regola che rimpiccioliva il
  marchio perdeva contro una identica scritta più in basso, e non faceva
  niente in silenzio. Due misure buttate. Ora è una variabile.
- **Netlify riscrive gli href con l'estensione** (`genesi.html` → `genesi`):
  nessun righello di casa lo può vedere, e la domanda va rifatta online.

## Stato roadmap
Vetrina: consegnata e in PR. Giro node 37/37, 3.280 asserzioni.

## Prossimo passo atomico
Attendere il verde della CI su PR #341 e unire a `main`. Poi verificare la
produzione su `https://deepworksic.netlify.app/apps/` con `tour-aperto`
puntato **online** invece che sul server di casa — è l'unico posto dove si
vede la riscrittura degli href di Netlify, e oggi quel controllo non esiste.

## Blocchi
Nessuno.
