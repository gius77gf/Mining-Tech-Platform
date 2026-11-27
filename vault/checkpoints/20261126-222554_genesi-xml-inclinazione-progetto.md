# Checkpoint — Genesi: il piano d'innesco XML porta l'inclinazione del progetto; decisione 35 scritta

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il piano d'innesco XML porta
l'inclinazione del progetto…»). Il precedente, `7d39a9de` (F6b), è
confermato dal giro `node` completo: 43 comandi a posto, 4416 asserzioni.

## Che cosa è stato fatto
- `xmlPianoInnesco` (`apps/genesi/genesi-data.js`): in `PlanData`, dopo il
  diametro, `<HoleInclination unit="deg">`. Esce se il chiamante dichiara
  l'inclinazione (anche zero), oppure — «non-calcolabile» — se non la
  dichiara ma un foro ne ha una sua. Se nessuno la dichiara, non esce.
  `DesignInclination` (nato e morto il 26/11) non si scrive più.
- Lettore del piano (`apps/genesi/genesi.html`): `HoleInclination` →
  `D2.incl` (0–30), con `DesignInclination` come ripiego; un piano senza la
  riga lascia l'inclinazione che c'è.
- ⛔ Cambio di formato dichiarato: ogni piano che esce dalla pagina ha una
  riga in più. I chiamanti che non passano `incl` (le prove di ieri) vedono
  l'uscita di sempre.
- Prove: il test F6b di `run-kpi` (3253, conto invariato: asserzioni dentro
  un test esistente), controprova 4 su 4; banco `genesi-foro-per-foro.mjs`
  170 → 172 (andata e ritorno dal bottone vero; il piano di ieri), 53
  iniezioni tutte sul bersaglio.
- Numeri nei documenti: invariati (3.753; giro 4416).

## Ricerca e decisione
- Ricerca di fianco (agente con `WebSearch`, solo il mondo) sulla «spalla al
  piede» dei fori inclinati: SOLO estratti, nessuna fonte primaria letta,
  lessico italiano non trovato. Archiviata in
  `docs/RICERCA_CONTINUA_GENESI.md` con ogni riga marcata «non verificato».
- Il delta l'ho fatto dal codice: Genesi non conosce la pendenza del fronte,
  quindi la spalla al piede non è calcolabile senza un'ipotesi o un campo
  nuovo. È la **decisione 35** in `docs/DECISIONI_WEEKEND.md` (tre strade).
  La voce di roadmap «il piede che esce dalla faccia» è in attesa di lei.

## Stato roadmap
Aperte per Genesi: `il report di volata non dice i fori con valori loro`
(nuova, la prossima), `il piede che esce dalla faccia` (in attesa della
decisione 35). In attesa del fondatore: decisioni 28, 33, 34, 35 (32
rimandata).

## Prossimo passo atomico — il report di volata dice i fori con valori loro
1. SOLA LETTURA della funzione che compone il report nella pagina (cerca
   `sec('Geometria',[[` in `apps/genesi/genesi.html`): le righe «Diametro
   foro», «Profondità / sottoperf.», «Borraggio», «Inclinazione» e «Carica
   per foro» stampano i valori del PROGETTO.
2. Nel modulo, una funzione pura (es. `foriPropriPerIlFoglio(holes,
   progetto)`) che da `tabellaFori(holes, progetto, {campo:'n'})` tiene i
   soli fori con almeno un valore proprio e restituisce, per ciascuno, il
   numero del foro e i cinque campi con la bandiera «suo» — più la frase di
   testa («3 fori su 12 hanno valori propri»). Vuoto se nessuno: il foglio
   di un progetto senza valori per foro resta IDENTICO (provarlo).
3. Nella pagina: sezione «Fori con valori propri» dopo «Carica & sequenza»
   (tabella: foro, carica, profondità, borraggio, diametro, inclinazione; i
   valori propri in grassetto, gli altri come sono), e accanto a «Carica per
   foro» / «Profondità» / … la nota «del progetto — N fori ne hanno una
   loro, vedi sotto» SOLO quando serve.
4. Prove: `run-kpi` (prima del riepilogo; il totale deve salire), banco
   `browser/genesi-documenti-che-escono.mjs` o `genesi-foro-per-foro.mjs`
   (aprire il foglio vero e leggerlo), scatto del foglio a 390 px guardato.
   Ogni controllo letto dal codice d'uscita.

## Blocchi
Nessuno tecnico.
